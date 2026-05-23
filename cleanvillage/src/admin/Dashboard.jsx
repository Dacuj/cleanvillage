import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, DataTable, useAdminStats } from './chrome.jsx';
import { listProducts, listCategories, listQuotes, listCourses, listVideos } from '../lib/api.js';
import { useSiteContent } from '../lib/siteContent.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const QUOTE_STATUS = {
  new: { label: 'Da contattare', tone: 'amber' },
  contacted: { label: 'In trattativa', tone: 'teal' },
  quoted: { label: 'Inviato', tone: 'mint' },
  won: { label: 'Confermato', tone: 'mint' },
  lost: { label: 'Perso', tone: 'neutral' },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const content = useSiteContent();
  const { refresh } = useAdminStats();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    (async () => {
      const [p, c, q, co, v] = await Promise.all([
        listProducts(), listCategories(), listQuotes(), listCourses(), listVideos(),
      ]);
      setProducts(p); setCategories(c); setQuotes(q); setCourses(co); setVideos(v);
    })().catch(console.error);
  }, []);

  const newQuotes = quotes.filter(q => q.status === 'new').length;
  const openQuotes = quotes.filter(q => q.status === 'new' || q.status === 'contacted' || q.status === 'quoted').length;
  const wonQuotes = quotes.filter(q => q.status === 'won').length;
  const recent = quotes.slice(0, 5);

  // Conversion: won / total
  const totalClosed = quotes.filter(q => q.status === 'won' || q.status === 'lost').length;
  const winRate = totalClosed > 0 ? Math.round((wonQuotes / totalClosed) * 100) : null;

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    const part = hour < 12 ? 'Buongiorno' : hour < 18 ? 'Buon pomeriggio' : 'Buonasera';
    return `${part}.`;
  }, []);

  const subtitle = quotes.length === 0
    ? `Tutto pronto. ${products.length} SKU nel catalogo.`
    : `Hai ${newQuotes} richiest${newQuotes === 1 ? 'a' : 'e'} da contattare e ${openQuotes} in pipeline. ${products.length} SKU nel catalogo.`;

  const exportCsv = () => {
    const rows = [
      ['ID', 'Azienda', 'Contatto', 'Email', 'Telefono', 'Tempistica', 'Stato', 'Ricevuto', 'Messaggio'],
      ...quotes.map(q => [
        `CV-${q.id.slice(0, 6).toUpperCase()}`, q.company || '', q.contact_name || '', q.email || '', q.phone || '',
        q.timeline || '', q.status || '', new Date(q.created_at).toISOString(), (q.message || '').replace(/\n/g, ' '),
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `cleanvillage-richieste-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <AdminPage
      eyebrow={`Console interna · ${new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}`}
      title={greeting}
      subtitle={subtitle}
      actions={[
        <ABtn key="r" variant="secondary" icon={<AdminIcon name="download" size={13} />} onClick={exportCsv} disabled={quotes.length === 0}>Esporta richieste CSV</ABtn>,
        <ABtn key="n" variant="cta" icon={<AdminIcon name="plus" size={13} />} onClick={() => navigate('/admin/products')}>Nuovo prodotto</ABtn>,
      ]}
    >
      {!isSupabaseConfigured && (
        <div style={WARN}>
          <AdminIcon name="alert-triangle" size={16} color="var(--color-warning-500)" />
          <div style={{ flex: 1 }}>
            <b>Modalità demo · Supabase non collegato.</b>{' '}
            Stai vedendo i dati di esempio. Per ricevere richieste reali, collega Supabase e configura l'email da{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/settings'); }} style={{ color: 'var(--color-teal-500)', fontWeight: 600 }}>Impostazioni</a>.
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPI title="SKU attivi" value={products.length} trend={`${categories.length} categorie · ${products.filter(p => p.stock === 'low').length} in scorta limitata`} tone="teal" icon="package" onClick={() => navigate('/admin/products')} />
        <KPI title="Richieste aperte" value={openQuotes} trend={`${newQuotes} da contattare`} tone={newQuotes > 0 ? 'amber' : 'mint'} icon="inbox" onClick={() => navigate('/admin/orders')} />
        <KPI title="In evidenza" value={products.filter(p => p.is_highlighted).length} trend={`${products.filter(p => p.is_featured).length} in carosello featured`} tone="mint" icon="star" onClick={() => navigate('/admin/highlights')} />
        <KPI title="Tasso conversione" value={winRate != null ? `${winRate}%` : '—'} trend={`${wonQuotes} ordini confermati · ${totalClosed} chiusi`} tone="teal" icon="trending-up" />
      </div>

      <ClarificationBanner />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <Panel title="Richieste recenti" padding={0} action={
          <a href="#" onClick={e => { e.preventDefault(); navigate('/admin/orders'); }} style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-teal-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Vedi tutte <AdminIcon name="arrow-right" size={12} /></a>
        }>
          <DataTable
            empty={quotes.length === 0 ? 'Nessuna richiesta ricevuta.' : 'Nessuna richiesta recente.'}
            onRowClick={() => navigate('/admin/orders')}
            columns={[
              { key: 'ref', label: 'ID', render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-500)' }}>CV-{r.id.slice(0, 6).toUpperCase()}</span> },
              { key: 'co', label: 'Azienda', render: r => r.company || r.contact_name || '—' },
              { key: 'name', label: 'Contatto', render: r => <span style={{ fontSize: 12, color: 'var(--fg-secondary)' }}>{r.email}</span> },
              { key: 'tl', label: 'Tempistica', render: r => <span style={{ fontSize: 12 }}>{r.timeline || '—'}</span> },
              { key: 'st', label: 'Stato', render: r => <Badge tone={QUOTE_STATUS[r.status]?.tone || 'neutral'}>{QUOTE_STATUS[r.status]?.label || r.status}</Badge> },
              { key: 'd', label: 'Data', render: r => <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{new Date(r.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span> },
            ]}
            rows={recent}
          />
        </Panel>

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
            {categories.length === 0 && <div style={{ fontSize: 12, color: 'var(--fg-muted)' }}>Nessuna categoria configurata.</div>}
          </div>
        </Panel>
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <Mini title="Video landing" value={videos.length} sub={`${videos.filter(v => v.status === 'live').length} live`} icon="video" onClick={() => navigate('/admin/videos')} />
        <Mini title="Corsi attivi" value={courses.length} sub="Mostrati su 'Accademia'" icon="graduation-cap" onClick={() => navigate('/admin/courses')} />
        <Mini title="Promozioni" value={(content.promos || []).length} sub="Card in home" icon="megaphone" onClick={() => navigate('/admin/promos')} />
      </div>

      <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <QuickAction icon="plus" title="Nuovo prodotto" desc="Carica un SKU nel catalogo." onClick={() => navigate('/admin/products')} />
        <QuickAction icon="video" title="Carica video" desc="Aggiungi un video alla landing." onClick={() => navigate('/admin/videos')} />
        <QuickAction icon="megaphone" title="Nuova promozione" desc="Crea una card promo in home." onClick={() => navigate('/admin/promos')} />
        <QuickAction icon="mail" title="Configura email" desc="Imposta il mittente e i template." onClick={() => navigate('/admin/settings')} />
      </div>
    </AdminPage>
  );
}

function ClarificationBanner() {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 18px', background: 'var(--color-mint-50)', border: '1px solid var(--color-mint-300, #BDE9CC)', borderRadius: 'var(--radius-md)', marginBottom: 22 }}>
      <AdminIcon name="info" size={18} color="var(--color-mint-700)" />
      <div style={{ flex: 1, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>
        <b style={{ color: 'var(--color-mint-700)', fontWeight: 600 }}>Modello "contatto-per-acquistare".</b>{' '}
        Il sito non gestisce pagamenti. Quando un cliente compila il form o clicca "Richiedi preventivo" su un prodotto,
        riceve una conferma di "pronta veduta" e a te arriva una richiesta da gestire. Le richieste sono raccolte in
        <b> Richieste contatto </b>; le email automatiche si configurano in <b>Impostazioni</b>.
      </div>
    </div>
  );
}

function KPI({ title, value, trend, tone = 'teal', icon, onClick }) {
  const tones = {
    teal: { bg: 'var(--color-teal-50)', fg: 'var(--color-teal-500)' },
    mint: { bg: 'var(--color-mint-50)', fg: 'var(--color-mint-700)' },
    amber: { bg: 'var(--color-warning-100)', fg: 'var(--color-warning-500)' },
  };
  const t = tones[tone];
  const [hover, setHover] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hover && onClick ? 'var(--color-teal-500)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)', padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 6,
        position: 'relative', overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all var(--motion-fast)',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{title}</span>
        <span style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: t.bg, color: t.fg, borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={icon} size={16} />
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 42, letterSpacing: '-0.04em', color: 'var(--fg-primary)', lineHeight: 1, marginTop: 4 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{trend}</div>
    </div>
  );
}

function Mini({ title, value, sub, icon, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left', cursor: 'pointer',
        background: 'var(--bg-surface)',
        border: `1px solid ${hover ? 'var(--color-teal-500)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)', padding: '16px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all var(--motion-fast)',
      }}>
      <span style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'var(--color-ice-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)' }}>
        <AdminIcon name={icon} size={16} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 22, letterSpacing: '-0.025em', color: 'var(--fg-primary)' }}>{value}</span>
          <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{sub}</span>
        </div>
      </div>
    </button>
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
        borderRadius: 'var(--radius-md)', padding: '20px 22px',
        display: 'flex', flexDirection: 'column', gap: 10,
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-fast)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={icon} size={18} />
        </span>
        <AdminIcon name="arrow-right" size={14} color={hover ? 'var(--color-teal-500)' : 'var(--fg-muted)'} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 15, letterSpacing: '-0.015em', color: 'var(--fg-primary)', marginTop: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.5 }}>{desc}</div>
    </button>
  );
}

const WARN = { display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--color-warning-100)', border: '1px solid var(--color-warning-500)', borderRadius: 'var(--radius-md)', marginBottom: 18, fontSize: 13, color: 'var(--fg-primary)' };
