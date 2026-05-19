import { useNavigate } from 'react-router-dom';
import { Icon, Eyebrow } from './ui.jsx';
import { useIsMobile } from '../lib/useBreakpoint.js';
import { useSiteContent } from '../lib/siteContent.js';

// Render a "legal" or content text page from siteContent. Used for
// Privacy / Cookie / Termini / Condizioni di vendita / Garanzia.
export default function LegalPage({ slug }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const content = useSiteContent();
  const page = content.legalPages?.[slug];
  const co = content.company;

  if (!page) {
    return (
      <main style={{ padding: '120px 20px', textAlign: 'center', minHeight: 400, color: 'var(--fg-muted)' }}>
        Pagina non disponibile.
      </main>
    );
  }

  return (
    <main style={{ background: 'var(--bg-page)' }}>
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '32px 20px 28px' : '56px 32px 40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 18, fontFamily: 'var(--font-mono)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Home</a>
            <Icon name="chevron-right" size={12} />
            <span style={{ color: 'var(--fg-primary)' }}>{page.title}</span>
          </div>
          <Eyebrow>{co.name}</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-0.04em', margin: '14px 0 0', lineHeight: 1.04, textWrap: 'balance', maxWidth: '22ch' }}>
            {page.title}
          </h1>
          {page.subtitle && (
            <p style={{ margin: '16px 0 0', color: 'var(--fg-secondary)', fontSize: isMobile ? 15 : 17, maxWidth: '64ch', lineHeight: 1.6 }}>
              {page.subtitle}
            </p>
          )}
        </div>
      </section>

      <section style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '36px 20px 72px' : '64px 32px 112px' }}>
        <div style={{ maxWidth: '72ch', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {(page.sections || []).map((s, i) => (
            <article key={i}>
              {s.heading && (
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: isMobile ? 22 : 26, letterSpacing: '-0.02em', margin: '0 0 12px', color: 'var(--fg-primary)' }}>
                  {s.heading}
                </h2>
              )}
              {(s.paragraphs || []).map((p, j) => (
                <p key={j} style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.7, color: 'var(--fg-secondary)' }}>
                  {p}
                </p>
              ))}
            </article>
          ))}
          <div style={{ marginTop: 24, padding: '20px 22px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6, fontFamily: 'var(--font-mono)' }}>
            <b style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{co.name}</b><br />
            {co.legalAddress}<br />
            P.IVA {co.vat} · REA {co.rea} · Cap. Soc. {co.capSoc}<br />
            <a href={`mailto:${co.emailPrimary}`} style={{ color: 'var(--color-teal-500)' }}>{co.emailPrimary}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
