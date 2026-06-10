import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, Eyebrow } from '../components/ui.jsx';
import { Field, TextInput, Textarea, Select, Check } from '../components/fields.jsx';
import { useCategories, useIndustries } from '../lib/storefront.js';
import { createQuote } from '../lib/api.js';
import { useIsMobile } from '../lib/useBreakpoint.js';
import { useSiteContent, buildDirectionsUrl, buildMapsUrl } from '../lib/siteContent.js';

const TIMELINE_LABELS = {
  urgent: 'Urgente · entro 7 gg',
  '1-month': 'Entro 30 giorni',
  'q-end': 'Entro fine trimestre',
  planning: 'In pianificazione',
};

export default function Contact() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const content = useSiteContent();
  const co = content.company;
  const cp = content.contactPage;
  const CV_CATEGORIES = useCategories();
  const CV_INDUSTRIES = useIndustries();
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({
    company: '', vat: '', name: '', role: '', email: '', phone: '',
    category: 'lavasciuga', message: '', quantity: '1-5', timeline: '1-month', sector: 'imprese',
    privacy: false, newsletter: false,
  });
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await createQuote({
        company: form.company, vat: form.vat,
        contact_name: form.name, email: form.email, phone: form.phone,
        message: form.message,
        needs: [form.category, `Quantità: ${form.quantity}`, `Settore: ${form.sector}`, form.role].filter(Boolean),
        timeline: TIMELINE_LABELS[form.timeline] || form.timeline,
      });
      setSubmitted(true);
    } catch (e) {
      setErr(e.message || 'Errore invio. Riprova.');
    } finally {
      setBusy(false);
    }
  };

  if (submitted) return <ContactSuccess onReset={() => setSubmitted(false)} onNav={() => navigate('/catalog')} />;

  return (
    <main style={{ background: 'var(--bg-page)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '32px 20px 28px' : '56px 32px 44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 18, fontFamily: 'var(--font-mono)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Home</a>
            <Icon name="chevron-right" size={12} />
            <span style={{ color: 'var(--fg-primary)' }}>Richiesta preventivo</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? 28 : 48, alignItems: 'end' }}>
            <div>
              <Eyebrow>{cp.eyebrow}</Eyebrow>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(36px, 5.4vw, 68px)', letterSpacing: '-0.04em', margin: '14px 0 0', lineHeight: 1.02, textWrap: 'balance', maxWidth: '18ch' }}>
                {cp.title}
              </h1>
              <p style={{ margin: '18px 0 0', color: 'var(--fg-secondary)', fontSize: isMobile ? 15 : 16, maxWidth: '56ch', lineHeight: 1.6 }}>
                {cp.intro}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <QuickStat icon="reply" label={cp.quickStat1Label} value={cp.quickStat1Value} small={cp.quickStat1Small} />
              <QuickStat icon="check-circle" label={cp.quickStat2Label} value={cp.quickStat2Value} small={cp.quickStat2Small} />
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '32px 16px 64px' : '56px 32px 96px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: isMobile ? 24 : 40, alignItems: 'start' }}>
        {/* Form */}
        <form onSubmit={onSubmit}
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: isMobile ? '24px 20px' : '36px 36px 32px' }}>

          <FormSection title="La tua azienda" step={1}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 18 }}>
              <Field label="Ragione sociale" required span={isMobile ? 1 : 2}>
                <TextInput required value={form.company} onChange={update('company')} placeholder="Servizi Industriali Lombardi Srl" />
              </Field>
              <Field label="P.IVA" required>
                <TextInput required value={form.vat} onChange={update('vat')} placeholder="IT 0123 4567 891" />
              </Field>
              <Field label="Settore" required>
                <Select value={form.sector} onChange={update('sector')}>
                  {CV_INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                  <option value="other">Altro</option>
                </Select>
              </Field>
              <Field label="Persona di riferimento" required>
                <TextInput required value={form.name} onChange={update('name')} placeholder="Marco Rossi" />
              </Field>
              <Field label="Ruolo / Reparto">
                <TextInput value={form.role} onChange={update('role')} placeholder="Responsabile acquisti" />
              </Field>
              <Field label="Email aziendale" required>
                <TextInput required type="email" value={form.email} onChange={update('email')} placeholder="acquisti@azienda.it" />
              </Field>
              <Field label="Telefono">
                <TextInput type="tel" value={form.phone} onChange={update('phone')} placeholder="+39 ..." />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Cosa ti serve" step={2}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 18 }}>
              <Field label="Categoria principale" required>
                <Select value={form.category} onChange={update('category')}>
                  {CV_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  <option value="multi">Categorie multiple / fornitura mista</option>
                </Select>
              </Field>
              <Field label="Quantità approssimativa">
                <Select value={form.quantity} onChange={update('quantity')}>
                  <option value="1-5">1–5 unità</option>
                  <option value="5-20">5–20 unità</option>
                  <option value="20-50">20–50 unità</option>
                  <option value="50+">50+ / flotta</option>
                </Select>
              </Field>
              <Field label="Finestra di consegna" span={isMobile ? 1 : 2}>
                <RadioRow value={form.timeline} onChange={(v) => setForm({ ...form, timeline: v })} isMobile={isMobile} options={[
                  { v: 'urgent', l: 'Urgente · entro 7 gg' },
                  { v: '1-month', l: 'Entro 30 giorni' },
                  { v: 'q-end', l: 'Entro fine trimestre' },
                  { v: 'planning', l: 'In pianificazione' },
                ]} />
              </Field>
            </div>
            <Field label="Specifiche, modelli o caso d'uso" required>
              <Textarea required rows={5} value={form.message} onChange={update('message')}
                placeholder="Es. stiamo allestendo 3 magazzini di logistica (~6.000 m² ciascuno). Servono lavasciuga uomo a bordo, spazzatrici batteria e una scorta annuale di detergente neutro. Consegna su Napoli + Caserta entro fine Q3." />
            </Field>
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
              <AttachField />
              <AttachField label="Capitolato / RDA" />
            </div>
          </FormSection>

          <FormSection title="Conferma" step={3} last>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Check label="Acquisto per conto di un'azienda registrata (P.IVA valida)" checked={true} />
              <Check label="Acconsento al trattamento dei dati ai sensi dell'informativa privacy" />
              <Check label="Voglio ricevere offerte tecniche, novità e listini stagionali (max 1 email/mese)" />
            </div>
          </FormSection>

          {err && (
            <div style={{ marginTop: 18, padding: 12, background: '#FDEEEE', border: '1px solid #E89E9E', borderRadius: 'var(--radius-sm)', fontSize: 13, color: '#A02020' }}>
              {err}
            </div>
          )}
          <div style={{ marginTop: 8, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'var(--color-mint-50)', borderRadius: 999, fontSize: 11, fontWeight: 600, color: 'var(--color-mint-700)', marginBottom: 14 }}>
              <Icon name="info" size={12} />
              Questa è una richiesta di contatto — nessun pagamento in questa fase
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: 16, flexDirection: isMobile ? 'column' : 'row' }}>
              <span style={{ fontSize: 12, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', maxWidth: '38ch', lineHeight: 1.5 }}>
                {cp.submitNote}
              </span>
              <Button variant="cta" size="lg" type="submit" full={isMobile} disabled={busy} iconRight={<Icon name="arrow-right" size={14} />}>
                {busy ? 'Invio in corso…' : 'Invia la richiesta'}
              </Button>
            </div>
          </div>
        </form>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 18, position: isMobile ? 'static' : 'sticky', top: 104 }}>
          <ChannelCard icon="phone" title="Telefono" lines={[
            { label: 'Sede', value: co.phonePrimary, href: `tel:${co.phonePrimary.replace(/\s+/g, '')}` },
            { label: 'Linea 2', value: co.phoneSecondary, href: `tel:${co.phoneSecondary.replace(/\s+/g, '')}` },
            { label: 'Mobile', value: co.phoneMobile, href: `tel:${co.phoneMobile.replace(/\s+/g, '')}` },
            { label: 'Orari', value: co.hours },
          ]} />
          <ChannelCard icon="mail" title="Email" lines={[
            { label: 'Direzione', value: co.emailPrimary, href: `mailto:${co.emailPrimary}` },
            { label: 'Info', value: co.emailSecondary, href: `mailto:${co.emailSecondary}` },
            { label: 'Sito', value: co.website },
          ]} />
          <HQCard co={co} />
        </aside>
      </section>
    </main>
  );
}

function QuickStat({ icon, label, value, small }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px', background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
      <span style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--color-mint-50)', color: 'var(--color-mint-700)', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
        <Icon name={icon} size={20} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 600 }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 650, fontSize: 24, letterSpacing: '-0.03em', color: 'var(--fg-primary)', marginTop: 2, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 3 }}>{small}</div>
      </div>
    </div>
  );
}

function FormSection({ title, step, children, last }) {
  return (
    <div style={{ paddingBottom: last ? 0 : 28, marginBottom: last ? 8 : 28, borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-teal-500)', color: 'var(--color-white)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600 }}>{step}</span>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.02em', margin: 0, color: 'var(--fg-primary)' }}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RadioRow({ value, onChange, options, isMobile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : `repeat(${options.length}, 1fr)`, gap: 8 }}>
      {options.map(o => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)} style={{
          padding: '11px 14px', textAlign: 'left', cursor: 'pointer',
          background: value === o.v ? 'var(--color-teal-50)' : 'var(--bg-surface)',
          border: `1px solid ${value === o.v ? 'var(--color-teal-500)' : 'var(--border-default)'}`,
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: value === o.v ? 600 : 500,
          color: value === o.v ? 'var(--color-teal-500)' : 'var(--fg-primary)',
          display: 'flex', alignItems: 'center', gap: 9,
          transition: 'all var(--motion-fast)',
        }}>
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: `1.5px solid ${value === o.v ? 'var(--color-teal-500)' : 'var(--border-strong)'}`, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            {value === o.v && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-teal-500)' }} />}
          </span>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function AttachField({ label = 'Allegato (opzionale)' }) {
  const [file, setFile] = useState(null);
  return (
    <Field label={label} hint="PDF, DOC, XLS — max 10 MB">
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        padding: '11px 14px', background: 'var(--bg-surface)',
        border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)',
        cursor: 'pointer', color: file ? 'var(--fg-primary)' : 'var(--fg-muted)', fontSize: 13,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Icon name="paperclip" size={14} />
          {file ? file.name : 'Scegli file o trascina qui'}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>{file ? `${(file.size / 1024).toFixed(0)} KB` : ''}</span>
        <input type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files?.[0])} />
      </label>
    </Field>
  );
}

function ChannelCard({ icon, title, lines }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', display: 'grid', placeItems: 'center' }}>
          <Icon name={icon} size={18} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 17, letterSpacing: '-0.02em' }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{l.label}</span>
            {l.href ? (
              <a href={l.href} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-teal-500)', fontWeight: 500, textDecoration: 'none', wordBreak: 'break-all' }}>{l.value}</a>
            ) : (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--fg-primary)', fontWeight: 500, wordBreak: 'break-all' }}>{l.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HQCard({ co }) {
  const opAddress = co.operationalAddress;
  const legalAddress = co.legalAddress;
  const directionsUrl = buildDirectionsUrl(opAddress);
  const mapsUrl = buildMapsUrl(opAddress);
  // Embed real Google Maps iframe for the operational address.
  const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(opAddress)}&output=embed`;
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ aspectRatio: '5/3', background: '#E8E8ED', position: 'relative', overflow: 'hidden' }}>
        <iframe
          title={`Mappa ${co.name}`}
          src={mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
        />
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ position: 'absolute', top: 12, right: 12, background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 'var(--radius-xs)', fontSize: 11, fontFamily: 'var(--font-mono)', boxShadow: 'var(--shadow-card)', textDecoration: 'none', color: 'var(--color-teal-500)', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
          <Icon name="external-link" size={11} /> Apri mappa
        </a>
      </div>
      <div style={{ padding: '20px 24px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Icon name="map-pin" size={16} color="var(--color-teal-500)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 16, letterSpacing: '-0.02em' }}>Sede operativa</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.6 }}>
          <b style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{co.name}</b><br />
          {opAddress}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '16px 0 8px' }}>
          <Icon name="building" size={14} color="var(--color-teal-500)" />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 14, letterSpacing: '-0.01em', color: 'var(--fg-secondary)' }}>Sede legale</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--fg-muted)', lineHeight: 1.55 }}>{legalAddress}</div>
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span>P.IVA {co.vat} · REA {co.rea}</span>
          <span>Cap. Soc. {co.capSoc}</span>
        </div>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 14, color: 'var(--color-mint-700)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Indicazioni stradali <Icon name="external-link" size={12} />
        </a>
      </div>
    </div>
  );
}

function ContactSuccess({ onReset, onNav }) {
  const ref = `CV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;
  return (
    <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '72px 32px', background: 'var(--bg-page)' }}>
      <div style={{ maxWidth: 580, textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '48px 48px 44px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--color-mint-50)', color: 'var(--color-mint-700)', display: 'grid', placeItems: 'center', margin: '0 auto 24px' }}>
          <Icon name="check" size={32} strokeWidth={2} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 650, fontSize: 36, letterSpacing: '-0.035em', margin: '0 0 14px' }}>
          Richiesta ricevuta.
        </h2>
        <p style={{ fontSize: 15, color: 'var(--fg-secondary)', lineHeight: 1.6, margin: '0 0 18px' }}>
          La tua richiesta è stata presa in carico — <b>non è un ordine di pagamento.</b> Un nostro responsabile commerciale ti
          contatterà entro 1 giorno lavorativo per concordare disponibilità di stock, prezzo a scaglioni e finestra di consegna.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--color-mint-50)', border: '1px solid var(--color-mint-300, #BDE9CC)', borderRadius: 999, marginBottom: 22, fontSize: 12, color: 'var(--color-mint-700)', fontWeight: 600 }}>
          <Icon name="info" size={13} />
          Nessun pagamento richiesto in questa fase
        </div>
        <div style={{ display: 'block', padding: '10px 16px', background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: 32 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 600, marginRight: 10 }}>Riferimento</span>
          <code style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-teal-500)', fontWeight: 600 }}>{ref}</code>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button variant="primary" onClick={onNav}>Continua a sfogliare</Button>
          <Button variant="ghost" onClick={onReset}>Invia un'altra richiesta</Button>
        </div>
      </div>
    </main>
  );
}
