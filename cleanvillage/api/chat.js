// Vercel serverless function: AI machine-finder.
// Contract with the frontend (POST {messages, products} → {reply, productIds})
// is intentionally provider-agnostic; swap PROVIDER_URL + the request body
// shape to migrate off Gemini without touching the client.

const PROVIDER_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

function buildSystemPrompt(products) {
  const catalog = (products || []).map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.catId,
    kind: p.kind,
    specs: p.specs,
    summary: (p.description || '').slice(0, 240),
  }));

  return [
    "Sei l'assistente commerciale di Clean Village, un rivenditore italiano B2B di macchinari per la pulizia industriale.",
    "Il tuo compito è capire il problema del cliente (tipo di superficie, metri quadri, frequenza, settore, vincoli operativi) e proporre la macchina più adatta SCEGLIENDOLA SOLO dal catalogo qui sotto.",
    "Fai una domanda alla volta finché non hai abbastanza informazioni. Quando sei pronto, consiglia 1-3 prodotti (massimo 3).",
    "Tono: cordiale, professionale, parla in italiano (a meno che l'utente non scriva in altra lingua).",
    "Rispondi SEMPRE e SOLO con un oggetto JSON valido di questa forma esatta: {\"reply\": \"testo da mostrare nella chat\", \"productIds\": [\"id1\", \"id2\"]}.",
    "productIds DEVE contenere solo id presenti nel catalogo, MAX 3 elementi, oppure [] se devi ancora fare altre domande.",
    "Se il catalogo è vuoto o non c'è nulla di adatto, productIds=[] e nel reply suggerisci di contattare l'ufficio commerciale.",
    "",
    "CATALOGO (JSON):",
    JSON.stringify(catalog),
  ].join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurata sul server.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { messages = [], products = [] } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages è obbligatorio' });
  }

  const payload = {
    systemInstruction: { parts: [{ text: buildSystemPrompt(products) }] },
    contents: messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }],
    })),
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.4,
      maxOutputTokens: 800,
    },
  };

  try {
    const r = await fetch(`${PROVIDER_URL}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(502).json({
        error: data?.error?.message || `Upstream ${r.status}`,
      });
    }
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch { parsed = { reply: raw || 'Non sono riuscito a generare una risposta.', productIds: [] }; }

    const reply = typeof parsed.reply === 'string' ? parsed.reply : 'Ok.';
    const ids = Array.isArray(parsed.productIds) ? parsed.productIds.filter(x => typeof x === 'string').slice(0, 3) : [];
    return res.status(200).json({ reply, productIds: ids });
  } catch (err) {
    return res.status(502).json({ error: err?.message || 'Errore di rete verso il provider AI.' });
  }
}
