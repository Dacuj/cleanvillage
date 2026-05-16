import { AdminPage, AdminIcon } from './chrome.jsx';

const PAGE_LABELS = {
  orders: 'Ordini & RDA',
  quotes: 'Preventivi',
  categories: 'Categorie',
  brands: 'Marchi',
  pricing: 'Listini & sconti',
  highlights: 'Macchine in evidenza',
  promos: 'Promozioni',
  courses: 'Corsi & formazione',
  users: 'Buyer trade',
  settings: 'Impostazioni',
};

export default function Placeholder({ page }) {
  const label = PAGE_LABELS[page] || page;
  return (
    <AdminPage
      eyebrow="Console interna"
      title={label}
      subtitle="Questa sezione è in costruzione."
    >
      <div style={{
        padding: '80px 24px', textAlign: 'center',
        background: 'var(--bg-surface)', border: '1px dashed var(--border-default)',
        borderRadius: 'var(--radius-md)', marginTop: 8,
      }}>
        <AdminIcon name="construction" size={36} color="var(--fg-muted)" />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 300, color: 'var(--fg-primary)', marginTop: 16, letterSpacing: '-0.02em' }}>In costruzione</div>
        <div style={{ fontSize: 14, color: 'var(--fg-muted)', marginTop: 8, maxWidth: 400, margin: '8px auto 0' }}>
          La sezione <b>{label}</b> sarà disponibile nella prossima release.
        </div>
      </div>
    </AdminPage>
  );
}
