import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, DataTable } from './chrome.jsx';
import { listProducts, listCategories, listQuotes } from '../lib/api.js';

const QUOTE_STATUS = {
  new: { label: 'Da rispondere', tone: 'amber' },
  contacted: { label: 'In trattativa', tone: 'teal' },
  quoted: { label: 'Inviato', tone: 'mint' },
  won: { label: 'Accettato', tone: 'mint' },
  lost: { label: 'Perso', tone: 'neutral' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    (async () => {
      const [p, c, q] = await Promise.all([listProducts(), listCategories(), listQuotes()]);
      setProducts(p); setCategories(c); setQuotes(q);
    })().catch(console.error);
  }, []);

  const skuCount = products.length;
  const newQuotes = quotes.filter(q => q.status === 'new').length;
  const inProgress = quotes.filter(q => q.status === 'contacted' || q.status === 'quoted').length;
  const recent = quotes.slice(0, 5);
  const greeting = `${quotes.length === 0 ? 'Tutto pronto.' : `Hai ${newQuotes} preventiv${newQuotes === 1 ? 'o' : 'i'} da prendere in carico.`} ${skuCount} SKU nel catalogo.`;

  return (
    <AdminPage
      eyebrow={`Console interna · ${new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      title="Buongiorno."
      subtitle={greeting}
      actions={[
        <ABtn key="r" variant="secondary" icon={<AdminIcon name="download" size={13} />}>Esporta report</ABtn>,
        <ABtn key="n" variant="cta" icon={<AdminIcon name="plus" size={13} />} onClick={() => navigate('/admin/products')}>Nuovo prodotto</ABtn>,
      ]}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        <KPI title="SKU attivi" value={skuCount} trend={`${categories.length} categorie`} tone="teal" icon="package" />
        <KPI title="Categorie" value={categories.length} trend="Catalogo organizzato" tone="mint" icon="folder-tree" />
        <KPI title="Preventivi totali" value={quotes.length} trend={`${newQuotes} nuovi · ${inProgress} attivi`} tone="amber" icon="file-text" />
        <KPI title="In evidenza" value={products.filter(p => p.is_highlighted).length} trend="Macchine in evidenza" tone="teal" icon="star" />
      </div>

      {/* 2 column area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        {/* Recent quotes */}
        <Panel title="Preventivi recenti" padding={0} action={
          <a href="#" onClick={e => { e.preventDefault(); navigate('/admin/quotes'); }} style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-teal-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Vedi tutti <AdminIcon name="arrow-right" size={12} /></a>
        }>
          <DataTable
            empty={quotes.length === 0 ? 'Nessun preventivo ricevuto.' : 'Nessun preventivo recente.'}
            onRowClick={() => navigate('/admin/quotes')}
            columns={[
              { key: 'ref', label: 'ID', render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-500)' }}>{r.id.slice(0, 8)}</span> },
              { key: 'co', label: 'Azienda', render: r => r.company || '—' },
              { key: 'name', label: 'Contatto', render: r => <span style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>{r.contact_name}</span> },
              { key: 'tl', label: 'Tempistica', render: r => <span style={{ fontSize: 12 }}>{r.timeline || '—'}</span> },
              { key: 'st', label: 'Stato', render: r => <Badge tone={QUOTE_STATUS[r.status]?.tone || 'neutral'}>{QUOTE_STATUS[r.status]?.label || r.status}</Badge> },
              { key: 'd', label: 'Data', render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{new Date(r.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span> },
            ]}
            rows={recent}
          />
        </Panel>

        {/* Catalog health */}
        <Panel title="Catalogo · stato per categoria" padding={20}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {categories.slice(0, 8).map(c => {
              const actualCount = products.filter(p => p.catId === c.id).length;
              const maxCount = Math.max(1, ...categories.map(x => products.filter(p => p.catId === x.id).length));
              const pct = Math.min(100, Math.round((actualCount / maxCount) * 100));
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--fg-primary)' }}>{c.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{actualCount} SKU</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-ice-100)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'var(--color-teal-500)', borderRadius: 3, transition: 'width 200ms' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        <QuickAction icon="plus" title="Aggiungi un nuovo prodotto" desc="Carica un nuovo SKU nel catalogo, assegnalo alla categoria giusta e pubblicalo nel sito." onClick={() => navigate('/admin/products')} />
        <QuickAction icon="video" title="Carica un nuovo video" desc="Aggiungi un video alla landing — tour, demo, intervista — con titolo, durata e posizione." onClick={() => navigate('/admin/videos')} />
        <QuickAction icon="megaphone" title="Crea una promozione" desc="Imposta uno sconto a scaglioni o una promo a tempo, visibile nella strip della homepage." onClick={() => navigate('/admin/promos')} />
      </div>
    </AdminPage>
  );
}

function KPI({ title, value, trend, tone = 'teal', icon }) {
  const tones = {
    teal: { bg: 'var(--color-teal-50)', fg: 'var(--color-teal-500)' },
    mint: { bg: 'var(--color-mint-50)', fg: 'var(--color-mint-700)' },
    amber: { bg: 'var(--color-warning-100)', fg: 'var(--color-warning-500)' },
  };
  const t = tones[tone];
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{title}</span>
        <span style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: t.bg, color: t.fg, borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={icon} size={16} />
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 42, letterSpacing: '-0.04em', color: 'var(--fg-primary)', lineHeight: 1, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <AdminIcon name="trending-up" size={11} color="var(--color-mint-700)" />
        {trend}
      </div>
    </div>
  );
}

function QuickAction({ icon, title, desc, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', cursor: 'pointer',
        background: 'var(--bg-surface)',
        border: `1px solid ${hover ? 'var(--color-teal-500)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)', padding: '22px 24px',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-fast)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={icon} size={20} />
        </span>
        <AdminIcon name="arrow-right" size={16} color={hover ? 'var(--color-teal-500)' : 'var(--fg-muted)'} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 16, letterSpacing: '-0.015em', color: 'var(--fg-primary)', marginTop: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{desc}</div>
    </button>
  );
}
