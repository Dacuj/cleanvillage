/* CleanVillage redesign — shared components (Italian).
   All components attach to window for cross-file composition.        */

const { useState, useEffect, useRef, useMemo } = React;

/* ============================================================
   LOGO — matches the "Cleanvillage" wordmark from the live site,
   but cleaned up: tight kerning, integrated checkmark sweep.
   ============================================================ */
function CVLogo({ size = 'md', inverse = false }) {
  const h = size === 'sm' ? 22 : size === 'lg' ? 36 : 28;
  const fg = inverse ? 'var(--color-white)' : 'var(--color-teal-500)';
  const fg2 = inverse ? 'var(--color-mint-300)' : 'var(--color-teal-300)';
  return (
    <div style={{display:'inline-flex', alignItems:'center', gap: h * 0.25, lineHeight: 1}}>
      <svg width={h * 1.1} height={h} viewBox="0 0 44 40" fill="none" aria-hidden>
        <path d="M8 22 C 8 12, 16 6, 26 8 C 34 9.5, 38 14, 38 14" stroke={fg} strokeWidth="2.4" strokeLinecap="round"/>
        <path d="M14 26 L20 32 L36 14" stroke={fg2} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{fontFamily:'var(--font-display)', fontWeight: 300, fontSize: h * 0.86, letterSpacing:'-0.035em', color: fg}}>
        Clean<span style={{fontWeight: 500, color: fg2}}>village</span>
      </span>
    </div>
  );
}

/* ============================================================ */
function CVButton({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, type = 'button', as = 'button', href, full }) {
  const [hover, setHover] = useState(false);
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: variant === 'ghost' || variant === 'inverse-ghost' ? 500 : 600,
    fontSize: size === 'sm' ? 12 : size === 'lg' ? 14 : 13,
    padding: size === 'sm' ? '8px 14px' : size === 'lg' ? '14px 22px' : '11px 18px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    cursor: 'pointer',
    transition: 'background var(--motion-fast), border-color var(--motion-fast), box-shadow var(--motion-fast), transform var(--motion-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  };
  const variants = {
    cta: { background: hover ? 'var(--color-mint-600)' : 'var(--color-mint-500)', color: 'var(--color-white)', borderColor: hover ? 'var(--color-mint-600)' : 'var(--color-mint-500)', boxShadow: 'var(--shadow-cta)' },
    primary: { background: hover ? 'var(--color-teal-700)' : 'var(--color-teal-500)', color: 'var(--color-white)', borderColor: hover ? 'var(--color-teal-700)' : 'var(--color-teal-500)' },
    secondary: { background: 'var(--bg-surface)', color: 'var(--color-teal-500)', borderColor: hover ? 'var(--color-teal-500)' : 'var(--border-strong)' },
    'inverse-secondary': { background: 'transparent', color: 'var(--color-white)', borderColor: hover ? 'var(--color-white)' : 'rgba(255,255,255,0.4)' },
    ghost: { background: 'transparent', color: hover ? 'var(--color-teal-700)' : 'var(--color-teal-500)', borderColor: 'transparent', padding: size === 'sm' ? '4px 4px' : '6px 4px' },
    'inverse-ghost': { background: hover ? 'rgba(255,255,255,0.08)' : 'transparent', color: 'var(--color-white)', borderColor: 'transparent' },
  };
  const Tag = as === 'a' ? 'a' : 'button';
  return (
    <Tag type={type} href={href} onClick={onClick}
         onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
         style={{...base, ...variants[variant]}}>
      {icon}{children}{iconRight}
    </Tag>
  );
}

/* ============================================================ */
function CVIcon({ name, size = 18, color, strokeWidth = 1.75, style }) {
  const ref = useRef();
  useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({ attrs: { width: size, height: size, 'stroke-width': strokeWidth }, nameAttr: 'data-lucide' });
    }
  }, [name, size, strokeWidth]);
  return <span ref={ref} style={{display:'inline-flex', color: color || 'currentColor', ...style}} aria-hidden="true"/>;
}

/* ============================================================ */
function TrustBar({ height = 3 }) {
  return <div style={{height, background: 'var(--trust-bar)'}} />;
}

function Eyebrow({ children, color, dark }) {
  return <div style={{fontFamily:'var(--font-body)', fontSize:11, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color: color || (dark ? 'var(--color-mint-300)' : 'var(--color-mint-700)'), display:'inline-flex', alignItems:'center', gap:8}}>
    <span style={{width:14, height:1, background:'currentColor', opacity:0.7}}/>
    {children}
  </div>;
}

function Spec({ children, dark }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
      padding: '3px 7px',
      background: dark ? 'rgba(255,255,255,0.08)' : 'var(--bg-surface-alt)',
      border: dark ? '1px solid rgba(255,255,255,0.15)' : 'none',
      borderRadius: 'var(--radius-xs)',
      color: dark ? 'var(--color-white)' : 'var(--fg-primary)',
    }}>{children}</span>
  );
}

function StockPill({ status = 'in', count }) {
  const map = {
    in:   { bg:'var(--color-mint-50)',    fg:'var(--color-mint-800)',    dot:'var(--color-mint-500)',    label: count != null ? `Disponibile · ${count}` : 'Disponibile' },
    low:  { bg:'var(--color-warning-100)', fg:'var(--color-warning-500)', dot:'var(--color-warning-500)', label: count != null ? `Ultimi ${count} pz` : 'Scorte limitate' },
    out:  { bg:'var(--color-danger-100)',  fg:'var(--color-danger-500)',  dot:'var(--color-danger-500)',  label: 'Su ordinazione' },
  };
  const c = map[status];
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:6, fontFamily:'var(--font-body)', fontWeight:600, fontSize:11, padding:'3px 9px', borderRadius:999, background:c.bg, color:c.fg, whiteSpace:'nowrap'}}>
      <span style={{width:6, height:6, borderRadius:'50%', background:c.dot}}/>
      {c.label}
    </span>
  );
}

/* ============================================================
   HEADER — sticky, white, with mega-categorie pop-down
   ============================================================ */
function CVHeader({ page, onNav, tweaks }) {
  const [open, setOpen] = useState(null); // 'cat' | 'brand' | null
  const NAV = [
    { id: 'cat',     label: 'Categorie',  has: true },
    { id: 'brand',   label: 'Marchi',     has: true },
    { id: 'contact', label: 'Contatti' },
    { id: 'video',   label: 'Video Aziendale' },
    { id: 'about',   label: 'Azienda' },
  ];
  return (
    <header style={{position:'sticky', top:0, zIndex:30, background:'rgba(255,255,255,0.92)', borderBottom:'1px solid var(--border-subtle)', backdropFilter:'blur(10px)'}}>
      {/* utility strip */}
      <div style={{borderBottom:'1px solid var(--border-subtle)', background:'var(--color-ice-50)'}}>
        <div style={{maxWidth:'var(--max-content)', margin:'0 auto', padding:'7px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:11, color:'var(--fg-muted)', fontFamily:'var(--font-mono)', letterSpacing:'0.02em'}}>
          <span style={{display:'inline-flex', alignItems:'center', gap:18}}>
            <span style={{display:'inline-flex', alignItems:'center', gap:6}}><CVIcon name="phone" size={11}/> +39 0331 555 220</span>
            <span style={{display:'inline-flex', alignItems:'center', gap:6}}><CVIcon name="mail" size={11}/> trade@cleanvillage.it</span>
            <span style={{display:'inline-flex', alignItems:'center', gap:6}}><CVIcon name="clock" size={11}/> Lun–Ven · 08:30–18:00</span>
          </span>
          <span style={{display:'inline-flex', alignItems:'center', gap:18}}>
            <a href="#" onClick={e=>e.preventDefault()} style={{color:'var(--fg-muted)', textDecoration:'none'}}>Condizioni di vendita</a>
            <a href="#" onClick={e=>e.preventDefault()} style={{color:'var(--fg-muted)', textDecoration:'none'}}>Condizioni di garanzia</a>
            <a href="Admin Dashboard.html" target="_blank" style={{color:'var(--color-teal-500)', textDecoration:'none', fontWeight:600, display:'inline-flex', alignItems:'center', gap:5}}><CVIcon name="lock" size={11}/> Area trade desk</a>
            <span style={{display:'inline-flex', alignItems:'center', gap:4}}><CVIcon name="globe" size={11}/> IT</span>
          </span>
        </div>
      </div>

      {/* main bar */}
      <div style={{maxWidth:'var(--max-content)', margin:'0 auto', padding:'0 32px', height:72, display:'flex', alignItems:'center', gap:32}}>
        <a href="#" onClick={(e)=>{e.preventDefault(); onNav('landing');}} style={{textDecoration:'none'}}><CVLogo size="md"/></a>

        <nav style={{display:'flex', gap:4, alignItems:'center', height:'100%', position:'relative'}}
             onMouseLeave={() => setOpen(null)}>
          {NAV.map(n => (
            <button key={n.id}
              onMouseEnter={() => n.has ? setOpen(n.id) : setOpen(null)}
              onClick={() => { if (!n.has) onNav(n.id === 'contact' ? 'contact' : 'landing'); }}
              style={{
                background:'transparent', border:'none', cursor:'pointer',
                padding:'0 14px', height:'100%',
                fontFamily:'var(--font-body)', fontSize:13, fontWeight:500,
                color: (open === n.id) ? 'var(--color-teal-500)' : 'var(--fg-primary)',
                display:'inline-flex', alignItems:'center', gap:5,
              }}>
              {n.label}
              {n.has && <CVIcon name="chevron-down" size={12}/>}
            </button>
          ))}
          {open === 'cat'   && <MegaCategories onNav={onNav} onClose={() => setOpen(null)}/>}
          {open === 'brand' && <MegaBrands onClose={() => setOpen(null)}/>}
        </nav>

        <span style={{flex:1}}/>

        <div style={{position:'relative', width: 260}}>
          <CVIcon name="search" size={14} style={{position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--fg-muted)'}}/>
          <input placeholder="Cerca prodotti, codici, marchi…"
            style={{width:'100%', boxSizing:'border-box', padding:'9px 12px 9px 34px', fontFamily:'var(--font-body)', fontSize:13, background:'var(--color-ice-50)', border:'1px solid transparent', borderRadius:'var(--radius-sm)', outline:'none', color:'var(--fg-primary)'}}/>
        </div>

        <button aria-label="Account" style={{width:36, height:36, background:'transparent', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', cursor:'pointer', display:'grid', placeItems:'center', color:'var(--fg-secondary)'}}>
          <CVIcon name="user" size={16}/>
        </button>
        <CVButton variant="cta" onClick={() => onNav('contact')} iconRight={<CVIcon name="arrow-right" size={13}/>}>Richiedi Preventivo</CVButton>
      </div>
    </header>
  );
}

function MegaCategories({ onNav, onClose }) {
  const cats = window.CV_CATEGORIES;
  return (
    <div onMouseLeave={onClose}
      style={{position:'absolute', top:'100%', left:-32, right:-32, marginTop:0, background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderTop:'none', boxShadow:'var(--shadow-pop)', padding:'28px 32px 24px', zIndex:20}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:18}}>
        <Eyebrow>Tutte le categorie · 11</Eyebrow>
        <a href="#" onClick={e=>{e.preventDefault(); onNav('catalog'); onClose();}} style={{fontSize:12, color:'var(--color-teal-500)', fontWeight:600, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4}}>
          Esplora tutto il catalogo <CVIcon name="arrow-right" size={12}/>
        </a>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'4px 24px'}}>
        {cats.map(c => (
          <a key={c.id} href="#" onClick={(e)=>{e.preventDefault(); onNav('catalog'); onClose();}}
            style={{display:'flex', alignItems:'center', gap:10, padding:'9px 8px', textDecoration:'none', color:'var(--fg-primary)', borderRadius:'var(--radius-xs)'}}>
            <span style={{width:28, height:28, display:'grid', placeItems:'center', background:'var(--color-ice-50)', color:'var(--color-teal-500)', borderRadius:'var(--radius-xs)', flexShrink:0}}>
              <CVIcon name={c.icon} size={14}/>
            </span>
            <span style={{display:'flex', flexDirection:'column', lineHeight:1.2, flex:1, minWidth:0}}>
              <span style={{fontSize:13, fontWeight:500, color:'var(--fg-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.label}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize:10, color:'var(--fg-muted)', marginTop:2}}>{c.count} SKU</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function MegaBrands({ onClose }) {
  const brands = window.CV_BRANDS;
  return (
    <div onMouseLeave={onClose}
      style={{position:'absolute', top:'100%', left:-32, right:-32, background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderTop:'none', boxShadow:'var(--shadow-pop)', padding:'28px 32px 26px', zIndex:20}}>
      <Eyebrow>Marchi distribuiti · 24</Eyebrow>
      <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:'12px', marginTop:14}}>
        {brands.map(b => (
          <a key={b.name} href="#" onClick={e=>e.preventDefault()}
             style={{display:'grid', placeItems:'center', height:60, border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-xs)', textDecoration:'none', background:'var(--bg-surface)'}}>
            <span style={{fontFamily:'var(--font-display)', fontWeight: b.weight || 500, fontSize:14, color:'var(--fg-primary)', letterSpacing: b.letter || '0', fontStyle: b.italic ? 'italic' : 'normal'}}>{b.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

/* Inline social SVGs — lucide doesn't ship all brand marks reliably */
const SOCIAL_SVGS = {
  linkedin:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  facebook:  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  youtube:   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 6.4a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.56.42A2.78 2.78 0 0 0 1.5 6.4 29 29 0 0 0 1 12a29 29 0 0 0 .5 5.6 2.78 2.78 0 0 0 1.94 1.97C5.12 20 12 20 12 20s6.88 0 8.56-.42A2.78 2.78 0 0 0 22.5 17.6 29 29 0 0 0 23 12a29 29 0 0 0-.5-5.6z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor"/></svg>',
  instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
};

/* ============================================================
   FOOTER
   ============================================================ */
function CVFooter() {
  const Col = ({ title, children }) => (
    <div>
      <div style={{fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--color-mint-300)', marginBottom:18}}>{title}</div>
      <div style={{display:'flex', flexDirection:'column', gap:9}}>{children}</div>
    </div>
  );
  const Lk = ({ children }) => (
    <a href="#" onClick={(e)=>e.preventDefault()} style={{fontSize:13, color:'var(--color-teal-100)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6}}>{children}</a>
  );
  return (
    <footer style={{background:'var(--color-teal-500)', color:'var(--color-white)', marginTop:'auto', position:'relative'}}>
      <TrustBar height={3}/>
      <div style={{maxWidth:'var(--max-content)', margin:'0 auto', padding:'80px 32px 36px'}}>
        <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr', gap:40}}>
          <div>
            <CVLogo inverse size="lg"/>
            <p style={{marginTop:18, fontSize:14, color:'var(--color-teal-100)', maxWidth:'34ch', lineHeight:1.6, fontWeight:400}}>
              Macchinari per la pulizia industriale e forniture all'ingrosso. Al servizio di imprese e contractor in tutto il Nord Italia dal 1985.
            </p>
            <div style={{display:'flex', gap:10, marginTop:22}}>
              {['linkedin','facebook','youtube','instagram'].map(s => (
                <a key={s} href="#" onClick={e=>e.preventDefault()} aria-label={s} style={{width:34, height:34, display:'inline-grid', placeItems:'center', borderRadius:'var(--radius-xs)', background:'rgba(255,255,255,0.06)', color:'var(--color-teal-100)', textDecoration:'none'}}>
                  <span dangerouslySetInnerHTML={{__html: SOCIAL_SVGS[s]}}/>
                </a>
              ))}
            </div>
          </div>
          <Col title="Categorie">
            <Lk>Lavasciuga</Lk>
            <Lk>Idropulitrici</Lk>
            <Lk>Detergenti</Lk>
            <Lk>Carrelli</Lk>
            <Lk>Carta &amp; igiene</Lk>
            <Lk>Catalogo completo &rarr;</Lk>
          </Col>
          <Col title="Servizi">
            <Lk>Preventivi</Lk>
            <Lk>Showroom</Lk>
            <Lk>Assistenza</Lk>
            <Lk>Noleggio</Lk>
            <Lk>Formazione</Lk>
          </Col>
          <Col title="Trade desk">
            <Lk><CVIcon name="phone" size={12}/> +39 0331 555 220</Lk>
            <Lk><CVIcon name="mail" size={12}/> trade@cleanvillage.it</Lk>
            <Lk><CVIcon name="clock" size={12}/> Lun–Ven · 08:30–18:00</Lk>
            <Lk><CVIcon name="truck" size={12}/> Spedizioni in tutta UE</Lk>
          </Col>
          <Col title="Sede operativa">
            <Lk>Via dell'Industria 24</Lk>
            <Lk>21052 Busto Arsizio (VA)</Lk>
            <Lk>Italia</Lk>
            <Lk><CVIcon name="map-pin" size={12}/> Indicazioni stradali</Lk>
          </Col>
        </div>
        <div style={{marginTop:52, paddingTop:24, borderTop:'1px solid var(--color-teal-700)', display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'var(--font-mono)', fontSize:11, color:'var(--color-teal-100)', opacity:0.8, flexWrap:'wrap', gap:12}}>
          <span>© 2026 CleanVillage Srl · P.IVA 01234567891 · REA VA-345678 · Cap. soc. €100.000 i.v.</span>
          <span style={{display:'inline-flex', gap:18}}>
            <a href="#" onClick={e=>e.preventDefault()} style={{color:'inherit', textDecoration:'none'}}>Privacy</a>
            <a href="#" onClick={e=>e.preventDefault()} style={{color:'inherit', textDecoration:'none'}}>Cookie</a>
            <a href="#" onClick={e=>e.preventDefault()} style={{color:'inherit', textDecoration:'none'}}>Termini</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   FIELDS / INPUTS
   ============================================================ */
const inputStyle = {
  fontFamily: 'var(--font-body)', fontSize: 14,
  padding: '11px 14px',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--fg-primary)',
  outline: 'none', width: '100%', boxSizing: 'border-box',
  transition: 'border-color var(--motion-fast), box-shadow var(--motion-fast)',
};
function Field({ label, hint, error, children, span = 1, required }) {
  return (
    <label style={{display:'flex', flexDirection:'column', gap:6, gridColumn:`span ${span}`}}>
      <span style={{fontSize:11, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color: error ? 'var(--color-danger-500)' : 'var(--fg-muted)'}}>{label}{required && <span style={{color:'var(--color-teal-500)', marginLeft:3}}>*</span>}</span>
      {children}
      {error && <span style={{fontSize:11, color:'var(--color-danger-500)'}}>{error}</span>}
      {!error && hint && <span style={{fontSize:11, color:'var(--fg-muted)'}}>{hint}</span>}
    </label>
  );
}
function TextInput(p) { return <input {...p} style={{...inputStyle, ...(p.style||{})}}/>; }
function Textarea(p) { return <textarea rows={4} {...p} style={{...inputStyle, resize:'vertical', ...(p.style||{})}}/>; }
function Select(p) { return <select {...p} style={{...inputStyle, ...(p.style||{})}}>{p.children}</select>; }

function Check({ label, checked = false, onChange }) {
  const [c, setC] = useState(checked);
  const v = onChange ? checked : c;
  const set = onChange || setC;
  return (
    <label style={{display:'flex', alignItems:'center', gap:10, fontSize:13, color:'var(--fg-primary)', cursor:'pointer', padding:'5px 0'}}>
      <span style={{
        width:16, height:16, borderRadius:3,
        border: `1.5px solid ${v ? 'var(--color-teal-500)' : 'var(--border-strong)'}`,
        background: v ? 'var(--color-teal-500)' : 'var(--bg-surface)',
        display:'grid', placeItems:'center', color:'var(--color-white)', fontSize:11,
        transition: 'all var(--motion-fast)', flexShrink:0,
      }}>{v && '✓'}</span>
      <input type="checkbox" checked={v} onChange={() => set(!v)} style={{display:'none'}}/>
      {label}
    </label>
  );
}

/* ============================================================
   PRODUCT CARD (photo-led, matching current site vocabulary
   but cleaned up: hairline border, mint stock pill, mono SKU)
   ============================================================ */
function ProductCard({ product, onClick, dense = false }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={(e)=>{e.preventDefault(); onClick && onClick();}}
       onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
       style={{textDecoration:'none', color:'inherit', display:'flex', flexDirection:'column'}}>
      <div style={{
        background:'var(--bg-surface)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
        borderRadius:'var(--radius-md)',
        overflow:'hidden',
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-fast)',
        display:'flex', flexDirection:'column', height:'100%',
      }}>
        <div style={{aspectRatio: dense ? '4/3' : '5/4', position:'relative', background:'#FFFFFF', display:'grid', placeItems:'center', overflow:'hidden'}}>
          <ProductIllustration kind={product.kind} hover={hover}/>
          <div style={{position:'absolute', top:12, left:12}}>
            <StockPill status={product.stock} count={product.count}/>
          </div>
          {product.badge && (
            <div style={{position:'absolute', top:12, right:12, fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600, letterSpacing:'0.06em', color:'var(--color-teal-800)', background:'var(--color-mint-100)', padding:'3px 8px', borderRadius:'var(--radius-xs)', textTransform:'uppercase'}}>
              {product.badge}
            </div>
          )}
        </div>
        <div style={{padding: dense ? '14px 16px 16px' : '18px 20px 20px', display:'flex', flexDirection:'column', gap:6, flex:1, borderTop:'1px solid var(--border-subtle)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
            <span style={{fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600}}>{product.brand}</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize:10, color:'var(--fg-muted)'}}>{product.sku}</span>
          </div>
          <span style={{fontFamily:'var(--font-display)', fontWeight:400, fontSize: dense ? 16 : 17, letterSpacing:'-0.02em', color:'var(--fg-primary)', lineHeight:1.22}}>{product.name}</span>
          <div style={{display:'flex', gap:6, flexWrap:'wrap', margin:'4px 0 10px'}}>
            {product.specs.slice(0, dense ? 2 : 3).map((s,i) => <Spec key={i}>{s}</Spec>)}
          </div>
          <div style={{display:'flex', alignItems:'end', justifyContent:'space-between', gap:8, marginTop:'auto'}}>
            <div>
              <div style={{fontSize:10, fontWeight:500, color:'var(--fg-muted)', textTransform:'uppercase', letterSpacing:'0.08em'}}>{product.priceLabel || 'Da'}</div>
              <div style={{fontFamily:'var(--font-display)', fontWeight:300, fontSize:22, color:'var(--fg-primary)', letterSpacing:'-0.03em', lineHeight:1, marginTop:2}}>{product.price}</div>
            </div>
            <span style={{fontFamily:'var(--font-body)', fontWeight:600, fontSize:12, color:'var(--color-mint-700)', display:'inline-flex', alignItems:'center', gap:4}}>
              Preventivo <CVIcon name="arrow-right" size={12}/>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* SVG product illustrations — silhouette style, monochrome */
function ProductIllustration({ kind, hover }) {
  const wrap = {width:'68%', transition:'transform var(--motion-base)', transform: hover ? 'scale(1.04)' : 'scale(1)'};
  const stroke = '#2C3E4A';
  switch (kind) {
    case 'scrubber': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="28" y="40" width="120" height="58" rx="6" fill="#EBEFF1"/>
        <rect x="44" y="22" width="64" height="22" rx="3" fill="#FFFFFF"/>
        <path d="M44 22 L36 40 M108 22 L116 40"/>
        <circle cx="62" cy="108" r="14" fill="#2C3E4A"/>
        <circle cx="62" cy="108" r="6" fill="#FFFFFF"/>
        <circle cx="134" cy="108" r="14" fill="#2C3E4A"/>
        <circle cx="134" cy="108" r="6" fill="#FFFFFF"/>
        <rect x="148" y="60" width="36" height="22" rx="3" fill="#D5DBDE"/>
        <rect x="32" y="86" width="112" height="6" rx="2" fill="#0A4D68"/>
        <circle cx="70" cy="32" r="2" fill="#25D366"/>
      </svg>
    );
    case 'washer': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="44" y="48" width="80" height="68" rx="4" fill="#EBEFF1"/>
        <rect x="56" y="60" width="56" height="22" rx="2" fill="#FFFFFF"/>
        <circle cx="84" cy="72" r="6" fill="#D5DBDE"/>
        <rect x="56" y="92" width="56" height="6" rx="2" fill="#0A4D68"/>
        <rect x="124" y="38" width="28" height="22" rx="3" fill="#D5DBDE"/>
        <path d="M152 49 Q172 49 172 78 Q172 100 158 100" strokeWidth="1.8"/>
        <circle cx="64" cy="120" r="5" fill="#2C3E4A"/>
        <circle cx="104" cy="120" r="5" fill="#2C3E4A"/>
        <rect x="76" y="38" width="16" height="4" fill="#25D366"/>
      </svg>
    );
    case 'detergent': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="68" y="32" width="64" height="92" rx="6" fill="#EBEFF1"/>
        <rect x="82" y="22" width="36" height="14" rx="3" fill="#D5DBDE"/>
        <rect x="76" y="56" width="48" height="32" rx="2" fill="#FFFFFF"/>
        <path d="M82 66h36 M82 74h28 M82 82h32" strokeWidth="0.8"/>
        <rect x="84" y="100" width="32" height="2" fill="#0A4D68"/>
      </svg>
    );
    case 'cart': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <path d="M40 36 L40 112 L160 112"/>
        <rect x="56" y="44" width="40" height="44" rx="3" fill="#EBEFF1"/>
        <rect x="104" y="56" width="48" height="32" rx="3" fill="#FFFFFF"/>
        <circle cx="64" cy="124" r="6" fill="#2C3E4A"/>
        <circle cx="150" cy="124" r="6" fill="#2C3E4A"/>
        <rect x="116" y="40" width="30" height="14" rx="2" fill="#25D366" opacity="0.4"/>
      </svg>
    );
    case 'vacuum': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="60" y="44" width="80" height="68" rx="6" fill="#EBEFF1"/>
        <circle cx="100" cy="60" r="14" fill="#25D366" opacity="0.4"/>
        <rect x="68" y="80" width="64" height="22" rx="3" fill="#FFFFFF"/>
        <circle cx="76" cy="118" r="6" fill="#2C3E4A"/>
        <circle cx="124" cy="118" r="6" fill="#2C3E4A"/>
        <path d="M140 60 Q170 60 170 90 Q170 110 156 110" strokeWidth="1.6"/>
      </svg>
    );
    case 'shoe': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <path d="M30 92 Q40 56 76 60 L100 64 L120 56 L160 70 Q180 80 178 96 L178 104 L36 104 Z" fill="#EBEFF1"/>
        <path d="M70 78 L90 70 M104 76 L122 68 M138 80 L156 78" stroke="#0A4D68"/>
        <path d="M30 104 L178 104 L172 114 L36 114 Z" fill="#2C3E4A"/>
      </svg>
    );
    case 'pad': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <ellipse cx="100" cy="70" rx="58" ry="20" fill="#EBEFF1"/>
        <ellipse cx="100" cy="70" rx="58" ry="20"/>
        <ellipse cx="100" cy="70" rx="40" ry="14" fill="#FFFFFF"/>
        <circle cx="100" cy="70" r="6" fill="#D5DBDE"/>
      </svg>
    );
    case 'dryer': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="64" y="22" width="72" height="100" rx="8" fill="#EBEFF1"/>
        <rect x="76" y="32" width="48" height="40" rx="4" fill="#FFFFFF"/>
        <path d="M80 88 L120 88 M80 94 L116 94 M80 100 L112 100" strokeWidth="0.8"/>
        <circle cx="100" cy="50" r="4" fill="#25D366"/>
      </svg>
    );
    case 'paper': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <circle cx="62" cy="72" r="34" fill="#EBEFF1"/>
        <circle cx="62" cy="72" r="10" fill="#FFFFFF"/>
        <circle cx="62" cy="72" r="6" fill="#D5DBDE"/>
        <rect x="108" y="44" width="62" height="68" rx="3" fill="#FFFFFF"/>
        <rect x="116" y="56" width="46" height="28" rx="2" fill="#EBEFF1"/>
        <path d="M116 92 L162 92" strokeWidth="0.8"/>
        <path d="M116 100 L150 100" strokeWidth="0.8"/>
      </svg>
    );
    case 'spray': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="76" y="36" width="48" height="84" rx="4" fill="#EBEFF1"/>
        <rect x="84" y="22" width="32" height="16" rx="3" fill="#D5DBDE"/>
        <path d="M124 30 L150 26 L150 38 L124 34" fill="#FFFFFF"/>
        <rect x="84" y="60" width="32" height="36" rx="2" fill="#FFFFFF"/>
        <path d="M88 70h24 M88 78h20" strokeWidth="0.7"/>
      </svg>
    );
    case 'glass': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="36" y="32" width="128" height="76" rx="3" fill="#EBEFF1" opacity="0.5"/>
        <rect x="36" y="32" width="128" height="76" rx="3"/>
        <path d="M100 32 L100 108 M36 70 L164 70" strokeWidth="0.6"/>
        <rect x="56" y="50" width="56" height="14" rx="2" fill="#25D366" opacity="0.3"/>
        <path d="M120 90 L160 50" strokeWidth="2.4" stroke="#0A4D68"/>
        <rect x="158" y="44" width="14" height="14" rx="2" fill="#0A4D68"/>
      </svg>
    );
    default: return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="40" y="32" width="120" height="80" rx="6" fill="#EBEFF1"/>
      </svg>
    );
  }
}

/* ============================================================
   Shared data — categories, brands, products, industries
   ============================================================ */
window.CV_CATEGORIES = [
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

window.CV_BRANDS = [
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

window.CV_PRODUCTS = [
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

window.CV_COURSES = [
  { id:'safety', title:'Sicurezza & DPI in cantiere',          level:'Base',      duration:'8 ore · 1 giornata',  mode:'Aula o on-site',  nextDate:'18 giu 2026 · Busto Arsizio', price:'€180', desc:'Uso corretto dei DPI, valutazione rischi nei contesti di pulizia industriale, segnaletica HACCP.',           kind:'safety',    bg:'linear-gradient(135deg, #E8F2F5 0%, #C6DEE5 100%)' },
  { id:'machine',title:'Lavasciuga uomo a bordo · uso pratico', level:'Avanzato',  duration:'16 ore · 2 giornate', mode:'Aula + officina', nextDate:'02 lug 2026 · Showroom',     price:'€420', desc:'Configurazione, manutenzione ordinaria, ottimizzazione consumi, gestione batterie al gel e litio.',            kind:'machine',   bg:'linear-gradient(135deg, #F5F7F8 0%, #EBEFF1 100%)' },
  { id:'chem',   title:'Detergenti professionali & HACCP',      level:'Base',      duration:'6 ore · 1 giornata',  mode:'Aula',            nextDate:'25 giu 2026 · Busto Arsizio', price:'€220', desc:'Dosaggi, schede di sicurezza, compatibilità chimica e protocolli HACCP per il settore alimentare e sanitario.',  kind:'chemicals', bg:'linear-gradient(135deg, #E6FBEE 0%, #C8F5D8 100%)' },
  { id:'sales',  title:'Gare d\'appalto & specifiche tecniche', level:'Specialist',duration:'12 ore · 2 giornate', mode:'Aula',            nextDate:'10 set 2026 · Busto Arsizio', price:'€520', desc:'Come leggere un capitolato, dimensionare la flotta, redigere relazioni tecniche e dossier per gare pubbliche.',  kind:'sales',     bg:'linear-gradient(135deg, #FBE7C8 0%, #FBE2C0 100%)' },
];

window.CV_LANDING_VIDEOS = [
  { id:'tour-hq',     title:'Tour della sede',                  duration:'03:24', spot:'Hero · Video Aziendale', date:'12.03.2026', size:'248 MB', status:'live' },
  { id:'innova-demo', title:'COMAC Innova 100 B · in azione',   duration:'01:48', spot:'Macchine in evidenza',    date:'04.04.2026', size:'132 MB', status:'live' },
  { id:'service-be',  title:'Officina autorizzata · backstage', duration:'02:12', spot:'Settori serviti',         date:'21.04.2026', size:'164 MB', status:'draft' },
];

window.CV_INDUSTRIES = [
  { id:'imprese',   label:'Imprese di pulizia',         icon:'briefcase',    desc:'Carrelli, detergenti e ricambi per appalti multi-sede.' },
  { id:'industria', label:'Industria & manifattura',    icon:'factory',      desc:'Lavasciuga industriali, sgrassanti pesanti, aspirazioni.' },
  { id:'sanita',    label:'Sanità & RSA',               icon:'cross',        desc:'Disinfettanti PMC, sanificazione superfici, carrelli HACCP.' },
  { id:'gdo',       label:'GDO & retail',               icon:'shopping-bag', desc:'Scope automatiche, lava-vetri, igiene servizi pubblici.' },
  { id:'logistica', label:'Logistica & magazzini',      icon:'truck',        desc:'Spazzatrici uomo a bordo, scoraggia-piccione, container.' },
  { id:'horeca',    label:'Hotellerie & ristorazione',  icon:'utensils',     desc:'Detergenti HACCP, carta igienica, lavastoviglie professionali.' },
];

Object.assign(window, {
  CVLogo, CVButton, CVIcon, TrustBar, Eyebrow, Spec, StockPill,
  CVHeader, CVFooter,
  Field, TextInput, Textarea, Select, Check, inputStyle,
  ProductCard, ProductIllustration,
});
