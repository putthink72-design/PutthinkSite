-- Fix Security Advisor: Public Bucket Allows Listing (putt-showcase)
-- Public object URLs keep working; remove broad SELECT that enabled listing.
-- Run in Supabase SQL Editor

drop policy if exists "putt_showcase_public_read" on storage.objects;
drop policy if exists "putt_showcase_select_own" on storage.objects;

-- Own-folder SELECT only (needed for upsert / managing own uploads)
create policy "putt_showcase_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'putt-showcase'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
