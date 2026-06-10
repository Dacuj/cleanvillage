// Vercel serverless function: transactional email notifications.
//
// Called fire-and-forget by the storefront when a quote/contact request is
// created. Reads the email settings + templates that the owner edits in
// /admin/settings (stored in the Supabase `site_content` row) and sends via
// Resend (https://resend.com) — a single RESEND_API_KEY env var is all the
// deploy needs.
//
// Required env (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY            — API key from resend.com (free tier is fine)
//   VITE_SUPABASE_URL         — already set for the frontend
//   VITE_SUPABASE_ANON_KEY    — already set for the frontend
//
// Without RESEND_API_KEY the function answers 200 {skipped:true} so the
// storefront keeps working — quotes are still saved in the database.

const ALLOWED_TYPES = {
  quote: ['quoteReceivedInternal', 'quoteReceivedCustomer'],
  order: ['orderIntentInternal', 'orderIntentCustomer'],
};

// Naive per-instance rate limit so the public endpoint can't be used to
// blast emails. Serverless instances are short-lived; this is a best-effort
// cap, the real guarantee is Resend's own quota.
const hits = [];
function rateLimited() {
  const now = Date.now();
  while (hits.length && now - hits[0] > 60_000) hits.shift();
  if (hits.length >= 10) return true;
  hits.push(now);
  return false;
}

function interpolate(template, vars) {
  return String(template || '').replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined && vars[key] !== null ? String(vars[key]) : ''
  );
}

function sanitize(value, max = 600) {
  // Strip control characters (keeps newlines for message bodies) and cap length.
  return String(value ?? '')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
    .slice(0, max);
}

async function loadSiteContent() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const r = await fetch(`${url}/rest/v1/site_content?id=eq.1&select=data`, {
    headers: { apikey: key, authorization: `Bearer ${key}` },
  });
  if (!r.ok) return null;
  const rows = await r.json();
  return rows?.[0]?.data || null;
}

async function sendViaResend({ apiKey, from, to, replyTo, subject, text, bcc }) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from,
      to: [to],
      ...(bcc ? { bcc: [bcc] } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      text,
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || `Resend ${r.status}`);
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (rateLimited()) {
    return res.status(429).json({ error: 'Troppe richieste, riprova tra un minuto.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { type, data = {} } = body || {};
  const templateKeys = ALLOWED_TYPES[type];
  if (!templateKeys) {
    return res.status(400).json({ error: 'type non valido' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(200).json({ skipped: true, reason: 'RESEND_API_KEY non configurata' });
  }

  const content = await loadSiteContent();
  if (!content) {
    return res.status(200).json({ skipped: true, reason: 'site_content non raggiungibile' });
  }

  const settings = content.emailSettings || {};
  if (settings.enabled === false) {
    return res.status(200).json({ skipped: true, reason: 'Invio email disattivato dal pannello' });
  }

  const senderEmail = settings.senderEmail || 'onboarding@resend.dev';
  const from = `${settings.senderName || 'Clean Village'} <${senderEmail}>`;
  const notificationEmail = settings.notificationEmail || content.company?.emailPrimary || '';

  // Variables available inside {placeholders} of the templates.
  const vars = {
    company: sanitize(data.company, 160),
    vat: sanitize(data.vat, 32),
    contact_name: sanitize(data.contact_name, 120),
    email: sanitize(data.email, 160),
    phone: sanitize(data.phone, 48),
    timeline: sanitize(data.timeline, 120),
    needs: sanitize(Array.isArray(data.needs) ? data.needs.join(', ') : data.needs, 300),
    message: sanitize(data.message, 2000),
    reference: sanitize(data.reference, 64),
    productName: sanitize(data.productName, 160),
    sku: sanitize(data.sku, 64),
    quantity: sanitize(data.quantity, 16),
    notificationEmail,
    signatureLine: settings.signatureLine || 'Clean Village Srl',
    adminUrl: `https://${content.company?.website?.replace(/^https?:\/\//, '') || 'cleanvillage.it'}/admin`,
  };

  const results = [];
  for (const key of templateKeys) {
    const tpl = content.emailTemplates?.[key];
    if (!tpl || tpl.enabled === false) continue;
    const to = interpolate(tpl.to, vars).trim();
    if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) continue;
    try {
      await sendViaResend({
        apiKey,
        from,
        to,
        replyTo: settings.replyTo || undefined,
        bcc: key.endsWith('Internal') && settings.bccDirectionEmail && content.company?.emailPrimary !== to
          ? content.company?.emailPrimary
          : undefined,
        subject: interpolate(tpl.subject, vars) || 'Notifica Clean Village',
        text: interpolate(tpl.body, vars),
      });
      results.push({ template: key, ok: true });
    } catch (err) {
      results.push({ template: key, ok: false, error: err.message });
    }
  }

  return res.status(200).json({ sent: results.filter(r => r.ok).length, results });
}
