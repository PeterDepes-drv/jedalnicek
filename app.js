// Kategórie nákupného zoznamu (slovenské preklady).
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

// PocketBase klient — adresa backendu je v config.js (PB_URL).
const pb = new PocketBase(PB_URL);
// Appka bežne posiela viacero paralelných requestov na tú istú kolekciu
// (napr. hromadné vytváranie položiek nákupného zoznamu cez Promise.all) —
// SDK by ich defaultne navzájom rušilo ("auto-cancellation"), čo tu nechceme.
pb.autoCancellation(false);

// State Variables
let meals = [];
let currentPlan = null;
let currentPlanRecordId = null;
let pantry = [];
let shoppingList = [];
let activeTab = 'today';
let tempFridgeSuggestions = [];
let memberNames = {
    role1: "Mama",
    role2: "Otec",
    role3: "Člen 1",
    role4: "Člen 2"
};
let memberRecordIds = {
    role1: null,
    role2: null,
    role3: null,
    role4: null
};
let suggestionRecordIds = {
    role3: null,
    role4: null
};
let familyState = {
    activeRole: "role2",
    suggestions: {
        role3: [],
        role4: []
    },
    ratedMealsThisWeek: {
        role3: [],
        role4: []
    }
};

function roleIcon(roleKey) {
    if (roleKey === 'role1') return '👩';
    if (roleKey === 'role2') return '👨';
    if (roleKey === 'role3' || roleKey === 'role4') return '👦';
    return '';
}

// ----------------------------------------------------
// REPOSITORY HELPERS
// Jediná vrstva, ktorá komunikuje s PocketBase. Mapuje medzi camelCase
// tvarom používaným v zvyšku appky a snake_case poľami v PB kolekciách,
// aby zvyšný kód (render funkcie, generatePlan, parseIngredients...)
// nemusel vedieť nič o tvare backendu.
// ----------------------------------------------------
function mealFromRecord(r) {
    return {
        id: r.id,
        name: r.name,
        category: r.category,
        servings: r.servings,
        prepTime: r.prep_time,
        difficulty: r.difficulty,
        cookForTwoDays: r.cook_for_two_days,
        canFreeze: r.can_freeze,
        popularity: r.popularity,
        likedBy: r.liked_by || [],
        ingredientsText: r.ingredients_text,
        instructions: r.instructions,
        note: r.note,
        rating: r.rating
    };
}

function mealPatchToPayload(m) {
    const payload = {};
    if ('name' in m) payload.name = m.name;
    if ('category' in m) payload.category = m.category;
    if ('servings' in m) payload.servings = m.servings;
    if ('prepTime' in m) payload.prep_time = m.prepTime;
    if ('difficulty' in m) payload.difficulty = m.difficulty;
    if ('cookForTwoDays' in m) payload.cook_for_two_days = m.cookForTwoDays;
    if ('canFreeze' in m) payload.can_freeze = m.canFreeze;
    if ('popularity' in m) payload.popularity = m.popularity;
    if ('likedBy' in m) payload.liked_by = m.likedBy;
    if ('ingredientsText' in m) payload.ingredients_text = m.ingredientsText;
    if ('instructions' in m) payload.instructions = m.instructions;
    if ('note' in m) payload.note = m.note;
    if ('rating' in m) payload.rating = m.rating;
    return payload;
}

const mealsRepo = {
    async list() {
        const records = await pb.collection('meals').getFullList();
        return records.map(mealFromRecord);
    },
    async create(meal) {
        const payload = mealPatchToPayload(meal);
        payload.household = pb.authStore.record.id;
        const record = await pb.collection('meals').create(payload);
        return mealFromRecord(record);
    },
    async update(id, patch) {
        return pb.collection('meals').update(id, mealPatchToPayload(patch));
    },
    async remove(id) {
        return pb.collection('meals').delete(id);
    }
};

function pantryFromRecord(r) {
    return { id: r.id, name: r.name, status: r.status };
}
const pantryRepo = {
    async list() {
        const records = await pb.collection('pantry_items').getFullList({ sort: 'name' });
        return records.map(pantryFromRecord);
    },
    async create(item) {
        const record = await pb.collection('pantry_items').create({
            household: pb.authStore.record.id,
            name: item.name,
            status: item.status
        });
        return pantryFromRecord(record);
    },
    async update(id, patch) {
        return pb.collection('pantry_items').update(id, patch);
    },
    async remove(id) {
        return pb.collection('pantry_items').delete(id);
    }
};

const planRepo = {
    async loadOrCreate() {
        try {
            const record = await pb.collection('weekly_plans').getFirstListItem(
                pb.filter('household = {:household}', { household: pb.authStore.record.id })
            );
            currentPlanRecordId = record.id;
            return {
                duration: record.duration || 7,
                startDate: record.start_date ? record.start_date.slice(0, 10) : new Date().toISOString().split('T')[0],
                days: record.days || []
            };
        } catch (err) {
            return null;
        }
    },
    async upsert(plan) {
        const payload = { duration: plan.duration, start_date: plan.startDate, days: plan.days };
        if (currentPlanRecordId) {
            await pb.collection('weekly_plans').update(currentPlanRecordId, payload);
        } else {
            payload.household = pb.authStore.record.id;
            const record = await pb.collection('weekly_plans').create(payload);
            currentPlanRecordId = record.id;
        }
    }
};

function savePlanToStorage() {
    planRepo.upsert(currentPlan);
}

function shoppingFromRecord(r) {
    return {
        id: r.id,
        name: r.name,
        quantity: r.quantity ? r.quantity : null,
        unit: r.unit,
        category: r.category,
        checked: r.checked,
        manual: r.manual
    };
}
const shoppingRepo = {
    async list() {
        const records = await pb.collection('shopping_items').getFullList();
        return records.map(shoppingFromRecord);
    },
    async create(item) {
        const record = await pb.collection('shopping_items').create({
            household: pb.authStore.record.id,
            name: item.name,
            quantity: item.quantity || 0,
            unit: item.unit,
            category: item.category,
            checked: !!item.checked,
            manual: !!item.manual
        });
        return shoppingFromRecord(record);
    },
    async update(id, patch) {
        const payload = {};
        if ('checked' in patch) payload.checked = patch.checked;
        if ('quantity' in patch) payload.quantity = patch.quantity || 0;
        if ('category' in patch) payload.category = patch.category;
        return pb.collection('shopping_items').update(id, payload);
    },
    async remove(id) {
        return pb.collection('shopping_items').delete(id);
    },
    async removeMany(ids) {
        await Promise.all(ids.map(id => this.remove(id)));
    },
    // Zosynchronizuje automaticky generované položky (manual=false) s novým
    // vypočítaným zoznamom z plánu: zmaže nepotrebné, dotvorí chýbajúce,
    // aktualizuje množstvo/kategóriu pri zhode. Ručne pridané položky sa
    // vôbec nedotýka (tie rieši volajúci samostatne).
    async syncAutoItems(desiredAutoItems, existingAutoItems) {
        const key = (i) => i.name.toLowerCase() + '__' + i.unit;

        const toDelete = existingAutoItems.filter(ex => !desiredAutoItems.some(d => key(d) === key(ex)));
        const toCreate = desiredAutoItems.filter(d => !existingAutoItems.some(ex => key(ex) === key(d)));
        const matchedPairs = desiredAutoItems
            .map(d => ({ desired: d, existing: existingAutoItems.find(ex => key(ex) === key(d)) }))
            .filter(pair => pair.existing);
        const toUpdate = matchedPairs.filter(pair =>
            pair.existing.quantity !== pair.desired.quantity || pair.existing.category !== pair.desired.category
        );

        await Promise.all(toDelete.map(i => this.remove(i.id)));
        await Promise.all(toUpdate.map(pair => this.update(pair.existing.id, {
            quantity: pair.desired.quantity,
            category: pair.desired.category
        })));
        const created = await Promise.all(toCreate.map(i => this.create(i)));

        const untouched = matchedPairs
            .filter(pair => !toUpdate.includes(pair))
            .map(pair => pair.existing);
        const updated = toUpdate.map(pair => ({ ...pair.existing, quantity: pair.desired.quantity, category: pair.desired.category }));

        return [...untouched, ...updated, ...created];
    }
};

const membersRepo = {
    async list() {
        return pb.collection('members').getFullList();
    },
    async update(id, patch) {
        return pb.collection('members').update(id, patch);
    }
};

function suggestionFromRecord(r) {
    return {
        id: r.id,
        memberRole: r.member_role,
        suggestions: r.meal_suggestions || [],
        ratedMealIds: r.rated_meal_ids || []
    };
}
const suggestionsRepo = {
    async list() {
        const records = await pb.collection('suggestions').getFullList();
        return records.map(suggestionFromRecord);
    },
    async upsert(memberRole, patch) {
        const payload = {};
        if ('suggestions' in patch) payload.meal_suggestions = patch.suggestions;
        if ('ratedMealIds' in patch) payload.rated_meal_ids = patch.ratedMealIds;

        const existingId = suggestionRecordIds[memberRole];
        if (existingId) {
            await pb.collection('suggestions').update(existingId, payload);
        } else {
            payload.household = pb.authStore.record.id;
            payload.member_role = memberRole;
            const record = await pb.collection('suggestions').create(payload);
            suggestionRecordIds[memberRole] = record.id;
        }
    }
};

// ----------------------------------------------------
// AUTH & BOOTSTRAP
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    if (pb.authStore.isValid) {
        hideAuthGate();
        boot();
    } else {
        showAuthGate();
    }
});

function showAuthGate() {
    document.getElementById("auth-gate").classList.remove("hidden");
    document.querySelector(".app-container").classList.add("hidden");
}

function hideAuthGate() {
    document.getElementById("auth-gate").classList.add("hidden");
    document.querySelector(".app-container").classList.remove("hidden");
}

function toggleAuthMode() {
    document.getElementById("login-form").classList.toggle("hidden");
    document.getElementById("register-form").classList.toggle("hidden");
    document.getElementById("auth-error").classList.add("hidden");
}

function showAuthError(message) {
    const box = document.getElementById("auth-error");
    if (!box) return;
    box.textContent = message;
    box.classList.remove("hidden");
}

async function submitLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    try {
        await pb.collection('households').authWithPassword(email, password);
        hideAuthGate();
        boot();
    } catch (err) {
        showAuthError("Prihlásenie zlyhalo. Skontrolujte e-mail a heslo.");
    }
}

async function submitRegister(event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;
    try {
        await pb.collection('households').create({
            name: name,
            email: email,
            password: password,
            passwordConfirm: password
        });
        await pb.collection('households').authWithPassword(email, password);
        hideAuthGate();
        boot();
    } catch (err) {
        showAuthError("Registrácia zlyhala. Skúste iný e-mail alebo silnejšie heslo (min. 8 znakov).");
    }
}

function logoutHousehold() {
    pb.authStore.clear();
    window.location.reload();
}

// Hlavné načítanie dát z PocketBase a vykreslenie appky po prihlásení.
async function boot() {
    updateConnectionStatusUI(true);

    const [mealRecords, pantryRecords, planData, shoppingRecords, memberRecords, suggestionRecords] = await Promise.all([
        mealsRepo.list(),
        pantryRepo.list(),
        planRepo.loadOrCreate(),
        shoppingRepo.list(),
        membersRepo.list(),
        suggestionsRepo.list()
    ]);

    meals = mealRecords;
    pantry = pantryRecords;
    currentPlan = planData || { duration: 7, startDate: new Date().toISOString().split('T')[0], days: [] };
    shoppingList = shoppingRecords;

    memberRecords.forEach(r => {
        memberNames[r.role_key] = r.name;
        memberRecordIds[r.role_key] = r.id;
    });

    suggestionRecords.forEach(s => {
        suggestionRecordIds[s.memberRole] = s.id;
        familyState.suggestions[s.memberRole] = s.suggestions;
        familyState.ratedMealsThisWeek[s.memberRole] = s.ratedMealIds;
    });

    // activeRole ostáva nastavenie per zariadenie (nesynchronizuje sa cez PocketBase).
    const savedRole = localStorage.getItem("family_active_role");
    if (savedRole) familyState.activeRole = savedRole;

    if (!currentPlan.days || currentPlan.days.length === 0) {
        generatePlan(7, true);
    }

    renderTodayScreen();
    renderPlanScreen();
    renderShoppingList();
    renderMealsScreen();
    renderPantryScreen();
    renderSuggestionsScreen();
    updateRoleSelectOptions();
    updateRoleUI();
    updateDateDisplay();
    updateShoppingBadge();

    subscribeRealtime();
}

// ----------------------------------------------------
// REALTIME — naživo prejaví zmeny ostatných členov domácnosti.
// ----------------------------------------------------
function subscribeRealtime() {
    pb.collection('meals').subscribe('*', (e) => {
        if (e.action === 'create') {
            if (!meals.some(m => m.id === e.record.id)) meals.push(mealFromRecord(e.record));
        } else if (e.action === 'update') {
            const idx = meals.findIndex(m => m.id === e.record.id);
            if (idx >= 0) meals[idx] = mealFromRecord(e.record); else meals.push(mealFromRecord(e.record));
        } else if (e.action === 'delete') {
            meals = meals.filter(m => m.id !== e.record.id);
        }
        if (activeTab === 'meals') renderMealsScreen();
        if (activeTab === 'today') renderTodayScreen();
        if (activeTab === 'plan') renderPlanScreen();
    });

    pb.collection('pantry_items').subscribe('*', (e) => {
        if (e.action === 'create') {
            if (!pantry.some(p => p.id === e.record.id)) pantry.push(pantryFromRecord(e.record));
        } else if (e.action === 'update') {
            const idx = pantry.findIndex(p => p.id === e.record.id);
            if (idx >= 0) pantry[idx] = pantryFromRecord(e.record);
        } else if (e.action === 'delete') {
            pantry = pantry.filter(p => p.id !== e.record.id);
        }
        if (activeTab === 'pantry') renderPantryScreen();
        if (activeTab === 'shopping') renderShoppingList();
        if (activeTab === 'suggestions') updateSynPantryProgress();
    });

    pb.collection('weekly_plans').subscribe('*', (e) => {
        currentPlanRecordId = e.record.id;
        currentPlan = {
            duration: e.record.duration || 7,
            startDate: (e.record.start_date || "").slice(0, 10) || new Date().toISOString().split('T')[0],
            days: e.record.days || []
        };
        if (activeTab === 'plan') renderPlanScreen();
        if (activeTab === 'today') renderTodayScreen();
    });

    pb.collection('shopping_items').subscribe('*', (e) => {
        if (e.action === 'create') {
            if (!shoppingList.some(i => i.id === e.record.id)) shoppingList.push(shoppingFromRecord(e.record));
        } else if (e.action === 'update') {
            const idx = shoppingList.findIndex(i => i.id === e.record.id);
            if (idx >= 0) shoppingList[idx] = shoppingFromRecord(e.record);
        } else if (e.action === 'delete') {
            shoppingList = shoppingList.filter(i => i.id !== e.record.id);
        }
        updateShoppingBadge();
        if (activeTab === 'shopping') renderShoppingList();
    });

    pb.collection('members').subscribe('*', (e) => {
        memberNames[e.record.role_key] = e.record.name;
        memberRecordIds[e.record.role_key] = e.record.id;
        updateRoleSelectOptions();
        updateRoleUI();
        if (activeTab === 'suggestions') renderSuggestionsScreen();
        if (activeTab === 'meals') renderMealsScreen();
        if (activeTab === 'plan') renderPlanScreen();
        if (activeTab === 'today') renderTodayScreen();
    });

    pb.collection('suggestions').subscribe('*', (e) => {
        const s = suggestionFromRecord(e.record);
        suggestionRecordIds[s.memberRole] = s.id;
        familyState.suggestions[s.memberRole] = s.suggestions;
        familyState.ratedMealsThisWeek[s.memberRole] = s.ratedMealIds;
        if (activeTab === 'suggestions') renderSuggestionsScreen();
        if (activeTab === 'plan') renderPlanScreen();
    });
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

// Role Switching Handler (activeRole je nastavenie per zariadenie, nesynchronizuje sa)
function changeRole(role) {
    familyState.activeRole = role;
    localStorage.setItem("family_active_role", role);
    updateRoleUI();

    // If role is helper (role3/role4), automatically jump to suggestions
    if (role === "role3" || role === "role4") {
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
    const name = memberNames[familyState.activeRole] || "";
    switch (familyState.activeRole) {
        case "role1":
            tipText = "👩 <strong>Ahoj, " + name + "!</strong> Máš právo spravovať jedálniček, generovať nový plán, vymieňať jedlá a hodnotiť ich po dovarení.";
            document.body.classList.remove("role-dad-view", "role-son-view");
            document.body.classList.add("role-mom-view");
            break;
        case "role2":
            tipText = "👨 <strong>Ahoj, " + name + "!</strong> Môžeš upravovať databázu jedál, spravovať nákupný zoznam a vymazávať zakúpené položky.";
            document.body.classList.remove("role-mom-view", "role-son-view");
            document.body.classList.add("role-dad-view");
            break;
        case "role3":
        case "role4":
            tipText = "👦 <strong>Ahoj, " + name + "!</strong> Môžeš navrhnúť 3 jedlá na tento týždeň, skontrolovať špajzu a ohodnotiť spoločné jedlá.";
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

// Naplní dropdown rolí v hlavičke, filter "Kto má rád" a labely pri
// checkboxoch v editore jedla — všetko podľa aktuálnych mien členov.
function updateRoleSelectOptions() {
    const select = document.getElementById("role-select");
    if (select) {
        select.innerHTML = "";
        ["role1", "role2", "role3", "role4"].forEach(roleKey => {
            const opt = document.createElement("option");
            opt.value = roleKey;
            opt.textContent = roleIcon(roleKey) + " " + memberNames[roleKey];
            select.appendChild(opt);
        });
        select.value = familyState.activeRole;
    }

    const filterSelect = document.getElementById("meal-filter-liked");
    if (filterSelect) {
        const current = filterSelect.value;
        filterSelect.innerHTML = '<option value="all">Kto má rád: Všetci</option>';
        ["role1", "role2", "role3", "role4"].forEach(roleKey => {
            const opt = document.createElement("option");
            opt.value = roleKey;
            opt.textContent = roleIcon(roleKey) + " " + memberNames[roleKey];
            filterSelect.appendChild(opt);
        });
        if ([...filterSelect.options].some(o => o.value === current)) filterSelect.value = current;
    }

    ["role1", "role2", "role3", "role4"].forEach(roleKey => {
        const label = document.getElementById("label-like-" + roleKey);
        if (label) label.textContent = roleIcon(roleKey) + " " + memberNames[roleKey];
    });
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
    const likesMarkup = meal.likedBy.map(roleIcon).join(' ');

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
        mealsRepo.update(mealId, { rating: ratingValue });
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

// Banner s prianiami pomocníkov (role3/role4) nad týždenným plánom.
function updatePlanSuggestionsBanner() {
    const banner = document.getElementById("plan-suggestions-banner");
    const textEl = document.getElementById("plan-suggestions-text");
    if (!banner || !textEl) return;

    const parts = [];
    if (familyState.suggestions.role3 && familyState.suggestions.role3.filter(Boolean).length > 0) {
        parts.push(memberNames.role3 + ": " + familyState.suggestions.role3.filter(Boolean).join(", "));
    }
    if (familyState.suggestions.role4 && familyState.suggestions.role4.filter(Boolean).length > 0) {
        parts.push(memberNames.role4 + ": " + familyState.suggestions.role4.filter(Boolean).join(", "));
    }

    if (parts.length > 0) {
        textEl.textContent = parts.join(" | ");
        banner.classList.remove("hidden");
    } else {
        banner.classList.add("hidden");
    }
}

function renderPlanScreen() {
    const timeline = document.getElementById("plan-timeline");
    if (!timeline) return;

    timeline.innerHTML = "";

    // Update active suggestions banner
    updatePlanSuggestionsBanner();

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

    // ----------------------------------------------------
    // ADD SUGGESTIONS FROM HELPERS (role3/role4) TO SWAP LIST
    // ----------------------------------------------------
    const role3Sug = (familyState.suggestions && familyState.suggestions.role3) ? familyState.suggestions.role3.filter(Boolean) : [];
    const role4Sug = (familyState.suggestions && familyState.suggestions.role4) ? familyState.suggestions.role4.filter(Boolean) : [];

    const allSuggestions = [];
    role3Sug.forEach((sug, idx) => {
        if (sug.toLowerCase().includes(searchVal)) {
            allSuggestions.push({ name: sug, son: memberNames.role3, originalIndex: idx, role: "role3" });
        }
    });
    role4Sug.forEach((sug, idx) => {
        if (sug.toLowerCase().includes(searchVal)) {
            allSuggestions.push({ name: sug, son: memberNames.role4, originalIndex: idx, role: "role4" });
        }
    });

    if (allSuggestions.length > 0) {
        const headerDiv = document.createElement("div");
        headerDiv.style.padding = "8px 12px";
        headerDiv.style.fontWeight = "bold";
        headerDiv.style.fontSize = "12px";
        headerDiv.style.color = "#b7950b";
        headerDiv.style.borderLeft = "4px solid var(--accent)";
        headerDiv.style.backgroundColor = "var(--accent-light)";
        headerDiv.style.marginBottom = "5px";
        headerDiv.style.borderRadius = "var(--border-radius-xs)";
        headerDiv.innerHTML = "💡 ŽELANIA OD CHALANOV (KLIKNITE PRE NAPLÁNOVANIE):";
        container.appendChild(headerDiv);

        allSuggestions.forEach(sug => {
            const matchedMeal = meals.find(m => m.name.toLowerCase().trim() === sug.name.toLowerCase().trim());
            const sugDiv = document.createElement("div");
            sugDiv.className = "swap-meal-item";
            sugDiv.style.borderLeft = "4px solid var(--accent)";
            sugDiv.style.backgroundColor = "rgba(241, 196, 15, 0.08)";

            if (matchedMeal) {
                sugDiv.onclick = () => selectSwapMeal(matchedMeal.id);
                sugDiv.innerHTML = `
                    <span class="swap-meal-item-name">🥞 ${sug.name} (chce ${sug.son})</span>
                    <span class="swap-meal-item-cat">${matchedMeal.category.toUpperCase()} | ⏱️ ${matchedMeal.prepTime} min</span>
                `;
            } else {
                sugDiv.onclick = () => {
                    closeSwapMealModal();
                    addSuggestedMealToDatabase(sug.name, sug.role, sug.originalIndex);
                };
                sugDiv.innerHTML = `
                    <span class="swap-meal-item-name">➕ Pridať & Naplánovať: ${sug.name} (chce ${sug.son})</span>
                    <span class="swap-meal-item-cat">Kliknutím vytvoríte recept a hneď ho naplánujete</span>
                `;
            }
            container.appendChild(sugDiv);
        });

        // Add a spacing or small border
        const dividerDiv = document.createElement("div");
        dividerDiv.style.margin = "10px 0";
        dividerDiv.style.borderBottom = "1.5px dashed var(--border-color)";
        container.appendChild(dividerDiv);
    }

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
async function regenerateShoppingListFromPlan() {
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

    // 4. Add manual entries (zachovávajú si svoje PocketBase id)
    manualEntries.forEach(item => {
        const existing = list.find(l => l.name.toLowerCase() === item.name.toLowerCase() && l.unit === item.unit);
        if (!existing) {
            list.push(item);
        }
    });

    // 5. Zosynchronizuj automaticky generované položky s PocketBase (manuálne sa nedotýka)
    const autoList = list.filter(i => !i.manual);
    const manualList = list.filter(i => i.manual);
    const existingAuto = shoppingList.filter(i => !i.manual);
    const newAutoItems = await shoppingRepo.syncAutoItems(autoList, existingAuto);

    shoppingList = [...newAutoItems, ...manualList];

    updateShoppingBadge();
    if (activeTab === 'shopping') renderShoppingList();
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
        shoppingRepo.update(item.id, { checked: item.checked });
        updateShoppingBadge();
        renderShoppingList();
    }
}

function deleteShoppingItem(name, unit) {
    const item = shoppingList.find(i => i.name === name && i.unit === unit);
    shoppingList = shoppingList.filter(i => !(i.name === name && i.unit === unit));
    if (item) shoppingRepo.remove(item.id);
    updateShoppingBadge();
    renderShoppingList();
}

async function addManualShoppingItem(event) {
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
            shoppingRepo.update(existing.id, { quantity: existing.quantity });
        }
    } else {
        const created = await shoppingRepo.create({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            quantity: qty,
            unit: unit,
            category: category,
            checked: false,
            manual: true
        });
        shoppingList.unshift(created);
    }

    updateShoppingBadge();
    renderShoppingList();

    // Reset inputs
    nameInput.value = "";
    qtyInput.value = "";
    nameInput.focus();
}

function clearCheckedShoppingItems() {
    const checkedIds = shoppingList.filter(item => item.checked).map(item => item.id);
    shoppingList = shoppingList.filter(item => !item.checked);
    shoppingRepo.removeMany(checkedIds);
    updateShoppingBadge();
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

        const likesIcons = meal.likedBy.map(role => `<span class="like-icon-badge" title="${memberNames[role] || ''}">${roleIcon(role)}</span>`).join(' ');

        let catLabel = meal.category.toUpperCase();
        if (meal.category === 'polievka') catLabel = "🍜 Polievka";
        if (meal.category === 'hlavne') catLabel = "🥩 Hlavné";
        if (meal.category === 'rychle') catLabel = "⚡ Rýchle";
        if (meal.category === 'bezmasite') catLabel = "🥦 Bezmäsité";
        if (meal.category === 'dvojdnove') catLabel = "📅 Na 2 dni";
        if (meal.category === 'lahke') catLabel = "🥗 Ľahké";
        if (meal.category === 'vikendove') catLabel = "✨ Víkend";

        // Admin actions visible for parents
        const isAdmin = true;
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

async function deleteMealPrompt(mealId) {
    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        if (confirm(`Chcete naozaj vymazať recept "${meal.name}" zo svojej databázy?`)) {
            meals = meals.filter(m => m.id !== mealId);
            await mealsRepo.remove(mealId);
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
    document.getElementById("like-role1").checked = meal.likedBy.includes("role1");
    document.getElementById("like-role2").checked = meal.likedBy.includes("role2");
    document.getElementById("like-role3").checked = meal.likedBy.includes("role3");
    document.getElementById("like-role4").checked = meal.likedBy.includes("role4");

    document.getElementById("edit-meal-ingredients").value = meal.ingredientsText || "";
    document.getElementById("edit-meal-instructions").value = meal.instructions || "";
    document.getElementById("edit-meal-note").value = meal.note || "";

    modal.classList.add("active");
}

function closeMealFormModal() {
    const modal = document.getElementById("meal-form-modal");
    if (modal) modal.classList.remove("active");
}

async function saveMealForm(event) {
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
    if (document.getElementById("like-role1").checked) likedBy.push("role1");
    if (document.getElementById("like-role2").checked) likedBy.push("role2");
    if (document.getElementById("like-role3").checked) likedBy.push("role3");
    if (document.getElementById("like-role4").checked) likedBy.push("role4");

    const ingredientsText = document.getElementById("edit-meal-ingredients").value.trim();
    const instructions = document.getElementById("edit-meal-instructions").value.trim();
    const note = document.getElementById("edit-meal-note").value.trim();

    const mealData = { name, category, servings, prepTime, difficulty, cookForTwoDays, canFreeze, popularity, likedBy, ingredientsText, instructions, note };

    if (id) {
        // Edit existing
        const meal = meals.find(m => m.id === id);
        if (meal) {
            Object.assign(meal, mealData);
            await mealsRepo.update(id, mealData);
        }
    } else {
        // Create new
        mealData.rating = "bolo-v-poriadku";
        const created = await mealsRepo.create(mealData);
        meals.push(created);
    }

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
    const isAdmin = true;
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
        const item = pantry.find(p => p.name.toLowerCase() === name.toLowerCase());
        pantry = pantry.filter(p => p.name.toLowerCase() !== name.toLowerCase());
        if (item) pantryRepo.remove(item.id);
        renderPantryScreen();
        updateSynPantryProgress();
    }
}

async function addNewPantryItem() {
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

    const created = await pantryRepo.create({ name: name, status: "mame" });
    pantry.push(created);

    input.value = "";
    renderPantryScreen();
    updateSynPantryProgress();
}

function togglePantryItemStatus(name, newStatus) {
    const item = pantry.find(p => p.name.toLowerCase() === name.toLowerCase());
    if (item) {
        item.status = newStatus;
        pantryRepo.update(item.id, { status: newStatus });
        renderPantryScreen();

        // Auto update shopping list on pantry changes
        regenerateShoppingListFromPlan();

        // Increment Syn progress checklist if he is doing the task
        if (familyState.activeRole === "role3" || familyState.activeRole === "role4") {
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
    const activeSon = (familyState.activeRole === "role3" || familyState.activeRole === "role4") ? familyState.activeRole : null;

    // Load suggestions of BOTH helpers (role3/role4) for parents
    if (familyState.suggestions.role3 && familyState.suggestions.role3.length > 0) {
        familyState.suggestions.role3.forEach((sug, index) => {
            if (!sug) return;
            const li = document.createElement("li");
            li.innerHTML = `
                <span>👦 ${memberNames.role3}: ${sug}</span>
                <button class="btn-add-to-plan" onclick="addSuggestedMealToDatabase('${sug}', 'role3', ${index})">➕ Pridať do databázy</button>
            `;
            pSuggestions.appendChild(li);
        });
    }
    if (familyState.suggestions.role4 && familyState.suggestions.role4.length > 0) {
        familyState.suggestions.role4.forEach((sug, index) => {
            if (!sug) return;
            const li = document.createElement("li");
            li.innerHTML = `
                <span>👦 ${memberNames.role4}: ${sug}</span>
                <button class="btn-add-to-plan" onclick="addSuggestedMealToDatabase('${sug}', 'role4', ${index})">➕ Pridať do databázy</button>
            `;
            pSuggestions.appendChild(li);
        });
    }

    if (pSuggestions.innerHTML === "") {
        pSuggestions.innerHTML = `<li style="background: none; padding: 0; color: var(--text-muted);">Žiadne aktívne návrhy jedál od rodiny.</li>`;
    }

    // Set UI elements based on active role (helper vs parents)
    const badgeLabel = document.getElementById("son-badge-label");
    const titleLabel = document.getElementById("son-title-label");
    const suggestTitle = document.getElementById("son-suggest-title");

    if (activeSon) {
        const nameCap = memberNames[activeSon];
        if (badgeLabel) badgeLabel.innerText = "👦 Úlohy pre " + nameCap;
        if (titleLabel) titleLabel.innerText = "🎯 Tvoje návrhy a pomoc špajzi";
        if (suggestTitle) suggestTitle.innerText = "Navrhni 3 jedlá na tento týždeň, na ktoré máš chuť";
    } else {
        if (badgeLabel) badgeLabel.innerText = "👦 " + memberNames.role3 + " & " + memberNames.role4;
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
    const activeSon = (familyState.activeRole === "role3" || familyState.activeRole === "role4") ? familyState.activeRole : null;
    if (!activeSon) return;

    const sug1 = document.getElementById("son-suggest-1").value.trim();
    const sug2 = document.getElementById("son-suggest-2").value.trim();
    const sug3 = document.getElementById("son-suggest-3").value.trim();

    if (!sug1 || !sug2 || !sug3) {
        alert("Prosím, napíš všetky 3 jedlá.");
        return;
    }

    familyState.suggestions[activeSon] = [sug1, sug2, sug3];
    suggestionsRepo.upsert(activeSon, { suggestions: familyState.suggestions[activeSon] });
    renderSuggestionsScreen();
    alert("Super! Tvoje návrhy boli uložené a rodičia ich uvidia.");
}

function editSonSuggestions() {
    const activeSon = (familyState.activeRole === "role3" || familyState.activeRole === "role4") ? familyState.activeRole : null;
    if (!activeSon) return;

    familyState.suggestions[activeSon] = [];
    suggestionsRepo.upsert(activeSon, { suggestions: [] });
    renderSuggestionsScreen();
}

function addSuggestedMealToDatabase(mealName, sourceSon, suggestionIndex) {
    // Open Add Meal Modal with prefilled name
    openAddMealModal();
    document.getElementById("edit-meal-name").value = mealName;

    // Check correct checkbox
    if (sourceSon === 'role3') {
        document.getElementById("like-role3").checked = true;
    } else if (sourceSon === 'role4') {
        document.getElementById("like-role4").checked = true;
    }
}

function updateSynPantryProgress() {
    const progressText = document.getElementById("pantry-checked-count");
    const progressFill = document.getElementById("pantry-bar-fill");
    if (!progressText || !progressFill) return;

    // For simplicity, let's track how many items are updated in pantry
    // In actual usage, we can set checkedCount to the total if he clicks check off
    let count = pantry.length;
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

    const activeSon = (familyState.activeRole === "role3" || familyState.activeRole === "role4") ? familyState.activeRole : null;

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
    const activeSon = (familyState.activeRole === "role3" || familyState.activeRole === "role4") ? familyState.activeRole : null;
    if (!activeSon) return;

    const meal = meals.find(m => m.id === mealId);
    if (meal) {
        meal.rating = ratingVal;
        mealsRepo.update(mealId, { rating: ratingVal });
    }

    if (!familyState.ratedMealsThisWeek[activeSon].includes(mealId)) {
        familyState.ratedMealsThisWeek[activeSon].push(mealId);
        suggestionsRepo.upsert(activeSon, { ratedMealIds: familyState.ratedMealsThisWeek[activeSon] });
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
// NASTAVENIE DOMÁCNOSTI (mená členov, odhlásenie, stav pripojenia)
// ----------------------------------------------------
function updateConnectionStatusUI(online) {
    const indicator = document.getElementById("connection-status");
    if (!indicator) return;

    if (online) {
        indicator.className = "connection-status-indicator online";
        indicator.querySelector(".status-text").innerText = "Online";
        indicator.setAttribute("title", "Prihlásené. Kliknutím upravíte nastavenia domácnosti.");
    } else {
        indicator.className = "connection-status-indicator offline";
        indicator.querySelector(".status-text").innerText = "Odhlásené";
        indicator.setAttribute("title", "Nie ste prihlásený.");
    }
}

function openSettingsModal() {
    const modal = document.getElementById("settings-modal");
    const details = document.getElementById("settings-status-details");
    if (!modal || !details) return;

    const household = pb.authStore.record;
    details.style.backgroundColor = "#d4efdf";
    details.style.color = "#196f3d";
    details.innerHTML = "<strong>Prihlásená domácnosť: " + (household ? household.name : "") + "</strong><br>E-mail: " + (household ? household.email : "");

    document.getElementById("member-name-1").value = memberNames.role1 || "";
    document.getElementById("member-name-2").value = memberNames.role2 || "";
    document.getElementById("member-name-3").value = memberNames.role3 || "";
    document.getElementById("member-name-4").value = memberNames.role4 || "";

    modal.classList.add("active");
}

function closeSettingsModal() {
    const modal = document.getElementById("settings-modal");
    if (modal) modal.classList.remove("active");
}

async function saveMemberNames(event) {
    event.preventDefault();

    const updates = {
        role1: document.getElementById("member-name-1").value.trim() || "Mama",
        role2: document.getElementById("member-name-2").value.trim() || "Otec",
        role3: document.getElementById("member-name-3").value.trim() || "Člen 1",
        role4: document.getElementById("member-name-4").value.trim() || "Člen 2"
    };

    memberNames = updates;

    await Promise.all(Object.keys(updates).map(roleKey => {
        const id = memberRecordIds[roleKey];
        if (!id) return Promise.resolve();
        return membersRepo.update(id, { name: updates[roleKey] });
    }));

    updateRoleSelectOptions();
    updateRoleUI();
    renderMealsScreen();
    renderPlanScreen();
    renderSuggestionsScreen();
    closeSettingsModal();
    alert("Mená členov boli uložené.");
}

// ----------------------------------------------------
// GEMINI AI CAMERA RECIPE SCANNER (cez PocketBase AI proxy)
// ----------------------------------------------------

function triggerAICamera() {
    if (!pb.authStore.isValid) {
        alert("Musíte byť prihlásený, aby ste mohli použiť AI skener.");
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

async function analyzeImageWithGemini(base64Data, mimeType) {
    try {
        const res = await fetch(AI_SCAN_RECIPE_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + pb.authStore.token
            },
            body: JSON.stringify({ imageBase64: base64Data, mimeType: mimeType })
        });

        const loader = document.getElementById("ai-loading");
        if (loader) loader.classList.add("hidden");

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || "Chyba AI skenera.");
        }

        const recipe = await res.json();
        fillRecipeFormWithAIResult(recipe);
    } catch (err) {
        const loader = document.getElementById("ai-loading");
        if (loader) loader.classList.add("hidden");
        console.error("AI Error:", err);
        alert("Chyba AI analýzy: " + err.message);
    }
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
// GEMINI AI FRIDGE SCANNER (cez PocketBase AI proxy)
// ----------------------------------------------------

function triggerFridgeCamera() {
    if (!pb.authStore.isValid) {
        alert("Musíte byť prihlásený, aby ste mohli použiť AI skener.");
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

async function analyzeFridgeWithGemini(base64Data, mimeType) {
    try {
        const res = await fetch(AI_SCAN_FRIDGE_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + pb.authStore.token
            },
            body: JSON.stringify({ imageBase64: base64Data, mimeType: mimeType })
        });

        const loader = document.getElementById("fridge-loading");
        if (loader) loader.classList.add("hidden");

        if (!res.ok) {
            const errBody = await res.json().catch(() => ({}));
            throw new Error(errBody.message || "Chyba AI skenera.");
        }

        const result = await res.json();
        renderFridgeAIResults(result);
    } catch (err) {
        const loader = document.getElementById("fridge-loading");
        if (loader) loader.classList.add("hidden");
        console.error("Fridge Scanner AI Error:", err);
        alert("Chyba AI analýzy: " + err.message);
    }
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

async function saveAIDiscoveredRecipe(idx) {
    if (!tempFridgeSuggestions || !tempFridgeSuggestions[idx]) return;
    const recipe = tempFridgeSuggestions[idx];

    // Combine weHave and missing ingredients into a single text block
    const allIngredientsList = [...recipe.ingredientsWeHave, ...(recipe.ingredientsMissing || [])];
    const ingredientsText = allIngredientsList.join("\n");

    const newMeal = {
        name: recipe.name,
        category: recipe.category || "hlavne",
        servings: recipe.servings || 4,
        prepTime: recipe.prepTime || 45,
        difficulty: recipe.difficulty || "stredne",
        cookForTwoDays: recipe.cookForTwoDays || false,
        canFreeze: recipe.canFreeze || false,
        popularity: "bezne",
        likedBy: ["role1", "role2", "role3", "role4"],
        ingredientsText: ingredientsText,
        instructions: recipe.instructions,
        note: recipe.note || "",
        rating: "bolo-v-poriadku"
    };

    const created = await mealsRepo.create(newMeal);
    meals.push(created);

    // Trigger rendering of meals if screen is active
    if (activeTab === "meals") renderMealsScreen();

    alert("Recept '" + created.name + "' bol úspešne pridaný do Našich jedál!");
}
