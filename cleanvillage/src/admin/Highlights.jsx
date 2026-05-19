import { useState, useEffect, useRef } from 'react';
import { AdminPage, AdminIcon, ABtn, Panel } from './chrome.jsx';
import { getImageSlot, setImageSlot } from '../components/ImageSlot.jsx';

const LANDING_SLOTS = [
  {
    id: 'hero',
    title: 'Hero principale',
    desc: 'Visuale a fianco del titolo nella sezione di apertura della homepage (desktop).',
    aspect: '4 / 5',
    section: 'Hero',
  },
  {
    id: 'hm-comac-innova',
    title: 'COMAC Innova 100 B · Uomo a bordo',
    desc: '1ª macchina nella sezione "Macchine in evidenza".',
    aspect: '4 / 3',
    section: 'Macchine in evidenza',
  },
  {
    id: 'hm-karcher-hd',
    title: 'KÄRCHER HD 9/20-4 Cage Plus',
    desc: '2ª macchina nella sezione "Macchine in evidenza".',
    aspect: '4 / 3',
    section: 'Macchine in evidenza',
  },
  {
    id: 'hm-ghibli-vac',
    title: 'GHIBLI Power WD 90.2 Aspiraliquidi',
    desc: '3ª macchina nella sezione "Macchine in evidenza".',
    aspect: '4 / 3',
    section: 'Macchine in evidenza',
  },
];

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminHighlights() {
  const [images, setImages] = useState({});
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const next = {};
    LANDING_SLOTS.forEach(s => { next[s.id] = getImageSlot(s.id); });
    setImages(next);
  }, []);

  const filled = LANDING_SLOTS.filter(s => images[s.id]).length;

  const handleUpload = async (id, file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Il file deve essere un\'immagine (JPG, PNG, WebP, …).');
      return;
    }
    setError('');
    setBusy(id);
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageSlot(id, dataUrl);
      setImages(prev => ({ ...prev, [id]: dataUrl }));
    } catch (e) {
      setError('Errore nel caricamento dell\'immagine. Probabile spazio insufficiente nel browser.');
    } finally {
      setBusy(null);
    }
  };

  const handleRemove = (id) => {
    if (!confirm('Rimuovere l\'immagine? Verrà ripristinata l\'illustrazione di default.')) return;
    setImageSlot(id, null);
    setImages(prev => ({ ...prev, [id]: null }));
  };

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Immagini della landing"
      subtitle="Carica, sostituisci o rimuovi le immagini che compaiono nella homepage. Le modifiche sono immediate: aggiorna o riapri la home per vederle live."
      actions={[
        <ABtn key="v" variant="secondary" icon={<AdminIcon name="external-link" size={13} />} onClick={() => window.open('/', '_blank')}>Apri la home</ABtn>,
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Counter label="Slot totali" value={LANDING_SLOTS.length} icon="image" tone="teal" />
        <Counter label="Immagini caricate" value={filled} icon="check-circle" tone="mint" />
        <Counter label="Default (illustrazione)" value={LANDING_SLOTS.length - filled} icon="layers" tone="neutral" />
        <Counter label="Storage" value="localStorage" icon="hard-drive" tone="neutral" mono />
      </div>

      {error && (
        <div style={{ padding: 12, marginBottom: 18, background: 'var(--color-warning-100)', border: '1px solid var(--color-warning-500)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--color-warning-500)' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
        {LANDING_SLOTS.map(slot => (
          <SlotCard
            key={slot.id}
            slot={slot}
            image={images[slot.id]}
            busy={busy === slot.id}
            onUpload={(file) => handleUpload(slot.id, file)}
            onRemove={() => handleRemove(slot.id)}
          />
        ))}
      </div>

      <div style={{ marginTop: 24, padding: '18px 22px', background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
          <AdminIcon name="info" size={18} />
        </span>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, color: 'var(--fg-primary)' }}>Come funzionano queste immagini</div>
          <div style={{ fontSize: 12.5, color: 'var(--fg-secondary)', lineHeight: 1.55, marginTop: 4 }}>
            Le immagini sono salvate nel browser (localStorage) e sostituiscono le illustrazioni di default sulla homepage. Se non carichi nulla, viene mostrata l'illustrazione tecnica originale. Per renderle persistenti su tutti i dispositivi e gli utenti, configura Supabase Storage seguendo <code style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--bg-surface)', padding: '1px 6px', border: '1px solid var(--border-subtle)', borderRadius: 3 }}>SUPABASE_SETUP.md</code>.
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

function Counter({ label, value, icon, tone, mono }) {
  const tones = {
    teal: { bg: 'var(--color-teal-50)', fg: 'var(--color-teal-500)' },
    mint: { bg: 'var(--color-mint-50)', fg: 'var(--color-mint-700)' },
    neutral: { bg: 'var(--color-ice-100)', fg: 'var(--fg-secondary)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{label}</span>
        <span style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', background: t.bg, color: t.fg, borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={icon} size={15} />
        </span>
      </div>
      <div style={{
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
        fontWeight: mono ? 500 : 200,
        fontSize: mono ? 14 : 32,
        letterSpacing: mono ? '0' : '-0.04em',
        color: 'var(--fg-primary)', lineHeight: 1.05, marginTop: 4,
      }}>{value}</div>
    </div>
  );
}

function SlotCard({ slot, image, busy, onUpload, onRemove }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  const pick = () => inputRef.current?.click();
  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = '';
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <Panel padding={0}>
      <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-mint-700)' }}>{slot.section}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--fg-primary)', marginTop: 4 }}>{slot.title}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 4, lineHeight: 1.5 }}>{slot.desc}</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: image ? 'var(--color-mint-700)' : 'var(--fg-muted)', whiteSpace: 'nowrap', padding: '3px 9px', background: image ? 'var(--color-mint-50)' : 'var(--color-ice-100)', border: '1px solid var(--border-subtle)', borderRadius: 999, fontWeight: 600, letterSpacing: '0.06em', flexShrink: 0 }}>
          {image ? '● CARICATA' : '○ DEFAULT'}
        </span>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={!image && !busy ? pick : undefined}
        style={{
          aspectRatio: slot.aspect,
          background: image ? '#0F2330' : 'var(--color-ice-50)',
          position: 'relative',
          cursor: image ? 'default' : (busy ? 'wait' : 'pointer'),
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onChange}
        />
        {image ? (
          <img src={image} alt={slot.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center', padding: 24,
            background: dragging ? 'rgba(10,77,104,0.10)' : 'transparent',
            border: dragging ? '2px dashed var(--color-teal-500)' : '2px dashed transparent',
            transition: 'all var(--motion-fast)',
          }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', display: 'grid', placeItems: 'center', color: 'var(--fg-muted)' }}>
              <AdminIcon name={busy ? 'loader' : 'image-plus'} size={22} />
            </span>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 16, letterSpacing: '-0.015em', color: 'var(--fg-primary)' }}>
              {busy ? 'Caricamento…' : 'Trascina un\'immagine qui'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>oppure clicca per scegliere un file dal computer</div>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
          imgslot:{slot.id}
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <ABtn size="sm" variant="secondary" icon={<AdminIcon name="upload" size={12} />} onClick={pick} disabled={busy}>
            {image ? 'Sostituisci' : 'Carica'}
          </ABtn>
          {image && (
            <ABtn size="sm" variant="danger" icon={<AdminIcon name="trash-2" size={12} />} onClick={onRemove}>
              Rimuovi
            </ABtn>
          )}
        </div>
      </div>
    </Panel>
  );
}
