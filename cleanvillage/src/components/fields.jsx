import { useState } from 'react';

export const inputStyle = {
  fontFamily: 'var(--font-body)', fontSize: 14,
  padding: '11px 14px',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--fg-primary)',
  outline: 'none', width: '100%', boxSizing: 'border-box',
  transition: 'border-color var(--motion-fast), box-shadow var(--motion-fast)',
};

export function Field({ label, hint, error, children, span = 1, required }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: `span ${span}` }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: error ? 'var(--color-danger-500)' : 'var(--fg-muted)' }}>
        {label}{required && <span style={{ color: 'var(--color-teal-500)', marginLeft: 3 }}>*</span>}
      </span>
      {children}
      {error && <span style={{ fontSize: 11, color: 'var(--color-danger-500)' }}>{error}</span>}
      {!error && hint && <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{hint}</span>}
    </label>
  );
}

export function TextInput(p) {
  return <input {...p} style={{ ...inputStyle, ...(p.style || {}) }} />;
}

export function Textarea(p) {
  return <textarea rows={4} {...p} style={{ ...inputStyle, resize: 'vertical', ...(p.style || {}) }} />;
}

export function Select(p) {
  return <select {...p} style={{ ...inputStyle, ...(p.style || {}) }}>{p.children}</select>;
}

export function Check({ label, checked = false, onChange }) {
  const [c, setC] = useState(checked);
  const v = onChange ? checked : c;
  const set = onChange || setC;
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--fg-primary)', cursor: 'pointer', padding: '5px 0' }}>
      <span style={{
        width: 16, height: 16, borderRadius: 3,
        border: `1.5px solid ${v ? 'var(--color-teal-500)' : 'var(--border-strong)'}`,
        background: v ? 'var(--color-teal-500)' : 'var(--bg-surface)',
        display: 'grid', placeItems: 'center', color: 'var(--color-white)', fontSize: 11,
        transition: 'all var(--motion-fast)', flexShrink: 0,
      }}>{v && '✓'}</span>
      <input type="checkbox" checked={v} onChange={() => set(!v)} style={{ display: 'none' }} />
      {label}
    </label>
  );
}
