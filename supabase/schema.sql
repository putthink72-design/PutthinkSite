-- Putthink schema + RLS (run in Supabase SQL editor)
-- See Putthink_Site_Cursor_Prompt.md §5

create table if not exists profiles (
  id uuid primary key references auth.users(id),
  -- init: organic=3, invited (referred_by set)=6 — never client-update
  free_runs_balance int not null default 3,
  referred_by uuid references profiles(id),
  device_claim_token text unique, -- iOS Keychain device token (abuse guard)
  free_tier_claimed boolean not null default false,
  free_tier_source text check (free_tier_source in ('organic','invited')),
  display_nickname text, -- auto [golf]+[animal]+[4digits] or user edit
  created_at timestamptz default now()
);

create table if not exists invite_codes (
  code text primary key,
  user_id uuid not null unique references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint invite_codes_code_format check (code ~ '^[0-9A-Za-z]{8}$')
);

create table if not exists putt_showcase (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  video_url text not null,
  -- 퍼팅 종류 (앱에서 선택)
  category text not null check (category in ('long_putt','multi_break','recovery','first_holed')),
  -- 업로드 시 앱에서 입력 (닉네임은 Apple/Google ID 연동값 또는 직접 입력)
  nickname text not null,
  caption text not null,
  club_name text not null,   -- 골프장명
  course_name text not null, -- 코스명
  hole_number int not null check (hole_number between 1 and 18),
  likes_count int not null default 0,
  created_at timestamptz default now()
);

create table if not exists showcase_likes (
  showcase_id uuid references putt_showcase(id) not null,
  user_id uuid references profiles(id) not null,
  created_at timestamptz default now(),
  primary key (showcase_id, user_id)
);

create table if not exists hall_of_fame (
  id uuid primary key default gen_random_uuid(),
  period date not null unique,
  showcase_id uuid references putt_showcase(id) not null,
  created_at timestamptz default now()
);

create table if not exists credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  amount int not null, -- invite free-tier reward: +3
  reason text not null check (reason in ('invite_subscribed','hof_winner')),
  related_id uuid,
  created_at timestamptz default now()
);

-- Invite rewards audit (lifetime once per inviter↔invitee pair)
create table if not exists invite_rewards (
  id uuid primary key default gen_random_uuid(),
  inviter_id uuid references profiles(id) not null,
  invitee_id uuid references profiles(id) not null,
  reward_type text not null check (reward_type in ('credit_3','promo_offer_1week')),
  granted_at timestamptz default now(),
  unique (inviter_id, invitee_id)
);

create table if not exists field_tests (
  id uuid primary key default gen_random_uuid(),
  test_no int not null unique,
  test_date date not null,
  total_putts int not null,
  holed int not null,
  conceded int not null,
  video_url text,
  created_at timestamptz default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

create table if not exists press_kit_downloads (
  id uuid primary key default gen_random_uuid(),
  email text,
  organization text,
  downloaded_at timestamptz default now()
);

create table if not exists data_room_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  organization text not null,
  role text,
  message text,
  status text default 'pending' check (status in ('pending','approved','denied')),
  approved_at timestamptz,
  magic_link_sent_at timestamptz,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz default now()
);

create table if not exists traction_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_date date not null,
  country text not null,
  downloads int default 0,
  dau int default 0,
  mau int default 0,
  trial_starts int default 0,
  paid_subs int default 0,
  mrr_usd numeric default 0,
  created_at timestamptz default now(),
  unique(metric_date, country)
);

-- RLS
alter table profiles enable row level security;
alter table putt_showcase enable row level security;
alter table showcase_likes enable row level security;
alter table hall_of_fame enable row level security;
alter table credit_ledger enable row level security;
alter table invite_codes enable row level security;
alter table invite_rewards enable row level security;
alter table field_tests enable row level security;
alter table contact_messages enable row level security;
alter table press_kit_downloads enable row level security;
alter table data_room_requests enable row level security;
alter table traction_metrics enable row level security;

-- putt_showcase: public read, auth insert
create policy "showcase_select_anon" on putt_showcase for select using (true);
create policy "showcase_insert_auth" on putt_showcase for insert
  with check (auth.uid() = user_id);

-- hall_of_fame / field_tests: public read
create policy "hof_select_anon" on hall_of_fame for select using (true);
create policy "field_tests_select_anon" on field_tests for select using (true);

-- profiles: users read own; free_runs_balance never client-updated
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);

create policy "invite_codes_select_own" on invite_codes for select
  using (auth.uid() = user_id);

create unique index if not exists profiles_display_nickname_unique
  on profiles (display_nickname)
  where display_nickname is not null;

-- Nickname / non-balance profile fields only (do not raise free_runs from client).
drop policy if exists "profiles_update_own_nickname" on profiles;
create policy "profiles_update_own_nickname"
on profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- credit_ledger / invite_rewards: client read-own only; writes via service role (Edge Functions)
create policy "credit_ledger_select_own" on credit_ledger for select
  using (auth.uid() = user_id);
create policy "invite_rewards_select_own" on invite_rewards for select
  using (auth.uid() = inviter_id or auth.uid() = invitee_id);

-- showcase_likes: public read; auth users like/unlike as themselves
create policy "showcase_likes_select_anon" on showcase_likes for select using (true);
create policy "showcase_likes_insert_auth" on showcase_likes for insert
  with check (auth.uid() = user_id);
create policy "showcase_likes_delete_own" on showcase_likes for delete
  using (auth.uid() = user_id);

-- Public form inserts: validate payload (not WITH CHECK (true) — Security Advisor)
-- No SELECT/UPDATE/DELETE for anon on these tables
create policy "contact_insert" on contact_messages for insert
  with check (
    char_length(trim(name)) between 1 and 200
    and char_length(trim(email)) between 3 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(trim(message)) between 1 and 5000
  );

create policy "press_insert" on press_kit_downloads for insert
  with check (
    email is null
    or (
      char_length(trim(email)) between 3 and 320
      and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    )
  );

-- Clients may only create pending requests (cannot self-approve)
create policy "data_room_req_insert" on data_room_requests for insert
  with check (
    char_length(trim(email)) between 3 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(trim(organization)) between 1 and 300
    and coalesce(status, 'pending') = 'pending'
    and approved_at is null
  );

-- traction_metrics: approved Data Room emails only (see data_room_magic_link.sql for full policy)
drop policy if exists "traction_select_auth" on traction_metrics;
drop policy if exists "traction_select_approved" on traction_metrics;
create policy "traction_select_approved"
on traction_metrics for select
to authenticated
using (
  exists (
    select 1
    from data_room_requests r
    where r.status = 'approved'
      and lower(r.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

-- ---------------------------------------------------------------------------
-- Storage: putt-showcase (app uploads; public read for website feed)
-- Object path MUST be: {auth.uid()}/{filename}.mp4|mov
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'putt-showcase',
  'putt-showcase',
  true,
  419430400, -- 400 MB
  array['video/mp4', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "putt_showcase_public_read" on storage.objects;
drop policy if exists "putt_showcase_select_own" on storage.objects;
drop policy if exists "putt_showcase_insert_own" on storage.objects;
drop policy if exists "putt_showcase_update_own" on storage.objects;
drop policy if exists "putt_showcase_delete_own" on storage.objects;

-- No broad public SELECT (avoids "Public Bucket Allows Listing").
-- Public object URLs still work because the bucket is public=true.
-- Authenticated users may read/list only their own folder (upsert/own management).
create policy "putt_showcase_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'putt-showcase'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "putt_showcase_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'putt-showcase'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "putt_showcase_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'putt-showcase'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'putt-showcase'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "putt_showcase_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'putt-showcase'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Also run: supabase/rpc_showcase_hof.sql (profile trigger, like RPC, HoF induction)
