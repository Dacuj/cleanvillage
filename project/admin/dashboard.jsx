/* Admin · Dashboard overview page */

function AdminDashboard({ onNav }) {
  const products = window.CV_PRODUCTS;
  const categories = window.CV_CATEGORIES;

  return (
    <AdminPage
      eyebrow="Console interna · 16 maggio 2026"
      title="Buongiorno Marco."
      subtitle="Hai 4 preventivi che aspettano una risposta e 12 ordini da spedire entro venerdì. Tutto sotto controllo."
      actions={[
        <ABtn key="r" variant="secondary" icon={<AdminIcon name="download" size={13}/>}>Esporta report</ABtn>,
        <ABtn key="n" variant="cta" icon={<AdminIcon name="plus" size={13}/>} onClick={() => onNav('products')}>Nuovo prodotto</ABtn>,
      ]}
    >
      {/* Stat cards */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:28}}>
        <KPI title="SKU attivi"        value="571" trend="+12 ultimi 30 gg"   tone="teal"   icon="package"/>
        <KPI title="Ordini aperti"     value="42"  trend="12 in spedizione"   tone="mint"   icon="shopping-bag"/>
        <KPI title="Preventivi"        value="18"  trend="4 in attesa"        tone="amber"  icon="file-text"/>
        <KPI title="Fatturato MTD"     value="€312k" trend="+8,2% vs mag '25" tone="teal"   icon="trending-up"/>
      </div>

      {/* 2 column area */}
      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:18}}>
        {/* Recent quotes */}
        <Panel title="Preventivi recenti" padding={0} action={
          <a href="#" onClick={e=>{e.preventDefault(); onNav('quotes');}} style={{fontSize:12, fontWeight:600, color:'var(--color-teal-500)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:4}}>Vedi tutti <AdminIcon name="arrow-right" size={12}/></a>
        }>
          <DataTable
            columns={[
              { key:'ref', label:'Riferimento', render: r => <span style={{fontFamily:'var(--font-mono)', fontSize:12, color:'var(--color-teal-500)', fontWeight:500}}>{r.ref}</span> },
              { key:'co', label:'Azienda' },
              { key:'cat', label:'Categoria' },
              { key:'amt', label:'Importo stim.', align:'right', render: r => <span style={{fontFamily:'var(--font-mono)', fontSize:12}}>{r.amt}</span> },
              { key:'st', label:'Stato', render: r => <Badge tone={r.stTone}>{r.st}</Badge> },
              { key:'d', label:'Data', render: r => <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)'}}>{r.d}</span> },
            ]}
            rows={[
              { id:1, ref:'CV-2026-04472', co:'Servizi Industriali Lombardi',  cat:'Lavasciuga',  amt:'€56.400', st:'Da rispondere', stTone:'amber',   d:'oggi'    },
              { id:2, ref:'CV-2026-04471', co:'Multiservizi Veneto',           cat:'Detergenti',  amt:'€8.200',  st:'In trattativa', stTone:'teal',    d:'oggi'    },
              { id:3, ref:'CV-2026-04470', co:'Pulinet Brescia',               cat:'Carrelli',    amt:'€2.840',  st:'Inviato',       stTone:'mint',    d:'ieri'    },
              { id:4, ref:'CV-2026-04469', co:'Logistica Po Sud',              cat:'Idropulitrici',amt:'€18.900', st:'Da rispondere', stTone:'amber',   d:'ieri'    },
              { id:5, ref:'CV-2026-04468', co:'GDO Center Italia',             cat:'Carta',       amt:'€44.100', st:'Accettato',     stTone:'mint',    d:'14 mag'  },
            ]}
          />
        </Panel>

        {/* Catalog health */}
        <Panel title="Catalogo · stato per categoria" padding={20}>
          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            {categories.slice(0, 8).map(c => {
              const pct = Math.min(100, Math.round((c.count / 215) * 100));
              return (
                <div key={c.id}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4}}>
                    <span style={{fontSize:12, fontWeight:500, color:'var(--fg-primary)'}}>{c.label}</span>
                    <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-muted)'}}>{c.count} SKU</span>
                  </div>
                  <div style={{height:6, background:'var(--color-ice-100)', borderRadius:3, overflow:'hidden'}}>
                    <div style={{height:'100%', width: `${pct}%`, background:'var(--color-teal-500)', borderRadius:3, transition:'width 200ms'}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* Quick actions */}
      <div style={{marginTop:18, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14}}>
        <QuickAction icon="plus" title="Aggiungi un nuovo prodotto" desc="Carica un nuovo SKU nel catalogo, assegnalo alla categoria giusta e pubblicalo nel sito." onClick={() => onNav('products')}/>
        <QuickAction icon="video" title="Carica un nuovo video" desc="Aggiungi un video alla landing — tour, demo, intervista — con titolo, durata e posizione." onClick={() => onNav('videos')}/>
        <QuickAction icon="megaphone" title="Crea una promozione" desc="Imposta uno sconto a scaglioni o una promo a tempo, visibile nella strip della homepage." onClick={() => onNav('promos')}/>
      </div>
    </AdminPage>
  );
}

function KPI({ title, value, trend, tone='teal', icon }) {
  const tones = {
    teal:  { bg:'var(--color-teal-50)',  fg:'var(--color-teal-500)' },
    mint:  { bg:'var(--color-mint-50)',  fg:'var(--color-mint-700)' },
    amber: { bg:'var(--color-warning-100)', fg:'var(--color-warning-500)' },
  };
  const t = tones[tone];
  return (
    <div style={{background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'20px 22px', display:'flex', flexDirection:'column', gap:6, position:'relative', overflow:'hidden'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
        <span style={{fontSize:11, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--fg-muted)'}}>{title}</span>
        <span style={{width:34, height:34, display:'grid', placeItems:'center', background:t.bg, color:t.fg, borderRadius:'var(--radius-sm)'}}>
          <AdminIcon name={icon} size={16}/>
        </span>
      </div>
      <div style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:42, letterSpacing:'-0.04em', color:'var(--fg-primary)', lineHeight:1, marginTop:4}}>{value}</div>
      <div style={{fontSize:11, color:'var(--fg-muted)', marginTop:2, display:'inline-flex', alignItems:'center', gap:4}}>
        <AdminIcon name="trending-up" size={11} color="var(--color-mint-700)"/>
        {trend}
      </div>
    </div>
  );
}

function QuickAction({ icon, title, desc, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        textAlign:'left', cursor:'pointer',
        background:'var(--bg-surface)',
        border: `1px solid ${hover ? 'var(--color-teal-500)' : 'var(--border-subtle)'}`,
        borderRadius:'var(--radius-md)', padding:'22px 24px',
        display:'flex', flexDirection:'column', gap:10,
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-fast)',
      }}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <span style={{width:42, height:42, display:'grid', placeItems:'center', background:'var(--color-teal-50)', color:'var(--color-teal-500)', borderRadius:'var(--radius-sm)'}}>
          <AdminIcon name={icon} size={20}/>
        </span>
        <AdminIcon name="arrow-right" size={16} color={hover ? 'var(--color-teal-500)' : 'var(--fg-muted)'}/>
      </div>
      <div style={{fontFamily:'var(--font-display)', fontWeight:500, fontSize:16, letterSpacing:'-0.015em', color:'var(--fg-primary)', marginTop:4}}>{title}</div>
      <div style={{fontSize:12, color:'var(--fg-secondary)', lineHeight:1.55}}>{desc}</div>
    </button>
  );
}

Object.assign(window, { AdminDashboard });
