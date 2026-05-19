import { useNavigate } from 'react-router-dom';
import { Icon, Button, Eyebrow, TrustBar } from '../components/ui.jsx';
import { useIsMobile } from '../lib/useBreakpoint.js';
import { useSiteContent } from '../lib/siteContent.js';

export default function VideoPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const content = useSiteContent();
  const page = content.pages.videoPage;
  const co = content.company;

  return (
    <main style={{ background: 'var(--bg-page)' }}>
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <TrustBar height={3} />
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '32px 20px 36px' : '56px 32px 44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 18, fontFamily: 'var(--font-mono)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Home</a>
            <Icon name="chevron-right" size={12} />
            <span style={{ color: 'var(--fg-primary)' }}>Video Aziendale</span>
          </div>
          <Eyebrow>{page.eyebrow}</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 200, fontSize: 'clamp(36px, 5.4vw, 64px)', letterSpacing: '-0.04em', margin: '14px 0 18px', lineHeight: 1.04, textWrap: 'balance', maxWidth: '22ch' }}>
            {page.title}
          </h1>
          <p style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: isMobile ? 15 : 17, maxWidth: '60ch', lineHeight: 1.65 }}>
            {page.intro}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '32px 20px 64px' : '56px 32px 96px' }}>
        <div style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0F2330', position: 'relative' }}>
          {page.embedUrl ? (
            <iframe
              title={page.embedTitle || 'Video Clean Village'}
              src={page.embedUrl}
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

        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 20 : 32, alignItems: 'center', padding: isMobile ? 22 : 32, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <Eyebrow>Vieni a trovarci</Eyebrow>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: isMobile ? 22 : 26, letterSpacing: '-0.025em', margin: '12px 0 8px', color: 'var(--fg-primary)' }}>
              {co.operationalAddress}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.6, margin: 0 }}>
              Su appuntamento dal lunedì al venerdì, {co.hours}. Telefono diretto: <a href={`tel:${co.phonePrimary.replace(/\s+/g, '')}`} style={{ color: 'var(--color-teal-500)', textDecoration: 'none', fontWeight: 600 }}>{co.phonePrimary}</a>.
            </p>
          </div>
          <Button variant="cta" size="lg" full={isMobile} onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>{page.cta}</Button>
        </div>
      </section>
    </main>
  );
}
