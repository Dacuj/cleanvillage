import { useState } from 'react';
import * as Icons from 'lucide-react';

function toPascalCase(kebab) {
  return kebab.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

export function Icon({ name, size = 18, color, strokeWidth = 1.75, style }) {
  const iconName = toPascalCase(name);
  const LucideIcon = Icons[iconName];
  if (!LucideIcon) return null;
  return (
    <span style={{ display: 'inline-flex', color: color || 'currentColor', ...style }} aria-hidden="true">
      <LucideIcon size={size} strokeWidth={strokeWidth} />
    </span>
  );
}

export function Logo({ size = 'md', inverse = false }) {
  const h = size === 'sm' ? 22 : size === 'lg' ? 36 : 28;
  const fg = inverse ? 'var(--color-white)' : 'var(--color-teal-500)';
  const fg2 = inverse ? 'var(--color-mint-300)' : 'var(--color-mint-500)';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: h * 0.25, lineHeight: 1 }}>
      <svg width={h * 1.1} height={h} viewBox="0 0 44 40" fill="none" aria-hidden>
        <path d="M8 22 C 8 12, 16 6, 26 8 C 34 9.5, 38 14, 38 14" stroke={fg} strokeWidth="2.6" strokeLinecap="round" />
        <path d="M14 26 L20 32 L36 14" stroke={fg2} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: h * 0.8, letterSpacing: '-0.02em', color: fg }}>
        Clean<span style={{ fontWeight: 700, color: fg2 }}>village</span>
      </span>
    </div>
  );
}

// Apple-style pill buttons: blue filled CTA, graphite primary, hairline
// secondary, text-only ghost. Subtle press scale on every variant.
export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, type = 'button', as = 'button', href, full }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 26px' : '11px 21px',
    borderRadius: 'var(--radius-pill)',
    border: '1px solid transparent',
    display: full ? 'flex' : 'inline-flex',
    width: full ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    cursor: 'pointer',
    transition: 'background var(--motion-fast), border-color var(--motion-fast), box-shadow var(--motion-fast), transform var(--motion-fast), color var(--motion-fast)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transform: press ? 'scale(0.97)' : hover ? 'scale(1.015)' : 'scale(1)',
  };
  const variants = {
    cta: {
      background: hover ? 'var(--cta-bg-hover)' : 'var(--cta-bg)',
      color: 'var(--cta-fg)', borderColor: 'transparent',
      boxShadow: hover ? 'var(--shadow-cta)' : '0 2px 10px rgba(0,113,227,0.22)',
    },
    primary: {
      background: hover ? 'var(--color-teal-700)' : 'var(--color-teal-500)',
      color: 'var(--color-white)', borderColor: 'transparent',
    },
    secondary: {
      background: hover ? 'var(--color-ice-50)' : 'var(--bg-surface)',
      color: 'var(--fg-primary)',
      borderColor: hover ? 'var(--border-strong)' : 'var(--border-default)',
    },
    'inverse-secondary': {
      background: hover ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: 'var(--color-white)',
      borderColor: hover ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
    },
    ghost: {
      background: 'transparent',
      color: hover ? 'var(--color-mint-700)' : 'var(--color-mint-500)',
      borderColor: 'transparent',
      padding: size === 'sm' ? '4px 6px' : '6px 6px',
      fontWeight: 500,
    },
    'inverse-ghost': {
      background: hover ? 'rgba(255,255,255,0.1)' : 'transparent',
      color: 'var(--color-white)', borderColor: 'transparent', fontWeight: 500,
    },
  };
  const Tag = as === 'a' ? 'a' : 'button';
  return (
    <Tag type={Tag === 'button' ? type : undefined} href={href} onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{ ...base, ...variants[variant] }}>
      {icon}{children}{iconRight}
    </Tag>
  );
}

// Legacy colored strip — removed in the minimal redesign. Kept as a no-op
// so existing call sites don't break.
export function TrustBar() {
  return null;
}

export function Eyebrow({ children, color, dark }) {
  return (
    <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: color || (dark ? 'var(--color-mint-300)' : 'var(--color-mint-700)'), display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {children}
    </div>
  );
}

export function Spec({ children, dark }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
      padding: '3px 8px',
      background: dark ? 'rgba(255,255,255,0.1)' : 'var(--bg-surface-alt)',
      border: dark ? '1px solid rgba(255,255,255,0.16)' : 'none',
      borderRadius: 'var(--radius-xs)',
      color: dark ? 'var(--color-white)' : 'var(--fg-primary)',
    }}>{children}</span>
  );
}

export function StockPill({ status = 'in', count }) {
  const map = {
    in: { bg: 'var(--color-success-100)', fg: 'var(--color-success-500)', dot: 'var(--color-success-500)', label: count != null ? `Disponibile · ${count}` : 'Disponibile' },
    low: { bg: 'var(--color-warning-100)', fg: 'var(--color-warning-500)', dot: 'var(--color-warning-500)', label: count != null ? `Ultimi ${count} pz` : 'Scorte limitate' },
    out: { bg: 'var(--color-danger-100)', fg: 'var(--color-danger-500)', dot: 'var(--color-danger-500)', label: 'Su ordinazione' },
  };
  const c = map[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 11, padding: '4px 10px', borderRadius: 999, background: c.bg, color: c.fg, whiteSpace: 'nowrap' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.dot }} />
      {c.label}
    </span>
  );
}
