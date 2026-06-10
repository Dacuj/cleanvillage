import { useEffect, useState, useMemo } from 'react';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, Modal, DataTable } from './chrome.jsx';
import { listQuotes } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function AdminUsers() {
  const [quotes, setQuotes] = useState([]);
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    listQuotes().then(setQuotes).catch(() => setQuotes([]));
  }, []);

  // Aggregate by email
  const buyers = useMemo(() => {
    const map = new Map();
    for (const q of quotes) {
      const key = (q.email || '').toLowerCase().trim() || `_anon_${q.id}`;
      if (!map.has(key)) {
        map.set(key, {
          key, email: q.email, company: q.company, vat: q.vat,
          contact_name: q.contact_name, phone: q.phone,
          count: 0, last: null, statuses: {}, requests: [],
        });
      }
      const b = map.get(key);
      b.count += 1;
      const t = new Date(q.created_at);
      if (!b.last || t > b.last) {
        b.last = t;
        b.contact_name = q.contact_name || b.contact_name;
        b.company = q.company || b.company;
        b.phone = q.phone || b.phone;
        b.vat = q.vat || b.vat;
      }
      b.statuses[q.status] = (b.statuses[q.status] || 0) + 1;
      b.requests.push(q);
    }
    return Array.from(map.values()).sort((a, b) => (b.last?.getTime() || 0) - (a.last?.getTime() || 0));
  }, [quotes]);

  const filtered = useMemo(() => {
    if (!search.trim()) return buyers;
    const q = search.toLowerCase();
    return buyers.filter(b =>
      (b.email || '').toLowerCase().includes(q) ||
      (b.company || '').toLowerCase().includes(q) ||
      (b.contact_name || '').toLowerCase().includes(q)
    );
  }, [buyers, search]);

  const stats = {
    total: buyers.length,
    won: buyers.filter(b => b.statuses.won).length,
    repeat: buyers.filter(b => b.count > 1).length,
  };

  return (
    <AdminPage
      eyebrow="Amministrazione"
      title="Contatti & buyer"
      subtitle="Tutti i clienti che hanno mai richiesto un contatto dal sito, aggregati per email."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        <Stat label="Contatti unici" value={stats.total} icon="users" desc="Per indirizzo email diverso" />
        <Stat label="Buyer attivi" value={stats.won} icon="check-circle" desc="Almeno un ordine confermato" />
        <Stat label="Clienti ricorrenti" value={stats.repeat} icon="repeat" desc="Più di una richiesta nel tempo" />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <AdminIcon name="search" size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cerca per nome, azienda o email…"
            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px 8px 34px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', fontSize: 13, outline: 'none' }} />
        </div>
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{filtered.length} contatti</span>
      </div>

      <Panel padding={0}>
        <DataTable
          empty={isSupabaseConfigured ? 'Nessun contatto registrato.' : 'Configura Supabase per accumulare i contatti.'}
          onRowClick={r => setOpen(r)}
          columns={[
            { key: 'avatar', label: '', width: 56, render: r => (
              <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>
                {(r.contact_name || r.company || r.email || '?').slice(0, 2).toUpperCase()}
              </span>
            ) },
            { key: 'name', label: 'Contatto', render: r => (
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{r.company || r.contact_name || 'Senza nome'}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>
                  {r.contact_name && r.company ? `${r.contact_name} · ` : ''}
                  {r.email || 'no-email'}
                </div>
              </div>
            ) },
            { key: 'phone', label: 'Telefono', width: 140, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.phone || '—'}</span> },
            { key: 'vat', label: 'P.IVA', width: 130, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.vat || '—'}</span> },
            { key: 'count', label: 'Richieste', width: 100, render: r => (
              <Badge tone={r.count > 1 ? 'mint' : 'neutral'}>{r.count} {r.count === 1 ? 'volta' : 'volte'}</Badge>
            ) },
            { key: 'status', label: 'Status', width: 140, render: r => {
              if (r.statuses.won) return <Badge tone="mint">Cliente confermato</Badge>;
              if (r.statuses.quoted) return <Badge tone="teal">Preventivo inviato</Badge>;
              if (r.statuses.contacted) return <Badge tone="amber">Contattato</Badge>;
              return <Badge tone="neutral">Da contattare</Badge>;
            } },
            { key: 'last', label: 'Ultima', width: 110, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.last?.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) || '—'}</span> },
          ]}
          rows={filtered}
        />
      </Panel>

      <BuyerModal open={open} onClose={() => setOpen(null)} />
    </AdminPage>
  );
}

function BuyerModal({ open, onClose }) {
  if (!open) return null;
  return (
    <Modal open={!!open} onClose={onClose} width={680} title={open.company || open.contact_name || open.email}
      footer={<>
        {open.email && <ABtn variant="ghost" icon={<AdminIcon name="mail" size={13} />} onClick={() => window.open(`mailto:${open.email}`)}>Email</ABtn>}
        {open.phone && <ABtn variant="ghost" icon={<AdminIcon name="phone" size={13} />} onClick={() => window.open(`tel:${open.phone}`)}>Chiama</ABtn>}
        <span style={{ flex: 1 }} />
        <ABtn variant="secondary" onClick={onClose}>Chiudi</ABtn>
      </>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <Info label="Contatto" value={open.contact_name || '—'} />
        <Info label="Email" value={open.email || '—'} />
        <Info label="Telefono" value={open.phone || '—'} />
        <Info label="P.IVA" value={open.vat || '—'} />
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>Storico richieste ({open.requests.length})</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {open.requests.map(q => (
          <div key={q.id} style={{ padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>
                CV-{q.id.slice(0, 6).toUpperCase()} · {new Date(q.created_at).toLocaleDateString('it-IT', { dateStyle: 'medium' })}
              </div>
              <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 4, lineHeight: 1.5 }}>{q.message?.slice(0, 200) || <em style={{ color: 'var(--fg-muted)' }}>Senza messaggio</em>}{q.message?.length > 200 ? '…' : ''}</div>
            </div>
            <Badge tone={q.status === 'won' ? 'mint' : q.status === 'lost' ? 'neutral' : 'teal'}>{q.status}</Badge>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function Stat({ label, value, icon, desc }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{label}</span>
        <span style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={icon} size={14} />
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 650, fontSize: 32, letterSpacing: '-0.035em', color: 'var(--fg-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{desc}</div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--fg-primary)' }}>{value}</div>
    </div>
  );
}
