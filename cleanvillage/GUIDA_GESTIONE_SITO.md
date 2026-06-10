# Guida alla gestione del sito — per chi non programma

Questa guida spiega come gestire **cleanvillage.it** dal pannello di
amministrazione, senza toccare una riga di codice.

---

## 1. Entrare nel pannello

1. Apri il sito e clicca **"Area riservata"** in alto a destra (oppure vai
   direttamente su `tuosito.it/admin`).
2. Inserisci email e password del tuo account amministratore.
   - L'account si crea una sola volta da **Supabase → Authentication → Users →
     Add user** (chiedi a chi ha fatto il primo setup, o segui
     `SUPABASE_SETUP.md`).

> Se in alto vedi un banner giallo/rosso, il pannello ti dice esattamente cosa
> manca e come sistemarlo (con i pulsanti "Copia SQL" e "Apri SQL editor").
> Quando il banner è verde, tutto ciò che modifichi va online in tempo reale.

---

## 2. Cambiare testi e foto della home — "Editor sito"

Menu laterale → **Editor sito**.

- **Testi**: ogni sezione della home ha i suoi campi (titolo, sottotitolo,
  bottoni…). Scrivi e basta: il salvataggio è automatico, in alto vedi
  "Pubblicato online" con l'orario.
- **Foto**: scendi alla sezione **"Immagini landing"**. Per ogni riquadro:
  - **trascina la foto** direttamente dentro al riquadro, *oppure* clicca il
    riquadro e scegli il file dal computer;
  - formati accettati: JPG, PNG, WEBP, AVIF, GIF — massimo 8 MB;
  - quando vedi il badge verde **"Pubblicata"**, la foto è online per tutti;
  - **"Rimuovi"** cancella la foto e fa tornare la grafica segnaposto.
- **"Ripristina default"** (in alto a destra) riporta tutti i testi della home
  ai valori originali. Va usato solo se vuoi davvero ripartire da zero.

---

## 3. Prodotti del catalogo

Menu laterale → **Prodotti**.

- **Nuovo prodotto**: bottone in alto a destra, compila nome, codice (SKU),
  marchio, categoria, prezzo, disponibilità.
- **Foto prodotto**: dentro la scheda prodotto carichi una o più foto e scegli
  quella **principale** (è quella che appare nel catalogo).
- **In evidenza**: le spunte "Featured"/"Highlighted" decidono quali prodotti
  appaiono nella home.

Le **Categorie** e i **Marchi** si gestiscono dalle rispettive voci di menu.

---

## 4. Video aziendale

Menu laterale → **Video**.

1. Carica il file video (MP4, WEBM o MOV — massimo 300 MB) e una copertina.
2. Imposta lo **spot** "Hero · Video Aziendale" per farlo apparire nel player
   della home.
3. Metti lo stato su **"live"**: solo i video live sono visibili al pubblico.

---

## 5. Richieste di preventivo

Menu laterale → **Preventivi** (o **Richieste contatto**).

Ogni volta che un cliente compila il modulo sul sito, la richiesta appare qui
con tutti i dati. Puoi cambiarne lo stato (nuova → contattata → preventivata →
chiusa) per tenere traccia del lavoro.

### Email automatiche (opzionale ma consigliato)

Per ricevere una **email a ogni nuova richiesta** (e mandare al cliente una
conferma automatica):

1. Crea un account gratuito su [resend.com](https://resend.com) e genera una
   **API key**.
2. Su **Vercel → il tuo progetto → Settings → Environment Variables** aggiungi
   `RESEND_API_KEY` con la chiave appena creata, poi rilancia il deploy.
   ⚠️ Non incollare mai la chiave dentro al pannello admin: i campi del
   pannello sono leggibili dal sito pubblico.
3. Nel pannello, vai su **Impostazioni** e:
   - controlla mittente, reply-to e indirizzo che riceve le notifiche;
   - personalizza i testi delle email (i `{segnaposto}` tipo `{company}`
     vengono sostituiti automaticamente con i dati del cliente);
   - metti **"Invio attivo" = Sì**.

Senza questo setup il sito funziona comunque: le richieste si salvano sempre
nel pannello, semplicemente non parte nessuna email.

---

## 6. Pagine legali, Azienda, Servizi

Tutto modificabile da **Editor sito**, in fondo alla pagina: privacy, cookie,
termini, condizioni di vendita, garanzia, più i testi delle pagine "Azienda" e
"Servizi".

---

## 7. Cosa fare se qualcosa non va

| Problema | Soluzione |
|---|---|
| "Solo modalità locale" in alto | Le credenziali Supabase non sono configurate sul deploy. Servono `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (vedi `.env.example`). |
| Una foto non si carica | Controlla formato (JPG/PNG/WEBP) e peso (max 8 MB). L'errore in rosso sotto al riquadro spiega il motivo. |
| "Pubblicazione fallita" | Quasi sempre è la connessione: riprova. Se persiste, fai logout/login dal pannello. |
| Non arrivano le email | Verifica che `RESEND_API_KEY` sia impostata su Vercel e che "Invio attivo" sia Sì in Impostazioni. |

---

## 8. Glossario minimo

- **Supabase** — il "database" del sito: contiene prodotti, foto, testi e
  richieste. Gratis per questo volume di traffico.
- **Vercel** — il servizio che pubblica il sito online a ogni modifica del
  codice.
- **Resend** — il servizio che spedisce le email automatiche.
- **SKU** — il codice articolo di un prodotto (es. `COM-IN100B`).
