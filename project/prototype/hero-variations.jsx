/* Hero/homepage variations for the CleanVillage redesign.
   Each variation is a self-contained "fold" — top hero + first
   downstream section. Designed to be presented in design_canvas
   artboards at ~1440\u00d7900.                                              */

/* ============================================================
   VARIATION A — "Editorial Light"
   (the current prototype hero — premium B2B SaaS feel)
   ============================================================ */
function HeroVarA() {
  return (
    <div style={{width:1440, background:'var(--bg-surface)', position:'relative', overflow:'hidden'}}>
      <CVHeader page="landing" onNav={()=>{}}/>
      <div style={{position:'absolute', top:114, left:0, right:0, height:3, background:'var(--trust-bar)'}}/>
      <section style={{padding:'72px 64px 0', maxWidth:1280, margin:'0 auto'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.15fr 1fr', gap:64, alignItems:'center'}}>
          <div>
            <Eyebrow>Distributore B2B · Italia &amp; UE · dal 1985</Eyebrow>
            <h1 style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:74, lineHeight:0.98, letterSpacing:'-0.04em', color:'var(--fg-primary)', margin:'24px 0 26px', textWrap:'balance'}}>
              Macchinari e forniture per chi <em style={{fontStyle:'normal', color:'var(--color-teal-500)', fontWeight:300}}>pulisce di mestiere</em>.
            </h1>
            <p style={{fontSize:18, lineHeight:1.55, color:'var(--fg-secondary)', maxWidth:'52ch', margin:'0 0 36px'}}>
              Quarant'anni di forniture per imprese di pulizia, fabbriche e strutture in tutto il Nord Italia. Oltre <b style={{color:'var(--fg-primary)', fontWeight:600}}>500 codici a magazzino</b>, <b style={{color:'var(--fg-primary)', fontWeight:600}}>24 marchi</b>, preventivo entro 24 ore.
            </p>
            <div style={{display:'flex', gap:14, alignItems:'center'}}>
              <CVButton variant="cta" size="lg" iconRight={<CVIcon name="arrow-right" size={14}/>}>Richiedi un Preventivo</CVButton>
              <CVButton variant="secondary" size="lg" iconRight={<CVIcon name="chevron-right" size={14}/>}>Esplora il Catalogo</CVButton>
            </div>
            <div style={{marginTop:44, paddingTop:32, borderTop:'1px solid var(--border-subtle)', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:32}}>
              {[
                ['40','anni','Attività'],
                ['500','+','SKU stock'],
                ['24','h','Preventivo'],
                ['12k','m²','Showroom'],
              ].map(s => (
                <div key={s[2]}>
                  <div style={{display:'flex', alignItems:'baseline', gap:4}}>
                    <span style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:42, letterSpacing:'-0.04em', color:'var(--fg-primary)'}}>{s[0]}</span>
                    <span style={{fontFamily:'var(--font-display)', fontWeight:300, fontSize:18, color:'var(--fg-muted)'}}>{s[1]}</span>
                  </div>
                  <span style={{fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600}}>{s[2]}</span>
                </div>
              ))}
            </div>
          </div>
          <HeroAVisual/>
        </div>
      </section>
    </div>
  );
}

function HeroAVisual() {
  return (
    <div style={{aspectRatio:'4/5', borderRadius:'var(--radius-lg)', overflow:'hidden', background:'linear-gradient(160deg, #E8F2F5 0%, #C6DEE5 60%, #6FA1B0 100%)', border:'1px solid var(--border-subtle)', position:'relative'}}>
      <svg viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#0A4D68" strokeWidth="1.6">
        <g transform="translate(40, 130)">
          <rect x="20" y="80" width="280" height="140" rx="14" fill="#FFFFFF"/>
          <rect x="20" y="80" width="280" height="140" rx="14"/>
          <rect x="120" y="20" width="90" height="70" rx="10" fill="#0A4D68"/>
          <rect x="135" y="35" width="60" height="20" rx="3" fill="#062E40"/>
          <rect x="210" y="42" width="6" height="60" fill="#2C3E4A"/>
          <path d="M210 100 L260 110 L260 130 L210 120 Z" fill="#2C3E4A"/>
          <rect x="60" y="100" width="80" height="44" rx="4" fill="#C6DEE5"/>
          <rect x="60" y="100" width="80" height="44" rx="4"/>
          <rect x="68" y="108" width="64" height="6" rx="1" fill="#25D366" opacity="0.4"/>
          <rect x="68" y="120" width="40" height="6" rx="1" fill="#25D366" opacity="0.6"/>
          <rect x="160" y="100" width="62" height="44" rx="4" fill="#062E40"/>
          <circle cx="175" cy="115" r="3" fill="#25D366"/>
          <circle cx="190" cy="115" r="3" fill="#C97A0C"/>
          <rect x="170" y="125" width="42" height="10" rx="2" fill="#0A4D68"/>
          <circle cx="65" cy="240" r="28" fill="#0F2330"/>
          <circle cx="65" cy="240" r="14" fill="#2C3E4A"/>
          <circle cx="255" cy="240" r="28" fill="#0F2330"/>
          <circle cx="255" cy="240" r="14" fill="#2C3E4A"/>
          <rect x="10" y="200" width="300" height="14" rx="3" fill="#0A4D68"/>
          <rect x="14" y="214" width="292" height="18" rx="2" fill="#25D366" opacity="0.5"/>
          <rect x="20" y="200" width="280" height="3" fill="#25D366"/>
        </g>
      </svg>
      <div style={{position:'absolute', left:20, bottom:20, right:20, background:'rgba(255,255,255,0.96)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'14px 18px', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'var(--shadow-card)'}}>
        <div>
          <div style={{fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-mint-700)', fontWeight:600}}>Best seller 2026</div>
          <div style={{fontFamily:'var(--font-display)', fontWeight:400, fontSize:17, letterSpacing:'-0.025em', marginTop:3}}>COMAC Innova 100 B</div>
          <div style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)', marginTop:2}}>145 L · 1000 mm · 4 h</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:10, fontWeight:600, color:'var(--fg-muted)', letterSpacing:'0.08em', textTransform:'uppercase'}}>Da</div>
          <div style={{fontFamily:'var(--font-display)', fontWeight:300, fontSize:24, letterSpacing:'-0.03em'}}>€18.400</div>
        </div>
      </div>
    </div>
  );
}


/* ============================================================
   VARIATION B — "Dark Magazine"
   Full-bleed dark teal hero, big white headline, oversize specs,
   facility imagery taking centre stage.
   ============================================================ */
function HeroVarB() {
  return (
    <div style={{width:1440, background:'var(--color-teal-500)', color:'var(--color-white)', overflow:'hidden', position:'relative'}}>
      {/* Dark header */}
      <header style={{borderBottom:'1px solid var(--color-teal-700)'}}>
        <div style={{maxWidth:1280, margin:'0 auto', padding:'0 64px', height:78, display:'flex', alignItems:'center', gap:36}}>
          <CVLogo size="md" inverse/>
          <nav style={{display:'flex', gap:28, marginLeft:32}}>
            {['Catalogo','Marchi','Settori','Service','Azienda','Contatti'].map(l => (
              <span key={l} style={{fontSize:13, color:'var(--color-teal-100)', fontWeight:500}}>{l}</span>
            ))}
          </nav>
          <span style={{flex:1}}/>
          <span style={{fontFamily:'var(--font-mono)', fontSize:12, color:'var(--color-teal-100)', display:'inline-flex', alignItems:'center', gap:6}}><CVIcon name="phone" size={12}/> +39 0331 555 220</span>
          <CVButton variant="cta">Preventivo</CVButton>
        </div>
      </header>
      <div style={{height:3, background:'var(--trust-bar)'}}/>

      <section style={{padding:'88px 64px 96px', maxWidth:1280, margin:'0 auto', position:'relative'}}>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:72, alignItems:'center'}}>
          <div>
            <Eyebrow dark>Numero uno in Lombardia · dal 1985</Eyebrow>
            <h1 style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:104, lineHeight:0.92, letterSpacing:'-0.045em', color:'var(--color-white)', margin:'24px 0 26px', textWrap:'balance'}}>
              Puliamo l'<em style={{fontStyle:'italic', color:'var(--color-mint-300)', fontWeight:300}}>industria</em> italiana.
            </h1>
            <p style={{fontSize:18, lineHeight:1.55, color:'var(--color-teal-100)', maxWidth:'46ch', margin:'0 0 40px'}}>
              500+ codici sempre a magazzino. 24 marchi distribuiti. 12.000 m² di showroom, magazzino e officina autorizzata in un solo posto.
            </p>
            <div style={{display:'flex', gap:14, alignItems:'center'}}>
              <CVButton variant="cta" size="lg" iconRight={<CVIcon name="arrow-right" size={14}/>}>Richiedi un Preventivo</CVButton>
              <CVButton variant="inverse-ghost" size="lg" icon={<CVIcon name="play" size={14}/>}>Tour della sede &middot; 3 min</CVButton>
            </div>
          </div>

          {/* Facility scene */}
          <div style={{position:'relative', aspectRatio:'4/3', background:'#062E40', borderRadius:'var(--radius-lg)', overflow:'hidden', border:'1px solid var(--color-teal-700)'}}>
            <svg viewBox="0 0 600 450" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
              <rect width="600" height="450" fill="#062E40"/>
              <path d="M0 240 L120 160 L260 220 L380 150 L600 220 L600 450 L0 450 Z" fill="#0A4D68"/>
              <path d="M0 240 L120 160 L260 220 L380 150 L600 220 L600 280 L0 280 Z" fill="#083D54"/>
              {[0,1,2,3,4,5,6].map(i => (
                <g key={i}>
                  <rect x={60 + i*72} y="270" width="56" height="130" fill="#062E40"/>
                  <rect x={64 + i*72} y="280" width="48" height="28" fill="#25D366" opacity="0.16"/>
                  <rect x={64 + i*72} y="312" width="48" height="28" fill="#C6DEE5" opacity="0.18"/>
                  <rect x={64 + i*72} y="344" width="48" height="28" fill="#25D366" opacity="0.14"/>
                </g>
              ))}
              <g transform="translate(180, 340)">
                <rect x="0" y="14" width="60" height="40" rx="3" fill="#25D366"/>
                <rect x="14" y="0" width="34" height="18" rx="2" fill="#0F2330"/>
                <rect x="56" y="34" width="60" height="6" fill="#2C3E4A"/>
                <circle cx="12" cy="58" r="6" fill="#0F2330"/>
                <circle cx="48" cy="58" r="6" fill="#0F2330"/>
              </g>
            </svg>
            <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(6,46,64,0) 40%, rgba(6,46,64,0.6) 100%)'}}/>
            <div style={{position:'absolute', top:24, left:24, padding:'6px 10px', background:'rgba(255,255,255,0.92)', color:'var(--fg-primary)', borderRadius:'var(--radius-xs)', fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, letterSpacing:'0.06em'}}>HQ · BUSTO ARSIZIO (VA)</div>
            <div style={{position:'absolute', bottom:24, left:24, right:24}}>
              <div style={{fontFamily:'var(--font-display)', fontSize:24, fontWeight:300, letterSpacing:'-0.03em', color:'var(--color-white)', lineHeight:1.1}}>
                12.000 m² di magazzino, showroom e officina.
              </div>
            </div>
          </div>
        </div>

        {/* Oversize stat ribbon */}
        <div style={{marginTop:80, paddingTop:48, borderTop:'1px solid var(--color-teal-700)', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:48}}>
          {[
            ['1.400+', 'Imprese di pulizia servite'],
            ['€24M',   'Fatturato 2025'],
            ['97%',    'Ordini evasi entro 48h'],
            ['24/24',  'Trade desk + service'],
          ].map(s => (
            <div key={s[1]} style={{position:'relative'}}>
              <span style={{position:'absolute', left:-12, top:-4, width:3, height:34, background:'var(--color-mint-500)'}}/>
              <div style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:62, letterSpacing:'-0.04em', color:'var(--color-white)', lineHeight:1}}>{s[0]}</div>
              <div style={{fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-mint-300)', marginTop:10, fontWeight:600}}>{s[1]}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


/* ============================================================
   VARIATION C — "Trade-Catalog Dense"
   Small hero, immediate dive into product/category grid \u2014
   closer in spirit to the original cleanvillage.it.
   ============================================================ */
function HeroVarC() {
  const cats = window.CV_CATEGORIES.slice(0, 8);
  return (
    <div style={{width:1440, background:'var(--bg-page)', overflow:'hidden'}}>
      <CVHeader page="landing" onNav={()=>{}}/>
      <div style={{height:3, background:'var(--trust-bar)'}}/>

      <section style={{maxWidth:1280, margin:'0 auto', padding:'48px 64px 24px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:36, alignItems:'end', marginBottom:32}}>
          <div>
            <Eyebrow>Catalogo · 11 categorie · 571 SKU</Eyebrow>
            <h1 style={{fontFamily:'var(--font-display)', fontWeight:300, fontSize:54, letterSpacing:'-0.035em', margin:'12px 0 0', lineHeight:1.02, color:'var(--fg-primary)'}}>
              Sai cosa cerchi? Vai dritto al prodotto.
            </h1>
          </div>
          {/* big search */}
          <div style={{position:'relative'}}>
            <CVIcon name="search" size={18} style={{position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', color:'var(--fg-muted)'}}/>
            <input placeholder="Cerca SKU, marchio, applicazione (es. K\u00e4rcher, sgrassante, lavasciuga)\u2026"
              style={{width:'100%', boxSizing:'border-box', padding:'18px 18px 18px 50px', fontFamily:'var(--font-body)', fontSize:15, background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-md)', outline:'none', color:'var(--fg-primary)', boxShadow:'var(--shadow-card)'}}
              defaultValue=""/>
            <span style={{position:'absolute', right:8, top:8, padding:'10px 16px', background:'var(--color-mint-500)', color:'var(--color-white)', borderRadius:'var(--radius-sm)', fontSize:12, fontWeight:600, boxShadow:'var(--shadow-cta)'}}>Cerca</span>
          </div>
        </div>
        {/* quick chips */}
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:32}}>
          <span style={{fontSize:10, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600, marginRight:6, alignSelf:'center'}}>Ricerche frequenti</span>
          {['Lavasciuga uomo a bordo','Kärcher K5','Detergenti HACCP','Carta Lucart bancale','Carrelli TTS','Idropulitrici trifase'].map(t => (
            <span key={t} style={{padding:'7px 12px', background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:999, fontSize:12, fontWeight:500, color:'var(--fg-primary)'}}>{t}</span>
          ))}
        </div>
      </section>

      {/* Compact category grid — mirrors the original cleanvillage.it layout */}
      <section style={{maxWidth:1280, margin:'0 auto', padding:'0 64px 64px'}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14}}>
          {cats.map(c => <DenseCatTile key={c.id} cat={c}/>)}
        </div>
      </section>
    </div>
  );
}

function DenseCatTile({ cat }) {
  return (
    <div style={{background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflow:'hidden', position:'relative', aspectRatio:'4/3'}}>
      <div style={{width:'70%', position:'absolute', left:'50%', top:'42%', transform:'translate(-50%, -50%)'}}>
        <ProductIllustration kind={cat.kind} hover={false}/>
      </div>
      <div style={{position:'absolute', left:0, right:0, bottom:0, padding:'14px 16px', background:'rgba(15,35,48,0.85)', color:'var(--color-white)', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <span style={{fontFamily:'var(--font-body)', fontSize:13, fontWeight:600, color:'var(--color-white)', letterSpacing:'0.01em', textTransform:'uppercase'}}>{cat.short || cat.label}</span>
        <span style={{fontFamily:'var(--font-mono)', fontSize:10, color:'var(--color-mint-300)'}}>{cat.count}</span>
      </div>
    </div>
  );
}


/* ============================================================
   VARIATION D — "Showroom-first"
   Mockup centred on a giant facility/showroom photo with the
   value prop overlaid magazine-style.
   ============================================================ */
function HeroVarD() {
  return (
    <div style={{width:1440, background:'var(--bg-surface)', overflow:'hidden', position:'relative'}}>
      <CVHeader page="landing" onNav={()=>{}}/>
      <div style={{height:3, background:'var(--trust-bar)'}}/>

      <section style={{padding:'48px 64px 0'}}>
        <div style={{position:'relative', borderRadius:'var(--radius-lg)', overflow:'hidden', aspectRatio:'21/9', background:'linear-gradient(180deg, #6FA1B0 0%, #0A4D68 70%)'}}>
          {/* Big showroom scene */}
          <svg viewBox="0 0 1300 560" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="floorD" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#D5DBDE"/><stop offset="1" stopColor="#6B7882"/></linearGradient>
              <linearGradient id="wallD" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#E8F2F5"/><stop offset="1" stopColor="#8E9AA2"/></linearGradient>
            </defs>
            <rect x="0" y="0" width="1300" height="320" fill="url(#wallD)"/>
            <rect x="0" y="320" width="1300" height="240" fill="url(#floorD)"/>
            {/* Perspective grid on floor */}
            <g stroke="#FFFFFF" strokeWidth="0.6" opacity="0.4">
              {[0,1,2,3,4,5,6,7,8].map(i => (
                <line key={i} x1={130 + i*130} y1="320" x2={150 + i*180} y2="560"/>
              ))}
              {[0,1,2,3].map(i => (
                <line key={i} x1="0" y1={360 + i*60} x2="1300" y2={360 + i*60}/>
              ))}
            </g>
            {/* Showroom machines arranged */}
            <g transform="translate(80, 280)">
              <rect x="0" y="0" width="180" height="80" rx="6" fill="#FFFFFF" stroke="#0A4D68" strokeWidth="1.5"/>
              <rect x="20" y="-20" width="80" height="22" rx="4" fill="#0A4D68"/>
              <rect x="14" y="60" width="152" height="8" fill="#25D366"/>
              <circle cx="36" cy="86" r="14" fill="#0F2330"/>
              <circle cx="144" cy="86" r="14" fill="#0F2330"/>
            </g>
            <g transform="translate(340, 290)">
              <rect x="0" y="0" width="200" height="90" rx="6" fill="#EBEFF1" stroke="#0A4D68" strokeWidth="1.5"/>
              <rect x="20" y="-30" width="110" height="30" rx="4" fill="#0A4D68"/>
              <rect x="14" y="74" width="172" height="6" fill="#25D366"/>
              <circle cx="40" cy="100" r="16" fill="#0F2330"/>
              <circle cx="160" cy="100" r="16" fill="#0F2330"/>
            </g>
            <g transform="translate(620, 270)">
              <rect x="0" y="0" width="220" height="110" rx="6" fill="#FFFFFF" stroke="#0A4D68" strokeWidth="1.5"/>
              <rect x="20" y="-40" width="120" height="42" rx="4" fill="#0A4D68"/>
              <rect x="14" y="90" width="192" height="8" fill="#25D366"/>
              <circle cx="44" cy="118" r="18" fill="#0F2330"/>
              <circle cx="176" cy="118" r="18" fill="#0F2330"/>
              <rect x="50" y="20" width="120" height="36" rx="3" fill="#C6DEE5"/>
            </g>
            <g transform="translate(920, 300)">
              <rect x="0" y="0" width="160" height="80" rx="6" fill="#EBEFF1" stroke="#0A4D68" strokeWidth="1.5"/>
              <rect x="20" y="-20" width="70" height="22" rx="4" fill="#0A4D68"/>
              <circle cx="32" cy="86" r="12" fill="#0F2330"/>
              <circle cx="128" cy="86" r="12" fill="#0F2330"/>
            </g>
            {/* Ceiling lights */}
            {[180, 460, 740, 1020].map(x => (
              <g key={x}>
                <rect x={x-30} y="10" width="60" height="6" fill="#C8F5D8" opacity="0.7"/>
                <path d={`M${x-50} 16 L${x+50} 16 L${x+90} 90 L${x-90} 90 Z`} fill="#C8F5D8" opacity="0.06"/>
              </g>
            ))}
            {/* Brand banner */}
            <rect x="100" y="30" width="280" height="64" rx="4" fill="rgba(255,255,255,0.6)"/>
            <text x="240" y="70" textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="32" fill="#0A4D68" letterSpacing="-0.02em">COMAC</text>
            <rect x="500" y="30" width="280" height="64" rx="4" fill="rgba(255,255,255,0.6)"/>
            <text x="640" y="70" textAnchor="middle" fontFamily="Outfit" fontWeight="600" fontSize="28" fill="#0A4D68">Nilfisk</text>
            <rect x="900" y="30" width="280" height="64" rx="4" fill="rgba(255,255,255,0.6)"/>
            <text x="1040" y="70" textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="28" fill="#0A4D68" letterSpacing="0.04em">TENNANT</text>
          </svg>

          {/* Dark gradient bottom for text legibility */}
          <div style={{position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(15,35,48,0) 30%, rgba(15,35,48,0.7) 100%)'}}/>

          {/* Overlaid text bottom-left */}
          <div style={{position:'absolute', left:48, bottom:48, right:48, color:'var(--color-white)', display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:36, alignItems:'end'}}>
            <div>
              <Eyebrow dark>40 anni · 12.000 m² · 24 marchi</Eyebrow>
              <h1 style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:88, lineHeight:0.94, letterSpacing:'-0.04em', color:'var(--color-white)', margin:'18px 0 0', textWrap:'balance', maxWidth:'14ch'}}>
                Lo showroom della pulizia industriale.
              </h1>
            </div>
            <div style={{textAlign:'right'}}>
              <p style={{fontSize:16, lineHeight:1.55, color:'rgba(255,255,255,0.85)', maxWidth:'40ch', margin:'0 0 24px', marginLeft:'auto'}}>
                Tutti i macchinari delle migliori case madri, sempre in prova, sempre disponibili. Visita la sede di Busto Arsizio o ricevi il preventivo entro 24 ore.
              </p>
              <div style={{display:'flex', gap:12, justifyContent:'flex-end'}}>
                <CVButton variant="cta" size="lg" iconRight={<CVIcon name="arrow-right" size={14}/>}>Richiedi Preventivo</CVButton>
                <CVButton variant="inverse-ghost" size="lg" icon={<CVIcon name="calendar" size={14}/>}>Prenota una visita</CVButton>
              </div>
            </div>
          </div>

          {/* Top right floating tag */}
          <div style={{position:'absolute', top:36, right:36, background:'var(--color-mint-500)', color:'var(--color-white)', padding:'10px 16px', borderRadius:999, fontSize:12, fontWeight:600, boxShadow:'var(--shadow-cta)', display:'inline-flex', alignItems:'center', gap:8}}>
            <span style={{width:8, height:8, borderRadius:'50%', background:'var(--color-white)', boxShadow:'0 0 0 4px rgba(255,255,255,0.35)'}}/>
            Showroom aperto · oggi 08:30–18:00
          </div>
        </div>

        {/* Mini quick-actions bar below */}
        <div style={{marginTop:24, marginBottom:48, display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14}}>
          {[
            { i:'package',  t:'500+ codici a stock',    s:'Spedizione entro 48h' },
            { i:'wrench',   t:'Officina autorizzata',   s:'Service in giornata'  },
            { i:'truck',    t:'Consegne in UE',         s:'5–7 giorni lavorativi'},
            { i:'shield-check', t:'Buyer trade verificati', s:'Sconti scaglione'  },
          ].map(b => (
            <div key={b.t} style={{display:'flex', alignItems:'center', gap:14, padding:'18px 22px', background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)'}}>
              <span style={{width:42, height:42, display:'grid', placeItems:'center', background:'var(--color-teal-50)', color:'var(--color-teal-500)', borderRadius:'var(--radius-sm)'}}>
                <CVIcon name={b.i} size={20}/>
              </span>
              <div>
                <div style={{fontFamily:'var(--font-display)', fontWeight:500, fontSize:15, color:'var(--fg-primary)', letterSpacing:'-0.015em'}}>{b.t}</div>
                <div style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)', marginTop:2}}>{b.s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { HeroVarA, HeroVarB, HeroVarC, HeroVarD });
