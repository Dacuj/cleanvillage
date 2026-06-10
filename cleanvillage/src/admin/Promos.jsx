import { useState } from 'react';
import { AdminPage, AdminIcon, ABtn, Panel, AField, AInput, ATextarea, ASelect } from './chrome.jsx';
import { useSiteContent, setSiteContent, resolveImageSlot } from '../lib/siteContent.js';
import { uploadLandingImage, deleteLandingImage } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const COLORS = [
  { v: 'mint', l: 'Verde mint' },
  { v: 'teal', l: 'Verde teal' },
  { v: 'amber', l: 'Ambra/giallo' },
  { v: 'ice', l: 'Bianco/ice' },
];

const KINDS = [
  { v: 'shoe', l: 'Scarpa / DPI' },
  { v: 'scrubber', l: 'Lavasciuga' },
  { v: 'paper', l: 'Carta' },
  { v: 'washer', l: 'Idropulitrice' },
  { v: 'vacuum', l: 'Aspirapolvere' },
  { v: 'detergent', l: 'Detergente' },
];

export default function AdminPromos() {
  const content = useSiteContent();
  const promos = content.promos || [];

  const update = (path, value) => {
    setSiteContent((cur) => {
      const next = structuredClone(cur);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof obj[keys[i]] !== 'object' || obj[keys[i]] === null) obj[keys[i]] = isNaN(Number(keys[i + 1])) ? {} : [];
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setPromoCount = (n) => {
    const cur = promos.slice();
    while (cur.length < n) cur.push({ tag: 'NUOVA PROMO', title: 'Titolo promo', subtitle: 'Sottotitolo', cta: 'Scopri', kind: 'scrubber', color: 'mint' });
    while (cur.length > n) cur.pop();
    update('promos', cur);
  };

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Promozioni"
      subtitle="Le card colorate che vedi in homepage sotto le categorie. Ne puoi avere fino a 3 attive contemporaneamente."
      actions={[
        <ABtn key="add" variant="cta" icon={<AdminIcon name="plus" size={13} />}
          onClick={() => setPromoCount(Math.min(3, promos.length + 1))}
          disabled={promos.length >= 3}>Aggiungi promo</ABtn>,
      ]}
    >
      {promos.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-surface)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-md)' }}>
          <AdminIcon name="megaphone" size={32} color="var(--fg-muted)" />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginTop: 12, color: 'var(--fg-primary)' }}>Nessuna promo attiva</div>
          <div style={{ fontSize: 13, color: 'var(--fg-muted)', marginTop: 6 }}>Clicca "Aggiungi promo" per crearne una.</div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {promos.map((p, i) => (
          <PromoEditor
            key={i}
            index={i}
            slot={`promo-${i}`}
            content={content}
            data={p}
            update={(field, value) => update(`promos.${i}.${field}`, value)}
            onRemove={() => {
              if (!confirm('Rimuovere questa promo dalla homepage?')) return;
              update('promos', promos.filter((_, k) => k !== i));
            }}
          />
        ))}
      </div>
    </AdminPage>
  );
}

function PromoEditor({ index, slot, content, data, update, onRemove }) {
  const img = resolveImageSlot(content, slot);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const setImage = (next) => {
    setSiteContent((cur) => {
      const c = structuredClone(cur);
      if (!c.images) c.images = {};
      c.images[slot] = next;
      return c;
    });
  };

  const onPickFile = async (file) => {
    if (!file) return;
    if (!isSupabaseConfigured) { setErr('Configura Supabase per caricare immagini.'); return; }
    try {
      setUploading(true); setErr('');
      const old = img;
      const uploaded = await uploadLandingImage(slot, file);
      setImage(uploaded);
      if (old?.storage_path) await deleteLandingImage(old.storage_path).catch(() => {});
    } catch (e) {
      setErr(e.message || 'Errore upload');
    } finally { setUploading(false); }
  };

  const removeImage = async () => {
    const old = img;
    setImage(null);
    if (old?.storage_path) await deleteLandingImage(old.storage_path).catch(() => {});
  };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <PromoPreview data={data} img={img} />

      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Promo {index + 1}</span>
          <button type="button" onClick={onRemove} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-danger-500)', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <AdminIcon name="trash-2" size={12} /> Rimuovi
          </button>
        </div>

        <AField label="Tag (badge)" hint='Es. "PROMO −30%" o "NOVITÀ 2026"'>
          <AInput value={data.tag || ''} onChange={(e) => update('tag', e.target.value)} />
        </AField>
        <AField label="Titolo">
          <AInput value={data.title || ''} onChange={(e) => update('title', e.target.value)} />
        </AField>
        <AField label="Sottotitolo">
          <ATextarea rows={2} value={data.subtitle || ''} onChange={(e) => update('subtitle', e.target.value)} />
        </AField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <AField label="Etichetta CTA">
            <AInput value={data.cta || ''} onChange={(e) => update('cta', e.target.value)} placeholder="Scopri di più" />
          </AField>
          <AField label="Colore">
            <ASelect value={data.color || 'mint'} onChange={(e) => update('color', e.target.value)}>
              {COLORS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
            </ASelect>
          </AField>
        </div>
        <AField label="Illustrazione di sfondo" hint="Se non carichi un'immagine, viene usata l'illustrazione SVG del tipo selezionato">
          <ASelect value={data.kind || 'scrubber'} onChange={(e) => update('kind', e.target.value)}>
            {KINDS.map(k => <option key={k.v} value={k.v}>{k.l}</option>)}
          </ASelect>
        </AField>

        <ImageBlock img={img} uploading={uploading} onPick={onPickFile} onRemove={removeImage} err={err} />
      </div>
    </div>
  );
}

function PromoPreview({ data, img }) {
  const COLORS = {
    mint: { bg: 'linear-gradient(135deg, #E6FBEE 0%, #D8E8FD 100%)', fg: 'var(--color-mint-800)' },
    teal: { bg: 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 100%)', fg: 'var(--color-teal-500)' },
    amber: { bg: 'linear-gradient(135deg, #FBE7C8 0%, #FBE2C0 100%)', fg: '#7A4504' },
    ice: { bg: 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 100%)', fg: 'var(--fg-primary)' },
  };
  const c = COLORS[data.color] || COLORS.mint;
  return (
    <div style={{ position: 'relative', aspectRatio: '4/3', background: c.bg, overflow: 'hidden' }}>
      {img?.url && (
        <img src={img.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }} />
      )}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 18 }}>
        <span style={{ alignSelf: 'flex-start', padding: '4px 10px', background: 'rgba(255,255,255,0.92)', color: c.fg, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 999 }}>{data.tag || '—'}</span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22, letterSpacing: '-0.02em', color: c.fg, marginBottom: 6, textShadow: img?.url ? '0 1px 6px rgba(255,255,255,0.6)' : 'none' }}>{data.title || 'Titolo promo'}</div>
          <div style={{ fontSize: 12, color: c.fg, opacity: 0.85, textShadow: img?.url ? '0 1px 6px rgba(255,255,255,0.6)' : 'none' }}>{data.subtitle || 'Sottotitolo'}</div>
        </div>
      </div>
    </div>
  );
}

function ImageBlock({ img, uploading, onPick, onRemove, err }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-secondary)', marginBottom: 8 }}>Immagine di sfondo</div>
      {img?.url ? (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10, background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <img src={img.url} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 4 }} />
          <span style={{ flex: 1, fontSize: 11, color: 'var(--fg-muted)', wordBreak: 'break-all' }}>{img.storage_path || img.url}</span>
          <button type="button" onClick={onRemove} style={{ background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', padding: '4px 8px', cursor: 'pointer', fontSize: 11, color: 'var(--color-danger-500)' }}>Rimuovi</button>
        </div>
      ) : (
        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 12, background: 'var(--color-ice-50)', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 12, color: 'var(--fg-secondary)' }}>
          <AdminIcon name="image-up" size={16} />
          <span>{uploading ? 'Caricamento…' : 'Carica immagine (PNG/JPG, max 4MB)'}</span>
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => onPick(e.target.files?.[0])} />
        </label>
      )}
      {err && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-danger-500)' }}>{err}</div>}
    </div>
  );
}
