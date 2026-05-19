import { useState, useRef } from 'react';
import { AdminPage, AdminIcon, ABtn, Panel, AField, AInput, ATextarea } from './chrome.jsx';
import {
  useSiteContent,
  setSiteContent,
  resetSiteContent,
  DEFAULT_CONTENT,
} from '../lib/siteContent.js';

const IMAGE_KEY_PREFIX = 'imgslot:';

const IMAGE_SLOTS = [
  { id: 'heroImage', label: 'Hero — immagine principale', desc: 'Visibile a destra del titolo nella prima sezione' },
  { id: 'hm-comac-innova', label: 'Macchina in evidenza · slot 1', desc: 'La prima delle tre macchine evidenziate (lavasciuga)' },
  { id: 'hm-karcher-hd', label: 'Macchina in evidenza · slot 2', desc: 'La seconda delle tre (idropulitrice)' },
  { id: 'hm-ghibli-vac', label: 'Macchina in evidenza · slot 3', desc: 'La terza delle tre (aspiraliquidi)' },
];

export default function LandingEditor() {
  const content = useSiteContent();
  const [savedAt, setSavedAt] = useState(null);

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
    setSavedAt(new Date());
  };

  const reset = () => {
    if (!confirm('Ripristinare tutti i testi e le immagini ai valori originali? Le immagini caricate verranno rimosse.')) return;
    resetSiteContent();
    // Also clear all image slot localStorage entries
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith(IMAGE_KEY_PREFIX))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    setSavedAt(new Date());
  };

  return (
    <AdminPage
      eyebrow="Contenuti landing"
      title="Editor sito"
      subtitle="Modifica i testi e le immagini della landing senza toccare il codice. Tutte le modifiche sono salvate automaticamente."
      actions={[
        <SaveIndicator key="s" savedAt={savedAt} />,
        <ABtn key="o" variant="secondary" icon={<AdminIcon name="external-link" size={13} />} onClick={() => window.open('/', '_blank')}>
          Vedi sito
        </ABtn>,
        <ABtn key="r" variant="danger" icon={<AdminIcon name="rotate-ccw" size={13} />} onClick={reset}>
          Ripristina default
        </ABtn>,
      ]}
    >
      <InfoBanner />

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
          <AField label="Titolo — tono umano" hint="Il default. La parola in verde è specificata sotto.">
            <ATextarea rows={2} value={content.hero.titleHuman} onChange={(e) => update('hero.titleHuman', e.target.value)} />
          </AField>
          <AField label="Parola in verde (tono umano)">
            <AInput value={content.hero.titleHumanAccent} onChange={(e) => update('hero.titleHumanAccent', e.target.value)} />
          </AField>
          <AField label="Titolo — tono tecnico" hint="Usato quando si attiva il tweak 'Tecnico'">
            <ATextarea rows={2} value={content.hero.titleTechnical} onChange={(e) => update('hero.titleTechnical', e.target.value)} />
          </AField>
          <AField label="Parola in verde (tono tecnico)">
            <AInput value={content.hero.titleTechnicalAccent} onChange={(e) => update('hero.titleTechnicalAccent', e.target.value)} />
          </AField>
        </Grid>
        <AField label="Sottotitolo (paragrafo sotto al titolo)">
          <ATextarea rows={3} value={content.hero.subtitle} onChange={(e) => update('hero.subtitle', e.target.value)} />
        </AField>
        <Grid cols={2}>
          <AField label="Bottone primario (verde)">
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

        <SubSection title="Badge offerta (riquadro verde piccolo in alto a sinistra)">
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
            <AField label="Disponibilità (badge verde)">
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
                  <option value="mint">Verde (mint)</option>
                  <option value="teal">Blu (teal)</option>
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
          <AField label="CTA (bottone verde)">
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
      <Section title="Immagini sito" icon="image" desc="Carica le foto reali al posto dei segnaposto.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {IMAGE_SLOTS.map((s) => (
            <ImageSlotEditor key={s.id} slot={s} onChange={() => setSavedAt(new Date())} />
          ))}
        </div>
      </Section>

      <div style={{ marginTop: 32, padding: '18px 22px', background: 'var(--color-mint-50)', border: '1px solid var(--color-mint-300)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <AdminIcon name="check-circle" size={18} color="var(--color-mint-700)" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 14, color: 'var(--color-mint-800)' }}>Modifiche salvate automaticamente</div>
          <div style={{ fontSize: 12, color: 'var(--fg-secondary)', marginTop: 2 }}>
            Tutte le modifiche sono salvate in locale nel browser e visibili immediatamente sul sito. Apri il sito in una nuova scheda per verificare.
          </div>
        </div>
        <ABtn variant="secondary" icon={<AdminIcon name="external-link" size={13} />} onClick={() => window.open('/', '_blank')}>Vedi sito</ABtn>
      </div>
    </AdminPage>
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

function SaveIndicator({ savedAt }) {
  if (!savedAt) return <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>Pronto</span>;
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-mint-700)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-mint-500)' }} />
      Salvato {savedAt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
    </span>
  );
}

function InfoBanner() {
  return (
    <div style={{ padding: '16px 20px', background: 'var(--color-teal-50)', border: '1px solid var(--color-teal-100)', borderRadius: 'var(--radius-md)', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <AdminIcon name="info" size={18} color="var(--color-teal-500)" />
      <div style={{ flex: 1, fontSize: 13, color: 'var(--color-teal-700)', lineHeight: 1.6 }}>
        <b style={{ color: 'var(--color-teal-500)', fontFamily: 'var(--font-display)' }}>Come funziona.</b>{' '}
        Ogni modifica è salvata automaticamente nel browser e visibile sul sito appena ricarichi la pagina.
        I dati sono memorizzati localmente: questo significa che funzionano subito su questa macchina ma non vengono
        sincronizzati su altri dispositivi. Per la produzione consigliamo di trasferire le modifiche al codice o
        collegare un database — chiedi al tuo sviluppatore.
      </div>
    </div>
  );
}

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

function ImageSlotEditor({ slot, onChange }) {
  const inputRef = useRef(null);
  const key = `${IMAGE_KEY_PREFIX}${slot.id}`;
  // Read current image to render preview. Re-read on render so we reflect changes.
  let current = null;
  try { current = localStorage.getItem(key) || null; } catch { /* */ }

  const setImage = (dataUrl) => {
    try { localStorage.setItem(key, dataUrl); } catch { alert('Immagine troppo grande per essere salvata. Prova con una versione più piccola.'); return; }
    // Notify components that listen
    try { window.dispatchEvent(new CustomEvent('cv-site-content-changed')); } catch { /* */ }
    onChange?.();
  };

  const clearImage = () => {
    try { localStorage.removeItem(key); } catch { /* */ }
    try { window.dispatchEvent(new CustomEvent('cv-site-content-changed')); } catch { /* */ }
    onChange?.();
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', gap: 14 }}>
      <div style={{ width: 120, aspectRatio: '4/3', background: 'var(--color-ice-100)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, display: 'grid', placeItems: 'center', position: 'relative' }}>
        {current ? (
          <img src={current} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <AdminIcon name="image" size={28} color="var(--fg-muted)" />
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: 'var(--fg-primary)' }}>{slot.label}</div>
        <div style={{ fontSize: 11, color: 'var(--fg-muted)', lineHeight: 1.5 }}>{slot.desc}</div>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 6 }}>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
          <ABtn size="sm" variant="secondary" icon={<AdminIcon name="upload" size={12} />} onClick={() => inputRef.current?.click()}>
            {current ? 'Sostituisci' : 'Carica'}
          </ABtn>
          {current && (
            <ABtn size="sm" variant="ghost" icon={<AdminIcon name="trash-2" size={12} />} onClick={clearImage}>
              Rimuovi
            </ABtn>
          )}
        </div>
      </div>
    </div>
  );
}
