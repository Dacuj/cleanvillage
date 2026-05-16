import { Routes, Route, useLocation } from 'react-router-dom';
import { AdminShell } from './chrome.jsx';
import AdminDashboard from './Dashboard.jsx';
import AdminProducts from './Products.jsx';
import AdminVideos from './Videos.jsx';
import Placeholder from './Placeholder.jsx';

function getPage(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  // /admin -> dashboard, /admin/products -> products, etc.
  if (segments.length <= 1) return 'dashboard';
  return segments[1] || 'dashboard';
}

export default function AdminApp() {
  const location = useLocation();
  const page = getPage(location.pathname);

  return (
    <AdminShell page={page}>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/products" element={<AdminProducts />} />
        <Route path="/videos" element={<AdminVideos />} />
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
