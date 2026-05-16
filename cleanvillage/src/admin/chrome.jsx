import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { useAuth } from '../lib/auth.jsx';
import { isSupabaseConfigured } from '../lib/supabase.js';

/* ============================================================
   ICON helper
   ============================================================ */
function toPascalCase(str) {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

export function AdminIcon({ name, size = 16, color, strokeWidth = 1.75, style }) {
  const iconName = toPascalCase(name);
  const LucideIcon = Icons[iconName];
  if (!LucideIcon) return null;
  return (
    <span style={{ display: 'inline-flex', color: color || 'currentColor', ...style }} aria-hidden="true">
      <LucideIcon size={size} strokeWidth={strokeWidth} />
    </span>
  );
}

/* ============================================================
   ADMIN SHELL
   ============================================================ */
export function AdminShell({ page, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '248px 1fr', minHeight: '100vh', background: 'var(--bg-page)' }}>
      <AdminSidebar page={page} />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        <AdminTopBar page={page} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ page }) {
  const navigate = useNavigate();
  const groups = [
    {
      label: 'Generale', items: [
        { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard', path: '/admin' },
        { id: 'orders', icon: 'shopping-bag', label: 'Ordini & RDA', badge: 12, path: '/admin/orders' },
        { id: 'quotes', icon: 'file-text', label: 'Preventivi', badge: 4, path: '/admin/quotes' },
      ]
    },
    {
      label: 'Catalogo', items: [
        { id: 'products', icon: 'package', label: 'Prodotti', count: 571, path: '/admin/products' },
        { id: 'categories', icon: 'folder-tree', label: 'Categorie', count: 11, path: '/admin/categories' },
        { id: 'brands', icon: 'tag', label: 'Marchi', count: 24, path: '/admin/brands' },
        { id: 'pricing', icon: 'percent', label: 'Listini & sconti', path: '/admin/pricing' },
      ]
    },
    {
      label: 'Contenuti landing', items: [
        { id: 'videos', icon: 'video', label: 'Video', path: '/admin/videos' },
        { id: 'highlights', icon: 'star', label: 'Macchine in evidenza', path: '/admin/highlights' },
        { id: 'promos', icon: 'megaphone', label: 'Promozioni', path: '/admin/promos' },
        { id: 'courses', icon: 'graduation-cap', label: 'Corsi & formazione', path: '/admin/courses' },
      ]
    },
    {
      label: 'Amministrazione', items: [
        { id: 'users', icon: 'users', label: 'Buyer trade', path: '/admin/users' },
        { id: 'settings', icon: 'settings', label: 'Impostazioni', path: '/admin/settings' },
      ]
    },
  ];

  return (
    <aside style={{ background: 'var(--color-teal-500)', color: 'var(--color-white)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
      {/* Logo block */}
      <div style={{ padding: '22px 22px 22px', borderBottom: '1px solid var(--color-teal-700)' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <svg width="130" height="26" viewBox="0 0 130 26" fill="none">
            <text x="0" y="20" fontFamily="Outfit, sans-serif" fontWeight="300" fontSize="20" fill="white" letterSpacing="-0.03em">CleanVillage</text>
          </svg>
        </Link>
        <div style={{ marginTop: 6, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-300)', fontWeight: 600 }}>Console interna · v2.4</div>
      </div>
      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '18px 12px 24px' }}>
        {groups.map(g => (
          <div key={g.label} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-mint-300)', padding: '4px 10px 10px', opacity: 0.85 }}>{g.label}</div>
            {g.items.map(it => {
              const active = it.id === page;
              return (
                <a key={it.id} href="#" onClick={(e) => { e.preventDefault(); navigate(it.path); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '8px 10px', borderRadius: 'var(--radius-sm)',
                    color: active ? 'var(--color-teal-500)' : 'var(--color-teal-100)',
                    background: active ? 'var(--color-white)' : 'transparent',
                    textDecoration: 'none', fontSize: 13, fontWeight: active ? 600 : 500,
                    marginBottom: 1, position: 'relative',
                  }}>
                  <AdminIcon name={it.icon} size={15} />
                  <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.label}</span>
                  {it.badge != null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 999, background: active ? 'var(--color-mint-500)' : 'rgba(255,255,255,0.18)', color: 'var(--color-white)' }}>{it.badge}</span>
                  )}
                  {it.count != null && it.badge == null && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: active ? 'var(--fg-muted)' : 'rgba(198,222,229,0.7)' }}>{it.count}</span>
                  )}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
      <SidebarUserCard />
    </aside>
  );
}

function SidebarUserCard() {
  const { user, signOut } = useAuth();
  const email = user?.email || 'demo@cleanvillage.it';
  const initials = (email[0] + (email.split('@')[0].split('.')[1]?.[0] || email[1] || '')).toUpperCase();
  const label = user?.email?.split('@')[0] || 'Modalità demo';
  const role = isSupabaseConfigured ? (user ? 'Admin · loggato' : 'Demo · non loggato') : 'Demo · senza DB';
  return (
    <div style={{ padding: '14px 14px', borderTop: '1px solid var(--color-teal-700)', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--color-mint-500)', color: 'var(--color-white)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, flexShrink: 0 }}>{initials}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--color-teal-100)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{role}</div>
      </div>
      {user && (
        <button onClick={signOut} title="Esci" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: 6 }}>
          <AdminIcon name="log-out" size={14} color="var(--color-teal-100)" />
        </button>
      )}
    </div>
  );
}

function AdminTopBar({ page }) {
  const navigate = useNavigate();
  const titles = {
    dashboard: 'Dashboard', products: 'Catalogo prodotti', videos: 'Video landing',
    categories: 'Categorie', brands: 'Marchi', pricing: 'Listini & sconti',
    orders: 'Ordini & RDA', quotes: 'Preventivi', courses: 'Corsi & formazione',
    promos: 'Promozioni', highlights: 'Macchine in evidenza',
    users: 'Buyer trade', settings: 'Impostazioni',
  };
  return (
    <header style={{ height: 62, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '0 28px', display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0, position: 'sticky', top: 0, zIndex: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>
        <span>cleanvillage.it</span>
        <AdminIcon name="chevron-right" size={11} />
        <span>admin</span>
        <AdminIcon name="chevron-right" size={11} />
        <span style={{ color: 'var(--fg-primary)', fontWeight: 600 }}>{titles[page] || page}</span>
      </div>
      <span style={{ flex: 1 }} />
      <div style={{ position: 'relative', width: 320 }}>
        <AdminIcon name="search" size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--fg-muted)' }} />
        <input placeholder="Cerca prodotti, ordini, buyer, codici…"
          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px 8px 34px', fontFamily: 'var(--font-body)', fontSize: 13, background: 'var(--color-ice-50)', border: '1px solid transparent', borderRadius: 'var(--radius-sm)', outline: 'none', color: 'var(--fg-primary)' }} />
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', background: 'var(--bg-surface)', padding: '1px 5px', border: '1px solid var(--border-subtle)', borderRadius: 3 }}>⌘K</span>
      </div>
      <button style={{ position: 'relative', width: 36, height: 36, border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
        <AdminIcon name="bell" size={15} color="var(--fg-secondary)" />
        <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-mint-500)', boxShadow: '0 0 0 2px var(--bg-surface)' }} />
      </button>
      <a href="/" target="_blank" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', fontSize: 12, fontWeight: 600, color: 'var(--color-teal-500)', textDecoration: 'none', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)' }}>
        <AdminIcon name="external-link" size={12} /> Vedi sito live
      </a>
    </header>
  );
}

/* ============================================================
   PAGE WRAPPER
   ============================================================ */
export function AdminPage({ eyebrow, title, subtitle, actions, children }) {
  return (
    <div style={{ padding: '32px 36px 40px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
        <div>
          {eyebrow && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mint-700)', marginBottom: 8 }}>{eyebrow}</div>}
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 36, letterSpacing: '-0.035em', margin: 0, lineHeight: 1.06, color: 'var(--fg-primary)' }}>{title}</h1>
          {subtitle && <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--fg-secondary)', lineHeight: 1.5, maxWidth: '70ch' }}>{subtitle}</p>}
        </div>
        {actions && <div style={{ display: 'flex', gap: 10 }}>{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   BUTTONS, BADGES, PANELS
   ============================================================ */
export function ABtn({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, type = 'button', disabled }) {
  const [hover, setHover] = useState(false);
  const base = { fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: size === 'sm' ? 12 : 13, padding: size === 'sm' ? '6px 12px' : '9px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid transparent', display: 'inline-flex', alignItems: 'center', gap: 7, cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'all var(--motion-fast)' };
  const variants = {
    primary: { background: hover ? 'var(--color-teal-700)' : 'var(--color-teal-500)', color: 'var(--color-white)', borderColor: 'transparent' },
    cta: { background: hover ? 'var(--color-mint-600)' : 'var(--color-mint-500)', color: 'var(--color-white)', borderColor: 'transparent', boxShadow: 'var(--shadow-cta)' },
    secondary: { background: 'var(--bg-surface)', color: 'var(--fg-primary)', borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)' },
    ghost: { background: hover ? 'var(--color-ice-50)' : 'transparent', color: 'var(--fg-secondary)', borderColor: 'transparent' },
    danger: { background: 'var(--bg-surface)', color: 'var(--color-danger-500)', borderColor: hover ? 'var(--color-danger-500)' : 'var(--border-default)' },
  };
  if (disabled) { variants.primary.opacity = 0.5; variants.cta.opacity = 0.5; }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant] }}>
      {icon}{children}{iconRight}
    </button>
  );
}

export function Badge({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: 'var(--color-ice-100)', fg: 'var(--fg-secondary)', dot: 'var(--color-ice-500)' },
    mint: { bg: 'var(--color-mint-50)', fg: 'var(--color-mint-800)', dot: 'var(--color-mint-500)' },
    teal: { bg: 'var(--color-teal-50)', fg: 'var(--color-teal-700)', dot: 'var(--color-teal-500)' },
    amber: { bg: 'var(--color-warning-100)', fg: 'var(--color-warning-500)', dot: 'var(--color-warning-500)' },
    danger: { bg: 'var(--color-danger-100)', fg: 'var(--color-danger-500)', dot: 'var(--color-danger-500)' },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px', borderRadius: 999, background: t.bg, color: t.fg, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.dot }} />
      {children}
    </span>
  );
}

export function Panel({ title, action, children, padding = '22px 24px' }) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
          {title && <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 15, letterSpacing: '-0.01em', color: 'var(--fg-primary)' }}>{title}</span>}
          {action}
        </div>
      )}
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

/* ============================================================
   MODAL
   ============================================================ */
export function Modal({ open, onClose, title, width = 720, children, footer }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,35,48,0.55)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 50, padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: width, maxHeight: '90vh', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-pop)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 26px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: 18, letterSpacing: '-0.02em' }}>{title}</span>
          <button onClick={onClose} style={{ width: 32, height: 32, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)', display: 'grid', placeItems: 'center' }}>
            <AdminIcon name="x" size={18} />
          </button>
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 26px' }}>{children}</div>
        {footer && <footer style={{ padding: '14px 26px', borderTop: '1px solid var(--border-subtle)', background: 'var(--color-ice-50)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>{footer}</footer>}
      </div>
    </div>
  );
}

/* ============================================================
   FORM PRIMITIVES
   ============================================================ */
export const adminInputStyle = {
  fontFamily: 'var(--font-body)', fontSize: 13,
  padding: '9px 12px', background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
  color: 'var(--fg-primary)', outline: 'none', width: '100%', boxSizing: 'border-box',
  transition: 'border-color var(--motion-fast), box-shadow var(--motion-fast)',
};

export function AField({ label, required, hint, span = 1, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: `span ${span}` }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-secondary)' }}>{label}{required && <span style={{ color: 'var(--color-mint-700)', marginLeft: 3 }}>*</span>}</span>
      {children}
      {hint && <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{hint}</span>}
    </label>
  );
}
export function AInput(p) { return <input {...p} style={{ ...adminInputStyle, ...(p.style || {}) }} />; }
export function ATextarea(p) { return <textarea rows={3} {...p} style={{ ...adminInputStyle, resize: 'vertical', minHeight: 80, ...(p.style || {}) }} />; }
export function ASelect(p) { return <select {...p} style={{ ...adminInputStyle, ...(p.style || {}) }}>{p.children}</select>; }

/* ============================================================
   DATA TABLE
   ============================================================ */
export function DataTable({ columns, rows, onRowClick, empty }) {
  if (!rows.length) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--fg-muted)' }}>
        <AdminIcon name="inbox" size={32} />
        <div style={{ marginTop: 14, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--fg-primary)' }}>{empty || 'Nessun risultato'}</div>
      </div>
    );
  }
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 13 }}>
      <thead>
        <tr style={{ background: 'var(--color-ice-50)', borderBottom: '1px solid var(--border-subtle)' }}>
          {columns.map(c => (
            <th key={c.key} style={{ textAlign: c.align || 'left', padding: '10px 16px', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', width: c.width }}>{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id || i} onClick={() => onRowClick && onRowClick(row)}
            style={{ borderBottom: '1px solid var(--border-subtle)', cursor: onRowClick ? 'pointer' : 'default', transition: 'background var(--motion-fast)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-ice-50)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {columns.map(c => (
              <td key={c.key} style={{ padding: '12px 16px', textAlign: c.align || 'left', color: 'var(--fg-primary)', verticalAlign: 'middle' }}>
                {c.render ? c.render(row) : row[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
