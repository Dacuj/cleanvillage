import LegalPage from '../components/LegalPage.jsx';

// Thin route wrapper so each route can render the same LegalPage with a slug.
export default function LegalRoute({ slug }) {
  return <LegalPage slug={slug} />;
}
