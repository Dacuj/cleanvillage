import { useState } from 'react';
import { AdminPage, AdminIcon, ABtn, Panel, AField, AInput, ATextarea, ASelect, Badge } from './chrome.jsx';
import { useSiteContent, setSiteContent, useRemoteSaveStatus } from '../lib/siteContent.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

const TEMPLATE_DESCRIPTIONS = {
  quoteReceivedInternal: {
    label: 'Nuovo preventivo · notifica interna',
    desc: 'Mail inviata a te quando arriva una richiesta dal form contatti.',
    icon: 'inbox',
  },
  quoteReceivedCustomer: {
    label: 'Nuovo preventivo · conferma al cliente',
    desc: 'Mail automatica inviata al cliente che ha appena compilato il form. Conferma la ricezione e chiarisce che NON è un pagamento.',
    icon: 'mail-check',
  },
  orderIntentInternal: {
    label: 'Richiesta prodotto · notifica interna',
    desc: 'Mail inviata a te quando un cliente clicca "Richiedi preventivo" da una scheda prodotto.',
    icon: 'shopping-bag',
  },
  orderIntentCustomer: {
    label: 'Richiesta prodotto · conferma al cliente',
    desc: 'Mail automatica al cliente: conferma di "pronta veduta", lo informa che NON è un acquisto e che lo richiameremo.',
    icon: 'send',
  },
};

const PLACEHOLDERS = [
  ['{company}', "Ragione sociale dell'azienda cliente"],
  ['{vat}', 'Partita IVA'],
  ['{contact_name}', 'Nome della persona di riferimento'],
  ['{email}', "Email del cliente"],
  ['{phone}', 'Telefono'],
  ['{timeline}', 'Finestra di consegna richiesta'],
  ['{needs}', 'Esigenze elencate nel form'],
  ['{message}', 'Messaggio libero del cliente'],
  ['{productName}', 'Nome prodotto (per richieste da scheda)'],
  ['{sku}', 'SKU prodotto'],
  ['{quantity}', 'Quantità richiesta'],
  ['{reference}', 'Riferimento univoco della richiesta'],
  ['{notificationEmail}', 'Email da Impostazioni'],
  ['{signatureLine}', 'Riga di firma da Impostazioni'],
  ['{adminUrl}', 'Link al pannello admin'],
];

export default function AdminSettings() {
  const content = useSiteContent();
  const save = useRemoteSaveStatus();
  const settings = content.emailSettings || {};
  const templates = content.emailTemplates || {};

  const update = (path, value) => {
    setSiteContent((cur) => {
      const next = structuredClone(cur);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof obj[keys[i]] !== 'object' || obj[keys[i]] === null) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  return (
    <AdminPage
      eyebrow="Console interna"
      title="Impostazioni"
      subtitle="Configura l'email da cui partono le notifiche e i template usati per le risposte automatiche."
      actions={[<SaveIndicator key="s" state={save} />]}
    >
      {!isSupabaseConfigured && (
        <div style={WARN_BANNER}>
          <AdminIcon name="alert-triangle" size={16} color="var(--color-warning-500)" />
          <span>Modalità demo: le modifiche restano solo nel browser. Configura Supabase per renderle effettive online.</span>
        </div>
      )}

      <Panel title="Mittente delle email" padding="22px 26px">
        <Helper>
          Tutte le email automatiche (notifiche interne e conferme al cliente) usano i parametri qui sotto.
          L'invio reale richiede un'integrazione lato server (SMTP, Resend, ecc.): le credenziali vengono salvate
          per essere lette dalla function in <code style={Kbd}>cleanvillage/api/</code>. Fino a quando la function
          non è collegata, l'interruttore <b>"Invio attivo"</b> resta off e nessuna mail parte.
        </Helper>
        <Grid cols={2}>
          <AField label="Nome mittente" hint='Es. "Clean Village Srl"'>
            <AInput value={settings.senderName || ''} onChange={(e) => update('emailSettings.senderName', e.target.value)} />
          </AField>
          <AField label="Email mittente" hint='Es. "noreply@cleanvillage.it"'>
            <AInput type="email" value={settings.senderEmail || ''} onChange={(e) => update('emailSettings.senderEmail', e.target.value)} />
          </AField>
          <AField label="Reply-to" hint="Dove rispondono i clienti quando rispondono alla tua email">
            <AInput type="email" value={settings.replyTo || ''} onChange={(e) => update('emailSettings.replyTo', e.target.value)} />
          </AField>
          <AField label="Email che riceve le notifiche" hint="A quale indirizzo arrivano le richieste dal sito">
            <AInput type="email" value={settings.notificationEmail || ''} onChange={(e) => update('emailSettings.notificationEmail', e.target.value)} />
          </AField>
        </Grid>
        <Grid cols={2} style={{ marginTop: 14 }}>
          <AField label="Provider di invio">
            <ASelect value={settings.provider || 'smtp'} onChange={(e) => update('emailSettings.provider', e.target.value)}>
              <option value="smtp">SMTP (es. Gmail, Aruba)</option>
              <option value="resend">Resend.com</option>
              <option value="sendgrid">SendGrid</option>
            </ASelect>
          </AField>
          <AField label="Invio attivo" hint="Tienilo off finché non hai collegato l'API key del provider">
            <ASelect value={settings.enabled ? '1' : '0'} onChange={(e) => update('emailSettings.enabled', e.target.value === '1')}>
              <option value="0">No · disattivato</option>
              <option value="1">Sì · invia mail automatiche</option>
            </ASelect>
          </AField>
        </Grid>

        {settings.provider === 'smtp' && (
          <>
            <SubHeading>Credenziali SMTP</SubHeading>
            <Grid cols={2}>
              <AField label="Server SMTP" hint='Es. smtp.gmail.com'>
                <AInput value={settings.smtpHost || ''} onChange={(e) => update('emailSettings.smtpHost', e.target.value)} placeholder="smtp.gmail.com" />
              </AField>
              <AField label="Porta" hint="587 (TLS) o 465 (SSL)">
                <AInput value={settings.smtpPort || ''} onChange={(e) => update('emailSettings.smtpPort', e.target.value)} placeholder="587" />
              </AField>
              <AField label="Utente SMTP">
                <AInput value={settings.smtpUser || ''} onChange={(e) => update('emailSettings.smtpUser', e.target.value)} placeholder="cleanvillagesrl@gmail.com" />
              </AField>
              <AField label="Password / App password" hint="Per Gmail: usa una 'app password' generata in Google Account">
                <AInput type="password" value={settings.smtpSecret || ''} onChange={(e) => update('emailSettings.smtpSecret', e.target.value)} placeholder="••••••••••••••••" />
              </AField>
            </Grid>
          </>
        )}

        {(settings.provider === 'resend' || settings.provider === 'sendgrid') && (
          <>
            <SubHeading>API key del provider</SubHeading>
            <AField label={`${settings.provider === 'resend' ? 'Resend' : 'SendGrid'} API key`} hint="Letta dalla function — non viene esposta sul frontend">
              <AInput type="password" value={settings.smtpSecret || ''} onChange={(e) => update('emailSettings.smtpSecret', e.target.value)} placeholder="re_••••••••••••" />
            </AField>
          </>
        )}

        <SubHeading>Firma & destinatari extra</SubHeading>
        <AField label="Firma" hint="Riga finale inclusa in tutte le mail automatiche">
          <AInput value={settings.signatureLine || ''} onChange={(e) => update('emailSettings.signatureLine', e.target.value)} />
        </AField>
        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <input type="checkbox" checked={!!settings.bccDirectionEmail} onChange={(e) => update('emailSettings.bccDirectionEmail', e.target.checked)} />
            <span style={{ fontSize: 13 }}>Manda in BCC anche all'indirizzo direzione</span>
          </label>
        </div>
      </Panel>

      <div style={{ height: 18 }} />

      <Panel title="Template delle email" padding="22px 26px" action={
        <ABtn variant="ghost" size="sm" icon={<AdminIcon name="rotate-ccw" size={12} />} onClick={() => {
          if (!confirm('Ripristinare i template ai testi di default?')) return;
          update('emailTemplates', undefined);
          // Force a save of defaults by writing the current default templates.
          setTimeout(() => location.reload(), 100);
        }}>Reset template</ABtn>
      }>
        <Helper>
          Ogni template ha un <b>oggetto</b> e un <b>corpo</b>. I segnaposto come <code style={Kbd}>{'{company}'}</code> vengono sostituiti
          con i valori del cliente nel momento dell'invio. La risposta automatica al cliente serve a chiarire che la richiesta
          NON è un ordine di pagamento — è solo una notifica di interesse, dopo la quale lo contattate voi.
        </Helper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
          {Object.entries(TEMPLATE_DESCRIPTIONS).map(([key, info]) => (
            <TemplateEditor
              key={key}
              tplKey={key}
              info={info}
              template={templates[key] || {}}
              onChange={(field, value) => update(`emailTemplates.${key}.${field}`, value)}
            />
          ))}
        </div>

        <SubHeading>Segnaposti disponibili</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {PLACEHOLDERS.map(([ph, desc]) => (
            <div key={ph} style={{ padding: '10px 12px', background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 12 }}>
              <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-teal-500)', fontWeight: 600 }}>{ph}</code>
              <div style={{ color: 'var(--fg-muted)', marginTop: 4, fontSize: 11 }}>{desc}</div>
            </div>
          ))}
        </div>
      </Panel>
    </AdminPage>
  );
}

function TemplateEditor({ tplKey, info, template, onChange }) {
  const enabled = template.enabled !== false;
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--color-ice-50)', borderBottom: '1px solid var(--border-subtle)' }}>
        <span style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: enabled ? 'var(--color-mint-50)' : 'var(--color-ice-100)', color: enabled ? 'var(--color-mint-700)' : 'var(--fg-muted)', borderRadius: 'var(--radius-sm)' }}>
          <AdminIcon name={info.icon} size={16} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)' }}>{info.label}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{info.desc}</div>
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={enabled} onChange={(e) => onChange('enabled', e.target.checked)} />
          <span style={{ fontSize: 12, color: enabled ? 'var(--color-mint-700)' : 'var(--fg-muted)' }}>{enabled ? 'Attivo' : 'Disattivato'}</span>
        </label>
      </div>
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Grid cols={2}>
          <AField label="Destinatario" hint="Usa segnaposti come {email} o {notificationEmail}">
            <AInput value={template.to || ''} onChange={(e) => onChange('to', e.target.value)} placeholder="{notificationEmail}" />
          </AField>
          <AField label="Oggetto">
            <AInput value={template.subject || ''} onChange={(e) => onChange('subject', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Corpo" hint="Una riga vuota separa i paragrafi">
          <ATextarea rows={8} value={template.body || ''} onChange={(e) => onChange('body', e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6 }} />
        </AField>
      </div>
    </div>
  );
}

function SaveIndicator({ state }) {
  const map = {
    saving: { label: 'Salvataggio…', color: 'var(--fg-muted)', icon: 'loader' },
    saved: { label: 'Salvato online', color: 'var(--color-mint-700)', icon: 'cloud-check' },
    error: { label: 'Errore salvataggio', color: 'var(--color-danger-500)', icon: 'cloud-alert' },
    'local-only': { label: 'Solo locale (no Supabase)', color: 'var(--color-warning-500)', icon: 'cloud-off' },
    idle: { label: 'In attesa di modifiche', color: 'var(--fg-muted)', icon: 'cloud' },
  };
  const cur = map[state?.status] || map.idle;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: cur.color, fontFamily: 'var(--font-mono)' }}>
      <AdminIcon name={cur.icon} size={13} />
      {cur.label}
    </span>
  );
}

function Helper({ children }) {
  return (
    <div style={{ background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 12, color: 'var(--fg-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
      {children}
    </div>
  );
}

function Grid({ cols = 2, style, children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14, ...style }}>{children}</div>;
}

function SubHeading({ children }) {
  return (
    <div style={{ marginTop: 22, marginBottom: 8, fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)' }}>{children}</div>
  );
}

const Kbd = { fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--color-ice-100)', padding: '1px 5px', borderRadius: 3, color: 'var(--fg-primary)' };
const WARN_BANNER = { display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--color-warning-100)', border: '1px solid var(--color-warning-500)', borderRadius: 'var(--radius-md)', marginBottom: 18, fontSize: 12, color: 'var(--fg-primary)' };
