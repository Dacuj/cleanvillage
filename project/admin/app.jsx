/* Admin · Routing + placeholder pages for sections we haven't built out */

function AdminApp() {
  const parseHash = () => {
    const h = (window.location.hash || '').replace('#', '');
    const pages = ['dashboard','products','videos','categories','brands','pricing','orders','quotes','courses','promos','highlights','users','settings'];
    return pages.includes(h) ? h : 'dashboard';
  };
  const [page, setPage] = useState(parseHash);

  const onNav = (next) => {
    setPage(next);
    window.location.hash = next;
    window.scrollTo({top:0, behavior:'instant'});
  };

  useEffect(() => {
    const onHash = () => setPage(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => { if (window.lucide) window.lucide.createIcons(); });

  let body;
  if (page === 'dashboard') body = <AdminDashboard onNav={onNav}/>;
  else if (page === 'products') body = <AdminProducts onNav={onNav}/>;
  else if (page === 'videos')   body = <AdminVideos onNav={onNav}/>;
  else                          body = <AdminPlaceholder page={page}/>;

  return <AdminShell page={page} onNav={onNav}>{body}</AdminShell>;
}

function AdminPlaceholder({ page }) {
  const map = {
    categories: { eyebrow:'Catalogo', title:'Categorie',           hint:'Gestione delle 11 categorie del catalogo (rinomina, riordina, icona).' },
    brands:     { eyebrow:'Catalogo', title:'Marchi',              hint:'24 marchi distribuiti — listini, contratti, dossier di rivenditore.' },
    pricing:    { eyebrow:'Catalogo', title:'Listini & sconti',    hint:'Sconti a scaglioni, listini riservati per buyer trade, condizioni di pagamento.' },
    orders:     { eyebrow:'Operatività', title:'Ordini & RDA',     hint:'Ordini in arrivo dal sito, RDA dai buyer trade, stato di evasione e logistica.' },
    quotes:     { eyebrow:'Operatività', title:'Preventivi',       hint:'Pipeline preventivi inviati dal modulo Contatti, follow-up, conversione.' },
    courses:    { eyebrow:'Contenuti', title:'Corsi & formazione', hint:'Calendario corsi Accademia CleanVillage, iscrizioni, materiali, attestati.' },
    promos:     { eyebrow:'Contenuti', title:'Promozioni',         hint:'Banner promo della homepage, codici sconto, finestre temporali.' },
    highlights: { eyebrow:'Contenuti', title:'Macchine in evidenza', hint:'Le 3 macchine in primo piano sulla landing — immagini, copy, ordine.' },
    users:      { eyebrow:'Amministrazione', title:'Buyer trade',  hint:'Aziende registrate, validazione P.IVA, fascia sconto, storico acquisti.' },
    settings:   { eyebrow:'Amministrazione', title:'Impostazioni', hint:'Dati anagrafici, logo, integrazioni, gestione utenti admin.' },
  };
  const p = map[page] || { title: page };
  return (
    <AdminPage eyebrow={p.eyebrow} title={p.title} subtitle={p.hint}>
      <div style={{padding:'72px 32px', textAlign:'center', background:'var(--bg-surface)', border:'1px dashed var(--border-strong)', borderRadius:'var(--radius-md)'}}>
        <AdminIcon name="construction" size={32} color="var(--fg-muted)"/>
        <div style={{fontFamily:'var(--font-display)', fontWeight:400, fontSize:20, letterSpacing:'-0.025em', marginTop:14}}>Sezione in arrivo</div>
        <div style={{fontSize:13, color:'var(--fg-muted)', marginTop:8, maxWidth:'52ch', margin:'8px auto 0', lineHeight:1.55}}>
          Questa pagina è un placeholder. Le sezioni completamente funzionanti in questa demo sono <b style={{color:'var(--fg-primary)'}}>Dashboard</b>, <b style={{color:'var(--fg-primary)'}}>Prodotti</b> e <b style={{color:'var(--fg-primary)'}}>Video</b>.
        </div>
      </div>
    </AdminPage>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp/>);
