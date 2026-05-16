/* CleanVillage redesign — Contact / Quote-request page (Italian).   */

function ContactPage({ onNav }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company:'', vat:'', name:'', role:'', email:'', phone:'',
    category:'lavasciuga', message:'', quantity:'1-5', timeline:'1-month', sector:'imprese',
    privacy:false, newsletter:false,
  });
  const update = (k) => (e) => setForm({...form, [k]: e.target.value});

  if (submitted) return <ContactSuccess onReset={() => setSubmitted(false)} onNav={onNav}/>;

  return (
    <main style={{background:'var(--bg-page)'}}>
      {/* Hero */}
      <section style={{background:'var(--bg-surface)', borderBottom:'1px solid var(--border-subtle)', position:'relative'}}>
        <div style={{maxWidth:'var(--max-content)', margin:'0 auto', padding:'56px 32px 44px'}}>
          <div style={{display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--fg-muted)', marginBottom:18, fontFamily:'var(--font-mono)'}}>
            <a href="#" onClick={(e)=>{e.preventDefault(); onNav('landing');}} style={{color:'var(--fg-muted)', textDecoration:'none'}}>Home</a>
            <CVIcon name="chevron-right" size={12}/>
            <span style={{color:'var(--fg-primary)'}}>Richiesta preventivo</span>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:48, alignItems:'end'}}>
            <div>
              <Eyebrow>Trade desk · risposta entro 24 ore</Eyebrow>
              <h1 style={{fontFamily:'var(--font-display)', fontWeight:200, fontSize:'clamp(40px, 5.4vw, 68px)', letterSpacing:'-0.04em', margin:'14px 0 0', lineHeight:1.02, textWrap:'balance', maxWidth:'18ch'}}>
                Raccontaci cosa stai allestendo.
              </h1>
              <p style={{margin:'18px 0 0', color:'var(--fg-secondary)', fontSize:16, maxWidth:'56ch', lineHeight:1.6}}>
                Inviaci specifiche, quantità target e finestra di consegna. Rispondiamo entro 1 giorno lavorativo con disponibilità di stock, prezzo a scaglioni e tempi di consegna confermati.
              </p>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:14}}>
              <QuickStat icon="reply" label="Tempo medio di risposta" value="6h 12m" small="Lun–Ven · 08:30–18:00"/>
              <QuickStat icon="check-circle" label="Preventivi finalizzati 2025" value="3.482" small="92% conversione su lead trade"/>
            </div>
          </div>
        </div>
      </section>

      <section style={{maxWidth:'var(--max-content)', margin:'0 auto', padding:'56px 32px 96px', display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:40, alignItems:'start'}}>
        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              style={{background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'36px 36px 32px'}}>

          <FormSection title="La tua azienda" step={1}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
              <Field label="Ragione sociale" required span={2}>
                <TextInput required value={form.company} onChange={update('company')} placeholder="Servizi Industriali Lombardi Srl"/>
              </Field>
              <Field label="P.IVA" required>
                <TextInput required value={form.vat} onChange={update('vat')} placeholder="IT 0123 4567 891"/>
              </Field>
              <Field label="Settore" required>
                <Select value={form.sector} onChange={update('sector')}>
                  {window.CV_INDUSTRIES.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                  <option value="other">Altro</option>
                </Select>
              </Field>
              <Field label="Persona di riferimento" required>
                <TextInput required value={form.name} onChange={update('name')} placeholder="Marco Rossi"/>
              </Field>
              <Field label="Ruolo / Reparto">
                <TextInput value={form.role} onChange={update('role')} placeholder="Responsabile acquisti"/>
              </Field>
              <Field label="Email aziendale" required>
                <TextInput required type="email" value={form.email} onChange={update('email')} placeholder="acquisti@azienda.it"/>
              </Field>
              <Field label="Telefono">
                <TextInput type="tel" value={form.phone} onChange={update('phone')} placeholder="+39 ..."/>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Cosa ti serve" step={2}>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18}}>
              <Field label="Categoria principale" required>
                <Select value={form.category} onChange={update('category')}>
                  {window.CV_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  <option value="multi">Categorie multiple / fornitura mista</option>
                </Select>
              </Field>
              <Field label="Quantità approssimativa">
                <Select value={form.quantity} onChange={update('quantity')}>
                  <option value="1-5">1–5 unità</option>
                  <option value="5-20">5–20 unità</option>
                  <option value="20-50">20–50 unità</option>
                  <option value="50+">50+ / flotta</option>
                </Select>
              </Field>
              <Field label="Finestra di consegna" span={2}>
                <RadioRow value={form.timeline} onChange={(v) => setForm({...form, timeline:v})} options={[
                  { v:'urgent',   l:'Urgente · entro 7 gg' },
                  { v:'1-month',  l:'Entro 30 giorni' },
                  { v:'q-end',    l:'Entro fine trimestre' },
                  { v:'planning', l:'In pianificazione' },
                ]}/>
              </Field>
            </div>
            <Field label="Specifiche, modelli o caso d'uso" required>
              <Textarea required rows={5} value={form.message} onChange={update('message')}
                placeholder="Es. stiamo allestendo 3 magazzini di logistica (~6.000 m² ciascuno). Servono lavasciuga uomo a bordo, spazzatrici batteria e una scorta annuale di detergente neutro. Consegna su Milano + Bergamo entro fine Q3."/>
            </Field>
            <div style={{marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
              <CVAttachField/>
              <CVAttachField label="Capitolato / RDA"/>
            </div>
          </FormSection>

          <FormSection title="Conferma" step={3} last>
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              <Check label="Acquisto per conto di un'azienda registrata (P.IVA valida)" checked={true}/>
              <Check label="Acconsento al trattamento dei dati ai sensi dell'informativa privacy"/>
              <Check label="Voglio ricevere offerte tecniche, novità e listini stagionali (max 1 email/mese)"/>
            </div>
          </FormSection>

          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, paddingTop:24, borderTop:'1px solid var(--border-subtle)', gap:16}}>
            <span style={{fontSize:12, color:'var(--fg-muted)', fontFamily:'var(--font-mono)', maxWidth:'38ch', lineHeight:1.5}}>
              Inviando confermi le nostre condizioni di vendita. Risposta entro 1 giorno lavorativo.
            </span>
            <CVButton variant="cta" size="lg" type="submit" iconRight={<CVIcon name="arrow-right" size={14}/>}>
              Invia la richiesta
            </CVButton>
          </div>
        </form>

        {/* Sidebar */}
        <aside style={{display:'flex', flexDirection:'column', gap:18, position:'sticky', top:104}}>
          <ChannelCard icon="phone" title="Trade desk" lines={[
            { label:'Telefono', value:'+39 0331 555 220' },
            { label:'Orari',    value:'Lun–Ven · 08:30–18:00' },
            { label:'Whatsapp', value:'+39 339 555 220' },
          ]}/>
          <ChannelCard icon="mail" title="Trade email" lines={[
            { label:'Preventivi', value:'trade@cleanvillage.it' },
            { label:'Service',    value:'service@cleanvillage.it' },
            { label:'Amministr.', value:'admin@cleanvillage.it' },
          ]}/>
          <HQCard/>
        </aside>
      </section>
    </main>
  );
}

function QuickStat({ icon, label, value, small }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:16, padding:'18px 20px', background:'var(--color-ice-50)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)'}}>
      <span style={{width:44, height:44, display:'grid', placeItems:'center', background:'var(--color-mint-50)', color:'var(--color-mint-700)', borderRadius:'var(--radius-sm)', flexShrink:0}}>
        <CVIcon name={icon} size={20}/>
      </span>
      <div style={{flex:1}}>
        <div style={{fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600}}>{label}</div>
        <div style={{fontFamily:'var(--font-display)', fontWeight:300, fontSize:24, letterSpacing:'-0.03em', color:'var(--fg-primary)', marginTop:2, lineHeight:1.1}}>{value}</div>
        <div style={{fontSize:11, color:'var(--fg-muted)', marginTop:3}}>{small}</div>
      </div>
    </div>
  );
}

function FormSection({ title, step, children, last }) {
  return (
    <div style={{paddingBottom: last ? 0 : 28, marginBottom: last ? 8 : 28, borderBottom: last ? 'none' : '1px solid var(--border-subtle)'}}>
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:18}}>
        <span style={{width:24, height:24, borderRadius:'50%', background:'var(--color-teal-500)', color:'var(--color-white)', display:'grid', placeItems:'center', fontFamily:'var(--font-mono)', fontSize:11, fontWeight:600}}>{step}</span>
        <h3 style={{fontFamily:'var(--font-display)', fontWeight:400, fontSize:18, letterSpacing:'-0.02em', margin:0, color:'var(--fg-primary)'}}>{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RadioRow({ value, onChange, options }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:`repeat(${options.length}, 1fr)`, gap:8}}>
      {options.map(o => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)} style={{
          padding:'11px 14px', textAlign:'left', cursor:'pointer',
          background: value === o.v ? 'var(--color-teal-50)' : 'var(--bg-surface)',
          border: `1px solid ${value === o.v ? 'var(--color-teal-500)' : 'var(--border-default)'}`,
          borderRadius:'var(--radius-sm)',
          fontFamily:'var(--font-body)', fontSize:13, fontWeight: value === o.v ? 600 : 500,
          color: value === o.v ? 'var(--color-teal-500)' : 'var(--fg-primary)',
          display:'flex', alignItems:'center', gap:9,
          transition: 'all var(--motion-fast)',
        }}>
          <span style={{width:14, height:14, borderRadius:'50%', border: `1.5px solid ${value === o.v ? 'var(--color-teal-500)' : 'var(--border-strong)'}`, display:'grid', placeItems:'center', flexShrink:0}}>
            {value === o.v && <span style={{width:6, height:6, borderRadius:'50%', background:'var(--color-teal-500)'}}/>}
          </span>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function CVAttachField({ label = 'Allegato (opzionale)' }) {
  const [file, setFile] = useState(null);
  return (
    <Field label={label} hint="PDF, DOC, XLS — max 10 MB">
      <label style={{
        display:'flex', alignItems:'center', justifyContent:'space-between', gap:10,
        padding:'11px 14px', background:'var(--bg-surface)',
        border:'1px dashed var(--border-strong)', borderRadius:'var(--radius-sm)',
        cursor:'pointer', color: file ? 'var(--fg-primary)' : 'var(--fg-muted)', fontSize:13,
      }}>
        <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
          <CVIcon name="paperclip" size={14}/>
          {file ? file.name : 'Scegli file o trascina qui'}
        </span>
        <span style={{fontFamily:'var(--font-mono)', fontSize:10}}>{file ? `${(file.size/1024).toFixed(0)} KB` : ''}</span>
        <input type="file" style={{display:'none'}} onChange={e => setFile(e.target.files?.[0])}/>
      </label>
    </Field>
  );
}

function ChannelCard({ icon, title, lines }) {
  return (
    <div style={{background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', padding:'22px 24px', display:'flex', flexDirection:'column', gap:14}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{width:36, height:36, borderRadius:'var(--radius-sm)', background:'var(--color-teal-50)', color:'var(--color-teal-500)', display:'grid', placeItems:'center'}}>
          <CVIcon name={icon} size={18}/>
        </div>
        <span style={{fontFamily:'var(--font-display)', fontWeight:400, fontSize:17, letterSpacing:'-0.02em'}}>{title}</span>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:9}}>
        {lines.map((l,i) => (
          <div key={i} style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:12}}>
            <span style={{fontSize:11, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--fg-muted)'}}>{l.label}</span>
            <span style={{fontFamily:'var(--font-mono)', fontSize:13, color:'var(--fg-primary)', fontWeight:500}}>{l.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HQCard() {
  return (
    <div style={{background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-md)', overflow:'hidden'}}>
      <div style={{aspectRatio:'5/3', background:'#EBEFF1', position:'relative', overflow:'hidden'}}>
        <svg viewBox="0 0 200 120" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
          <rect width="200" height="120" fill="#EBEFF1"/>
          {/* roads */}
          <path d="M0 70 Q60 50 110 60 T200 50" stroke="#D5DBDE" strokeWidth="3" fill="none"/>
          <path d="M0 30 L80 40 L110 60 L150 30 L200 25" stroke="#D5DBDE" strokeWidth="2" fill="none"/>
          <path d="M50 0 L60 50 L40 120" stroke="#D5DBDE" strokeWidth="2" fill="none"/>
          <path d="M150 0 L130 60 L160 120" stroke="#D5DBDE" strokeWidth="2" fill="none"/>
          {/* blocks */}
          <rect x="20" y="80" width="20" height="20" fill="#FFFFFF" stroke="#D5DBDE"/>
          <rect x="70" y="80" width="20" height="25" fill="#FFFFFF" stroke="#D5DBDE"/>
          <rect x="120" y="75" width="20" height="20" fill="#FFFFFF" stroke="#D5DBDE"/>
          <rect x="170" y="80" width="20" height="20" fill="#FFFFFF" stroke="#D5DBDE"/>
          <rect x="20" y="10" width="20" height="15" fill="#FFFFFF" stroke="#D5DBDE"/>
          <rect x="100" y="15" width="20" height="15" fill="#FFFFFF" stroke="#D5DBDE"/>
          {/* Pin */}
          <circle cx="110" cy="60" r="14" fill="#0A4D68" opacity="0.15"/>
          <circle cx="110" cy="60" r="8" fill="#0A4D68"/>
          <circle cx="110" cy="60" r="3" fill="#25D366"/>
        </svg>
        <div style={{position:'absolute', top:14, right:14, background:'var(--bg-surface)', padding:'5px 10px', borderRadius:'var(--radius-xs)', fontSize:11, fontFamily:'var(--font-mono)', boxShadow:'var(--shadow-card)'}}>
          45.612° N, 8.851° E
        </div>
      </div>
      <div style={{padding:'20px 24px 22px'}}>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
          <CVIcon name="map-pin" size={16} color="var(--color-teal-500)"/>
          <span style={{fontFamily:'var(--font-display)', fontWeight:400, fontSize:16, letterSpacing:'-0.02em'}}>Sede operativa</span>
        </div>
        <div style={{fontSize:13, color:'var(--fg-secondary)', lineHeight:1.6}}>
          <b style={{color:'var(--fg-primary)', fontWeight:600}}>CleanVillage Srl</b><br/>
          Via dell'Industria 24<br/>
          21052 Busto Arsizio (VA) · Italia
        </div>
        <a href="#" onClick={(e)=>e.preventDefault()} style={{display:'inline-flex', alignItems:'center', gap:5, marginTop:14, color:'var(--color-mint-700)', fontSize:13, fontWeight:600, textDecoration:'none'}}>
          Indicazioni stradali <CVIcon name="external-link" size={12}/>
        </a>
      </div>
    </div>
  );
}

function ContactSuccess({ onReset, onNav }) {
  return (
    <main style={{minHeight:'70vh', display:'grid', placeItems:'center', padding:'72px 32px', background:'var(--bg-page)'}}>
      <div style={{maxWidth:540, textAlign:'center', background:'var(--bg-surface)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-lg)', padding:'48px 48px 44px', boxShadow:'var(--shadow-card)'}}>
        <div style={{width:72, height:72, borderRadius:'50%', background:'var(--color-mint-50)', color:'var(--color-mint-700)', display:'grid', placeItems:'center', margin:'0 auto 24px'}}>
          <CVIcon name="check" size={32} strokeWidth={2}/>
        </div>
        <h2 style={{fontFamily:'var(--font-display)', fontWeight:300, fontSize:36, letterSpacing:'-0.035em', margin:'0 0 14px'}}>
          Richiesta ricevuta.
        </h2>
        <p style={{fontSize:15, color:'var(--fg-secondary)', lineHeight:1.6, margin:'0 0 24px'}}>
          Un trade rep risponderà entro 1 giorno lavorativo con disponibilità di stock, prezzo a scaglioni e finestra di consegna confermata.
        </p>
        <div style={{display:'inline-block', padding:'10px 16px', background:'var(--color-ice-50)', border:'1px solid var(--border-subtle)', borderRadius:'var(--radius-sm)', marginBottom:32}}>
          <span style={{fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--fg-muted)', fontWeight:600, marginRight:10}}>Riferimento</span>
          <code style={{fontFamily:'var(--font-mono)', fontSize:13, color:'var(--color-teal-500)', fontWeight:600}}>CV-2026-04472</code>
        </div>
        <div style={{display:'flex', gap:12, justifyContent:'center'}}>
          <CVButton variant="primary" onClick={() => onNav('catalog')}>Continua a sfogliare</CVButton>
          <CVButton variant="ghost" onClick={onReset}>Invia un'altra richiesta</CVButton>
        </div>
      </div>
    </main>
  );
}

Object.assign(window, { ContactPage });
