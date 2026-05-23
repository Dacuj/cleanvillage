import { supabase, isSupabaseConfigured } from './supabase.js';
import {
  CV_PRODUCTS, CV_CATEGORIES, CV_BRANDS, CV_LANDING_VIDEOS,
  CV_COURSES, CV_INDUSTRIES,
} from '../data.js';

// When Supabase is not configured we use the static data as a graceful fallback
// so the storefront still renders. Admin writes always require Supabase.

// --------------------------------------------------------------
// CATEGORIES
// --------------------------------------------------------------
export async function listCategories() {
  if (!isSupabaseConfigured) return CV_CATEGORIES;
  const { data, error } = await supabase
    .from('categories')
    .select('*, products(count)')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data.map(c => ({
    id: c.id, label: c.label, short: c.short, kind: c.kind, icon: c.icon,
    desc: c.description,
    count: c.products?.[0]?.count ?? 0,
  }));
}

export async function upsertCategory(cat) {
  const { data, error } = await supabase.from('categories').upsert({
    id: cat.id, label: cat.label, short: cat.short, kind: cat.kind,
    icon: cat.icon, description: cat.desc, sort_order: cat.sort_order ?? 0,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

// --------------------------------------------------------------
// BRANDS
// --------------------------------------------------------------
export async function listBrands() {
  if (!isSupabaseConfigured) return CV_BRANDS;
  const { data, error } = await supabase
    .from('brands').select('*').order('sort_order', { ascending: true });
  if (error) throw error;
  return data.map(b => ({
    id: b.id, name: b.name, weight: b.weight, italic: b.italic,
    letter: b.letter, logo_url: b.logo_url,
  }));
}

export async function upsertBrand(brand) {
  const payload = {
    name: brand.name, weight: brand.weight ?? 500, italic: brand.italic ?? false,
    letter: brand.letter, logo_url: brand.logo_url, sort_order: brand.sort_order ?? 0,
  };
  if (brand.id) payload.id = brand.id;
  const { data, error } = await supabase.from('brands').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteBrand(id) {
  const { error } = await supabase.from('brands').delete().eq('id', id);
  if (error) throw error;
}

// --------------------------------------------------------------
// PRODUCTS
// --------------------------------------------------------------
function mapDbProduct(row) {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    brand: row.brand,
    catId: row.category_id,
    kind: row.kind,
    price: row.price,
    stock: row.stock,
    count: row.count,
    badge: row.badge,
    description: row.description,
    specs: Array.isArray(row.specs) ? row.specs : [],
    is_highlighted: row.is_highlighted,
    is_featured: row.is_featured,
    images: (row.product_images || [])
      .slice()
      .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order)
      .map(img => ({ id: img.id, url: img.url, storage_path: img.storage_path, alt: img.alt_text, is_primary: img.is_primary })),
  };
}

export async function listProducts() {
  if (!isSupabaseConfigured) return CV_PRODUCTS;
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data.map(mapDbProduct);
}

export async function getProduct(id) {
  if (!isSupabaseConfigured) return CV_PRODUCTS.find(p => p.id === id) || null;
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapDbProduct(data) : null;
}

export async function upsertProduct(p) {
  const payload = {
    id: p.id,
    name: p.name,
    sku: p.sku,
    brand: p.brand,
    category_id: p.catId,
    kind: p.kind,
    price: p.price,
    stock: p.stock,
    count: parseInt(p.count) || 0,
    badge: p.badge || null,
    description: p.description || null,
    specs: p.specs || [],
    is_highlighted: !!p.is_highlighted,
    is_featured: !!p.is_featured,
  };
  const { data, error } = await supabase.from('products').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// --------------------------------------------------------------
// PRODUCT IMAGES
// --------------------------------------------------------------
export async function uploadProductImage(productId, file, { isPrimary = false } = {}) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configurato');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from('product-images')
    .upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from('product-images').getPublicUrl(path);

  const { data: countData } = await supabase
    .from('product_images')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId);
  const sortOrder = countData?.length || 0;

  const { data, error } = await supabase.from('product_images').insert({
    product_id: productId,
    url: pub.publicUrl,
    storage_path: path,
    alt_text: file.name,
    is_primary: isPrimary,
    sort_order: sortOrder,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProductImage(imageId) {
  const { data: img } = await supabase
    .from('product_images').select('storage_path').eq('id', imageId).maybeSingle();
  if (img?.storage_path) {
    await supabase.storage.from('product-images').remove([img.storage_path]);
  }
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);
  if (error) throw error;
}

export async function setPrimaryImage(productId, imageId) {
  await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);
  const { error } = await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId);
  if (error) throw error;
}

// --------------------------------------------------------------
// VIDEOS
// --------------------------------------------------------------
export async function listVideos({ liveOnly = false } = {}) {
  if (!isSupabaseConfigured) {
    return liveOnly ? CV_LANDING_VIDEOS.filter(v => v.status === 'live') : CV_LANDING_VIDEOS;
  }
  let q = supabase.from('videos').select('*').order('created_at', { ascending: false });
  if (liveOnly) q = q.eq('status', 'live');
  const { data, error } = await q;
  if (error) throw error;
  return data.map(v => ({
    id: v.id, title: v.title, duration: v.duration, spot: v.spot,
    size: v.size, status: v.status, date: v.created_at?.slice(0, 10),
    description: v.description, file_url: v.file_url, thumbnail_url: v.thumbnail_url,
    storage_path: v.storage_path,
    product_id: v.product_id,
  }));
}

export async function upsertVideo(v) {
  const payload = {
    id: v.id, title: v.title, description: v.description, spot: v.spot,
    duration: v.duration, size: v.size, status: v.status,
    file_url: v.file_url, storage_path: v.storage_path,
    thumbnail_url: v.thumbnail_url, product_id: v.product_id || null,
  };
  const { data, error } = await supabase.from('videos').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function deleteVideo(id) {
  const { data: vid } = await supabase
    .from('videos').select('storage_path, thumbnail_url').eq('id', id).maybeSingle();
  if (vid?.storage_path) {
    await supabase.storage.from('videos').remove([vid.storage_path]).catch(() => {});
  }
  if (vid?.thumbnail_url) {
    const m = vid.thumbnail_url.match(/\/object\/public\/video-thumbnails\/(.+)$/);
    if (m) {
      await supabase.storage.from('video-thumbnails').remove([decodeURIComponent(m[1])]).catch(() => {});
    }
  }
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) throw error;
}

// Upload a video file to the `videos` bucket and return a public URL + the
// storage path (kept on the row so we can remove it on delete).
export async function uploadVideoFile(file) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configurato');
  const ext = (file.name.split('.').pop() || 'mp4').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('videos')
    .upload(path, file, { contentType: file.type || 'video/mp4', upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from('videos').getPublicUrl(path);
  return { url: pub.publicUrl, storage_path: path };
}

export async function uploadVideoThumbnail(file) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configurato');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('video-thumbnails')
    .upload(path, file, { contentType: file.type || 'image/jpeg', upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from('video-thumbnails').getPublicUrl(path);
  return { url: pub.publicUrl, storage_path: path };
}

export async function removeVideoStorage(storagePath) {
  if (!isSupabaseConfigured || !storagePath) return;
  await supabase.storage.from('videos').remove([storagePath]).catch(() => {});
}

// --------------------------------------------------------------
// COURSES & INDUSTRIES
// --------------------------------------------------------------
export async function listCourses() {
  if (!isSupabaseConfigured) return CV_COURSES;
  const { data, error } = await supabase.from('courses').select('*').order('sort_order');
  if (error) throw error;
  return data.map(c => ({
    id: c.id, title: c.title, level: c.level, duration: c.duration, mode: c.mode,
    nextDate: c.next_date, price: c.price, desc: c.description, kind: c.kind, bg: c.bg,
  }));
}

export async function listIndustries() {
  if (!isSupabaseConfigured) return CV_INDUSTRIES;
  const { data, error } = await supabase.from('industries').select('*').order('sort_order');
  if (error) throw error;
  return data.map(i => ({
    id: i.id, label: i.label, icon: i.icon, desc: i.description,
  }));
}

// --------------------------------------------------------------
// QUOTES
// --------------------------------------------------------------
export async function createQuote(quote) {
  if (!isSupabaseConfigured) {
    console.warn('Quote saved locally (Supabase non configurato)', quote);
    return { id: `local-${Date.now()}`, ...quote };
  }
  const { data, error } = await supabase.from('quotes').insert({
    company: quote.company, vat: quote.vat,
    contact_name: quote.contact_name, email: quote.email, phone: quote.phone,
    message: quote.message, needs: quote.needs || [],
    timeline: quote.timeline, attachments: quote.attachments || [],
  }).select().single();
  if (error) throw error;
  return data;
}

export async function listQuotes() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('quotes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateQuoteStatus(id, status) {
  const { error } = await supabase.from('quotes').update({ status }).eq('id', id);
  if (error) throw error;
}

// --------------------------------------------------------------
// SITE CONTENT (landing CMS)
// --------------------------------------------------------------
export async function getSiteContent() {
  if (!isSupabaseConfigured) return null;
  const { data, error } = await supabase
    .from('site_content').select('data').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data?.data || null;
}

export async function upsertSiteContent(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configurato');
  const { error } = await supabase
    .from('site_content')
    .upsert({ id: 1, data: payload, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function uploadLandingImage(slotId, file) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configurato');
  const safeSlot = String(slotId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${safeSlot}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('landing-images').upload(path, file, { contentType: file.type, upsert: false });
  if (upErr) throw upErr;
  const { data: pub } = supabase.storage.from('landing-images').getPublicUrl(path);
  return { url: pub.publicUrl, storage_path: path };
}

export async function deleteLandingImage(storagePath) {
  if (!isSupabaseConfigured || !storagePath) return;
  await supabase.storage.from('landing-images').remove([storagePath]);
}

// Diagnostic probe used by the landing editor banner. Returns an object
// describing the next action the operator needs to take:
//   { ok: true, stage: 'ready', message }
//   { ok: false, stage: 'env' | 'migration_0002' | 'bucket', message, raw? }
export async function probeSiteContentSetup() {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      stage: 'env',
      message: 'Variabili VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY mancanti nel file .env.local.',
    };
  }
  try {
    const { error: tableErr } = await supabase
      .from('site_content')
      .select('id', { head: true, count: 'exact' })
      .eq('id', 1);
    if (tableErr) {
      return {
        ok: false,
        stage: 'migration_0002',
        message: 'Tabella `site_content` non trovata. Lancia la migration 0002_site_content.sql nel SQL editor di Supabase.',
        raw: tableErr.message,
      };
    }
  } catch (e) {
    return {
      ok: false,
      stage: 'migration_0002',
      message: 'Impossibile leggere la tabella `site_content`. Verifica di aver lanciato la migration 0002_site_content.sql.',
      raw: e.message,
    };
  }
  // Use list() instead of getBucket() — getBucket() requires service role key,
  // list() works with the anon key via the public read policy.
  try {
    const { error: listErr } = await supabase.storage.from('landing-images').list('', { limit: 1 });
    if (listErr) {
      return {
        ok: false,
        stage: 'bucket',
        message: 'Bucket `landing-images` non trovato. Lo crea la migration 0002_site_content.sql.',
        raw: listErr.message,
      };
    }
  } catch (e) {
    return {
      ok: false,
      stage: 'bucket',
      message: 'Bucket `landing-images` non raggiungibile.',
      raw: e.message,
    };
  }
  return { ok: true, stage: 'ready', message: 'Supabase collegato. Pubblicazione online attiva.' };
}
