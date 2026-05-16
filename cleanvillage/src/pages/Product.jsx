import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon, Button, Eyebrow, Spec, StockPill } from '../components/ui.jsx';
import { ProductIllustration, ProductCard } from '../components/product.jsx';
import { listCategories, listProducts, getProduct } from '../lib/api.js';

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [cats, setCats] = useState([]);
  const [tab, setTab] = useState('specs');
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);

  useEffect(() => {
    Promise.all([listCategories(), listProducts(), getProduct(id)]).then(([c, p, single]) => {
      setCats(c); setProducts(p); setProduct(single || p[0] || null); setView(0);
    }).catch(console.error);
  }, [id]);

  if (!product) {
    return <main style={{ background: 'var(--bg-page)', minHeight: 400, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-muted)' }}>Caricamento prodotto…</main>;
  }
  const cat = cats.find(c => c.id === product.catId) || cats[0] || { label: 'Catalogo' };
  const gallery = product.images && product.images.length ? product.images : [];
  const galleryCount = Math.max(gallery.length, 1);
  const basePrice = parseInt((product.price || '0').replace(/[^\d]/g, '')) || 0;
  const tiers = [
    { qty: '1–2', price: product.price, save: '—' },
    { qty: '3–9', price: `€${(basePrice * 0.93).toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, save: '−7%' },
    { qty: '10–24', price: `€${(basePrice * 0.86).toLocaleString('it-IT', { maximumFractionDigits: 0 })}`, save: '−14%' },
    { qty: '25+', price: 'A preventivo', save: 'Custom' },
  ];

  const related = products.filter(p => p.catId === product?.catId && p.id !== product?.id).slice(0, 4);

  return (
    <main style={{ background: 'var(--bg-page)' }}>
      {/* Breadcrumb */}
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: '18px 32px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
          <a href="/" onClick={e => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Home</a>
          <Icon name="chevron-right" size={12} />
          <a href="/catalog" onClick={e => { e.preventDefault(); navigate('/catalog'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Catalogo</a>
          <Icon name="chevron-right" size={12} />
          <a href="/catalog" onClick={e => { e.preventDefault(); navigate('/catalog'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>{cat.label}</a>
          <Icon name="chevron-right" size={12} />
          <span style={{ color: 'var(--fg-primary)' }}>{product.name}</span>
        </div>
      </section>

      {/* Main product layout */}
      <section style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: '40px 32px 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 48 }}>
          {/* Gallery */}
          <div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', aspectRatio: '1/1', display: 'grid', placeItems: 'center', overflow: 'hidden', position: 'relative' }}>
              {gallery.length > 0 ? (
                <img src={gallery[view]?.url} alt={gallery[view]?.alt || product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 32 }} />
              ) : (
                <div style={{ width: '68%' }}><ProductIllustration kind={product.kind} hover={false} /></div>
              )}
              {product.badge && (
                <div style={{ position: 'absolute', top: 20, left: 20, padding: '5px 11px', background: 'var(--color-mint-500)', color: 'var(--color-white)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 'var(--radius-xs)', boxShadow: 'var(--shadow-cta)' }}>
                  {product.badge}
                </div>
              )}
              <div style={{ position: 'absolute', bottom: 20, right: 20, padding: '5px 10px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', borderRadius: 'var(--radius-xs)' }}>
                {view + 1} / {galleryCount}
              </div>
              {galleryCount > 1 && <>
                <button style={{ position: 'absolute', top: '50%', right: 20, transform: 'translateY(-50%)', width: 40, height: 40, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-card)' }}
                  onClick={() => setView((view + 1) % galleryCount)}>
                  <Icon name="chevron-right" size={16} />
                </button>
                <button style={{ position: 'absolute', top: '50%', left: 20, transform: 'translateY(-50%)', width: 40, height: 40, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '50%', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-card)' }}
                  onClick={() => setView((view + galleryCount - 1) % galleryCount)}>
                  <Icon name="chevron-left" size={16} />
                </button>
              </>}
            </div>
            {gallery.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(gallery.length, 6)}, 1fr)`, gap: 10, marginTop: 14 }}>
                {gallery.slice(0, 6).map((img, i) => (
                  <button key={img.id || i} onClick={() => setView(i)} style={{
                    aspectRatio: '1/1', background: 'var(--bg-surface)', cursor: 'pointer',
                    border: `1px solid ${view === i ? 'var(--color-teal-500)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center', padding: 6, overflow: 'hidden',
                    opacity: view === i ? 1 : 0.65, transition: 'all var(--motion-fast)',
                  }}>
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}

            {/* Documents row */}
            <div style={{ marginTop: 32, padding: '18px 22px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <Eyebrow>Documenti tecnici</Eyebrow>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
                {[
                  { t: 'Scheda tecnica', s: 'PDF · 2,4 MB' },
                  { t: "Manuale d'uso", s: 'PDF · 8,1 MB' },
                  { t: 'Scheda sicurezza', s: 'PDF · 1,2 MB' },
                ].map(d => (
                  <a key={d.t} href="#" onClick={e => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', textDecoration: 'none', color: 'var(--fg-primary)' }}>
                    <Icon name="file-text" size={18} color="var(--color-teal-500)" />
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{d.t}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)' }}>{d.s}</span>
                    </div>
                    <Icon name="download" size={14} color="var(--fg-muted)" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Info column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 600 }}>{product.brand}</span>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--fg-muted)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>RIF · {product.sku}</span>
              <span style={{ marginLeft: 'auto' }}><StockPill status={product.stock} count={product.count} /></span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(28px, 3vw, 38px)', letterSpacing: '-0.035em', margin: '0 0 16px', lineHeight: 1.06, textWrap: 'balance' }}>
              {product.name}
            </h1>
            <p style={{ margin: '0 0 24px', color: 'var(--fg-secondary)', fontSize: 15, lineHeight: 1.6 }}>
              {product.description || 'Macchina compatta a uomo a bordo per superfici da 800 a 4.000 m². Serbatoio in polietilene rotostampato, gruppo aspirante a 3 stadi, programmazione touch — pronta per appalti e contesti industriali pesanti.'}
            </p>

            {/* Spec chips */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
              {(product.specs || []).map((s, i) => <Spec key={i}>{s}</Spec>)}
              <Spec>Garanzia 24 mesi</Spec>
              <Spec>CE · Made in Italy</Spec>
            </div>

            {/* Price block */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '24px 26px', marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Prezzo base</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 40, letterSpacing: '-0.035em', color: 'var(--fg-primary)', lineHeight: 1 }}>{product.price}</span>
                    <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>+ IVA</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-mint-700)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Risparmio fino al</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 32, letterSpacing: '-0.03em', color: 'var(--color-mint-700)', marginTop: 4, lineHeight: 1 }}>−14%</div>
                </div>
              </div>

              {/* Tiered price table */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: 18 }}>
                {tiers.map((t, i) => (
                  <div key={t.qty} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.6fr', padding: '10px 14px', background: i === 1 ? 'var(--color-mint-50)' : i % 2 ? 'var(--color-ice-50)' : 'transparent', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-secondary)' }}>{t.qty} pz</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>{t.price}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: i === 0 ? 'var(--fg-muted)' : 'var(--color-mint-700)', textAlign: 'right' }}>{t.save}</span>
                  </div>
                ))}
              </div>

              {/* Qty + Quote CTA */}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'stretch' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 42, height: 46, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-primary)', fontSize: 18 }}>−</button>
                  <input value={qty} onChange={e => setQty(parseInt(e.target.value) || 1)} style={{ width: 46, height: 46, border: 'none', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, background: 'transparent', outline: 'none', borderLeft: '1px solid var(--border-default)', borderRight: '1px solid var(--border-default)' }} />
                  <button onClick={() => setQty(qty + 1)} style={{ width: 42, height: 46, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-primary)', fontSize: 18 }}>+</button>
                </div>
                <Button variant="cta" size="lg" full onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>
                  Richiedi preventivo per {qty} {qty === 1 ? 'unità' : 'unità'}
                </Button>
              </div>
            </div>

            {/* Service strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { i: 'truck', t: 'Spedizione', s: '5–7 giorni · UE' },
                { i: 'wrench', t: 'Officina', s: 'Service interno' },
                { i: 'rotate-ccw', t: 'Resi & RMA', s: 'Garanzia 24 mesi' },
              ].map(b => (
                <div key={b.t} style={{ padding: '14px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name={b.i} size={18} color="var(--color-teal-500)" />
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-primary)' }}>{b.t}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)' }}>{b.s}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab section */}
        <div style={{ marginTop: 64, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border-subtle)' }}>
            {[
              { id: 'specs', label: 'Specifiche tecniche' },
              { id: 'features', label: 'Caratteristiche' },
              { id: 'service', label: 'Service & ricambi' },
              { id: 'reviews', label: 'Recensioni · 17' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '18px 20px', background: 'transparent', border: 'none', cursor: 'pointer',
                color: tab === t.id ? 'var(--color-teal-500)' : 'var(--fg-secondary)',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: tab === t.id ? 600 : 500,
                borderBottom: `2px solid ${tab === t.id ? 'var(--color-teal-500)' : 'transparent'}`,
                marginBottom: -1,
              }}>{t.label}</button>
            ))}
          </div>
          <div style={{ padding: '40px 0' }}>
            {tab === 'specs' && <SpecsTable />}
            {tab === 'features' && <FeaturesList />}
            {tab === 'service' && <ServiceInfo />}
            {tab === 'reviews' && <ReviewsList />}
          </div>
        </div>
      </section>

      {/* Related products */}
      <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 32 }}>
            <div>
              <Eyebrow>Della stessa categoria</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 32, letterSpacing: '-0.03em', margin: '12px 0 0' }}>
                Articoli correlati.
              </h2>
            </div>
            <Button variant="ghost" onClick={() => navigate('/catalog')} iconRight={<Icon name="arrow-right" size={14} />}>Vedi tutta la categoria</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {related.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate(`/product/${p.id}`)} />)}
          </div>
        </div>
      </section>
    </main>
  );
}

function SpecsTable() {
  const rows = [
    ['Tipologia', 'Lavasciuga pavimenti uomo a bordo'],
    ['Larghezza piste', '1000 mm'],
    ['Serbatoio soluzione', '145 L'],
    ['Serbatoio recupero', '160 L'],
    ['Autonomia', '4 ore (con batteria al gel)'],
    ['Resa oraria teorica', '7.000 m²/h'],
    ['Pressione spazzole', '50 kg (max 130 kg)'],
    ['Motore aspirazione', '720 W · 3 stadi'],
    ['Velocità max', '7 km/h'],
    ['Pendenza superabile', '10% (16% in trasferimento)'],
    ['Alimentazione', '36 V · 4× 6V 240 Ah gel'],
    ['Carica batterie', 'Incluso · 36 V 30 A'],
    ['Peso a vuoto', '420 kg'],
    ['Peso a pieno carico', '745 kg'],
    ['Dimensioni (L×P×H)', '1640 × 800 × 1430 mm'],
    ['Livello rumorosità', '67 dB(A)'],
    ['Origine', 'Made in Italy'],
    ['Certificazioni', 'CE · EMC 2014/30/UE · MD 2006/42/CE'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 64px' }}>
      <div>
        {rows.slice(0, 9).map((r) => (
          <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', gap: 24 }}>
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{r[0]}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-primary)', fontWeight: 500 }}>{r[1]}</span>
          </div>
        ))}
      </div>
      <div>
        {rows.slice(9).map((r) => (
          <div key={r[0]} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)', gap: 24 }}>
            <span style={{ fontSize: 13, color: 'var(--fg-muted)' }}>{r[0]}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-primary)', fontWeight: 500 }}>{r[1]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesList() {
  const feats = [
    { i: 'cpu', t: 'Pannello touch programmabile', d: 'Tre programmi salvabili: piste, intensità detergente, pressione spazzole.' },
    { i: 'battery', t: 'Autonomia 4 ore', d: 'Batteria al gel 36V 240Ah, carica rapida 4h. Opzione litio disponibile.' },
    { i: 'droplets', t: 'Dosaggio detergente automatico', d: 'Sistema EDS che regola la concentrazione di chimico in base alla velocità.' },
    { i: 'shield-check', t: 'Telaio in acciaio rinforzato', d: 'Protezioni paracolpi, copertura motore stagna IPX4, ruote anti-traccia.' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
      {feats.map(f => (
        <div key={f.t} style={{ display: 'flex', gap: 18, padding: '24px 26px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
            <Icon name={f.i} size={20} />
          </span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 17, letterSpacing: '-0.02em', color: 'var(--fg-primary)', marginBottom: 6 }}>{f.t}</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55 }}>{f.d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ServiceInfo() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
      <div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Officina autorizzata</h4>
        <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>
          Service interno per Comac, Nilfisk, Hako e Tennant. Interventi su appuntamento entro 48 ore per le macchine sotto contratto, ricambi originali sempre in pronta consegna.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['Contratto Base', '€480 / anno', '1 tagliando + ricambi a tariffa'],
            ['Contratto Plus', '€790 / anno', '2 tagliandi + sostituzioni standard'],
            ['Full Service H24', '€1.450 / anno', 'Tagliandi + ricambi inclusi + macchina sostitutiva'],
          ].map(([t, p, s]) => (
            <div key={t} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--fg-primary)' }}>{t}</div>
                <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 2 }}>{s}</div>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--color-teal-500)' }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Ricambi compatibili</h4>
        <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>
          Spazzole, dischi, lame tergi-pavimento e filtri originali sempre disponibili. Consegna nazionale entro 48h, programma stock-and-hold per cliente.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['SP-1000-NRY', 'Spazzola disco nylon 1000 mm', '€78'],
            ['BL-1100-PU', 'Lama tergi-pavimento poliuretano 1100 mm', '€44'],
            ['FT-RX-H13', 'Filtro aspirazione H13 OEM', '€110'],
            ['BAT-36-240', 'Batteria al gel 36V 240Ah · set 4 pz', '€2.840'],
          ].map(([sku, name, price]) => (
            <a key={sku} href="#" onClick={e => e.preventDefault()} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'inherit' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-500)', fontWeight: 500, width: 120 }}>{sku}</span>
              <span style={{ fontSize: 13, color: 'var(--fg-primary)' }}>{name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-primary)', fontWeight: 500 }}>{price}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewsList() {
  const reviews = [
    { n: 'Marco R.', co: 'Servizi Industriali Lombardi', d: '12.03.2026', r: 5, t: 'Macchina solida, costruita per durare. Abbiamo 6 lavasciuga della stessa famiglia in tre cantieri diversi, zero problemi in 4 anni. Il service è il vero plus.' },
    { n: 'Elena B.', co: 'Multiservizi Veneto', d: '04.02.2026', r: 5, t: 'Configurazione iniziale curata bene dal trade desk. Hanno fatto venire un tecnico in struttura per dimensionare batterie e larghezza piste, niente sorprese.' },
    { n: 'Davide L.', co: 'Pulinet Brescia', d: '19.01.2026', r: 4, t: "Ottima macchina, l'unica nota è il rumore del gruppo aspirante in ambiente alimentare. Per il resto consigliata, soprattutto per il rapporto qualità-prezzo." },
  ];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--fg-primary)' }}>4,8</div>
          <div style={{ color: '#E5A302', fontSize: 16, letterSpacing: '2px', marginTop: 6 }}>★★★★★</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', marginTop: 6 }}>17 recensioni verificate</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[5, 4, 3, 2, 1].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
              <span style={{ width: 14 }}>{s}★</span>
              <span style={{ flex: 1, height: 6, background: 'var(--color-ice-100)', borderRadius: 3, overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${[78, 16, 6, 0, 0][5 - s]}%`, background: s >= 4 ? 'var(--color-mint-500)' : 'var(--color-ice-300)' }} />
              </span>
              <span style={{ width: 24, textAlign: 'right' }}>{[13, 3, 1, 0, 0][5 - s]}</span>
            </div>
          ))}
        </div>
        <Button variant="secondary">Scrivi una recensione</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {reviews.map(r => (
          <div key={r.n} style={{ padding: '22px 26px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--fg-primary)' }}>{r.n}</span>
                <span style={{ fontSize: 12, color: 'var(--fg-muted)', marginLeft: 8 }}>· {r.co}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>{r.d}</span>
            </div>
            <div style={{ color: '#E5A302', fontSize: 13, letterSpacing: '2px', marginBottom: 10 }}>{'★'.repeat(r.r)}{'☆'.repeat(5 - r.r)}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--fg-secondary)' }}>{r.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
