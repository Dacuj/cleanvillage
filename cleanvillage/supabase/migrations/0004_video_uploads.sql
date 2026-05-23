-- CleanVillage — Video upload tuning
-- Run this in the Supabase SQL editor after 0001_init.sql.
-- It lifts the default 50 MB cap on the `videos` storage bucket so the admin
-- can upload typical promotional videos, and tightens the MIME types so the
-- bucket only accepts video files. Also adds a delete policy on
-- video-thumbnails (missing from the initial schema).

-- 1) Allow video files up to 200 MB.
update storage.buckets
set
  file_size_limit = 209715200,  -- 200 MB
  allowed_mime_types = array['video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska', 'video/ogg']
where id = 'videos';

-- 2) Thumbnails up to 4 MB.
update storage.buckets
set
  file_size_limit = 4194304,  -- 4 MB
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'video-thumbnails';

-- 3) Allow authenticated users to delete/update thumbnails (missing from 0001).
do $$ begin
  create policy "auth update video-thumbnails" on storage.objects for update
    using (bucket_id = 'video-thumbnails' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "auth delete video-thumbnails" on storage.objects for delete
    using (bucket_id = 'video-thumbnails' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
