/* CleanVillage redesign — App shell, routing, tweaks integration. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "heroAccent":  "mint",
  "categoryStyle": "magazine",
  "density":     "airy",
  "showMarquee": true,
  "headlineTone": "human"
}/*EDITMODE-END*/;

function App() {
  // Hash parses to "page" and optional "productId"
  const parseHash = () => {
    const h = (window.location.hash || '').replace('#', '');
    const [p, id] = h.split('/');
    const pages = ['landing','catalog','product','contact'];
    return {
      page: pages.includes(p) ? p : 'landing',
      productId: id || (window.CV_PRODUCTS && window.CV_PRODUCTS[0]?.id),
    };
  };
  const [route, setRoute] = useState(parseHash);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const onNav = (next, productId) => {
    let target = next;
    if (!['landing','catalog','product','contact'].includes(next)) target = 'landing';
    const hash = target === 'product' && productId ? `product/${productId}` : target;
    window.location.hash = hash;
    setRoute({ page: target, productId: productId || route.productId });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Re-create lucide icons after every render
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  });

  let body;
  if (route.page === 'catalog')      body = <CatalogPage onNav={onNav}/>;
  else if (route.page === 'product') body = <ProductPage onNav={onNav} productId={route.productId}/>;
  else if (route.page === 'contact') body = <ContactPage onNav={onNav}/>;
  else                                body = <LandingPage onNav={onNav} tweaks={tweaks}/>;

  // Apply accent color tweak via CSS vars
  const accentStyles = useMemo(() => {
    if (tweaks.heroAccent === 'amber') return {
      '--cta-bg': '#E08A2A', '--cta-bg-hover': '#C97A0C', '--cta-bg-press': '#A86407',
      '--color-mint-500': '#E08A2A', '--color-mint-600': '#C97A0C', '--color-mint-700': '#A86407',
      '--color-mint-300': '#F0B673', '--color-mint-100': '#FBE2C0', '--color-mint-50': '#FDF3E4', '--color-mint-800': '#7A4504',
      '--shadow-cta': '0 4px 14px rgba(224,138,42,0.32)',
      '--trust-bar': 'linear-gradient(90deg, #0A4D68 0%, #0A4D68 60%, #E08A2A 100%)',
    };
    if (tweaks.heroAccent === 'electric') return {
      '--cta-bg': '#0066FF', '--cta-bg-hover': '#0052CC', '--cta-bg-press': '#003D99',
      '--color-mint-500': '#0066FF', '--color-mint-600': '#0052CC', '--color-mint-700': '#003D99',
      '--color-mint-300': '#66A3FF', '--color-mint-100': '#CCDFFF', '--color-mint-50': '#E6EFFF', '--color-mint-800': '#002966',
      '--shadow-cta': '0 4px 14px rgba(0,102,255,0.32)',
      '--trust-bar': 'linear-gradient(90deg, #0A4D68 0%, #0A4D68 60%, #0066FF 100%)',
    };
    return {};
  }, [tweaks.heroAccent]);

  return (
    <div style={accentStyles} data-density={tweaks.density}>
      <CVHeader page={route.page} onNav={onNav} tweaks={tweaks}/>
      {body}
      <CVFooter/>
      <TweaksPanel title="Tweaks · Variazioni">
        <TweakSection label="Hero & accento"/>
        <TweakSelect
          label="Accento CTA"
          value={tweaks.heroAccent}
          options={[
            { value:'mint',     label:'Mint (default brand)' },
            { value:'amber',    label:'Amber industriale' },
            { value:'electric', label:'Blu elettrico' },
          ]}
          onChange={v => setTweak('heroAccent', v)}
        />
        <TweakRadio
          label="Tono"
          value={tweaks.headlineTone}
          options={[
            { value:'human',     label:'Umano' },
            { value:'technical', label:'Tecnico' },
          ]}
          onChange={v => setTweak('headlineTone', v)}
        />
        <TweakSection label="Layout"/>
        <TweakSelect
          label="Categorie"
          value={tweaks.categoryStyle}
          options={[
            { value:'magazine', label:'Magazine (1 grande + griglia)' },
            { value:'grid',     label:'Griglia uniforme' },
            { value:'list',     label:'Lista compatta' },
          ]}
          onChange={v => setTweak('categoryStyle', v)}
        />
        <TweakRadio
          label="Densità"
          value={tweaks.density}
          options={[
            { value:'airy',    label:'Arioso' },
            { value:'compact', label:'Compatto' },
          ]}
          onChange={v => setTweak('density', v)}
        />
        <TweakToggle
          label="Carousel marchi"
          value={tweaks.showMarquee}
          onChange={v => setTweak('showMarquee', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
