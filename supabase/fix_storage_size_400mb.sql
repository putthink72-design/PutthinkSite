-- Bump putt-showcase per-file size limit: 200 MB → 400 MB
-- Run in Supabase SQL Editor

update storage.buckets
set file_size_limit = 419430400 -- 400 MB
where id = 'putt-showcase';
