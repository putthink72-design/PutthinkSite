-- Fix Security Advisor: "RLS Policy Always True" on public form tables
-- Run once in Supabase SQL Editor (after prior schema apply)

drop policy if exists "contact_insert" on contact_messages;
drop policy if exists "press_insert" on press_kit_downloads;
drop policy if exists "data_room_req_insert" on data_room_requests;

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

create policy "data_room_req_insert" on data_room_requests for insert
  with check (
    char_length(trim(email)) between 3 and 320
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and char_length(trim(organization)) between 1 and 300
    and char_length(trim(coalesce(phone, ''))) between 7 and 40
    and coalesce(status, 'pending') = 'pending'
    and approved_at is null
  );
