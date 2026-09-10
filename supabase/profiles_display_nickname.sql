-- profiles.display_nickname: device/auto or user-edited showcase identity
-- Run in Supabase SQL Editor after schema.sql

alter table profiles
  add column if not exists display_nickname text;

create unique index if not exists profiles_display_nickname_unique
  on profiles (display_nickname)
  where display_nickname is not null;

-- Authenticated users may update only their own nickname (not free_runs_balance).
drop policy if exists "profiles_update_own_nickname" on profiles;
create policy "profiles_update_own_nickname"
on profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);
