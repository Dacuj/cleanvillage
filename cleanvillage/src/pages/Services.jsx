import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, Button, Eyebrow } from '../components/ui.jsx';
import { useIsMobile } from '../lib/useBreakpoint.js';
import { useSiteContent } from '../lib/siteContent.js';

export default function Services() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const content = useSiteContent();
  const page = content.pages.services;

  // Smooth scroll to anchor when arriving via /servizi#assistenza etc.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }, [location.hash]);

  return (
    <main style={{ background: 'var(--bg-page)' }}>
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '32px 20px 36px' : '56px 32px 44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 18, fontFamily: 'var(--font-mono)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Home</a>
            <Icon name="chevron-right" size={12} />
            <span style={{ color: 'var(--fg-primary)' }}>Servizi</span>
          </div>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 'clamp(36px, 5.4vw, 64px)', letterSpacing: '-0.04em', margin: '14px 0 18px', lineHeight: 1.04, textWrap: 'balance', maxWidth: '22ch' }}>
            {page.title}
          </h1>
          <p style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: isMobile ? 15 : 17, maxWidth: '64ch', lineHeight: 1.65 }}>
            {page.intro}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '36px 20px 72px' : '56px 32px 96px', display: 'flex', flexDirection: 'column', gap: isMobile ? 16 : 22 }}>
        {(page.items || []).map((s, i) => (
          <article
            key={s.id || i}
            id={s.id}
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '120px 1fr auto', gap: isMobile ? 16 : 28, alignItems: 'center', padding: isMobile ? 22 : 28, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}
          >
            <span style={{ width: 72, height: 72, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
              <Icon name={s.icon} size={32} />
            </span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: isMobile ? 22 : 26, letterSpacing: '-0.025em', color: 'var(--fg-primary)', margin: '0 0 10px' }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
            </div>
            <Button variant="secondary" onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>Richiedi info</Button>
          </article>
        ))}
      </section>
    </main>
  );
}
