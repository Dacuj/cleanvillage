import { useEffect, useState } from 'react';
import { AdminPage, AdminIcon, ABtn, Badge, Panel, Modal, AField, AInput, ATextarea, ASelect, DataTable, useAdminStats } from './chrome.jsx';
import { useSiteContent, setSiteContent } from '../lib/siteContent.js';
import { listProducts, upsertProduct } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export default function AdminHighlights() {
  const { refresh } = useAdminStats();
  const content = useSiteContent();
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);

  const reload = async () => setProducts(await listProducts());
  useEffect(() => { reload(); }, []);

  const highlights = content.highlights?.items || [];
  const highlighted = products.filter(p => p.is_highlighted);

  const updateField = (path, value) => {
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

  const toggleHighlight = async (product) => {
    if (!isSupabaseConfigured) { alert('Configura Supabase per modificare i prodotti.'); return; }
    await upsertProduct({ ...product, is_highlighted: !product.is_highlighted });
    await reload();
    refresh();
  };

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Macchine in evidenza"
      subtitle="Le tre macchine più importanti che vuoi mostrare nella homepage. Modifichi il copy editoriale (titolo, occhiello, descrizione e specs) e attivi/disattivi quali prodotti sono in evidenza."
    >
      <div style={WARN_STYLE}>
        <AdminIcon name="info" size={16} color="var(--color-teal-500)" />
        <span>
          La sezione "Macchine in evidenza" della landing mostra esattamente <b>3 card editoriali</b>. Le immagini si caricano da
          <a href="/admin/landing" style={{ color: 'var(--color-teal-500)', textDecoration: 'underline', marginLeft: 4, marginRight: 4 }}>Editor sito</a>
          (slot "Macchina in evidenza · slot 1/2/3").
        </span>
      </div>

      <Panel title="Card editoriali della landing" padding="22px 26px" action={
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>{highlights.length} card</span>
      }>
        <Grid cols={1} gap={12}>
          {highlights.map((h, i) => (
            <HighlightCardEditor
              key={h.id || i}
              index={i}
              data={h}
              products={products}
              update={(field, value) => updateField(`highlights.items.${i}.${field}`, value)}
            />
          ))}
        </Grid>
      </Panel>

      <div style={{ height: 18 }} />

      <Panel padding={0} title={`Prodotti contrassegnati "in evidenza" · ${highlighted.length}`} action={
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--fg-muted)' }}>
          Toggle "In evidenza" su un prodotto per includerlo
        </span>
      }>
        <DataTable
          empty="Nessun prodotto in evidenza. Apri il prodotto dalla sezione Prodotti e attiva 'In evidenza'."
          onRowClick={p => setEditing(p)}
          columns={[
            { key: 'name', label: 'Prodotto', render: r => (
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{r.brand} · {r.sku}</div>
              </div>
            ) },
            { key: 'price', label: 'Prezzo', width: 120, render: r => <span style={{ fontFamily: 'var(--font-mono)' }}>{r.price}</span> },
            { key: 'feat', label: 'Su landing', width: 120, render: r => r.is_featured ? <Badge tone="mint">Sì · featured</Badge> : <Badge tone="neutral">Solo evidenza</Badge> },
            { key: 'act', label: '', width: 140, align: 'right', render: r => (
              <ABtn variant="secondary" size="sm" icon={<AdminIcon name="star-off" size={12} />} onClick={(e) => { e.stopPropagation(); toggleHighlight(r); }}>
                Rimuovi
              </ABtn>
            ) },
          ]}
          rows={highlighted}
        />
      </Panel>

      <div style={{ height: 18 }} />

      <Panel padding="22px 26px" title="Aggiungi un prodotto in evidenza" action={
        <span style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{products.length - highlighted.length} disponibili</span>
      }>
        <DataTable
          empty="Tutti i prodotti sono già in evidenza."
          onRowClick={p => toggleHighlight(p)}
          columns={[
            { key: 'name', label: 'Prodotto', render: r => (
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--fg-muted)' }}>{r.brand} · {r.sku}</div>
              </div>
            ) },
            { key: 'price', label: 'Prezzo', width: 120, render: r => <span style={{ fontFamily: 'var(--font-mono)' }}>{r.price}</span> },
            { key: 'act', label: '', width: 140, align: 'right', render: r => (
              <ABtn variant="cta" size="sm" icon={<AdminIcon name="star" size={12} />} onClick={(e) => { e.stopPropagation(); toggleHighlight(r); }}>
                Metti in evidenza
              </ABtn>
            ) },
          ]}
          rows={products.filter(p => !p.is_highlighted).slice(0, 10)}
        />
      </Panel>
    </AdminPage>
  );
}

function HighlightCardEditor({ index, data, products, update }) {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <button type="button" onClick={() => setCollapsed(!collapsed)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
        background: 'var(--color-ice-50)', border: 'none', cursor: 'pointer', textAlign: 'left',
        borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
      }}>
        <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-teal-500)', color: 'var(--color-white)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{index + 1}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--fg-primary)' }}>{data.name || 'Card senza titolo'}</div>
          <div style={{ fontSize: 11, color: 'var(--fg-muted)', marginTop: 2 }}>{data.eyebrow}</div>
        </div>
        <AdminIcon name={collapsed ? 'chevron-down' : 'chevron-up'} size={16} color="var(--fg-muted)" />
      </button>
      {!collapsed && (
        <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Grid cols={2}>
            <AField label="Occhiello" hint="Es. 'Punta di diamante · COMAC'">
              <AInput value={data.eyebrow || ''} onChange={(e) => update('eyebrow', e.target.value)} />
            </AField>
            <AField label="Lato immagine" hint="Su quale lato esce l'illustrazione">
              <ASelect value={data.side || 'left'} onChange={(e) => update('side', e.target.value)}>
                <option value="left">Sinistra</option>
                <option value="right">Destra</option>
              </ASelect>
            </AField>
          </Grid>
          <AField label="Nome macchina">
            <AInput value={data.name || ''} onChange={(e) => update('name', e.target.value)} />
          </AField>
          <AField label="Tagline" hint="Frase di una riga sotto al nome">
            <AInput value={data.tagline || ''} onChange={(e) => update('tagline', e.target.value)} />
          </AField>
          <AField label="Descrizione editoriale">
            <ATextarea rows={4} value={data.desc || ''} onChange={(e) => update('desc', e.target.value)} />
          </AField>
          <AField label="Prodotto collegato" hint="Click sulla card porta a questo prodotto">
            <ASelect value={data.pid || ''} onChange={(e) => update('pid', e.target.value)}>
              <option value="">— Nessuno —</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.brand} · {p.name} ({p.sku})</option>)}
            </ASelect>
          </AField>
          <SpecsEditor specs={data.specs || []} onChange={(specs) => update('specs', specs)} />
        </div>
      )}
    </div>
  );
}

function SpecsEditor({ specs, onChange }) {
  const updateSpec = (i, idx, value) => {
    const next = specs.map((s, k) => k === i ? (idx === 0 ? [value, s[1]] : [s[0], value]) : s);
    onChange(next);
  };
  const add = () => onChange([...specs, ['Nuova spec', 'Valore']]);
  const remove = (i) => onChange(specs.filter((_, k) => k !== i));
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-secondary)', marginBottom: 8 }}>Specifiche tecniche</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {specs.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 32px', gap: 8 }}>
            <AInput value={s[0]} onChange={(e) => updateSpec(i, 0, e.target.value)} placeholder="Etichetta" />
            <AInput value={s[1]} onChange={(e) => updateSpec(i, 1, e.target.value)} placeholder="Valore" />
            <button type="button" onClick={() => remove(i)} style={{ background: 'transparent', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-xs)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
              <AdminIcon name="trash-2" size={12} color="var(--color-danger-500)" />
            </button>
          </div>
        ))}
      </div>
      <ABtn variant="ghost" size="sm" icon={<AdminIcon name="plus" size={12} />} onClick={add}>Aggiungi spec</ABtn>
    </div>
  );
}

function Grid({ cols = 2, gap = 14, children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>{children}</div>;
}

const WARN_STYLE = { display: 'flex', gap: 12, alignItems: 'center', padding: '12px 16px', background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-500)', borderRadius: 'var(--radius-md)', marginBottom: 18, fontSize: 13, color: 'var(--fg-secondary)', lineHeight: 1.5 };
