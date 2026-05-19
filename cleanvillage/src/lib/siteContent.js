// Centralised, editable copy + images for the public site.
// Persisted to localStorage so non-developers can edit everything from
// /admin/landing without redeploying code. Falls back to the defaults below.

import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'cv:site-content:v1';
const EVENT_NAME = 'cv-site-content-changed';

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
    titleTechnical: '500+ SKU. 24 marchi. Un solo fornitore.',
    titleTechnicalAccent: 'Un solo fornitore.',
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
    // Slot ids referenced from Landing/Contact/Header
    heroImage: '',
    'hm-comac-innova': '',
    'hm-karcher-hd': '',
    'hm-ghibli-vac': '',
    videoPoster: '',
    hqMap: '',
  },
};

// --- Persistence helpers --------------------------------------------------
function safeGet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function safeSet(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* quota or unavailable */
  }
}

// Recursively merge stored values onto defaults so a missing key in storage
// still falls back to the default copy.
function deepMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) return source ?? target;
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

export function setSiteContent(updater) {
  const current = getSiteContent();
  const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
  safeSet(next);
  try {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* ignore */
  }
  return next;
}

export function resetSiteContent() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
  try { window.dispatchEvent(new CustomEvent(EVENT_NAME)); } catch { /* */ }
}

// --- React hooks ----------------------------------------------------------
export function useSiteContent() {
  const [content, setContent] = useState(() => getSiteContent());
  useEffect(() => {
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

// Helper for building a Google Maps directions URL to a given address.
export function buildDirectionsUrl(address) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function buildMapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
