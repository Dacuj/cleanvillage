import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TweaksContext, TweaksPanel, useTweaks, TweakSection, TweakSelect, TweakRadio, TweakToggle } from './components/TweaksPanel.jsx';
import { Header, Footer } from './components/layout.jsx';
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Contact from './pages/Contact.jsx';
import AdminApp from './admin/App.jsx';

const TWEAK_DEFAULTS = {
  heroAccent: 'mint',
  categoryStyle: 'magazine',
  density: 'airy',
  showMarquee: true,
  headlineTone: 'human',
};

function StorefrontLayout({ tweaks, setTweak }) {
  // Apply accent color tweak via CSS vars
  const accentStyles = useMemo(() => {
    if (tweaks.heroAccent === 'amber') return {
      '--cta-bg': '#E08A2A', '--cta-bg-hover': '#C97A0C', '--cta-bg-press': '#A86407',
      '--color-mint-500': '#E08A2A', '--color-mint-600': '#C97A0C', '--color-mint-700': '#A86407',
      '--color-mint-300': '#F0B673', '--color-mint-100': '#FBE2C0', '--color-mint-50': '#FDF3E4', '--color-mint-800': '#7A4504',
      '--shadow-cta': '0 4px 14px rgba(224,138,42,0.32)',
    };
    if (tweaks.heroAccent === 'electric') return {
      '--cta-bg': '#0066FF', '--cta-bg-hover': '#0052CC', '--cta-bg-press': '#003D99',
      '--color-mint-500': '#0066FF', '--color-mint-600': '#0052CC', '--color-mint-700': '#003D99',
      '--color-mint-300': '#66A3FF', '--color-mint-100': '#CCDFFF', '--color-mint-50': '#E6EFFF', '--color-mint-800': '#002966',
      '--shadow-cta': '0 4px 14px rgba(0,102,255,0.32)',
    };
    return {};
  }, [tweaks.heroAccent]);

  return (
    <div style={accentStyles} data-density={tweaks.density}>
      <Header />
      <Routes>
        <Route path="/" element={<Landing tweaks={tweaks} />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <TweaksPanel title="Tweaks · Variazioni">
        <TweakSection label="Hero & accento" />
        <TweakSelect
          label="Accento CTA"
          value={tweaks.heroAccent}
          options={[
            { value: 'mint', label: 'Mint (default brand)' },
            { value: 'amber', label: 'Amber industriale' },
            { value: 'electric', label: 'Blu elettrico' },
          ]}
          onChange={v => setTweak('heroAccent', v)}
        />
        <TweakRadio
          label="Tono"
          value={tweaks.headlineTone}
          options={[
            { value: 'human', label: 'Umano' },
            { value: 'technical', label: 'Tecnico' },
          ]}
          onChange={v => setTweak('headlineTone', v)}
        />
        <TweakSection label="Layout" />
        <TweakSelect
          label="Categorie"
          value={tweaks.categoryStyle}
          options={[
            { value: 'magazine', label: 'Magazine (1 grande + griglia)' },
            { value: 'grid', label: 'Griglia uniforme' },
            { value: 'list', label: 'Lista compatta' },
          ]}
          onChange={v => setTweak('categoryStyle', v)}
        />
        <TweakRadio
          label="Densità"
          value={tweaks.density}
          options={[
            { value: 'airy', label: 'Arioso' },
            { value: 'compact', label: 'Compatto' },
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

export default function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <TweaksContext.Provider value={{ tweaks, setTweak }}>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<StorefrontLayout tweaks={tweaks} setTweak={setTweak} />} />
      </Routes>
    </TweaksContext.Provider>
  );
}
