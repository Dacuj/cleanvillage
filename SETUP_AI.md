# Assistente AI — setup chiave gratuita

La pagina `/scopri-macchina` usa **Google Gemini 1.5 Flash** (piano gratuito, ~1M token/giorno, nessuna carta di credito). Il modello viene chiamato dalla funzione serverless `cleanvillage/api/chat.js`, mai dal browser, così la chiave non finisce nel bundle.

## 1. Ottieni la chiave Gemini

1. Vai su https://aistudio.google.com/app/apikey con un account Google.
2. "Create API key" → "Create API key in new project".
3. Copia la stringa che inizia per `AIza...`.

## 2. Aggiungi la chiave all'ambiente

### Locale (dev)

Crea (o aggiorna) `cleanvillage/.env.local` aggiungendo:

```
GEMINI_API_KEY=AIza...la-tua-chiave
```

Poi `npm run dev` e apri `http://localhost:5173/scopri-macchina`.

> Nota: Vite di default espone solo le variabili `VITE_*` al browser. `GEMINI_API_KEY` resta sul server (nella function), che è esattamente quello che vogliamo.

### Vercel (produzione)

```
vercel env add GEMINI_API_KEY
# incolla la chiave, seleziona "Production" (e "Preview" se vuoi testarla nelle preview)
vercel deploy --prod
```

Oppure dalla dashboard: Project → Settings → Environment Variables.

## 3. Migrare ad altro provider

Il contratto fra `/api/chat` e il frontend è `POST {messages, products} → {reply, productIds}`. Per cambiare provider basta modificare `cleanvillage/api/chat.js`:

- **Groq (Llama 3.1, free)**: cambia `PROVIDER_URL` e il formato del body. Stessa shape di risposta.
- **OpenAI / Anthropic**: stessa logica, nuovo SDK o nuovo fetch.

Il frontend (`MachineFinder.jsx`) non va toccato.

## 4. Quando porti il deploy fuori da Vercel

Se sposti il sito su un altro hosting (Cloudflare Pages, Render, VPS), assicurati di portarti dietro:

- La funzione `api/chat.js` (adatta al runtime di destinazione: Cloudflare Workers, Express, Supabase Edge Functions...).
- La variabile d'ambiente `GEMINI_API_KEY`.
- Il rewrite delle SPA che lascia passare `/api/*` (vedi `vercel.json` per il pattern).
