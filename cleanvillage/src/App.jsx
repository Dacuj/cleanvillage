import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout.jsx';
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import MachineFinder from './pages/MachineFinder.jsx';
import LegalRoute from './pages/LegalRoute.jsx';

// The admin console is code-split: visitors never download it.
const AdminApp = lazy(() => import('./admin/App.jsx'));

function AdminFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-page)' }}>
      <div className="cv-anim-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, color: 'var(--fg-muted)' }}>
        <span className="cv-anim-spin" style={{ width: 28, height: 28, border: '3px solid var(--color-ice-200)', borderTopColor: 'var(--color-mint-500)', borderRadius: '50%' }} />
        <span style={{ fontSize: 13 }}>Carico il pannello…</span>
      </div>
    </div>
  );
}

function StorefrontLayout() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/azienda" element={<About />} />
        <Route path="/servizi" element={<Services />} />
        <Route path="/scopri-macchina" element={<MachineFinder />} />
        <Route path="/condizioni-vendita" element={<LegalRoute slug="salesTerms" />} />
        <Route path="/garanzia" element={<LegalRoute slug="warranty" />} />
        <Route path="/privacy" element={<LegalRoute slug="privacy" />} />
        <Route path="/cookie" element={<LegalRoute slug="cookie" />} />
        <Route path="/termini" element={<LegalRoute slug="terms" />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Suspense fallback={<AdminFallback />}><AdminApp /></Suspense>} />
      <Route path="/*" element={<StorefrontLayout />} />
    </Routes>
  );
}
