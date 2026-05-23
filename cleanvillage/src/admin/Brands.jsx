import { useEffect, useState } from 'react';
import { AdminPage, AdminIcon, ABtn, Panel, Modal, AField, AInput, ASelect, DataTable, useAdminStats } from './chrome.jsx';
import { listBrands, upsertBrand, deleteBrand } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function AdminBrands() {
  const { refresh } = useAdminStats();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const reload = async () => setItems(await listBrands());
  useEffect(() => { reload(); }, []);

  const handleSave = async (data, isNew) => {
    if (!isSupabaseConfigured) { alert('Configura Supabase.'); return; }
    await upsertBrand(data); setEditing(null); reload(); refresh();
  };
  const handleDelete = async (id) => {
    if (!confirm('Eliminare il marchio?')) return;
    await deleteBrand(id); setEditing(null); reload(); refresh();
  };

  return (
    <AdminPage
      eyebrow="Catalogo"
      title="Marchi"
      subtitle={`${items.length} marchi distribuiti. Appaiono nel marquee in landing e come filtro nel catalogo.`}
      actions={[<ABtn key="n" variant="cta" icon={<AdminIcon name="plus" size={13} />} onClick={() => setEditing('new')}>Nuovo marchio</ABtn>]}
    >
      <Panel padding={0}>
        <DataTable
          empty="Nessun marchio."
          onRowClick={row => setEditing(row)}
          columns={[
            {
              key: 'wm', label: 'Wordmark', render: r => (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: r.weight, fontStyle: r.italic ? 'italic' : 'normal', letterSpacing: r.letter || 'normal', color: 'var(--fg-primary)' }}>{r.name}</span>
              )
            },
            { key: 'wt', label: 'Peso', width: 80, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.weight}</span> },
            { key: 'st', label: 'Stile', width: 100, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.italic ? 'Italic' : 'Roman'}</span> },
            { key: 'ls', label: 'Spacing', width: 100, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.letter || '—'}</span> },
          ]}
          rows={items}
        />
      </Panel>

      <BrandModal open={editing !== null} brand={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
    </AdminPage>
  );
}

function BrandModal({ open, brand, onClose, onSave, onDelete }) {
  const isNew = !brand;
  const [form, setForm] = useState({});
  useEffect(() => {
    setForm({
      id: brand?.id, name: brand?.name || '', weight: brand?.weight || 500,
      italic: !!brand?.italic, letter: brand?.letter || '',
    });
  }, [brand, open]);

  const submit = (e) => { e.preventDefault(); onSave(form, isNew); };

  return (
    <Modal open={open} onClose={onClose} width={500}
      title={isNew ? 'Nuovo marchio' : `Modifica · ${brand?.name}`}
      footer={<>
        {!isNew && <ABtn variant="danger" icon={<AdminIcon name="trash-2" size={13} />} onClick={() => onDelete(brand.id)}>Elimina</ABtn>}
        <span style={{ flex: 1 }} />
        <ABtn variant="secondary" onClick={onClose}>Annulla</ABtn>
        <ABtn variant="cta" onClick={submit} icon={<AdminIcon name="check" size={13} />}>{isNew ? 'Crea' : 'Salva'}</ABtn>
      </>}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AField label="Nome marchio" required><AInput required value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="KÄRCHER" /></AField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AField label="Peso font" hint="100–900">
            <ASelect value={form.weight || 500} onChange={e => setForm({ ...form, weight: parseInt(e.target.value) })}>
              {[300, 400, 500, 600, 700, 800].map(w => <option key={w} value={w}>{w}</option>)}
            </ASelect>
          </AField>
          <AField label="Italic">
            <ASelect value={form.italic ? '1' : '0'} onChange={e => setForm({ ...form, italic: e.target.value === '1' })}>
              <option value="0">No</option><option value="1">Sì</option>
            </ASelect>
          </AField>
        </div>
        <AField label="Letter spacing" hint='Es. "-0.02em" o "0.04em"'><AInput value={form.letter || ''} onChange={e => setForm({ ...form, letter: e.target.value })} placeholder="-0.02em" /></AField>

        <div style={{ padding: 14, background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 8 }}>Anteprima</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: form.weight || 500, fontStyle: form.italic ? 'italic' : 'normal', letterSpacing: form.letter || 'normal', color: 'var(--fg-primary)' }}>{form.name || 'Marchio'}</div>
        </div>
      </form>
    </Modal>
  );
}
