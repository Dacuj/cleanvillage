# Setup Supabase — CleanVillage

Guida passo passo per collegare il sito a un database Supabase reale,
caricare immagini per i prodotti e proteggere il pannello admin con login.

Tempo stimato: **10 minuti**.

---

## 1. Crea il progetto Supabase

1. Vai su https://supabase.com e accedi (puoi loggarti con GitHub).
2. Clicca **New project**.
3. Compila:
   - **Name**: `cleanvillage` (o quello che preferisci)
   - **Database password**: una password forte (salvala da qualche parte)
   - **Region**: `Frankfurt (eu-central-1)` o quella più vicina all'Italia
   - **Pricing plan**: Free
4. Aspetta ~2 minuti che il progetto si crei.

---

## 2. Esegui lo schema SQL

1. Nel dashboard del progetto, clicca **SQL Editor** nella sidebar.
2. Clicca **New query**.
3. Apri il file `supabase/migrations/0001_init.sql` di questo repo, copia tutto il contenuto, incollalo nell'editor.
4. Clicca **Run** (in basso a destra, o `⌘/Ctrl + Enter`).
5. Ripeti per `supabase/migrations/0002_site_content.sql` (tabella CMS della landing + bucket immagini).
6. Ripeti per `supabase/migrations/0003_clear_products.sql` (svuota i prodotti di esempio in modo da partire da zero).
7. Dovresti vedere `Success. No rows returned.` per ognuna.

### (Opzionale) Carica i dati iniziali di catalogo

1. Clicca di nuovo **New query**.
2. Apri `supabase/seed.sql`, copia tutto, incolla, **Run**. Questo popola
   categorie, marchi, settori, corsi e video di esempio.
3. **NB**: il seed include anche prodotti finti; se hai già lanciato la
   migration `0003_clear_products.sql` puoi rimuovere le righe `insert into
   products ...` dal seed prima di eseguirlo, oppure ri-lanciare la
   `0003` subito dopo per ripulire.

---

## 3. Crea l'utente admin

1. Vai su **Authentication › Users**.
2. Clicca **Add user › Create new user**.
3. Inserisci:
   - **Email**: la tua email
   - **Password**: una password forte
   - **Auto Confirm User**: ✅ attivo (altrimenti dovrai cliccare il link nella mail)
4. Clicca **Create user**.

Questo è l'account che userai per accedere a `/admin`.

---

## 4. Configura le variabili d'ambiente

1. Nel dashboard Supabase, vai su **Project Settings › API**.
2. Copia:
   - **Project URL** (es. `https://xxxxx.supabase.co`)
   - **anon public** key (la chiave lunga sotto "Project API keys")

3. Nel terminale, dentro la cartella `cleanvillage/`:
   ```bash
   cp .env.example .env.local
   ```

4. Apri `.env.local` con un editor e incolla i valori:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbG....la-tua-chiave....
   ```

5. **Importante:** non committare mai `.env.local`. È già nel `.gitignore`.

---

## 5. Riavvia il dev server

```bash
npm run dev
```

Apri `http://localhost:5173/admin`.

- Se non sei loggato vedrai la schermata di login. Inserisci le credenziali create al passo 3.
- Una volta loggato, vai su **Prodotti**, clicca su un prodotto e usa la sezione "Galleria immagini" per caricare le foto reali.

---

## Caricare immagini per i prodotti

1. `/admin/products` → clicca su un prodotto (es. "Innova 100 B").
2. Scrolla fino a **Galleria immagini**.
3. Trascina i file (PNG / JPG / WebP, max 4 MB) o clicca per selezionarli.
4. Vengono caricati nel bucket `product-images` di Supabase Storage e la prima immagine viene marcata come "principale".
5. Puoi:
   - Cambiare l'immagine principale con il bottone ⭐
   - Eliminare un'immagine con il bottone 🗑

Le immagini appaiono immediatamente nella card prodotto del catalogo e nella pagina prodotto.

---

## Gestione catalogo dal pannello admin

Tutte le sezioni `/admin/...` sono ora collegate al DB:

- **`/admin/landing`** — Editor sito: testi della landing + immagini + pagine
  Azienda / Servizi / Video / Privacy / Cookie / Termini / Condizioni di
  vendita / Garanzia. Le modifiche vengono pubblicate **online** (tabella
  `site_content`, bucket `landing-images`).
- **`/admin/products`** — Aggiungi/modifica/elimina SKU
- **`/admin/categories`** — Gestisci le categorie
- **`/admin/brands`** — Aggiungi/modifica i marchi distribuiti
- **`/admin/videos`** — Pubblica/spegni i video della landing
- **`/admin/quotes`** — Ricevi i preventivi inviati dal form contatti
- **`/admin/dashboard`** — KPI calcolati sui dati reali

---

## Modalità demo (senza Supabase)

Se apri il sito senza aver configurato `.env.local`, l'app funziona comunque
mostrando i dati di seed da `src/data.js`. L'admin è accessibile senza login
ma in sola lettura: non puoi salvare modifiche né caricare immagini.

Utile per sviluppare la UI o per fare una demo senza account Supabase.

---

## Costi

Il **tier gratuito** di Supabase è ampiamente sufficiente per partire:
- 500 MB di database
- 1 GB di storage (≈ 500 immagini prodotto da 2 MB)
- 50.000 utenti registrati
- 5 GB di bandwidth/mese

Il piano **Pro** ($25/mese) sblocca 8 GB di DB e 100 GB di storage quando il
catalogo cresce.

---

## Backup & sicurezza

- Le credenziali admin sono gestite da Supabase Auth (password hashate con bcrypt, login resistente a brute force).
- I bucket immagini sono **pubblici in lettura** (servono come CDN) ma **scrivibili solo da utenti autenticati**.
- Le Row Level Security (RLS) policies sono già attive: gli utenti non loggati non possono modificare nulla, ma possono leggere il catalogo pubblico.
- Per fare un backup: **Database › Backups** nel dashboard Supabase.

---

## Problemi comuni

**"Configura Supabase per salvare i prodotti"** → Manca il file `.env.local` o le variabili. Riavvia il dev server dopo averlo creato.

**Login non funziona** → Verifica che l'utente abbia "Auto Confirm" attivo nel dashboard Authentication, oppure clicca il link nella mail di conferma.

**Upload immagine errore 403** → Verifica di essere loggato. Le policy di storage richiedono autenticazione per scrivere.

**RLS error "new row violates row-level security"** → Esci e rifai login. Il token è scaduto.
