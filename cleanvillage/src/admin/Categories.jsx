import { useEffect, useState } from 'react';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, Modal, AField, AInput, ATextarea, ASelect, DataTable, useAdminStats } from './chrome.jsx';
import { listCategories, upsertCategory, deleteCategory } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const ICONS = ['truck', 'spray-can', 'flask-conical', 'shopping-cart', 'wind', 'shield', 'circle-dot', 'bug', 'sparkles', 'package', 'briefcase', 'factory'];
const KINDS = ['scrubber', 'washer', 'detergent', 'cart', 'vacuum', 'shoe', 'pad', 'dryer', 'spray', 'glass', 'paper'];

export default function AdminCategories() {
  const { refresh } = useAdminStats();
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const reload = async () => setItems(await listCategories());
  useEffect(() => { reload(); }, []);

  const handleSave = async (data, isNew) => {
    if (!isSupabaseConfigured) { alert('Configura Supabase per salvare.'); return; }
    if (isNew && !data.id) data.id = data.short.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await upsertCategory(data); setEditing(null); reload(); refresh();
  };

  const handleDelete = async (id) => {
    if (!confirm('Eliminare la categoria? I prodotti associati rimarranno senza categoria.')) return;
    await deleteCategory(id); setEditing(null); reload(); refresh();
  };

  return (
    <AdminPage
      eyebrow="Catalogo"
      title="Categorie"
      subtitle={`${items.length} categorie configurate. Ogni categoria raggruppa una famiglia di prodotti e appare nella home/landing.`}
      actions={[<ABtn key="n" variant="cta" icon={<AdminIcon name="plus" size={13} />} onClick={() => setEditing('new')}>Nuova categoria</ABtn>]}
    >
      <Panel padding={0}>
        <DataTable
          empty="Nessuna categoria."
          onRowClick={row => setEditing(row)}
          columns={[
            {
              key: 'ico', label: '', width: 56, render: r => (
                <div style={{ width: 36, height: 36, background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-xs)', display: 'grid', placeItems: 'center' }}>
                  <AdminIcon name={r.icon} size={16} />
                </div>
              )
            },
            { key: 'label', label: 'Categoria', render: r => <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{r.label}</div><div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{r.desc}</div></div> },
            { key: 'count', label: 'SKU', width: 80, render: r => <Badge tone="teal">{r.count}</Badge> },
            { key: 'kind', label: 'Tipo', width: 120, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.kind}</span> },
            { key: 'id', label: 'Slug', width: 120, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-500)' }}>{r.id}</span> },
          ]}
          rows={items}
        />
      </Panel>

      <CategoryModal open={editing !== null} cat={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={handleSave} onDelete={handleDelete} />
    </AdminPage>
  );
}

function CategoryModal({ open, cat, onClose, onSave, onDelete }) {
  const isNew = !cat;
  const [form, setForm] = useState({});
  useEffect(() => {
    setForm({
      id: cat?.id || '', label: cat?.label || '', short: cat?.short || '',
      icon: cat?.icon || ICONS[0], kind: cat?.kind || KINDS[0], desc: cat?.desc || '',
    });
  }, [cat, open]);

  const submit = (e) => { e.preventDefault(); onSave(form, isNew); };

  return (
    <Modal open={open} onClose={onClose} width={620}
      title={isNew ? 'Nuova categoria' : `Modifica · ${cat?.label}`}
      footer={<>
        {!isNew && <ABtn variant="danger" icon={<AdminIcon name="trash-2" size={13} />} onClick={() => onDelete(cat.id)}>Elimina</ABtn>}
        <span style={{ flex: 1 }} />
        <ABtn variant="secondary" onClick={onClose}>Annulla</ABtn>
        <ABtn variant="cta" onClick={submit} icon={<AdminIcon name="check" size={13} />}>{isNew ? 'Crea' : 'Salva'}</ABtn>
      </>}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
          <AField label="Nome esteso" required><AInput required value={form.label || ''} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Lavasciuga pavimenti" /></AField>
          <AField label="Nome breve" required><AInput required value={form.short || ''} onChange={e => setForm({ ...form, short: e.target.value })} placeholder="Lavasciuga" /></AField>
        </div>
        <AField label="Descrizione"><ATextarea value={form.desc || ''} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Uomo a bordo, uomo a terra…" /></AField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <AField label="Icona">
            <ASelect value={form.icon || ICONS[0]} onChange={e => setForm({ ...form, icon: e.target.value })}>
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </ASelect>
          </AField>
          <AField label="Tipo illustrazione">
            <ASelect value={form.kind || KINDS[0]} onChange={e => setForm({ ...form, kind: e.target.value })}>
              {KINDS.map(k => <option key={k} value={k}>{k}</option>)}
            </ASelect>
          </AField>
        </div>
      </form>
    </Modal>
  );
}
