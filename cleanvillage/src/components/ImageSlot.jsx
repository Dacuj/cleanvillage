import { Icon } from './ui.jsx';
import { useSiteContent, resolveImageSlot } from '../lib/siteContent.js';

// Read-only image slot for the public site.
// Resolves an image from site_content (Supabase JSONB) with a localStorage
// fallback for the legacy data-URI format. Upload happens exclusively from
// /admin/landing so visitors never see drag-and-drop hints.
export function ImageSlot({ id, placeholder, children, style }) {
  const content = useSiteContent();
  const image = resolveImageSlot(content, id);

  if (!image) {
    // Hide entirely when no image: the underlying decorative SVG (sibling)
    // remains visible and unobstructed.
    return children
      ? <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>{children}</div>
      : null;
  }

  return (
    <div style={{ position: 'absolute', inset: 0, ...style }}>
      <img
        src={image.url}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {children}
    </div>
  );
}
