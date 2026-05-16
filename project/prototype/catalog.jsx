/* CleanVillage redesign — Catalog page (Italian).                     */

function CatalogPage({ onNav }) {
  const [activeCat, setActiveCat] = useState('all');
  const [activeFilters, setActiveFilters] = useState(['Disponibile']);
  const [sort, setSort] = useState('relevance');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // grid | dense

  const cats = window.CV_CATEGORIES;
  const products = window.CV_PRODUCTS;

  const filtered = useMemo(() => {
    let r = products;
    if (activeCat !== 'all') r = r.filter(p => p.catId === activeCat);
    if (search.trim()) r = r.filter(p => (p.name + ' ' + p.brand + ' ' + p.sku).toLowerCase().includes(search.toLowerCase()));
    return r;
  }, [products, activeCat, search]);

  const removeFilter = (f) => setActiveFilters(activeFilters.filter(x => x !== f));

  const currentCat = activeCat === 'all' ? null : cats.find(c => c.id === activeCat);

  return (
    <main style={{background:'var(--bg-page)'}}>
      {/* Page header — teal accent */}
      <section style={{borderBottom:'1px solid var(--border-subtle)', background:'var(--bg-surface)'}}>
        <div style={{maxWidth:'var(--max-content)', margin:'0 auto', padding:'40px 32px 32px'}}>
          <div style={{display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--fg-muted)', marginBottom:18, fontFamily:'var(--font-mono)'}}>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNav('landing');}} style={{color:'var(--fg-muted)', textDecoration:'none'}}>Home</a>
            <CVIcon name="chevron-right" size={12}/>
            <a href="#" onClick={(e)=>{e.preventDefault(); setActiveCat('all');}} style={{color:'var(--fg-muted)', textDecoration:'none'}}>Catalogo</a>
            {currentCat && <>
              <CVIcon name="chevron-right" size={12}/>
              <span style={{color:'var(--fg-primary)'}}>{currentCat.label}</span>
            </>}
          </div>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'end', gap:24, flexWrap:'wrap'}}>
            <div>
              <h1 style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:'clamp(40px, 5vw, 60px)', letterSpacing:'-0.04em', margin:0, lineHeight:1.02, textWrap:'balance', maxWidth:'18ch'}}>
                {currentCat ? currentCat.label : 'Catalogo prodotti.'}
              </h1>
              <p style={{margin:'14px 0 0', color:'var(--fg-secondary)', fontSize:15, fontWeight:400, maxWidth:'62ch'}}>
                {currentCat
                  ? `${currentCat.desc} ${currentCat.count} SKU · pronti per il trade.`
                  : '571 SKU in 11 categorie · pricing per buyer trade, IVA esclusa, sconti a scaglioni'}
              </p>
            </div>
            <div style={{display:'flex', gap:10, alignItems:'center'}}>
              <SearchBox value={search} onChange={setSearch}/>
              <SortMenu value={sort} onChange={setSort}/>
            </div>
          </div>
        </div>
      </section>

      <section style={{maxWidth:'var(--max-content)', margin:'0 auto', padding:'40px 32px 96px', display:'grid', gridTemplateColumns:'260px 1fr', gap:36}}>
        <FilterSidebar
          cats={cats}
          activeCat={activeCat}
          onCatChange={setActiveCat}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        <div>
          {/* Toolbar — active filters + view toggle */}
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, marginBottom:22, flexWrap:'wrap'}}>
            <div style={{display:'flex', alignItems:'center', gap:10, flexWrap:'wrap'}}>
              {activeFilters.length > 0 && (
                <>
                  <span style={{fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600}}>Filtri attivi</span>
                  {activeFilters.map(f => <FilterChip key={f} onRemove={() => removeFilter(f)}>{f}</FilterChip>)}
                  <button onClick={() => setActiveFilters([])} style={{background:'transparent', border:'none', color:'var(--color-teal-500)', fontSize:12, fontWeight:500, textDecoration:'underline', cursor:'pointer', fontFamily:'var(--font-body)'}}>Azzera tutto</button>
                </>
              )}
            </div>
            <div style={{display:'flex', alignItems:'center', gap:14}}>
              <span style={{fontSize:13, color:'var(--fg-secondary)', fontFamily:'var(--font-mono)'}}>
                <b style={{color:'var(--fg-primary)', fontWeight:600}}>{filtered.length}</b> di {products.length} risultati
              </span>
              <span style={{width:1, height:18, background:'var(--border-subtle)'}}/>
              <div style={{display:'inline-flex', background:'var(--bg-surface)', border:'1px solid var(--border-default)', borderRadius:'var(--radius-sm)', padding:2}}>
                <ViewBtn active={view==='grid'} onClick={()=>setView('grid')} icon="grid-3x3" label="3 colonne"/>
                <ViewBtn active={view==='dense'} onClick={()=>setView('dense')} icon="rows-3" label="4 colonne"/>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={{display:'grid', gridTemplateColumns: view==='dense' ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap:18}}>
            {filtered.map(p => <ProductCard key={p.id} product={p} dense={view==='dense'} onClick={() => onNav('product', p.id)}/>)}
            {filtered.length === 0 && (
              <div style={{gridColumn:'1 / -1', textAlign:'center', padding:'80px 24px', background:'var(--bg-surface)', border:'1px dashed var(--border-default)', borderRadius:'var(--radius-md)'}}>
                <CVIcon name="package-x" size={32} color="var(--fg-muted)"/>
                <div style={{fontFamily:'var(--font-display)', fontSize:20, fontWeight:400, color:'var(--fg-primary)', marginTop:14, letterSpacing:'-0.02em'}}>Nessun risultato</div>
                <div style={{fontSize:13, color:'var(--fg-muted)', marginTop:6}}>Prova con un altro termine o azzera i filtri.</div>
              </div>
            )}
          </div>

          {filtered.length > 0 && <Pagination/>}

          {/* Quote teaser inline */}
          <InlineQuoteCTA onNav={onNav}/>
        </div>
      </section>
    </main>
  );
}

function ViewBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} title={label} style={{
      padding:'6px 8px', background: active ? 'var(--color-ice-100)' : 'transparent',
      color: active ? 'var(--color-teal-500)' : 'var(--fg-muted)',
      border:'none', borderRadius:'var(--radius-xs)', cursor:'pointer', display:'inline-flex', alignItems:'center',
    }}>
      <CVIcon name={icon} size={15}/>
    </button>
  );
}

function FilterChip({ children, onRemove }) {
  return (
    <span style={{display:'inline-flex', alignItems:'center', gap:6, background:'var(--color-teal-500)', color:'var(--color-white)', borderRadius:999, padding:'5px 6px 5px 12px', fontSize:12, fontWeight:600, fontFamily:'var(--font-body)'}}>
      {children}
      <button onClick={onRemove} aria-label="Rimuovi" style={{border:'none', background:'rgba(255,255,255,0.18)', color:'var(--color-white)', width:16, height:16, borderRadius:'50%', display:'grid', placeItems:'center', cursor:'pointer', fontSize:10, padding:0, lineHeight:1}}>×</button>
    </span>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <div style={{position:'relative', width:300}}>
      <CVIcon name="search" size={14} style={{position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--fg-muted)'}}/>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Cerca SKU, marchio, applicazione…"
        style={{...inputStyle, padding:'11px 14px 11px 38px', width:'100%'}}/>
    </div>
  );
}

function SortMenu({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={{...inputStyle, width:'auto', paddingRight:30, fontWeight:500, color:'var(--fg-primary)'}}>
      <option value="relevance">Ordina · Rilevanza</option>
      <option value="price-asc">Prezzo crescente</option>
      <option value="price-desc">Prezzo decrescente</option>
      <option value="stock">Disponibili prima</option>
      <option value="new">Novità</option>
    </select>
  );
}

function FilterSidebar({ cats, activeCat, onCatChange, activeFilters, setActiveFilters }) {
  const toggleF = (f) => {
    setActiveFilters(activeFilters.includes(f) ? activeFilters.filter(x => x !== f) : [...activeFilters, f]);
  };
  return (
    <aside style={{position:'sticky', top:104, alignSelf:'start', maxHeight:'calc(100vh - 120px)', overflowY:'auto', paddingRight:8}}>
      <SidebarSection title="Categoria">
        <button onClick={() => onCatChange('all')} style={{
          display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%',
          background: activeCat === 'all' ? 'var(--color-teal-50)' : 'transparent',
          color: activeCat === 'all' ? 'var(--color-teal-500)' : 'var(--fg-primary)',
          border:'none', cursor:'pointer', padding:'8px 12px', borderRadius:'var(--radius-sm)',
          fontFamily:'var(--font-body)', fontSize:13, textAlign:'left',
          fontWeight: activeCat === 'all' ? 600 : 500,
        }}>
          <span>Tutto il catalogo</span>
          <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)'}}>571</span>
        </button>
        {cats.map(c => (
          <button key={c.id} onClick={() => onCatChange(c.id)} style={{
            display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%',
            background: activeCat === c.id ? 'var(--color-teal-50)' : 'transparent',
            color: activeCat === c.id ? 'var(--color-teal-500)' : 'var(--fg-primary)',
            border:'none', cursor:'pointer', padding:'8px 12px', borderRadius:'var(--radius-sm)',
            fontFamily:'var(--font-body)', fontSize:13, textAlign:'left',
            fontWeight: activeCat === c.id ? 600 : 500,
          }}>
            <span>{c.label}</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)'}}>{c.count}</span>
          </button>
        ))}
      </SidebarSection>

      <SidebarSection title="Marchio">
        {['Comac','Nilfisk','Hako','Tennant','Kärcher','Ghibli','Kiehl','Lucart','IPC'].map(b => (
          <Check key={b} label={b} checked={false}/>
        ))}
        <button style={{background:'transparent', border:'none', color:'var(--color-teal-500)', fontSize:12, fontWeight:500, textDecoration:'underline', cursor:'pointer', padding:'4px 0', textAlign:'left'}}>Vedi tutti i 24 marchi</button>
      </SidebarSection>

      <SidebarSection title="Applicazione">
        {['Pavimenti','Vetri & superfici','Sanificazione','Esterni & piazzali','Igiene servizi','HACCP'].map(b => (
          <Check key={b} label={b}/>
        ))}
      </SidebarSection>

      <SidebarSection title="Prezzo">
        <PriceRange/>
      </SidebarSection>

      <SidebarSection title="Disponibilità" last>
        <Check label="Disponibile" checked={activeFilters.includes('Disponibile')} onChange={() => toggleF('Disponibile')}/>
        <Check label="Scorte limitate" checked={activeFilters.includes('Scorte limitate')} onChange={() => toggleF('Scorte limitate')}/>
        <Check label="Su ordinazione"/>
        <Check label="Promo / Outlet"/>
      </SidebarSection>
    </aside>
  );
}

function SidebarSection({ title, children, last }) {
  return (
    <div style={{paddingBottom:24, marginBottom:24, borderBottom: last ? 'none' : '1px solid var(--border-subtle)'}}>
      <div style={{fontSize:10, fontWeight:600, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--fg-muted)', marginBottom:14}}>{title}</div>
      <div style={{display:'flex', flexDirection:'column', gap:4}}>
        {children}
      </div>
    </div>
  );
}

function PriceRange() {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  return (
    <div style={{display:'flex', gap:8, alignItems:'center'}}>
      <input value={min} onChange={e=>setMin(e.target.value)} placeholder="Min €" style={{...inputStyle, padding:'8px 10px', fontSize:12}}/>
      <span style={{color:'var(--fg-muted)', fontFamily:'var(--font-mono)'}}>–</span>
      <input value={max} onChange={e=>setMax(e.target.value)} placeholder="Max €" style={{...inputStyle, padding:'8px 10px', fontSize:12}}/>
    </div>
  );
}

function Pagination() {
  return (
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:48, paddingTop:28, borderTop:'1px solid var(--border-subtle)'}}>
      <span style={{fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-muted)'}}>Pagina 1 di 24</span>
      <div style={{display:'flex', gap:6}}>
        <PageBtn disabled icon="chevron-left"/>
        <PageBtn active>1</PageBtn>
        <PageBtn>2</PageBtn>
        <PageBtn>3</PageBtn>
        <PageBtn>4</PageBtn>
        <span style={{padding:'8px 6px', color:'var(--fg-muted)'}}>…</span>
        <PageBtn>24</PageBtn>
        <PageBtn icon="chevron-right"/>
      </div>
      <span style={{fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-muted)'}}>24 per pagina</span>
    </div>
  );
}

function PageBtn({ children, active, disabled, icon }) {
  return (
    <button disabled={disabled} style={{
      minWidth:36, height:36, padding:'0 10px',
      background: active ? 'var(--color-teal-500)' : 'transparent',
      color: active ? 'var(--color-white)' : disabled ? 'var(--color-ice-300)' : 'var(--fg-primary)',
      border: `1px solid ${active ? 'var(--color-teal-500)' : 'var(--border-subtle)'}`,
      borderRadius:'var(--radius-sm)',
      fontFamily:'var(--font-body)', fontSize:13, fontWeight: active ? 600 : 500,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display:'inline-flex', alignItems:'center', justifyContent:'center',
    }}>
      {icon ? <CVIcon name={icon} size={14}/> : children}
    </button>
  );
}

function InlineQuoteCTA({ onNav }) {
  return (
    <div style={{marginTop:56, background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'36px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:28, position:'relative', overflow:'hidden'}}>
      <span style={{position:'absolute', left:0, top:0, bottom:0, width:4, background:'var(--color-mint-500)'}}/>
      <div>
        <Eyebrow>Non trovi quello che cerchi?</Eyebrow>
        <h3 style={{fontFamily:'var(--font-display)', fontWeight:400, fontSize:22, letterSpacing:'-0.025em', margin:'10px 0 6px'}}>Mandaci una richiesta su misura.</h3>
        <p style={{margin:0, fontSize:14, color:'var(--fg-secondary)', maxWidth:'58ch', lineHeight:1.55}}>Marchi che non trovi a catalogo, formati bancale, custom packaging: il trade desk risponde entro 24 ore con disponibilità e prezzo.</p>
      </div>
      <CVButton variant="cta" size="lg" onClick={() => onNav('contact')} iconRight={<CVIcon name="arrow-right" size={14}/>}>Richiedi un Preventivo</CVButton>
    </div>
  );
}

Object.assign(window, { CatalogPage });
