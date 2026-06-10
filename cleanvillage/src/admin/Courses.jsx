import { useEffect, useState } from 'react';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, Modal, AField, AInput, ATextarea, ASelect, DataTable, useAdminStats } from './chrome.jsx';
import { listCourses } from '../lib/api.js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

const LEVELS = ['Base', 'Avanzato', 'Specialist'];
const KINDS = [
  { v: 'safety', l: 'Sicurezza', bg: 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 100%)' },
  { v: 'machine', l: 'Macchine', bg: 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 100%)' },
  { v: 'chemicals', l: 'Detergenti / Chimica', bg: 'linear-gradient(135deg, #E6FBEE 0%, #D8E8FD 100%)' },
  { v: 'sales', l: 'Gare / commerciale', bg: 'linear-gradient(135deg, #FBE7C8 0%, #FBE2C0 100%)' },
];

async function upsertCourse(course) {
  if (!isSupabaseConfigured) throw new Error('Supabase non configurato');
  const payload = {
    id: course.id, title: course.title, level: course.level, duration: course.duration,
    mode: course.mode, next_date: course.nextDate, price: course.price,
    description: course.desc, kind: course.kind, bg: course.bg, sort_order: course.sort_order ?? 0,
  };
  const { error } = await supabase.from('courses').upsert(payload);
  if (error) throw error;
}

async function deleteCourse(id) {
  const { error } = await supabase.from('courses').delete().eq('id', id);
  if (error) throw error;
}

export default function AdminCourses() {
  const { refresh } = useAdminStats();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    try { setLoading(true); setItems(await listCourses()); }
    finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const handleSave = async (data, isNew) => {
    if (!isSupabaseConfigured) { alert('Configura Supabase per salvare i corsi.'); return; }
    try {
      if (isNew && !data.id) data.id = (data.title || 'corso').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30) + '-' + Date.now().toString(36).slice(-4);
      // Pick a gradient based on kind if not provided
      if (!data.bg) data.bg = (KINDS.find(k => k.v === data.kind) || KINDS[0]).bg;
      await upsertCourse(data);
      setEditing(null);
      await reload(); refresh();
    } catch (e) { alert('Errore: ' + e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminare definitivamente questo corso?')) return;
    try { await deleteCourse(id); setEditing(null); await reload(); refresh(); }
    catch (e) { alert('Errore: ' + e.message); }
  };

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Corsi & formazione"
      subtitle={loading ? 'Caricamento corsi…' : `${items.length} corsi configurati. Appaiono nella sezione "Accademia Clean Village" della homepage.`}
      actions={[
        <ABtn key="n" variant="cta" icon={<AdminIcon name="plus" size={13} />} onClick={() => setEditing('new')}>Nuovo corso</ABtn>,
      ]}
    >
      {!isSupabaseConfigured && (
        <div style={WARN}>
          <AdminIcon name="alert-triangle" size={16} color="var(--color-warning-500)" />
          <span><b>Modalità demo:</b> stai vedendo i corsi di esempio. Configura Supabase per modificarli.</span>
        </div>
      )}

      <Panel padding={0}>
        <DataTable
          empty={loading ? 'Caricamento…' : 'Nessun corso. Clicca "Nuovo corso" per crearne uno.'}
          onRowClick={r => setEditing(r)}
          columns={[
            { key: 'thumb', label: '', width: 64, render: r => (
              <div style={{ width: 48, height: 48, background: r.bg || 'var(--color-ice-50)', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center' }}>
                <AdminIcon name={iconForKind(r.kind)} size={20} color="var(--fg-primary)" />
              </div>
            ) },
            { key: 'title', label: 'Corso', render: r => (
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{r.desc?.slice(0, 80)}{r.desc?.length > 80 ? '…' : ''}</div>
              </div>
            ) },
            { key: 'level', label: 'Livello', width: 110, render: r => <Badge tone={r.level === 'Base' ? 'mint' : r.level === 'Avanzato' ? 'teal' : 'amber'}>{r.level}</Badge> },
            { key: 'duration', label: 'Durata', width: 130, render: r => <span style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>{r.duration}</span> },
            { key: 'nextDate', label: 'Prossima data', width: 200, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{r.nextDate}</span> },
            { key: 'price', label: 'Prezzo', width: 90, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600 }}>{r.price}</span> },
          ]}
          rows={items}
        />
      </Panel>

      <CourseModal open={editing !== null} course={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
    </AdminPage>
  );
}

function iconForKind(kind) {
  return ({ safety: 'shield-check', machine: 'wrench', chemicals: 'flask-conical', sales: 'briefcase' }[kind]) || 'graduation-cap';
}

function CourseModal({ open, course, onClose, onSave, onDelete }) {
  const isNew = !course;
  const [form, setForm] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm({
      id: course?.id || '',
      title: course?.title || '',
      level: course?.level || 'Base',
      duration: course?.duration || '8 ore · 1 giornata',
      mode: course?.mode || 'Aula',
      nextDate: course?.nextDate || '',
      price: course?.price || '€180',
      desc: course?.desc || '',
      kind: course?.kind || 'safety',
      bg: course?.bg || '',
      sort_order: course?.sort_order ?? 0,
    });
  }, [open, course]);

  const submit = (e) => { e.preventDefault(); onSave(form, isNew); };

  return (
    <Modal open={open} onClose={onClose} width={640}
      title={isNew ? 'Nuovo corso' : `Modifica · ${course?.title}`}
      footer={<>
        {!isNew && <ABtn variant="danger" icon={<AdminIcon name="trash-2" size={13} />} onClick={() => onDelete(course.id)}>Elimina</ABtn>}
        <span style={{ flex: 1 }} />
        <ABtn variant="secondary" onClick={onClose}>Annulla</ABtn>
        <ABtn variant="cta" onClick={submit} icon={<AdminIcon name="check" size={13} />}>{isNew ? 'Crea corso' : 'Salva'}</ABtn>
      </>}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AField label="Titolo del corso" required>
          <AInput required value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sicurezza & DPI in cantiere" />
        </AField>
        <AField label="Descrizione" hint="Mostrata sotto al titolo della card corso">
          <ATextarea rows={3} value={form.desc || ''} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Uso corretto dei DPI, valutazione rischi…" />
        </AField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <AField label="Livello">
            <ASelect value={form.level || 'Base'} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </ASelect>
          </AField>
          <AField label="Tipologia (icona/sfondo)">
            <ASelect value={form.kind || 'safety'} onChange={(e) => setForm({ ...form, kind: e.target.value, bg: (KINDS.find(k => k.v === e.target.value) || KINDS[0]).bg })}>
              {KINDS.map(k => <option key={k.v} value={k.v}>{k.l}</option>)}
            </ASelect>
          </AField>
          <AField label="Durata">
            <AInput value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="8 ore · 1 giornata" />
          </AField>
          <AField label="Modalità">
            <AInput value={form.mode || ''} onChange={(e) => setForm({ ...form, mode: e.target.value })} placeholder="Aula o on-site" />
          </AField>
          <AField label="Prossima data" hint='Es. "18 giu 2026 · Busto Arsizio"'>
            <AInput value={form.nextDate || ''} onChange={(e) => setForm({ ...form, nextDate: e.target.value })} />
          </AField>
          <AField label="Prezzo" hint="Mostrato come stringa (es. €180)">
            <AInput value={form.price || ''} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </AField>
        </div>

        <div style={{ padding: 14, background: form.bg || 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>Anteprima card</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--fg-primary)' }}>{form.title || 'Titolo corso'}</div>
          <div style={{ fontSize: 12, marginTop: 4, color: 'var(--fg-secondary)' }}>{form.level} · {form.duration} · {form.price}</div>
        </div>
      </form>
    </Modal>
  );
}

const WARN = { display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--color-warning-100)', border: '1px solid var(--color-warning-500)', borderRadius: 'var(--radius-md)', marginBottom: 18, fontSize: 12, color: 'var(--fg-primary)' };
