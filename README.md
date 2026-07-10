# 🍳 Domáci Jedálniček & Nákupný Zoznam

Jednoduchá a prehládná webová aplikácia pre každú domácnosť, ktorá pomáha plánovať varenie, spravovať zásoby a automaticky generovať nákupný zoznam.

Aplikácia je postavená tak, aby bola **okamžite použiteľná** bez akéhokoľvek nastavovania. Predvolene ukladá všetky dáta do lokálnej pamäte prehliadača (`localStorage`). Pre spoločné fungovanie viacerých členov domácnosti na rôznych zariadeniach ju môžete jednoducho prepojiť s bezplatnou online databázou **Firebase**.

---

## 🚀 Ako aplikáciu spustiť?

Máte dve veľmi jednoduché možnosti:

### Možnosť A: Rýchle spustenie (Odporúčané pre bežných používateľov)
1. Prejdite do priečinka projektu.
2. Kliknite dvakrát (double-click) na súbor **`index.html`**.
3. Aplikácia sa okamžite otvorí vo vašom predvolenom webovom prehliadači (Chrome, Edge, Firefox, atď.).

### Možnosť B: Spustenie cez lokálny server (Pre vývojárov a testovanie)
Ak máte nainštalovaný Node.js a chcete spustiť aplikáciu ako lokálny web:
1. Otvorte terminál v priečinku projektu.
2. Spustite príkaz:
   ```bash
   npm start
   ```
3. Otvorte v prehliadači adresu: [http://localhost:3000](http://localhost:3000)

---

## 💡 Hlavné funkcie a ako ich používať

### 1. 👥 Prispôsobiteľné roly (Vpravo hore)
Aplikácia prispôsobuje rozhranie tomu, kto s ňou pracuje. Každá domácnosť si môže v nastaveniach (modal pripojenia) pomenovať 4 členov podľa seba. Predvolené roly sú:
- **Rola 1 (predvolené: Mama):** Plánovanie varenia na 7 alebo 14 dní, úprava receptov, označovanie uvarených jedál a ich hodnotenie.
- **Rola 2 (predvolené: Otec):** Správa databázy jedál, kompletný nákupný zoznam s možnosťou odškrtávania položiek priamo v obchode, správa zásob a WhatsApp export.
- **Roly 3 & 4 (predvolené: Člen 1, Člen 2):** Zjednodušená karta pre ďalších členov (napr. deti alebo spolubývajúcich), kde môžu navrhnúť 3 jedlá na týždeň, skontrolovať zásoby v špajzi a ohodnotiť jedlá.

### 2. 📅 Inteligentné plánovanie
Algoritmus na záložke **Jedálniček** generuje plán tak, aby:
- Zohľadnil jedlá vhodné na **2 dni** (na druhý deň vám automaticky naplánuje „Dojedanie zo včera“).
- Striedal mäsové, bezmäsité a ľahké jedlá.
- Každé jedlo v pláne sa dá ručne vymeniť za iné z databázy alebo priamo z prianí chalanov/členov.

### 3. 🛒 Nákupný zoznam
- Generuje sa automaticky z naplánovaných jedál a sčítava suroviny rovnakej kategórie.
- **Prepojenie na zásoby:** Ak máte surovinu označenú v **Zásoby** ako *„Máme doma“*, nevloží ju do nákupného zoznamu.
- Cez tlačidlo **„Kopírovať do WhatsApp“** vygenerujete text so zaškrtávacími políčkami pre nákupcu.

### 4. 📷 Multimodálne AI funkcie (Google Gemini API)
- **AI Fotoaparát na recepty:** Odfotografujte recept z knihy alebo tanier s hotovým jedlom a AI automaticky vytvorí recept.
- **AI Skener chladničky:** Odfotografujte chladničku alebo nákup na stole a AI rozpozná suroviny a navrhne 3 recepty na varenie.

---

## 🌐 Nastavenie online synchronizácie (Firebase)

Ak chcete zdieľať zoznam na viacerých telefónoch, prepojte aplikáciu s databázou **Firebase Realtime Database** (je to zadarmo):

1. Prejdite na **[Firebase Console](https://console.firebase.google.com/)** a vytvorte nový projekt.
2. Na domovskej obrazovke projektu kliknite na **ikonu webu `</>`**, zadajte názov aplikácie a zaregistrujte ju.
3. Skopírujte vygenerovaný JSON kód (objekt `firebaseConfig` medzi `{ ... }`).
4. V ľavom menu projektu prejdite na **Build -> Realtime Database** a vytvorte databázu (v testovacom režime).
5. Otvorte vašu aplikáciu, kliknite na **„Lokálne“**, vložte konfiguráciu, zadajte vaše tajné heslo pre zabezpečenie a uložte.
6. Indikátor v hlavičke zozelenie na **„Online“** a začne synchronizovať dáta.
