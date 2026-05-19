// Centralised, editable copy + images for the public site.
//
// Two-tier persistence:
// - Source of truth: Supabase `site_content` (singleton row id=1, JSONB)
//   so all visitors see the same up-to-date content.
// - Local cache: localStorage so the UI stays snappy and works offline.
//
// On first mount we fetch from Supabase, merge with the defaults, and warm
// the local cache. Every write goes to both: cache (immediate re-render)
// plus a remote upsert (so changes propagate to all visitors).
//
// Images are stored as `{ url, storage_path }` objects so the editor can
// later delete the underlying Supabase Storage object.

import { useEffect, useState, useCallback } from 'react';
import {
  getSiteContent as fetchRemote,
  upsertSiteContent as pushRemote,
} from './api.js';
import { isSupabaseConfigured } from './supabase.js';

const STORAGE_KEY = 'cv:site-content:v1';
const EVENT_NAME = 'cv-site-content-changed';
const REMOTE_STATUS_EVENT = 'cv-site-content-remote-status';

export const DEFAULT_CONTENT = {
  company: {
    name: 'Clean Village Srl',
    tagline:
      "Macchinari per la pulizia industriale e forniture all'ingrosso. Al servizio di imprese e contractor in tutta Italia.",
    legalAddress: 'Via Sacerdote Giovanni Giuseppe Pirozzi, 3 — 80010 Villaricca (NA)',
    operationalAddress: 'Corso Europa, Prima Trav. 29 — 80010 Villaricca (NA)',
    operationalCity: 'Villaricca (NA)',
    vat: '06731021215',
    rea: '836112',
    capSoc: '€ 80.000,00 i.v.',
    phonePrimary: '+39 081 3303390',
    phoneSecondary: '+39 081 8958213',
    phoneMobile: '+39 371 179 1282',
    emailPrimary: 'direzione.cleanvillage@gmail.com',
    emailSecondary: 'cleanvillagesrl@gmail.com',
    website: 'www.cleanvillage.it',
    hours: 'Lun–Ven · 08:30–18:00',
    foundedYear: '1985',
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
    socials: {
      facebook: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    },
  },
  utility: {
    salesTerms: 'Condizioni di vendita',
    warrantyTerms: 'Condizioni di garanzia',
    tradeArea: 'Area riservata',
  },
  hero: {
    eyebrow: 'Pulizia industriale & forniture B2B · Villaricca (NA)',
    titleHuman: "Macchinari e forniture per chi pulisce di mestiere.",
    titleHumanAccent: 'pulisce di mestiere',
    subtitle:
      "Quarant'anni di forniture per imprese di pulizia, fabbriche e strutture in tutta Italia. Oltre 500 codici a magazzino, 24 marchi, preventivo entro 24 ore.",
    ctaPrimary: 'Richiedi un Preventivo',
    ctaSecondary: 'Esplora il Catalogo',
    socialProof: '1.400+ contractor servono i propri clienti con Clean Village',
    rating: '4,9 / 5 su Trustpilot · 312 recensioni',
    stats: [
      { value: '40', unit: 'anni', label: 'Attività ininterrotta' },
      { value: '500', unit: '+', label: 'Codici a magazzino' },
      { value: '24', unit: 'h', label: 'Risposta preventivo', accent: true },
      { value: '3', unit: '', label: 'Certificazioni ISO' },
    ],
    badgeOffer: {
      eyebrow: 'Offerta in corso',
      text: 'Sconti progressivi su detergenti professionali per ordini ≥ 5 fusti.',
      deadline: 'Fino al 31.05.2026',
    },
    sellerBadge: {
      eyebrow: 'Best seller 2026',
      name: 'COMAC Innova 100 B',
      specs: '145 L · 1000 mm · 4 h autonomia',
      price: '€18.400',
      sku: 'RIF · COM-IN100B',
      availability: 'Disponibile · 4 pz',
    },
  },
  brandMarquee: {
    label: 'Rivenditore autorizzato',
    cta: 'Vedi tutti i marchi distribuiti',
  },
  categoriesSection: {
    eyebrow: 'Catalogo · 11 categorie',
    title: 'Tutto ciò che serve alla tua operazione.',
    ctaAll: 'Esplora il catalogo completo',
    featureDescription:
      "Uomo a bordo o uomo a terra, batteria al gel o litio. Configurazione e prova in sede prima dell'acquisto.",
  },
  promos: [
    {
      tag: 'PROMO −30%',
      title: 'Calzature antinfortunistiche S3',
      subtitle: 'Su scorte selezionate · fino esaurimento',
      cta: 'Approfitta ora',
      kind: 'shoe',
      color: 'mint',
    },
    {
      tag: 'NOVITÀ 2026',
      title: 'COMAC Innova 100 B',
      subtitle: 'La nuova generazione uomo a bordo',
      cta: 'Scopri la macchina',
      kind: 'scrubber',
      color: 'teal',
    },
    {
      tag: 'BANCALE',
      title: 'Lucart EcoNatural — 24 conf.',
      subtitle: 'Carta tissue 100% riciclata',
      cta: 'Calcola il risparmio',
      kind: 'paper',
      color: 'teal',
    },
  ],
  highlights: {
    eyebrow: 'Macchine in evidenza · 3 modelli che contano',
    title: 'I cavalli da lavoro che consigliamo a occhi chiusi.',
    intro:
      "Tre macchine che vendiamo da anni, conosciamo nei dettagli e seguiamo dal service alla fornitura di ricambi. Sono il nostro punto di partenza quando ci chiedi una flotta.",
    items: [
      {
        id: 'comac-innova',
        eyebrow: 'Punta di diamante · COMAC',
        name: 'Innova 100 B Uomo a Bordo',
        tagline: 'La lavasciuga che più imprese hanno scelto nel 2025.',
        desc:
          "Macchina compatta per superfici da 800 a 4.000 m². Telaio in acciaio rinforzato, gruppo aspirante a 3 stadi e pannello touch programmabile con tre profili di pulizia salvabili. Pensata per lavorare turni doppi senza fermo macchina.",
        specs: [
          ['Serbatoio', '145 L'],
          ['Piste', '1000 mm'],
          ['Autonomia', '4 h'],
          ['Resa oraria', '7.000 m²/h'],
        ],
        pid: 'rx220',
        side: 'left',
      },
      {
        id: 'karcher-hd',
        eyebrow: 'In esclusiva · KÄRCHER PROFESSIONAL',
        name: 'HD 9/20-4 Cage Plus',
        tagline: "L'idropulitrice trifase che non spegne mai il cantiere.",
        desc:
          "Acqua fredda 200 bar, telaio cage in tubolare, motore con dispositivo di pre-sgancio: progettata per lavare flotte di mezzi, piazzali e infrastrutture pesanti in continuo.",
        specs: [
          ['Pressione', '200 bar'],
          ['Portata', '900 L/h'],
          ['Motore', '7 kW · trifase'],
          ['Peso', '63 kg'],
        ],
        pid: 'k250',
        side: 'right',
      },
      {
        id: 'ghibli-vac',
        eyebrow: 'Service interno autorizzato · GHIBLI',
        name: 'Power WD 90.2 Aspiraliquidi',
        tagline: 'Doppio motore, 90 litri: il riferimento per le officine.',
        desc:
          'Aspirapolvere/aspiraliquidi industriale a doppio motore: aspira polveri sottili, liquidi e residui di lavorazione fino a 90 litri. Filtro lavabile e accessori in acciaio inox.',
        specs: [
          ['Fusto', '90 L'],
          ['Potenza', '2.400 W'],
          ['Depressione', '2.300 mm H₂O'],
          ['Accessori', 'Inox completi'],
        ],
        pid: 'vac90',
        side: 'left',
      },
    ],
  },
  industries: {
    eyebrow: 'I settori che riforniamo',
    title: 'Configurazioni e prezzi pensati per il tuo settore.',
    intro:
      "Ogni settore ha esigenze diverse: macchine, certificazioni, listini, formati. Il nostro team parte da chi sei e cosa fai, non da un catalogo generico.",
  },
  video: {
    eyebrow: 'Video aziendale',
    title: 'La nostra sede operativa a Villaricca.',
    subtitle:
      'Visita il magazzino, prova ogni macchina nella nostra sede e incontra il team che segue il tuo conto. Apri il tour della sede di Villaricca (NA).',
    cta: 'Prenota una visita',
    rows: [
      { icon: 'building-2', label: 'Sede operativa', value: 'Corso Europa, Villaricca (NA)' },
      { icon: 'package', label: 'Magazzino e logistica', value: '500+ SKU sempre a stock' },
      { icon: 'wrench', label: 'Officina autorizzata', value: 'Service Comac · Nilfisk · Hako' },
    ],
    placeholderLabel: 'CLEANVILLAGE_HQ_TOUR_2026.MP4',
    locationLabel: 'Tour della sede · Villaricca (NA)',
  },
  formazione: {
    eyebrow: 'Accademia Clean Village · dal 2018',
    title: 'Formazione e corsi per chi lavora con le mani.',
    intro:
      "Una macchina vale quanto chi la guida. Da otto anni formiamo operatori, capi-squadra e responsabili acquisti su uso sicuro, manutenzione, sanificazione professionale e gare d'appalto. Corsi in aula a Villaricca, in azienda da te o in modalità ibrida.",
    stats: [
      { value: '42', label: 'Corsi erogati · 2025' },
      { value: '1.860', label: 'Operatori formati' },
      { value: '96%', label: 'Indice gradimento' },
    ],
    closingTitle: 'Hai bisogno di un corso su misura per la tua squadra?',
    closingSubtitle:
      'Costruiamo programmi dedicati per imprese e plant industriali — minimo 6 partecipanti.',
    ctaBrochure: 'Brochure corsi 2026',
    ctaRequest: 'Richiedi un corso',
  },
  featured: {
    eyebrow: 'In evidenza · spediti questa settimana',
    title: 'Pronti a magazzino, in spedizione.',
    ctaAll: 'Vedi tutti gli articoli a stock',
  },
  quoteCta: {
    eyebrow: 'Pronti quando lo sei tu',
    title: 'Preventivo personalizzato entro 24 ore.',
    subtitle:
      'Inviaci specifiche, quantità target e finestra di consegna. Il nostro team risponde con stock, prezzo a scaglioni e tempi confermati.',
    callLabel: 'Chiama in azienda',
    emailLabel: "Scrivi all'azienda",
  },
  contactPage: {
    eyebrow: 'Direzione commerciale · risposta entro 24 ore',
    title: 'Raccontaci cosa stai allestendo.',
    intro:
      "Inviaci specifiche, quantità target e finestra di consegna. Rispondiamo entro 1 giorno lavorativo con disponibilità di stock, prezzo a scaglioni e tempi di consegna confermati.",
    quickStat1Label: 'Tempo medio di risposta',
    quickStat1Value: '6h 12m',
    quickStat1Small: 'Lun–Ven · 08:30–18:00',
    quickStat2Label: 'Preventivi finalizzati 2025',
    quickStat2Value: '3.482',
    quickStat2Small: '92% conversione su richieste',
    submitNote:
      'Inviando confermi le nostre condizioni di vendita. Risposta entro 1 giorno lavorativo.',
  },
  images: {
    // Each slot can be either null or { url, storage_path }.
    heroImage: null,
    'hm-comac-innova': null,
    'hm-karcher-hd': null,
    'hm-ghibli-vac': null,
    'promo-0': null,
    'promo-1': null,
    'promo-2': null,
    videoPoster: null,
    hqMap: null,
  },
  // Pagine istituzionali — testi modificabili dall'editor.
  legalPages: {
    salesTerms: {
      title: 'Condizioni generali di vendita',
      subtitle:
        'Termini, modalità di pagamento e clausole che regolano i nostri rapporti commerciali B2B.',
      sections: [
        { heading: '1. Oggetto', paragraphs: [
          "Le presenti condizioni si applicano a tutte le forniture di Clean Village Srl verso clienti professionali (P.IVA o codice fiscale d'impresa)."
        ] },
        { heading: '2. Ordini e conferme', paragraphs: [
          "L'ordine si intende perfezionato con la conferma scritta da parte del nostro ufficio commerciale. Le quantità, i prezzi e i tempi indicati nei preventivi hanno validità 30 giorni salvo diversa indicazione."
        ] },
        { heading: '3. Prezzi e pagamenti', paragraphs: [
          "I prezzi sono espressi in euro, IVA esclusa, franco nostro magazzino di Villaricca (NA). Le condizioni di pagamento concordate sono indicate in conferma d'ordine. In caso di ritardo si applicano gli interessi di mora ai sensi del D.Lgs. 231/2002."
        ] },
        { heading: '4. Consegna', paragraphs: [
          "I tempi di consegna sono indicativi e decorrono dalla conferma d'ordine. Eventuali ritardi non danno diritto a risarcimenti. La merce viaggia a rischio del destinatario."
        ] },
        { heading: '5. Garanzia e reclami', paragraphs: [
          "La garanzia ha durata 24 mesi dalla data di consegna, salvo diversa indicazione del produttore. Eventuali difetti vanno segnalati per iscritto entro 8 giorni dalla scoperta."
        ] },
        { heading: '6. Foro competente', paragraphs: [
          "Per ogni controversia è competente in via esclusiva il Foro di Napoli Nord."
        ] },
      ],
    },
    warranty: {
      title: 'Condizioni di garanzia',
      subtitle:
        "Cosa copriamo, per quanto tempo, e come attivare l'assistenza tecnica.",
      sections: [
        { heading: 'Durata', paragraphs: [
          "Tutte le macchine vendute sono coperte da garanzia secondo i termini del produttore (di norma 12 o 24 mesi), che decorrono dalla data di consegna documentata.",
        ] },
        { heading: 'Cosa copre', paragraphs: [
          "La garanzia copre i difetti di fabbricazione e i guasti riconducibili a vizi del materiale. Sono esclusi: usura normale (spazzole, filtri, ruote), danni da uso improprio, manomissioni e mancata manutenzione.",
        ] },
        { heading: 'Come attivarla', paragraphs: [
          "Per aprire una pratica di garanzia, contattare il nostro service all'indirizzo email principale indicando matricola macchina, fattura d'acquisto e descrizione del guasto. La nostra officina autorizzata interviene entro 48 ore lavorative per i clienti con contratto attivo.",
        ] },
      ],
    },
    privacy: {
      title: 'Informativa privacy',
      subtitle:
        "Come trattiamo i tuoi dati personali, ai sensi del Regolamento UE 2016/679 (GDPR).",
      sections: [
        { heading: 'Titolare del trattamento', paragraphs: [
          "Clean Village Srl, Via Sacerdote Giovanni Giuseppe Pirozzi, 3 — 80010 Villaricca (NA), P.IVA 06731021215. Contatto: direzione.cleanvillage@gmail.com.",
        ] },
        { heading: 'Dati raccolti', paragraphs: [
          "Raccogliamo i dati che ci fornisci compilando i nostri form (nome, ragione sociale, P.IVA, email, telefono, descrizione richiesta) e i log tecnici di navigazione necessari al funzionamento del sito.",
        ] },
        { heading: 'Finalità', paragraphs: [
          "I dati sono utilizzati per rispondere alle richieste di preventivo, gestire il rapporto commerciale, adempiere obblighi di legge (fatturazione, conservazione documentale) e — solo previo consenso — inviare comunicazioni commerciali.",
        ] },
        { heading: 'Conservazione', paragraphs: [
          "I dati commerciali sono conservati per la durata del rapporto e per i 10 anni successivi previsti dalla normativa fiscale. I dati di marketing sono conservati fino a revoca del consenso.",
        ] },
        { heading: 'Diritti dell\'interessato', paragraphs: [
          "Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione. Per esercitarli scrivici a direzione.cleanvillage@gmail.com. Hai inoltre diritto di reclamo all'Autorità Garante (www.garanteprivacy.it).",
        ] },
      ],
    },
    cookie: {
      title: 'Cookie policy',
      subtitle: 'Quali cookie utilizziamo e come gestire le preferenze.',
      sections: [
        { heading: 'Cookie tecnici', paragraphs: [
          "Utilizziamo cookie tecnici strettamente necessari al funzionamento del sito (sessione, preferenze di visualizzazione). Non richiedono consenso preventivo.",
        ] },
        { heading: 'Cookie di terze parti', paragraphs: [
          "La mappa Google Maps integrata nella pagina contatti rilascia cookie da parte di Google. Per disattivarli, modifica le impostazioni del tuo browser o consulta la privacy policy di Google.",
        ] },
        { heading: 'Gestione consensi', paragraphs: [
          "Puoi modificare in qualsiasi momento le preferenze cookie dalle impostazioni del browser o cancellando i cookie già memorizzati.",
        ] },
      ],
    },
    terms: {
      title: 'Termini e condizioni d\'uso',
      subtitle: "Condizioni che regolano la navigazione e l'utilizzo di questo sito.",
      sections: [
        { heading: 'Proprietà dei contenuti', paragraphs: [
          "Tutti i contenuti del sito (testi, immagini, marchi) sono di proprietà di Clean Village Srl o dei rispettivi titolari. Ogni uso non autorizzato è vietato.",
        ] },
        { heading: 'Limitazione di responsabilità', paragraphs: [
          "Le informazioni di prodotto, prezzi e disponibilità riportati nel catalogo sono indicativi e non costituiscono offerta vincolante. Per condizioni vincolanti fare riferimento al preventivo ufficiale.",
        ] },
        { heading: 'Link esterni', paragraphs: [
          "Il sito può contenere link a siti di terzi: non siamo responsabili dei contenuti, della disponibilità o delle politiche privacy di tali siti.",
        ] },
      ],
    },
  },
  // Pagine non-legali ma ancora editabili: Azienda, Servizi, Video.
  pages: {
    about: {
      eyebrow: 'Chi siamo',
      title: "Clean Village. Forniture per chi pulisce di mestiere dal 1985.",
      intro:
        "Siamo un'azienda familiare con sede a Villaricca, in provincia di Napoli, specializzata nella distribuzione di macchinari e prodotti per la pulizia industriale e civile. Da quarant'anni serviamo imprese di pulizia, industrie, GDO, sanità, hotel e ristorazione in tutta Italia.",
      values: [
        { icon: 'truck', title: 'Consegne rapide', desc: "Magazzino sempre rifornito di oltre 500 SKU. Spedizioni in 24-48 ore sulla maggior parte del territorio nazionale." },
        { icon: 'wrench', title: 'Service autorizzato', desc: 'Officina autorizzata per i principali marchi (Comac, Nilfisk, Hako, Tennant). Ricambi originali in pronta consegna.' },
        { icon: 'graduation-cap', title: 'Formazione tecnica', desc: "Corsi di formazione su uso macchine, HACCP, sicurezza DPI per operatori e responsabili." },
        { icon: 'badge-check', title: 'Certificazioni ISO', desc: 'Sistema qualità ISO 9001, ambiente ISO 14001, sicurezza sul lavoro ISO 45001.' },
      ],
    },
    services: {
      eyebrow: 'Cosa facciamo',
      title: 'Servizi a 360° per la pulizia professionale.',
      intro:
        "Non vendiamo solo prodotti: offriamo un servizio completo che parte dalla consulenza tecnica e arriva fino all'assistenza post-vendita.",
      items: [
        {
          id: 'assistenza',
          icon: 'wrench',
          title: 'Assistenza tecnica',
          desc: "Officina interna autorizzata Comac, Nilfisk, Hako, Tennant. Interventi su appuntamento entro 48 ore per i clienti con contratto attivo. Ricambi originali sempre disponibili.",
        },
        {
          id: 'noleggio',
          icon: 'calendar',
          title: 'Noleggio macchine',
          desc: "Soluzioni di noleggio a breve e lungo termine per coprire picchi di lavoro, cantieri temporanei o per valutare una macchina prima dell'acquisto. Manutenzione inclusa.",
        },
        {
          id: 'formazione',
          icon: 'graduation-cap',
          title: 'Formazione e corsi',
          desc: "Accademia Clean Village dal 2018: corsi su uso sicuro delle macchine, HACCP, detergenti professionali, gare d'appalto. In aula a Villaricca o presso la tua sede.",
        },
        {
          id: 'preventivi',
          icon: 'file-text',
          title: 'Preventivi su misura',
          desc: "Il nostro team commerciale risponde entro 24 ore lavorative con disponibilità di stock, prezzo a scaglioni e tempi di consegna confermati.",
        },
      ],
    },
    videoPage: {
      eyebrow: 'Video aziendale',
      title: 'Dentro alla nostra sede operativa.',
      intro:
        "Un tour del nostro magazzino, dell'area showroom e dell'officina autorizzata a Villaricca (NA). Tutto quello che serve al tuo lavoro, sotto un solo tetto.",
      embedTitle: 'CleanVillage HQ tour',
      embedUrl: '',
      cta: 'Prenota una visita',
    },
  },
};

// --- Persistence helpers --------------------------------------------------
function safeGet() {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeSet(value) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* quota or unavailable */
  }
}

function notifyChange() {
  try { window.dispatchEvent(new CustomEvent(EVENT_NAME)); } catch { /* */ }
}

function emitRemoteStatus(status, error) {
  try {
    window.dispatchEvent(new CustomEvent(REMOTE_STATUS_EVENT, {
      detail: { status, error: error?.message || null, at: Date.now() },
    }));
  } catch { /* */ }
}

// Recursively merge stored values onto defaults so a missing key in storage
// still falls back to the default copy.
function deepMerge(target, source) {
  if (source === null || source === undefined) return target;
  if (typeof source !== 'object' || Array.isArray(source)) return source;
  const out = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    const t = out[key];
    const s = source[key];
    if (Array.isArray(s)) {
      out[key] = s;
    } else if (s && typeof s === 'object') {
      out[key] = deepMerge(t || {}, s);
    } else if (s !== undefined) {
      out[key] = s;
    }
  }
  return out;
}

export function getSiteContent() {
  return deepMerge(DEFAULT_CONTENT, safeGet());
}

let remotePromise = null;
let remoteLoaded = false;

// Pull the latest content from Supabase and warm the local cache.
export function loadFromRemote(force = false) {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  if (!force && remotePromise) return remotePromise;
  remotePromise = fetchRemote()
    .then((remote) => {
      remoteLoaded = true;
      if (remote && typeof remote === 'object') {
        const merged = deepMerge(DEFAULT_CONTENT, remote);
        safeSet(merged);
        notifyChange();
        return merged;
      }
      return null;
    })
    .catch((err) => {
      console.error('[siteContent] remote fetch failed', err);
      remotePromise = null;
      return null;
    });
  return remotePromise;
}

// Apply edits locally + push to Supabase. Local update is synchronous so the
// UI reflects the change immediately; the remote upsert is fire-and-forget.
export function setSiteContent(updater, { remote = true } = {}) {
  const current = getSiteContent();
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  safeSet(next);
  notifyChange();
  if (remote && isSupabaseConfigured) {
    emitRemoteStatus('saving');
    pushRemote(next)
      .then(() => emitRemoteStatus('saved'))
      .catch((err) => {
        console.error('[siteContent] remote push failed', err);
        emitRemoteStatus('error', err);
      });
  } else if (remote) {
    emitRemoteStatus('local-only');
  }
  return next;
}

export function resetSiteContent({ remote = true } = {}) {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
  notifyChange();
  if (remote && isSupabaseConfigured) {
    emitRemoteStatus('saving');
    pushRemote({}).then(() => emitRemoteStatus('saved')).catch((err) => emitRemoteStatus('error', err));
  } else if (remote) {
    emitRemoteStatus('local-only');
  }
}

// --- React hooks ----------------------------------------------------------
export function useSiteContent() {
  const [content, setContent] = useState(() => getSiteContent());
  useEffect(() => {
    // Trigger remote load once (module-level guard).
    if (!remoteLoaded && isSupabaseConfigured) loadFromRemote();
    const handler = () => setContent(getSiteContent());
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);
  return content;
}

// Hook returning the last remote save status: { status, error, at } where
// status is one of: idle | saving | saved | error | local-only.
export function useRemoteSaveStatus() {
  const [state, setState] = useState({ status: isSupabaseConfigured ? 'idle' : 'local-only', error: null, at: null });
  useEffect(() => {
    const handler = (e) => setState(e.detail);
    window.addEventListener(REMOTE_STATUS_EVENT, handler);
    return () => window.removeEventListener(REMOTE_STATUS_EVENT, handler);
  }, []);
  return state;
}

export function useEditSiteContent() {
  const update = useCallback((path, value) => {
    setSiteContent((current) => {
      const next = structuredClone(current);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (typeof obj[k] !== 'object' || obj[k] === null) obj[k] = {};
        obj = obj[k];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);
  return update;
}

// Read an image slot: returns { url } (or null). Accepts both the new
// `{ url, storage_path }` object and the legacy localStorage data-URI fallback.
export function resolveImageSlot(content, slotId) {
  const v = content?.images?.[slotId];
  if (v && typeof v === 'object' && v.url) return v;
  if (typeof v === 'string' && v) return { url: v };
  try {
    const legacy = localStorage.getItem(`imgslot:${slotId}`);
    if (legacy) return { url: legacy, legacy: true };
  } catch { /* */ }
  return null;
}

// Helper for building a Google Maps directions URL to a given address.
export function buildDirectionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function buildMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
