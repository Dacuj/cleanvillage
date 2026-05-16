-- CleanVillage — Initial schema
-- Run this in the Supabase SQL editor after creating a new project.
-- After running, also run seed.sql to populate initial data.

-- ============================================================
-- ENUMS
-- ============================================================
do $$ begin
  create type stock_status as enum ('in', 'low', 'out');
exception when duplicate_object then null; end $$;

do $$ begin
  create type video_status as enum ('live', 'draft', 'scheduled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type quote_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');
exception when duplicate_object then null; end $$;

-- ============================================================
-- TABLES
-- ============================================================
create table if not exists categories (
  id            text primary key,
  label         text not null,
  short         text,
  kind          text,
  icon          text,
  description   text,
  sort_order    int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists brands (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  logo_url      text,
  weight        int default 500,
  italic        boolean default false,
  letter        text,
  sort_order    int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create table if not exists products (
  id              text primary key,
  name            text not null,
  sku             text not null unique,
  brand           text not null,
  category_id     text references categories(id) on delete set null,
  kind            text,
  price           text,
  stock           stock_status default 'in',
  count           int default 0,
  badge           text,
  description     text,
  specs           jsonb default '[]'::jsonb,
  is_highlighted  boolean default false,
  is_featured     boolean default false,
  sort_order      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_brand_idx on products(brand);

create table if not exists product_images (
  id            uuid primary key default gen_random_uuid(),
  product_id    text not null references products(id) on delete cascade,
  url           text not null,
  storage_path  text,
  alt_text      text,
  sort_order    int default 0,
  is_primary    boolean default false,
  created_at    timestamptz default now()
);

create index if not exists product_images_product_idx on product_images(product_id);

create table if not exists videos (
  id              text primary key,
  title           text not null,
  description     text,
  spot            text,
  duration        text,
  size            text,
  file_url        text,
  storage_path    text,
  thumbnail_url   text,
  status          video_status default 'draft',
  product_id      text references products(id) on delete set null,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table if not exists courses (
  id            text primary key,
  title         text not null,
  level         text,
  duration      text,
  mode          text,
  next_date     text,
  price         text,
  description   text,
  kind          text,
  bg            text,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

create table if not exists industries (
  id            text primary key,
  label         text not null,
  icon          text,
  description   text,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

create table if not exists quotes (
  id            uuid primary key default gen_random_uuid(),
  company       text,
  vat           text,
  contact_name  text,
  email         text,
  phone         text,
  message       text,
  needs         jsonb default '[]'::jsonb,
  timeline      text,
  attachments   jsonb default '[]'::jsonb,
  status        quote_status default 'new',
  created_at    timestamptz default now()
);

create index if not exists quotes_status_idx on quotes(status);
create index if not exists quotes_created_idx on quotes(created_at desc);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$ begin
  create trigger trg_categories_updated before update on categories for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger trg_brands_updated before update on brands for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger trg_products_updated before update on products for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger trg_videos_updated before update on videos for each row execute function set_updated_at();
exception when duplicate_object then null; end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table categories     enable row level security;
alter table brands         enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;
alter table videos         enable row level security;
alter table courses        enable row level security;
alter table industries     enable row level security;
alter table quotes         enable row level security;

-- Public read for catalog tables (anyone with anon key)
do $$ begin
  create policy "public read categories"     on categories     for select using (true);
  create policy "public read brands"         on brands         for select using (true);
  create policy "public read products"       on products       for select using (true);
  create policy "public read product_images" on product_images for select using (true);
  create policy "public read videos"         on videos         for select using (status = 'live');
  create policy "public read courses"        on courses        for select using (true);
  create policy "public read industries"     on industries     for select using (true);
exception when duplicate_object then null; end $$;

-- Authenticated users (admin) full access
do $$ begin
  create policy "auth all categories"     on categories     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  create policy "auth all brands"         on brands         for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  create policy "auth all products"       on products       for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  create policy "auth all product_images" on product_images for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  create policy "auth all videos"         on videos         for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  create policy "auth all courses"        on courses        for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
  create policy "auth all industries"     on industries     for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Quotes: anyone can insert (contact form), authenticated can read/update
do $$ begin
  create policy "public insert quotes" on quotes for insert with check (true);
  create policy "auth read quotes"     on quotes for select using (auth.role() = 'authenticated');
  create policy "auth update quotes"   on quotes for update using (auth.role() = 'authenticated');
  create policy "auth delete quotes"   on quotes for delete using (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public)
values
  ('product-images',    'product-images',    true),
  ('brand-logos',       'brand-logos',       true),
  ('category-icons',    'category-icons',    true),
  ('video-thumbnails',  'video-thumbnails',  true),
  ('videos',            'videos',            true)
on conflict (id) do nothing;

-- Storage policies: public read, authenticated write/update/delete
do $$ begin
  create policy "public read product-images" on storage.objects for select
    using (bucket_id = 'product-images');
  create policy "auth write product-images" on storage.objects for insert
    with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
  create policy "auth update product-images" on storage.objects for update
    using (bucket_id = 'product-images' and auth.role() = 'authenticated');
  create policy "auth delete product-images" on storage.objects for delete
    using (bucket_id = 'product-images' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read brand-logos" on storage.objects for select
    using (bucket_id = 'brand-logos');
  create policy "auth write brand-logos" on storage.objects for insert
    with check (bucket_id = 'brand-logos' and auth.role() = 'authenticated');
  create policy "auth delete brand-logos" on storage.objects for delete
    using (bucket_id = 'brand-logos' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read video-thumbnails" on storage.objects for select
    using (bucket_id = 'video-thumbnails');
  create policy "auth write video-thumbnails" on storage.objects for insert
    with check (bucket_id = 'video-thumbnails' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read videos" on storage.objects for select
    using (bucket_id = 'videos');
  create policy "auth write videos" on storage.objects for insert
    with check (bucket_id = 'videos' and auth.role() = 'authenticated');
  create policy "auth delete videos" on storage.objects for delete
    using (bucket_id = 'videos' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
