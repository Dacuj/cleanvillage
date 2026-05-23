import { AdminPage, AdminIcon, ABtn, Panel, AField, AInput, ATextarea, ASelect, Badge } from './chrome.jsx';
import { useSiteContent, setSiteContent } from '../lib/siteContent.js';

export default function AdminPricing() {
  const content = useSiteContent();
  const pricing = content.pricing || { tiers: [] };

  const update = (path, value) => {
    setSiteContent((cur) => {
      const next = structuredClone(cur);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        if (typeof obj[keys[i]] !== 'object' || obj[keys[i]] === null) obj[keys[i]] = isNaN(Number(keys[i + 1])) ? {} : [];
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateTier = (i, field, value) => {
    const tiers = (pricing.tiers || []).slice();
    tiers[i] = { ...tiers[i], [field]: value };
    update('pricing.tiers', tiers);
  };
  const addTier = () => update('pricing.tiers', [...(pricing.tiers || []), { qty: '', discount: 0, label: '' }]);
  const removeTier = (i) => update('pricing.tiers', (pricing.tiers || []).filter((_, k) => k !== i));

  return (
    <AdminPage
      eyebrow="Catalogo"
      title="Listini & sconti"
      subtitle="Configura le fasce di sconto a scaglioni mostrate sulle schede prodotto e le condizioni commerciali generali."
    >
      <Panel title="Comportamento listino" padding="22px 26px">
        <Grid cols={2}>
          <AField label="Mostra prezzi sul sito pubblico?" hint='Se "No", al posto del prezzo il sito mostra "A preventivo"'>
            <ASelect value={pricing.showOnStorefront !== false ? '1' : '0'} onChange={(e) => update('pricing.showOnStorefront', e.target.value === '1')}>
              <option value="1">Sì · prezzi visibili</option>
              <option value="0">No · solo a preventivo</option>
            </ASelect>
          </AField>
          <AField label="Termini di pagamento" hint="Visualizzato nelle condizioni di vendita">
            <AInput value={pricing.paymentTerms || ''} onChange={(e) => update('pricing.paymentTerms', e.target.value)} />
          </AField>
          <AField label="Ordine minimo" hint='Es. "€ 250" — solo informativo'>
            <AInput value={pricing.minOrder || ''} onChange={(e) => update('pricing.minOrder', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Nota legale sotto al prezzo" hint="Mostrata sulla scheda prodotto sotto al prezzo">
          <ATextarea rows={3} value={pricing.note || ''} onChange={(e) => update('pricing.note', e.target.value)} />
        </AField>
      </Panel>

      <div style={{ height: 18 }} />

      <Panel title="Fasce di sconto" padding="22px 26px" action={
        <ABtn size="sm" variant="cta" icon={<AdminIcon name="plus" size={12} />} onClick={addTier}>Aggiungi fascia</ABtn>
      }>
        <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
          Le fasce di sconto vengono mostrate come tabella sulla pagina prodotto. Lo sconto viene calcolato sul prezzo base.
          Lascia <code style={Kbd}>discount</code> vuoto per indicare "su richiesta / custom".
        </div>

        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: 0, padding: '10px 14px', background: 'var(--color-ice-50)', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={th}>Quantità</span>
            <span style={th}>Sconto %</span>
            <span style={th}>Etichetta visibile</span>
            <span style={th}>Anteprima</span>
            <span />
          </div>
          {(pricing.tiers || []).map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 40px', gap: 8, padding: '10px 14px', borderBottom: i === (pricing.tiers.length - 1) ? 'none' : '1px solid var(--border-subtle)', alignItems: 'center' }}>
              <AInput value={t.qty || ''} onChange={(e) => updateTier(i, 'qty', e.target.value)} placeholder="1-2 / 3-9 / 25+" />
              <AInput type="number" value={t.discount ?? ''} onChange={(e) => updateTier(i, 'discount', e.target.value === '' ? null : parseFloat(e.target.value))} placeholder="0" />
              <AInput value={t.label || ''} onChange={(e) => updateTier(i, 'label', e.target.value)} placeholder="−7%" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-secondary)' }}>
                {t.discount == null ? <Badge tone="amber">Custom</Badge> : t.discount === 0 ? <Badge tone="neutral">Listino</Badge> : <Badge tone="mint">−{t.discount}%</Badge>}
              </span>
              <button onClick={() => removeTier(i)} style={iconBtn} title="Rimuovi fascia">
                <AdminIcon name="trash-2" size={13} color="var(--color-danger-500)" />
              </button>
            </div>
          ))}
          {(pricing.tiers || []).length === 0 && (
            <div style={{ padding: '36px 14px', textAlign: 'center', color: 'var(--fg-muted)', fontSize: 13 }}>
              Nessuna fascia configurata. Le schede prodotto useranno i valori di default.
            </div>
          )}
        </div>

        {/* Live preview of the price tier table as it appears on the site */}
        <div style={{ marginTop: 20, padding: '16px 18px', background: 'var(--color-ice-50)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', marginBottom: 10 }}>Anteprima · come appare sulla scheda prodotto</div>
          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
            {(pricing.tiers || []).map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 0.6fr', padding: '10px 14px', background: i === 1 ? 'var(--color-mint-50)' : i % 2 ? 'var(--color-ice-50)' : 'transparent', borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-secondary)' }}>{t.qty} pz</span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, color: 'var(--fg-primary)' }}>{t.discount == null ? 'A preventivo' : t.discount === 0 ? 'Listino' : `−${t.discount}%`}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, color: 'var(--color-mint-700)', textAlign: 'right' }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </AdminPage>
  );
}

function Grid({ cols, children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14, marginBottom: 14 }}>{children}</div>;
}

const th = { fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)' };
const iconBtn = { width: 32, height: 32, background: 'transparent', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'grid', placeItems: 'center' };
const Kbd = { fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--color-ice-100)', padding: '1px 5px', borderRadius: 3 };
