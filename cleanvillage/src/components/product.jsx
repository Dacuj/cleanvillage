import { useState } from 'react';
import { Icon, Spec, StockPill } from './ui.jsx';

export function ProductIllustration({ kind, hover }) {
  const wrap = { width: '68%', transition: 'transform var(--motion-base)', transform: hover ? 'scale(1.04)' : 'scale(1)' };
  const stroke = '#48484A';
  switch (kind) {
    case 'scrubber': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="28" y="40" width="120" height="58" rx="6" fill="#E8E8ED" />
        <rect x="44" y="22" width="64" height="22" rx="3" fill="#FFFFFF" />
        <path d="M44 22 L36 40 M108 22 L116 40" />
        <circle cx="62" cy="108" r="14" fill="#48484A" />
        <circle cx="62" cy="108" r="6" fill="#FFFFFF" />
        <circle cx="134" cy="108" r="14" fill="#48484A" />
        <circle cx="134" cy="108" r="6" fill="#FFFFFF" />
        <rect x="148" y="60" width="36" height="22" rx="3" fill="#D2D2D7" />
        <rect x="32" y="86" width="112" height="6" rx="2" fill="#3A3A3C" />
        <circle cx="70" cy="32" r="2" fill="#0071E3" />
      </svg>
    );
    case 'washer': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="44" y="48" width="80" height="68" rx="4" fill="#E8E8ED" />
        <rect x="56" y="60" width="56" height="22" rx="2" fill="#FFFFFF" />
        <circle cx="84" cy="72" r="6" fill="#D2D2D7" />
        <rect x="56" y="92" width="56" height="6" rx="2" fill="#3A3A3C" />
        <rect x="124" y="38" width="28" height="22" rx="3" fill="#D2D2D7" />
        <path d="M152 49 Q172 49 172 78 Q172 100 158 100" strokeWidth="1.8" />
        <circle cx="64" cy="120" r="5" fill="#48484A" />
        <circle cx="104" cy="120" r="5" fill="#48484A" />
        <rect x="76" y="38" width="16" height="4" fill="#0071E3" />
      </svg>
    );
    case 'detergent': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="68" y="32" width="64" height="92" rx="6" fill="#E8E8ED" />
        <rect x="82" y="22" width="36" height="14" rx="3" fill="#D2D2D7" />
        <rect x="76" y="56" width="48" height="32" rx="2" fill="#FFFFFF" />
        <path d="M82 66h36 M82 74h28 M82 82h32" strokeWidth="0.8" />
        <rect x="84" y="100" width="32" height="2" fill="#3A3A3C" />
      </svg>
    );
    case 'cart': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <path d="M40 36 L40 112 L160 112" />
        <rect x="56" y="44" width="40" height="44" rx="3" fill="#E8E8ED" />
        <rect x="104" y="56" width="48" height="32" rx="3" fill="#FFFFFF" />
        <circle cx="64" cy="124" r="6" fill="#48484A" />
        <circle cx="150" cy="124" r="6" fill="#48484A" />
        <rect x="116" y="40" width="30" height="14" rx="2" fill="#0071E3" opacity="0.4" />
      </svg>
    );
    case 'vacuum': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="60" y="44" width="80" height="68" rx="6" fill="#E8E8ED" />
        <circle cx="100" cy="60" r="14" fill="#0071E3" opacity="0.4" />
        <rect x="68" y="80" width="64" height="22" rx="3" fill="#FFFFFF" />
        <circle cx="76" cy="118" r="6" fill="#48484A" />
        <circle cx="124" cy="118" r="6" fill="#48484A" />
        <path d="M140 60 Q170 60 170 90 Q170 110 156 110" strokeWidth="1.6" />
      </svg>
    );
    case 'shoe': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <path d="M30 92 Q40 56 76 60 L100 64 L120 56 L160 70 Q180 80 178 96 L178 104 L36 104 Z" fill="#E8E8ED" />
        <path d="M70 78 L90 70 M104 76 L122 68 M138 80 L156 78" stroke="#3A3A3C" />
        <path d="M30 104 L178 104 L172 114 L36 114 Z" fill="#48484A" />
      </svg>
    );
    case 'pad': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <ellipse cx="100" cy="70" rx="58" ry="20" fill="#E8E8ED" />
        <ellipse cx="100" cy="70" rx="58" ry="20" />
        <ellipse cx="100" cy="70" rx="40" ry="14" fill="#FFFFFF" />
        <circle cx="100" cy="70" r="6" fill="#D2D2D7" />
      </svg>
    );
    case 'dryer': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="64" y="22" width="72" height="100" rx="8" fill="#E8E8ED" />
        <rect x="76" y="32" width="48" height="40" rx="4" fill="#FFFFFF" />
        <path d="M80 88 L120 88 M80 94 L116 94 M80 100 L112 100" strokeWidth="0.8" />
        <circle cx="100" cy="50" r="4" fill="#0071E3" />
      </svg>
    );
    case 'paper': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <circle cx="62" cy="72" r="34" fill="#E8E8ED" />
        <circle cx="62" cy="72" r="10" fill="#FFFFFF" />
        <circle cx="62" cy="72" r="6" fill="#D2D2D7" />
        <rect x="108" y="44" width="62" height="68" rx="3" fill="#FFFFFF" />
        <rect x="116" y="56" width="46" height="28" rx="2" fill="#E8E8ED" />
        <path d="M116 92 L162 92" strokeWidth="0.8" />
        <path d="M116 100 L150 100" strokeWidth="0.8" />
      </svg>
    );
    case 'spray': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="76" y="36" width="48" height="84" rx="4" fill="#E8E8ED" />
        <rect x="84" y="22" width="32" height="16" rx="3" fill="#D2D2D7" />
        <path d="M124 30 L150 26 L150 38 L124 34" fill="#FFFFFF" />
        <rect x="84" y="60" width="32" height="36" rx="2" fill="#FFFFFF" />
        <path d="M88 70h24 M88 78h20" strokeWidth="0.7" />
      </svg>
    );
    case 'glass': return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="36" y="32" width="128" height="76" rx="3" fill="#E8E8ED" opacity="0.5" />
        <rect x="36" y="32" width="128" height="76" rx="3" />
        <path d="M100 32 L100 108 M36 70 L164 70" strokeWidth="0.6" />
        <rect x="56" y="50" width="56" height="14" rx="2" fill="#0071E3" opacity="0.3" />
        <path d="M120 90 L160 50" strokeWidth="2.4" stroke="#3A3A3C" />
        <rect x="158" y="44" width="14" height="14" rx="2" fill="#3A3A3C" />
      </svg>
    );
    default: return (
      <svg viewBox="0 0 200 140" fill="none" stroke={stroke} strokeWidth="1.2" style={wrap}>
        <rect x="40" y="32" width="120" height="80" rx="6" fill="#E8E8ED" />
      </svg>
    );
  }
}

export function ProductCard({ product, onClick, dense = false }) {
  const [hover, setHover] = useState(false);
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${hover ? 'var(--border-strong)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: hover ? 'var(--shadow-pop)' : 'var(--shadow-card)',
        transition: 'all var(--motion-fast)',
        display: 'flex', flexDirection: 'column', height: '100%',
      }}>
        <div style={{ aspectRatio: dense ? '4/3' : '5/4', position: 'relative', background: '#FFFFFF', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 12, transition: 'transform var(--motion-base)', transform: hover ? 'scale(1.04)' : 'scale(1)' }}
            />
          ) : (
            <ProductIllustration kind={product.kind} hover={hover} />
          )}
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <StockPill status={product.stock} count={product.count} />
          </div>
          {product.badge && (
            <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--color-teal-800)', background: 'var(--color-mint-100)', padding: '3px 8px', borderRadius: 'var(--radius-xs)', textTransform: 'uppercase' }}>
              {product.badge}
            </div>
          )}
        </div>
        <div style={{ padding: dense ? '14px 16px 16px' : '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 6, flex: 1, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)', fontWeight: 600 }}>{product.brand}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)' }}>{product.sku}</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 400, fontSize: dense ? 16 : 17, letterSpacing: '-0.02em', color: 'var(--fg-primary)', lineHeight: 1.22 }}>{product.name}</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '4px 0 10px' }}>
            {(product.specs || []).slice(0, dense ? 2 : 3).map((s, i) => <Spec key={i}>{s}</Spec>)}
          </div>
          <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 8, marginTop: 'auto' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{product.priceLabel || 'Da'}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 650, fontSize: 22, color: 'var(--fg-primary)', letterSpacing: '-0.03em', lineHeight: 1, marginTop: 2 }}>{product.price}</div>
            </div>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: 'var(--color-mint-700)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              Preventivo <Icon name="arrow-right" size={12} />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
