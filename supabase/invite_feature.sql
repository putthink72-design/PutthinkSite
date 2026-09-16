-- Invite feature V1 — paste all into Supabase SQL Editor and Run once.

alter table profiles
  add column if not exists device_claim_token text;

create unique index if not exists profiles_device_claim_token_unique
  on profiles (device_claim_token)
  where device_claim_token is not null;

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

create unique index if not exists invite_rewards_pair_unique
  on invite_rewards (inviter_id, invitee_id);
