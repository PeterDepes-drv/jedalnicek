# 🍳 Rodinný Jedálniček & Nákupný Zoznam

Webová aplikácia pre domácnosť na plánovanie varenia, správu zásob a
automatické generovanie nákupného zoznamu — so zdieľaním naživo medzi
všetkými členmi rodiny cez vlastný self-hosted backend.

Frontend je čistý vanilla JS/HTML/CSS bez akéhokoľvek build kroku. Backend
je [PocketBase](https://pocketbase.io) — jeden malý Go binár, ktorý beží ako
vlastná služba (napr. v Coolify) a poskytuje databázu, autentifikáciu,
realtime synchronizáciu a AI proxy pre skenovanie fotiek.

---

## Architektúra

```
Jedalnicek/
├── index.html, app.js, style.css, config.js   ← frontend (statické súbory)
└── pocketbase/
    ├── pb_migrations/   ← schéma (8 kolekcií), aplikuje sa automaticky pri štarte
    ├── pb_hooks/        ← seed dát pri registrácii + AI proxy endpointy
    ├── Dockerfile        ← buildí PocketBase image pre Coolify
    └── .env.example      ← zoznam potrebných premenných prostredia
```

- **Dáta** (recepty, plán, nákupný zoznam, zásoby, mená členov, priania
  pomocníkov) žijú v PocketBase, naviazané na jednu `households` (domácnosť).
- **Prihlásenie**: jedna domácnosť = jeden účet (e-mail + heslo), nahrádza
  pôvodné "rodinné heslo".
- **Realtime**: zmeny sa medzi zariadeniami šíria naživo cez PocketBase SSE
  (`pb.collection(...).subscribe(...)`).
- **AI skener** (fotka receptu / chladničky): frontend nikdy nevidí Gemini
  kľúč — fotka ide na vlastný endpoint v PocketBase (`/api/ai/scan-recipe`,
  `/api/ai/scan-fridge`), ktorý zavolá Gemini s kľúčom uloženým len na
  serveri a má denný rate-limit na domácnosť.

---

## 1) Nasadenie PocketBase backendu (Coolify)

1. V Coolify vytvor novú službu typu **Dockerfile**, ukáž ju na priečinok
   `pocketbase/` v tomto repozitári (obsahuje `Dockerfile`).
2. Nastav perzistentný **volume**: `/pb/pb_data` (databáza + nahrané súbory).
   Bez toho sa dáta pri redeployi stratia.
3. V **Environment Variables** nastav (pozri `pocketbase/.env.example`):
   - `GEMINI_API_KEY` — tvoj Gemini kľúč (zadarmo na [Google AI Studio](https://aistudio.google.com/))
   - `AI_SCAN_DAILY_LIMIT` — napr. `15`
4. Priraď doménu, napr. `api.jedalnicek.depes.online`, zapni SSL (Coolify to
   spraví automaticky cez Let's Encrypt, rovnako ako pri n8n).
5. Deploy. Migrácie (`pb_migrations/`) a hooky (`pb_hooks/`) sa aplikujú
   automaticky pri štarte PocketBase — nemusíš nič klikať ručne.
6. Over, že beží: otvor `https://api.jedalnicek.depes.online/_/` — mal by sa
   zobraziť PocketBase admin login. Založ si tam admin účet (líši sa od
   účtov domácností — slúži len tebe na správu backendu).
7. V PocketBase Admin UI → **Settings → CORS** pridaj doménu, na ktorej
   beží frontend (napr. `https://jedalnicek.depes.online`), alebo `*` ak
   frontend hostuješ inde a nechceš riešiť presné originy (bezpečné, keďže
   appka nepoužíva cookies, len Bearer token).

### Overenie schémy

Po prvom štarte skontroluj v Admin UI (**Collections**), že existuje
8 kolekcií: `households`, `members`, `meals`, `weekly_plans`,
`shopping_items`, `pantry_items`, `suggestions`, `ai_scan_logs`.

> **Poznámka k verziám:** JS API PocketBase (migrácie, hooky) sa medzi
> minor verziami mierne mení. `Dockerfile` sťahuje verziu pripnutú v
> `ARG PB_VERSION` (over si na [releases stránke](https://github.com/pocketbase/pocketbase/releases),
> či existuje novšia, a prípadne uprav). Ak po nasadení migrácia zlyhá,
> pozri PocketBase logy v Coolify — chybová hláška zvyčajne priamo
> pomenuje, ktoré pole/API sa v danej verzii volá inak.

---

## 2) Konfigurácia frontendu

Uprav jediný riadok v [`config.js`](config.js):

```js
const PB_URL = "https://api.jedalnicek.depes.online";
```

Frontend potom stačí hostovať ako statické súbory (rovnako ako doteraz) —
buď dvojklikom na `index.html`, alebo cez lokálny server:

```bash
npm start
```
a otvoriť [http://localhost:3000](http://localhost:3000).

Pre produkciu odporúčam pridať frontend ako ďalšiu statickú službu v
Coolify (alebo ho hostovať kdekoľvek inde, keďže je to len HTML/CSS/JS bez
build kroku).

---

## 3) Prvé spustenie

1. Otvor appku — zobrazí sa prihlasovacia obrazovka.
2. Klikni **"Založiť novú domácnosť"**, zadaj názov, e-mail a heslo.
3. Po registrácii sa automaticky založí 4 členovia (Mama/Otec/Člen 1/Člen 2),
   15 vzorových receptov, 12 základných zásob a prázdny 7-dňový plán —
   presne ako pri prvom spustení pôvodnej appky s lokálnym úložiskom.
4. V hlavičke cez ⚙️ (indikátor "Online") si premenuj členov domácnosti na
   skutočné mená — zmena sa uloží pre všetkých.
5. Ďalší člen rodiny sa na inom zariadení prihlási **rovnakým e-mailom a
   heslom** — všetci v domácnosti zdieľajú jeden účet, roly (Mama/Otec/deti)
   sa prepínajú cez dropdown v hlavičke.

---

## 💡 Hlavné funkcie

### 👥 Prispôsobiteľné roly
Aplikácia prispôsobuje rozhranie tomu, kto s ňou pracuje. Mená 4 členov si
nastavíte v ⚙️ nastaveniach. Predvolené roly:
- **Rola 1 (predvolené: Mama):** plánovanie varenia na 7/14 dní, úprava
  receptov, označovanie uvarených jedál a ich hodnotenie.
- **Rola 2 (predvolené: Otec):** správa databázy jedál, nákupný zoznam,
  správa zásob.
- **Roly 3 & 4 (predvolené: Člen 1, Člen 2):** návrh 3 jedál na týždeň,
  kontrola zásob v špajzi, hodnotenie uvarených jedál.

### 📅 Inteligentné plánovanie
Algoritmus na záložke **Jedálniček** zohľadňuje jedlá vhodné na 2 dni
("Dojedanie zo včera"), strieda mäsové/bezmäsité/ľahké jedlá a váži výber
podľa obľúbenosti a doterajšieho hodnotenia.

### 🛒 Nákupný zoznam
Generuje sa automaticky z plánu, sčítava suroviny, vynecháva to, čo máte
doma podľa záložky **Zásoby**, a odškrtávanie sa naživo synchronizuje medzi
zariadeniami. Tlačidlo **"Kopírovať do WhatsApp"** vygeneruje textový zoznam.

### 📷 AI skenery (Google Gemini, cez server)
- **AI Fotoaparát na recepty:** odfoťte recept z knihy alebo hotové jedlo,
  AI vyplní formulár receptu.
- **AI Skener chladničky:** odfoťte chladničku/nákup, AI rozpozná suroviny
  a navrhne 3 recepty. Kľúč aj limit skenov spravuje výhradne backend.

---

## Vývoj / úprava schémy

Ak pridáš nové pole do niektorej kolekcie, vytvor novú migráciu (súbor s
vyšším timestampom v názve) v `pocketbase/pb_migrations/` — nikdy needituj
`1760000000_household_meal_planner_schema.js` po tom, čo bežala v produkcii
(PocketBase migrácie sa spúšťajú len raz a sleduje si ich v internej
tabuľke `_migrations`).
