import { useEffect, useState } from 'react';
import { AdminPage, AdminIcon, Badge, Panel, Modal, ABtn, DataTable, ASelect } from './chrome.jsx';
import { listQuotes, updateQuoteStatus } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const STATUS = {
  new: { label: 'Nuovo', tone: 'mint' },
  contacted: { label: 'Contattato', tone: 'teal' },
  quoted: { label: 'Preventivo inviato', tone: 'amber' },
  won: { label: 'Vinto', tone: 'mint' },
  lost: { label: 'Perso', tone: 'neutral' },
};

export default function AdminQuotes() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState('all');

  const reload = async () => setItems(await listQuotes());
  useEffect(() => { reload(); }, []);

  const filtered = filter === 'all' ? items : items.filter(q => q.status === filter);

  const setStatus = async (id, status) => {
    await updateQuoteStatus(id, status); reload();
    if (open?.id === id) setOpen({ ...open, status });
  };

  return (
    <AdminPage
      eyebrow="Pipeline commerciale"
      title="Preventivi"
      subtitle={isSupabaseConfigured
        ? `${items.length} richieste · ${items.filter(q => q.status === 'new').length} da prendere in carico`
        : 'Connetti Supabase per ricevere preventivi dal form contatti.'}
    >
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
        <ASelect value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto', minWidth: 200 }}>
          <option value="all">Tutti gli stati</option>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </ASelect>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{filtered.length} risultati</span>
      </div>

      <Panel padding={0}>
        <DataTable
          empty={isSupabaseConfigured ? 'Nessuna richiesta ricevuta.' : 'Configura Supabase per ricevere preventivi.'}
          onRowClick={row => setOpen(row)}
          columns={[
            { key: 'company', label: 'Azienda', render: r => <div><div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{r.company || '—'}</div><div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{r.contact_name} · {r.email}</div></div> },
            { key: 'timeline', label: 'Tempistica', width: 160, render: r => <span style={{ fontSize: 12 }}>{r.timeline || '—'}</span> },
            { key: 'created', label: 'Ricevuto', width: 160, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{new Date(r.created_at).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}</span> },
            { key: 'status', label: 'Stato', width: 180, render: r => <Badge tone={STATUS[r.status]?.tone || 'neutral'}>{STATUS[r.status]?.label || r.status}</Badge> },
          ]}
          rows={filtered}
        />
      </Panel>

      <Modal open={!!open} onClose={() => setOpen(null)} width={680}
        title={open ? `${open.company || 'Richiesta'} · ${new Date(open.created_at).toLocaleDateString('it-IT')}` : ''}
        footer={open && <>
          <span style={{ flex: 1 }} />
          <ASelect value={open.status} onChange={e => setStatus(open.id, e.target.value)} style={{ width: 'auto', minWidth: 200 }}>
            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </ASelect>
          <ABtn variant="secondary" onClick={() => setOpen(null)}>Chiudi</ABtn>
        </>}>
        {open && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13, lineHeight: 1.5 }}>
            <Row label="Azienda" value={open.company} />
            <Row label="P.IVA" value={open.vat} />
            <Row label="Contatto" value={open.contact_name} />
            <Row label="Email" value={<a href={`mailto:${open.email}`}>{open.email}</a>} />
            <Row label="Telefono" value={open.phone ? <a href={`tel:${open.phone}`}>{open.phone}</a> : '—'} />
            <Row label="Tempistica" value={open.timeline} />
            {open.needs && open.needs.length > 0 && <Row label="Esigenze" value={
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {open.needs.map((n, i) => <Badge key={i} tone="teal">{n}</Badge>)}
              </div>
            } />}
            <Row label="Messaggio" value={<div style={{ background: 'var(--color-ice-50)', padding: 12, borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap' }}>{open.message || '—'}</div>} />
          </div>
        )}
      </Modal>
    </AdminPage>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 14, alignItems: 'baseline' }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{label}</div>
      <div style={{ color: 'var(--fg-primary)' }}>{value || '—'}</div>
    </div>
  );
}
