-- Putthink schema + RLS (run in Supabase SQL editor)
-- See Putthink_Site_Cursor_Prompt.md §5

create table if not exists profiles (
  id uuid primary key references auth.users(id),
  free_runs_balance int not null default 9,
  referred_by uuid references profiles(id),
  created_at timestamptz default now()
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
  amount int not null,
  reason text not null check (reason in ('invite_subscribed','hof_winner')),
  related_id uuid,
  created_at timestamptz default now()
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

-- contact / press / data room request: insert only from anon
create policy "contact_insert" on contact_messages for insert with check (true);
create policy "press_insert" on press_kit_downloads for insert with check (true);
create policy "data_room_req_insert" on data_room_requests for insert with check (true);

-- traction_metrics: only for approved data-room users (wire via custom claim / join later)
-- Placeholder: authenticated select; tighten after approval flag on profiles
create policy "traction_select_auth" on traction_metrics for select
  using (auth.role() = 'authenticated');

-- Storage bucket for showcase videos (create in dashboard): putt-showcase
