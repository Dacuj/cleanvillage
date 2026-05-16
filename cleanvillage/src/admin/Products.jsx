import { useState, useMemo, useEffect, useRef } from 'react';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, Modal, AField, AInput, ATextarea, ASelect, DataTable, adminInputStyle } from './chrome.jsx';
import { ProductIllustration } from '../components/product.jsx';
import {
  listProducts, listCategories, upsertProduct, deleteProduct,
  uploadProductImage, deleteProductImage, setPrimaryImage,
} from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');

  const reload = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([listProducts(), listCategories()]);
      setItems(p); setCats(c);
    } catch (e) {
      setErr(e.message || 'Errore caricamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const filtered = useMemo(() => {
    return items.filter(p => {
      if (filterCat !== 'all' && p.catId !== filterCat) return false;
      if (filterStock !== 'all' && p.stock !== filterStock) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (p.name + ' ' + p.brand + ' ' + p.sku).toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, search, filterCat, filterStock]);

  const handleSave = async (data, isNew) => {
    if (!isSupabaseConfigured) {
      alert('Configura Supabase per salvare i prodotti. Vedi SUPABASE_SETUP.md');
      return;
    }
    try {
      if (isNew && !data.id) data.id = `${data.sku.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36).slice(-4)}`;
      await upsertProduct(data);
      await reload();
      // Re-select the saved product so the modal stays open with image upload available
      const refreshed = await listProducts();
      const saved = refreshed.find(p => p.id === data.id);
      setEditing(saved || null);
    } catch (e) {
      alert('Errore salvataggio: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminare definitivamente questo prodotto e tutte le sue immagini?')) return;
    try {
      await deleteProduct(id);
      setEditing(null);
      await reload();
    } catch (e) {
      alert('Errore eliminazione: ' + e.message);
    }
  };

  return (
    <AdminPage
      eyebrow="Catalogo"
      title="Prodotti"
      subtitle={loading
        ? 'Caricamento catalogo…'
        : `${items.length} SKU totali · ${items.filter(p => p.stock === 'in').length} disponibili · ${items.filter(p => p.stock === 'low').length} con scorte limitate`}
      actions={[
        <ABtn key="i" variant="secondary" icon={<AdminIcon name="upload" size={13} />}>Importa CSV</ABtn>,
        <ABtn key="n" variant="cta" icon={<AdminIcon name="plus" size={13} />} onClick={() => setEditing('new')}>Aggiungi prodotto</ABtn>,
      ]}
    >
      {!isSupabaseConfigured && (
        <div style={{ padding: 12, marginBottom: 18, background: '#FFF8E1', border: '1px solid #F0B673', borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#7A4504' }}>
          <strong>Modalità demo:</strong> Supabase non è configurato. Vedi i dati di seed, ma non puoi salvare o caricare immagini. Crea <code>.env.local</code> con le tue chiavi e riavvia il dev server.
        </div>
      )}
      {err && (
        <div style={{ padding: 12, marginBottom: 18, background: '#FDEEEE', border: '1px solid #E89E9E', borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#A02020' }}>
          {err}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 320 }}>
          <AdminIcon name="search" size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca SKU, nome, marchio…"
            style={{ ...adminInputStyle, paddingLeft: 34 }} />
        </div>
        <ASelect value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ width: 'auto', minWidth: 200 }}>
          <option value="all">Tutte le categorie</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </ASelect>
        <ASelect value={filterStock} onChange={e => setFilterStock(e.target.value)} style={{ width: 'auto', minWidth: 160 }}>
          <option value="all">Tutti gli stock</option>
          <option value="in">Disponibile</option>
          <option value="low">Scorte limitate</option>
          <option value="out">Su ordinazione</option>
        </ASelect>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{filtered.length} risultati</span>
      </div>

      <Panel padding={0}>
        <DataTable
          empty={loading ? 'Caricamento…' : 'Nessun prodotto trovato. Modifica i filtri o aggiungi un nuovo SKU.'}
          onRowClick={(row) => setEditing(row)}
          columns={[
            {
              key: 'thumb', label: '', width: 60, render: r => (
                <div style={{ width: 42, height: 42, background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center', padding: 4, overflow: 'hidden' }}>
                  {r.images && r.images.length
                    ? <img src={r.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    : <div style={{ width: '90%' }}><ProductIllustration kind={r.kind} hover={false} /></div>}
                </div>
              )
            },
            {
              key: 'name', label: 'Prodotto', render: r => (
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2, display: 'inline-flex', gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>{r.brand}</span>
                    <span>·</span>
                    <span>{(cats.find(c => c.id === r.catId) || {}).label}</span>
                  </div>
                </div>
              )
            },
            { key: 'sku', label: 'SKU', width: 140, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-500)', fontWeight: 500 }}>{r.sku}</span> },
            { key: 'price', label: 'Prezzo', width: 120, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{r.price}</span> },
            {
              key: 'stock', label: 'Stock', width: 160, render: r => (
                r.stock === 'in' ? <Badge tone="mint">Disponibile · {r.count || 0}</Badge> :
                  r.stock === 'low' ? <Badge tone="amber">Ultimi {r.count || 0} pz</Badge> :
                    <Badge tone="danger">Su ordinazione</Badge>
              )
            },
            {
              key: 'images', label: 'Foto', width: 70, render: r => (
                <Badge tone={r.images?.length ? 'teal' : 'neutral'}>{r.images?.length || 0}</Badge>
              )
            },
            {
              key: 'act', label: '', width: 96, align: 'right', render: r => (
                <div style={{ display: 'inline-flex', gap: 4 }}>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(r); }} style={iconBtnStyle} title="Modifica">
                    <AdminIcon name="pencil" size={13} color="var(--fg-secondary)" />
                  </button>
                  <a href={`/product/${r.id}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} style={{ ...iconBtnStyle, textDecoration: 'none' }} title="Apri sul sito">
                    <AdminIcon name="external-link" size={13} color="var(--fg-secondary)" />
                  </a>
                </div>
              )
            },
          ]}
          rows={filtered}
        />
      </Panel>

      <ProductModal
        open={editing !== null}
        product={editing === 'new' ? null : editing}
        cats={cats}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        onDelete={handleDelete}
        onImagesChange={async (productId) => {
          // refresh just this product to update images
          const fresh = await listProducts();
          setItems(fresh);
          const updated = fresh.find(p => p.id === productId);
          if (updated && editing && editing.id === productId) setEditing(updated);
        }}
      />
    </AdminPage>
  );
}

const iconBtnStyle = { width: 30, height: 30, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'grid', placeItems: 'center' };

function ProductModal({ open, product, cats, onClose, onSave, onDelete, onImagesChange }) {
  const isNew = !product;
  const [form, setForm] = useState(() => buildForm(product, cats));

  useEffect(() => { if (open) setForm(buildForm(product, cats)); }, [open, product, cats]);

  const setCat = (catId) => {
    const cat = cats.find(c => c.id === catId);
    setForm({ ...form, catId, kind: cat?.kind || form.kind });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      specs: form.specs.split('\n').map(s => s.trim()).filter(Boolean),
      count: parseInt(form.count) || 0,
    };
    onSave(payload, isNew);
  };

  return (
    <Modal
      open={open} onClose={onClose} width={860}
      title={isNew ? 'Nuovo prodotto' : `Modifica · ${product?.name}`}
      footer={
        <>
          {!isNew && <ABtn variant="danger" icon={<AdminIcon name="trash-2" size={13} />} onClick={() => onDelete(product.id)}>Elimina</ABtn>}
          <span style={{ flex: 1 }} />
          <ABtn variant="secondary" onClick={onClose}>Chiudi</ABtn>
          <ABtn variant="cta" onClick={handleSubmit} icon={<AdminIcon name="check" size={13} />}>{isNew ? 'Crea prodotto' : 'Salva modifiche'}</ABtn>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Preview strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 18, marginBottom: 24, padding: '18px', background: 'var(--color-ice-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ aspectRatio: '1/1', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', padding: 10, overflow: 'hidden' }}>
            {product?.images?.length
              ? <img src={product.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              : <div style={{ width: '85%' }}><ProductIllustration kind={form.kind} hover={false} /></div>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Anteprima</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 400, letterSpacing: '-0.025em', color: 'var(--fg-primary)', lineHeight: 1.18 }}>{form.name || 'Nome prodotto'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{form.brand || 'Marchio'}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-500)' }}>{form.sku || 'COD-000'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 22, letterSpacing: '-0.03em' }}>{form.price || '€0'}</span>
              {form.stock === 'in' && <Badge tone="mint">Disponibile · {form.count}</Badge>}
              {form.stock === 'low' && <Badge tone="amber">Ultimi {form.count} pz</Badge>}
              {form.stock === 'out' && <Badge tone="danger">Su ordinazione</Badge>}
              {form.badge && <Badge tone="teal">{form.badge}</Badge>}
            </div>
          </div>
        </div>

        <FormSect title="Identità prodotto" step={1}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
            <AField label="Nome prodotto" required span={1}>
              <AInput required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Es. Comac Innova 100 B" />
            </AField>
            <AField label="Marchio" required>
              <AInput required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value.toUpperCase() })} placeholder="COMAC" />
            </AField>
            <AField label="SKU / codice" required>
              <AInput required value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value.toUpperCase() })} placeholder="COM-IN100B" />
            </AField>
          </div>
          <AField label="Descrizione" hint="Mostrata sulla pagina prodotto sotto il titolo.">
            <ATextarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Macchina compatta a uomo a bordo per superfici da 800 a 4.000 m²…" />
          </AField>
        </FormSect>

        <FormSect title="Categoria & posizionamento" step={2}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {cats.map(c => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)} style={{
                padding: '12px 14px', textAlign: 'left', cursor: 'pointer',
                background: form.catId === c.id ? 'var(--color-teal-50)' : 'var(--bg-surface)',
                border: `1px solid ${form.catId === c.id ? 'var(--color-teal-500)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: form.catId === c.id ? 'var(--color-teal-500)' : 'var(--color-ice-100)', color: form.catId === c.id ? 'var(--color-white)' : 'var(--color-teal-500)', borderRadius: 'var(--radius-xs)', flexShrink: 0 }}>
                  <AdminIcon name={c.icon} size={14} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: form.catId === c.id ? 600 : 500, color: form.catId === c.id ? 'var(--color-teal-500)' : 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.short || c.label}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>{c.count} SKU</div>
                </div>
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
            <AField label="Badge promozionale" hint="Es. PROMO −30%, NOVITÀ">
              <AInput value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} placeholder="Novità" />
            </AField>
            <AField label="In evidenza" hint="Mostrato nella sezione 'Macchine in evidenza'">
              <ASelect value={form.is_highlighted ? '1' : '0'} onChange={e => setForm({ ...form, is_highlighted: e.target.value === '1' })}>
                <option value="0">No</option><option value="1">Sì</option>
              </ASelect>
            </AField>
            <AField label="In primo piano" hint="Carosello prodotti landing">
              <ASelect value={form.is_featured ? '1' : '0'} onChange={e => setForm({ ...form, is_featured: e.target.value === '1' })}>
                <option value="0">No</option><option value="1">Sì</option>
              </ASelect>
            </AField>
          </div>
        </FormSect>

        <FormSect title="Prezzo & disponibilità" step={3}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <AField label="Prezzo (IVA esclusa)" required>
              <AInput required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="€18.400" />
            </AField>
            <AField label="Stato stock" required>
              <ASelect value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}>
                <option value="in">Disponibile</option>
                <option value="low">Scorte limitate</option>
                <option value="out">Su ordinazione</option>
              </ASelect>
            </AField>
            <AField label="Pezzi a magazzino">
              <AInput type="number" value={form.count} onChange={e => setForm({ ...form, count: e.target.value })} />
            </AField>
          </div>
        </FormSect>

        <FormSect title="Specifiche tecniche" step={4}>
          <AField label="Spec chips" required hint='Una specifica per riga. Es. "Serbatoio 145 L"'>
            <ATextarea rows={5} value={form.specs} onChange={e => setForm({ ...form, specs: e.target.value })}
              placeholder={'Serbatoio 145 L\nAutonomia 4 h\nPiste 1000 mm'} />
          </AField>
        </FormSect>

        <FormSect title="Galleria immagini" step={5} last>
          {isNew ? (
            <div style={{ padding: '20px', background: 'var(--color-ice-50)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: 12, color: 'var(--fg-muted)' }}>
              Salva prima il prodotto, poi potrai caricare le immagini.
            </div>
          ) : (
            <ImageGallery product={product} onChange={() => onImagesChange?.(product.id)} />
          )}
        </FormSect>
      </form>
    </Modal>
  );
}

function buildForm(product, cats) {
  return {
    id: product?.id || '',
    name: product?.name || '',
    brand: product?.brand || '',
    sku: product?.sku || '',
    catId: product?.catId || cats[0]?.id || '',
    kind: product?.kind || cats[0]?.kind || 'scrubber',
    price: product?.price || '',
    stock: product?.stock || 'in',
    count: product?.count ?? 1,
    badge: product?.badge || '',
    specs: product?.specs ? product.specs.join('\n') : '',
    description: product?.description || '',
    is_highlighted: !!product?.is_highlighted,
    is_featured: !!product?.is_featured,
  };
}

function ImageGallery({ product, onChange }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [err, setErr] = useState('');

  const handleFiles = async (files) => {
    if (!files || !files.length) return;
    setErr(''); setUploading(true);
    setProgress({ done: 0, total: files.length });
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 4 * 1024 * 1024) {
          throw new Error(`"${file.name}" supera i 4 MB`);
        }
        await uploadProductImage(product.id, file, {
          isPrimary: i === 0 && (!product.images || !product.images.length),
        });
        setProgress({ done: i + 1, total: files.length });
      }
      onChange?.();
    } catch (e) {
      setErr(e.message || 'Errore upload');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('Eliminare questa immagine?')) return;
    try { await deleteProductImage(imageId); onChange?.(); }
    catch (e) { alert('Errore: ' + e.message); }
  };

  const handleSetPrimary = async (imageId) => {
    try { await setPrimaryImage(product.id, imageId); onChange?.(); }
    catch (e) { alert('Errore: ' + e.message); }
  };

  return (
    <div>
      <div
        onClick={() => !uploading && fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); }}
        onDrop={(e) => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))); }}
        style={{ padding: '24px', background: 'var(--color-ice-50)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', textAlign: 'center', cursor: uploading ? 'wait' : 'pointer', marginBottom: 14 }}>
        <AdminIcon name="image-up" size={28} color="var(--fg-muted)" />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, marginTop: 10, color: 'var(--fg-primary)' }}>
          {uploading ? `Caricamento ${progress.done}/${progress.total}…` : 'Trascina qui o clicca per caricare'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4 }}>PNG / JPG / WebP · max 4 MB ciascuna · 1:1 consigliato</div>
        <input
          ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
          onChange={e => handleFiles(Array.from(e.target.files || []))}
        />
      </div>

      {err && <div style={{ padding: 10, marginBottom: 12, background: '#FDEEEE', border: '1px solid #E89E9E', borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#A02020' }}>{err}</div>}

      {product.images && product.images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10 }}>
          {product.images.map(img => (
            <div key={img.id} style={{ position: 'relative', aspectRatio: '1/1', background: 'var(--bg-surface)', border: `2px solid ${img.is_primary ? 'var(--color-mint-500)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <img src={img.url} alt={img.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {img.is_primary && (
                <div style={{ position: 'absolute', top: 4, left: 4, padding: '2px 6px', background: 'var(--color-mint-500)', color: 'white', fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', borderRadius: 3 }}>Principale</div>
              )}
              <div style={{ position: 'absolute', bottom: 4, right: 4, display: 'flex', gap: 4 }}>
                {!img.is_primary && (
                  <button type="button" onClick={() => handleSetPrimary(img.id)} title="Imposta come principale" style={imgBtnStyle}>
                    <AdminIcon name="star" size={11} color="white" />
                  </button>
                )}
                <button type="button" onClick={() => handleDelete(img.id)} title="Elimina" style={{ ...imgBtnStyle, background: 'rgba(200,40,40,0.85)' }}>
                  <AdminIcon name="trash-2" size={11} color="white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const imgBtnStyle = {
  width: 22, height: 22, border: 'none', borderRadius: 4,
  background: 'rgba(0,0,0,0.7)', cursor: 'pointer',
  display: 'grid', placeItems: 'center',
};

function FormSect({ step, title, children, last }) {
  return (
    <div style={{ paddingBottom: last ? 0 : 24, marginBottom: last ? 4 : 24, borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-teal-500)', color: 'var(--color-white)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600 }}>{step}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>
    </div>
  );
}
