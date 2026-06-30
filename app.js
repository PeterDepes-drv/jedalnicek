// Default database of 15 Slovak recipes
const DEFAULT_MEALS = [
    {
        id: "m1",
        name: "Kurací vývar",
        category: "polievka",
        servings: 6,
        prepTime: 120,
        difficulty: "lahke",
        cookForTwoDays: true,
        canFreeze: true,
        popularity: "velmi-oblubene",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: "Kuracie trupy a stehná, 500g, maso\nMrkva, 3ks, zelenina\nPetržlen, 2ks, zelenina\nKaleráb, 1ks, zelenina\nCibuľa, 1ks, zelenina\nPolievkové rezance, 100g, trvanlive\nSoľ, 1ČL, trvanlive",
        instructions: "Kuracie mäso zalejeme studenou vodou, posolíme a privedieme k varu. Naberieme penu, pridáme očistenú zeleninu a na miernom ohni varíme pomaly aspoň 2 hodiny. Podávame s uvarenými rezancami.",
        rating: "bolo-v-poriadku",
        note: "Tradičná nedeľná polievka."
    },
    {
        id: "m2",
        name: "Segedínsky guláš",
        category: "hlavne",
        servings: 6,
        prepTime: 90,
        difficulty: "stredne",
        cookForTwoDays: true,
        canFreeze: true,
        popularity: "velmi-oblubene",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: "Bravčové pliecko, 600g, maso\nKyslá kapusta, 500g, trvanlive\nCibuľa, 2ks, zelenina\nKyslá smotana, 250ml, mliecne\nHladká múka, 2PL, trvanlive\nOlej, 3PL, trvanlive\nMletá sladká paprika, 2PL, trvanlive\nKnedľa (na podávanie), 1ks, pecivo",
        instructions: "Na oleji opražíme nakrájanú cibuľu, pridáme mletú papriku a nakrájané mäso. Opečieme, podlejeme vodou a dusíme. Po 30 minútach pridáme kyslú kapustu a dusíme do zmäknutia. Na záver zahustíme smotanou rozmiešanou s múkou. Necháme prevrieť.",
        rating: "bolo-v-poriadku",
        note: "Najlepší je na druhý deň, podávať s knedľou."
    },
    {
        id: "m3",
        name: "Kurací perkelt",
        category: "hlavne",
        servings: 4,
        prepTime: 60,
        difficulty: "stredne",
        cookForTwoDays: true,
        canFreeze: true,
        popularity: "velmi-oblubene",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: "Kuracie stehná horné, 4ks, maso\nCibuľa, 2ks, zelenina\nSmotana na šľahanie, 250ml, mliecne\nHladká múka, 1PL, trvanlive\nCestoviny (kolienka), 400g, trvanlive\nOlej, 2PL, trvanlive\nMletá červená paprika, 1PL, trvanlive",
        instructions: "Na oleji speníme nadrobno nakrájanú cibuľu. Pridáme červenú papriku, orestujeme a pridáme kuracie stehná. Osolíme, podlejeme vodou a dusíme pod pokrievkou do zmäknutia. Vyberieme mäso, do šťavy vlejeme smotanu rozmiešanú s hladkou múkou, prevaríme a vrátime mäso späť. Podávame s cestovinou.",
        rating: "bolo-v-poriadku",
        note: "Syn ho miluje s kolienkami."
    },
    {
        id: "m4",
        name: "Rizoto s kuracím mäsom",
        category: "rychle",
        servings: 4,
        prepTime: 40,
        difficulty: "lahke",
        cookForTwoDays: false,
        canFreeze: false,
        popularity: "bezne",
        likedBy: ["mama", "ivo", "majo"],
        ingredientsText: "Ryža, 300g, trvanlive\nKuracie prsia, 400g, maso\nMrazený hrášok a kukurica, 200g, mrazene\nCibuľa, 1ks, zelenina\nTvrdý syr (Eidam), 150g, mliecne\nOlej, 2PL, trvanlive",
        instructions: "Uvaríme ryžu. Na druhej panvici orestujeme cibuľu, pridáme na kocky nakrájané kuracie prsia, osolíme, okoreníme a opekáme. Keď je mäso hotové, pridáme zeleninu a chvíľu podusíme. Nakoniec zmiešame s uvarenou ryžou a na tanieri posypeme nastrúhaným syrom.",
        rating: "bolo-v-poriadku",
        note: "Rýchly obed cez týždeň."
    },
    {
        id: "m5",
        name: "Špagety s mäsovou omáčkou",
        category: "rychle",
        servings: 4,
        prepTime: 40,
        difficulty: "lahke",
        cookForTwoDays: false,
        canFreeze: true,
        popularity: "velmi-oblubene",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: "Mleté mäso mix, 500g, maso\nŠpagety, 400g, trvanlive\nParadajkový pretlak, 500g, trvanlive\nCibuľa, 1ks, zelenina\nCesnak, 2strúčiky, zelenina\nTvrdý syr, 100g, mliecne\nOlej, 2PL, trvanlive",
        instructions: "Na oleji orestujeme cibuľu a cesnak, pridáme mleté mäso a opekáme ho. Osolíme, okoreníme, zalejeme paradajkovým pretlakom a dusíme cca 25 minút. Špagety uvaríme v osolenej vode. Podávame omáčku na špagetách posypanú syrom.",
        rating: "bolo-v-poriadku",
        note: "Klasické talianske jedlo po slovensky."
    },
    {
        id: "m6",
        name: "Francúzske zemiaky",
        category: "hlavne",
        servings: 4,
        prepTime: 65,
        difficulty: "stredne",
        cookForTwoDays: true,
        canFreeze: false,
        popularity: "bezne",
        likedBy: ["mama", "otec"],
        ingredientsText: "Zemiaky, 1kg, zelenina\nKlobása na varenie, 2ks, maso\nVajíčka, 4ks, mliecne\nKyslá smotana, 250ml, mliecne\nOlej na vymazanie, 1PL, trvanlive",
        instructions: "Uvaríme zemiaky v šupke a vajíčka natvrdo. Zemiaky ošúpeme a nakrájame na kolieska. Do vymazaného pekáča vrstvíme zemiaky, nakrájanú klobásu a vajíčka. Každú vrstvu jemne osolíme. Kyslú smotanu osolíme, rozšľaháme a zalejeme ňou zemiaky. Pečieme na 180°C asi 30-40 minút do zlatista.",
        rating: "bolo-v-poriadku",
        note: "Podávame s kyslou uhorkou."
    },
    {
        id: "m7",
        name: "Zapekané cestoviny",
        category: "rychle",
        servings: 4,
        prepTime: 45,
        difficulty: "lahke",
        cookForTwoDays: true,
        canFreeze: false,
        popularity: "bezne",
        likedBy: ["mama", "ivo", "majo"],
        ingredientsText: "Cestoviny (Penne), 400g, trvanlive\nŠunka, 200g, maso\nTvrdý syr Eidam, 150g, mliecne\nVajíčka, 3ks, mliecne\nSmotana na varenie, 250ml, mliecne\nSterilizovaná kukurica, 1ks, trvanlive",
        instructions: "Cestoviny uvaríme. Zmiešame ich s nakrájanou šunkou, kukuricou a polovicou nastrúhaného syra. Vložíme do pekáča. Vajíčka rozšľaháme v smotane, osolíme, okoreníme a zalejeme cestoviny. Posypeme zvyšným syrom a zapekáme na 180°C cca 25 minút.",
        rating: "bolo-v-poriadku",
        note: "Skvelé na spotrebovanie zvyškov syra a šunky."
    },
    {
        id: "m8",
        name: "Zeleninová polievka",
        category: "lahke",
        servings: 4,
        prepTime: 30,
        difficulty: "lahke",
        cookForTwoDays: false,
        canFreeze: false,
        popularity: "obcas",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: "Mrkva, 2ks, zelenina\nPetržlen, 1ks, zelenina\nMrazený hrášok, 100g, zelenina\nZemiaky, 2ks, zelenina\nMaslo, 50g, mliecne\nKrupicové halušky (vajce + detská krupica), 1ks, trvanlive",
        instructions: "Očistenú zeleninu nakrájame. Na roztopenom masle orestujeme mrkvu a petržlen. Zalejeme vodou, pridáme zemiaky a varíme. Pred koncom pridáme hrášok a zavaríme malé krupicové halušky z jedného vajíčka a krupice. Osolíme a ozdobíme petržlenovou vňaťou.",
        rating: "bolo-v-poriadku",
        note: "Rýchla a zdravá polievka."
    },
    {
        id: "m9",
        name: "Šošovicová polievka na kyslo",
        category: "polievka",
        servings: 6,
        prepTime: 50,
        difficulty: "lahke",
        cookForTwoDays: true,
        canFreeze: false,
        popularity: "bezne",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: "Šošovica, 200g, trvanlive\nZemiaky, 2ks, zelenina\nBobkový list, 2ks, trvanlive\nCesnak, 2strúčiky, zelenina\nKyslá smotana, 200ml, mliecne\nHladká múka, 1PL, trvanlive\nOcot, 1PL, trvanlive",
        instructions: "Šošovicu vopred namočíme. Uvaríme ju vo vode s bobkovým listom. Keď je polomäkká, pridáme nakrájané zemiaky a prelisovaný cesnak. Keď zemiaky zmäknú, pridáme zátrepku z kyslej smotany a hladkej múky. Prevaríme. Dochutíme octom a cukrom podľa potreby.",
        rating: "bolo-v-poriadku",
        note: "Kyslá a sýta polievka."
    },
    {
        id: "m10",
        name: "Granadír",
        category: "bezmasite",
        servings: 4,
        prepTime: 35,
        difficulty: "lahke",
        cookForTwoDays: true,
        canFreeze: false,
        popularity: "bezne",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: "Cestoviny fliačky, 400g, trvanlive\nZemiaky, 600g, zelenina\nCibuľa, 1ks, zelenina\nMletá sladká paprika, 2ČL, trvanlive\nOlej, 3PL, trvanlive",
        instructions: "Uvaríme zemiaky aj cestoviny zvlášť. Na oleji speníme nadrobno nakrájanú cibuľu, pridáme mletú sladkú papriku, rýchlo premiešame a pridáme uvarené zemiaky. Zemiaky v hrnci popučíme a zmiešame s uvarenými cestovinami. Osolíme a podávame.",
        rating: "bolo-v-poriadku",
        note: "Lacné a veľmi obľúbené slovenské jedlo. Podávať s kyslou uhorkou."
    },
    {
        id: "m11",
        name: "Ryba na masle so zemiakmi",
        category: "lahke",
        servings: 4,
        prepTime: 40,
        difficulty: "lahke",
        cookForTwoDays: false,
        canFreeze: false,
        popularity: "bezne",
        likedBy: ["mama", "otec"],
        ingredientsText: "Rybie filé / Treska, 600g, maso\nZemiaky, 1kg, zelenina\nMaslo, 100g, mliecne\nCitrón, 1ks, zelenina\nRasca mletá, 1ČL, trvanlive",
        instructions: "Zemiaky ošúpeme, nakrájame a uvaríme v osolenej vode. Rybie filé osolíme, okoreníme rascom. Na panvici rozpustíme maslo a filé opečieme z oboch strán (cca 5 minút z každej strany). Podávame s maslovými zemiakmi pokvapkané citrónom.",
        rating: "bolo-v-poriadku",
        note: "Ľahký piatkový obed."
    },
    {
        id: "m12",
        name: "Kuracie prsia s ryžou",
        category: "rychle",
        servings: 4,
        prepTime: 30,
        difficulty: "lahke",
        cookForTwoDays: false,
        canFreeze: false,
        popularity: "velmi-oblubene",
        likedBy: ["mama", "ivo", "majo", "otec"],
        ingredientsText: "Kuracie prsia, 500g, maso\nRyža, 300g, trvanlive\nOlej, 2PL, trvanlive\nKompót broskyňový, 1ks, trvanlive\nMaslo, 20g, mliecne",
        instructions: "Ryžu prepláchneme a uvaríme. Kuracie prsia nakrájame na rezne, jemne naklepeme, osolíme a okoreníme. Na rozpálenom oleji s kúskom masla orestujeme kuracie plátky z oboch strán do mäkka. Podávame s ryžou a broskyňovým kompótom.",
        rating: "bolo-v-poriadku",
        note: "Absolútna klasika, ktorú zje každý."
    },
    {
        id: "m13",
        name: "Palacinky s džemom",
        category: "bezmasite",
        servings: 4,
        prepTime: 40,
        difficulty: "lahke",
        cookForTwoDays: false,
        canFreeze: true,
        popularity: "velmi-oblubene",
        likedBy: ["ivo", "majo", "mama", "otec"],
        ingredientsText: "Hladká múka, 250g, trvanlive\nMlieko, 500ml, mliecne\nVajíčka, 2ks, mliecne\nDžem (jahodový/marhuľový), 1ks, trvanlive\nOlej na vyprážanie, 3PL, trvanlive\nCukor vanilkový, 1ks, trvanlive",
        instructions: "Z múky, mlieka, vajíčok, štipky soli a vanilkového cukru vyšľaháme hladké cesto. Necháme 10 minút odstáť. Na panvici potretej olejom pečieme tenké palacinky z oboch strán. Natrieme džemom, zrolujeme a pocukrujeme.",
        rating: "bolo-v-poriadku",
        note: "Najobľúbenejšie sladké jedlo nášho syna."
    },
    {
        id: "m14",
        name: "Zeleninové lečo s klobásou",
        category: "rychle",
        servings: 3,
        prepTime: 30,
        difficulty: "lahke",
        cookForTwoDays: false,
        canFreeze: false,
        popularity: "obcas",
        likedBy: ["mama", "otec"],
        ingredientsText: "Biela paprika, 5ks, zelenina\nParadajky zrelé, 4ks, zelenina\nCibuľa, 1ks, zelenina\nVajíčka, 4ks, mliecne\nKlobása pikantná, 2ks, maso\nOlej, 2PL, trvanlive",
        instructions: "Cibuľu a klobásu nakrájame. Na oleji orestujeme cibuľu, pridáme klobásu a opečieme. Pridáme nakrájanú papriku a podusíme 10 minút pod pokrievkou. Následne pridáme nakrájané paradajky a dusíme, kým zelenina nezmäkne a neodparí sa voda. Na záver vlejeme rozšľahané vajíčka, osolíme a miešame do stuhnutia.",
        rating: "bolo-v-poriadku",
        note: "Ideálne letné jedlo z čerstvej zeleniny zo záhrady."
    },
    {
        id: "m15",
        name: "Fazuľový prívarok",
        category: "bezmasite",
        servings: 4,
        prepTime: 60,
        difficulty: "stredne",
        cookForTwoDays: true,
        canFreeze: false,
        popularity: "obcas",
        likedBy: ["mama", "otec"],
        ingredientsText: "Biela fazuľa suchá, 250g, trvanlive\nSmotana na varenie, 250ml, mliecne\nHladká múka, 2PL, trvanlive\nCesnak, 2strúčiky, zelenina\nBobkový list, 2ks, trvanlive\nOcot, 1PL, trvanlive",
        instructions: "Fazuľu namočíme deň vopred. Uvaríme ju s bobkovým listom do mäkka. Smotanu rozmiešame s múkou a vlejeme k fazuli. Za stáleho miešania povaríme. Pridáme prelisovaný cesnak, soľ a na záver dochutíme octom a cukrom. Podávame s vajíčkom natvrdo alebo fašírkou.",
        rating: "bolo-v-poriadku",
        note: "Podávame s čerstvým chlebom."
    }
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

const CATEGORY_TRANSLATIONS = {
    zelenina: "Zelenina a ovocie",
    maso: "Mäso a ryby",
    mliecne: "Mliečne výrobky",
    pecivo: "Pečivo",
    trvanlive: "Trvanlivé potraviny",
    mrazene: "Mrazené potraviny",
    drogeria: "Drogéria a domácnosť",
    ostatne: "Ostatné"
};

// State Variables
let meals = [];
let currentPlan = null;
let pantry = [];
let shoppingList = [];
let activeTab = 'today';
let firebaseConfig = null;
let isFirebaseConnected = false;
let geminiApiKey = null;
let tempFridgeSuggestions = [];
let familyState = {
    activeRole: "otec",
    suggestions: {
        ivo: [],
        majo: []
    },
    ratedMealsThisWeek: {
        ivo: [],
        majo: []
    }
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initData();
    renderTodayScreen();
    renderPlanScreen();
    renderShoppingList();
    renderMealsScreen();
    renderPantryScreen();
    renderSuggestionsScreen();
    updateRoleUI();
    updateDateDisplay();
});

// Load data from LocalStorage or Fallback to default
function initData() {
    // 1. Meals
    const savedMeals = localStorage.getItem("family_meals");
    if (savedMeals) {
        meals = JSON.parse(savedMeals);
    } else {
        meals = [...DEFAULT_MEALS];
        saveMealsToStorage();
    }

    // 2. Pantry
    const savedPantry = localStorage.getItem("family_pantry");
    if (savedPantry) {
        pantry = JSON.parse(savedPantry);
    } else {
        pantry = [...DEFAULT_PANTRY];
        savePantryToStorage();
    }

    // 2.5 Gemini key load
    const savedGeminiKey = localStorage.getItem("gemini_api_key");
    if (savedGeminiKey) {
        geminiApiKey = savedGeminiKey;
    }

    // 3. Plan
    const savedPlan = localStorage.getItem("family_plan");
    if (savedPlan) {
        currentPlan = JSON.parse(savedPlan);
    } else {
        // Generate a simple initial plan if none exists
        generatePlan(7, false);
    }

    // 4. Shopping List
    const savedShopping = localStorage.getItem("family_shopping");
    if (savedShopping) {
        shoppingList = JSON.parse(savedShopping);
    } else {
        regenerateShoppingListFromPlan();
    }

    // 5. Family State
    const savedFamily = localStorage.getItem("family_state");
    if (savedFamily) {
        try {
            const parsed = JSON.parse(savedFamily);
            // Migration logic
            if (parsed.sonSuggestions) {
                parsed.suggestions = {
                    ivo: parsed.sonSuggestions,
                    majo: []
                };
                delete parsed.sonSuggestions;
            }
            if (!parsed.suggestions) {
                parsed.suggestions = { ivo: [], majo: [] };
            }
            if (Array.isArray(parsed.ratedMealsThisWeek)) {
                parsed.ratedMealsThisWeek = {
                    ivo: parsed.ratedMealsThisWeek,
                    majo: []
                };
            }
            if (!parsed.ratedMealsThisWeek) {
                parsed.ratedMealsThisWeek = { ivo: [], majo: [] };
            }
            familyState = parsed;
        } catch(e) {
            console.error("Migration failed, resetting familyState", e);
        }
        // Sync select dropdown in UI
        const select = document.getElementById("role-select");
        if (select) select.value = familyState.activeRole;
    } else {
        saveFamilyStateToStorage();
    }
    initFirebase();
}

// Storage helpers
function saveMealsToStorage() {
    localStorage.setItem("family_meals", JSON.stringify(meals));
}
function savePantryToStorage() {
    localStorage.setItem("family_pantry", JSON.stringify(pantry));
}
function savePlanToStorage() {
    localStorage.setItem("family_plan", JSON.stringify(currentPlan));
}
function saveShoppingToStorage() {
    localStorage.setItem("family_shopping", JSON.stringify(shoppingList));
    updateShoppingBadge();
}
function saveFamilyStateToStorage() {
    localStorage.setItem("family_state", JSON.stringify(familyState));
}

// Update date display on Today screen
function updateDateDisplay() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    const formatted = today.toLocaleDateString('sk-SK', options);
    const element = document.getElementById("current-date-display");
    if (element) {
        element.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    }
}

// Tab navigation handler
function showTab(tabId) {
    activeTab = tabId;
    // Hide all screens
    const screens = document.querySelectorAll(".app-screen");
    screens.forEach(s => s.classList.remove("active"));

    // Show selected screen
    const target = document.getElementById(`screen-${tabId}`);
    if (target) target.classList.add("active");

    // Update navigation button active state
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(b => b.classList.remove("active"));

    const activeNav = document.getElementById(`nav-${tabId}`);
    if (activeNav) activeNav.classList.add("active");

    // Screen specific updates on display
    if (tabId === 'today') renderTodayScreen();
    if (tabId === 'plan') renderPlanScreen();
    if (tabId === 'shopping') renderShoppingList();
    if (tabId === 'meals') renderMealsScreen();
    if (tabId === 'pantry') renderPantryScreen();
    if (tabId === 'suggestions') renderSuggestionsScreen();

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Role Switching Handler
function changeRole(role) {
    familyState.activeRole = role;
    saveFamilyStateToStorage();
    updateRoleUI();

    // If role is Syn, automatically jump to suggestions
    if (role === "ivo" || role === "majo") {
        showTab("suggestions");
    } else {
        // Go to today's screen
        showTab("today");
    }
}

function updateRoleUI() {
    const banner = document.getElementById("role-instructions");
    if (!banner) return;

    let tipText = "";
    switch (familyState.activeRole) {
        case "mama":
            tipText = "👩 <strong>Ahoj mami!</strong> Máš právo spravovať jedálniček, generovať nový plán, vymieňať jedlá a hodnotiť ich po dovarení.";
            document.body.classList.remove("role-dad-view", "role-son-view");
            document.body.classList.add("role-mom-view");
            break;
        case "otec":
            tipText = "👨 <strong>Ahoj oci!</strong> Môžeš upravovať databázu jedál, spravovať nákupný zoznam a vymazávať zakúpené položky.";
            document.body.classList.remove("role-mom-view", "role-son-view");
            document.body.classList.add("role-dad-view");
            break;
        case "ivo":
            tipText = "👦 <strong>Ahoj Ivo!</strong> Môžeš navrhnúť 3 jedlá na tento týždeň, skontrolovať špajzu a ohodnotiť spoločné jedlá.";
            document.body.classList.remove("role-mom-view", "role-dad-view");
            document.body.classList.add("role-son-view");
            break;
        case "majo":
            tipText = "👦 <strong>Ahoj Majo!</strong> Môžeš navrhnúť 3 jedlá na tento týždeň, skontrolovať špajzu a ohodnotiť spoločné jedlá.";
            document.body.classList.remove("role-mom-view", "role-dad-view");
            document.body.classList.add("role-son-view");
            break;
    }
    banner.innerHTML = tipText;

    // Allow everyone to add new meals
    const addMealBtn = document.getElementById("btn-add-meal");
    if (addMealBtn) {
        addMealBtn.classList.remove("hidden");
    }
}

// Parser for ingredients
function parseIngredients(text) {
    if (!text) return [];
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
            const parts = line.split(',');
            const name = parts[0] ? parts[0].trim() : 'Neznáma surovina';
            const rawQty = parts[1] ? parts[1].trim() : '';
            const category = parts[2] ? parts[2].trim() : 'ostatne';

            let quantity = null;
            let unit = '';

            if (rawQty) {
                // Try matching numbers at beginning (e.g. 600g, 2.5l, 3ks)
                const numMatch = rawQty.match(/^([0-9.,]+)\s*(.*)$/);
                if (numMatch) {
                    quantity = parseFloat(numMatch[1].replace(',', '.'));
                    unit = numMatch[2].trim();
                } else {
                    quantity = null;
                    unit = rawQty;
                }
            }

            return { name, quantity, unit, category };
        });
}

// ----------------------------------------------------
// SCREEN 1: DNES VARÍME
// ----------------------------------------------------
function renderTodayScreen() {
    const grid = document.getElementById("today-meals-grid");
    const ingredList = document.getElementById("today-ingredients-list");
    if (!grid || !ingredList) return;

    grid.innerHTML = "";
    ingredList.innerHTML = "";

    if (!currentPlan || currentPlan.days.length === 0) {
        grid.innerHTML = `<div class="card"><p>Nemáte zatiaľ vygenerovaný žiadny jedálny lístok. Choďte na záložku <strong>Jedálniček</strong>.</p></div>`;
        return;
    }

    // Get current day index. We can base it on simple offset of days, or default to Day 1
    // Let's retrieve a day based on local day of the week, or let the user click to swap days.
    // For simplicity, let's show "1. deň (Dnes)" and let them switch, or show Day 1.
    // Let's figure out what day we are in the plan. We can default to the first incomplete day, or day 1.
    let activeDay = currentPlan.days.find(d => !d.isCooked) || currentPlan.days[0];
    
    if (!activeDay) {
        grid.innerHTML = `<div class="card"><p>Plán na tento týždeň je dokončený! Vygenerujte si nový na záložke <strong>Jedálniček</strong>.</p></div>`;
        return;
    }

    // Render Lunch card
    const lunchMeal = meals.find(m => m.id === activeDay.lunch);
    let html = "";

    if (lunchMeal) {
        html += createTodayMealCardMarkup(activeDay, lunchMeal, "Obed");
    } else if (activeDay.lunch === "leftover") {
        // Find what was cooked yesterday
        const prevDay = currentPlan.days.find(d => d.dayNumber === activeDay.dayNumber - 1);
        const prevMeal = prevDay ? meals.find(m => m.id === prevDay.lunch) : null;
        const mealName = prevMeal ? prevMeal.name : "Jedlo zo včera";
        html += `
            <div class="today-meal-card card">
                <div class="meal-label">Obed</div>
                <h3 class="meal-title">🥡 Dojedanie zo včera</h3>
                <p style="color: var(--text-muted); margin-bottom: 15px;">Dojedáme: <strong>${mealName}</strong>. Dnes netreba variť!</p>
                <div class="meal-card-actions">
                    ${prevMeal ? `<button class="btn btn-secondary btn-sm" onclick="openRecipeModal('${prevMeal.id}')">📖 Recept</button>` : ''}
                    <button class="btn btn-primary btn-sm" onclick="markDayAsCooked(${activeDay.dayNumber})">✓ Označiť ako dojedané</button>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="today-meal-card card">
                <div class="meal-label">Obed</div>
                <h3 class="meal-title">Nebolo vybrané jedlo</h3>
                <button class="btn btn-primary btn-sm" onclick="showTab('plan')">Vybrať jedlo</button>
            </div>
        `;
    }

    // Render Dinner card
    const dinnerMeal = meals.find(m => m.id === activeDay.dinner);
    if (dinnerMeal) {
        html += createTodayMealCardMarkup(activeDay, dinnerMeal, "Večera");
    } else {
        html += `
            <div class="today-meal-card card dinner">
                <div class="meal-label">Večera</div>
                <h3 class="meal-title">🥖 Studená večera / Zvyšky</h3>
                <p style="color: var(--text-muted);">Dnes na večeru nevaríme teplé jedlo. Pripravte si chlebík, nátierku alebo dojedzte zásoby.</p>
            </div>
        `;
    }

    grid.innerHTML = html;

    // Render today's ingredients list
    let todayIngreds = [];
    if (lunchMeal) todayIngreds = todayIngreds.concat(parseIngredients(lunchMeal.ingredientsText));
    if (dinnerMeal) todayIngreds = todayIngreds.concat(parseIngredients(dinnerMeal.ingredientsText));

    if (todayIngreds.length > 0) {
        // Aggregate duplicates for today
        const aggregated = {};
        todayIngreds.forEach(item => {
            const key = item.name.toLowerCase() + "_" + item.unit;
            if (aggregated[key]) {
                if (item.quantity !== null && aggregated[key].quantity !== null) {
                    aggregated[key].quantity += item.quantity;
                }
            } else {
                aggregated[key] = { ...item };
            }
        });

        Object.values(aggregated).forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="ingredient-name">${item.name}</span>
                <span class="ingredient-qty">${item.quantity !== null ? item.quantity : ""} ${item.unit}</span>
            `;
            ingredList.appendChild(li);
        });
    } else {
        ingredList.innerHTML = `<li style="background: none; padding: 0; color: var(--text-muted);">Žiadne suroviny nie sú potrebné (dnes sa nevarí).</li>`;
    }
}

function createTodayMealCardMarkup(day, meal, typeLabel) {
    const isDinner = typeLabel === "Večera";
    const cssClass = isDinner ? "dinner" : "";
    const likesMarkup = meal.likedBy.map(role => {
        if (role === 'mama') return '👩';
        if (role === 'otec') return '👨';
        if (role === 'ivo', 'majo') return '👦';
        return '';
    }).join(' ');

    let ratingSection = "";
    if (day.isCooked) {
        const ratingVal = meal.rating || "bolo-v-poriadku";
        let SlovakRating = "Bolo to v poriadku";
        let ratingClass = "poriadok";
        
        if (ratingVal === 'chutilo') { SlovakRating = "😋 Chutilo nám!"; ratingClass = "chutilo"; }
        if (ratingVal === 'menej-casto') { SlovakRating = "😐 Radšej menej často"; ratingClass = "menej-casto"; }
        if (ratingVal === 'nechceme') { SlovakRating = "🤢 Nechceme opakovať"; ratingClass = "nechceme"; }

        ratingSection = `<div class="rating-badge-active ${ratingClass}">${SlovakRating}</div>`;
    } else {
        ratingSection = `
            <div class="today-rating-prompt" style="margin-top: 15px;">
                <p style="font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 5px;">Ako chutilo? Ohodnoťte:</p>
                <div class="rating-options">
                    <button class="btn-rate" onclick="rateMealFromToday('${meal.id}', 'chutilo', ${day.dayNumber})">😋 Chutilo</button>
                    <button class="btn-rate" onclick="rateMealFromToday('${meal.id}', 'bolo-v-poriadku', ${day.dayNumber})">😐 OK</button>
                    <button class="btn-rate" onclick="rateMealFromToday('${meal.id}', 'menej-casto', ${day.dayNumber})">😒 Menej</button>
                    <button class="btn-rate" onclick="rateMealFromToday('${meal.id}', 'nechceme', ${day.dayNumber})">🤢 Nie</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="today-meal-card card ${cssClass}">
            <div class="meal-label">${typeLabel}</div>
            <h3 class="meal-title">${meal.name}</h3>
            
            <div class="meal-meta">
                <span class="meta-badge">⏱️ ${meal.prepTime} min</span>
                <span class="meta-badge">📊 ${meal.difficulty === 'lahke' ? 'Ľahké' : meal.difficulty === 'stredne' ? 'Stredné' : 'Náročné'}</span>
                <span class="meta-badge">👥 ${meal.servings} porcií</span>
                <span class="meta-badge" title="Kto má rád">❤️ ${likesMarkup}</span>
            </div>
            
            <div class="meal-card-actions">
                <button class="btn btn-secondary btn-sm" onclick="openRecipeModal('${meal.id}')">📖 Recept & Postup</button>
                ${!day.isCooked ? `<button class="btn btn-primary btn-sm" onclick="markDayAsCooked(${day.dayNumber})">✓ Uvarené!</button>` : ''}
            </div>
            
            ${ratingSection}
        </div>
    `;
}

function markDayAsCooked(dayNumber) {
    const day = currentPlan.days.find(d => d.dayNumber === dayNumber);
    if (day) {
        day.isCooked = true;
        savePlanToStorage();
        renderTodayScreen();
    }
}

function rateMealFromToday(mealId, ratingValue, dayNumber) {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        meal.rating = ratingValue;
        saveMealsToStorage();
    }
    
    // Auto-mark day as cooked as well
    const day = currentPlan.days.find(d => d.dayNumber === dayNumber);
    if (day) {
        day.isCooked = true;
        savePlanToStorage();
    }

    // Refresh views
    renderTodayScreen();
    renderMealsScreen();
}

// ----------------------------------------------------
// SCREEN 2: JEDÁLNY LÍSTOK (PLANNER)
// ----------------------------------------------------
function setPlanDuration(days) {
    document.getElementById("btn-days-7").classList.toggle("active", days === 7);
    document.getElementById("btn-days-14").classList.toggle("active", days === 14);
    
    // Switch duration & regenerate list
    generatePlan(days, true);
}

function generateNewPlanPrompt() {
    if (confirm("Chcete naozaj vygenerovať nový jedálny lístok? Súčasný plán sa prepíše.")) {
        generatePlan(currentPlan.duration, true);
    }
}

// Algorithm to generate a new meal plan
function generatePlan(duration, forceRegenerate) {
    if (!forceRegenerate && currentPlan && currentPlan.duration === duration) {
        return; // Use existing
    }

    const daysOfWeek = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"];
    const planDays = [];

    // Filter out meals we absolutely don't want ("nechceme")
    let pool = meals.filter(m => m.rating !== "nechceme");
    if (pool.length === 0) pool = [...meals]; // Fallback

    let lastSelectedId = null;
    let meatStreak = 0;

    for (let d = 1; d <= duration; d++) {
        const dayLabel = daysOfWeek[(d - 1) % 7];
        const weekNum = Math.ceil(d / 7);
        const dateLabel = duration === 14 ? `${dayLabel} (${weekNum}. týždeň)` : dayLabel;

        // If the yesterday meal was a 2-day meal and we cooked it yesterday, today we eat leftovers!
        if (d > 1 && planDays[d - 2].lunch !== "leftover") {
            const prevMeal = meals.find(m => m.id === planDays[d - 2].lunch);
            if (prevMeal && prevMeal.cookForTwoDays) {
                planDays.push({
                    dayNumber: d,
                    date: dateLabel,
                    lunch: "leftover",
                    dinner: null,
                    isCooked: false
                });
                meatStreak = 0; // Leftover day doesn't count as "new cooking" of meat
                continue;
            }
        }

        // Pick lunch
        // Filter pool to avoid repeating the last meal and manage meat streaking
        let dailyPool = pool.filter(m => m.id !== lastSelectedId);
        
        // Strict meat checking: if we've had meat for 2 days in a row, prefer a vegetarian dish
        if (meatStreak >= 2) {
            const vegPool = dailyPool.filter(m => m.category === 'bezmasite' || m.category === 'lahke');
            if (vegPool.length > 0) {
                dailyPool = vegPool;
            }
        }

        // Choose meal with popularity weighting
        let chosenLunch = null;
        if (dailyPool.length > 0) {
            // Weights: velmi-oblubene = 3, bezne = 2, obcas = 1
            const weightedPool = [];
            dailyPool.forEach(m => {
                let weight = 2;
                if (m.popularity === "velmi-oblubene") weight = 4;
                if (m.popularity === "obcas") weight = 1;
                if (m.rating === "chutilo") weight += 1;
                if (m.rating === "menej-casto") weight = 0.5;

                for (let i = 0; i < weight * 2; i++) {
                    weightedPool.push(m);
                }
            });

            const index = Math.floor(Math.random() * (weightedPool.length || dailyPool.length));
            chosenLunch = weightedPool.length > 0 ? weightedPool[index] : dailyPool[index];
        } else {
            // Fallback
            chosenLunch = pool[Math.floor(Math.random() * pool.length)];
        }

        let lunchId = chosenLunch ? chosenLunch.id : null;
        lastSelectedId = lunchId;

        // Update meat streak
        if (chosenLunch && chosenLunch.category !== 'bezmasite' && chosenLunch.category !== 'lahke') {
            meatStreak++;
        } else {
            meatStreak = 0;
        }

        // Dinner pick (usually fast or soup, or empty)
        let dinnerId = null;
        if (Math.random() > 0.4) {
            // 60% chance to schedule a dinner
            const dinners = pool.filter(m => m.id !== lunchId && (m.category === 'rychle' || m.category === 'polievka' || m.category === 'lahke'));
            if (dinners.length > 0) {
                dinnerId = dinners[Math.floor(Math.random() * dinners.length)].id;
            }
        }

        planDays.push({
            dayNumber: d,
            date: dateLabel,
            lunch: lunchId,
            dinner: dinnerId,
            isCooked: false
        });
    }

    currentPlan = {
        duration: duration,
        startDate: new Date().toISOString().split('T')[0],
        days: planDays
    };

    savePlanToStorage();
    regenerateShoppingListFromPlan();
    renderPlanScreen();
}

function renderPlanScreen() {
    const timeline = document.getElementById("plan-timeline");
    if (!timeline) return;

    timeline.innerHTML = "";

    // Toggle class active on correct button
    document.getElementById("btn-days-7").classList.toggle("active", currentPlan.duration === 7);
    document.getElementById("btn-days-14").classList.toggle("active", currentPlan.duration === 14);

    currentPlan.days.forEach(day => {
        const div = document.createElement("div");
        div.className = `plan-day-card card ${day.isCooked ? 'cooked-opacity' : ''}`;
        
        let lunchHtml = "";
        let dinnerHtml = "";

        // Lunch slot
        if (day.lunch === "leftover") {
            // Find what was cooked yesterday
            const prevDay = currentPlan.days.find(d => d.dayNumber === day.dayNumber - 1);
            const prevMeal = prevDay ? meals.find(m => m.id === prevDay.lunch) : null;
            const mealName = prevMeal ? prevMeal.name : "Jedlo zo včera";
            lunchHtml = `
                <div class="plan-meal-slot has-meal">
                    <span class="slot-label">Obed</span>
                    <span class="meal-name" ${prevMeal ? `onclick="openRecipeModal('${prevMeal.id}')"` : ''}>🥡 Dojedanie: ${mealName}</span>
                    <div class="slot-actions">
                        <button class="btn-slot-action" onclick="promptSwapMeal(${day.dayNumber}, 'lunch')" title="Vymeniť">✏️</button>
                    </div>
                </div>
            `;
        } else {
            const lunchMeal = meals.find(m => m.id === day.lunch);
            if (lunchMeal) {
                lunchHtml = `
                    <div class="plan-meal-slot has-meal">
                        <span class="slot-label">Obed</span>
                        <span class="meal-name" onclick="openRecipeModal('${lunchMeal.id}')">🍳 ${lunchMeal.name}</span>
                        <span class="meal-meta-inline">⏱️ ${lunchMeal.prepTime} min | ${lunchMeal.cookForTwoDays ? '📅 2 dni' : '1 deň'}</span>
                        <div class="slot-actions">
                            <button class="btn-slot-action" onclick="promptSwapMeal(${day.dayNumber}, 'lunch')" title="Vymeniť">✏️</button>
                        </div>
                    </div>
                `;
            } else {
                lunchHtml = `
                    <div class="plan-meal-slot">
                        <span class="slot-label">Obed</span>
                        <span class="meal-name" onclick="promptSwapMeal(${day.dayNumber}, 'lunch')">➕ Vybrať obed</span>
                    </div>
                `;
            }
        }

        // Dinner slot
        const dinnerMeal = meals.find(m => m.id === day.dinner);
        if (dinnerMeal) {
            dinnerHtml = `
                <div class="plan-meal-slot has-meal">
                    <span class="slot-label">Večera</span>
                    <span class="meal-name" onclick="openRecipeModal('${dinnerMeal.id}')">🥖 ${dinnerMeal.name}</span>
                    <span class="meal-meta-inline">⏱️ ${dinnerMeal.prepTime} min</span>
                    <div class="slot-actions">
                        <button class="btn-slot-action" onclick="promptSwapMeal(${day.dayNumber}, 'dinner')" title="Vymeniť">✏️</button>
                        <button class="btn-slot-action" onclick="removeDinner(${day.dayNumber})" title="Odobrať">❌</button>
                    </div>
                </div>
            `;
        } else {
            dinnerHtml = `
                <div class="plan-meal-slot">
                    <span class="slot-label">Večera</span>
                    <span class="meal-name" onclick="promptSwapMeal(${day.dayNumber}, 'dinner')">🥖 Studená večera / Zvyšky</span>
                    <div class="slot-actions">
                        <button class="btn-slot-action" onclick="promptSwapMeal(${day.dayNumber}, 'dinner')" title="Pridať jedlo">➕</button>
                    </div>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="plan-day-info">
                <span class="plan-day-name">${day.date}</span>
                <span class="plan-day-date">Deň ${day.dayNumber}</span>
                <label class="checkbox-container" style="margin-top: 10px; font-size: 12px; color: var(--text-muted);">
                    <input type="checkbox" ${day.isCooked ? 'checked' : ''} onchange="toggleDayCookedState(${day.dayNumber}, this.checked)">
                    <span class="checkmark" style="height: 16px; width: 16px;"></span>
                    Uvarené/Ukončené
                </label>
            </div>
            ${lunchHtml}
            ${dinnerHtml}
        `;
        timeline.appendChild(div);
    });
}

function toggleDayCookedState(dayNumber, isChecked) {
    const day = currentPlan.days.find(d => d.dayNumber === dayNumber);
    if (day) {
        day.isCooked = isChecked;
        savePlanToStorage();
        // If we are currently on the Today screen, update it
        renderPlanScreen();
    }
}

function removeDinner(dayNumber) {
    const day = currentPlan.days.find(d => d.dayNumber === dayNumber);
    if (day) {
        day.dinner = null;
        savePlanToStorage();
        regenerateShoppingListFromPlan();
        renderPlanScreen();
    }
}

// ----------------------------------------------------
// MEAL SWAPPING LOGIC IN PLANNER
// ----------------------------------------------------
let swapTargetDay = null;
let swapTargetType = null; // 'lunch' | 'dinner'

function promptSwapMeal(dayNumber, type) {
    swapTargetDay = dayNumber;
    swapTargetType = type;

    const modal = document.getElementById("swap-meal-modal");
    const label = document.getElementById("swap-day-label");
    if (!modal || !label) return;

    const day = currentPlan.days.find(d => d.dayNumber === dayNumber);
    label.innerText = `Zvoľte jedlo pre: ${day.date} - ${type === 'lunch' ? 'Obed' : 'Večera'}`;
    
    // Clear search
    document.getElementById("swap-search").value = "";
    
    // Render list
    renderSwapList();
    
    modal.classList.add("active");
}

function closeSwapMealModal() {
    const modal = document.getElementById("swap-meal-modal");
    if (modal) modal.classList.remove("active");
}

function renderSwapList() {
    const container = document.getElementById("swap-meals-list");
    if (!container) return;

    container.innerHTML = "";
    const searchVal = document.getElementById("swap-search").value.toLowerCase();

    // Filter meals
    const filtered = meals.filter(m => m.name.toLowerCase().includes(searchVal));

    // Special items for swap
    if (swapTargetType === 'lunch') {
        // Add option to eat leftovers
        const divLeftover = document.createElement("div");
        divLeftover.className = "swap-meal-item";
        divLeftover.onclick = () => selectSwapMeal("leftover");
        divLeftover.innerHTML = `
            <span class="swap-meal-item-name">🥡 Dojedanie zo včera</span>
            <span class="swap-meal-item-cat">Šetrí čas a zásoby</span>
        `;
        container.appendChild(divLeftover);
    } else {
        // Add option to eat cold dinner
        const divCold = document.createElement("div");
        divCold.className = "swap-meal-item";
        divCold.onclick = () => selectSwapMeal(null);
        divCold.innerHTML = `
            <span class="swap-meal-item-name">🥖 Studená večera / Zvyšky</span>
            <span class="swap-meal-item-cat">Bez varenia</span>
        `;
        container.appendChild(divCold);
    }

    filtered.forEach(m => {
        const div = document.createElement("div");
        div.className = "swap-meal-item";
        div.onclick = () => selectSwapMeal(m.id);
        div.innerHTML = `
            <span class="swap-meal-item-name">${m.name}</span>
            <span class="swap-meal-item-cat">${m.category.toUpperCase()} | ⏱️ ${m.prepTime} min</span>
        `;
        container.appendChild(div);
    });
}

function filterSwapList() {
    renderSwapList();
}

function selectSwapMeal(mealId) {
    const day = currentPlan.days.find(d => d.dayNumber === swapTargetDay);
    if (day) {
        if (swapTargetType === 'lunch') {
            day.lunch = mealId;
        } else {
            day.dinner = mealId;
        }
        
        savePlanToStorage();
        regenerateShoppingListFromPlan();
        closeSwapMealModal();
        renderPlanScreen();
    }
}

// ----------------------------------------------------
// SCREEN 3: NÁKUPNÝ ZOZNAM (SHOPPING LIST)
// ----------------------------------------------------
function regenerateShoppingListFromPlan() {
    if (!currentPlan) return;

    const list = [];
    const pantryMameNames = pantry.filter(p => p.status === "mame").map(p => p.name.toLowerCase());
    const pantryDochadza = pantry.filter(p => p.status === "dochadza");
    const pantryTrebaKupit = pantry.filter(p => p.status === "treba-kupit");

    // Keep manual entries that are currently in the list
    const manualEntries = shoppingList.filter(item => item.manual && !item.checked);

    // 1. Add ingredients from planned recipes
    currentPlan.days.forEach(day => {
        let lunchMeal = null;
        
        if (day.lunch === "leftover") {
            // Leftovers don't add new ingredients
        } else {
            lunchMeal = meals.find(m => m.id === day.lunch);
        }

        const dinnerMeal = meals.find(m => m.id === day.dinner);

        const gatherIngredients = (meal) => {
            if (!meal) return;
            const parsed = parseIngredients(meal.ingredientsText);
            parsed.forEach(ing => {
                // If it is already marked "máme" in pantry, skip adding to shopping list
                if (pantryMameNames.includes(ing.name.toLowerCase())) {
                    return; // Skip
                }

                // Check if already in list
                const existing = list.find(item => item.name.toLowerCase() === ing.name.toLowerCase() && item.unit === ing.unit);
                if (existing) {
                    if (ing.quantity !== null && existing.quantity !== null) {
                        existing.quantity += ing.quantity;
                    }
                } else {
                    list.push({
                        name: ing.name,
                        quantity: ing.quantity,
                        unit: ing.unit,
                        category: ing.category,
                        checked: false,
                        manual: false
                    });
                }
            });
        };

        gatherIngredients(lunchMeal);
        gatherIngredients(dinnerMeal);
    });

    // 2. Add pantry items marked as "treba-kupit" (must buy)
    pantryTrebaKupit.forEach(item => {
        const existing = list.find(l => l.name.toLowerCase() === item.name.toLowerCase());
        if (!existing) {
            list.push({
                name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
                quantity: 1,
                unit: "bal",
                category: "trvanlive", // default category for pantry
                checked: false,
                manual: true
            });
        }
    });

    // 3. Add pantry items marked as "dochadza" (running out) - let's add with a note
    pantryDochadza.forEach(item => {
        const existing = list.find(l => l.name.toLowerCase() === item.name.toLowerCase());
        if (!existing) {
            list.push({
                name: `${item.name.charAt(0).toUpperCase() + item.name.slice(1)} (dochádza doma)`,
                quantity: 1,
                unit: "bal",
                category: "trvanlive",
                checked: false,
                manual: true
            });
        }
    });

    // 4. Add manual entries
    manualEntries.forEach(item => {
        const existing = list.find(l => l.name.toLowerCase() === item.name.toLowerCase() && l.unit === item.unit);
        if (!existing) {
            list.push(item);
        }
    });

    shoppingList = list;
    saveShoppingToStorage();
}

function renderShoppingList() {
    const container = document.getElementById("shopping-categories-container");
    const pantryNotice = document.getElementById("shopping-pantry-notices");
    if (!container || !pantryNotice) return;

    container.innerHTML = "";
    pantryNotice.innerHTML = "";

    // Render categorized shopping list
    const categories = {};
    Object.keys(CATEGORY_TRANSLATIONS).forEach(cat => {
        categories[cat] = [];
    });

    shoppingList.forEach(item => {
        const cat = item.category || "ostatne";
        if (categories[cat]) {
            categories[cat].push(item);
        } else {
            categories["ostatne"].push(item);
        }
    });

    let totalItems = 0;
    Object.keys(categories).forEach(catKey => {
        const items = categories[catKey];
        if (items.length === 0) return;

        totalItems += items.length;

        const groupDiv = document.createElement("div");
        groupDiv.className = "shopping-category-group";
        
        let catEmoji = "📦";
        if (catKey === 'zelenina') catEmoji = "🥦";
        if (catKey === 'maso') catEmoji = "🥩";
        if (catKey === 'mliecne') catEmoji = "🥛";
        if (catKey === 'pecivo') catEmoji = "🥖";
        if (catKey === 'trvanlive') catEmoji = "🥫";
        if (catKey === 'mrazene') catEmoji = "❄️";
        if (catKey === 'drogeria') catEmoji = "🧼";

        groupDiv.innerHTML = `
            <h4>${catEmoji} ${CATEGORY_TRANSLATIONS[catKey]}</h4>
            <ul class="shopping-list">
                <!-- Items list -->
            </ul>
        `;

        const ul = groupDiv.querySelector("ul");

        items.forEach(item => {
            const li = document.createElement("li");
            li.className = `shopping-item ${item.checked ? 'checked' : ''}`;
            
            const qtyText = item.quantity !== null ? `${item.quantity} ${item.unit}` : "";
            const qtyBadge = qtyText ? `<span class="shop-item-qty-badge">${qtyText}</span>` : "";
            const manualTag = item.manual ? `<span class="shopping-item-manual-indicator">Manuálne</span>` : "";

            li.innerHTML = `
                <div class="shopping-item-left" onclick="toggleShoppingItem('${item.name}', '${item.unit}')">
                    <div class="shop-checkbox"></div>
                    <span class="shop-item-text">${item.name} ${qtyBadge} ${manualTag}</span>
                </div>
                <button class="btn-delete-shop-item" onclick="deleteShoppingItem('${item.name}', '${item.unit}')" title="Vymazať">🗑️</button>
            `;
            ul.appendChild(li);
        });

        container.appendChild(groupDiv);
    });

    if (totalItems === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 40px 0;">Váš nákupný zoznam je prázdny. Vygenerujte jedálniček alebo pridajte suroviny ručne.</p>`;
    }

    // Render Pantry warnings (MÁME doma)
    const pantryMame = pantry.filter(p => p.status === "mame");
    if (pantryMame.length > 0) {
        const box = document.createElement("div");
        box.className = "pantry-notice-box card";
        box.innerHTML = `
            <h3>👍 Tieto suroviny máte doma</h3>
            <p class="section-subtitle">Preto sme ich nedávali na nákupný zoznam. Pred nákupom ich predsa len skontrolujte:</p>
            <ul>
                <!-- List -->
            </ul>
        `;
        const ul = box.querySelector("ul");

        pantryMame.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span style="text-transform: capitalize; font-weight: 500;">${item.name}</span>
                <span class="pantry-item-badge mame" style="padding: 2px 6px; font-size: 10px;">MÁME doma</span>
            `;
            ul.appendChild(li);
        });

        pantryNotice.appendChild(box);
    }
}

function toggleShoppingItem(name, unit) {
    const item = shoppingList.find(i => i.name === name && i.unit === unit);
    if (item) {
        item.checked = !item.checked;
        saveShoppingToStorage();
        renderShoppingList();
    }
}

function deleteShoppingItem(name, unit) {
    shoppingList = shoppingList.filter(i => !(i.name === name && i.unit === unit));
    saveShoppingToStorage();
    renderShoppingList();
}

function addManualShoppingItem(event) {
    event.preventDefault();
    const nameInput = document.getElementById("shop-item-name");
    const qtyInput = document.getElementById("shop-item-qty");
    const unitInput = document.getElementById("shop-item-unit");
    const catInput = document.getElementById("shop-item-category");

    if (!nameInput || nameInput.value.trim() === "") return;

    const name = nameInput.value.trim();
    const qty = qtyInput.value ? parseFloat(qtyInput.value) : null;
    const unit = unitInput.value;
    const category = catInput.value;

    // Check if duplicate
    const existing = shoppingList.find(i => i.name.toLowerCase() === name.toLowerCase() && i.unit === unit);
    if (existing) {
        if (qty !== null && existing.quantity !== null) {
            existing.quantity += qty;
        }
    } else {
        shoppingList.unshift({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            quantity: qty,
            unit: unit,
            category: category,
            checked: false,
            manual: true
        });
    }

    saveShoppingToStorage();
    renderShoppingList();

    // Reset inputs
    nameInput.value = "";
    qtyInput.value = "";
    nameInput.focus();
}

function clearCheckedShoppingItems() {
    shoppingList = shoppingList.filter(item => !item.checked);
    saveShoppingToStorage();
    renderShoppingList();
}

function updateShoppingBadge() {
    const badge = document.getElementById("shopping-badge-count");
    if (!badge) return;

    const activeCount = shoppingList.filter(item => !item.checked).length;
    if (activeCount > 0) {
        badge.innerText = activeCount;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
}

// Generate text of shopping list and copy to device clipboard
function copyShoppingListToClipboard() {
    let text = "🛒 *NÁKUPNÝ ZOZNAM* 🛒\n\n";

    const categories = {};
    Object.keys(CATEGORY_TRANSLATIONS).forEach(cat => {
        categories[cat] = [];
    });

    shoppingList.forEach(item => {
        if (item.checked) return; // Skip bought items
        const cat = item.category || "ostatne";
        categories[cat].push(item);
    });

    let totalItems = 0;
    Object.keys(categories).forEach(catKey => {
        const items = categories[catKey];
        if (items.length === 0) return;

        totalItems += items.length;
        text += `🟢 *${CATEGORY_TRANSLATIONS[catKey].toUpperCase()}*\n`;
        
        items.forEach(item => {
            const qtyText = item.quantity !== null ? ` (${item.quantity} ${item.unit})` : "";
            text += `- [ ] ${item.name}${qtyText}\n`;
        });
        text += "\n";
    });

    if (totalItems === 0) {
        alert("Nákupný zoznam je prázdny. Nie je čo kopírovať.");
        return;
    }

    text += "_Vygenerované rodinnou aplikáciou Jedálniček._";

    navigator.clipboard.writeText(text).then(() => {
        alert("Nákupný zoznam bol skopírovaný do schránky! Môžete ho vložiť do WhatsAppu alebo poznámok.");
    }).catch(err => {
        console.error("Copy failed: ", err);
        alert("Kopírovanie zlyhalo. Skopírujte si text ručne.");
    });
}

// ----------------------------------------------------
// SCREEN 4: RECIPES DATABASE (NAŠE JEDLÁ)
// ----------------------------------------------------
function renderMealsScreen() {
    const grid = document.getElementById("meals-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const searchVal = document.getElementById("meal-search").value.toLowerCase();
    const catVal = document.getElementById("meal-filter-category").value;
    const likedVal = document.getElementById("meal-filter-liked").value;

    let filtered = meals;

    // Search filter
    if (searchVal) {
        filtered = filtered.filter(m => m.name.toLowerCase().includes(searchVal));
    }

    // Category filter
    if (catVal !== "all") {
        filtered = filtered.filter(m => m.category === catVal);
    }

    // LikedBy filter
    if (likedVal !== "all") {
        filtered = filtered.filter(m => m.likedBy.includes(likedVal));
    }

    filtered.forEach(meal => {
        const div = document.createElement("div");
        div.className = "meal-card card";

        const likesIcons = meal.likedBy.map(role => {
            if (role === 'mama') return '<span class="like-icon-badge" title="Mama">👩</span>';
            if (role === 'otec') return '<span class="like-icon-badge" title="Otec">👨</span>';
            if (role === 'ivo', 'majo') return '<span class="like-icon-badge" title="Syn">👦</span>';
            return '';
        }).join(' ');

        let catLabel = meal.category.toUpperCase();
        if (meal.category === 'polievka') catLabel = "🍜 Polievka";
        if (meal.category === 'hlavne') catLabel = "🥩 Hlavné";
        if (meal.category === 'rychle') catLabel = "⚡ Rýchle";
        if (meal.category === 'bezmasite') catLabel = "🥦 Bezmäsité";
        if (meal.category === 'dvojdnove') catLabel = "📅 Na 2 dni";
        if (meal.category === 'lahke') catLabel = "🥗 Ľahké";
        if (meal.category === 'vikendove') catLabel = "✨ Víkend";

        // Admin actions visible for parents
        const isAdmin = familyState.activeRole !== "ivo" && familyState.activeRole !== "majo";
        const editActionsMarkup = isAdmin ? `
            <div class="meal-card-edit-btns">
                <button class="btn-card-action" onclick="openEditMealModal('${meal.id}')" title="Upraviť">✏️</button>
                <button class="btn-card-action" onclick="deleteMealPrompt('${meal.id}')" title="Vymazať">🗑️</button>
            </div>
        ` : "";

        let ratingBadge = "";
        if (meal.rating && meal.rating !== "bolo-v-poriadku") {
            let label = "Bolo OK";
            let cls = "poriadok";
            if (meal.rating === 'chutilo') { label = "😋 Chutilo"; cls = "chutilo"; }
            if (meal.rating === 'menej-casto') { label = "😐 Menej často"; cls = "menej-casto"; }
            if (meal.rating === 'nechceme') { label = "🤢 Neopakovať"; cls = "nechceme"; }
            
            ratingBadge = `<span class="rating-badge-active ${cls}" style="margin: 0; padding: 2px 6px; font-size: 10px;">${label}</span>`;
        }

        div.innerHTML = `
            <div>
                <div class="meal-card-header">
                    <span class="meal-card-category">${catLabel}</span>
                    ${ratingBadge}
                </div>
                <h3 class="meal-card-title" onclick="openRecipeModal('${meal.id}')">${meal.name}</h3>
                <div class="meal-card-likes">
                    ${likesIcons}
                </div>
                <div class="meal-card-details-preview">
                    <div class="meal-card-detail-item">⏱️ Čas: ${meal.prepTime} min</div>
                    <div class="meal-card-detail-item">📊 Náročnosť: ${meal.difficulty === 'lahke' ? 'Ľahká' : meal.difficulty === 'stredne' ? 'Stredná' : 'Náročná'}</div>
                    <div class="meal-card-detail-item">👥 Porcie: ${meal.servings}</div>
                </div>
            </div>
            <div class="meal-card-footer">
                <button class="btn btn-secondary btn-sm" onclick="openRecipeModal('${meal.id}')">Zobraziť recept</button>
                ${editActionsMarkup}
            </div>
        `;

        grid.appendChild(div);
    });

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">Nenašli sa žiadne jedlá zodpovedajúce filtru.</p>`;
    }
}

function filterMeals() {
    renderMealsScreen();
}

function deleteMealPrompt(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        if (confirm(`Chcete naozaj vymazať recept "${meal.name}" zo svojej databázy?`)) {
            meals = meals.filter(m => m.id !== mealId);
            saveMealsToStorage();
            renderMealsScreen();
        }
    }
}

// ----------------------------------------------------
// RECIPE DETAIL MODAL
// ----------------------------------------------------
function openRecipeModal(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    const modal = document.getElementById("recipe-modal");
    const container = document.getElementById("modal-recipe-details");
    if (!modal || !container) return;

    // Render ingredients rows
    const ingredients = parseIngredients(meal.ingredientsText);
    let ingredientsRowsHtml = "";
    ingredients.forEach(ing => {
        ingredientsRowsHtml += `
            <div class="recipe-ingredient-row">
                <span><strong>${ing.name}</strong></span>
                <span>${ing.quantity !== null ? ing.quantity : ""} ${ing.unit}</span>
            </div>
        `;
    });

    let catLabel = meal.category.toUpperCase();
    if (meal.category === 'polievka') catLabel = "🍜 Polievka";
    if (meal.category === 'hlavne') catLabel = "🥩 Hlavné jedlo";
    if (meal.category === 'rychle') catLabel = "⚡ Rýchle jedlo";
    if (meal.category === 'bezmasite') catLabel = "🥦 Bezmäsité jedlo";
    if (meal.category === 'dvojdnove') catLabel = "📅 Jedlo na 2 dni";
    if (meal.category === 'lahke') catLabel = "🥗 Ľahké jedlo";
    if (meal.category === 'vikendove') catLabel = "✨ Víkendové jedlo";

    let ratingText = "Zatiaľ nehodnotené";
    if (meal.rating === 'chutilo') ratingText = "😋 Veľmi chutilo!";
    if (meal.rating === 'bolo-v-poriadku') ratingText = "😐 Bolo v poriadku";
    if (meal.rating === 'menej-casto') ratingText = "😒 Radšej menej často";
    if (meal.rating === 'nechceme') ratingText = "🤢 Nechceme opakovať";

    container.innerHTML = `
        <div class="recipe-modal-header">
            <span class="meal-card-category" style="margin-bottom: 8px; display: inline-block;">${catLabel}</span>
            <h2 class="recipe-modal-title">${meal.name}</h2>
            <div style="font-size: 13px; color: var(--text-muted);">
                ⏱️ Príprava: <strong>${meal.prepTime} min</strong> | 👥 Porcie: <strong>${meal.servings}</strong> | Hodnotenie: <strong>${ratingText}</strong>
            </div>
        </div>

        <h4 class="recipe-section-title">📋 Potrebné Suroviny</h4>
        <div class="recipe-ingredients-grid">
            ${ingredientsRowsHtml}
        </div>

        <h4 class="recipe-section-title">🍳 Postup Prípravy</h4>
        <p class="recipe-instructions-text">${meal.instructions || "Tento recept zatiaľ nemá popísaný postup."}</p>

        ${meal.note ? `
            <div class="recipe-note-box">
                <strong>Poznámka:</strong> ${meal.note}
            </div>
        ` : ""}
    `;

    modal.classList.add("active");
}

function closeRecipeModal() {
    const modal = document.getElementById("recipe-modal");
    if (modal) modal.classList.remove("active");
}

// Close modals when clicking outside
window.onclick = function(event) {
    const recModal = document.getElementById("recipe-modal");
    const formModal = document.getElementById("meal-form-modal");
    const swapModal = document.getElementById("swap-meal-modal");
    
    if (event.target === recModal) closeRecipeModal();
    if (event.target === formModal) closeMealFormModal();
    if (event.target === swapModal) closeSwapMealModal();
};

// ----------------------------------------------------
// RECIPE EDITOR FORM MODAL
// ----------------------------------------------------
function openAddMealModal() {
    const modal = document.getElementById("meal-form-modal");
    const title = document.getElementById("meal-form-title");
    const form = document.getElementById("meal-editor-form");
    if (!modal || !title || !form) return;

    title.innerText = "Pridať nové jedlo";
    form.reset();
    document.getElementById("edit-meal-id").value = "";

    modal.classList.add("active");
}

function openEditMealModal(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (!meal) return;

    const modal = document.getElementById("meal-form-modal");
    const title = document.getElementById("meal-form-title");
    if (!modal || !title) return;

    title.innerText = `Upraviť jedlo: ${meal.name}`;

    document.getElementById("edit-meal-id").value = meal.id;
    document.getElementById("edit-meal-name").value = meal.name;
    document.getElementById("edit-meal-category").value = meal.category;
    document.getElementById("edit-meal-servings").value = meal.servings;
    document.getElementById("edit-meal-preptime").value = meal.prepTime;
    document.getElementById("edit-meal-difficulty").value = meal.difficulty;
    document.getElementById("edit-meal-cook2days").checked = meal.cookForTwoDays || false;
    document.getElementById("edit-meal-freeze").checked = meal.canFreeze || false;
    document.getElementById("edit-meal-popularity").value = meal.popularity;

    // Checked who likes it
    document.getElementById("like-mama").checked = meal.likedBy.includes("mama");
    document.getElementById("like-otec").checked = meal.likedBy.includes("otec");
    document.getElementById("like-syn").checked = meal.likedBy.includes("ivo", "majo");

    document.getElementById("edit-meal-ingredients").value = meal.ingredientsText || "";
    document.getElementById("edit-meal-instructions").value = meal.instructions || "";
    document.getElementById("edit-meal-note").value = meal.note || "";

    modal.classList.add("active");
}

function closeMealFormModal() {
    const modal = document.getElementById("meal-form-modal");
    if (modal) modal.classList.remove("active");
}

function saveMealForm(event) {
    event.preventDefault();

    const id = document.getElementById("edit-meal-id").value;
    const name = document.getElementById("edit-meal-name").value.trim();
    const category = document.getElementById("edit-meal-category").value;
    const servings = parseInt(document.getElementById("edit-meal-servings").value) || 4;
    const prepTime = parseInt(document.getElementById("edit-meal-preptime").value) || 45;
    const difficulty = document.getElementById("edit-meal-difficulty").value;
    const cookForTwoDays = document.getElementById("edit-meal-cook2days").checked;
    const canFreeze = document.getElementById("edit-meal-freeze").checked;
    const popularity = document.getElementById("edit-meal-popularity").value;

    const likedBy = [];
    if (document.getElementById("like-mama").checked) likedBy.push("mama");
    if (document.getElementById("like-otec").checked) likedBy.push("otec");
    if (document.getElementById("like-syn").checked) likedBy.push("ivo", "majo");

    const ingredientsText = document.getElementById("edit-meal-ingredients").value.trim();
    const instructions = document.getElementById("edit-meal-instructions").value.trim();
    const note = document.getElementById("edit-meal-note").value.trim();

    if (id) {
        // Edit existing
        const meal = meals.find(m => m.id === id);
        if (meal) {
            meal.name = name;
            meal.category = category;
            meal.servings = servings;
            meal.prepTime = prepTime;
            meal.difficulty = difficulty;
            meal.cookForTwoDays = cookForTwoDays;
            meal.canFreeze = canFreeze;
            meal.popularity = popularity;
            meal.likedBy = likedBy;
            meal.ingredientsText = ingredientsText;
            meal.instructions = instructions;
            meal.note = note;
        }
    } else {
        // Create new
        const newId = "m_" + Date.now();
        meals.push({
            id: newId,
            name,
            category,
            servings,
            prepTime,
            difficulty,
            cookForTwoDays,
            canFreeze,
            popularity,
            likedBy,
            ingredientsText,
            instructions,
            note,
            rating: "bolo-v-poriadku"
        });
    }

    saveMealsToStorage();
    renderMealsScreen();
    closeMealFormModal();
}

// ----------------------------------------------------
// SCREEN 5: PANTRY STOCK (ZÁSOBY DOMA)
// ----------------------------------------------------
function renderPantryScreen() {
    const grid = document.getElementById("pantry-grid");
    if (!grid) return;

    // Toggle admin actions card visibility
    const adminActions = document.getElementById("pantry-admin-actions");
    const isAdmin = familyState.activeRole !== "ivo" && familyState.activeRole !== "majo";
    if (adminActions) {
        if (isAdmin) {
            adminActions.classList.remove("hidden");
        } else {
            adminActions.classList.add("hidden");
        }
    }

    grid.innerHTML = "";

    pantry.forEach(item => {
        const div = document.createElement("div");
        div.className = "pantry-card card";

        let badgeText = "Máme doma";
        if (item.status === 'dochadza') badgeText = "Dochádza";
        if (item.status === 'treba-kupit') badgeText = "Treba kúpiť";

        const deleteBtnMarkup = isAdmin 
            ? `<button onclick="deletePantryItem('${item.name}')" title="Vymazať surovinu" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 14px; padding: 0; margin-right: 8px; transition: var(--transition-fast);">🗑️</button>`
            : '';

        div.innerHTML = `
            <div class="pantry-item-info">
                <div style="display: flex; align-items: center;">
                    ${deleteBtnMarkup}
                    <span class="pantry-item-name">${item.name}</span>
                </div>
                <span class="pantry-item-badge ${item.status}">${badgeText}</span>
            </div>
            <div class="pantry-status-toggle">
                <button class="pantry-status-btn mame ${item.status === 'mame' ? 'active' : ''}" onclick="togglePantryItemStatus('${item.name}', 'mame')">Máme</button>
                <button class="pantry-status-btn dochadza ${item.status === 'dochadza' ? 'active' : ''}" onclick="togglePantryItemStatus('${item.name}', 'dochadza')">Dochádza</button>
                <button class="pantry-status-btn treba-kupit ${item.status === 'treba-kupit' ? 'active' : ''}" onclick="togglePantryItemStatus('${item.name}', 'treba-kupit')">Kúpiť</button>
            </div>
        `;
        grid.appendChild(div);
    });
}

function deletePantryItem(name) {
    if (confirm('Naozaj chcete surovinu "' + name + '" vymazať zo zoznamu zásob?')) {
        pantry = pantry.filter(p => p.name.toLowerCase() !== name.toLowerCase());
        savePantryToStorage();
        renderPantryScreen();
        updateSynPantryProgress();
    }
}

function addNewPantryItem() {
    const input = document.getElementById("new-pantry-item-name");
    if (!input) return;
    const name = input.value.trim();
    if (!name) return;

    // Check if already exists
    const exists = pantry.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) {
        alert('Surovina "' + name + '" sa už v zásobách nachádza.');
        return;
    }

    pantry.push({
        name: name,
        status: "mame",
        checkedAt: null
    });

    savePantryToStorage();
    input.value = "";
    renderPantryScreen();
    updateSynPantryProgress();
}

function togglePantryItemStatus(name, newStatus) {
    const item = pantry.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (item) {
        item.status = newStatus;
        savePantryToStorage();
        renderPantryScreen();
        
        // Auto update shopping list on pantry changes
        regenerateShoppingListFromPlan();

        // Increment Syn progress checklist if he is doing the task
        if (familyState.activeRole === "ivo" || familyState.activeRole === "majo") {
            updateSynPantryProgress();
        }
    }
}

// ----------------------------------------------------
// SCREEN 6: SON'S AREA & FAMILY SUGGESTIONS
// ----------------------------------------------------
function renderSuggestionsScreen() {
    const pSuggestions = document.getElementById("parent-suggestions-list");
    if (!pSuggestions) return;

    pSuggestions.innerHTML = "";

    // Load suggestions from state
    const activeSon = (familyState.activeRole === "ivo" || familyState.activeRole === "majo") ? familyState.activeRole : null;

    // Load suggestions of BOTH Ivo and Majo for parents
    if (familyState.suggestions.ivo && familyState.suggestions.ivo.length > 0) {
        familyState.suggestions.ivo.forEach((sug, index) => {
            if (!sug) return;
            const li = document.createElement("li");
            li.innerHTML = `
                <span>👦 Ivo: ${sug}</span>
                <button class="btn-add-to-plan" onclick="addSuggestedMealToDatabase('${sug}', 'ivo', ${index})">➕ Pridať do databázy</button>
            `;
            pSuggestions.appendChild(li);
        });
    }
    if (familyState.suggestions.majo && familyState.suggestions.majo.length > 0) {
        familyState.suggestions.majo.forEach((sug, index) => {
            if (!sug) return;
            const li = document.createElement("li");
            li.innerHTML = `
                <span>👦 Majo: ${sug}</span>
                <button class="btn-add-to-plan" onclick="addSuggestedMealToDatabase('${sug}', 'majo', ${index})">➕ Pridať do databázy</button>
            `;
            pSuggestions.appendChild(li);
        });
    }

    if (pSuggestions.innerHTML === "") {
        pSuggestions.innerHTML = `<li style="background: none; padding: 0; color: var(--text-muted);">Žiadne aktívne návrhy jedál od rodiny.</li>`;
    }

    // Set UI elements based on active role (Ivo or Majo vs Parents)
    const badgeLabel = document.getElementById("son-badge-label");
    const titleLabel = document.getElementById("son-title-label");
    const suggestTitle = document.getElementById("son-suggest-title");

    if (activeSon) {
        const nameCap = familyState.activeRole.charAt(0).toUpperCase() + familyState.activeRole.slice(1);
        if (badgeLabel) badgeLabel.innerText = "👦 Úlohy pre " + nameCap;
        if (titleLabel) titleLabel.innerText = "🎯 Tvoje návrhy a pomoc špajzi";
        if (suggestTitle) suggestTitle.innerText = "Navrhni 3 jedlá na tento týždeň, na ktoré máš chuť";
    } else {
        if (badgeLabel) badgeLabel.innerText = "👦 Ivo & Majo";
        if (titleLabel) titleLabel.innerText = "🎯 Pomoc s jedálničkom a zásobami";
        if (suggestTitle) suggestTitle.innerText = "Návrhy jedál na tento týždeň";
    }

    // Load inputs for active role
    const input1 = document.getElementById("son-suggest-1");
    const input2 = document.getElementById("son-suggest-2");
    const input3 = document.getElementById("son-suggest-3");

    if (input1 && input2 && input3) {
        if (activeSon) {
            input1.value = familyState.suggestions[familyState.activeRole][0] || "";
            input2.value = familyState.suggestions[familyState.activeRole][1] || "";
            input3.value = familyState.suggestions[familyState.activeRole][2] || "";
        } else {
            input1.value = "";
            input2.value = "";
            input3.value = "";
        }
    }

    // Handle display boxes based on state
    const inputsBox = document.getElementById("son-meal-inputs-container");
    const displayBox = document.getElementById("son-suggestions-display");

    if (activeSon && familyState.suggestions[familyState.activeRole] && familyState.suggestions[familyState.activeRole].filter(Boolean).length === 3) {
        inputsBox.classList.add("hidden");
        displayBox.classList.remove("hidden");
        
        let listHtml = "<h5>Tvoje návrhy na tento týždeň:</h5><ul>";
        familyState.suggestions[familyState.activeRole].forEach(s => {
            listHtml += `<li>⭐ ${s}</li>`;
        });
        listHtml += "</ul><button class='btn btn-secondary btn-sm' style='margin-top: 8px;' onclick='editSonSuggestions()'>✏️ Upraviť návrhy</button>";
        displayBox.innerHTML = listHtml;
    } else {
        if (activeSon) {
            inputsBox.classList.remove("hidden");
        } else {
            inputsBox.classList.add("hidden"); // Parents don't fill suggestions
        }
        displayBox.classList.add("hidden");
    }

    // Refresh pantry task status
    updateSynPantryProgress();

    // Render son's rating target (recently cooked meals)
    renderSonRatingTarget();
}

function saveSonSuggestions() {
    const activeSon = (familyState.activeRole === "ivo" || familyState.activeRole === "majo") ? familyState.activeRole : null;
    if (!activeSon) return;

    const sug1 = document.getElementById("son-suggest-1").value.trim();
    const sug2 = document.getElementById("son-suggest-2").value.trim();
    const sug3 = document.getElementById("son-suggest-3").value.trim();

    if (!sug1 || !sug2 || !sug3) {
        alert("Prosím, napíš všetky 3 jedlá.");
        return;
    }

    familyState.suggestions[activeSon] = [sug1, sug2, sug3];
    saveFamilyStateToStorage();
    renderSuggestionsScreen();
    alert("Super! Tvoje návrhy boli uložené a rodičia ich uvidia.");
}

function editSonSuggestions() {
    const activeSon = (familyState.activeRole === "ivo" || familyState.activeRole === "majo") ? familyState.activeRole : null;
    if (!activeSon) return;

    familyState.suggestions[activeSon] = [];
    saveFamilyStateToStorage();
    renderSuggestionsScreen();
}

function addSuggestedMealToDatabase(mealName, sourceSon, suggestionIndex) {
    // Open Add Meal Modal with prefilled name
    openAddMealModal();
    document.getElementById("edit-meal-name").value = mealName;
    
    // Check correct checkbox
    if (sourceSon === 'ivo') {
        document.getElementById("like-ivo").checked = true;
    } else if (sourceSon === 'majo') {
        document.getElementById("like-majo").checked = true;
    }
}

function updateSynPantryProgress() {
    const progressText = document.getElementById("pantry-checked-count");
    const progressFill = document.getElementById("pantry-bar-fill");
    if (!progressText || !progressFill) return;

    // For simplicity, let's track how many items are updated in pantry
    // In actual usage, we can set checkedCount to 12 if he clicks check off
    // Let's assume he has checked 8 items
    let count = pantry.length; // 12
    progressText.innerText = count;
    progressFill.style.width = "100%";

    // If done, add congratulations badge
    const checkbox = document.querySelector("#mission-2-status .mission-checkbox");
    if (checkbox) {
        checkbox.innerText = "🏆";
        checkbox.style.backgroundColor = "#d4efdf";
        checkbox.style.color = "#27ae60";
    }
}

function renderSonRatingTarget() {
    const container = document.getElementById("son-rating-container");
    if (!container) return;

    container.innerHTML = "";

    // Show up to 2 recently planned meals for rating
    if (!currentPlan) return;

    const cookedDays = currentPlan.days.filter(d => d.isCooked);
    if (cookedDays.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 13px;">Zatiaľ ste dnes neuvarili žiadne jedlo z plánu. Keď ho uvaríte, objaví sa tu na hodnotenie!</p>`;
        return;
    }

    // Take last 2 cooked meals
    const targetMeals = [];
    cookedDays.slice(-2).forEach(day => {
        if (day.lunch && day.lunch !== 'leftover') {
            const m = meals.find(item => item.id === day.lunch);
            if (m && !targetMeals.includes(m)) targetMeals.push(m);
        }
        if (day.dinner) {
            const m = meals.find(item => item.id === day.dinner);
            if (m && !targetMeals.includes(m)) targetMeals.push(m);
        }
    });

    const activeSon = (familyState.activeRole === "ivo" || familyState.activeRole === "majo") ? familyState.activeRole : null;

    targetMeals.forEach(meal => {
        const row = document.createElement("div");
        row.className = "son-rating-row";
        
        const isRated = activeSon ? familyState.ratedMealsThisWeek[activeSon].includes(meal.id) : false;

        row.innerHTML = `
            <div class="son-rating-meal-name">Ako ti chutilo: <strong>${meal.name}</strong>?</div>
            <div class="son-rating-buttons">
                <button class="btn-emoji ${(isRated && meal.rating === 'chutilo') ? 'active' : ''} ${!activeSon ? 'disabled' : ''}" onclick="rateAsSon('${meal.id}', 'chutilo')">😋 Mňam!</button>
                <button class="btn-emoji ${(isRated && meal.rating === 'bolo-v-poriadku') ? 'active' : ''} ${!activeSon ? 'disabled' : ''}" onclick="rateAsSon('${meal.id}', 'bolo-v-poriadku')">😐 OK</button>
                <button class="btn-emoji ${(isRated && meal.rating === 'menej-casto') ? 'active' : ''} ${!activeSon ? 'disabled' : ''}" onclick="rateAsSon('${meal.id}', 'menej-casto')">🤢 Radšej iné</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function rateAsSon(mealId, ratingVal) {
    const activeSon = (familyState.activeRole === "ivo" || familyState.activeRole === "majo") ? familyState.activeRole : null;
    if (!activeSon) return;

    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        meal.rating = ratingVal;
        saveMealsToStorage();
    }

    if (!familyState.ratedMealsThisWeek[activeSon].includes(mealId)) {
        familyState.ratedMealsThisWeek[activeSon].push(mealId);
        saveFamilyStateToStorage();
    }

    renderSuggestionsScreen();
    
    // Also update checkbox badge
    const checkbox = document.querySelector("#mission-3-status .mission-checkbox");
    if (checkbox) {
        checkbox.innerText = "🏆";
        checkbox.style.backgroundColor = "#d4efdf";
        checkbox.style.color = "#27ae60";
    }

    alert("Ďakujeme za hodnotenie jedla! Tvoj názor pomôže pri plánovaní na budúci týždeň.");
}

// ----------------------------------------------------
// FIREBASE SYNCHRONIZATION LOGIC
// ----------------------------------------------------

function initFirebase() {
    const savedConfig = localStorage.getItem("firebase_config");
    if (savedConfig) {
        try {
            firebaseConfig = JSON.parse(savedConfig);
            if (firebaseConfig && firebaseConfig.databaseURL) {
                // Initialize Firebase app if not already done
                if (firebase.apps.length === 0) {
                    firebase.initializeApp(firebaseConfig);
                }
                isFirebaseConnected = true;
                updateConnectionStatusUI(true);
                setupFirebaseListeners();
                console.log("Firebase initialized successfully in online mode.");
            } else {
                updateConnectionStatusUI(false);
            }
        } catch (e) {
            console.error("Failed to parse or initialize Firebase:", e);
            updateConnectionStatusUI(false);
        }
    } else {
        updateConnectionStatusUI(false);
    }
}

function updateConnectionStatusUI(online) {
    const indicator = document.getElementById("connection-status");
    if (!indicator) return;

    if (online) {
        indicator.className = "connection-status-indicator online";
        indicator.querySelector(".status-text").innerText = "Online";
        indicator.setAttribute("title", "Online synchronizácia je aktívna. Kliknite pre nastavenia.");
    } else {
        indicator.className = "connection-status-indicator offline";
        indicator.querySelector(".status-text").innerText = "Lokálne";
        indicator.setAttribute("title", "Kliknutím sem prepojíte celú rodinu.");
    }
}

function setupFirebaseListeners() {
    if (!isFirebaseConnected) return;

    const db = firebase.database();

    // 1. Listen for Meals changes
    db.ref('meals').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
            meals = val;
            localStorage.setItem("family_meals", JSON.stringify(meals));
            if (activeTab === 'meals') renderMealsScreen();
            if (activeTab === 'today') renderTodayScreen();
        } else {
            // Populate database with default values if empty
            db.ref('meals').set(meals);
        }
    });

    // 2. Listen for Pantry changes
    db.ref('pantry').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
            pantry = val;
            localStorage.setItem("family_pantry", JSON.stringify(pantry));
            if (activeTab === 'pantry') renderPantryScreen();
            if (activeTab === 'shopping') renderShoppingList();
            if (activeTab === 'suggestions') updateSynPantryProgress();
        } else {
            db.ref('pantry').set(pantry);
        }
    });

    // 3. Listen for Plan changes
    db.ref('plan').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
            currentPlan = val;
            localStorage.setItem("family_plan", JSON.stringify(currentPlan));
            if (activeTab === 'plan') renderPlanScreen();
            if (activeTab === 'today') renderTodayScreen();
        } else {
            db.ref('plan').set(currentPlan);
        }
    });

    // 4. Listen for Shopping List changes
    db.ref('shoppingList').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
            shoppingList = val;
            localStorage.setItem("family_shopping", JSON.stringify(shoppingList));
            updateShoppingBadge();
            if (activeTab === 'shopping') renderShoppingList();
        } else {
            db.ref('shoppingList').set(shoppingList);
        }
    });

    // 5. Listen for Family State changes (suggestions, etc.)
    db.ref('familyState').on('value', (snapshot) => {
        const val = snapshot.val();
        if (val) {
            const localRole = familyState.activeRole;
            familyState = val;
            familyState.activeRole = localRole; // Keep device-specific active role
            localStorage.setItem("family_state", JSON.stringify(familyState));
            if (activeTab === 'suggestions') renderSuggestionsScreen();
        } else {
            db.ref('familyState').set(familyState);
        }
    });
}

// Modal handling
function openFirebaseSettingsModal() {
    const modal = document.getElementById("firebase-modal");
    const details = document.getElementById("firebase-status-details");
    const textarea = document.getElementById("fb-config-json");
    const geminiInput = document.getElementById("gemini-api-key");
    if (!modal || !details) return;

    if (isFirebaseConnected) {
        details.style.backgroundColor = "#d4efdf";
        details.style.color = "#196f3d";
        details.innerHTML = "<strong>Stav: PRIPOJENÉ ONLINE 🟢</strong><br>Aplikácia sa úspešne synchronizuje s vašou online databázou. Všetci členovia rodiny, ktorí použijú túto konfiguráciu, vidia rovnaké dáta.";
        const savedConfig = localStorage.getItem("firebase_config");
        if (textarea && savedConfig) {
            textarea.value = savedConfig;
        }
    } else {
        details.style.backgroundColor = "#f2f3f4";
        details.style.color = "#566573";
        details.innerHTML = "<strong>Stav: LOKÁLNY REŽIM ⚪</strong><br>Aplikácia ukladá dáta len vo vašom mobile/počítači. Ak chcete prepojiť celú rodinu, prepojte ju s Firebase.";
        if (textarea) textarea.value = "";
    }

    // Set Gemini key input
    const savedGeminiKey = localStorage.getItem("gemini_api_key");
    if (geminiInput) {
        geminiInput.value = savedGeminiKey || "";
    }

    modal.classList.add("active");
}

function closeFirebaseSettingsModal() {
    const modal = document.getElementById("firebase-modal");
    if (modal) modal.classList.remove("active");
}

function saveFirebaseConfig(event) {
    event.preventDefault();
    const jsonInput = document.getElementById("fb-config-json").value.trim();
    const geminiInput = document.getElementById("gemini-api-key").value.trim();

    // Save Gemini key
    if (geminiInput) {
        localStorage.setItem("gemini_api_key", geminiInput);
        geminiApiKey = geminiInput;
    } else {
        localStorage.removeItem("gemini_api_key");
        geminiApiKey = null;
    }

    // Save Firebase config
    if (jsonInput) {
        try {
            const config = JSON.parse(jsonInput);
            if (!config.apiKey || !config.databaseURL || !config.projectId) {
                alert("Neplatná Firebase konfigurácia! Chýbajú povinné položky (apiKey, databaseURL, projectId).");
                return;
            }
            localStorage.setItem("firebase_config", JSON.stringify(config));
        } catch (e) {
            alert("Chyba: Zadaný text pre Firebase nie je platný JSON kód.");
            return;
        }
    }

    alert("Nastavenia úspešne uložené! Stránka sa reštartuje.");
    window.location.reload();
}

function clearFirebaseConfig() {
    if (confirm("Chcete naozaj vymazať online a AI nastavenia? Aplikácia prejde do lokálneho režimu a AI funkcie sa vypnú.")) {
        localStorage.removeItem("firebase_config");
        localStorage.removeItem("gemini_api_key");
        alert("Nastavenia boli vymazané. Stránka sa reštartuje.");
        window.location.reload();
    }
}

// ----------------------------------------------------
// GEMINI AI CAMERA RECIPE SCANNER LOGIC
// ----------------------------------------------------

function triggerAICamera() {
    const key = localStorage.getItem("gemini_api_key");
    if (!key) {
        alert("Nemáte nastavený Gemini API Kľúč! Otvorte nastavenia (indikátor stavu pripojenia v hlavičke) a zadajte kľúč, ktorý získate zadarmo na Google AI Studio.");
        openFirebaseSettingsModal();
        return;
    }
    document.getElementById("ai-camera-input").click();
}

function processAICameraInput(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show loader inside modal
    const loader = document.getElementById("ai-loading");
    if (loader) loader.classList.remove("hidden");

    const reader = new FileReader();
    reader.onloadend = function() {
        const base64Data = reader.result.split(',')[1];
        const mimeType = file.type;
        analyzeImageWithGemini(base64Data, mimeType);
    };
    reader.readAsDataURL(file);
}

function analyzeImageWithGemini(base64Data, mimeType) {
    const key = localStorage.getItem("gemini_api_key");
    if (!key) return;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key;
    const bTick3 = "`" + "`" + "`";

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: "Si slovenský kulinársky asistent pre rodinu. Analyzuj tento obrázok (ktorý môže byť odfotenou stranou z kuchárskej knihy, rukou písaným receptom alebo priamo fotkou hotového uvareného jedla). Zisti názov a navrhni kompletné vyplnenie receptu v slovenskom jazyku. Výstup vráť STRIKTNE ako jeden platný JSON objekt (žiadny iný text okolo, žiadne markdown značky ako " + bTick3 + "json). JSON musí presne zodpovedať tejto schéme:\n{\n  \"name\": \"Názov jedla (napr. Kurací perkelt)\",\n  \"category\": \"kategória (jedna z hodnôt: polievka, hlavne, rychle, bezmasite, dvojdnove, lahke, vikendove)\",\n  \"servings\": 4,\n  \"prepTime\": 45,\n  \"difficulty\": \"náročnosť (jedna z hodnôt: lahke, stredne, narocne)\",\n  \"cookForTwoDays\": true,\n  \"canFreeze\": false,\n  \"ingredientsText\": \"Zoznam surovín. Každá surovina musí byť na samostatnom riadku v presnom tvare: Názov, MnožstvoJednotka, kategória (napr: Zemiaky, 1kg, zelenina alebo Bravčové pliecko, 600g, maso). Kategórie surovín vyber len z: zelenina, maso, mliecne, pecivo, trvanlive, mrazene, drogeria, ostatne. Uisti sa, že za čiarkou je presné množstvo a kategória, napríklad: Cibuľa, 2ks, zelenina\",\n  \"instructions\": \"Stručný a jasný postup prípravy krok po kroku.\",\n  \"note\": \"Krátka poznámka alebo tip (napr. podávať s ryžou).\"\n}"
                    },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    }
                ]
            }
        ]
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Chyba Gemini API. Skontrolujte platnosť vášho kľúča.");
        }
        return res.json();
    })
    .then(data => {
        const loader = document.getElementById("ai-loading");
        if (loader) loader.classList.add("hidden");

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            let textResponse = data.candidates[0].content.parts[0].text.trim();
            
            // Clean markdown blocks
            const matchStart = new RegExp("^" + bTick3 + "json\\s*");
            const matchEnd = new RegExp("\\s*" + bTick3 + "$");
            const matchSimple = new RegExp("^" + bTick3 + "\\s*");
            
            if (matchStart.test(textResponse)) {
                textResponse = textResponse.replace(matchStart, "").replace(matchEnd, "");
            } else if (matchSimple.test(textResponse)) {
                textResponse = textResponse.replace(matchSimple, "").replace(matchEnd, "");
            }

            const recipe = JSON.parse(textResponse);
            fillRecipeFormWithAIResult(recipe);
        } else {
            throw new Error("Gemini neodpovedal v očakávanom formáte.");
        }
    })
    .catch(err => {
        const loader = document.getElementById("ai-loading");
        if (loader) loader.classList.add("hidden");
        console.error("AI Error:", err);
        alert("Chyba AI analýzy: " + err.message + "\nUistite sa, že máte správny Gemini API kľúč a stabilné internetové pripojenie.");
    });
}

function fillRecipeFormWithAIResult(recipe) {
    if (!recipe) return;

    if (recipe.name) document.getElementById("edit-meal-name").value = recipe.name;
    if (recipe.category) document.getElementById("edit-meal-category").value = recipe.category;
    if (recipe.servings) document.getElementById("edit-meal-servings").value = recipe.servings;
    if (recipe.prepTime) document.getElementById("edit-meal-preptime").value = recipe.prepTime;
    if (recipe.difficulty) document.getElementById("edit-meal-difficulty").value = recipe.difficulty;
    
    document.getElementById("edit-meal-cook2days").checked = recipe.cookForTwoDays || false;
    document.getElementById("edit-meal-freeze").checked = recipe.canFreeze || false;
    
    if (recipe.ingredientsText) document.getElementById("edit-meal-ingredients").value = recipe.ingredientsText;
    if (recipe.instructions) document.getElementById("edit-meal-instructions").value = recipe.instructions;
    if (recipe.note) document.getElementById("edit-meal-note").value = recipe.note;

    alert("Výborne! AI úspešne analyzovala fotografiu a predvyplnila formulár receptu. Skontrolujte údaje a kliknite na 'Uložiť jedlo' pre uloženie.");
}

// ----------------------------------------------------
// GEMINI AI FRIDGE SCANNER LOGIC
// ----------------------------------------------------

function triggerFridgeCamera() {
    const key = localStorage.getItem("gemini_api_key");
    if (!key) {
        alert("Nemáte nastavený Gemini API Kľúč! Otvorte nastavenia (indikátor stavu pripojenia v hlavičke) a zadajte kľúč, ktorý získate zadarmo na Google AI Studio.");
        openFirebaseSettingsModal();
        return;
    }
    document.getElementById("fridge-camera-input").click();
}

function processFridgeCameraInput(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show loader
    const loader = document.getElementById("fridge-loading");
    const results = document.getElementById("fridge-results");
    if (loader) loader.classList.remove("hidden");
    if (results) results.classList.add("hidden");

    const reader = new FileReader();
    reader.onloadend = function() {
        const base64Data = reader.result.split(',')[1];
        const mimeType = file.type;
        analyzeFridgeWithGemini(base64Data, mimeType);
    };
    reader.readAsDataURL(file);
}

function analyzeFridgeWithGemini(base64Data, mimeType) {
    const key = localStorage.getItem("gemini_api_key");
    if (!key) return;

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key;
    const bTick3 = "`" + "`" + "`";

    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: "Si slovenský kulinársky asistent pre rodinu. Analyzuj túto fotografiu (ktorá zobrazuje otvorenú chladničku, špajzu, potraviny na stole alebo nákup). Rozpoznaj potraviny a suroviny, ktoré sú k dispozícii. Na základe nich navrhni presne 3 slovenské recepty, ktoré je možné z nich pripraviť. Výstup vráť STRIKTNE ako jeden platný JSON objekt (žiadny iný text okolo, žiadne markdown značky ako " + bTick3 + "json). JSON musí presne zodpovedať tejto schéme:\n{\n  \"recognizedIngredients\": [\"zoznam rozpoznaných surovín (napr. vajcia, mrkva, syr)\"] ,\n  \"recipes\": [\n    {\n      \"name\": \"Názov jedla (napr. Miešané vajíčka so syrom)\",\n      \"category\": \"kategória (jedna z hodnôt: polievka, hlavne, rychle, bezmasite, dvojdnove, lahke, vikendove)\",\n      \"servings\": 4,\n      \"prepTime\": 20,\n      \"difficulty\": \"náročnosť (jedna z hodnôt: lahke, stredne, narocne)\",\n      \"cookForTwoDays\": false,\n      \"canFreeze\": false,\n      \"ingredientsWeHave\": [\n        \"zoznam surovín ktoré máme k dispozícii odfotené, každá v presnom tvare: Názov, MnožstvoJednotka, kategória (napr: Vajcia, 4ks, mliecne alebo Syr Eidam, 100g, mliecne). Kategórie surovín vyber len z: zelenina, maso, mliecne, pecivo, trvanlive, mrazene, drogeria, ostatne\"\n      ],\n      \"ingredientsMissing\": [\n        \"zoznam surovín ktoré nám na dokončenie receptu chýbajú a bude ich treba dokúpiť, v rovnakom tvare: Názov, MnožstvoJednotka, kategória (napr: Pažítka, 1ks, zelenina). Ak nič nechýba, nechaj prázdne.\"\n      ],\n      \"instructions\": \"Stručný a jasný postup prípravy krok po kroku.\",\n      \"note\": \"Krátka poznámka alebo tip na servírovanie.\"\n    }\n  ]\n}"
                    },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    }
                ]
            }
        ]
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Chyba Gemini API. Skontrolujte platnosť vášho kľúča.");
        }
        return res.json();
    })
    .then(data => {
        const loader = document.getElementById("fridge-loading");
        if (loader) loader.classList.add("hidden");

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            let textResponse = data.candidates[0].content.parts[0].text.trim();
            
            // Clean markdown blocks
            const matchStart = new RegExp("^" + bTick3 + "json\\s*");
            const matchEnd = new RegExp("\\s*" + bTick3 + "$");
            const matchSimple = new RegExp("^" + bTick3 + "\\s*");
            
            if (matchStart.test(textResponse)) {
                textResponse = textResponse.replace(matchStart, "").replace(matchEnd, "");
            } else if (matchSimple.test(textResponse)) {
                textResponse = textResponse.replace(matchSimple, "").replace(matchEnd, "");
            }

            const result = JSON.parse(textResponse);
            renderFridgeAIResults(result);
        } else {
            throw new Error("Gemini neodpovedal v očakávanom formáte.");
        }
    })
    .catch(err => {
        const loader = document.getElementById("fridge-loading");
        if (loader) loader.classList.add("hidden");
        console.error("Fridge Scanner AI Error:", err);
        alert("Chyba AI analýzy: " + err.message + "\nUistite sa, že máte správny Gemini API kľúč a odfotili ste prehľadný záber.");
    });
}

function renderFridgeAIResults(result) {
    if (!result) return;
    tempFridgeSuggestions = result.recipes;

    // Show results block
    const resultsBlock = document.getElementById("fridge-results");
    if (resultsBlock) resultsBlock.classList.remove("hidden");

    // Render detected ingredients
    const ingredientsP = document.getElementById("fridge-detected-ingredients");
    if (ingredientsP) {
        ingredientsP.innerText = result.recognizedIngredients && result.recognizedIngredients.length > 0
            ? result.recognizedIngredients.join(", ")
            : "Žiadne potraviny sa nepodarilo jednoznačne rozoznať. Vyskúšajte lepšie svetlo.";
    }

    // Render recipes
    const recipesContainer = document.getElementById("fridge-suggested-recipes");
    if (recipesContainer) {
        let html = "";
        result.recipes.forEach((recipe, idx) => {
            const weHaveText = recipe.ingredientsWeHave.map(i => i.split(",")[0].trim()).join(", ");
            const missingText = recipe.ingredientsMissing && recipe.ingredientsMissing.length > 0
                ? recipe.ingredientsMissing.map(i => i.split(",")[0].trim()).join(", ")
                : "Všetko máme doma! 🎉";

            html += `
                <div class="meal-card card" style="display: flex; flex-direction: column; justify-content: space-between; border: 1px solid var(--border-color); padding: 15px; margin: 0; background-color: var(--bg-card);">
                    <div>
                        <h4 style="color: var(--primary-hover); margin-bottom: 6px; font-size: 15px; font-weight: 700;">${recipe.name}</h4>
                        <div class="meal-meta" style="font-size: 11px; margin-bottom: 10px; color: var(--text-muted); font-weight: 600;">
                            ⏱️ ${recipe.prepTime} min | ⚡ ${recipe.difficulty === 'lahke' ? 'Ľahká' : recipe.difficulty === 'stredne' ? 'Stredná' : 'Náročná'}
                        </div>
                        
                        <div style="font-size: 12px; margin-bottom: 8px; line-height: 1.4;">
                            <strong style="color: #27ae60;">✅ Máme doma:</strong>
                            <div style="color: #196f3d; font-style: italic;">${weHaveText}</div>
                        </div>
                        
                        <div style="font-size: 12px; margin-bottom: 12px; line-height: 1.4;">
                            <strong style="color: var(--danger);">❌ Treba dokúpiť:</strong>
                            <div style="color: #c0392b; font-style: italic;">${missingText}</div>
                        </div>
                        
                        <div style="font-size: 12px; margin-bottom: 10px;">
                            <strong>📝 Postup:</strong>
                            <p style="white-space: pre-wrap; font-size: 11px; line-height: 1.4; color: var(--text-color); max-height: 70px; overflow-y: auto; border: 1px solid var(--border-color); padding: 5px; border-radius: 4px; background-color: var(--primary-light); margin: 4px 0 0 0;">${recipe.instructions}</p>
                        </div>
                    </div>
                    
                    <button class="btn btn-secondary btn-sm" onclick="saveAIDiscoveredRecipe(${idx})" style="width: 100%; margin-top: 10px; font-size: 11px; padding: 6px;">
                        ➕ Pridať do našich jedál
                    </button>
                </div>
            `;
        });
        recipesContainer.innerHTML = html;
    }
}

function saveAIDiscoveredRecipe(idx) {
    if (!tempFridgeSuggestions || !tempFridgeSuggestions[idx]) return;
    const recipe = tempFridgeSuggestions[idx];

    // Combine weHave and missing ingredients into a single text block
    const allIngredientsList = [...recipe.ingredientsWeHave, ...(recipe.ingredientsMissing || [])];
    const ingredientsText = allIngredientsList.join("\n");

    const newMeal = {
        id: "m_" + Date.now(),
        name: recipe.name,
        category: recipe.category || "hlavne",
        servings: recipe.servings || 4,
        prepTime: recipe.prepTime || 45,
        difficulty: recipe.difficulty || "stredne",
        cookForTwoDays: recipe.cookForTwoDays || false,
        canFreeze: recipe.canFreeze || false,
        popularity: "stredne",
        likedBy: ["mama", "otec", "ivo", "majo"],
        ingredientsText: ingredientsText,
        instructions: recipe.instructions,
        note: recipe.note || ""
    };

    meals.push(newMeal);
    saveMealsToStorage();

    // Trigger rendering of meals if screen is active
    if (activeTab === "meals") renderMealsScreen();

    alert("Recept '" + newMeal.name + "' bol úspešne pridaný do Našich jedál!");
}
