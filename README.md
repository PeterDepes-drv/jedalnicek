# 🍳 Rodinný Jedálniček & Nákupný Zoznam

Jednoduchá a prehľadná webová aplikácia pre slovenskú domácnosť, ktorá pomáha plánovať varenie, spravovať domáce zásoby a automaticky generovať nákupný zoznam.

Aplikácia je postavená tak, aby bola **okamžite použiteľná** bez akéhokoľvek nastavovania. Predvolene ukladá všetky dáta do pamäte prehliadača (`localStorage`). Pre spoločné fungovanie celej rodiny na viacerých telefónoch ju môžete jednoducho prepojiť s bezplatnou online databázou **Firebase**.

---

## 🚀 Ako aplikáciu spustiť?

Máte dve veľmi jednoduché možnosti:

### Možnosť A: Rýchle spustenie (Odporúčané pre bežných používateľov)
1. Prejdite do priečinka projektu `C:\Users\peter\OneDrive\Dokumenty\Jedalnicek`.
2. Kliknite dvakrát (double-click) na súbor **`index.html`**.
3. Aplikácia sa okamžite otvorí vo vašom predvolenom webovom prehliadači (Chrome, Edge, Firefox, atď.).

### Možnosť B: Spustenie cez lokálny server (Pre vývojárov a testovanie)
Ak máte nainštalovaný Node.js a chcete spustiť aplikáciu ako naozajstný lokálny web:
1. Otvorte terminál v priečinku projektu.
2. Spustite príkaz:
   ```bash
   npm start
   ```
3. Otvorte v prehliadači adresu: [http://localhost:3000](http://localhost:3000)

---

## 💡 Hlavné funkcie a ako ich používať

### 1. 👥 Rodinné Roly (Vpravo hore)
Aplikácia prispôsobuje rozhranie tomu, kto s ňou pracuje:
- **👩 Mama (Varenie & Plán):** Vytváranie jedálneho lístka na 7 alebo 14 dní, úprava receptov, označovanie uvarených jedál a ich hodnotenie.
- **👨 Otec (Nákupy & Nastavenia):** Správa databázy jedál, kompletný nákupný zoznam s možnosťou odškrtávania položiek priamo v obchode, správa zásob a WhatsApp export.
- **👦 Ivo & Majo:** Profily pre synov. Chalani majú zjednodušenú kartu **„Ivo & Majo“**, kde môžu navrhnúť 3 jedlá na týždeň, skontrolovať zásoby v špajzi (rýchle a jednoduché tlačidlá) a ohodnotiť, čo im chutilo.

### 2. 📅 Inteligentné plánovanie
Algoritmus na záložke **Jedálniček** generuje plán tak, aby:
- Zohľadnil jedlá, ktoré sa dajú variť na **2 dni** (na druhý deň vám aplikácia automaticky naplánuje „Dojedanie zo včera“, takže nemusíte variť každý deň).
- Nestriedalo sa mäso príliš často (strieda mäsové, bezmäsité a ľahké jedlá).
- Každé jedlo v pláne sa dá ručne vymeniť za iné kliknutím na ikonu ceruzky ✏️.

### 3. 🛒 Nákupný zoznam
- Generuje sa automaticky zo všetkých plánovaných jedál.
- Sčíta rovnaké suroviny (napr. ak 3 recepty potrebujú cibuľu, zlúči ich a sčíta celkovú hmotnosť/kusy).
- **Prepojenie na zásoby:** Ak máte nejakú potravinu (napr. ryžu) v záložke **Zásoby** označenú ako *„Máme doma“*, aplikácia ju nepridá do nákupného zoznamu. Zobrazí sa len v spodnej časti ako *„Suroviny, ktoré netreba kupovať“*.
- Cez tlačidlo **„Kopírovať do WhatsApp“** vygenerujete prehľadný štruktúrovaný text so zaškrtávacími políčkami, ktorý môžete ihneď poslať rodine.

---

## 🌐 Nastavenie online synchronizácie pre rodinu (Firebase)

Ak chcete, aby celá rodina zdieľala rovnaký jedálniček a nákupný zoznam na svojich mobiloch, prepojte aplikáciu s databázou **Firebase Realtime Database** (je to zadarmo):

1. Prejdite na **[Firebase Console](https://console.firebase.google.com/)** a prihláste sa vaším Google účtom.
2. Vytvorte nový projekt (napr. `rodinny-jedalnicek`).
3. Na domovskej obrazovke projektu kliknite na **ikonu webu `</>`**, zadajte názov aplikácie a kliknite na *Register app*.
4. Skopírujte vygenerovaný JSON kód (objekt `firebaseConfig` medzi zloženými zátvorkami `{ ... }`).
5. V ľavom menu projektu prejdite na **Build -> Realtime Database** a kliknite na **Create Database** (zvoľte európsky server a vyberte **Start in test mode** - testovací režim).
6. Otvorte vašu spustenú aplikáciu, v hlavičke kliknite na tlačidlo **„Lokálne“**, vložte skopírovanú konfiguráciu a uložte.
7. Indikátor v hlavičke sa zmení na zelené **„Online“** a aplikácia od tej chvíle synchronizuje dáta online.
8. **Prepojenie ostatných mobilov:** V ostatných mobiloch rodiny stačí otvoriť webovú adresu aplikácie, kliknúť na „Lokálne“ a vložiť ten istý JSON kód. Od tej chvíle celá rodina vidí a upravuje rovnaké údaje v reálnom čase!

---

## 🍕 Predvolená databáza jedál
Aplikácia obsahuje **15 klasických slovenských receptov** so zoznamom ingrediencií a krátkym postupom, vrátane:
- Kurací vývar, Segedínsky guláš, Kurací perkelt, Rizoto, Špagety, Francúzske zemiaky, Zapekané cestoviny, Zeleninová polievka, Šošovicová polievka, Granadír, Ryba so zemiakmi, Kuracie prsia s ryžou, Palacinky, Lečo, Fazuľový prívarok.
- Nové recepty môžete kedykoľvek pridať alebo existujúce upraviť (prístupné pre role Mama a Otec).
