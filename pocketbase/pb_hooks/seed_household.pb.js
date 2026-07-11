/// <reference path="../pb_data/types.d.ts" />

// Po registrácii novej domácnosti (households) automaticky založí:
// - 4 členov (role1..role4) s predvolenými menami,
// - 15 vzorových receptov,
// - 12 základných zásob,
// - prázdny 7-dňový plán,
// presne tak, ako to dnes robí frontend pri prvom spustení s prázdnym localStorage.

const DEFAULT_MEMBERS = [
    { role_key: "role1", name: "Mama", permission: "spravca" },
    { role_key: "role2", name: "Otec", permission: "spravca" },
    { role_key: "role3", name: "Člen 1", permission: "pomocnik" },
    { role_key: "role4", name: "Člen 2", permission: "pomocnik" }
];

const DEFAULT_PANTRY = [
    { name: "ryža", status: "mame" },
    { name: "cestoviny", status: "mame" },
    { name: "múka", status: "dochadza" },
    { name: "olej", status: "mame" },
    { name: "cukor", status: "mame" },
    { name: "soľ", status: "mame" },
    { name: "zemiaky", status: "treba-kupit" },
    { name: "cibuľa", status: "dochadza" },
    { name: "cesnak", status: "mame" },
    { name: "konzervy", status: "mame" },
    { name: "strukoviny", status: "mame" },
    { name: "mrazené potraviny", status: "mame" }
];

// Poznámka: likedBy je normalizované na role1..role4 (pôvodné dáta v app.js
// miešali aj literály "mama"/"otec" pre 4 recepty, čo v starom frontende
// tíško rozbíjalo zobrazenie srdiečkových ikon — tu je to zjednotené).
const DEFAULT_MEALS = [
    {
        name: "Kurací vývar", category: "polievka", servings: 6, prepTime: 120, difficulty: "lahke",
        cookForTwoDays: true, canFreeze: true, popularity: "velmi-oblubene",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: "Kuracie trupy a stehná, 500g, maso\nMrkva, 3ks, zelenina\nPetržlen, 2ks, zelenina\nKaleráb, 1ks, zelenina\nCibuľa, 1ks, zelenina\nPolievkové rezance, 100g, trvanlive\nSoľ, 1ČL, trvanlive",
        instructions: "Kuracie mäso zalejeme studenou vodou, posolíme a privedieme k varu. Naberieme penu, pridáme očistenú zeleninu a na miernom ohni varíme pomaly aspoň 2 hodiny. Podávame s uvarenými rezancami.",
        rating: "bolo-v-poriadku", note: "Tradičná nedeľná polievka."
    },
    {
        name: "Segedínsky guláš", category: "hlavne", servings: 6, prepTime: 90, difficulty: "stredne",
        cookForTwoDays: true, canFreeze: true, popularity: "velmi-oblubene",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: "Bravčové pliecko, 600g, maso\nKyslá kapusta, 500g, trvanlive\nCibuľa, 2ks, zelenina\nKyslá smotana, 250ml, mliecne\nHladká múka, 2PL, trvanlive\nOlej, 3PL, trvanlive\nMletá sladká paprika, 2PL, trvanlive\nKnedľa (na podávanie), 1ks, pecivo",
        instructions: "Na oleji opražíme nakrájanú cibuľu, pridáme mletú papriku a nakrájané mäso. Opečieme, podlejeme vodou a dusíme. Po 30 minútach pridáme kyslú kapustu a dusíme do zmäknutia. Na záver zahustíme smotanou rozmiešanou s múkou. Necháme prevrieť.",
        rating: "bolo-v-poriadku", note: "Najlepší je na druhý deň, podávať s knedľou."
    },
    {
        name: "Kurací perkelt", category: "hlavne", servings: 4, prepTime: 60, difficulty: "stredne",
        cookForTwoDays: true, canFreeze: true, popularity: "velmi-oblubene",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: "Kuracie stehná horné, 4ks, maso\nCibuľa, 2ks, zelenina\nSmotana na šľahanie, 250ml, mliecne\nHladká múka, 1PL, trvanlive\nCestoviny (kolienka), 400g, trvanlive\nOlej, 2PL, trvanlive\nMletá červená paprika, 1PL, trvanlive",
        instructions: "Na oleji speníme nadrobno nakrájanú cibuľu. Pridáme červenú papriku, orestujeme a pridáme kuracie stehná. Osolíme, podlejeme vodou a dusíme pod pokrievkou do zmäknutia. Vyberieme mäso, do šťavy vlejeme smotanu rozmiešanú s hladkou múkou, prevaríme a vrátime mäso späť. Podávame s cestovinou.",
        rating: "bolo-v-poriadku", note: "Syn ho miluje s kolienkami."
    },
    {
        name: "Rizoto s kuracím mäsom", category: "rychle", servings: 4, prepTime: 40, difficulty: "lahke",
        cookForTwoDays: false, canFreeze: false, popularity: "bezne",
        likedBy: ["role1", "role3", "role4"],
        ingredientsText: "Ryža, 300g, trvanlive\nKuracie prsia, 400g, maso\nMrazený hrášok a kukurica, 200g, mrazene\nCibuľa, 1ks, zelenina\nTvrdý syr (Eidam), 150g, mliecne\nOlej, 2PL, trvanlive",
        instructions: "Uvaríme ryžu. Na druhej panvici orestujeme cibuľu, pridáme na kocky nakrájané kuracie prsia, osolíme, okoreníme a opekáme. Keď je mäso hotové, pridáme zeleninu a chvíľu podusíme. Nakoniec zmiešame s uvarenou ryžou a na tanieri posypeme nastrúhaným syrom.",
        rating: "bolo-v-poriadku", note: "Rýchly obed cez týždeň."
    },
    {
        name: "Špagety s mäsovou omáčkou", category: "rychle", servings: 4, prepTime: 40, difficulty: "lahke",
        cookForTwoDays: false, canFreeze: true, popularity: "velmi-oblubene",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: "Mleté mäso mix, 500g, maso\nŠpagety, 400g, trvanlive\nParadajkový pretlak, 500g, trvanlive\nCibuľa, 1ks, zelenina\nCesnak, 2strúčiky, zelenina\nTvrdý syr, 100g, mliecne\nOlej, 2PL, trvanlive",
        instructions: "Na oleji orestujeme cibuľu a cesnak, pridáme mleté mäso a opekáme ho. Osolíme, okoreníme, zalejeme paradajkovým pretlakom a dusíme cca 25 minút. Špagety uvaríme v osolenej vode. Podávame omáčku na špagetách posypanú syrom.",
        rating: "bolo-v-poriadku", note: "Klasické talianske jedlo po slovensky."
    },
    {
        name: "Francúzske zemiaky", category: "hlavne", servings: 4, prepTime: 65, difficulty: "stredne",
        cookForTwoDays: true, canFreeze: false, popularity: "bezne",
        likedBy: ["role1", "role2"],
        ingredientsText: "Zemiaky, 1kg, zelenina\nKlobása na varenie, 2ks, maso\nVajíčka, 4ks, mliecne\nKyslá smotana, 250ml, mliecne\nOlej na vymazanie, 1PL, trvanlive",
        instructions: "Uvaríme zemiaky v šupke a vajíčka natvrdo. Zemiaky ošúpeme a nakrájame na kolieska. Do vymazaného pekáča vrstvíme zemiaky, nakrájanú klobásu a vajíčka. Každú vrstvu jemne osolíme. Kyslú smotanu osolíme, rozšľaháme a zalejeme ňou zemiaky. Pečieme na 180°C asi 30-40 minút do zlatista.",
        rating: "bolo-v-poriadku", note: "Podávame s kyslou uhorkou."
    },
    {
        name: "Zapekané cestoviny", category: "rychle", servings: 4, prepTime: 45, difficulty: "lahke",
        cookForTwoDays: true, canFreeze: false, popularity: "bezne",
        likedBy: ["role1", "role3", "role4"],
        ingredientsText: "Cestoviny (Penne), 400g, trvanlive\nŠunka, 200g, maso\nTvrdý syr Eidam, 150g, mliecne\nVajíčka, 3ks, mliecne\nSmotana na varenie, 250ml, mliecne\nSterilizovaná kukurica, 1ks, trvanlive",
        instructions: "Cestoviny uvaríme. Zmiešame ich s nakrájanou šunkou, kukuricou a polovicou nastrúhaného syra. Vložíme do pekáča. Vajíčka rozšľaháme v smotane, osolíme, okoreníme a zalejeme cestoviny. Posypeme zvyšným syrom a zapekáme na 180°C cca 25 minút.",
        rating: "bolo-v-poriadku", note: "Skvelé na spotrebovanie zvyškov syra a šunky."
    },
    {
        name: "Zeleninová polievka", category: "lahke", servings: 4, prepTime: 30, difficulty: "lahke",
        cookForTwoDays: false, canFreeze: false, popularity: "obcas",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: "Mrkva, 2ks, zelenina\nPetržlen, 1ks, zelenina\nMrazený hrášok, 100g, zelenina\nZemiaky, 2ks, zelenina\nMaslo, 50g, mliecne\nKrupicové halušky (vajce + detská krupica), 1ks, trvanlive",
        instructions: "Očistenú zeleninu nakrájame. Na roztopenom masle orestujeme mrkvu a petržlen. Zalejeme vodou, pridáme zemiaky a varíme. Pred koncom pridáme hrášok a zavaríme malé krupicové halušky z jedného vajíčka a krupice. Osolíme a ozdobíme petržlenovou vňaťou.",
        rating: "bolo-v-poriadku", note: "Rýchla a zdravá polievka."
    },
    {
        name: "Šošovicová polievka na kyslo", category: "polievka", servings: 6, prepTime: 50, difficulty: "lahke",
        cookForTwoDays: true, canFreeze: false, popularity: "bezne",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: "Šošovica, 200g, trvanlive\nZemiaky, 2ks, zelenina\nBobkový list, 2ks, trvanlive\nCesnak, 2strúčiky, zelenina\nKyslá smotana, 200ml, mliecne\nHladká múka, 1PL, trvanlive\nOcot, 1PL, trvanlive",
        instructions: "Šošovicu vopred namočíme. Uvaríme ju vo vode s bobkovým listom. Keď je polomäkká, pridáme nakrájané zemiaky a prelisovaný cesnak. Keď zemiaky zmäknú, pridáme zátrepku z kyslej smotany a hladkej múky. Prevaríme. Dochutíme octom a cukrom podľa potreby.",
        rating: "bolo-v-poriadku", note: "Kyslá a sýta polievka."
    },
    {
        name: "Granadír", category: "bezmasite", servings: 4, prepTime: 35, difficulty: "lahke",
        cookForTwoDays: true, canFreeze: false, popularity: "bezne",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: "Cestoviny fliačky, 400g, trvanlive\nZemiaky, 600g, zelenina\nCibuľa, 1ks, zelenina\nMletá sladká paprika, 2ČL, trvanlive\nOlej, 3PL, trvanlive",
        instructions: "Uvaríme zemiaky aj cestoviny zvlášť. Na oleji speníme nadrobno nakrájanú cibuľu, pridáme mletú sladkú papriku, rýchlo premiešame a pridáme uvarené zemiaky. Zemiaky v hrnci popučíme a zmiešame s uvarenými cestovinami. Osolíme a podávame.",
        rating: "bolo-v-poriadku", note: "Lacné a veľmi obľúbené slovenské jedlo. Podávať s kyslou uhorkou."
    },
    {
        name: "Ryba na masle so zemiakmi", category: "lahke", servings: 4, prepTime: 40, difficulty: "lahke",
        cookForTwoDays: false, canFreeze: false, popularity: "bezne",
        likedBy: ["role1", "role2"],
        ingredientsText: "Rybie filé / Treska, 600g, maso\nZemiaky, 1kg, zelenina\nMaslo, 100g, mliecne\nCitrón, 1ks, zelenina\nRasca mletá, 1ČL, trvanlive",
        instructions: "Zemiaky ošúpeme, nakrájame a uvaríme v osolenej vode. Rybie filé osolíme, okoreníme rascom. Na panvici rozpustíme maslo a filé opečieme z oboch strán (cca 5 minút z každej strany). Podávame s maslovými zemiakmi pokvapkané citrónom.",
        rating: "bolo-v-poriadku", note: "Ľahký piatkový obed."
    },
    {
        name: "Kuracie prsia s ryžou", category: "rychle", servings: 4, prepTime: 30, difficulty: "lahke",
        cookForTwoDays: false, canFreeze: false, popularity: "velmi-oblubene",
        likedBy: ["role1", "role3", "role4", "role2"],
        ingredientsText: "Kuracie prsia, 500g, maso\nRyža, 300g, trvanlive\nOlej, 2PL, trvanlive\nKompót broskyňový, 1ks, trvanlive\nMaslo, 20g, mliecne",
        instructions: "Ryžu prepláchneme a uvaríme. Kuracie prsia nakrájame na rezne, jemne naklepeme, osolíme a okoreníme. Na rozpálenom oleji s kúskom masla orestujeme kuracie plátky z oboch strán do mäkka. Podávame s ryžou a broskyňovým kompótom.",
        rating: "bolo-v-poriadku", note: "Absolútna klasika, ktorú zje každý."
    },
    {
        name: "Palacinky s džemom", category: "bezmasite", servings: 4, prepTime: 40, difficulty: "lahke",
        cookForTwoDays: false, canFreeze: true, popularity: "velmi-oblubene",
        likedBy: ["role3", "role4", "role1", "role2"],
        ingredientsText: "Hladká múka, 250g, trvanlive\nMlieko, 500ml, mliecne\nVajíčka, 2ks, mliecne\nDžem (jahodový/marhuľový), 1ks, trvanlive\nOlej na vyprážanie, 3PL, trvanlive\nCukor vanilkový, 1ks, trvanlive",
        instructions: "Z múky, mlieka, vajíčok, štipky soli a vanilkového cukru vyšľaháme hladké cesto. Necháme 10 minút odstáť. Na panvici potretej olejom pečieme tenké palacinky z oboch strán. Natrieme džemom, zrolujeme a pocukrujeme.",
        rating: "bolo-v-poriadku", note: "Najobľúbenejšie sladké jedlo nášho syna."
    },
    {
        name: "Zeleninové lečo s klobásou", category: "rychle", servings: 3, prepTime: 30, difficulty: "lahke",
        cookForTwoDays: false, canFreeze: false, popularity: "obcas",
        likedBy: ["role1", "role2"],
        ingredientsText: "Biela paprika, 5ks, zelenina\nParadajky zrelé, 4ks, zelenina\nCibuľa, 1ks, zelenina\nVajíčka, 4ks, mliecne\nKlobása pikantná, 2ks, maso\nOlej, 2PL, trvanlive",
        instructions: "Cibuľu a klobásu nakrájame. Na oleji orestujeme cibuľu, pridáme klobásu a opečieme. Pridáme nakrájanú papriku a podusíme 10 minút pod pokrievkou. Následne pridáme nakrájané paradajky a dusíme, kým zelenina nezmäkne a neodparí sa voda. Na záver vlejeme rozšľahané vajíčka, osolíme a miešame do stuhnutia.",
        rating: "bolo-v-poriadku", note: "Ideálne letné jedlo z čerstvej zeleniny zo záhrady."
    },
    {
        name: "Fazuľový prívarok", category: "bezmasite", servings: 4, prepTime: 60, difficulty: "stredne",
        cookForTwoDays: true, canFreeze: false, popularity: "obcas",
        likedBy: ["role1", "role2"],
        ingredientsText: "Biela fazuľa suchá, 250g, trvanlive\nSmotana na varenie, 250ml, mliecne\nHladká múka, 2PL, trvanlive\nCesnak, 2strúčiky, zelenina\nBobkový list, 2ks, trvanlive\nOcot, 1PL, trvanlive",
        instructions: "Fazuľu namočíme deň vopred. Uvaríme ju s bobkovým listom do mäkka. Smotanu rozmiešame s múkou a vlejeme k fazuli. Za stáleho miešania povaríme. Pridáme prelisovaný cesnak, soľ a na záver dochutíme octom a cukrom. Podávame s vajíčkom natvrdo alebo fašírkou.",
        rating: "bolo-v-poriadku", note: "Podávame s čerstvým chlebom."
    }
];

onRecordAfterCreateSuccess((e) => {
    try {
        const householdId = e.record.id;

        const membersCollection = e.app.findCollectionByNameOrId("members");
        for (const m of DEFAULT_MEMBERS) {
            const record = new Record(membersCollection);
            record.set("household", householdId);
            record.set("name", m.name);
            record.set("role_key", m.role_key);
            record.set("permission", m.permission);
            e.app.save(record);
        }

        const pantryCollection = e.app.findCollectionByNameOrId("pantry_items");
        for (const p of DEFAULT_PANTRY) {
            const record = new Record(pantryCollection);
            record.set("household", householdId);
            record.set("name", p.name);
            record.set("status", p.status);
            e.app.save(record);
        }

        const mealsCollection = e.app.findCollectionByNameOrId("meals");
        for (const m of DEFAULT_MEALS) {
            const record = new Record(mealsCollection);
            record.set("household", householdId);
            record.set("name", m.name);
            record.set("category", m.category);
            record.set("servings", m.servings);
            record.set("prep_time", m.prepTime);
            record.set("difficulty", m.difficulty);
            record.set("cook_for_two_days", m.cookForTwoDays);
            record.set("can_freeze", m.canFreeze);
            record.set("popularity", m.popularity);
            record.set("liked_by", m.likedBy);
            record.set("ingredients_text", m.ingredientsText);
            record.set("instructions", m.instructions);
            record.set("note", m.note);
            record.set("rating", m.rating);
            e.app.save(record);
        }

        // Prázdny počiatočný plán, aby "Dnes varíme" a "Jedálniček" mali čo zobraziť.
        const planCollection = e.app.findCollectionByNameOrId("weekly_plans");
        const planRecord = new Record(planCollection);
        planRecord.set("household", householdId);
        planRecord.set("duration", 7);
        planRecord.set("start_date", new Date().toISOString().slice(0, 10));
        planRecord.set("days", []);
        e.app.save(planRecord);
    } catch (err) {
        // Loguj presnú príčinu do PocketBase logov namiesto tichého všeobecného 400.
        console.log("seed_household hook failed: " + err);
    }

    e.next();
}, "households");
