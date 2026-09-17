-- Add phone to Data Room access requests (run in Supabase SQL Editor)
alter table data_room_requests
  add column if not exists phone text;

drop policy if exists "data_room_req_insert" on data_room_requests;
create policy "data_room_req_insert" on data_room_requests for insert
  with check (
    char_length(trim(email)) between 3 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(trim(organization)) between 1 and 300
    and char_length(trim(coalesce(phone, ''))) between 7 and 40
    and coalesce(status, 'pending') = 'pending'
    and approved_at is null
  );
