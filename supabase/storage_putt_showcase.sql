-- Create Storage bucket + RLS for Putthink showcase video uploads
-- Run once in Supabase SQL Editor
--
-- App path convention (required by RLS):
--   putt-showcase/{auth.uid()}/{uuid}.mp4
-- Public URL example:
--   {SUPABASE_URL}/storage/v1/object/public/putt-showcase/{uid}/{file}.mp4

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
create policy "putt_showcase_select_own"
on storage.objects for select
to authenticated
using (
  bucket_id = 'putt-showcase'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

-- Signed-in users upload only under their own uid folder
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
