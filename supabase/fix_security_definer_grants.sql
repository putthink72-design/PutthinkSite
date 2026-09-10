-- Fix Security Advisor: SECURITY DEFINER callable by public / signed-in users
-- Run in Supabase SQL Editor

-- Drop client-callable like RPC (replaced by RLS insert/delete + trigger)
drop function if exists public.toggle_showcase_like(uuid);

-- Trigger-only: sync likes_count
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

-- handle_new_user: trigger only
revoke all on function public.handle_new_user() from public;
revoke all on function public.handle_new_user() from anon, authenticated;
grant execute on function public.handle_new_user() to postgres, service_role;

-- induct_hof_month: service_role only
revoke all on function public.induct_hof_month(date) from public;
revoke all on function public.induct_hof_month(date) from anon, authenticated;
grant execute on function public.induct_hof_month(date) to service_role;
