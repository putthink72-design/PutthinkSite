-- Data Room magic-link workflow (run after schema.sql)
alter table data_room_requests
  add column if not exists magic_link_sent_at timestamptz;

alter table data_room_requests
  add column if not exists reviewed_at timestamptz;

alter table data_room_requests
  add column if not exists review_note text;

create index if not exists data_room_requests_status_created_idx
  on data_room_requests (status, created_at desc);

create index if not exists data_room_requests_email_lower_idx
  on data_room_requests (lower(email));

-- Approved emails may read traction metrics (tighten beyond authenticated-only)
drop policy if exists "traction_select_auth" on traction_metrics;
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

-- Authenticated users may see their own request row (status only)
drop policy if exists "data_room_req_select_own" on data_room_requests;
create policy "data_room_req_select_own"
on data_room_requests for select
to authenticated
using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
