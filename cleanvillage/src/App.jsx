import { Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/layout.jsx';
import Landing from './pages/Landing.jsx';
import Catalog from './pages/Catalog.jsx';
import Product from './pages/Product.jsx';
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Services from './pages/Services.jsx';
import VideoPage from './pages/VideoPage.jsx';
import LegalRoute from './pages/LegalRoute.jsx';
import AdminApp from './admin/App.jsx';

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
        <Route path="/video-aziendale" element={<VideoPage />} />
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
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="/*" element={<StorefrontLayout />} />
    </Routes>
  );
}
