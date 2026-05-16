import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, TrustBar, Eyebrow, Spec } from '../components/ui.jsx';
import { ProductCard, ProductIllustration } from '../components/product.jsx';
import { ImageSlot } from '../components/ImageSlot.jsx';
import { TweaksContext } from '../components/TweaksPanel.jsx';
import { useCategories, useBrands, useProducts, useCourses, useIndustries } from '../lib/storefront.js';
import { useIsMobile } from '../lib/useBreakpoint.js';

export default function Landing() {
  const tweaks = useContext(TweaksContext) || {};
  const navigate = useNavigate();
  return (
    <main>
      <Hero tweaks={tweaks} />
      {tweaks.showMarquee !== false && <BrandMarquee />}
      <CategoryShowcase tweaks={tweaks} />
      <PromoStrip />
      <HighlightedMachines />
      <IndustriesGrid />
      <VideoAziendale />
      <FormazioneCorsi />
      <FeaturedProducts />
      <QuoteCTA />
    </main>
  );
}

function Hero({ tweaks }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const tone = tweaks?.headlineTone || 'human';
  return (
    <section style={{ background: 'var(--bg-surface)', position: 'relative' }}>
      <TrustBar height={3} />
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '40px 20px 0' : '72px 32px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr', gap: isMobile ? 36 : 64, alignItems: 'center' }}>
          <div>
            <Eyebrow>Distributore B2B · Italia &amp; UE · dal 1985</Eyebrow>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 200,
              fontSize: 'clamp(38px, 6.6vw, 84px)', lineHeight: 0.98,
              letterSpacing: '-0.04em', color: 'var(--fg-primary)',
              margin: '24px 0 26px', textWrap: 'balance'
            }}>
              {tone === 'technical' ?
                <>500+ SKU. 24 marchi. <em style={{ fontStyle: 'normal', color: 'var(--color-teal-500)', fontWeight: 300 }}>Un solo fornitore.</em></> :
                <>Macchinari e forniture per chi <em style={{ fontStyle: 'normal', color: 'var(--color-teal-500)', fontWeight: 300 }}>pulisce di mestiere</em>.</>
              }
            </h1>
            <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.55, color: 'var(--fg-secondary)', maxWidth: '52ch', margin: '0 0 36px', fontWeight: 400 }}>
              Quarant'anni di forniture per imprese di pulizia, fabbriche e strutture in tutto il Sud Italia. Oltre <b style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>500 codici a magazzino</b>, <b style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>24 marchi</b>, preventivo entro 24 ore.
            </p>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button variant="cta" size="lg" onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>Richiedi un Preventivo</Button>
              {!isMobile && <Button variant="secondary" size="lg" onClick={() => navigate('/catalog')} iconRight={<Icon name="chevron-right" size={14} />}>Esplora il Catalogo</Button>}
            </div>
            {!isMobile && (
              <div style={{ marginTop: 44, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ display: 'flex' }}>
                  {[0, 1, 2, 3].map(i =>
                    <span key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: `hsl(${190 + i * 8}, 26%, ${68 - i * 8}%)`, border: '2px solid var(--bg-surface)', marginLeft: i ? -8 : 0 }} />
                  )}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)', letterSpacing: '-0.01em' }}>1.400+ contractor servono i propri clienti con CleanVillage</div>
                  <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 1, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: '#E5A302', letterSpacing: '1px' }}>★★★★★</span> 4,9 / 5 su Trustpilot · 312 recensioni
                  </div>
                </div>
              </div>
            )}
          </div>
          {!isMobile && <HeroVisual />}
        </div>
        {/* stat ribbon */}
        <div style={{ marginTop: isMobile ? 36 : 56, padding: isMobile ? '24px 0' : '32px 0', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 20 : 32 }}>
          <Stat value="40" unit="anni" label="Attività ininterrotta" />
          <Stat value="500" unit="+" label="Codici a magazzino" />
          <Stat value="24" unit="h" label="Risposta preventivo" accent />
          <Stat value="12k" unit="m²" label="Magazzino + showroom" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, unit, label, accent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 56, lineHeight: 1, letterSpacing: '-0.04em', color: accent ? 'var(--color-teal-500)' : 'var(--fg-primary)' }}>{value}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 22, color: 'var(--fg-muted)', letterSpacing: '-0.03em' }}>{unit}</span>
      </div>
      <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function HeroVisual() {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        aspectRatio: '4/5',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #E8F2F5 0%, #C6DEE5 60%, #6FA1B0 100%)',
        border: '1px solid var(--border-subtle)',
        position: 'relative'
      }}>
        <svg viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#0A4D68" strokeWidth="1.6">
          <g transform="translate(40, 130)">
            <rect x="20" y="80" width="280" height="140" rx="14" fill="#FFFFFF" />
            <rect x="20" y="80" width="280" height="140" rx="14" />
            <rect x="120" y="20" width="90" height="70" rx="10" fill="#0A4D68" />
            <rect x="135" y="35" width="60" height="20" rx="3" fill="#062E40" />
            <rect x="210" y="42" width="6" height="60" fill="#2C3E4A" />
            <path d="M210 100 L260 110 L260 130 L210 120 Z" fill="#2C3E4A" />
            <rect x="60" y="100" width="80" height="44" rx="4" fill="#C6DEE5" />
            <rect x="60" y="100" width="80" height="44" rx="4" />
            <rect x="68" y="108" width="64" height="6" rx="1" fill="#25D366" opacity="0.4" />
            <rect x="68" y="120" width="40" height="6" rx="1" fill="#25D366" opacity="0.6" />
            <rect x="160" y="100" width="62" height="44" rx="4" fill="#062E40" />
            <circle cx="175" cy="115" r="3" fill="#25D366" />
            <circle cx="190" cy="115" r="3" fill="#C97A0C" />
            <rect x="170" y="125" width="42" height="10" rx="2" fill="#0A4D68" />
            <circle cx="65" cy="240" r="28" fill="#0F2330" />
            <circle cx="65" cy="240" r="14" fill="#2C3E4A" />
            <circle cx="65" cy="240" r="6" fill="#0A4D68" />
            <circle cx="255" cy="240" r="28" fill="#0F2330" />
            <circle cx="255" cy="240" r="14" fill="#2C3E4A" />
            <circle cx="255" cy="240" r="6" fill="#0A4D68" />
            <rect x="10" y="200" width="300" height="14" rx="3" fill="#0A4D68" />
            <rect x="14" y="214" width="292" height="18" rx="2" fill="#25D366" opacity="0.5" />
            <path d="M30 232 L30 254 M60 232 L60 256 M90 232 L90 254 M120 232 L120 256 M150 232 L150 254 M180 232 L180 256 M210 232 L210 254 M240 232 L240 256 M270 232 L270 254" stroke="#0A4D68" strokeWidth="0.8" />
            <rect x="20" y="200" width="280" height="3" fill="#25D366" />
          </g>
          <text x="120" y="190" fontFamily="Outfit" fontSize="14" fontWeight="500" fill="#0A4D68" letterSpacing="-0.02em">CleanVillage</text>
        </svg>

        <div style={{ position: 'absolute', left: 20, bottom: 20, right: 20, background: 'rgba(255,255,255,0.96)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-mint-700)', fontWeight: 600 }}>Best seller 2026</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 17, color: 'var(--fg-primary)', letterSpacing: '-0.025em', marginTop: 3 }}>COMAC Innova 100 B</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>145 L · 1000 mm · 4 h autonomia</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--fg-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Da</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 24, color: 'var(--fg-primary)', letterSpacing: '-0.03em' }}>€18.400</div>
          </div>
        </div>

        <div style={{ position: 'absolute', top: 18, right: 18, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'var(--color-mint-500)', color: 'var(--color-white)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, borderRadius: 999, boxShadow: 'var(--shadow-cta)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-white)' }} /> Disponibile · 4 pz
          </span>
          <span style={{ padding: '4px 9px', background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-secondary)' }}>RIF · COM-IN100B</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: -18, left: -32, background: 'var(--color-teal-500)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '14px 18px', boxShadow: 'var(--shadow-pop)', maxWidth: 220 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-mint-300)', fontWeight: 600, marginBottom: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-mint-500)', boxShadow: '0 0 0 4px rgba(37,211,102,0.25)' }} />
          Offerta in corso
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Sconti progressivi su <b style={{ fontWeight: 500 }}>Detergenti Kiehl</b> per ordini ≥ 5 fusti.
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-teal-100)', marginTop: 8, opacity: 0.85 }}>Fino al 31.05.2026</div>
      </div>
    </div>
  );
}

function BrandMarquee() {
  const brands = useBrands();
  const items = [...brands, ...brands];
  return (
    <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '28px 0 32px', marginTop: 48 }}>
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', gap: 28, marginBottom: 18 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', whiteSpace: 'nowrap' }}>Rivenditore autorizzato</span>
        <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-teal-500)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Vedi tutti i 24 marchi <Icon name="arrow-right" size={12} />
        </a>
      </div>
      <div style={{ position: 'relative', overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
        <div style={{ display: 'flex', gap: 64, animation: 'cvMarquee 50s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {items.map((b, i) =>
            <span key={i} style={{ fontFamily: 'var(--font-display)', fontWeight: b.weight, fontSize: 22, color: 'var(--color-ice-400)', letterSpacing: b.letter || '0', fontStyle: b.italic ? 'italic' : 'normal', flexShrink: 0 }}>{b.name}</span>
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryShowcase({ tweaks }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const cats = useCategories();
  const style = tweaks?.categoryStyle || 'magazine';
  return (
    <section style={{ padding: isMobile ? '64px 20px 48px' : '112px 32px 96px', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: isMobile ? 28 : 48, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Catalogo · 11 categorie · 571 SKU</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(28px, 4.4vw, 54px)', letterSpacing: '-0.035em', margin: '14px 0 0', textWrap: 'balance', maxWidth: '20ch', lineHeight: 1.04 }}>
              Tutto ciò che serve alla tua operazione.
            </h2>
          </div>
          {!isMobile && <Button variant="ghost" onClick={() => navigate('/catalog')} iconRight={<Icon name="arrow-right" size={14} />}>Esplora il catalogo completo</Button>}
        </div>

        {style === 'magazine' && <>
          {isMobile ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {cats.slice(0, 6).map((c, i) => <CategoryTile key={c.id} cat={c} index={i} onClick={() => navigate('/catalog')} />)}
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 20 }}>
                <CategoryTile cat={cats[0]} index={0} size="xl" onClick={() => navigate('/catalog')} style={{ gridRow: 'span 2' }} />
                <CategoryTile cat={cats[1]} index={1} onClick={() => navigate('/catalog')} />
                <CategoryTile cat={cats[2]} index={2} onClick={() => navigate('/catalog')} />
                <CategoryTile cat={cats[3]} index={3} onClick={() => navigate('/catalog')} />
                <CategoryTile cat={cats[4]} index={4} onClick={() => navigate('/catalog')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginTop: 20 }}>
                {cats.slice(5).map(c => <CategoryPill key={c.id} cat={c} onClick={() => navigate('/catalog')} />)}
              </div>
            </>
          )}
        </>}

        {style === 'grid' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 18 }}>
            {cats.map((c, i) => <CategoryTile key={c.id} cat={c} index={i} onClick={() => navigate('/catalog')} />)}
          </div>
        )}

        {style === 'list' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 1, background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {cats.map(c => <CategoryRow key={c.id} cat={c} onClick={() => navigate('/catalog')} />)}
          </div>
        )}

        {isMobile && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button variant="ghost" onClick={() => navigate('/catalog')} iconRight={<Icon name="arrow-right" size={14} />}>Esplora il catalogo completo</Button>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryRow({ cat, onClick }) {
  const [hover, setHover] = useState(false);
  if (!cat) return null;
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 26px', background: hover ? 'var(--color-ice-50)' : 'var(--bg-surface)', transition: 'background var(--motion-fast)' }}>
        <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
          <Icon name={cat.icon} size={20} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1.2 }}>{cat.label}</div>
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 3 }}>{cat.desc}</div>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500 }}>{cat.count} SKU</span>
        <Icon name="arrow-right" size={16} color={hover ? 'var(--color-teal-500)' : 'var(--fg-muted)'} />
      </div>
    </a>
  );
}

function CategoryTile({ cat, index = 0, size = 'md', onClick, style: extraStyle }) {
  const [hover, setHover] = useState(false);
  const big = size === 'xl';
  if (!cat) return null;
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit', ...extraStyle }}>
      <div style={{
        height: '100%', minHeight: big ? 540 : 260,
        background: hover ? 'var(--bg-surface)' : 'var(--color-ice-100)',
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
        boxShadow: hover ? 'var(--shadow-pop)' : 'none',
        transition: 'all var(--motion-base)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: big ? '32px' : '22px'
      }}>
        <div style={{ position: 'absolute', right: big ? -40 : -20, bottom: big ? -40 : -10, width: '78%', opacity: hover ? 0.95 : 0.85, transition: 'all var(--motion-base)', transform: hover ? 'scale(1.04) translateY(-4px)' : 'scale(1)' }}>
          <ProductIllustration kind={cat.kind} hover={false} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: 'var(--fg-muted)', letterSpacing: '0.04em' }}>{String(index + 1).padStart(2, '0')}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: big ? 38 : 22, letterSpacing: '-0.03em', margin: '8px 0 0', lineHeight: 1.06, color: 'var(--fg-primary)', maxWidth: big ? '14ch' : '18ch' }}>
              {cat.label}
            </h3>
            {big && <p style={{ fontSize: 15, color: 'var(--fg-secondary)', lineHeight: 1.55, margin: '14px 0 0', maxWidth: '34ch', fontWeight: 400 }}>
              Uomo a bordo o uomo a terra, batteria al gel o litio. Configurazione e prova in showroom prima dell'acquisto.
            </p>}
          </div>
          {hover && (
            <span style={{ width: 36, height: 36, background: 'var(--color-mint-500)', color: 'var(--color-white)', borderRadius: '50%', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-cta)' }}>
              <Icon name="arrow-right" size={16} />
            </span>
          )}
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, color: 'var(--fg-primary)', background: 'var(--bg-surface)', padding: '4px 9px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border-subtle)' }}>
            {cat.count} SKU
          </span>
          {big && <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>· Comac · Nilfisk · Hako · Tennant</span>}
        </div>
      </div>
    </a>
  );
}

function CategoryPill({ cat, onClick }) {
  const [hover, setHover] = useState(false);
  if (!cat) return null;
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px 16px 14px',
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-fast)',
        display: 'flex', flexDirection: 'column', gap: 10, height: '100%', boxSizing: 'border-box'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'var(--color-ice-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-xs)' }}>
            <Icon name={cat.icon} size={16} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', fontWeight: 500 }}>{cat.count} SKU</span>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13, color: 'var(--fg-primary)', lineHeight: 1.3, marginTop: 2 }}>
          {cat.label}
        </div>
      </div>
    </a>
  );
}

function PromoStrip() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const promos = [
    { tag: 'PROMO −30%', title: 'Calzature Technosafe S3', subtitle: 'Su scorte selezionate · fino esaurimento', cta: 'Approfitta ora', kind: 'shoe', color: 'mint' },
    { tag: 'NOVITÀ 2026', title: 'COMAC Innova 100 B', subtitle: 'La nuova generazione uomo a bordo', cta: 'Scopri la macchina', kind: 'scrubber', color: 'teal' },
    { tag: 'BANCALE', title: 'Lucart EcoNatural — 24 conf.', subtitle: 'Carta tissue 100% riciclata', cta: 'Calcola il risparmio', kind: 'paper', color: 'teal' }
  ];
  return (
    <section style={{ padding: isMobile ? '0 20px 0' : '0 32px 0', background: 'var(--bg-page)', marginBottom: isMobile ? 56 : 96 }}>
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 16 }}>
        {promos.map((p, i) => <PromoCard key={i} promo={p} onClick={() => navigate('/catalog')} />)}
      </div>
    </section>
  );
}

function PromoCard({ promo, onClick }) {
  const [hover, setHover] = useState(false);
  const dark = promo.color === 'teal';
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick(); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        position: 'relative', overflow: 'hidden',
        borderRadius: 'var(--radius-md)',
        padding: '28px 28px 24px',
        minHeight: 200,
        background: dark ? 'var(--color-teal-500)' : 'var(--color-mint-500)',
        color: 'var(--color-white)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-base)'
      }}>
        <div style={{ position: 'absolute', right: -30, bottom: -20, width: '55%', opacity: 0.18, transform: hover ? 'scale(1.08)' : 'scale(1)', transition: 'transform var(--motion-slow)' }}>
          <ProductIllustration kind={promo.kind} hover={false} />
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ display: 'inline-block', padding: '4px 9px', borderRadius: 'var(--radius-xs)', background: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>
            {promo.tag}
          </span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 26, letterSpacing: '-0.03em', margin: '14px 0 6px', color: 'var(--color-white)', lineHeight: 1.1 }}>{promo.title}</h3>
          <p style={{ fontSize: 13, color: dark ? 'var(--color-teal-100)' : 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5, maxWidth: '34ch' }}>{promo.subtitle}</p>
        </div>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, marginTop: 18 }}>
          {promo.cta} <Icon name="arrow-right" size={14} />
        </div>
      </div>
    </a>
  );
}

function HighlightedMachines() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const machines = [
    {
      id: 'comac-innova', eyebrow: 'Punta di diamante · COMAC', name: 'Innova 100 B Uomo a Bordo',
      tagline: 'La lavasciuga che più imprese hanno scelto nel 2025.',
      desc: 'Macchina compatta per superfici da 800 a 4.000 m². Telaio in acciaio rinforzato, gruppo aspirante a 3 stadi e pannello touch programmabile con tre profili di pulizia salvabili. Pensata per lavorare turni doppi senza fermo macchina.',
      specs: [['Serbatoio', '145 L'], ['Piste', '1000 mm'], ['Autonomia', '4 h'], ['Resa oraria', '7.000 m²/h']],
      pid: 'rx220', side: 'left', bg: 'linear-gradient(160deg, #E8F2F5 0%, #C6DEE5 70%, #6FA1B0 100%)', tone: 'light', placeholder: 'Trascina qui la foto della lavasciuga Innova 100 B', kind: 'scrubber',
    },
    {
      id: 'karcher-hd', eyebrow: 'In esclusiva · KÄRCHER PROFESSIONAL', name: 'HD 9/20-4 Cage Plus',
      tagline: "L'idropulitrice trifase che non spegne mai il cantiere.",
      desc: 'Acqua fredda 200 bar, telaio cage in tubolare, motore con dispositivo di pre-sgancio: progettata per lavare flotte di mezzi, piazzali e infrastrutture pesanti in continuo. Sistema EASY!Force che dimezza la forza di tenuta sulla pistola.',
      specs: [['Pressione', '200 bar'], ['Portata', '900 L/h'], ['Motore', '7 kW · trifase'], ['Peso', '63 kg']],
      pid: 'k250', side: 'right', bg: 'linear-gradient(160deg, #062E40 0%, #0A4D68 70%, #083D54 100%)', tone: 'dark', placeholder: 'Trascina qui la foto dell\'idropulitrice HD 9/20', kind: 'washer',
    },
    {
      id: 'ghibli-vac', eyebrow: 'Service interno autorizzato · GHIBLI', name: 'Power WD 90.2 Aspiraliquidi',
      tagline: 'Doppio motore, 90 litri: il riferimento per le officine.',
      desc: 'Aspirapolvere/aspiraliquidi industriale a doppio motore: aspira polveri sottili, liquidi e residui di lavorazione fino a 90 litri. Filtro lavabile in poliestere, accessori in acciaio inox e cavo da 10 m garantiscono autonomia di lavoro reale in officina.',
      specs: [['Fusto', '90 L'], ['Potenza', '2.400 W'], ['Depressione', '2.300 mm H₂O'], ['Accessori', 'Inox completi']],
      pid: 'vac90', side: 'left', bg: 'linear-gradient(160deg, #F5F7F8 0%, #EBEFF1 60%, #D5DBDE 100%)', tone: 'light', placeholder: 'Trascina qui la foto dell\'aspiraliquidi Power WD 90', kind: 'vacuum',
    },
  ];
  return (
    <section style={{ padding: isMobile ? '0 20px 64px' : '0 32px 112px', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: isMobile ? 32 : 48, gap: 24, paddingTop: 16, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>Macchine in evidenza · 3 modelli che contano</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(28px, 4.4vw, 54px)', letterSpacing: '-0.035em', margin: '14px 0 0', textWrap: 'balance', maxWidth: '22ch', lineHeight: 1.04 }}>
              I cavalli da lavoro che consigliamo a occhi chiusi.
            </h2>
          </div>
          {!isMobile && <p style={{ fontSize: 15, color: 'var(--fg-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '40ch' }}>
            Tre macchine che vendiamo da anni, conosciamo nei dettagli e seguiamo dal service alla fornitura di ricambi. Sono il nostro punto di partenza quando ci chiedi una flotta.
          </p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 40 : 64 }}>
          {machines.map((m, i) => <HighlightedRow key={m.id} m={m} index={i + 1} navigate={navigate} isMobile={isMobile} />)}
        </div>
      </div>
    </section>
  );
}

function HighlightedRow({ m, index, navigate, isMobile }) {
  const reverse = m.side === 'right' && !isMobile;
  const text = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '24px 8px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, color: 'var(--fg-muted)' }}>0{index} / 03</span>
        <span style={{ width: 24, height: 1, background: 'var(--border-strong)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-700)' }}>{m.eyebrow}</span>
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(32px, 3.6vw, 46px)', letterSpacing: '-0.035em', margin: 0, lineHeight: 1.04, textWrap: 'balance', color: 'var(--fg-primary)' }}>
        {m.name}
      </h3>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 20, letterSpacing: '-0.02em', margin: 0, color: 'var(--color-teal-500)', lineHeight: 1.3, fontStyle: 'italic' }}>
        "{m.tagline}"
      </p>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--fg-secondary)', maxWidth: '54ch' }}>{m.desc}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 6 }}>
        {m.specs.map(([k, v]) =>
          <div key={k} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 600 }}>{k}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)' }}>{v}</span>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' }}>
        <Button variant="cta" size="lg" onClick={() => navigate(`/product/${m.pid}`)} iconRight={<Icon name="arrow-right" size={14} />}>Scopri questa macchina</Button>
        <Button variant="secondary" size="lg" onClick={() => navigate('/contact')} icon={<Icon name="file-text" size={14} />}>Scarica scheda tecnica</Button>
      </div>
    </div>
  );

  const image = (
    <div style={{ position: 'relative' }}>
      <div style={{
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        background: m.bg, border: '1px solid var(--border-subtle)',
        aspectRatio: '4/3', position: 'relative', boxShadow: 'var(--shadow-card)',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ width: '60%', opacity: 0.85, filter: m.tone === 'dark' ? 'invert(1) brightness(0.9)' : 'none' }}>
            <ProductIllustration kind={m.kind} hover={false} />
          </div>
        </div>
        <ImageSlot id={`hm-${m.id}`} placeholder={m.placeholder} />
        <div style={{ position: 'absolute', top: 18, left: 18, padding: '6px 11px', background: m.tone === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)', color: m.tone === 'dark' ? 'var(--color-white)' : 'var(--color-teal-500)', backdropFilter: 'blur(8px)', border: `1px solid ${m.tone === 'dark' ? 'rgba(255,255,255,0.2)' : 'var(--border-subtle)'}`, borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', zIndex: 3, pointerEvents: 'none' }}>
          IN EVIDENZA
        </div>
        <div style={{ position: 'absolute', bottom: 18, right: 18, padding: '8px 14px', background: 'var(--color-mint-500)', color: 'var(--color-white)', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 7, boxShadow: 'var(--shadow-cta)', zIndex: 3, pointerEvents: 'none' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-white)' }} />
          Disponibile su richiesta
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: -18, [reverse ? 'left' : 'right']: 24, padding: '10px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-pop)', display: 'inline-flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'var(--color-mint-50)', color: 'var(--color-mint-700)', borderRadius: 'var(--radius-xs)' }}>
          <Icon name="zap" size={16} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Configurabile</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, color: 'var(--fg-primary)', letterSpacing: '-0.015em' }}>Demo in showroom · su appuntamento</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 64, alignItems: 'center', direction: reverse ? 'rtl' : 'ltr' }}>
      <div style={{ direction: 'ltr' }}>{reverse ? text : image}</div>
      <div style={{ direction: 'ltr' }}>{reverse ? image : text}</div>
    </div>
  );
}

function IndustriesGrid() {
  const isMobile = useIsMobile();
  const items = useIndustries();
  return (
    <section style={{ padding: isMobile ? '0 20px 56px' : '0 32px 96px', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? 16 : 48, alignItems: 'end', marginBottom: isMobile ? 24 : 40 }}>
          <div>
            <Eyebrow>I settori che riforniamo</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.035em', margin: '14px 0 0', textWrap: 'balance', maxWidth: '22ch', lineHeight: 1.06 }}>
              Configurazioni e prezzi pensati per il tuo settore.
            </h2>
          </div>
          {!isMobile && <p style={{ fontSize: 15, color: 'var(--fg-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '46ch' }}>
            Ogni settore ha esigenze diverse: macchine, certificazioni, listini, formati. Il nostro trade desk parte da chi sei e cosa fai, non da un catalogo generico.
          </p>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 1, background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          {items.map((ind, i) => <IndustryCard key={ind.id} ind={ind} index={i + 1} />)}
        </div>
      </div>
    </section>
  );
}

function IndustryCard({ ind, index }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={e => e.preventDefault()}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: hover ? 'var(--color-ice-50)' : 'var(--bg-surface)',
        padding: '32px 28px', height: '100%', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', gap: 14,
        transition: 'background var(--motion-fast)', position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)' }}>
            <Icon name={ind.icon} size={22} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500 }}>0{index}</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 22, letterSpacing: '-0.025em', margin: '4px 0 0', color: 'var(--fg-primary)', lineHeight: 1.15 }}>{ind.label}</h3>
        <p style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55, margin: 0, flex: 1 }}>{ind.desc}</p>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-mint-700)', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 6, transition: 'transform var(--motion-fast)', transform: hover ? 'translateX(4px)' : 'translateX(0)' }}>
          Scopri le forniture <Icon name="arrow-right" size={12} />
        </span>
      </div>
    </a>
  );
}

function VideoAziendale() {
  const [playing, setPlaying] = useState(false);
  const isMobile = useIsMobile();
  return (
    <section style={{ background: 'var(--color-teal-500)', color: 'var(--color-white)', padding: isMobile ? '64px 20px' : '112px 32px', position: 'relative' }}>
      <TrustBar height={3} />
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr', gap: isMobile ? 36 : 64, alignItems: 'center' }}>
          <div>
            <Eyebrow dark>Video aziendale</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(36px, 4vw, 52px)', letterSpacing: '-0.035em', margin: '18px 0 22px', textWrap: 'balance', color: 'var(--color-white)', lineHeight: 1.04 }}>
              12.000 m² di magazzino, showroom e officina.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-teal-100)', maxWidth: '46ch', lineHeight: 1.6, margin: '0 0 36px', fontWeight: 400 }}>
              Visita il magazzino, prova ogni macchina in showroom e incontra il trade desk che segue il tuo conto. Apri il tour della sede di Busto Arsizio.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 36 }}>
              {[
                { icon: 'building-2', label: 'Showroom · 800 m²', value: 'Oltre 40 macchine in prova' },
                { icon: 'package', label: 'Magazzino · 9.500 m²', value: '500+ SKU sempre a stock' },
                { icon: 'wrench', label: 'Officina autorizzata', value: 'Service Comac · Nilfisk · Hako' }
              ].map(r =>
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 0', borderTop: '1px solid var(--color-teal-700)' }}>
                  <span style={{ width: 42, height: 42, display: 'grid', placeItems: 'center', background: 'var(--color-teal-700)', color: 'var(--color-mint-300)', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
                    <Icon name={r.icon} size={18} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 16, color: 'var(--color-white)', letterSpacing: '-0.02em' }}>{r.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-teal-100)', marginTop: 2 }}>{r.value}</div>
                  </div>
                </div>
              )}
            </div>
            <Button variant="cta" size="lg" iconRight={<Icon name="arrow-right" size={14} />}>Prenota una visita</Button>
          </div>

          <div style={{ position: 'relative', aspectRatio: '16/10', background: '#062E40', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-teal-700)' }}>
            <svg viewBox="0 0 600 380" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#C6DEE5" /><stop offset="1" stopColor="#6FA1B0" /></linearGradient>
                <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#EBEFF1" /><stop offset="1" stopColor="#8E9AA2" /></linearGradient>
              </defs>
              <rect x="0" y="0" width="600" height="220" fill="url(#sky)" opacity="0.18" />
              <rect x="0" y="220" width="600" height="160" fill="url(#floor)" opacity="0.4" />
              <path d="M0 220 L120 140 L260 200 L380 130 L600 200 L600 380 L0 380 Z" fill="#0A4D68" />
              <path d="M0 220 L120 140 L260 200 L380 130 L600 200 L600 250 L0 250 Z" fill="#083D54" />
              {[0, 1, 2, 3, 4, 5, 6].map(i =>
                <g key={i}>
                  <rect x={60 + i * 72} y="240" width="56" height="100" fill="#062E40" />
                  <rect x={60 + i * 72} y="252" width="56" height="3" fill="#0A4D68" />
                  <rect x={60 + i * 72} y="280" width="56" height="3" fill="#0A4D68" />
                  <rect x={60 + i * 72} y="308" width="56" height="3" fill="#0A4D68" />
                  <rect x={64 + i * 72} y="255" width="48" height="22" fill="#25D366" opacity="0.18" />
                  <rect x={64 + i * 72} y="283" width="48" height="22" fill="#C6DEE5" opacity="0.18" />
                  <rect x={64 + i * 72} y="311" width="48" height="22" fill="#25D366" opacity="0.14" />
                </g>
              )}
              <g transform="translate(180, 290)">
                <rect x="0" y="14" width="60" height="40" rx="3" fill="#25D366" />
                <rect x="14" y="0" width="34" height="18" rx="2" fill="#0F2330" />
                <rect x="56" y="34" width="60" height="6" fill="#2C3E4A" />
                <rect x="62" y="20" width="6" height="36" fill="#2C3E4A" />
                <rect x="62" y="24" width="50" height="6" fill="#C6DEE5" opacity="0.7" />
                <circle cx="12" cy="58" r="6" fill="#0F2330" />
                <circle cx="48" cy="58" r="6" fill="#0F2330" />
              </g>
              {[100, 240, 380, 500].map(x =>
                <g key={x}>
                  <rect x={x - 3} y="160" width="6" height="3" fill="#C8F5D8" opacity="0.7" />
                  <path d={`M${x - 12} 163 L${x + 12} 163 L${x + 30} 220 L${x - 30} 220 Z`} fill="#C8F5D8" opacity="0.04" />
                </g>
              )}
            </svg>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,46,64,0) 50%, rgba(6,46,64,0.6) 100%)' }} />
            <button onClick={() => setPlaying(p => !p)}
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 92, height: 92, borderRadius: '50%', background: 'var(--color-mint-500)', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', boxShadow: '0 12px 40px rgba(6,46,64,0.5), var(--shadow-cta)' }}>
              {playing ?
                <svg width="26" height="26" viewBox="0 0 24 24" fill="var(--color-white)"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg> :
                <svg width="30" height="30" viewBox="0 0 24 24" fill="var(--color-white)" style={{ marginLeft: 3 }}><path d="M8 5v14l11-7z" /></svg>
              }
            </button>
            <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-white)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-danger-500)', boxShadow: '0 0 0 3px rgba(180,35,24,0.3)' }} />
                {playing ? 'PLAYING' : '03:24'}
                <span>· Tour della sede · Busto Arsizio (VA)</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-100)' }}>4K · HDR</span>
            </div>
            <div style={{ position: 'absolute', top: 18, left: 18, padding: '6px 10px', background: 'rgba(255,255,255,0.92)', color: 'var(--fg-primary)', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em' }}>
              CLEANVILLAGE_HQ_TOUR_2026.MP4
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormazioneCorsi() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const courses = useCourses();
  return (
    <section style={{ background: 'var(--bg-surface)', padding: isMobile ? '64px 20px' : '112px 32px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr', gap: isMobile ? 20 : 64, alignItems: 'end', marginBottom: isMobile ? 28 : 48 }}>
          <div>
            <Eyebrow>Accademia CleanVillage · dal 2018</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(28px, 4.4vw, 54px)', letterSpacing: '-0.035em', margin: '14px 0 0', textWrap: 'balance', maxWidth: '22ch', lineHeight: 1.04 }}>
              Formazione e corsi per chi lavora con le mani.
            </h2>
          </div>
          <div>
            {!isMobile && <p style={{ fontSize: 15, color: 'var(--fg-secondary)', lineHeight: 1.65, margin: '0 0 18px', maxWidth: '46ch' }}>
              Una macchina vale quanto chi la guida. Da otto anni formiamo operatori, capi-squadra e responsabili acquisti su uso sicuro, manutenzione, sanificazione professionale e gare d'appalto. Corsi in aula a Busto Arsizio, in azienda da te o in modalità ibrida.
            </p>}
            <div style={{ display: 'flex', gap: 18, marginTop: 18, flexWrap: 'wrap' }}>
              <FormStat value="42" label="Corsi erogati · 2025" />
              <FormStat value="1.860" label="Operatori formati" />
              <FormStat value="96%" label="Indice gradimento" />
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 20 }}>
          {courses.map((c, i) => <CourseCard key={c.id} c={c} index={i + 1} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--border-subtle)', gap: 24, flexDirection: isMobile ? 'column' : 'row' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--fg-primary)' }}>Hai bisogno di un corso su misura per la tua squadra?</div>
            <div style={{ fontSize: 13, color: 'var(--fg-secondary)', marginTop: 4 }}>Costruiamo programmi dedicati per imprese e plant industriali — minimo 6 partecipanti.</div>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {!isMobile && <Button variant="secondary" iconRight={<Icon name="download" size={14} />}>Brochure corsi 2026</Button>}
            <Button variant="cta" onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>Richiedi un corso</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormStat({ value, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 36, letterSpacing: '-0.035em', color: 'var(--color-teal-500)', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function CourseCard({ c, index }) {
  const [hover, setHover] = useState(false);
  const levelColor = c.level === 'Base' ? 'var(--color-mint-500)' :
    c.level === 'Avanzato' ? 'var(--color-teal-500)' : 'var(--color-warning-500)';
  return (
    <a href="#" onClick={e => e.preventDefault()}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        height: '100%', boxSizing: 'border-box',
        background: 'var(--bg-surface)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)', overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-fast)', display: 'flex', flexDirection: 'column'
      }}>
        <div style={{ height: 140, background: c.bg, position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-subtle)' }}>
          <CourseGraphic kind={c.kind} />
          <span style={{ position: 'absolute', top: 12, left: 12, padding: '4px 9px', background: 'rgba(255,255,255,0.92)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--color-teal-500)' }}>
            CORSO 0{index}
          </span>
          <span style={{ position: 'absolute', top: 12, right: 12, padding: '4px 9px', background: levelColor, color: 'var(--color-white)', borderRadius: 999, fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '0.04em' }}>
            {c.level}
          </span>
        </div>
        <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.025em', color: 'var(--fg-primary)', lineHeight: 1.2 }}>{c.title}</div>
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.55, flex: 1 }}>{c.desc}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            <CourseMeta icon="clock" label={c.duration} />
            <CourseMeta icon="map-pin" label={c.mode} />
            <CourseMeta icon="calendar" label={c.nextDate} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.03em' }}>{c.price}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-mint-700)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Iscriviti <Icon name="arrow-right" size={12} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function CourseMeta({ icon, label }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-secondary)' }}>
      <Icon name={icon} size={13} color="var(--color-teal-500)" />
      <span>{label}</span>
    </div>
  );
}

function CourseGraphic({ kind }) {
  const wrap = { position: 'absolute', inset: 0 };
  switch (kind) {
    case 'safety': return (
      <svg viewBox="0 0 320 140" style={wrap} fill="none" stroke="#0A4D68" strokeWidth="1.4">
        <circle cx="160" cy="82" r="40" fill="#FFFFFF" />
        <path d="M160 60 L145 76 V100 H175 V76 Z" fill="#25D366" opacity="0.6" />
        <path d="M148 84 L156 92 L172 76" stroke="#0A4D68" strokeWidth="2" fill="none" />
        <rect x="60" y="100" width="60" height="6" fill="#0A4D68" opacity="0.4" />
        <rect x="200" y="100" width="60" height="6" fill="#0A4D68" opacity="0.4" />
      </svg>
    );
    case 'machine': return (
      <svg viewBox="0 0 320 140" style={wrap} fill="none" stroke="#0A4D68" strokeWidth="1.4">
        <rect x="110" y="50" width="100" height="50" rx="6" fill="#FFFFFF" />
        <rect x="135" y="34" width="50" height="16" rx="3" fill="#0A4D68" />
        <circle cx="130" cy="108" r="10" fill="#0F2330" />
        <circle cx="190" cy="108" r="10" fill="#0F2330" />
        <rect x="118" y="90" width="84" height="4" fill="#25D366" />
        <path d="M50 70 L100 70 M220 70 L270 70" strokeDasharray="2 4" />
      </svg>
    );
    case 'chemicals': return (
      <svg viewBox="0 0 320 140" style={wrap} fill="none" stroke="#0A4D68" strokeWidth="1.4">
        <rect x="130" y="40" width="30" height="70" rx="3" fill="#FFFFFF" />
        <rect x="165" y="30" width="30" height="80" rx="3" fill="#FFFFFF" />
        <rect x="135" y="60" width="20" height="20" fill="#25D366" opacity="0.5" />
        <rect x="170" y="58" width="20" height="32" fill="#25D366" opacity="0.7" />
        <path d="M137 40 L137 30 L153 30 L153 40 M172 30 L172 22 L188 22 L188 30" />
      </svg>
    );
    case 'sales': return (
      <svg viewBox="0 0 320 140" style={wrap} fill="none" stroke="#0A4D68" strokeWidth="1.4">
        <rect x="80" y="45" width="160" height="70" rx="6" fill="#FFFFFF" />
        <rect x="95" y="58" width="40" height="6" fill="#0A4D68" opacity="0.4" />
        <rect x="95" y="72" width="80" height="6" fill="#0A4D68" opacity="0.4" />
        <rect x="95" y="86" width="50" height="6" fill="#25D366" />
        <path d="M180 100 L195 80 L210 90 L225 65" strokeWidth="2" stroke="#25D366" />
        <circle cx="180" cy="100" r="3" fill="#25D366" />
        <circle cx="225" cy="65" r="3" fill="#25D366" />
      </svg>
    );
    default: return null;
  }
}

function FeaturedProducts() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const allProducts = useProducts();
  const featuredOnly = allProducts.filter(p => p.is_featured);
  const featured = (featuredOnly.length ? featuredOnly : allProducts).slice(0, isMobile ? 4 : 4);
  return (
    <section style={{ padding: isMobile ? '64px 20px' : '112px 32px', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: isMobile ? 24 : 40, gap: 24, flexWrap: 'wrap' }}>
          <div>
            <Eyebrow>In evidenza · spediti questa settimana</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(28px, 3.6vw, 44px)', letterSpacing: '-0.035em', margin: '14px 0 0', textWrap: 'balance', maxWidth: '24ch' }}>
              Pronti a magazzino, in spedizione.
            </h2>
          </div>
          {!isMobile && <Button variant="ghost" onClick={() => navigate('/catalog')} iconRight={<Icon name="arrow-right" size={14} />}>Vedi tutti gli articoli a stock</Button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: isMobile ? 14 : 20 }}>
          {featured.map(p => <ProductCard key={p.id} product={p} onClick={() => navigate(`/product/${p.id}`)} />)}
        </div>
        {isMobile && (
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button variant="ghost" onClick={() => navigate('/catalog')} iconRight={<Icon name="arrow-right" size={14} />}>Vedi tutti gli articoli a stock</Button>
          </div>
        )}
      </div>
    </section>
  );
}

function QuoteCTA() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  return (
    <section style={{ background: 'var(--bg-inverse)', color: 'var(--color-white)', position: 'relative', overflow: 'hidden' }}>
      <TrustBar height={3} />
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '64px 20px' : '96px 32px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 32 : 64, alignItems: 'center' }}>
        <div>
          <Eyebrow dark>Pronti quando lo sei tu</Eyebrow>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(38px, 4.6vw, 56px)', letterSpacing: '-0.035em', color: 'var(--color-white)', margin: '18px 0 22px', textWrap: 'balance', lineHeight: 1.04 }}>
            Preventivo personalizzato entro 24 ore.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--color-teal-100)', maxWidth: '52ch', margin: 0, lineHeight: 1.6 }}>
            Inviaci specifiche, quantità target e finestra di consegna. Il nostro trade desk risponde con stock, prezzo a scaglioni e tempi confermati.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button variant="cta" size="lg" full onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>Richiedi un Preventivo</Button>
          <a href="tel:+390331555220" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', border: '1px solid var(--color-teal-700)', borderRadius: 'var(--radius-sm)', color: 'var(--color-white)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}><Icon name="phone" size={15} /> Chiama il trade desk</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-teal-100)' }}>+39 0331 555 220</span>
          </a>
          <a href="mailto:trade@cleanvillage.it" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', border: '1px solid var(--color-teal-700)', borderRadius: 'var(--radius-sm)', color: 'var(--color-white)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600 }}><Icon name="mail" size={15} /> Scrivi al trade desk</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-teal-100)' }}>trade@cleanvillage.it</span>
          </a>
        </div>
      </div>
    </section>
  );
}
