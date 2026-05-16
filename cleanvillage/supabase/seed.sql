-- CleanVillage — Seed data
-- Run this AFTER 0001_init.sql in the Supabase SQL editor.

-- ============================================================
-- CATEGORIES
-- ============================================================
insert into categories (id, label, short, kind, icon, description, sort_order) values
  ('lavasciuga',  'Lavasciuga pavimenti',          'Lavasciuga',    'scrubber',  'truck',         'Uomo a bordo, uomo a terra, batteria o cavo.', 10),
  ('idro',        'Idropulitrici',                 'Idropulitrici', 'washer',    'spray-can',     'Acqua fredda, acqua calda, alta pressione.', 20),
  ('detergenti',  'Detergenti professionali',      'Detergenti',    'detergent', 'flask-conical', 'Sgrassanti, sanitizzanti, neutri, alcalini.', 30),
  ('carrelli',    'Carrelli & dispenser',          'Carrelli',      'cart',      'shopping-cart', 'Multifunzione, sacco, mop, lavavetri.', 40),
  ('aspira',      'Aspirapolvere & aspiraliquidi', 'Aspira',        'vacuum',    'wind',          'Industriali, per polveri sottili, bagnato/asciutto.', 50),
  ('dpi',         'Scarpe & DPI',                  'DPI',           'shoe',      'shield',        'Calzature antinfortunistiche, guanti, mascherine.', 60),
  ('fibre',       'Fibre, panni & dischi',         'Fibre',         'pad',       'circle-dot',    'Microfibre, mop, dischi abrasivi e lucidanti.', 70),
  ('asciuga',     'Asciugamani ad aria calda',     'Asciugamani',   'dryer',     'wind',          'Lame d''aria, asciugatori automatici inox.', 80),
  ('disinfest',   'Insetticidi & disinfestazione', 'Disinfest.',    'spray',     'bug',           'Copyr, esche, sistemi anti-volatili.', 90),
  ('vetri',       'Pulizia vetri & fotovoltaico',  'Vetri & FV',    'glass',     'sparkles',      'Spazzole telescopiche, sistemi ad acqua pura.', 100),
  ('carta',       'Carta & igiene',                'Carta',         'paper',     'package',       'Lucart, Celtex — bobine, asciugamani, carta igienica.', 110)
on conflict (id) do nothing;

-- ============================================================
-- BRANDS
-- ============================================================
insert into brands (name, weight, italic, letter, sort_order) values
  ('KÄRCHER',    700, false, '-0.02em', 10),
  ('Comac',      400, true,  null,      20),
  ('Nilfisk',    600, false, '-0.01em', 30),
  ('Hako',       500, false, null,      40),
  ('Tennant',    600, false, '0.04em',  50),
  ('Ghibli',     500, true,  null,      60),
  ('Kiehl',      600, false, null,      70),
  ('Copyr',      400, false, null,      80),
  ('Lucart',     600, false, null,      90),
  ('Celtex',     500, true,  null,      100),
  ('Technosafe', 500, false, null,      110),
  ('IPC',        700, false, '0.02em',  120)
on conflict (name) do nothing;

-- ============================================================
-- PRODUCTS
-- ============================================================
insert into products (id, name, sku, brand, category_id, kind, price, stock, count, badge, specs, is_highlighted, is_featured, sort_order) values
  ('rx220', 'Innova 100 B · Uomo a bordo',                       'COM-IN100B',  'COMAC',      'lavasciuga', 'scrubber',  '€18.400', 'in',  4,   'Novità', '["Serbatoio 145 L","Autonomia 4 h","Piste 1000 mm","Batteria al gel"]'::jsonb, true,  true,  10),
  ('ts50',  'SC500 53B Walk-Behind',                             'NIL-SC500-53','NILFISK',    'lavasciuga', 'scrubber',  '€4.820',  'in',  8,   null,     '["Serbatoio 50 L","Autonomia 3 h","Piste 530 mm"]'::jsonb, false, true, 20),
  ('k250',  'K 250 Classic Cold-Water',                          'COMET-K250',  'COMET',      'idro',       'washer',    '€690',    'in',  18,  null,     '["Pressione 150 bar","Portata 600 L/h","Motore 2,5 kW"]'::jsonb, true,  true, 30),
  ('hd12',  'Tana Quick & Easy · Sgrassante alcalino',           'KH-TQE-10',   'KIEHL',      'detergenti', 'detergent', '€89',     'in',  120, null,     '["Tanica 10 L","pH 12,5","Concentrato 1:20"]'::jsonb, false, true, 40),
  ('sp9',   'Magic System Doppio Secchio',                       'TTS-MS-DB',   'TTS',        'carrelli',   'cart',      '€420',    'low', 3,   null,     '["Vasche 2× 25 L","Telaio inox","Strizzatore"]'::jsonb, false, false, 50),
  ('vac90', 'Power WD 90.2 Aspiraliquidi',                       'GH-WD90',     'GHIBLI',     'aspira',     'vacuum',    '€1.250',  'in',  6,   null,     '["Fusto 90 L","Potenza 2400 W","Doppio motore"]'::jsonb, true,  true, 60),
  ('tec10', 'Tech Run S3 SRC · Calzatura antinfortunistica',     'TS-RUN-S3',   'TECHNOSAFE', 'dpi',        'shoe',      '€68',     'in',  240, 'Promo −30%', '["Categoria S3","Suola SRC","Mesh traspirante"]'::jsonb, false, true, 70),
  ('bp17',  'Disco abrasivo nero 17″ Strip',                     '3M-BP17K',    '3M',         'fibre',      'pad',       '€38',     'in',  240, null,     '["Diametro 17″","Confezione 5 pz"]'::jsonb, false, false, 80),
  ('dyr',   'AirStar Inox lame d''aria',                         'SM-AS-INOX',  'STARMIX',    'asciuga',    'dryer',     '€340',    'in',  12,  null,     '["Tempo 12 s","1100 W","HEPA H13"]'::jsonb, false, false, 90),
  ('cipr',  'Cipertrin T · Insetticida concentrato',             'COP-CIP-1',   'COPYR',      'disinfest',  'spray',     '€32',     'in',  88,  null,     '["Tanica 1 L","Base solvente","Uso prof."]'::jsonb, false, false, 100),
  ('wfp',   'nLite Connect · Asta in carbonio 6 m',              'UNG-NL6',     'UNGER',      'vetri',      'glass',     '€480',    'in',  9,   null,     '["Lunghezza 6 m","Carbonio HiFlo","Acqua pura"]'::jsonb, false, false, 110),
  ('eltex', 'EcoNatural Mini Jumbo · Bancale',                   'LU-ECO-MJ',   'LUCART',     'carta',      'paper',     '€220',    'in',  36,  null,     '["Bancale 24 conf.","2 veli","Riciclato"]'::jsonb, false, false, 120)
on conflict (id) do nothing;

-- ============================================================
-- COURSES
-- ============================================================
insert into courses (id, title, level, duration, mode, next_date, price, description, kind, bg, sort_order) values
  ('safety',  'Sicurezza & DPI in cantiere',           'Base',       '8 ore · 1 giornata',  'Aula o on-site',  '18 giu 2026 · Busto Arsizio', '€180', 'Uso corretto dei DPI, valutazione rischi nei contesti di pulizia industriale, segnaletica HACCP.', 'safety', 'linear-gradient(135deg, #E8F2F5 0%, #C6DEE5 100%)', 10),
  ('machine', 'Lavasciuga uomo a bordo · uso pratico', 'Avanzato',   '16 ore · 2 giornate', 'Aula + officina', '02 lug 2026 · Showroom',     '€420', 'Configurazione, manutenzione ordinaria, ottimizzazione consumi, gestione batterie al gel e litio.', 'machine', 'linear-gradient(135deg, #F5F7F8 0%, #EBEFF1 100%)', 20),
  ('chem',    'Detergenti professionali & HACCP',      'Base',       '6 ore · 1 giornata',  'Aula',            '25 giu 2026 · Busto Arsizio', '€220', 'Dosaggi, schede di sicurezza, compatibilità chimica e protocolli HACCP per il settore alimentare e sanitario.', 'chemicals', 'linear-gradient(135deg, #E6FBEE 0%, #C8F5D8 100%)', 30),
  ('sales',   'Gare d''appalto & specifiche tecniche', 'Specialist', '12 ore · 2 giornate', 'Aula',            '10 set 2026 · Busto Arsizio', '€520', 'Come leggere un capitolato, dimensionare la flotta, redigere relazioni tecniche e dossier per gare pubbliche.', 'sales', 'linear-gradient(135deg, #FBE7C8 0%, #FBE2C0 100%)', 40)
on conflict (id) do nothing;

-- ============================================================
-- INDUSTRIES
-- ============================================================
insert into industries (id, label, icon, description, sort_order) values
  ('imprese',   'Imprese di pulizia',        'briefcase',    'Carrelli, detergenti e ricambi per appalti multi-sede.', 10),
  ('industria', 'Industria & manifattura',   'factory',      'Lavasciuga industriali, sgrassanti pesanti, aspirazioni.', 20),
  ('sanita',    'Sanità & RSA',              'cross',        'Disinfettanti PMC, sanificazione superfici, carrelli HACCP.', 30),
  ('gdo',       'GDO & retail',              'shopping-bag', 'Scope automatiche, lava-vetri, igiene servizi pubblici.', 40),
  ('logistica', 'Logistica & magazzini',     'truck',        'Spazzatrici uomo a bordo, scoraggia-piccione, container.', 50),
  ('horeca',    'Hotellerie & ristorazione', 'utensils',     'Detergenti HACCP, carta igienica, lavastoviglie professionali.', 60)
on conflict (id) do nothing;

-- ============================================================
-- VIDEOS
-- ============================================================
insert into videos (id, title, duration, spot, size, status) values
  ('tour-hq',     'Tour della sede',                  '03:24', 'Hero · Video Aziendale', '248 MB', 'live'),
  ('innova-demo', 'COMAC Innova 100 B · in azione',   '01:48', 'Macchine in evidenza',   '132 MB', 'live'),
  ('service-be',  'Officina autorizzata · backstage', '02:12', 'Settori serviti',        '164 MB', 'draft')
on conflict (id) do nothing;
