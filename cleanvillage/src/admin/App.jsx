import { Routes, Route, useLocation } from 'react-router-dom';
import { AdminShell } from './chrome.jsx';
import AdminDashboard from './Dashboard.jsx';
import AdminProducts from './Products.jsx';
import AdminVideos from './Videos.jsx';
import AdminCategories from './Categories.jsx';
import AdminBrands from './Brands.jsx';
import AdminQuotes from './Quotes.jsx';
import AdminHighlights from './Highlights.jsx';
import Placeholder from './Placeholder.jsx';
import AdminLogin from './Login.jsx';
import { useAuth } from '../lib/auth.jsx';
import { isSupabaseConfigured } from '../lib/supabase.js';

function getPage(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return 'dashboard';
  return segments[1] || 'dashboard';
}

export default function AdminApp() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const page = getPage(location.pathname);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)',
      }}>Caricamento sessione…</div>
    );
  }

  // In demo mode (Supabase not configured) allow access without login so the UI is still navigable.
  const allowAccess = isAuthenticated || !isSupabaseConfigured;
  if (!allowAccess) return <AdminLogin />;

  return (
    <AdminShell page={page}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/videos" element={<AdminVideos />} />
        <Route path="/categories" element={<AdminCategories />} />
        <Route path="/brands" element={<AdminBrands />} />
        <Route path="/quotes" element={<AdminQuotes />} />
        <Route path="/highlights" element={<AdminHighlights />} />
        <Route path="/:section" element={<PlaceholderRoute />} />
      </Routes>
    </AdminShell>
  );
}

function PlaceholderRoute() {
  const location = useLocation();
  const page = getPage(location.pathname);
  return <Placeholder page={page} />;
}
