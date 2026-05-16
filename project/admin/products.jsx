/* Admin · Products list + add/edit form (modal) */

function AdminProducts({ onNav }) {
  const [items, setItems] = useState(window.CV_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [editing, setEditing] = useState(null); // null | 'new' | product

  const cats = window.CV_CATEGORIES;

  const filtered = useMemo(() => {
    return items.filter(p => {
      if (filterCat !== 'all' && p.catId !== filterCat) return false;
      if (filterStock !== 'all' && p.stock !== filterStock) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (p.name + ' ' + p.brand + ' ' + p.sku).toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, search, filterCat, filterStock]);

  const handleSave = (data, isNew) => {
    if (isNew) {
      const id = `new-${Date.now()}`;
      const next = { id, ...data, isNew: true };
      setItems([next, ...items]);
    } else {
      setItems(items.map(p => p.id === data.id ? data : p));
    }
    setEditing(null);
  };

  const handleDelete = (id) => {
    setItems(items.filter(p => p.id !== id));
    setEditing(null);
  };

  return (
    <AdminPage
      eyebrow="Catalogo"
      title="Prodotti"
      subtitle={`${items.length} SKU totali · ${items.filter(p => p.stock==='in').length} disponibili · ${items.filter(p => p.stock==='low').length} con scorte limitate`}
      actions={[
        <ABtn key="i" variant="secondary" icon={<AdminIcon name="upload" size={13}/>}>Importa CSV</ABtn>,
        <ABtn key="n" variant="cta"       icon={<AdminIcon name="plus" size={13}/>} onClick={() => setEditing('new')}>Aggiungi prodotto</ABtn>,
      ]}
    >
      {/* Filters */}
      <div style={{display:'flex', gap:10, marginBottom:18, alignItems:'center'}}>
        <div style={{position:'relative', width:320}}>
          <AdminIcon name="search" size={14} style={{position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'var(--fg-muted)'}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cerca SKU, nome, marchio…"
            style={{...adminInputStyle, paddingLeft:34}}/>
        </div>
        <ASelect value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{width:'auto', minWidth:200}}>
          <option value="all">Tutte le categorie</option>
          {cats.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </ASelect>
        <ASelect value={filterStock} onChange={e=>setFilterStock(e.target.value)} style={{width:'auto', minWidth:160}}>
          <option value="all">Tutti gli stock</option>
          <option value="in">Disponibile</option>
          <option value="low">Scorte limitate</option>
          <option value="out">Su ordinazione</option>
        </ASelect>
        <span style={{flex:1}}/>
        <span style={{fontFamily:'var(--font-mono)', fontSize:12, color:'var(--fg-muted)'}}>{filtered.length} risultati</span>
      </div>

      <Panel padding={0}>
        <DataTable
          empty="Nessun prodotto trovato. Modifica i filtri o aggiungi un nuovo SKU."
          onRowClick={(row) => setEditing(row)}
          columns={[
            { key:'thumb', label:'', width:60, render: r => (
              <div style={{width:42, height:42, background:'var(--color-ice-50)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-xs)', display:'grid', placeItems:'center', padding:4}}>
                <div style={{width:'90%'}}><ProductIllustration kind={r.kind} hover={false}/></div>
              </div>
            )},
            { key:'name', label:'Prodotto', render: r => (
              <div>
                <div style={{fontFamily:'var(--font-display)', fontSize:14, fontWeight:500, color:'var(--fg-primary)', letterSpacing:'-0.01em'}}>{r.name}</div>
                <div style={{fontSize:11, color:'var(--fg-muted)', marginTop:2, display:'inline-flex', gap:8}}>
                  <span style={{fontWeight:600}}>{r.brand}</span>
                  <span>·</span>
                  <span>{(cats.find(c => c.id === r.catId) || {}).label}</span>
                </div>
              </div>
            )},
            { key:'sku',   label:'SKU',  width:140, render: r => <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--color-teal-500)', fontWeight:500}}>{r.sku}</span> },
            { key:'price', label:'Prezzo', width:120, render: r => <span style={{fontFamily:'var(--font-mono)', fontSize:12, fontWeight:600}}>{r.price}</span> },
            { key:'stock', label:'Stock',   width:160, render: r => (
              r.stock === 'in'  ? <Badge tone="mint">Disponibile · {r.count || 0}</Badge> :
              r.stock === 'low' ? <Badge tone="amber">Ultimi {r.count || 0} pz</Badge> :
                                  <Badge tone="danger">Su ordinazione</Badge>
            )},
            { key:'badge', label:'Stato',   width:120, render: r => (
              r.isNew    ? <Badge tone="teal">Bozza · nuovo</Badge> :
              r.badge    ? <Badge tone="amber">{r.badge}</Badge> :
                           <Badge tone="neutral">Pubblicato</Badge>
            )},
            { key:'act', label:'', width:96, align:'right', render: r => (
              <div style={{display:'inline-flex', gap:4}}>
                <button onClick={(e)=>{e.stopPropagation(); setEditing(r);}} style={{width:30, height:30, background:'transparent', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-xs)', cursor:'pointer', display:'grid', placeItems:'center'}} title="Modifica">
                  <AdminIcon name="pencil" size={13} color="var(--fg-secondary)"/>
                </button>
                <button onClick={(e)=>{e.stopPropagation(); window.open('../Cleanvillage.it Redesign.html#product/'+r.id, '_blank');}} style={{width:30, height:30, background:'transparent', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-xs)', cursor:'pointer', display:'grid', placeItems:'center'}} title="Apri sul sito">
                  <AdminIcon name="external-link" size={13} color="var(--fg-secondary)"/>
                </button>
              </div>
            )},
          ]}
          rows={filtered}
        />
      </Panel>

      {/* Add/Edit modal */}
      <ProductModal
        open={editing !== null}
        product={editing === 'new' ? null : editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AdminPage>
  );
}

function ProductModal({ open, product, onClose, onSave, onDelete }) {
  const cats = window.CV_CATEGORIES;
  const isNew = !product;
  const [form, setForm] = useState(() => ({
    id: product?.id || '',
    name: product?.name || '',
    brand: product?.brand || '',
    sku: product?.sku || '',
    catId: product?.catId || cats[0].id,
    kind: product?.kind || cats[0].kind,
    price: product?.price || '',
    stock: product?.stock || 'in',
    count: product?.count || 1,
    badge: product?.badge || '',
    specs: product?.specs ? product.specs.join('\n') : '',
    description: product?.description || '',
  }));

  // Refresh form when product changes
  useEffect(() => {
    if (open) {
      setForm({
        id: product?.id || '',
        name: product?.name || '',
        brand: product?.brand || '',
        sku: product?.sku || '',
        catId: product?.catId || cats[0].id,
        kind: product?.kind || cats[0].kind,
        price: product?.price || '',
        stock: product?.stock || 'in',
        count: product?.count || 1,
        badge: product?.badge || '',
        specs: product?.specs ? product.specs.join('\n') : '',
        description: product?.description || '',
      });
    }
  }, [open, product]);

  // Auto-set kind based on category change
  const setCat = (catId) => {
    const cat = cats.find(c => c.id === catId);
    setForm({...form, catId, kind: cat?.kind || form.kind});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...product, ...form,
      specs: form.specs.split('\n').map(s => s.trim()).filter(Boolean),
      count: parseInt(form.count) || 0,
    };
    onSave(payload, isNew);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width={860}
      title={isNew ? 'Nuovo prodotto' : `Modifica · ${product?.name}`}
      footer={
        <>
          {!isNew && <ABtn variant="danger" icon={<AdminIcon name="trash-2" size={13}/>} onClick={() => onDelete(product.id)}>Elimina</ABtn>}
          <span style={{flex:1}}/>
          <ABtn variant="secondary" onClick={onClose}>Annulla</ABtn>
          <ABtn variant="cta" onClick={handleSubmit} icon={<AdminIcon name="check" size={13}/>}>{isNew ? 'Aggiungi prodotto' : 'Salva modifiche'}</ABtn>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Header strip — preview */}
        <div style={{display:'grid', gridTemplateColumns:'140px 1fr', gap:18, marginBottom:24, padding:'18px', background:'var(--color-ice-50)', borderRadius:'var(--radius-md)', border:'1px solid var(--border-subtle)'}}>
          <div style={{aspectRatio:'1/1', background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', display:'grid', placeItems:'center', padding:10}}>
            <div style={{width:'85%'}}><ProductIllustration kind={form.kind} hover={false}/></div>
          </div>
          <div style={{display:'flex', flexDirection:'column', justifyContent:'center', gap:6}}>
            <div style={{fontSize:10, fontWeight:600, color:'var(--fg-muted)', letterSpacing:'0.14em', textTransform:'uppercase'}}>Anteprima</div>
            <div style={{fontFamily:'var(--font-display)', fontSize:20, fontWeight:400, letterSpacing:'-0.025em', color:'var(--fg-primary)', lineHeight:1.18}}>{form.name || 'Nome prodotto'}</div>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <span style={{fontSize:11, fontWeight:600, color:'var(--fg-muted)', letterSpacing:'0.06em', textTransform:'uppercase'}}>{form.brand || 'Marchio'}</span>
              <span style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--color-teal-500)'}}>{form.sku || 'COD-000'}</span>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:10, marginTop:4}}>
              <span style={{fontFamily:'var(--font-display)', fontWeight:300, fontSize:22, letterSpacing:'-0.03em'}}>{form.price || '€0'}</span>
              {form.stock === 'in'  && <Badge tone="mint">Disponibile · {form.count}</Badge>}
              {form.stock === 'low' && <Badge tone="amber">Ultimi {form.count} pz</Badge>}
              {form.stock === 'out' && <Badge tone="danger">Su ordinazione</Badge>}
              {form.badge && <Badge tone="teal">{form.badge}</Badge>}
            </div>
          </div>
        </div>

        {/* Sezione: identità */}
        <FormSect title="Identità prodotto" step={1}>
          <div style={{display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:14}}>
            <AField label="Nome prodotto" required span={1}>
              <AInput required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Es. Comac Innova 100 B"/>
            </AField>
            <AField label="Marchio" required>
              <AInput required value={form.brand} onChange={e=>setForm({...form, brand: e.target.value.toUpperCase()})} placeholder="COMAC"/>
            </AField>
            <AField label="SKU / codice" required>
              <AInput required value={form.sku} onChange={e=>setForm({...form, sku: e.target.value.toUpperCase()})} placeholder="COM-IN100B"/>
            </AField>
          </div>
          <AField label="Descrizione breve" hint="Mostrata sulla pagina prodotto sotto il titolo. 1–3 frasi.">
            <ATextarea value={form.description} onChange={e=>setForm({...form, description: e.target.value})} placeholder="Macchina compatta a uomo a bordo per superfici da 800 a 4.000 m²…"/>
          </AField>
        </FormSect>

        {/* Sezione: categoria */}
        <FormSect title="Categoria & posizionamento" step={2}>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10}}>
            {cats.map(c => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)} style={{
                padding:'12px 14px', textAlign:'left', cursor:'pointer',
                background: form.catId === c.id ? 'var(--color-teal-50)' : 'var(--bg-surface)',
                border: `1px solid ${form.catId === c.id ? 'var(--color-teal-500)' : 'var(--border-default)'}`,
                borderRadius:'var(--radius-sm)',
                fontFamily:'var(--font-body)',
                display:'flex', alignItems:'center', gap:10,
              }}>
                <span style={{width:28, height:28, display:'grid', placeItems:'center', background: form.catId === c.id ? 'var(--color-teal-500)' : 'var(--color-ice-100)', color: form.catId === c.id ? 'var(--color-white)' : 'var(--color-teal-500)', borderRadius:'var(--radius-xs)', flexShrink:0}}>
                  <AdminIcon name={c.icon} size={14}/>
                </span>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:12, fontWeight: form.catId === c.id ? 600 : 500, color: form.catId === c.id ? 'var(--color-teal-500)' : 'var(--fg-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{c.short || c.label}</div>
                  <div style={{fontFamily:'var(--font-mono)', fontSize:10, color:'var(--fg-muted)', marginTop:2}}>{c.count} SKU</div>
                </div>
              </button>
            ))}
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:14}}>
            <AField label="Badge promozionale" hint="Lascia vuoto per nessun badge. Es. PROMO −30%, NOVITÀ 2026">
              <AInput value={form.badge} onChange={e=>setForm({...form, badge: e.target.value})} placeholder="Novità"/>
            </AField>
            <AField label="Anteprima illustrazione" hint="Stile applicato finché non carichi una foto reale">
              <ASelect value={form.kind} onChange={e=>setForm({...form, kind: e.target.value})}>
                {['scrubber','washer','detergent','cart','vacuum','shoe','pad','dryer','paper','spray','glass'].map(k => <option key={k} value={k}>{k}</option>)}
              </ASelect>
            </AField>
          </div>
        </FormSect>

        {/* Sezione: prezzo & stock */}
        <FormSect title="Prezzo & disponibilità" step={3}>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14}}>
            <AField label="Prezzo base (IVA esclusa)" required>
              <AInput required value={form.price} onChange={e=>setForm({...form, price: e.target.value})} placeholder="€18.400"/>
            </AField>
            <AField label="Stato stock" required>
              <ASelect value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})}>
                <option value="in">Disponibile</option>
                <option value="low">Scorte limitate</option>
                <option value="out">Su ordinazione</option>
              </ASelect>
            </AField>
            <AField label="Pezzi a magazzino" hint="Mostrato solo se Disponibile / Scorte limitate">
              <AInput type="number" value={form.count} onChange={e=>setForm({...form, count: e.target.value})}/>
            </AField>
          </div>
        </FormSect>

        {/* Sezione: specifiche */}
        <FormSect title="Specifiche tecniche" step={4}>
          <AField label="Spec chips" required hint="Una specifica per riga (mostrate come chip). Es. ‟Serbatoio 145 L‟, ‟Autonomia 4 h‟">
            <ATextarea rows={5} value={form.specs} onChange={e=>setForm({...form, specs: e.target.value})}
              placeholder={'Serbatoio 145 L\nAutonomia 4 h\nPiste 1000 mm\nBatteria al gel'}/>
          </AField>
        </FormSect>

        {/* Sezione: media (placeholder for image upload) */}
        <FormSect title="Galleria immagini" step={5} last>
          <div style={{padding:'24px', background:'var(--color-ice-50)', border:'1px dashed var(--border-strong)', borderRadius:'var(--radius-md)', textAlign:'center'}}>
            <AdminIcon name="image-up" size={28} color="var(--fg-muted)"/>
            <div style={{fontFamily:'var(--font-display)', fontSize:15, fontWeight:500, marginTop:10, color:'var(--fg-primary)'}}>Carica fino a 8 immagini</div>
            <div style={{fontSize:12, color:'var(--fg-muted)', marginTop:4}}>PNG / JPG · max 4 MB ciascuna · 1:1 consigliato</div>
            <div style={{marginTop:14}}>
              <ABtn variant="secondary" icon={<AdminIcon name="upload" size={13}/>}>Scegli file…</ABtn>
            </div>
          </div>
        </FormSect>
      </form>
    </Modal>
  );
}

function FormSect({ step, title, children, last }) {
  return (
    <div style={{paddingBottom: last ? 0 : 24, marginBottom: last ? 4 : 24, borderBottom: last ? 'none' : '1px solid var(--border-subtle)'}}>
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:14}}>
        <span style={{width:22, height:22, borderRadius:'50%', background:'var(--color-teal-500)', color:'var(--color-white)', display:'grid', placeItems:'center', fontFamily:'var(--font-mono)', fontSize:10, fontWeight:600}}>{step}</span>
        <span style={{fontFamily:'var(--font-display)', fontWeight:500, fontSize:14, letterSpacing:'-0.01em', color:'var(--fg-primary)'}}>{title}</span>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:14}}>{children}</div>
    </div>
  );
}

Object.assign(window, { AdminProducts });
