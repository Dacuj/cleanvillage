import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Button, Eyebrow, TrustBar } from '../components/ui.jsx';
import { ProductCard } from '../components/product.jsx';
import { useProducts } from '../lib/storefront.js';
import { useIsMobile } from '../lib/useBreakpoint.js';

const GREETING = "Ciao! Aiuto a trovare la macchina giusta per il tuo lavoro. Dimmi cosa devi pulire: tipo di superficie, metri quadri, frequenza d'uso. Più dettagli mi dai, più precisa sarà la proposta.";

export default function MachineFinder() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const products = useProducts();
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING, productIds: [] }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const productById = (id) => products.find(p => p.id === id);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError(null);
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          messages: next.map(m => ({ role: m.role, content: m.content })),
          products,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || `Errore ${r.status}`);
      setMessages(curr => [...curr, {
        role: 'assistant',
        content: data.reply || '',
        productIds: Array.isArray(data.productIds) ? data.productIds : [],
      }]);
    } catch (e) {
      setError(e.message || 'Errore di rete. Riprova.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: GREETING, productIds: [] }]);
    setInput('');
    setError(null);
  };

  return (
    <main style={{ background: 'var(--bg-page)', minHeight: 'calc(100vh - 80px)' }}>
      <section style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <TrustBar height={3} />
        <div style={{ maxWidth: 'var(--max-content)', margin: '0 auto', padding: isMobile ? '28px 20px 28px' : '48px 32px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--fg-muted)', marginBottom: 16, fontFamily: 'var(--font-mono)' }}>
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Home</a>
            <Icon name="chevron-right" size={12} />
            <span style={{ color: 'var(--fg-primary)' }}>Scopri la macchina ideale</span>
          </div>
          <Eyebrow>Assistente AI · Beta</Eyebrow>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(32px, 4.6vw, 56px)', letterSpacing: '-0.04em', margin: '12px 0 14px', lineHeight: 1.04, textWrap: 'balance', maxWidth: '24ch' }}>
            Trova la macchina <em style={{ fontStyle: 'normal', color: 'var(--color-teal-500)', fontWeight: 650 }}>ideale</em> per il tuo lavoro.
          </h1>
          <p style={{ margin: 0, color: 'var(--fg-secondary)', fontSize: isMobile ? 15 : 17, maxWidth: '60ch', lineHeight: 1.6 }}>
            Descrivi il problema all'assistente: la chat ti farà qualche domanda mirata e proporrà la macchina più adatta dal nostro catalogo. Per offerte e disponibilità in tempo reale, chiedi sempre conferma al nostro ufficio commerciale.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 880, margin: '0 auto', padding: isMobile ? '20px 16px 80px' : '36px 32px 96px' }}>
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--color-ice-50)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--color-teal-500)', color: 'var(--color-white)', display: 'grid', placeItems: 'center' }}>
                <Icon name="sparkles" size={16} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)' }}>Assistente Clean Village</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)' }}>
                  {products.length} prodotti in catalogo · risposte indicative
                </span>
              </div>
            </div>
            <button onClick={reset} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-body)', padding: 4 }}>
              <Icon name="rotate-ccw" size={12} /> Ricomincia
            </button>
          </div>

          <div ref={scrollerRef} style={{
            padding: isMobile ? '16px 14px' : '22px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 320,
            maxHeight: isMobile ? '58vh' : 520,
            overflowY: 'auto',
          }}>
            {messages.map((m, i) => (
              <Message key={i} message={m} productById={productById} navigate={navigate} isMobile={isMobile} />
            ))}
            {loading && <TypingDots />}
            {error && (
              <div style={{ padding: '10px 12px', background: 'var(--color-danger-100)', border: '1px solid var(--color-danger-500)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger-500)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="alert-circle" size={14} />
                <span style={{ flex: 1 }}>{error}</span>
              </div>
            )}
          </div>

          <div style={{ padding: isMobile ? '12px 14px 14px' : '14px 18px 18px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={1}
                placeholder="Es. devo pulire 1.500 mq di magazzino ogni notte..."
                style={{
                  flex: 1,
                  resize: 'none',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-sm)',
                  outline: 'none',
                  color: 'var(--fg-primary)',
                  background: 'var(--bg-surface)',
                  minHeight: 44,
                  maxHeight: 160,
                  lineHeight: 1.45,
                }}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                aria-label="Invia"
                style={{
                  height: 44, width: 44, flexShrink: 0,
                  background: input.trim() && !loading ? 'var(--cta-bg)' : 'var(--color-ice-200)',
                  color: 'var(--color-white)',
                  border: 'none', borderRadius: 'var(--radius-sm)',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'grid', placeItems: 'center',
                  transition: 'background var(--motion-fast)',
                }}
              >
                <Icon name="arrow-up" size={18} />
              </button>
            </div>
            <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-muted)', textAlign: 'center' }}>
              I suggerimenti sono generati da un modello AI gratuito (Gemini Flash) e possono contenere errori. Conferma sempre con un nostro consulente.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 12, alignItems: isMobile ? 'stretch' : 'center', justifyContent: 'space-between', padding: isMobile ? '16px' : '18px 22px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 13, color: 'var(--fg-secondary)' }}>
            Vuoi parlare direttamente con un commerciale? Risposta entro 24 ore.
          </div>
          <Button variant="cta" onClick={() => navigate('/contact')} iconRight={<Icon name="arrow-right" size={14} />}>Richiedi preventivo</Button>
        </div>
      </section>
    </main>
  );
}

function Message({ message, productById, navigate, isMobile }) {
  const isUser = message.role === 'user';
  const recommendedProducts = (message.productIds || []).map(productById).filter(Boolean);
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: isUser ? '78%' : '100%', display: 'flex', flexDirection: 'column', gap: 10, alignItems: isUser ? 'flex-end' : 'stretch' }}>
        <div style={{
          padding: '10px 14px',
          background: isUser ? 'var(--color-teal-500)' : 'var(--color-ice-50)',
          color: isUser ? 'var(--color-white)' : 'var(--fg-primary)',
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          fontSize: 14,
          lineHeight: 1.55,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          border: isUser ? 'none' : '1px solid var(--border-subtle)',
        }}>
          {message.content}
        </div>
        {recommendedProducts.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(recommendedProducts.length, 3)}, 1fr)`,
            gap: 12,
          }}>
            {recommendedProducts.map(p => (
              <ProductCard key={p.id} product={p} onClick={() => navigate(`/product/${p.id}`)} dense />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ padding: '12px 16px', background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: '14px 14px 14px 4px', display: 'inline-flex', gap: 4 }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--fg-muted)',
            animation: `cvDot 1.2s ${i * 0.15}s infinite ease-in-out`,
            display: 'inline-block',
          }} />
        ))}
        <style>{`@keyframes cvDot { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }`}</style>
      </div>
    </div>
  );
}
