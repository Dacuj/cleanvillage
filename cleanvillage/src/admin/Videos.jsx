import { useState, useEffect } from 'react';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, Modal, AField, AInput, ATextarea, ASelect, DataTable } from './chrome.jsx';
import { listVideos, upsertVideo, deleteVideo, listProducts } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function AdminVideos() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uploadProg, setUploadProg] = useState(0);

  const reload = async () => {
    const [v, p] = await Promise.all([listVideos(), listProducts()]);
    setItems(v); setProducts(p);
  };
  useEffect(() => { reload(); }, []);

  const handleSave = async (data, isNew) => {
    if (!isSupabaseConfigured) { alert('Configura Supabase.'); return; }
    if (isNew && !data.id) data.id = `vid-${Date.now().toString(36)}`;
    await upsertVideo(data); setEditing(null); reload();
  };
  const handleDelete = async (id) => {
    if (!confirm('Eliminare il video?')) return;
    await deleteVideo(id); setEditing(null); reload();
  };

  useEffect(() => {
    if (editing === 'new') {
      setUploadProg(0);
      const it = setInterval(() => setUploadProg(p => Math.min(100, p + 8)), 220);
      return () => clearInterval(it);
    }
  }, [editing]);

  const SPOTS = [
    { id: 'hero', label: 'Hero · Video Aziendale', desc: 'Player principale nella sezione "Inside our HQ"', limit: 1, used: items.filter(v => v.spot === 'Hero · Video Aziendale').length },
    { id: 'highlights', label: 'Macchine in evidenza', desc: 'Demo brevi associate alle 3 macchine in evidenza', limit: 3, used: items.filter(v => v.spot === 'Macchine in evidenza').length },
    { id: 'sectors', label: 'Settori serviti', desc: 'Backstage e use case per i 6 settori della grid', limit: 6, used: items.filter(v => v.spot === 'Settori serviti').length },
    { id: 'product', label: 'Pagina prodotto', desc: 'Demo agganciata a un singolo prodotto del catalogo', limit: '∞', used: 0 },
  ];

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Video"
      subtitle="Gestisci i video che appaiono nella homepage e nelle pagine prodotto. Caricali, assegnali alla giusta posizione, mettili in coda o pubblicali."
      actions={[
        <ABtn key="n" variant="cta" icon={<AdminIcon name="upload-cloud" size={13} />} onClick={() => setEditing('new')}>Carica nuovo video</ABtn>,
      ]}
    >
      {/* Spot allocation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {SPOTS.map(s => (
          <div key={s.id} style={{ padding: '16px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>Posizione</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-primary)', fontWeight: 600 }}>{s.used} / {s.limit}</span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em', marginTop: 8, color: 'var(--fg-primary)' }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 6, lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <Panel title="Video caricati" padding={0} action={
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{items.length} totali · {items.filter(v => v.status === 'live').length} live · {items.filter(v => v.status === 'draft').length} bozza</span>
      }>
        <DataTable
          empty="Nessun video caricato."
          onRowClick={row => setEditing(row)}
          columns={[
            { key: 'preview', label: '', width: 120, render: r => <VideoThumb video={r} /> },
            {
              key: 'title', label: 'Titolo', render: r => (
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, letterSpacing: '-0.01em' }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2, display: 'inline-flex', gap: 8 }}>
                    <span>{r.spot}</span><span>·</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>{r.size}</span>
                  </div>
                </div>
              )
            },
            { key: 'dur', label: 'Durata', width: 90, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.duration}</span> },
            { key: 'date', label: 'Caricato', width: 110, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.date}</span> },
            {
              key: 'status', label: 'Stato', width: 110, render: r => (
                r.status === 'live' ? <Badge tone="mint">Live</Badge> :
                  r.status === 'draft' ? <Badge tone="amber">Bozza</Badge> :
                    <Badge tone="neutral">In coda</Badge>
              )
            },
            {
              key: 'act', label: '', width: 110, align: 'right', render: r => (
                <div style={{ display: 'inline-flex', gap: 4 }}>
                  <button onClick={(e) => { e.stopPropagation(); setEditing(r); }} style={{ width: 30, height: 30, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'grid', placeItems: 'center' }} title="Modifica">
                    <AdminIcon name="pencil" size={13} color="var(--fg-secondary)" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); }} style={{ width: 30, height: 30, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'grid', placeItems: 'center' }} title="Anteprima">
                    <AdminIcon name="play" size={13} color="var(--fg-secondary)" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} style={{ width: 30, height: 30, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'grid', placeItems: 'center' }} title="Elimina">
                    <AdminIcon name="trash-2" size={13} color="var(--color-danger-500)" />
                  </button>
                </div>
              )
            },
          ]}
          rows={items}
        />
      </Panel>

      <VideoModal
        open={editing !== null}
        video={editing === 'new' ? null : editing}
        products={products}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        onDelete={handleDelete}
        uploadProg={editing === 'new' ? uploadProg : 100}
      />
    </AdminPage>
  );
}

function VideoThumb({ video }) {
  return (
    <div style={{ position: 'relative', width: 96, aspectRatio: '16/9', background: 'linear-gradient(135deg, #2C3E4A 0%, #0F2330 100%)', borderRadius: 'var(--radius-xs)', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
      <svg viewBox="0 0 96 54" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <path d="M0 30 L24 16 L48 26 L72 14 L96 22 L96 54 L0 54 Z" fill="#0A4D68" />
        <path d="M0 30 L24 16 L48 26 L72 14 L96 22 L96 36 L0 36 Z" fill="#083D54" />
        <rect x="24" y="38" width="14" height="8" fill="#25D366" opacity="0.7" />
      </svg>
      <span style={{ position: 'absolute', width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'grid', placeItems: 'center' }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#0A4D68" style={{ marginLeft: 1 }}><path d="M8 5v14l11-7z" /></svg>
      </span>
      <span style={{ position: 'absolute', bottom: 3, right: 4, padding: '1px 4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, borderRadius: 2 }}>{video.duration}</span>
    </div>
  );
}

function VideoModal({ open, video, products = [], onClose, onSave, onDelete, uploadProg }) {
  const isNew = !video;
  const [form, setForm] = useState({
    id: video?.id, title: video?.title || '', spot: video?.spot || 'Hero · Video Aziendale',
    duration: video?.duration || '', status: video?.status || 'draft',
    date: video?.date || '16.05.2026', size: video?.size || '— MB',
    description: video?.description || '', product_id: video?.product_id || '',
  });

  useEffect(() => {
    if (open) {
      setForm({
        id: video?.id, title: video?.title || '', spot: video?.spot || 'Hero · Video Aziendale',
        duration: video?.duration || '', status: video?.status || 'draft',
        date: video?.date || '16.05.2026', size: video?.size || '— MB',
        description: video?.description || '', product_id: video?.product_id || '',
      });
    }
  }, [open, video]);

  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...video, ...form }, isNew); };

  return (
    <Modal
      open={open} onClose={onClose} width={760}
      title={isNew ? 'Carica nuovo video' : `Modifica video · ${video?.title}`}
      footer={
        <>
          {!isNew && <ABtn variant="danger" icon={<AdminIcon name="trash-2" size={13} />} onClick={() => onDelete(video.id)}>Elimina</ABtn>}
          <span style={{ flex: 1 }} />
          <ABtn variant="secondary" onClick={onClose}>Annulla</ABtn>
          <ABtn variant="cta" onClick={handleSubmit} icon={<AdminIcon name="check" size={13} />}>{isNew ? 'Pubblica video' : 'Salva modifiche'}</ABtn>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Upload area */}
        {isNew && (
          <div style={{ padding: '24px', background: 'var(--color-ice-50)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', marginBottom: 22 }}>
            {uploadProg < 100 ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                  <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-mint-50)', color: 'var(--color-mint-700)', borderRadius: 'var(--radius-sm)' }}>
                    <AdminIcon name="upload-cloud" size={22} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>tour-officina-2026.mp4</div>
                    <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>184 MB · MP4 H.264 · 1920×1080</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-teal-500)', fontWeight: 600 }}>{uploadProg}%</span>
                </div>
                <div style={{ height: 6, background: 'var(--color-ice-100)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${uploadProg}%`, background: 'var(--color-mint-500)', borderRadius: 3, transition: 'width 200ms' }} />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-mint-50)', color: 'var(--color-mint-700)', borderRadius: 'var(--radius-sm)' }}>
                  <AdminIcon name="check-circle" size={22} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>Upload completato</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>tour-officina-2026.mp4 · pronto per la pubblicazione</div>
                </div>
                <ABtn variant="ghost" icon={<AdminIcon name="rotate-ccw" size={13} />}>Sostituisci</ABtn>
              </div>
            )}
          </div>
        )}

        <FormSect title="Metadati" step={1}>
          <AField label="Titolo" required>
            <AInput required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Es. Tour della sede di Busto Arsizio" />
          </AField>
          <AField label="Descrizione breve" hint="Mostrata sotto il player nelle posizioni che la supportano">
            <ATextarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="3 minuti dentro al magazzino, allo showroom e all'officina autorizzata." />
          </AField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <AField label="Durata">
              <AInput value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="03:24" />
            </AField>
            <AField label="Peso file">
              <AInput value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="248 MB" />
            </AField>
          </div>
        </FormSect>

        <FormSect title="Posizione sul sito" step={2}>
          <AField label="Dove vuoi mostrare questo video?" required>
            <ASelect value={form.spot} onChange={e => setForm({ ...form, spot: e.target.value })}>
              <option>Hero · Video Aziendale</option>
              <option>Macchine in evidenza</option>
              <option>Settori serviti</option>
              <option>Pagina prodotto</option>
              <option>Solo libreria interna</option>
            </ASelect>
          </AField>
          {form.spot === 'Pagina prodotto' && (
            <AField label="Prodotto associato" hint="Cerca per nome o SKU">
              <ASelect value={form.product_id || ''} onChange={e => setForm({ ...form, product_id: e.target.value })}>
                <option value="">— Nessuno —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.brand} · {p.name} ({p.sku})</option>)}
              </ASelect>
            </AField>
          )}
        </FormSect>

        <FormSect title="Pubblicazione" step={3} last>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { v: 'live', l: 'Pubblica subito', d: 'Visibile sul sito ora' },
              { v: 'scheduled', l: 'Pianifica', d: 'Pubblica in data futura' },
              { v: 'draft', l: 'Salva come bozza', d: 'Tieni nella libreria' },
            ].map(o => (
              <button key={o.v} type="button" onClick={() => setForm({ ...form, status: o.v })} style={{
                padding: '14px 16px', textAlign: 'left', cursor: 'pointer',
                background: form.status === o.v ? 'var(--color-mint-50)' : 'var(--bg-surface)',
                border: `1px solid ${form.status === o.v ? 'var(--color-mint-500)' : 'var(--border-default)'}`,
                borderRadius: 'var(--radius-sm)',
              }}>
                <div style={{ fontSize: 13, fontWeight: form.status === o.v ? 600 : 500, color: form.status === o.v ? 'var(--color-mint-700)' : 'var(--fg-primary)' }}>{o.l}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 3 }}>{o.d}</div>
              </button>
            ))}
          </div>
        </FormSect>
      </form>
    </Modal>
  );
}

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
