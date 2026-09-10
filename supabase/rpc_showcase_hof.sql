-- Profiles on signup + likes_count trigger + monthly HoF induction
-- Run in Supabase SQL Editor after schema.sql
-- SECURITY DEFINER functions are NOT executable by anon/authenticated
-- (except via triggers / service_role).

-- ---------------------------------------------------------------------------
-- Auto-create profile when auth user is created (Apple/Google/etc.)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
grant execute on function public.handle_new_user() to postgres, service_role;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Sync likes_count via trigger (clients insert/delete showcase_likes only)
-- ---------------------------------------------------------------------------
create or replace function public.sync_showcase_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sid uuid;
begin
  sid := coalesce(new.showcase_id, old.showcase_id);
  update public.putt_showcase s
  set likes_count = (
    select count(*)::int from public.showcase_likes l where l.showcase_id = sid
  )
  where s.id = sid;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function public.sync_showcase_likes_count() from public;
revoke all on function public.sync_showcase_likes_count() from anon, authenticated;
grant execute on function public.sync_showcase_likes_count() to postgres, service_role;

drop trigger if exists trg_showcase_likes_sync on public.showcase_likes;
create trigger trg_showcase_likes_sync
  after insert or delete on public.showcase_likes
  for each row execute function public.sync_showcase_likes_count();

-- Remove old SECURITY DEFINER RPC (clients must not call it)
drop function if exists public.toggle_showcase_like(uuid);

-- ---------------------------------------------------------------------------
-- Induct previous calendar month's #1 into hall_of_fame (+ credit)
-- Call only via service_role / Edge Function
-- ---------------------------------------------------------------------------
create or replace function public.induct_hof_month(p_month date)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  month_start date := date_trunc('month', p_month)::date;
  month_end date := (date_trunc('month', p_month) + interval '1 month')::date;
  winner_id uuid;
  winner_user uuid;
  hof_id uuid;
begin
  if exists (select 1 from public.hall_of_fame where period = month_start) then
    select id into hof_id from public.hall_of_fame where period = month_start;
    return hof_id;
  end if;

  select s.id, s.user_id
  into winner_id, winner_user
  from public.putt_showcase s
  where s.created_at >= month_start
    and s.created_at < month_end
  order by s.likes_count desc, s.created_at asc
  limit 1;

  if winner_id is null then
    return null;
  end if;

  insert into public.hall_of_fame (period, showcase_id)
  values (month_start, winner_id)
  returning id into hof_id;

  update public.profiles
  set free_runs_balance = free_runs_balance + 3
  where id = winner_user;

  insert into public.credit_ledger (user_id, amount, reason, related_id)
  values (winner_user, 3, 'hof_winner', hof_id);

  return hof_id;
end;
$$;

revoke all on function public.induct_hof_month(date) from public;
revoke all on function public.induct_hof_month(date) from anon, authenticated;
grant execute on function public.induct_hof_month(date) to service_role;
