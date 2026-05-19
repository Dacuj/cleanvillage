-- CleanVillage — Landing page CMS (site_content) + image storage bucket.
-- Run this after 0001_init.sql in the Supabase SQL editor.

-- ============================================================
-- TABLE: site_content
-- Singleton row (id = 1) holding the whole landing JSON tree.
-- ============================================================
create table if not exists site_content (
  id          int primary key default 1,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz default now(),
  updated_by  uuid references auth.users(id),
  constraint site_content_singleton check (id = 1)
);

-- Ensure the singleton row exists.
insert into site_content (id, data) values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Reuse the set_updated_at() trigger function created in 0001_init.sql.
do $$ begin
  create trigger trg_site_content_updated
    before update on site_content
    for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- Public can read (the storefront uses anon key); only authenticated
-- admin users can write.
-- ============================================================
alter table site_content enable row level security;

do $$ begin
  create policy "public read site_content"   on site_content for select using (true);
  create policy "auth insert site_content"   on site_content for insert with check (auth.role() = 'authenticated');
  create policy "auth update site_content"   on site_content for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ============================================================
-- STORAGE BUCKET: landing-images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('landing-images', 'landing-images', true)
on conflict (id) do nothing;

do $$ begin
  create policy "public read landing-images" on storage.objects for select
    using (bucket_id = 'landing-images');
  create policy "auth write landing-images" on storage.objects for insert
    with check (bucket_id = 'landing-images' and auth.role() = 'authenticated');
  create policy "auth update landing-images" on storage.objects for update
    using (bucket_id = 'landing-images' and auth.role() = 'authenticated');
  create policy "auth delete landing-images" on storage.objects for delete
    using (bucket_id = 'landing-images' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
