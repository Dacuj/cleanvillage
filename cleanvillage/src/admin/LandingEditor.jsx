import { useState, useEffect, useRef } from 'react';
import { AdminPage, AdminIcon, ABtn, Panel, AField, AInput, ATextarea } from './chrome.jsx';
import {
  useSiteContent,
  setSiteContent,
  resetSiteContent,
  useRemoteSaveStatus,
  resolveImageSlot,
} from '../lib/siteContent.js';
import { uploadLandingImage, deleteLandingImage, probeSiteContentSetup } from '../lib/api.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import migration0002Sql from '../../supabase/migrations/0002_site_content.sql?raw';
import migration0003Sql from '../../supabase/migrations/0003_clear_products.sql?raw';

const IMAGE_SLOTS = [
  { id: 'heroImage', label: 'Hero — immagine principale', desc: 'Visibile a destra del titolo nella prima sezione' },
  { id: 'hm-comac-innova', label: 'Macchina in evidenza · slot 1', desc: 'La prima delle tre macchine evidenziate (lavasciuga)' },
  { id: 'hm-karcher-hd', label: 'Macchina in evidenza · slot 2', desc: 'La seconda delle tre (idropulitrice)' },
  { id: 'hm-ghibli-vac', label: 'Macchina in evidenza · slot 3', desc: 'La terza delle tre (aspiraliquidi)' },
  { id: 'promo-0', label: 'Promo · card 1', desc: 'Sfondo della prima card colorata sotto la sezione categorie' },
  { id: 'promo-1', label: 'Promo · card 2', desc: 'Sfondo della seconda card promo' },
  { id: 'promo-2', label: 'Promo · card 3', desc: 'Sfondo della terza card promo' },
  { id: 'videoPoster', label: 'Poster video aziendale', desc: 'Immagine di copertina mostrata nel riquadro del player video (sezione blu)' },
];

export default function LandingEditor() {
  const content = useSiteContent();

  const update = (path, value) => {
    setSiteContent((current) => {
      const next = structuredClone(current);
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (typeof obj[k] !== 'object' || obj[k] === null) obj[k] = isNaN(Number(keys[i + 1])) ? {} : [];
        obj = obj[k];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const reset = () => {
    if (!confirm('Ripristinare tutti i testi e le immagini ai valori originali? Le immagini caricate verranno rimosse dalla landing (i file restano nello storage).')) return;
    resetSiteContent();
  };

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Editor sito"
      subtitle="Modifica i testi e le immagini della landing senza toccare il codice. Le modifiche vengono pubblicate online in tempo reale."
      actions={[
        <SaveIndicator key="s" />,
        <ABtn key="o" variant="secondary" icon={<AdminIcon name="external-link" size={13} />} onClick={() => window.open('/', '_blank')}>
          Vedi sito
        </ABtn>,
        <ABtn key="r" variant="danger" icon={<AdminIcon name="rotate-ccw" size={13} />} onClick={reset}>
          Ripristina default
        </ABtn>,
      ]}
    >
      <CloudStatusBanner />

      {/* ============================================================
          AZIENDA — dati istituzionali
          ============================================================ */}
      <Section title="Dati azienda" icon="building-2" desc="Ragione sociale, indirizzi, contatti e dati fiscali. Vengono usati in tutto il sito (footer, contatti, mappa).">
        <Grid cols={2}>
          <AField label="Ragione sociale">
            <AInput value={content.company.name} onChange={(e) => update('company.name', e.target.value)} />
          </AField>
          <AField label="Anno fondazione">
            <AInput value={content.company.foundedYear} onChange={(e) => update('company.foundedYear', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Frase descrittiva (footer)" hint="Mostrata sotto al logo nel footer del sito">
          <ATextarea rows={2} value={content.company.tagline} onChange={(e) => update('company.tagline', e.target.value)} />
        </AField>
        <Grid cols={2}>
          <AField label="Sede legale">
            <AInput value={content.company.legalAddress} onChange={(e) => update('company.legalAddress', e.target.value)} />
          </AField>
          <AField label="Sede operativa">
            <AInput value={content.company.operationalAddress} onChange={(e) => update('company.operationalAddress', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Città sede (compatta)" hint="Es. Villaricca (NA). Usata nel footer.">
          <AInput value={content.company.operationalCity} onChange={(e) => update('company.operationalCity', e.target.value)} />
        </AField>
        <Grid cols={3}>
          <AField label="Telefono principale">
            <AInput value={content.company.phonePrimary} onChange={(e) => update('company.phonePrimary', e.target.value)} />
          </AField>
          <AField label="Telefono linea 2">
            <AInput value={content.company.phoneSecondary} onChange={(e) => update('company.phoneSecondary', e.target.value)} />
          </AField>
          <AField label="Cellulare">
            <AInput value={content.company.phoneMobile} onChange={(e) => update('company.phoneMobile', e.target.value)} />
          </AField>
        </Grid>
        <Grid cols={2}>
          <AField label="Email principale">
            <AInput value={content.company.emailPrimary} onChange={(e) => update('company.emailPrimary', e.target.value)} />
          </AField>
          <AField label="Email secondaria">
            <AInput value={content.company.emailSecondary} onChange={(e) => update('company.emailSecondary', e.target.value)} />
          </AField>
        </Grid>
        <Grid cols={2}>
          <AField label="Sito web">
            <AInput value={content.company.website} onChange={(e) => update('company.website', e.target.value)} />
          </AField>
          <AField label="Orari">
            <AInput value={content.company.hours} onChange={(e) => update('company.hours', e.target.value)} />
          </AField>
        </Grid>
        <Grid cols={3}>
          <AField label="P.IVA">
            <AInput value={content.company.vat} onChange={(e) => update('company.vat', e.target.value)} />
          </AField>
          <AField label="REA">
            <AInput value={content.company.rea} onChange={(e) => update('company.rea', e.target.value)} />
          </AField>
          <AField label="Capitale sociale">
            <AInput value={content.company.capSoc} onChange={(e) => update('company.capSoc', e.target.value)} />
          </AField>
        </Grid>
        <CertificationEditor
          items={content.company.certifications}
          onChange={(items) => update('company.certifications', items)}
        />
        <SocialEditor
          socials={content.company.socials || {}}
          onChange={(s) => update('company.socials', s)}
        />
      </Section>

      {/* ============================================================
          HERO
          ============================================================ */}
      <Section title="Hero (sezione principale)" icon="image" desc="La prima cosa che vedono i visitatori della homepage. Titolo, sottotitolo, statistiche, badge animato.">
        <AField label="Eyebrow (testo piccolo sopra al titolo)">
          <AInput value={content.hero.eyebrow} onChange={(e) => update('hero.eyebrow', e.target.value)} />
        </AField>
        <Grid cols={2}>
          <AField label="Titolo principale" hint="La parola evidenziata in blu è specificata a destra.">
            <ATextarea rows={2} value={content.hero.titleHuman} onChange={(e) => update('hero.titleHuman', e.target.value)} />
          </AField>
          <AField label="Parola evidenziata (in blu)" hint="Deve comparire esattamente nel titolo.">
            <AInput value={content.hero.titleHumanAccent} onChange={(e) => update('hero.titleHumanAccent', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Sottotitolo (paragrafo sotto al titolo)">
          <ATextarea rows={3} value={content.hero.subtitle} onChange={(e) => update('hero.subtitle', e.target.value)} />
        </AField>
        <Grid cols={2}>
          <AField label="Bottone primario (blu)">
            <AInput value={content.hero.ctaPrimary} onChange={(e) => update('hero.ctaPrimary', e.target.value)} />
          </AField>
          <AField label="Bottone secondario">
            <AInput value={content.hero.ctaSecondary} onChange={(e) => update('hero.ctaSecondary', e.target.value)} />
          </AField>
        </Grid>
        <Grid cols={2}>
          <AField label="Social proof (riga sotto i bottoni)">
            <AInput value={content.hero.socialProof} onChange={(e) => update('hero.socialProof', e.target.value)} />
          </AField>
          <AField label="Rating (es. recensioni)">
            <AInput value={content.hero.rating} onChange={(e) => update('hero.rating', e.target.value)} />
          </AField>
        </Grid>

        <SubSection title="Statistiche (riga in basso)">
          {content.hero.stats.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 80px auto', gap: 10, alignItems: 'end' }}>
              <AField label={`Valore #${i + 1}`}>
                <AInput value={s.value} onChange={(e) => update(`hero.stats.${i}.value`, e.target.value)} />
              </AField>
              <AField label="Unità">
                <AInput value={s.unit} onChange={(e) => update(`hero.stats.${i}.unit`, e.target.value)} />
              </AField>
              <AField label="Etichetta">
                <AInput value={s.label} onChange={(e) => update(`hero.stats.${i}.label`, e.target.value)} />
              </AField>
              <AField label="Verde">
                <input type="checkbox" checked={!!s.accent} onChange={(e) => update(`hero.stats.${i}.accent`, e.target.checked)} style={{ height: 32 }} />
              </AField>
              <ABtn variant="ghost" icon={<AdminIcon name="trash-2" size={13} />} onClick={() => {
                const stats = content.hero.stats.filter((_, j) => j !== i);
                update('hero.stats', stats);
              }}>Rimuovi</ABtn>
            </div>
          ))}
          <ABtn variant="secondary" icon={<AdminIcon name="plus" size={13} />} onClick={() => {
            update('hero.stats', [...content.hero.stats, { value: '0', unit: '', label: 'Nuova statistica' }]);
          }}>Aggiungi statistica</ABtn>
        </SubSection>

        <SubSection title="Badge offerta (riquadro scuro in alto a sinistra dell'immagine)">
          <Grid cols={2}>
            <AField label="Eyebrow">
              <AInput value={content.hero.badgeOffer.eyebrow} onChange={(e) => update('hero.badgeOffer.eyebrow', e.target.value)} />
            </AField>
            <AField label="Data scadenza">
              <AInput value={content.hero.badgeOffer.deadline} onChange={(e) => update('hero.badgeOffer.deadline', e.target.value)} />
            </AField>
          </Grid>
          <AField label="Testo">
            <ATextarea rows={2} value={content.hero.badgeOffer.text} onChange={(e) => update('hero.badgeOffer.text', e.target.value)} />
          </AField>
        </SubSection>

        <SubSection title="Badge best seller (riquadro bianco in basso sull'immagine)">
          <Grid cols={2}>
            <AField label="Eyebrow">
              <AInput value={content.hero.sellerBadge.eyebrow} onChange={(e) => update('hero.sellerBadge.eyebrow', e.target.value)} />
            </AField>
            <AField label="Codice SKU">
              <AInput value={content.hero.sellerBadge.sku} onChange={(e) => update('hero.sellerBadge.sku', e.target.value)} />
            </AField>
            <AField label="Nome prodotto">
              <AInput value={content.hero.sellerBadge.name} onChange={(e) => update('hero.sellerBadge.name', e.target.value)} />
            </AField>
            <AField label="Prezzo (es. €18.400)">
              <AInput value={content.hero.sellerBadge.price} onChange={(e) => update('hero.sellerBadge.price', e.target.value)} />
            </AField>
            <AField label="Specifiche brevi">
              <AInput value={content.hero.sellerBadge.specs} onChange={(e) => update('hero.sellerBadge.specs', e.target.value)} />
            </AField>
            <AField label="Disponibilità (badge blu)">
              <AInput value={content.hero.sellerBadge.availability} onChange={(e) => update('hero.sellerBadge.availability', e.target.value)} />
            </AField>
          </Grid>
        </SubSection>
      </Section>

      {/* ============================================================
          MARCHI MARQUEE
          ============================================================ */}
      <Section title="Sezione marchi" icon="tag" desc="La striscia animata con i loghi dei marchi distribuiti.">
        <Grid cols={2}>
          <AField label="Etichetta (a sinistra)">
            <AInput value={content.brandMarquee.label} onChange={(e) => update('brandMarquee.label', e.target.value)} />
          </AField>
          <AField label="Link a destra">
            <AInput value={content.brandMarquee.cta} onChange={(e) => update('brandMarquee.cta', e.target.value)} />
          </AField>
        </Grid>
      </Section>

      {/* ============================================================
          CATEGORIE
          ============================================================ */}
      <Section title="Sezione categorie" icon="folder-tree" desc="La griglia magazine con le categorie del catalogo.">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.categoriesSection.eyebrow} onChange={(e) => update('categoriesSection.eyebrow', e.target.value)} />
          </AField>
          <AField label="CTA &quot;Esplora catalogo&quot;">
            <AInput value={content.categoriesSection.ctaAll} onChange={(e) => update('categoriesSection.ctaAll', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Titolo">
          <AInput value={content.categoriesSection.title} onChange={(e) => update('categoriesSection.title', e.target.value)} />
        </AField>
        <AField label="Descrizione tile in evidenza (visibile solo nel tile grande)">
          <ATextarea rows={2} value={content.categoriesSection.featureDescription} onChange={(e) => update('categoriesSection.featureDescription', e.target.value)} />
        </AField>
      </Section>

      {/* ============================================================
          PROMO CARDS
          ============================================================ */}
      <Section title="Promozioni (3 card colorate)" icon="megaphone" desc="Le tre card sotto la sezione categorie. Lascia vuoto per nasconderle.">
        {content.promos.map((p, i) => (
          <div key={i} style={{ padding: 18, background: 'var(--color-ice-50)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>Promo #{i + 1}</strong>
              <ABtn variant="ghost" size="sm" icon={<AdminIcon name="trash-2" size={12} />} onClick={() => {
                update('promos', content.promos.filter((_, j) => j !== i));
              }}>Rimuovi</ABtn>
            </div>
            <Grid cols={3}>
              <AField label="Tag (badge sopra)">
                <AInput value={p.tag} onChange={(e) => update(`promos.${i}.tag`, e.target.value)} />
              </AField>
              <AField label="CTA (in basso)">
                <AInput value={p.cta} onChange={(e) => update(`promos.${i}.cta`, e.target.value)} />
              </AField>
              <AField label="Colore">
                <select className="cv-admin-select" value={p.color} onChange={(e) => update(`promos.${i}.color`, e.target.value)} style={{ fontFamily: 'var(--font-body)', fontSize: 13, padding: '9px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', width: '100%', boxSizing: 'border-box' }}>
                  <option value="mint">Blu acceso</option>
                  <option value="teal">Grafite scuro</option>
                </select>
              </AField>
            </Grid>
            <AField label="Titolo">
              <AInput value={p.title} onChange={(e) => update(`promos.${i}.title`, e.target.value)} />
            </AField>
            <AField label="Sottotitolo">
              <AInput value={p.subtitle} onChange={(e) => update(`promos.${i}.subtitle`, e.target.value)} />
            </AField>
          </div>
        ))}
        {content.promos.length < 3 && (
          <ABtn variant="secondary" icon={<AdminIcon name="plus" size={13} />} onClick={() => {
            update('promos', [...content.promos, { tag: 'NUOVO', title: 'Promo', subtitle: '', cta: 'Scopri', kind: 'scrubber', color: 'mint' }]);
          }}>Aggiungi promo</ABtn>
        )}
      </Section>

      {/* ============================================================
          MACCHINE IN EVIDENZA
          ============================================================ */}
      <Section title="Macchine in evidenza" icon="star" desc="Le 3 schede prodotto grandi con specifiche e immagine.">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.highlights.eyebrow} onChange={(e) => update('highlights.eyebrow', e.target.value)} />
          </AField>
          <AField label="Titolo">
            <AInput value={content.highlights.title} onChange={(e) => update('highlights.title', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Introduzione (paragrafo a destra del titolo)">
          <ATextarea rows={2} value={content.highlights.intro} onChange={(e) => update('highlights.intro', e.target.value)} />
        </AField>
        {content.highlights.items.map((m, i) => (
          <div key={m.id || i} style={{ padding: 18, background: 'var(--color-ice-50)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>Macchina #{i + 1}</strong>
            <Grid cols={2}>
              <AField label="ID slot immagine" hint="Non modificare: collega l'immagine caricata">
                <AInput value={m.id} onChange={(e) => update(`highlights.items.${i}.id`, e.target.value)} />
              </AField>
              <AField label="Eyebrow (sopra il titolo)">
                <AInput value={m.eyebrow} onChange={(e) => update(`highlights.items.${i}.eyebrow`, e.target.value)} />
              </AField>
            </Grid>
            <AField label="Nome macchina">
              <AInput value={m.name} onChange={(e) => update(`highlights.items.${i}.name`, e.target.value)} />
            </AField>
            <AField label="Tagline (frase in corsivo)">
              <AInput value={m.tagline} onChange={(e) => update(`highlights.items.${i}.tagline`, e.target.value)} />
            </AField>
            <AField label="Descrizione completa">
              <ATextarea rows={3} value={m.desc} onChange={(e) => update(`highlights.items.${i}.desc`, e.target.value)} />
            </AField>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {(m.specs || []).map((spec, j) => (
                <div key={j} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <AInput value={spec[0]} onChange={(e) => {
                    const ns = m.specs.map((x, k) => (k === j ? [e.target.value, x[1]] : x));
                    update(`highlights.items.${i}.specs`, ns);
                  }} placeholder="Etichetta" />
                  <AInput value={spec[1]} onChange={(e) => {
                    const ns = m.specs.map((x, k) => (k === j ? [x[0], e.target.value] : x));
                    update(`highlights.items.${i}.specs`, ns);
                  }} placeholder="Valore" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Section>

      {/* ============================================================
          INDUSTRIES
          ============================================================ */}
      <Section title="Sezione settori" icon="briefcase" desc="La griglia con i settori che riforniamo. Le tile vengono dal database (sezione 'Categorie' del menu).">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.industries.eyebrow} onChange={(e) => update('industries.eyebrow', e.target.value)} />
          </AField>
          <AField label="Titolo">
            <AInput value={content.industries.title} onChange={(e) => update('industries.title', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Introduzione">
          <ATextarea rows={2} value={content.industries.intro} onChange={(e) => update('industries.intro', e.target.value)} />
        </AField>
      </Section>

      {/* ============================================================
          VIDEO AZIENDALE
          ============================================================ */}
      <Section title="Sezione video aziendale" icon="video" desc="La sezione blu con il player video. Per caricare un video usa il menu 'Video' nella sidebar.">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.video.eyebrow} onChange={(e) => update('video.eyebrow', e.target.value)} />
          </AField>
          <AField label="CTA (bottone blu)">
            <AInput value={content.video.cta} onChange={(e) => update('video.cta', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Titolo">
          <AInput value={content.video.title} onChange={(e) => update('video.title', e.target.value)} />
        </AField>
        <AField label="Sottotitolo">
          <ATextarea rows={2} value={content.video.subtitle} onChange={(e) => update('video.subtitle', e.target.value)} />
        </AField>
        <Grid cols={2}>
          <AField label="Etichetta file (nel player)">
            <AInput value={content.video.placeholderLabel} onChange={(e) => update('video.placeholderLabel', e.target.value)} />
          </AField>
          <AField label="Località (sotto il player)">
            <AInput value={content.video.locationLabel} onChange={(e) => update('video.locationLabel', e.target.value)} />
          </AField>
        </Grid>
        <SubSection title="Righe info (sotto il sottotitolo)">
          {content.video.rows.map((r, i) => (
            <Grid key={i} cols={3}>
              <AField label="Icona (lucide)">
                <AInput value={r.icon} onChange={(e) => update(`video.rows.${i}.icon`, e.target.value)} />
              </AField>
              <AField label="Etichetta">
                <AInput value={r.label} onChange={(e) => update(`video.rows.${i}.label`, e.target.value)} />
              </AField>
              <AField label="Valore">
                <AInput value={r.value} onChange={(e) => update(`video.rows.${i}.value`, e.target.value)} />
              </AField>
            </Grid>
          ))}
        </SubSection>
      </Section>

      {/* ============================================================
          FORMAZIONE
          ============================================================ */}
      <Section title="Sezione formazione e corsi" icon="graduation-cap" desc="I corsi vengono dal database. Qui modifichi solo i testi della sezione.">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.formazione.eyebrow} onChange={(e) => update('formazione.eyebrow', e.target.value)} />
          </AField>
          <AField label="Titolo">
            <AInput value={content.formazione.title} onChange={(e) => update('formazione.title', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Introduzione">
          <ATextarea rows={2} value={content.formazione.intro} onChange={(e) => update('formazione.intro', e.target.value)} />
        </AField>
        <SubSection title="Statistiche">
          {content.formazione.stats.map((s, i) => (
            <Grid key={i} cols={2}>
              <AField label={`Valore #${i + 1}`}>
                <AInput value={s.value} onChange={(e) => update(`formazione.stats.${i}.value`, e.target.value)} />
              </AField>
              <AField label="Etichetta">
                <AInput value={s.label} onChange={(e) => update(`formazione.stats.${i}.label`, e.target.value)} />
              </AField>
            </Grid>
          ))}
        </SubSection>
        <Grid cols={2}>
          <AField label="Titolo conclusivo">
            <AInput value={content.formazione.closingTitle} onChange={(e) => update('formazione.closingTitle', e.target.value)} />
          </AField>
          <AField label="Sottotitolo conclusivo">
            <AInput value={content.formazione.closingSubtitle} onChange={(e) => update('formazione.closingSubtitle', e.target.value)} />
          </AField>
        </Grid>
        <Grid cols={2}>
          <AField label="CTA brochure">
            <AInput value={content.formazione.ctaBrochure} onChange={(e) => update('formazione.ctaBrochure', e.target.value)} />
          </AField>
          <AField label="CTA richiesta corso">
            <AInput value={content.formazione.ctaRequest} onChange={(e) => update('formazione.ctaRequest', e.target.value)} />
          </AField>
        </Grid>
      </Section>

      {/* ============================================================
          PRODOTTI IN EVIDENZA
          ============================================================ */}
      <Section title="Prodotti in evidenza" icon="package" desc="I prodotti vengono dal database. Qui modifichi solo i testi della sezione.">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.featured.eyebrow} onChange={(e) => update('featured.eyebrow', e.target.value)} />
          </AField>
          <AField label="CTA">
            <AInput value={content.featured.ctaAll} onChange={(e) => update('featured.ctaAll', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Titolo">
          <AInput value={content.featured.title} onChange={(e) => update('featured.title', e.target.value)} />
        </AField>
      </Section>

      {/* ============================================================
          QUOTE CTA
          ============================================================ */}
      <Section title="CTA finale (sezione preventivo)" icon="file-text" desc="La sezione blu in fondo alla home con i contatti per richiedere un preventivo.">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.quoteCta.eyebrow} onChange={(e) => update('quoteCta.eyebrow', e.target.value)} />
          </AField>
          <AField label="Titolo">
            <AInput value={content.quoteCta.title} onChange={(e) => update('quoteCta.title', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Sottotitolo">
          <ATextarea rows={2} value={content.quoteCta.subtitle} onChange={(e) => update('quoteCta.subtitle', e.target.value)} />
        </AField>
        <Grid cols={2}>
          <AField label="Etichetta bottone telefono">
            <AInput value={content.quoteCta.callLabel} onChange={(e) => update('quoteCta.callLabel', e.target.value)} />
          </AField>
          <AField label="Etichetta bottone email">
            <AInput value={content.quoteCta.emailLabel} onChange={(e) => update('quoteCta.emailLabel', e.target.value)} />
          </AField>
        </Grid>
      </Section>

      {/* ============================================================
          CONTACT PAGE
          ============================================================ */}
      <Section title="Pagina contatti" icon="mail" desc="I testi della pagina /contact.">
        <Grid cols={2}>
          <AField label="Eyebrow">
            <AInput value={content.contactPage.eyebrow} onChange={(e) => update('contactPage.eyebrow', e.target.value)} />
          </AField>
          <AField label="Titolo">
            <AInput value={content.contactPage.title} onChange={(e) => update('contactPage.title', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Introduzione">
          <ATextarea rows={2} value={content.contactPage.intro} onChange={(e) => update('contactPage.intro', e.target.value)} />
        </AField>
        <SubSection title="Quick stats (riquadri laterali)">
          <Grid cols={3}>
            <AField label="Etichetta #1">
              <AInput value={content.contactPage.quickStat1Label} onChange={(e) => update('contactPage.quickStat1Label', e.target.value)} />
            </AField>
            <AField label="Valore #1">
              <AInput value={content.contactPage.quickStat1Value} onChange={(e) => update('contactPage.quickStat1Value', e.target.value)} />
            </AField>
            <AField label="Sottoetichetta #1">
              <AInput value={content.contactPage.quickStat1Small} onChange={(e) => update('contactPage.quickStat1Small', e.target.value)} />
            </AField>
          </Grid>
          <Grid cols={3}>
            <AField label="Etichetta #2">
              <AInput value={content.contactPage.quickStat2Label} onChange={(e) => update('contactPage.quickStat2Label', e.target.value)} />
            </AField>
            <AField label="Valore #2">
              <AInput value={content.contactPage.quickStat2Value} onChange={(e) => update('contactPage.quickStat2Value', e.target.value)} />
            </AField>
            <AField label="Sottoetichetta #2">
              <AInput value={content.contactPage.quickStat2Small} onChange={(e) => update('contactPage.quickStat2Small', e.target.value)} />
            </AField>
          </Grid>
        </SubSection>
        <AField label="Nota sotto al bottone invio">
          <ATextarea rows={2} value={content.contactPage.submitNote} onChange={(e) => update('contactPage.submitNote', e.target.value)} />
        </AField>
      </Section>

      {/* ============================================================
          UTILITY HEADER
          ============================================================ */}
      <Section title="Barra utility (sopra al menu)" icon="settings" desc="I link e le scritte nella barretta in alto del sito (desktop).">
        <Grid cols={3}>
          <AField label="Condizioni di vendita">
            <AInput value={content.utility.salesTerms} onChange={(e) => update('utility.salesTerms', e.target.value)} />
          </AField>
          <AField label="Condizioni di garanzia">
            <AInput value={content.utility.warrantyTerms} onChange={(e) => update('utility.warrantyTerms', e.target.value)} />
          </AField>
          <AField label="Area riservata">
            <AInput value={content.utility.tradeArea} onChange={(e) => update('utility.tradeArea', e.target.value)} />
          </AField>
        </Grid>
      </Section>

      {/* ============================================================
          IMAGES
          ============================================================ */}
      <Section title="Immagini landing" icon="image" desc="Carica le foto reali al posto dei segnaposto. Vengono pubblicate online e viste da tutti i visitatori.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {IMAGE_SLOTS.map((s) => (
            <ImageSlotEditor key={s.id} slot={s} content={content} />
          ))}
        </div>
      </Section>

      {/* ============================================================
          ABOUT / SERVIZI / VIDEO PAGE
          ============================================================ */}
      <Section title="Pagina &quot;Azienda&quot;" icon="building-2" desc="Testi della pagina /azienda raggiungibile dal menu principale.">
        <Grid cols={2}>
          <AField label="Eyebrow"><AInput value={content.pages.about.eyebrow} onChange={(e) => update('pages.about.eyebrow', e.target.value)} /></AField>
          <AField label="Titolo"><AInput value={content.pages.about.title} onChange={(e) => update('pages.about.title', e.target.value)} /></AField>
        </Grid>
        <AField label="Introduzione (paragrafo principale)">
          <ATextarea rows={3} value={content.pages.about.intro} onChange={(e) => update('pages.about.intro', e.target.value)} />
        </AField>
        <SubSection title="Valori (4 card)">
          {content.pages.about.values.map((v, i) => (
            <div key={i} style={{ padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Grid cols={3}>
                <AField label="Icona (lucide)"><AInput value={v.icon} onChange={(e) => update(`pages.about.values.${i}.icon`, e.target.value)} /></AField>
                <AField label="Titolo" span={2}><AInput value={v.title} onChange={(e) => update(`pages.about.values.${i}.title`, e.target.value)} /></AField>
              </Grid>
              <AField label="Descrizione"><ATextarea rows={2} value={v.desc} onChange={(e) => update(`pages.about.values.${i}.desc`, e.target.value)} /></AField>
            </div>
          ))}
        </SubSection>
      </Section>

      <Section title="Pagina &quot;Servizi&quot;" icon="wrench" desc="Testi della pagina /servizi. Le voci possono essere richiamate anche dai link del footer (ancore).">
        <Grid cols={2}>
          <AField label="Eyebrow"><AInput value={content.pages.services.eyebrow} onChange={(e) => update('pages.services.eyebrow', e.target.value)} /></AField>
          <AField label="Titolo"><AInput value={content.pages.services.title} onChange={(e) => update('pages.services.title', e.target.value)} /></AField>
        </Grid>
        <AField label="Introduzione"><ATextarea rows={2} value={content.pages.services.intro} onChange={(e) => update('pages.services.intro', e.target.value)} /></AField>
        <SubSection title="Servizi (card)">
          {content.pages.services.items.map((it, i) => (
            <div key={i} style={{ padding: 12, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Grid cols={3}>
                <AField label="ID (per link footer)"><AInput value={it.id} onChange={(e) => update(`pages.services.items.${i}.id`, e.target.value)} /></AField>
                <AField label="Icona"><AInput value={it.icon} onChange={(e) => update(`pages.services.items.${i}.icon`, e.target.value)} /></AField>
                <AField label="Titolo"><AInput value={it.title} onChange={(e) => update(`pages.services.items.${i}.title`, e.target.value)} /></AField>
              </Grid>
              <AField label="Descrizione"><ATextarea rows={2} value={it.desc} onChange={(e) => update(`pages.services.items.${i}.desc`, e.target.value)} /></AField>
            </div>
          ))}
        </SubSection>
      </Section>

      <Section title="Sezione video (dentro pagina Azienda)" icon="video" desc="Il blocco con titolo, intro e iframe video che ora vive nella pagina /azienda.">
        <Grid cols={2}>
          <AField label="Eyebrow"><AInput value={content.pages.videoPage.eyebrow} onChange={(e) => update('pages.videoPage.eyebrow', e.target.value)} /></AField>
          <AField label="Titolo"><AInput value={content.pages.videoPage.title} onChange={(e) => update('pages.videoPage.title', e.target.value)} /></AField>
        </Grid>
        <AField label="Introduzione"><ATextarea rows={2} value={content.pages.videoPage.intro} onChange={(e) => update('pages.videoPage.intro', e.target.value)} /></AField>
        <Grid cols={2}>
          <AField label="Titolo embed video"><AInput value={content.pages.videoPage.embedTitle} onChange={(e) => update('pages.videoPage.embedTitle', e.target.value)} /></AField>
          <AField label="URL embed (YouTube/Vimeo)" hint="Lascia vuoto per mostrare il placeholder">
            <AInput value={content.pages.videoPage.embedUrl} onChange={(e) => update('pages.videoPage.embedUrl', e.target.value)} placeholder="https://www.youtube.com/embed/..." />
          </AField>
        </Grid>
        <AField label="CTA (bottone)"><AInput value={content.pages.videoPage.cta} onChange={(e) => update('pages.videoPage.cta', e.target.value)} /></AField>
      </Section>

      {/* ============================================================
          LEGAL PAGES
          ============================================================ */}
      <Section title="Pagine legali" icon="shield" desc="Privacy, cookie, termini, condizioni di vendita, garanzia. Ogni pagina è composta da titolo, sottotitolo e sezioni (titolo + paragrafi).">
        {[
          ['salesTerms', 'Condizioni di vendita'],
          ['warranty', 'Garanzia'],
          ['privacy', 'Privacy policy'],
          ['cookie', 'Cookie policy'],
          ['terms', "Termini d'uso"],
        ].map(([slug, label]) => (
          <LegalPageEditor key={slug} slug={slug} label={label} page={content.legalPages[slug]} update={update} />
        ))}
      </Section>

      <PublishBanner />
    </AdminPage>
  );
}

function PublishBanner() {
  const status = useRemoteSaveStatus();
  let bg = 'var(--color-mint-50)';
  let border = 'var(--color-mint-300)';
  let iconColor = 'var(--color-mint-700)';
  let icon = 'check-circle';
  let title = 'Modifiche pubblicate online';
  let desc = "Ogni modifica viene salvata su Supabase e vista da tutti i visitatori del sito appena ricarichi la pagina.";

  if (!isSupabaseConfigured) {
    bg = 'var(--color-warning-100)';
    border = 'var(--color-warning-500)';
    iconColor = 'var(--color-warning-500)';
    icon = 'alert-triangle';
    title = 'Solo modalità locale';
    desc = "Supabase non è configurato in questo ambiente: le modifiche restano sul tuo browser. Configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY per pubblicare online.";
  } else if (status.status === 'error') {
    bg = 'var(--color-danger-100)';
    border = 'var(--color-danger-500)';
    iconColor = 'var(--color-danger-500)';
    icon = 'alert-circle';
    title = 'Pubblicazione fallita';
    desc = `Le modifiche sono salvate localmente ma non sono state pubblicate online. ${status.error || ''}`;
  } else if (status.status === 'saving') {
    title = 'Pubblicazione in corso…';
    desc = 'Sto inviando le modifiche al server.';
  }

  return (
    <div style={{ marginTop: 32, padding: '18px 22px', background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
      <AdminIcon name={icon} size={18} color={iconColor} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, color: 'var(--fg-primary)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>{desc}</div>
      </div>
      <ABtn variant="secondary" icon={<AdminIcon name="external-link" size={13} />} onClick={() => window.open('/', '_blank')}>Vedi sito</ABtn>
    </div>
  );
}

function LegalPageEditor({ slug, label, page, update }) {
  if (!page) return null;
  const path = `legalPages.${slug}`;
  return (
    <details style={{ background: 'var(--color-ice-50)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
      <summary style={{ cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, color: 'var(--fg-primary)' }}>{label} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)', marginLeft: 6 }}>/{slug === 'salesTerms' ? 'condizioni-vendita' : slug === 'warranty' ? 'garanzia' : slug === 'terms' ? 'termini' : slug}</span></summary>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Grid cols={2}>
          <AField label="Titolo"><AInput value={page.title} onChange={(e) => update(`${path}.title`, e.target.value)} /></AField>
          <AField label="Sottotitolo"><AInput value={page.subtitle} onChange={(e) => update(`${path}.subtitle`, e.target.value)} /></AField>
        </Grid>
        {(page.sections || []).map((s, i) => (
          <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 12, color: 'var(--fg-muted)', letterSpacing: '0.06em' }}>Sezione #{i + 1}</strong>
              <ABtn size="sm" variant="ghost" icon={<AdminIcon name="trash-2" size={12} />} onClick={() => update(`${path}.sections`, page.sections.filter((_, j) => j !== i))}>Rimuovi</ABtn>
            </div>
            <AField label="Titolo sezione"><AInput value={s.heading} onChange={(e) => update(`${path}.sections.${i}.heading`, e.target.value)} /></AField>
            <AField label="Paragrafi (uno per riga)">
              <ATextarea
                rows={4}
                value={(s.paragraphs || []).join('\n\n')}
                onChange={(e) => update(`${path}.sections.${i}.paragraphs`, e.target.value.split(/\n\n+/).map(p => p.trim()).filter(Boolean))}
              />
            </AField>
          </div>
        ))}
        <ABtn variant="secondary" icon={<AdminIcon name="plus" size={13} />} onClick={() => update(`${path}.sections`, [...(page.sections || []), { heading: 'Nuova sezione', paragraphs: [''] }])}>Aggiungi sezione</ABtn>
      </div>
    </details>
  );
}

/* ============================================================
   Shared editor pieces
   ============================================================ */
function Section({ title, icon, desc, children }) {
  return (
    <Panel padding={0}>
      <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--color-teal-50)', color: 'var(--color-teal-500)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <AdminIcon name={icon} size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 17, color: 'var(--fg-primary)' }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--fg-muted)', marginTop: 4, lineHeight: 1.55 }}>{desc}</div>
        </div>
      </div>
      <div style={{ padding: '20px 24px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </Panel>
  );
}

function SubSection({ title, children }) {
  return (
    <div style={{ padding: 14, background: 'var(--color-ice-50)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-teal-500)' }}>{title}</div>
      {children}
    </div>
  );
}

function Grid({ cols, children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
      {children}
    </div>
  );
}

function SaveIndicator() {
  const status = useRemoteSaveStatus();
  const map = {
    idle:        { label: 'Pronto · salvataggio cloud attivo', color: 'var(--fg-muted)', dot: 'var(--color-ice-400)' },
    saving:      { label: 'Pubblicazione in corso…', color: 'var(--color-teal-500)', dot: 'var(--color-teal-500)' },
    saved:       { label: 'Pubblicato online', color: 'var(--color-mint-700)', dot: 'var(--color-mint-500)' },
    error:       { label: 'Errore pubblicazione', color: 'var(--color-danger-500)', dot: 'var(--color-danger-500)' },
    'local-only':{ label: 'Solo locale (Supabase non configurato)', color: 'var(--color-warning-500)', dot: 'var(--color-warning-500)' },
  };
  const m = map[status.status] || map.idle;
  const time = status.at ? ` · ${new Date(status.at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}` : '';
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: m.color, display: 'inline-flex', alignItems: 'center', gap: 5 }} title={status.error || ''}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot }} />
      {m.label}{(status.status === 'saved' || status.status === 'saving') && time}
    </span>
  );
}

function CloudStatusBanner() {
  const [state, setState] = useState({ ok: null, stage: 'loading', message: 'Verifica collegamento Supabase…' });
  const [copied, setCopied] = useState(null);

  const run = async () => {
    setState((s) => ({ ...s, stage: 'loading', message: 'Verifica collegamento Supabase…' }));
    const r = await probeSiteContentSetup();
    setState(r);
  };

  useEffect(() => { run(); }, []);

  const copySql = async (which, sql) => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(which);
      setTimeout(() => setCopied(null), 2200);
    } catch {
      alert("Impossibile copiare. Apri il file dal repo manualmente.");
    }
  };

  const sqlEditorUrl = 'https://supabase.com/dashboard/project/_/sql/new';

  // Palette by status
  const PALETTE = {
    loading: { bg: 'var(--color-ice-50)', border: 'var(--border-default)', fg: 'var(--fg-muted)', icon: 'loader', iconColor: 'var(--fg-muted)' },
    ready:   { bg: 'var(--color-mint-50)', border: 'var(--color-mint-300)', fg: 'var(--color-mint-800)', icon: 'check-circle', iconColor: 'var(--color-mint-700)' },
    env:     { bg: 'var(--color-warning-100)', border: 'var(--color-warning-500)', fg: 'var(--fg-primary)', icon: 'alert-triangle', iconColor: 'var(--color-warning-500)' },
    migration_0002: { bg: 'var(--color-danger-100)', border: 'var(--color-danger-500)', fg: 'var(--fg-primary)', icon: 'alert-circle', iconColor: 'var(--color-danger-500)' },
    bucket:  { bg: 'var(--color-danger-100)', border: 'var(--color-danger-500)', fg: 'var(--fg-primary)', icon: 'alert-circle', iconColor: 'var(--color-danger-500)' },
  };
  const p = PALETTE[state.stage] || PALETTE.loading;

  return (
    <div style={{ padding: '16px 20px', background: p.bg, border: `1px solid ${p.border}`, borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <AdminIcon name={p.icon} size={20} color={p.iconColor} />
      <div style={{ flex: 1, fontSize: 13, color: p.fg, lineHeight: 1.6 }}>
        <BannerHeader stage={state.stage} />
        <BannerBody
          stage={state.stage}
          message={state.message}
          raw={state.raw}
          copied={copied}
          onCopy={copySql}
          sqlEditorUrl={sqlEditorUrl}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', flexShrink: 0 }}>
        <ABtn size="sm" variant={state.ok ? 'ghost' : 'secondary'} icon={<AdminIcon name="refresh-cw" size={12} />} onClick={run}>Riprova</ABtn>
        {(state.stage === 'migration_0002' || state.stage === 'bucket') && (
          <a href={sqlEditorUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--color-teal-500)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            SQL editor <AdminIcon name="external-link" size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

function BannerHeader({ stage }) {
  const titles = {
    loading: 'Sto verificando il collegamento…',
    ready: 'Pubblicazione online attiva',
    env: 'Variabili ambiente mancanti',
    migration_0002: 'Attivazione cloud — 2 step rimanenti',
    bucket: 'Bucket immagini mancante',
  };
  return (
    <b style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'inherit', display: 'block', marginBottom: 4 }}>
      {titles[stage] || 'Stato Supabase'}
    </b>
  );
}

function BannerBody({ stage, message, raw, copied, onCopy, sqlEditorUrl }) {
  if (stage === 'ready') {
    return (
      <span>
        Le modifiche che fai qui finiscono su Supabase e diventano visibili a tutti i visitatori del sito appena ricaricano la pagina.
      </span>
    );
  }
  if (stage === 'loading') {
    return <span style={{ opacity: 0.7 }}>{message}</span>;
  }
  if (stage === 'env') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span>Il sito non ha le credenziali Supabase, quindi le modifiche restano sul tuo browser e non sono pubblicate online.</span>
        <span>
          Apri il file <code style={Kbd}>.env.local</code> nella radice del progetto e compila:
        </span>
        <pre style={CodeBlock}>
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...la-tua-anon-key...`}
        </pre>
        <span>Trovi i valori in <b>Supabase Dashboard → Project Settings → API</b>. Dopo salvato, riavvia il dev server o rilancia il deploy.</span>
      </div>
    );
  }
  // migration_0002 or bucket — both fixable by the same migration.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span>
        Il database Supabase è collegato ma manca la tabella <code style={Kbd}>site_content</code> (e il bucket <code style={Kbd}>landing-images</code>). Bastano 2 step da 1 minuto totale per attivare la pubblicazione online.
      </span>
      <div style={{ marginTop: 6, padding: '12px 14px', background: 'var(--bg-surface)', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Step
          n={1}
          title="Lancia la migration 0002_site_content.sql"
          body="Crea la tabella che ospita i contenuti della landing + il bucket immagini."
          actions={[
            { label: copied === '0002' ? 'SQL copiato ✓' : 'Copia SQL', icon: 'copy', onClick: () => onCopy('0002', migration0002Sql) },
            { label: 'Apri SQL editor', icon: 'external-link', href: sqlEditorUrl },
          ]}
        />
        <Step
          n={2}
          title="Lancia la migration 0003_clear_products.sql"
          body="Svuota i prodotti finti rimasti dal seed, così inserisci i tuoi dall'admin."
          actions={[
            { label: copied === '0003' ? 'SQL copiato ✓' : 'Copia SQL', icon: 'copy', onClick: () => onCopy('0003', migration0003Sql) },
            { label: 'Apri SQL editor', icon: 'external-link', href: sqlEditorUrl },
          ]}
        />
        <Step
          n={3}
          title="Torna qui e clicca «Riprova»"
          body='Il banner diventa verde quando tutto è collegato.'
        />
      </div>
      {raw && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>Errore Supabase: {raw}</span>}
    </div>
  );
}

function Step({ n, title, body, actions = [] }) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--color-teal-500)', color: 'var(--color-white)', display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{n}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 500, color: 'var(--fg-primary)' }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>{body}</div>
        {actions.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {actions.map((a, i) => a.href ? (
              <a key={i} href={a.href} target="_blank" rel="noopener noreferrer" style={LinkBtn}>
                <AdminIcon name={a.icon} size={11} /> {a.label}
              </a>
            ) : (
              <button key={i} onClick={a.onClick} style={LinkBtn}>
                <AdminIcon name={a.icon} size={11} /> {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const Kbd = {
  fontFamily: 'var(--font-mono)', fontSize: 12,
  background: 'var(--color-ice-100)', padding: '1px 6px',
  borderRadius: 3, color: 'var(--fg-primary)',
};

const CodeBlock = {
  fontFamily: 'var(--font-mono)', fontSize: 12,
  background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-sm)', padding: '10px 12px',
  whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, color: 'var(--fg-primary)',
};

const LinkBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  padding: '5px 10px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
  color: 'var(--color-teal-500)', background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
  cursor: 'pointer', textDecoration: 'none',
};

function CertificationEditor({ items, onChange }) {
  const [val, setVal] = useState('');
  return (
    <SubSection title="Certificazioni (badge nel footer)">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {items.map((c, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--color-mint-50)', border: '1px solid var(--color-mint-300)', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-mint-800)', fontWeight: 600 }}>
            {c}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-mint-700)', padding: 0, display: 'grid', placeItems: 'center' }} title="Rimuovi">
              <AdminIcon name="x" size={12} />
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <AInput
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && val.trim()) {
              e.preventDefault();
              onChange([...items, val.trim()]);
              setVal('');
            }
          }}
          placeholder="Es. ISO 9001"
        />
        <ABtn variant="secondary" onClick={() => { if (val.trim()) { onChange([...items, val.trim()]); setVal(''); } }}>Aggiungi</ABtn>
      </div>
    </SubSection>
  );
}

function SocialEditor({ socials, onChange }) {
  return (
    <SubSection title="Social network (lascia vuoto per nascondere il link)">
      <Grid cols={2}>
        <AField label="Facebook">
          <AInput value={socials.facebook || ''} onChange={(e) => onChange({ ...socials, facebook: e.target.value })} placeholder="https://facebook.com/..." />
        </AField>
        <AField label="Instagram">
          <AInput value={socials.instagram || ''} onChange={(e) => onChange({ ...socials, instagram: e.target.value })} placeholder="https://instagram.com/..." />
        </AField>
        <AField label="LinkedIn">
          <AInput value={socials.linkedin || ''} onChange={(e) => onChange({ ...socials, linkedin: e.target.value })} placeholder="https://linkedin.com/..." />
        </AField>
        <AField label="YouTube">
          <AInput value={socials.youtube || ''} onChange={(e) => onChange({ ...socials, youtube: e.target.value })} placeholder="https://youtube.com/..." />
        </AField>
      </Grid>
    </SubSection>
  );
}

function ImageSlotEditor({ slot, content }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [done, setDone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const current = resolveImageSlot(content, slot.id);

  const handleFile = async (file) => {
    if (!file) return;
    if (!isSupabaseConfigured) {
      setErr('Supabase non configurato — impossibile pubblicare la foto online.');
      return;
    }
    setBusy(true); setErr(null); setDone(false);
    try {
      // Delete the previous storage object if any.
      if (current?.storage_path) {
        await deleteLandingImage(current.storage_path).catch(() => {});
      }
      const uploaded = await uploadLandingImage(slot.id, file);
      setSiteContent((c) => ({
        ...c,
        images: { ...(c.images || {}), [slot.id]: uploaded },
      }));
      setDone(true);
      setTimeout(() => setDone(false), 2600);
    } catch (e) {
      setErr(e.message || 'Errore durante il caricamento. Riprova.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const clearImage = async () => {
    if (!confirm('Rimuovere questa foto dal sito?')) return;
    if (current?.storage_path) {
      await deleteLandingImage(current.storage_path).catch(() => {});
    }
    setSiteContent((c) => ({
      ...c,
      images: { ...(c.images || {}), [slot.id]: null },
    }));
    // Also clear legacy localStorage fallback so it doesn't reappear.
    try { localStorage.removeItem(`imgslot:${slot.id}`); } catch { /* */ }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      style={{
        background: dragOver ? 'var(--color-mint-50)' : 'var(--bg-surface)',
        border: dragOver ? '2px dashed var(--color-mint-500)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)', padding: 14,
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'background var(--motion-fast), border-color var(--motion-fast)',
      }}
    >
      <div
        onClick={() => !busy && inputRef.current?.click()}
        role="button"
        title={current ? 'Clicca per sostituire la foto' : 'Clicca o trascina qui una foto'}
        style={{
          aspectRatio: '16/9', background: 'var(--color-ice-100)', borderRadius: 'var(--radius-sm)',
          overflow: 'hidden', display: 'grid', placeItems: 'center', position: 'relative',
          cursor: busy ? 'wait' : 'pointer',
        }}
      >
        {current ? (
          <img src={current.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: busy ? 0.4 : 1, transition: 'opacity var(--motion-fast)' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--fg-muted)', padding: 12, textAlign: 'center' }}>
            <AdminIcon name="image-plus" size={30} />
            <span style={{ fontSize: 12, lineHeight: 1.45 }}>Trascina qui la foto<br />oppure clicca per sceglierla</span>
          </div>
        )}
        {busy && (
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.55)' }}>
            <span className="cv-anim-spin" style={{ width: 26, height: 26, border: '3px solid var(--color-ice-200)', borderTopColor: 'var(--color-mint-500)', borderRadius: '50%' }} />
          </div>
        )}
        {done && !busy && (
          <div className="cv-anim-scale-in" style={{ position: 'absolute', top: 10, right: 10, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'var(--color-success-500)', color: 'var(--color-white)', fontSize: 11, fontWeight: 600 }}>
            <AdminIcon name="check" size={12} /> Pubblicata
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--fg-primary)' }}>{slot.label}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{slot.desc}</div>
        {current?.legacy && (
          <div style={{ fontSize: 10, color: 'var(--color-warning-500)', fontFamily: 'var(--font-mono)' }}>
            Immagine locale legacy — ricarica per pubblicarla online.
          </div>
        )}
        {err && (
          <div style={{ fontSize: 12, color: 'var(--color-danger-500)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AdminIcon name="alert-circle" size={13} /> {err}
          </div>
        )}
        <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
          <ABtn size="sm" variant="secondary" icon={<AdminIcon name={busy ? 'loader' : 'upload'} size={12} />} onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? 'Carico…' : current ? 'Sostituisci foto' : 'Carica foto'}
          </ABtn>
          {current && !busy && (
            <ABtn size="sm" variant="ghost" icon={<AdminIcon name="trash-2" size={12} />} onClick={clearImage}>
              Rimuovi
            </ABtn>
          )}
        </div>
      </div>
    </div>
  );
}
