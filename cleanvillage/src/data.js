export const CV_CATEGORIES = [
  { id:'lavasciuga',  label:'Lavasciuga pavimenti',      short:'Lavasciuga',     count: 64, kind:'scrubber', icon:'truck',           desc:'Uomo a bordo, uomo a terra, batteria o cavo.' },
  { id:'idro',        label:'Idropulitrici',             short:'Idropulitrici',  count: 48, kind:'washer',   icon:'spray-can',       desc:'Acqua fredda, acqua calda, alta pressione.' },
  { id:'detergenti',  label:'Detergenti professionali',  short:'Detergenti',     count: 142, kind:'detergent', icon:'flask-conical',   desc:'Sgrassanti, sanitizzanti, neutri, alcalini.' },
  { id:'carrelli',    label:'Carrelli & dispenser',      short:'Carrelli',       count: 38, kind:'cart',     icon:'shopping-cart',   desc:'Multifunzione, sacco, mop, lavavetri.' },
  { id:'aspira',      label:'Aspirapolvere & aspiraliquidi', short:'Aspira',     count: 36, kind:'vacuum',   icon:'wind',            desc:'Industriali, per polveri sottili, bagnato/asciutto.' },
  { id:'dpi',         label:'Scarpe & DPI',              short:'DPI',            count: 94, kind:'shoe',     icon:'shield',          desc:'Calzature antinfortunistiche, guanti, mascherine.' },
  { id:'fibre',       label:'Fibre, panni & dischi',     short:'Fibre',          count: 56, kind:'pad',      icon:'circle-dot',      desc:'Microfibre, mop, dischi abrasivi e lucidanti.' },
  { id:'asciuga',     label:'Asciugamani ad aria calda', short:'Asciugamani',    count: 14, kind:'dryer',    icon:'wind',            desc:'Lame d\'aria, asciugatori automatici inox.' },
  { id:'disinfest',   label:'Insetticidi & disinfestazione', short:'Disinfest.', count: 22, kind:'spray',    icon:'bug',             desc:'Copyr, esche, sistemi anti-volatili.' },
  { id:'vetri',       label:'Pulizia vetri & fotovoltaico', short:'Vetri & FV', count: 18, kind:'glass',    icon:'sparkles',        desc:'Spazzole telescopiche, sistemi ad acqua pura.' },
  { id:'carta',       label:'Carta & igiene',            short:'Carta',          count: 39, kind:'paper',    icon:'package',         desc:'Lucart, Celtex — bobine, asciugamani, carta igienica.' },
];

export const CV_BRANDS = [
  { name:'KÄRCHER',    weight: 700, letter:'-0.02em' },
  { name:'Comac',      weight: 400, italic: true },
  { name:'Nilfisk',    weight: 600, letter:'-0.01em' },
  { name:'Hako',       weight: 500 },
  { name:'Tennant',    weight: 600, letter:'0.04em' },
  { name:'Ghibli',     weight: 500, italic: true },
  { name:'Kiehl',      weight: 600 },
  { name:'Copyr',      weight: 400 },
  { name:'Lucart',     weight: 600 },
  { name:'Celtex',     weight: 500, italic: true },
  { name:'Technosafe', weight: 500 },
  { name:'IPC',        weight: 700, letter:'0.02em' },
];

export const CV_PRODUCTS = [
  { id:'rx220',  catId:'lavasciuga',  brand:'COMAC',     name:'Innova 100 B · Uomo a bordo', specs:['Serbatoio 145 L','Autonomia 4 h','Piste 1000 mm','Batteria al gel'], price:'€18.400', stock:'in', count:4, sku:'COM-IN100B', kind:'scrubber', badge:'Novità' },
  { id:'ts50',   catId:'lavasciuga',  brand:'NILFISK',   name:'SC500 53B Walk-Behind',       specs:['Serbatoio 50 L','Autonomia 3 h','Piste 530 mm'], price:'€4.820',  stock:'in', count:8, sku:'NIL-SC500-53', kind:'scrubber' },
  { id:'k250',   catId:'idro',        brand:'COMET',     name:'K 250 Classic Cold-Water',    specs:['Pressione 150 bar','Portata 600 L/h','Motore 2,5 kW'], price:'€690',   stock:'in', count:18, sku:'COMET-K250', kind:'washer' },
  { id:'hd12',   catId:'detergenti',  brand:'KIEHL',     name:'Tana Quick & Easy · Sgrassante alcalino', specs:['Tanica 10 L','pH 12,5','Concentrato 1:20'], price:'€89',   stock:'in', count:120, sku:'KH-TQE-10', kind:'detergent' },
  { id:'sp9',    catId:'carrelli',    brand:'TTS',       name:'Magic System Doppio Secchio', specs:['Vasche 2× 25 L','Telaio inox','Strizzatore'], price:'€420',  stock:'low', count:3, sku:'TTS-MS-DB', kind:'cart' },
  { id:'vac90',  catId:'aspira',      brand:'GHIBLI',    name:'Power WD 90.2 Aspiraliquidi', specs:['Fusto 90 L','Potenza 2400 W','Doppio motore'], price:'€1.250',stock:'in', count:6, sku:'GH-WD90', kind:'vacuum' },
  { id:'tec10',  catId:'dpi',         brand:'TECHNOSAFE',name:'Tech Run S3 SRC · Calzatura antinfortunistica', specs:['Categoria S3','Suola SRC','Mesh traspirante'], price:'€68', stock:'in', count:240, sku:'TS-RUN-S3', kind:'shoe', badge:'Promo −30%' },
  { id:'bp17',   catId:'fibre',       brand:'3M',        name:'Disco abrasivo nero 17″ Strip', specs:['Diametro 17″','Confezione 5 pz'], price:'€38', stock:'in', count:240, sku:'3M-BP17K', kind:'pad' },
  { id:'dyr',    catId:'asciuga',     brand:'STARMIX',   name:'AirStar Inox lame d\'aria',    specs:['Tempo 12 s','1100 W','HEPA H13'], price:'€340',  stock:'in', count:12, sku:'SM-AS-INOX', kind:'dryer' },
  { id:'cipr',   catId:'disinfest',   brand:'COPYR',     name:'Cipertrin T · Insetticida concentrato', specs:['Tanica 1 L','Base solvente','Uso prof.'], price:'€32', stock:'in', count:88, sku:'COP-CIP-1', kind:'spray' },
  { id:'wfp',    catId:'vetri',       brand:'UNGER',     name:'nLite Connect · Asta in carbonio 6 m', specs:['Lunghezza 6 m','Carbonio HiFlo','Acqua pura'], price:'€480', stock:'in', count:9, sku:'UNG-NL6', kind:'glass' },
  { id:'eltex',  catId:'carta',       brand:'LUCART',    name:'EcoNatural Mini Jumbo · Bancale', specs:['Bancale 24 conf.','2 veli','Riciclato'], price:'€220',  stock:'in', count:36, sku:'LU-ECO-MJ', kind:'paper' },
];

export const CV_COURSES = [
  { id:'safety', title:'Sicurezza & DPI in cantiere',          level:'Base',      duration:'8 ore · 1 giornata',  mode:'Aula o on-site',  nextDate:'18 giu 2026 · Busto Arsizio', price:'€180', desc:'Uso corretto dei DPI, valutazione rischi nei contesti di pulizia industriale, segnaletica HACCP.',           kind:'safety',    bg:'linear-gradient(135deg, #E8F2F5 0%, #C6DEE5 100%)' },
  { id:'machine',title:'Lavasciuga uomo a bordo · uso pratico', level:'Avanzato',  duration:'16 ore · 2 giornate', mode:'Aula + officina', nextDate:'02 lug 2026 · Showroom',     price:'€420', desc:'Configurazione, manutenzione ordinaria, ottimizzazione consumi, gestione batterie al gel e litio.',            kind:'machine',   bg:'linear-gradient(135deg, #F5F7F8 0%, #EBEFF1 100%)' },
  { id:'chem',   title:'Detergenti professionali & HACCP',      level:'Base',      duration:'6 ore · 1 giornata',  mode:'Aula',            nextDate:'25 giu 2026 · Busto Arsizio', price:'€220', desc:'Dosaggi, schede di sicurezza, compatibilità chimica e protocolli HACCP per il settore alimentare e sanitario.',  kind:'chemicals', bg:'linear-gradient(135deg, #E6FBEE 0%, #C8F5D8 100%)' },
  { id:'sales',  title:'Gare d\'appalto & specifiche tecniche', level:'Specialist',duration:'12 ore · 2 giornate', mode:'Aula',            nextDate:'10 set 2026 · Busto Arsizio', price:'€520', desc:'Come leggere un capitolato, dimensionare la flotta, redigere relazioni tecniche e dossier per gare pubbliche.',  kind:'sales',     bg:'linear-gradient(135deg, #FBE7C8 0%, #FBE2C0 100%)' },
];

export const CV_LANDING_VIDEOS = [
  { id:'tour-hq',     title:'Tour della sede',                  duration:'03:24', spot:'Hero · Video Aziendale', date:'12.03.2026', size:'248 MB', status:'live' },
  { id:'innova-demo', title:'COMAC Innova 100 B · in azione',   duration:'01:48', spot:'Macchine in evidenza',    date:'04.04.2026', size:'132 MB', status:'live' },
  { id:'service-be',  title:'Officina autorizzata · backstage', duration:'02:12', spot:'Settori serviti',         date:'21.04.2026', size:'164 MB', status:'draft' },
];

export const CV_INDUSTRIES = [
  { id:'imprese',   label:'Imprese di pulizia',         icon:'briefcase',    desc:'Carrelli, detergenti e ricambi per appalti multi-sede.' },
  { id:'industria', label:'Industria & manifattura',    icon:'factory',      desc:'Lavasciuga industriali, sgrassanti pesanti, aspirazioni.' },
  { id:'sanita',    label:'Sanità & RSA',               icon:'cross',        desc:'Disinfettanti PMC, sanificazione superfici, carrelli HACCP.' },
  { id:'gdo',       label:'GDO & retail',               icon:'shopping-bag', desc:'Scope automatiche, lava-vetri, igiene servizi pubblici.' },
  { id:'logistica', label:'Logistica & magazzini',      icon:'truck',        desc:'Spazzatrici uomo a bordo, scoraggia-piccione, container.' },
  { id:'horeca',    label:'Hotellerie & ristorazione',  icon:'utensils',     desc:'Detergenti HACCP, carta igienica, lavastoviglie professionali.' },
];
