-- Invite feature V1 (link + claim). Run in Supabase SQL Editor.
-- Unifies device_claim_token; adds invite_codes; one reward per inviter/invitee pair.

-- 1) device_keychain_id → device_claim_token
alter table profiles
  add column if not exists device_claim_token text;

update profiles
set device_claim_token = device_keychain_id
where device_claim_token is null
  and device_keychain_id is not null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'device_keychain_id'
  ) then
    alter table profiles drop constraint if exists profiles_device_keychain_id_key;
    alter table profiles drop column device_keychain_id;
  end if;
end $$;

create unique index if not exists profiles_device_claim_token_unique
  on profiles (device_claim_token)
  where device_claim_token is not null;

-- 2) Short invite codes (one per user, forever)
create table if not exists invite_codes (
  code text primary key,
  user_id uuid not null unique references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint invite_codes_code_format check (code ~ '^[0-9A-Za-z]{8}$')
);

alter table invite_codes enable row level security;

drop policy if exists "invite_codes_select_own" on invite_codes;
create policy "invite_codes_select_own"
on invite_codes for select
to authenticated
using (auth.uid() = user_id);

-- Inserts via Edge Function (service role). No client insert.

-- 3) One reward per inviter↔invitee pair (credit or promo — next sprint)
create unique index if not exists invite_rewards_pair_unique
  on invite_rewards (inviter_id, invitee_id);
