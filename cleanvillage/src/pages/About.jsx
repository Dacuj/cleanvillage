import { useNavigate } from 'react-router-dom';
import { Icon, Button, Eyebrow, TrustBar } from '../components/ui.jsx';
import { useIsMobile } from '../lib/useBreakpoint.js';
import { useSiteContent, buildDirectionsUrl } from '../lib/siteContent.js';

export default function About() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const content = useSiteContent();
  const page = content.pages.about;
  const videoPage = content.pages.videoPage;
  const co = content.company;

  return (
    <main style={{ background: 'var(--bg-page)' }}>
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <TrustBar height={3} />
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '32px 20px 36px' : '64px 32px 56px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 18, fontFamily: 'var(--font-mono)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Home</a>
            <Icon name="chevron-right" size={12} />
            <span style={{ color: 'var(--fg-primary)' }}>Azienda</span>
          </div>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 'clamp(36px, 5.4vw, 68px)', letterSpacing: '-0.04em', margin: '14px 0 22px', lineHeight: 1.02, textWrap: 'balance', maxWidth: '22ch' }}>
            {page.title}
          </h1>
          <p style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: isMobile ? 15 : 17, maxWidth: '64ch', lineHeight: 1.7 }}>
            {page.intro}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '48px 20px' : '88px 32px' }}>
        <Eyebrow>Quattro principi</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(28px, 3.6vw, 40px)', letterSpacing: '-0.03em', margin: '14px 0 32px', maxWidth: '24ch' }}>
          Cosa ci distingue.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? 16 : 20 }}>
          {(page.values || []).map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: isMobile ? 20 : 26, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ width: 46, height: 46, display: 'grid', placeItems: 'center', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
                <Icon name={v.icon} size={22} />
              </span>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 18, letterSpacing: '-0.015em', color: 'var(--fg-primary)', margin: '4px 0 8px' }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {videoPage && (
        <section style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: isMobile ? '48px 20px' : '80px 32px' }}>
          <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.3fr', gap: isMobile ? 28 : 56, alignItems: 'center' }}>
            <div>
              <Eyebrow>{videoPage.eyebrow}</Eyebrow>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(26px, 3.4vw, 38px)', letterSpacing: '-0.03em', margin: '14px 0 16px', maxWidth: '20ch', lineHeight: 1.1 }}>
                {videoPage.title}
              </h2>
              <p style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: isMobile ? 15 : 16, lineHeight: 1.65, maxWidth: '46ch' }}>
                {videoPage.intro}
              </p>
              {videoPage.cta && (
                <div style={{ marginTop: 22 }}>
                  <Button variant="cta" onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>{videoPage.cta}</Button>
                </div>
              )}
            </div>
            <div style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0F2330', position: 'relative' }}>
              {videoPage.embedUrl ? (
                <iframe
                  title={videoPage.embedTitle || 'Video Clean Village'}
                  src={videoPage.embedUrl}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 0 }}
                />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--color-teal-100)', fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'center', padding: 20 }}>
                  <div>
                    <Icon name="video" size={36} />
                    <div style={{ marginTop: 12, fontSize: 14 }}>Video in preparazione</div>
                    <div style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>L'amministratore può inserire l'URL embed dalla dashboard.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section style={{ background: 'var(--color-teal-500)', color: 'var(--color-white)', padding: isMobile ? '48px 20px' : '72px 32px' }}>
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? 28 : 56, alignItems: 'center' }}>
          <div>
            <Eyebrow dark>Sede operativa</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 'clamp(26px, 3.4vw, 38px)', letterSpacing: '-0.03em', margin: '14px 0 18px', color: 'var(--color-white)' }}>
              {co.name}
            </h2>
            <div style={{ fontSize: 15, color: 'var(--color-teal-100)', lineHeight: 1.7 }}>
              {co.operationalAddress}<br />
              <span style={{ opacity: 0.7 }}>{co.hours}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
              {co.certifications.map(c => (
                <span key={c} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-mint-300)', fontWeight: 600 }}>
                  <Icon name="badge-check" size={12} />{c}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
              <Button variant="cta" onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>Richiedi un Preventivo</Button>
              <a href={buildDirectionsUrl(co.operationalAddress)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)', color: 'var(--color-white)', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                <Icon name="map-pin" size={14} /> Indicazioni stradali
              </a>
            </div>
          </div>
          <div style={{ aspectRatio: '4/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-teal-700)' }}>
            <iframe
              title={`Mappa ${co.name}`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(co.operationalAddress)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
