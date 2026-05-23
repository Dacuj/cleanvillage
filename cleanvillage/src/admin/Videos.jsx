import { useState, useEffect, useRef } from 'react';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, Modal, AField, AInput, ATextarea, ASelect, DataTable, useAdminStats } from './chrome.jsx';
import {
  listVideos, upsertVideo, deleteVideo, listProducts,
  uploadVideoFile, uploadVideoThumbnail, removeVideoStorage,
} from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function AdminVideos() {
  const { refresh } = useAdminStats();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [previewing, setPreviewing] = useState(null);

  const reload = async () => {
    const [v, p] = await Promise.all([listVideos(), listProducts()]);
    setItems(v); setProducts(p);
  };
  useEffect(() => { reload(); }, []);

  const handleSave = async (data, isNew) => {
    if (!isSupabaseConfigured) { alert('Configura Supabase per salvare i video.'); return; }
    if (isNew && !data.id) data.id = `vid-${Date.now().toString(36)}`;
    await upsertVideo(data);
    setEditing(null);
    await reload();
    refresh();
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminare il video? Verrà rimosso anche il file da Supabase Storage.')) return;
    await deleteVideo(id);
    setEditing(null);
    await reload();
    refresh();
  };

  const SPOTS = [
    { id: 'hero', label: 'Hero · Video Aziendale', desc: 'Player principale nella sezione "Inside our HQ"', limit: 1, used: items.filter(v => v.spot === 'Hero · Video Aziendale').length },
    { id: 'highlights', label: 'Macchine in evidenza', desc: 'Demo brevi associate alle 3 macchine in evidenza', limit: 3, used: items.filter(v => v.spot === 'Macchine in evidenza').length },
    { id: 'sectors', label: 'Settori serviti', desc: 'Backstage e use case per i 6 settori della grid', limit: 6, used: items.filter(v => v.spot === 'Settori serviti').length },
    { id: 'product', label: 'Pagina prodotto', desc: 'Demo agganciata a un singolo prodotto del catalogo', limit: '∞', used: items.filter(v => v.spot === 'Pagina prodotto').length },
  ];

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Video"
      subtitle="Carica i video direttamente da qui: vengono salvati su Supabase Storage e collegati al database. Assegnali a una posizione, opzionalmente carica una miniatura, e pubblicali."
      actions={[
        <ABtn key="n" variant="cta" icon={<AdminIcon name="upload-cloud" size={13} />} onClick={() => setEditing('new')}>Carica nuovo video</ABtn>,
      ]}
    >
      {!isSupabaseConfigured && (
        <div style={WARN}>
          <AdminIcon name="alert-triangle" size={16} color="var(--color-warning-500)" />
          <span><b>Modalità demo:</b> stai vedendo i video di esempio. Configura Supabase per caricarne di reali.</span>
        </div>
      )}

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
          empty="Nessun video caricato. Clicca 'Carica nuovo video' per iniziare."
          onRowClick={row => setEditing(row)}
          columns={[
            { key: 'preview', label: '', width: 120, render: r => <VideoThumb video={r} /> },
            {
              key: 'title', label: 'Titolo', render: r => (
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, letterSpacing: '-0.01em' }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2, display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
                    <span>{r.spot}</span>
                    {r.size && <><span>·</span><span style={{ fontFamily: 'var(--font-mono)' }}>{r.size}</span></>}
                    {!r.file_url && <><span>·</span><span style={{ color: 'var(--color-warning-500)', fontWeight: 600 }}>nessun file</span></>}
                  </div>
                </div>
              )
            },
            { key: 'dur', label: 'Durata', width: 90, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.duration || '—'}</span> },
            { key: 'date', label: 'Caricato', width: 110, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.date || '—'}</span> },
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
                  <button onClick={(e) => { e.stopPropagation(); setEditing(r); }} style={iconBtn} title="Modifica">
                    <AdminIcon name="pencil" size={13} color="var(--fg-secondary)" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (r.file_url) setPreviewing(r); else alert('Nessun file video caricato per questo record.'); }}
                    style={{ ...iconBtn, opacity: r.file_url ? 1 : 0.5 }}
                    title={r.file_url ? 'Anteprima video' : 'Nessun file da riprodurre'}>
                    <AdminIcon name="play" size={13} color="var(--fg-secondary)" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} style={iconBtn} title="Elimina">
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
      />

      <PreviewModal video={previewing} onClose={() => setPreviewing(null)} />
    </AdminPage>
  );
}

const iconBtn = { width: 30, height: 30, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'grid', placeItems: 'center' };
const WARN = { display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--color-warning-100)', border: '1px solid var(--color-warning-500)', borderRadius: 'var(--radius-md)', marginBottom: 18, fontSize: 12, color: 'var(--fg-primary)' };

function VideoThumb({ video }) {
  if (video.thumbnail_url) {
    return (
      <div style={{ position: 'relative', width: 96, aspectRatio: '16/9', background: 'var(--color-ice-100)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
        <img src={video.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'grid', placeItems: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#0A4D68" style={{ marginLeft: 1 }}><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
        {video.duration && (
          <span style={{ position: 'absolute', bottom: 3, right: 4, padding: '1px 4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, borderRadius: 2 }}>{video.duration}</span>
        )}
      </div>
    );
  }
  if (video.file_url) {
    return (
      <div style={{ position: 'relative', width: 96, aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
        <video src={video.file_url} preload="metadata" muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', display: 'grid', placeItems: 'center' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#0A4D68" style={{ marginLeft: 1 }}><path d="M8 5v14l11-7z" /></svg>
          </span>
        </span>
        {video.duration && (
          <span style={{ position: 'absolute', bottom: 3, right: 4, padding: '1px 4px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 500, borderRadius: 2 }}>{video.duration}</span>
        )}
      </div>
    );
  }
  // Placeholder when no file uploaded yet
  return (
    <div style={{ position: 'relative', width: 96, aspectRatio: '16/9', background: 'linear-gradient(135deg, #2C3E4A 0%, #0F2330 100%)', borderRadius: 'var(--radius-xs)', overflow: 'hidden', display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,0.5)' }}>
      <AdminIcon name="video-off" size={20} />
    </div>
  );
}

function PreviewModal({ video, onClose }) {
  if (!video) return null;
  return (
    <Modal open onClose={onClose} width={720} title={`Anteprima · ${video.title}`}
      footer={<>
        <a href={video.file_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--color-teal-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
          <AdminIcon name="external-link" size={12} /> Apri in nuova scheda
        </a>
        <span style={{ flex: 1 }} />
        <ABtn variant="secondary" onClick={onClose}>Chiudi</ABtn>
      </>}>
      <video src={video.file_url} controls autoPlay style={{ width: '100%', maxHeight: '60vh', background: '#000', borderRadius: 'var(--radius-sm)' }} />
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--fg-muted)', display: 'flex', gap: 12, fontFamily: 'var(--font-mono)' }}>
        <span>{video.duration || '—'}</span>
        <span>·</span>
        <span>{video.size || '—'}</span>
        <span>·</span>
        <span style={{ wordBreak: 'break-all' }}>{video.storage_path || '—'}</span>
      </div>
    </Modal>
  );
}

function VideoModal({ open, video, products = [], onClose, onSave, onDelete }) {
  const isNew = !video;
  const [form, setForm] = useState(buildForm(video));
  const [uploading, setUploading] = useState(false);
  const [uploadStage, setUploadStage] = useState(''); // 'video' | 'thumb' | ''
  const [err, setErr] = useState('');
  const [localPreview, setLocalPreview] = useState(null); // blob URL for client preview before upload
  const fileRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => { if (open) { setForm(buildForm(video)); setErr(''); setLocalPreview(null); } }, [open, video]);

  // Auto-extract duration + size from the picked video file using a hidden <video> element.
  const extractMetadata = (file) => new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const vid = document.createElement('video');
    vid.preload = 'metadata';
    vid.onloadedmetadata = () => {
      const dur = Math.round(vid.duration || 0);
      const mins = Math.floor(dur / 60);
      const secs = dur % 60;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      URL.revokeObjectURL(url);
      resolve({
        duration: dur > 0 ? `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}` : '',
        size: `${sizeMB} MB`,
      });
    };
    vid.onerror = () => { URL.revokeObjectURL(url); resolve({ duration: '', size: `${(file.size / (1024 * 1024)).toFixed(1)} MB` }); };
    vid.src = url;
  });

  const handlePickVideo = async (file) => {
    if (!file) return;
    if (!isSupabaseConfigured) { setErr('Configura Supabase per caricare video.'); return; }
    if (!file.type.startsWith('video/')) { setErr('Il file selezionato non è un video.'); return; }
    if (file.size > 200 * 1024 * 1024) { setErr('Il file supera i 200 MB. Per file più grandi alza il limite nel pannello Supabase Storage.'); return; }

    setErr(''); setUploading(true); setUploadStage('video');
    setLocalPreview(URL.createObjectURL(file));
    try {
      const meta = await extractMetadata(file);
      const oldStorage = form.storage_path;
      const uploaded = await uploadVideoFile(file);
      // Cleanup previous file from storage if replacing
      if (oldStorage && oldStorage !== uploaded.storage_path) {
        await removeVideoStorage(oldStorage);
      }
      setForm(f => ({
        ...f,
        file_url: uploaded.url,
        storage_path: uploaded.storage_path,
        duration: f.duration || meta.duration,
        size: meta.size,
      }));
    } catch (e) {
      setErr('Errore upload video: ' + (e.message || e));
    } finally {
      setUploading(false); setUploadStage('');
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handlePickThumb = async (file) => {
    if (!file) return;
    if (!isSupabaseConfigured) { setErr('Configura Supabase per caricare miniature.'); return; }
    if (!file.type.startsWith('image/')) { setErr('La miniatura deve essere un\'immagine.'); return; }
    if (file.size > 4 * 1024 * 1024) { setErr('La miniatura supera i 4 MB.'); return; }
    setErr(''); setUploading(true); setUploadStage('thumb');
    try {
      const uploaded = await uploadVideoThumbnail(file);
      setForm(f => ({ ...f, thumbnail_url: uploaded.url }));
    } catch (e) {
      setErr('Errore upload miniatura: ' + (e.message || e));
    } finally {
      setUploading(false); setUploadStage('');
      if (thumbRef.current) thumbRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!form.title?.trim()) { setErr('Il titolo è obbligatorio.'); return; }
    if (!form.file_url) { setErr('Carica prima un file video.'); return; }
    onSave({ ...form, date: form.date || new Date().toISOString().slice(0, 10) }, isNew);
  };

  const canSubmit = !uploading && !!form.file_url && !!form.title?.trim();

  return (
    <Modal
      open={open} onClose={onClose} width={780}
      title={isNew ? 'Carica nuovo video' : `Modifica video · ${video?.title}`}
      footer={
        <>
          {!isNew && <ABtn variant="danger" icon={<AdminIcon name="trash-2" size={13} />} onClick={() => onDelete(video.id)}>Elimina</ABtn>}
          <span style={{ flex: 1 }} />
          <ABtn variant="secondary" onClick={onClose}>Annulla</ABtn>
          <ABtn variant="cta" onClick={handleSubmit} icon={<AdminIcon name="check" size={13} />} disabled={!canSubmit}>{isNew ? 'Pubblica video' : 'Salva modifiche'}</ABtn>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormSect title="File video" step={1}>
          <VideoUploadBlock
            form={form}
            uploading={uploading && uploadStage === 'video'}
            localPreview={localPreview}
            onPick={() => fileRef.current?.click()}
            onClear={() => {
              if (!confirm('Rimuovere il file dal record? Il file su Supabase Storage non viene cancellato finché non salvi.')) return;
              setForm(f => ({ ...f, file_url: '', storage_path: '', size: '' }));
              setLocalPreview(null);
            }}
          />
          <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={e => handlePickVideo(e.target.files?.[0])} />
        </FormSect>

        <FormSect title="Miniatura (opzionale)" step={2}>
          <ThumbnailBlock
            url={form.thumbnail_url}
            uploading={uploading && uploadStage === 'thumb'}
            onPick={() => thumbRef.current?.click()}
            onClear={() => setForm(f => ({ ...f, thumbnail_url: '' }))}
          />
          <input ref={thumbRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handlePickThumb(e.target.files?.[0])} />
        </FormSect>

        <FormSect title="Metadati" step={3}>
          <AField label="Titolo" required>
            <AInput required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Es. Tour della sede operativa" />
          </AField>
          <AField label="Descrizione breve" hint="Mostrata sotto il player nelle posizioni che la supportano">
            <ATextarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="3 minuti dentro al magazzino, allo showroom e all'officina autorizzata." />
          </AField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <AField label="Durata" hint="Rilevata automaticamente dal file. Puoi modificarla.">
              <AInput value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="03:24" />
            </AField>
            <AField label="Peso file" hint="Rilevato automaticamente dal file.">
              <AInput value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} placeholder="248 MB" />
            </AField>
          </div>
        </FormSect>

        <FormSect title="Posizione sul sito" step={4}>
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

        <FormSect title="Pubblicazione" step={5} last>
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

        {err && (
          <div style={{ padding: '10px 14px', background: 'var(--color-danger-100)', border: '1px solid var(--color-danger-500)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--color-danger-500)', marginTop: 12 }}>
            {err}
          </div>
        )}
      </form>
    </Modal>
  );
}

function buildForm(video) {
  return {
    id: video?.id,
    title: video?.title || '',
    spot: video?.spot || 'Hero · Video Aziendale',
    duration: video?.duration || '',
    status: video?.status || 'draft',
    date: video?.date || '',
    size: video?.size || '',
    description: video?.description || '',
    product_id: video?.product_id || '',
    file_url: video?.file_url || '',
    storage_path: video?.storage_path || '',
    thumbnail_url: video?.thumbnail_url || '',
  };
}

function VideoUploadBlock({ form, uploading, localPreview, onPick, onClear }) {
  const hasFile = !!form.file_url;
  if (uploading) {
    return (
      <div style={{ padding: '24px', background: 'var(--color-ice-50)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-mint-50)', color: 'var(--color-mint-700)', borderRadius: 'var(--radius-sm)' }}>
            <AdminIcon name="loader" size={22} />
          </span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>Caricamento in corso…</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
            Sto inviando il file a Supabase Storage. Per file grandi può volerci qualche secondo.
          </div>
        </div>
      </div>
    );
  }
  if (hasFile) {
    return (
      <div style={{ padding: '14px', background: 'var(--color-mint-50)', border: '1px solid var(--color-mint-300, #BDE9CC)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-mint-500)', color: 'var(--color-white)', borderRadius: 'var(--radius-sm)' }}>
            <AdminIcon name="check-circle" size={22} />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>Video collegato</div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', marginTop: 2, wordBreak: 'break-all' }}>{form.storage_path || form.file_url}</div>
          </div>
          <ABtn variant="ghost" size="sm" icon={<AdminIcon name="rotate-ccw" size={12} />} onClick={onPick}>Sostituisci</ABtn>
          <ABtn variant="ghost" size="sm" icon={<AdminIcon name="x" size={12} />} onClick={onClear}>Rimuovi</ABtn>
        </div>
        <video
          src={localPreview || form.file_url}
          controls
          preload="metadata"
          style={{ width: '100%', maxHeight: 320, background: '#000', borderRadius: 'var(--radius-sm)' }}
        />
      </div>
    );
  }
  return (
    <button type="button" onClick={onPick}
      style={{ width: '100%', padding: '32px 24px', background: 'var(--color-ice-50)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center', fontFamily: 'var(--font-body)' }}>
      <AdminIcon name="upload-cloud" size={36} color="var(--color-teal-500)" />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, marginTop: 12, color: 'var(--fg-primary)' }}>Carica un file video</div>
      <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 6 }}>MP4, WebM o MOV · max 200 MB · viene salvato su Supabase Storage</div>
    </button>
  );
}

function ThumbnailBlock({ url, uploading, onPick, onClear }) {
  if (uploading) {
    return (
      <div style={{ padding: 16, background: 'var(--color-ice-50)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: 13, color: 'var(--fg-muted)' }}>
        <AdminIcon name="loader" size={18} /> Caricamento miniatura…
      </div>
    );
  }
  if (url) {
    return (
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
        <img src={url} alt="" style={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 4 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>Miniatura collegata</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', wordBreak: 'break-all' }}>{url}</div>
        </div>
        <ABtn variant="ghost" size="sm" icon={<AdminIcon name="rotate-ccw" size={12} />} onClick={onPick}>Sostituisci</ABtn>
        <ABtn variant="ghost" size="sm" icon={<AdminIcon name="x" size={12} />} onClick={onClear}>Rimuovi</ABtn>
      </div>
    );
  }
  return (
    <button type="button" onClick={onPick}
      style={{ width: '100%', padding: '14px 18px', background: 'var(--bg-surface)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 13, color: 'var(--fg-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <AdminIcon name="image-up" size={16} />
      Carica miniatura (PNG/JPG, max 4 MB)
    </button>
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
