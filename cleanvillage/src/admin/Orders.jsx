import { useEffect, useState, useMemo } from 'react';
import { AdminPage, AdminIcon, Badge, Panel, Modal, ABtn, DataTable, ASelect, AField, ATextarea, useAdminStats } from './chrome.jsx';
import { listQuotes, updateQuoteStatus } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const STATUS = {
  new: { label: 'Da contattare', tone: 'amber', step: 1 },
  contacted: { label: 'In trattativa', tone: 'teal', step: 2 },
  quoted: { label: 'Preventivo inviato', tone: 'mint', step: 3 },
  won: { label: 'Confermato', tone: 'mint', step: 4 },
  lost: { label: 'Chiuso', tone: 'neutral', step: 0 },
};

export default function AdminOrders() {
  const { refresh: refreshCounts } = useAdminStats();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState('open');
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    try {
      setLoading(true);
      setItems(await listQuotes());
    } finally { setLoading(false); }
  };
  useEffect(() => { reload(); }, []);

  const visible = useMemo(() => {
    if (filter === 'all') return items;
    if (filter === 'open') return items.filter(q => q.status === 'new' || q.status === 'contacted' || q.status === 'quoted');
    if (filter === 'closed') return items.filter(q => q.status === 'won' || q.status === 'lost');
    return items.filter(q => q.status === filter);
  }, [items, filter]);

  const setStatus = async (id, status) => {
    await updateQuoteStatus(id, status);
    await reload();
    refreshCounts();
    if (open?.id === id) setOpen({ ...open, status });
  };

  const counts = {
    open: items.filter(q => q.status === 'new' || q.status === 'contacted' || q.status === 'quoted').length,
    new: items.filter(q => q.status === 'new').length,
    won: items.filter(q => q.status === 'won').length,
  };

  return (
    <AdminPage
      eyebrow="Amministrazione"
      title="Richieste contatto"
      subtitle="Tutte le persone che hanno chiesto di essere contattate per un acquisto. Sono notifiche di interesse — nessun pagamento è stato raccolto."
    >
      <ClarityBanner />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <KPICard label="Richieste aperte" value={counts.open} tone="amber" icon="inbox" desc="Da prendere in carico o in trattativa" />
        <KPICard label="Da contattare" value={counts.new} tone="teal" icon="phone-incoming" desc="Nuove richieste in coda" />
        <KPICard label="Confermate" value={counts.won} tone="mint" icon="check-circle" desc="Cliente che ha accettato il preventivo" />
        <KPICard label="Totale" value={items.length} tone="neutral" icon="archive" desc="Storico completo" />
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <FilterChip active={filter === 'open'} onClick={() => setFilter('open')} label="Aperte" count={counts.open} />
        <FilterChip active={filter === 'new'} onClick={() => setFilter('new')} label="Da contattare" count={counts.new} />
        <FilterChip active={filter === 'contacted'} onClick={() => setFilter('contacted')} label="In trattativa" />
        <FilterChip active={filter === 'quoted'} onClick={() => setFilter('quoted')} label="Preventivo inviato" />
        <FilterChip active={filter === 'closed'} onClick={() => setFilter('closed')} label="Chiuse / Vinte" />
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="Tutte" count={items.length} />
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{visible.length} risultati</span>
      </div>

      <Panel padding={0}>
        <DataTable
          empty={loading ? 'Caricamento…' : isSupabaseConfigured ? 'Nessuna richiesta in questo stato.' : 'Configura Supabase per ricevere richieste dal sito.'}
          onRowClick={row => setOpen(row)}
          columns={[
            {
              key: 'ref', label: 'Rif', width: 110, render: r => (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-500)', fontWeight: 600 }}>
                  CV-{r.id.slice(0, 6).toUpperCase()}
                </span>
              )
            },
            {
              key: 'company', label: 'Cliente', render: r => (
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{r.company || r.contact_name || 'Senza nome'}</div>
                  <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{r.contact_name && r.company ? `${r.contact_name} · ` : ''}{r.email}</div>
                </div>
              )
            },
            { key: 'needs', label: 'Esigenze', render: r => (
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {(r.needs || []).slice(0, 2).map((n, i) => <Badge key={i} tone="neutral">{n}</Badge>)}
                {(r.needs || []).length > 2 && <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>+{r.needs.length - 2}</span>}
              </div>
            ) },
            { key: 'timeline', label: 'Tempistica', width: 130, render: r => <span style={{ fontSize: 12 }}>{r.timeline || '—'}</span> },
            { key: 'created', label: 'Ricevuto', width: 130, render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{relTime(r.created_at)}</span> },
            { key: 'status', label: 'Stato', width: 160, render: r => <Badge tone={STATUS[r.status]?.tone || 'neutral'}>{STATUS[r.status]?.label || r.status}</Badge> },
          ]}
          rows={visible}
        />
      </Panel>

      <OrderModal open={open} onClose={() => setOpen(null)} onStatusChange={setStatus} />
    </AdminPage>
  );
}

function ClarityBanner() {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 18px', background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-500)', borderRadius: 'var(--radius-md)', marginBottom: 22 }}>
      <AdminIcon name="info" size={18} color="var(--color-teal-500)" />
      <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
        <b style={{ color: 'var(--color-teal-500)', fontWeight: 600 }}>Queste non sono ordini con pagamento.</b>{' '}
        Sul sito il cliente compila il form contatti o clicca "Richiedi preventivo" su una scheda prodotto. Il sistema gli manda
        una conferma di "pronta veduta" e a te arriva qui — devi richiamarlo tu per concordare prezzo, quantità e fatturazione.
      </div>
    </div>
  );
}

function OrderModal({ open, onClose, onStatusChange }) {
  const order = open;
  if (!order) return null;
  const reference = `CV-${order.id.slice(0, 6).toUpperCase()}`;
  return (
    <Modal open={!!order} onClose={onClose} width={760}
      title={`${reference} · ${order.company || order.contact_name || 'Richiesta'}`}
      footer={<>
        <ABtn variant="ghost" icon={<AdminIcon name="external-link" size={13} />}
          onClick={() => window.open(`mailto:${order.email}?subject=Richiesta ${reference}`)}>Rispondi via email</ABtn>
        {order.phone && (
          <ABtn variant="ghost" icon={<AdminIcon name="phone" size={13} />}
            onClick={() => window.open(`tel:${order.phone}`)}>Chiama</ABtn>
        )}
        <span style={{ flex: 1 }} />
        <ASelect value={order.status} onChange={e => onStatusChange(order.id, e.target.value)} style={{ width: 'auto', minWidth: 200 }}>
          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </ASelect>
        <ABtn variant="secondary" onClick={onClose}>Chiudi</ABtn>
      </>}>

      {/* Pipeline */}
      <Pipeline status={order.status} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 4 }}>
        <InfoCard label="Azienda" value={order.company} mono={false} />
        <InfoCard label="P.IVA" value={order.vat} />
        <InfoCard label="Contatto" value={order.contact_name} mono={false} />
        <InfoCard label="Email" value={order.email}
          link={order.email ? `mailto:${order.email}?subject=Richiesta ${reference}` : null} />
        <InfoCard label="Telefono" value={order.phone}
          link={order.phone ? `tel:${order.phone}` : null} />
        <InfoCard label="Ricevuto" value={new Date(order.created_at).toLocaleString('it-IT', { dateStyle: 'medium', timeStyle: 'short' })} />
        <InfoCard label="Tempistica" value={order.timeline} mono={false} />
        <InfoCard label="Riferimento" value={reference} />
      </div>

      {order.needs && order.needs.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <Label>Esigenze</Label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {order.needs.map((n, i) => <Badge key={i} tone="teal">{n}</Badge>)}
          </div>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <Label>Messaggio del cliente</Label>
        <div style={{ background: 'var(--color-ice-50)', padding: '14px 16px', borderRadius: 'var(--radius-sm)', whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.6, color: 'var(--fg-primary)' }}>
          {order.message || <span style={{ color: 'var(--fg-muted)', fontStyle: 'italic' }}>Nessun messaggio incluso.</span>}
        </div>
      </div>
    </Modal>
  );
}

function Pipeline({ status }) {
  const STEPS = [
    { key: 'new', label: 'Ricevuta', icon: 'inbox' },
    { key: 'contacted', label: 'Contattato', icon: 'phone' },
    { key: 'quoted', label: 'Preventivo', icon: 'file-text' },
    { key: 'won', label: 'Confermato', icon: 'check-circle' },
  ];
  const curStep = STATUS[status]?.step ?? 0;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 22, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      {STEPS.map((s, i) => {
        const reached = curStep >= s.step || (i + 1 === curStep);
        const active = STATUS[status]?.step === s.step;
        const lost = status === 'lost';
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: lost ? 0.5 : 1 }}>
            <span style={{
              width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center',
              background: reached ? 'var(--color-mint-500)' : 'var(--color-ice-100)',
              color: reached ? 'var(--color-white)' : 'var(--fg-muted)',
              border: active ? '2px solid var(--color-mint-700)' : 'none',
              flexShrink: 0,
            }}>
              <AdminIcon name={s.icon} size={13} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: reached ? 'var(--fg-primary)' : 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
            {i < STEPS.length - 1 && <span style={{ flex: 1, height: 2, background: 'var(--border-subtle)', maxWidth: 40 }} />}
          </div>
        );
      })}
    </div>
  );
}

function KPICard({ label, value, tone, icon, desc }) {
  const tones = {
    teal: { bg: 'var(--color-teal-50)', fg: 'var(--color-teal-500)' },
    mint: { bg: 'var(--color-mint-50)', fg: 'var(--color-mint-700)' },
    amber: { bg: 'var(--color-warning-100)', fg: 'var(--color-warning-500)' },
    neutral: { bg: 'var(--color-ice-100)', fg: 'var(--fg-secondary)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{label}</span>
        <span style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', background: t.bg, color: t.fg, borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={icon} size={14} />
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 650, fontSize: 32, letterSpacing: '-0.035em', color: 'var(--fg-primary)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{desc}</div>
    </div>
  );
}

function FilterChip({ active, onClick, label, count }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 12px',
      background: active ? 'var(--color-teal-500)' : 'var(--bg-surface)',
      color: active ? 'var(--color-white)' : 'var(--fg-secondary)',
      border: `1px solid ${active ? 'var(--color-teal-500)' : 'var(--border-default)'}`,
      borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600,
      fontFamily: 'var(--font-body)', display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      {label}
      {count != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, opacity: 0.8 }}>{count}</span>}
    </button>
  );
}

function InfoCard({ label, value, link, mono = true }) {
  return (
    <div>
      <Label>{label}</Label>
      {link ? (
        <a href={link} style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 13, color: 'var(--color-teal-500)', textDecoration: 'none', fontWeight: 500 }}>{value || '—'}</a>
      ) : (
        <div style={{ fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)', fontSize: 13, color: 'var(--fg-primary)' }}>{value || '—'}</div>
      )}
    </div>
  );
}

function Label({ children }) {
  return <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 6 }}>{children}</div>;
}

function relTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m fa`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h fa`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}g fa`;
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
}
