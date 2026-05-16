import { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function AdminLogin() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      await signIn(email, password);
    } catch (e) {
      setErr(e?.message || 'Login fallito');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, var(--color-ice-50) 0%, var(--bg-surface) 100%)',
      display: 'grid', placeItems: 'center', padding: 20,
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 36px',
        boxShadow: '0 10px 40px rgba(10, 77, 104, 0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'var(--color-teal-500)',
            color: 'var(--color-white)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.04em',
          }}>CV</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--fg-primary)' }}>
              CleanVillage Admin
            </div>
            <div style={{ fontSize: 11, color: 'var(--fg-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>
              v1.0 · Console interna
            </div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontSize: 28, letterSpacing: '-0.025em', color: 'var(--fg-primary)', margin: '24px 0 6px' }}>
          Accedi al pannello
        </h1>
        <p style={{ fontSize: 13, color: 'var(--fg-secondary)', margin: 0, marginBottom: 28, lineHeight: 1.55 }}>
          Inserisci le credenziali del tuo account amministratore Supabase.
        </p>

        {!isSupabaseConfigured && (
          <div style={{
            padding: 12, marginBottom: 18,
            background: 'var(--color-warning-50, #FFF8E1)',
            border: '1px solid var(--color-warning-300, #F0B673)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12, color: 'var(--color-warning-800, #7A4504)',
          }}>
            <strong>Supabase non configurato.</strong> Aggiungi <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> e riavvia il dev server.
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</span>
            <input
              type="email" required autoFocus
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@cleanvillage.it"
              style={inputStyle}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</span>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />
          </label>

          {err && (
            <div style={{
              padding: 10,
              background: 'var(--color-danger-50, #FDEEEE)',
              border: '1px solid var(--color-danger-300, #E89E9E)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 12, color: 'var(--color-danger-700, #A02020)',
            }}>
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={busy || !isSupabaseConfigured}
            style={{
              marginTop: 6, padding: '12px 20px',
              background: 'var(--cta-bg, var(--color-mint-500))',
              color: 'var(--color-white)', border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, letterSpacing: '-0.01em',
              cursor: busy ? 'wait' : 'pointer',
              opacity: (busy || !isSupabaseConfigured) ? 0.65 : 1,
              boxShadow: 'var(--shadow-cta)',
              transition: 'transform 120ms, box-shadow 120ms',
            }}
          >
            {busy ? 'Accesso in corso…' : 'Accedi'}
          </button>
        </form>

        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
          Crea il primo account dal pannello Supabase →{' '}
          <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: 'var(--color-teal-500)', textDecoration: 'none', fontWeight: 500 }}>
            Authentication › Users › Add user
          </a>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '11px 13px',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  color: 'var(--fg-primary)',
  outline: 'none',
};
