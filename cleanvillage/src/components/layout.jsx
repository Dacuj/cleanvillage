import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo, Icon, Button, TrustBar, Eyebrow } from './ui.jsx';
import { CV_CATEGORIES, CV_BRANDS } from '../data.js';
import { useIsMobile } from '../lib/useBreakpoint.js';
import { useSiteContent, buildDirectionsUrl } from '../lib/siteContent.js';

const SOCIAL_SVGS = {
  linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  facebook: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  youtube: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 6.4a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.56.42A2.78 2.78 0 0 0 1.5 6.4 29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.78 2.78 0 0 0 1.94 1.97C5.12 20 12 20 12 20s6.88 0 8.56-.42A2.78 2.78 0 0 0 22.5 17.6 29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"/></svg>',
  instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
};

function MegaCategories({ onClose }) {
  const navigate = useNavigate();
  const cats = CV_CATEGORIES;
  return (
    <div onMouseLeave={onClose}
      style={{ position: 'absolute', top: '100%', left: -32, right: -32, marginTop: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderTop: 'none', boxShadow: 'var(--shadow-pop)', padding: '28px 32px 24px', zIndex: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <Eyebrow>Tutte le categorie · 11</Eyebrow>
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/catalog'); onClose(); }} style={{ fontSize: 12, color: 'var(--color-teal-500)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          Esplora tutto il catalogo <Icon name="arrow-right" size={12} />
        </a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px 24px' }}>
        {cats.map(c => (
          <a key={c.id} href="#" onClick={(e) => { e.preventDefault(); navigate('/catalog'); onClose(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 8px', textDecoration: 'none', color: 'var(--fg-primary)', borderRadius: 'var(--radius-xs)' }}>
            <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'var(--color-ice-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-xs)', flexShrink: 0 }}>
              <Icon name={c.icon} size={14} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', marginTop: 2 }}>{c.count} SKU</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function MegaBrands({ onClose }) {
  const brands = CV_BRANDS;
  return (
    <div onMouseLeave={onClose}
      style={{ position: 'absolute', top: '100%', left: -32, right: -32, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderTop: 'none', boxShadow: 'var(--shadow-pop)', padding: '28px 32px 26px', zIndex: 20 }}>
      <Eyebrow>Marchi distribuiti · 24</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginTop: 14 }}>
        {brands.map(b => (
          <a key={b.name} href="#" onClick={e => e.preventDefault()}
            style={{ display: 'grid', placeItems: 'center', height: 60, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', textDecoration: 'none', background: 'var(--bg-surface)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: b.weight || 500, fontSize: 14, color: 'var(--fg-primary)', letterSpacing: b.letter || '0', fontStyle: b.italic ? 'italic' : 'normal' }}>{b.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function MobileDrawer({ onClose }) {
  const navigate = useNavigate();
  const content = useSiteContent();
  const [section, setSection] = useState(null);
  const go = (path) => { navigate(path); onClose(); };
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '88vw', maxWidth: 360, background: 'var(--bg-surface)', zIndex: 50, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Logo size="md" />
          <button onClick={onClose} aria-label="Chiudi menu" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--fg-secondary)' }}>
            <Icon name="x" size={22} />
          </button>
        </div>
        <div style={{ padding: '12px 0', flex: 1 }}>
          <MobileNavItem label="Categorie" icon="grid" onToggle={() => setSection(s => s === 'cat' ? null : 'cat')} open={section === 'cat'}>
            <div style={{ padding: '8px 20px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CV_CATEGORIES.map(c => (
                <button key={c.id} onClick={() => go('/catalog')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                  <span style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'var(--color-ice-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-xs)', flexShrink: 0 }}>
                    <Icon name={c.icon} size={13} />
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--fg-primary)', fontWeight: 400 }}>{c.label}</span>
                </button>
              ))}
            </div>
          </MobileNavItem>
          <MobileNavItem label="Marchi" icon="tag" onToggle={() => setSection(s => s === 'brand' ? null : 'brand')} open={section === 'brand'}>
            <div style={{ padding: '8px 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CV_BRANDS.map(b => (
                <span key={b.name} style={{ padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: b.weight || 500 }}>{b.name}</span>
              ))}
            </div>
          </MobileNavItem>
          <button onClick={() => go('/contact')} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>
            <Icon name="mail" size={18} /> Contatti
          </button>
          <button onClick={() => go('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>
            <Icon name="play" size={18} /> Video Aziendale
          </button>
          <button onClick={() => go('/')} style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '16px 20px', background: 'none', border: 'none', borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>
            <Icon name="info" size={18} /> Azienda
          </button>
        </div>
        <div style={{ padding: '16px 20px 32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="cta" onClick={() => go('/contact')} full>Richiedi Preventivo</Button>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.5 }}>
            {content.company.phonePrimary} · {content.company.emailPrimary}
          </div>
        </div>
      </div>
    </>
  );
}

function MobileNavItem({ label, icon, onToggle, open, children }) {
  return (
    <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}><Icon name={icon} size={18} />{label}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
      </button>
      {open && children}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const content = useSiteContent();

  const NAV = [
    { id: 'cat', label: 'Categorie', has: true },
    { id: 'brand', label: 'Marchi', has: true },
    { id: 'contact', label: 'Contatti' },
    { id: 'video', label: 'Video Aziendale' },
    { id: 'about', label: 'Azienda' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid var(--border-subtle)', backdropFilter: 'blur(10px)' }}>
      {/* utility strip - desktop only */}
      {!isMobile && (
        <div style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--color-ice-50)' }}>
          <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: '7px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em', flexWrap: 'wrap', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <a href={`tel:${content.company.phonePrimary.replace(/\s+/g, '')}`} style={{ color: 'var(--fg-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="phone" size={11} /> {content.company.phonePrimary}
              </a>
              <a href={`mailto:${content.company.emailPrimary}`} style={{ color: 'var(--fg-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Icon name="mail" size={11} /> {content.company.emailPrimary}
              </a>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="clock" size={11} /> {content.company.hours}</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>{content.utility.salesTerms}</a>
              <a href="#" onClick={e => e.preventDefault()} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>{content.utility.warrantyTerms}</a>
              <Link to="/admin" style={{ color: 'var(--color-teal-500)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}><Icon name="lock" size={11} /> {content.utility.tradeArea}</Link>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Icon name="globe" size={11} /> IT</span>
            </span>
          </div>
        </div>
      )}

      {/* main bar */}
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '0 16px' : '0 32px', height: isMobile ? 60 : 72, display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 32 }}>
        <Link to="/" style={{ textDecoration: 'none' }}><Logo size="md" /></Link>

        {!isMobile && (
          <nav style={{ display: 'flex', gap: 4, alignItems: 'center', height: '100%', position: 'relative' }}
            onMouseLeave={() => setOpen(null)}>
            {NAV.map(n => (
              <button key={n.id}
                onMouseEnter={() => n.has ? setOpen(n.id) : setOpen(null)}
                onClick={() => {
                  if (!n.has) {
                    if (n.id === 'contact') navigate('/contact');
                    else navigate('/');
                  }
                }}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '0 14px', height: '100%',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                  color: open === n.id ? 'var(--color-teal-500)' : 'var(--fg-primary)',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                {n.label}
                {n.has && <Icon name="chevron-down" size={12} />}
              </button>
            ))}
            {open === 'cat' && <MegaCategories onClose={() => setOpen(null)} />}
            {open === 'brand' && <MegaBrands onClose={() => setOpen(null)} />}
          </nav>
        )}

        <span style={{ flex: 1 }} />

        {!isMobile && (
          <div style={{ position: 'relative', width: 260 }}>
            <Icon name="search" size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
            <input placeholder="Cerca prodotti, codici, marchi…"
              style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 34px', fontFamily: 'var(--font-body)', fontSize: 13, background: 'var(--color-ice-50)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', outline: 'none', color: 'var(--fg-primary)' }} />
          </div>
        )}

        {!isMobile && (
          <button aria-label="Account" style={{ width: 36, height: 36, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--fg-secondary)' }}>
            <Icon name="user" size={16} />
          </button>
        )}

        {isMobile ? (
          <>
            <button onClick={() => navigate('/contact')} style={{ height: 40, padding: '0 14px', background: 'var(--cta-bg)', color: 'var(--color-white)', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Preventivo
            </button>
            <button onClick={() => setDrawerOpen(true)} style={{ width: 40, height: 40, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--fg-primary)', flexShrink: 0 }}>
              <Icon name="menu" size={20} />
            </button>
          </>
        ) : (
          <Button variant="cta" onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={13} />}>Richiedi Preventivo</Button>
        )}
      </div>

      {drawerOpen && <MobileDrawer onClose={() => setDrawerOpen(false)} />}
    </header>
  );
}

export function Footer() {
  const isMobile = useIsMobile();
  const content = useSiteContent();
  const co = content.company;
  const directions = buildDirectionsUrl(co.operationalAddress);
  const Col = ({ title, children }) => (
    <div>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)', marginBottom: 18 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>{children}</div>
    </div>
  );
  const Lk = ({ children, href = '#', external }) => (
    <a
      href={href}
      onClick={href === '#' ? (e => e.preventDefault()) : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ fontSize: 13, color: 'var(--color-teal-100)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
    >
      {children}
    </a>
  );
  return (
    <footer style={{ background: 'var(--color-teal-500)', color: 'var(--color-white)', marginTop: 'auto', position: 'relative' }}>
      <TrustBar height={3} />
      <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '48px 20px 28px' : '80px 32px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1.4fr 1fr 1fr 1fr 1fr', gap: isMobile ? 32 : 40 }}>
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <Logo inverse size="lg" />
            <p style={{ marginTop: 18, fontSize: 14, color: 'var(--color-teal-100)', maxWidth: '34ch', lineHeight: 1.6, fontWeight: 400 }}>
              {co.tagline}
            </p>
            <div style={{ marginTop: 18, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {co.certifications.map(c => (
                <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--color-mint-300)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  <Icon name="badge-check" size={11} />{c}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
              {['linkedin', 'facebook', 'youtube', 'instagram'].map(s => {
                const url = co.socials?.[s];
                return (
                  <a key={s} href={url || '#'} onClick={url ? undefined : (e => e.preventDefault())} target={url ? '_blank' : undefined} rel={url ? 'noopener noreferrer' : undefined} aria-label={s} style={{ width: 34, height: 34, display: 'inline-grid', placeItems: 'center', borderRadius: 'var(--radius-xs)', background: 'rgba(255,255,255,0.06)', color: 'var(--color-teal-100)', textDecoration: 'none' }}>
                    <span dangerouslySetInnerHTML={{ __html: SOCIAL_SVGS[s] }} />
                  </a>
                );
              })}
            </div>
          </div>
          <Col title="Categorie">
            <Lk>Lavasciuga</Lk>
            <Lk>Idropulitrici</Lk>
            <Lk>Detergenti</Lk>
            <Lk>Carrelli</Lk>
            <Lk>Carta &amp; igiene</Lk>
            <Lk>Catalogo completo &rarr;</Lk>
          </Col>
          <Col title="Servizi">
            <Lk>Preventivi</Lk>
            <Lk>Sede operativa</Lk>
            <Lk>Assistenza</Lk>
            <Lk>Noleggio</Lk>
            <Lk>Formazione</Lk>
          </Col>
          {!isMobile && (
            <Col title="Contatti">
              <Lk href={`tel:${co.phonePrimary.replace(/\s+/g, '')}`}><Icon name="phone" size={12} /> {co.phonePrimary}</Lk>
              <Lk href={`tel:${co.phoneSecondary.replace(/\s+/g, '')}`}><Icon name="phone" size={12} /> {co.phoneSecondary}</Lk>
              <Lk href={`mailto:${co.emailPrimary}`}><Icon name="mail" size={12} /> {co.emailPrimary}</Lk>
              <Lk><Icon name="clock" size={12} /> {co.hours}</Lk>
            </Col>
          )}
          {!isMobile && (
            <Col title="Sede operativa">
              <Lk>{co.operationalAddress.split('—')[0]?.trim() || co.operationalAddress}</Lk>
              <Lk>{co.operationalCity}</Lk>
              <Lk>Italia</Lk>
              <Lk href={directions} external><Icon name="map-pin" size={12} /> Indicazioni stradali</Lk>
            </Col>
          )}
        </div>
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--color-teal-700)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-teal-100)', opacity: 0.85, gap: 12 }}>
          <span>© {new Date().getFullYear()} {co.name} · P.IVA {co.vat} · REA {co.rea} · Cap. Soc. {co.capSoc}</span>
          <span style={{ display: 'inline-flex', gap: 18 }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Cookie</a>
            <a href="#" onClick={e => e.preventDefault()} style={{ color: 'inherit', textDecoration: 'none' }}>Termini</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
