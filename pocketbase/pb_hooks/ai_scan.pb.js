/// <reference path="../pb_data/types.d.ts" />

// AI proxy pre skener receptov a chladničky.
// Frontend sem posiela fotku ako base64 JSON (žiadny Gemini kľúč nikdy
// neopúšťa server). Endpoint vyžaduje platný token domácnosti a je
// obmedzený denným rate-limitom cez kolekciu ai_scan_logs.
//
// POZNÁMKA K PRENOSITEĽNOSTI: JSVM API PocketBase (routerAdd, e.bindBody,
// $http.send, chybové triedy) sa medzi minor verziami mierne mení. Kód nižšie
// zodpovedá dokumentácii pre PocketBase 0.23+ (https://pocketbase.io/docs/js-overview/).
// Ak po nasadení dostaneš pri skenovaní chybu 500, skontroluj PocketBase logy —
// s vysokou pravdepodobnosťou pôjde o drobný rozdiel v názve API pre danú verziu.

const RECIPE_PROMPT = "Si slovenský kulinársky asistent pre rodinu. Analyzuj tento obrázok (ktorý môže byť odfotenou stranou z kuchárskej knihy, rukou písaným receptom alebo priamo fotkou hotového uvareného jedla). Zisti názov a navrhni kompletné vyplnenie receptu v slovenskom jazyku. Výstup vráť STRIKTNE ako jeden platný JSON objekt (žiadny iný text okolo, žiadne markdown značky ako ```json). JSON musí presne zodpovedať tejto schéme:\n{\n  \"name\": \"Názov jedla (napr. Kurací perkelt)\",\n  \"category\": \"kategória (jedna z hodnôt: polievka, hlavne, rychle, bezmasite, dvojdnove, lahke, vikendove)\",\n  \"servings\": 4,\n  \"prepTime\": 45,\n  \"difficulty\": \"náročnosť (jedna z hodnôt: lahke, stredne, narocne)\",\n  \"cookForTwoDays\": true,\n  \"canFreeze\": false,\n  \"ingredientsText\": \"Zoznam surovín. Každá surovina musí byť na samostatnom riadku v presnom tvare: Názov, MnožstvoJednotka, kategória (napr: Zemiaky, 1kg, zelenina alebo Bravčové pliecko, 600g, maso). Kategórie surovín vyber len z: zelenina, maso, mliecne, pecivo, trvanlive, mrazene, drogeria, ostatne. Uisti sa, že za čiarkou je presné množstvo a kategória, napríklad: Cibuľa, 2ks, zelenina\",\n  \"instructions\": \"Stručný a jasný postup prípravy krok po kroku.\",\n  \"note\": \"Krátka poznámka alebo tip (napr. podávať s ryžou).\"\n}";

const FRIDGE_PROMPT = "Si slovenský kulinársky asistent pre rodinu. Analyzuj túto fotografiu (ktorá zobrazuje otvorenú chladničku, špajzu, potraviny na stole alebo nákup). Rozpoznaj potraviny a suroviny, ktoré sú k dispozícii. Na základe nich navrhni presne 3 slovenské recepty, ktoré je možné z nich pripraviť. Výstup vráť STRIKTNE ako jeden platný JSON objekt (žiadny iný text okolo, žiadne markdown značky ako ```json). JSON musí presne zodpovedať tejto schéme:\n{\n  \"recognizedIngredients\": [\"zoznam rozpoznaných surovín (napr. vajcia, mrkva, syr)\"] ,\n  \"recipes\": [\n    {\n      \"name\": \"Názov jedla (napr. Miešané vajíčka so syrom)\",\n      \"category\": \"kategória (jedna z hodnôt: polievka, hlavne, rychle, bezmasite, dvojdnove, lahke, vikendove)\",\n      \"servings\": 4,\n      \"prepTime\": 20,\n      \"difficulty\": \"náročnosť (jedna z hodnôt: lahke, stredne, narocne)\",\n      \"cookForTwoDays\": false,\n      \"canFreeze\": false,\n      \"ingredientsWeHave\": [\n        \"zoznam surovín ktoré máme k dispozícii odfotené, každá v presnom tvare: Názov, MnožstvoJednotka, kategória (napr: Vajcia, 4ks, mliecne alebo Syr Eidam, 100g, mliecne). Kategórie surovín vyber len z: zelenina, maso, mliecne, pecivo, trvanlive, mrazene, drogeria, ostatne\"\n      ],\n      \"ingredientsMissing\": [\n        \"zoznam surovín ktoré nám na dokončenie receptu chýbajú a bude ich treba dokúpiť, v rovnakom tvare: Názov, MnožstvoJednotka, kategória (napr: Pažítka, 1ks, zelenina). Ak nič nechýba, nechaj prázdne.\"\n      ],\n      \"instructions\": \"Stručný a jasný postup prípravy krok po kroku.\",\n      \"note\": \"Krátka poznámka alebo tip na servírovanie.\"\n    }\n  ]\n}";

function stripMarkdownFence(text) {
    let cleaned = (text || "").trim();
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "");
    return cleaned.trim();
}

// Globálny denný strop naprieč VŠETKÝMI domácnosťami — chráni pred
// neplánovaným účtom pri raste počtu registrácií (napr. verejný launch).
// Kontroluje sa PRED per-household limitom, aby sa šetrili aj Gemini
// requesty pre domácnosti, ktoré by inak ešte mali vlastnú rezervu.
function enforceGlobalAiScanRateLimit(app, today) {
    const globalLimit = parseInt($os.getenv("AI_SCAN_GLOBAL_DAILY_LIMIT") || "200", 10);

    let globalRecord = null;
    try {
        globalRecord = app.findFirstRecordByFilter(
            "ai_usage_totals",
            "date = {:date}",
            { date: today }
        );
    } catch (err) {
        globalRecord = null;
    }

    if (!globalRecord) {
        const collection = app.findCollectionByNameOrId("ai_usage_totals");
        globalRecord = new Record(collection);
        globalRecord.set("date", today);
        globalRecord.set("count", 0);
    }

    const current = globalRecord.getInt("count");
    if (current >= globalLimit) {
        throw new ApiError(429, "AI skener dnes dosiahol celkový denný limit pre všetkých používateľov. Skúste to prosím zajtra.", null);
    }

    globalRecord.set("count", current + 1);
    app.save(globalRecord);
}

function enforceAiScanRateLimit(app, householdId) {
    const limit = parseInt($os.getenv("AI_SCAN_DAILY_LIMIT") || "5", 10);
    const today = new Date().toISOString().slice(0, 10);

    enforceGlobalAiScanRateLimit(app, today);

    let logRecord = null;
    try {
        logRecord = app.findFirstRecordByFilter(
            "ai_scan_logs",
            "household = {:household} && date = {:date}",
            { household: householdId, date: today }
        );
    } catch (err) {
        logRecord = null; // zatiaľ žiadny záznam pre dnešný deň
    }

    if (!logRecord) {
        const collection = app.findCollectionByNameOrId("ai_scan_logs");
        logRecord = new Record(collection);
        logRecord.set("household", householdId);
        logRecord.set("date", today);
        logRecord.set("count", 0);
    }

    const current = logRecord.getInt("count");
    if (current >= limit) {
        throw new ApiError(429, "Dosiahli ste denný limit " + limit + " AI skenov pre vašu domácnosť. Skúste to prosím zajtra.", null);
    }

    logRecord.set("count", current + 1);
    app.save(logRecord);
}

function callGemini(promptText, imageBase64, mimeType) {
    const geminiKey = $os.getenv("GEMINI_API_KEY");
    if (!geminiKey) {
        throw new ApiError(500, "AI skener nie je na serveri nakonfigurovaný (chýba GEMINI_API_KEY).", null);
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiKey;
    const requestBody = {
        contents: [{
            parts: [
                { text: promptText },
                { inlineData: { mimeType: mimeType, data: imageBase64 } }
            ]
        }]
    };

    const res = $http.send({
        url: url,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    });

    if (res.statusCode >= 400) {
        throw new ApiError(502, "Chyba pri komunikácii s Gemini AI (status " + res.statusCode + ").", null);
    }

    const rawBody = typeof res.raw !== "undefined" ? res.raw : res.body;
    let payload;
    try {
        payload = JSON.parse(rawBody);
    } catch (err) {
        throw new ApiError(502, "Gemini vrátil neplatnú odpoveď.", null);
    }

    const textResponse = payload && payload.candidates && payload.candidates[0]
        && payload.candidates[0].content && payload.candidates[0].content.parts
        && payload.candidates[0].content.parts[0]
        ? payload.candidates[0].content.parts[0].text
        : "";

    const cleaned = stripMarkdownFence(textResponse);
    try {
        return JSON.parse(cleaned);
    } catch (err) {
        throw new ApiError(502, "AI vrátila neočakávaný formát odpovede.", null);
    }
}

function handleAiScan(e, promptText) {
    console.log("handleAiScan: entered");
    try {
        console.log("handleAiScan: inside try, before e.auth");
        const authRecord = e.auth;
        console.log("handleAiScan: after e.auth, authRecord=" + authRecord);
        if (!authRecord || authRecord.collection().name !== "households") {
            throw new UnauthorizedError("Musíte byť prihlásený ako domácnosť.", null);
        }
        console.log("handleAiScan: auth check passed");

        const data = new DynamicModel({
            imageBase64: "",
            mimeType: ""
        });
        e.bindBody(data);
        console.log("handleAiScan: bindBody done, hasImage=" + !!data.imageBase64 + " mimeType=" + data.mimeType);

        if (!data.imageBase64 || !data.mimeType) {
            throw new BadRequestError("Chýba fotografia (imageBase64/mimeType).", null);
        }

        enforceAiScanRateLimit(e.app, authRecord.id);
        console.log("handleAiScan: rate limit passed, calling Gemini");

        const result = callGemini(promptText, data.imageBase64, data.mimeType);
        console.log("handleAiScan: Gemini call succeeded");
        return e.json(200, result);
    } catch (err) {
        // ApiError (a jej podtriedy ako UnauthorizedError/BadRequestError) sú
        // zámerné, štruktúrované odpovede - tie len prehoď ďalej nezmenené.
        // Čokoľvek iné je neočakávaná chyba v hooku - zaloguj presný text,
        // nech sa dá diagnostikovať cez PocketBase logy namiesto tichého 400.
        if (err && err.status) {
            throw err;
        }
        console.log("handleAiScan failed: " + err);
        throw new ApiError(500, "Neočakávaná chyba AI skenera: " + err, null);
    }
}

// DOČASNÁ diagnostická cesta bez akejkoľvek logiky - overuje, či routerAdd
// v tejto verzii PocketBase vôbec funguje.
routerAdd("GET", "/api/ai/ping", (e) => {
    return e.json(200, { ping: "pong" });
});

routerAdd("POST", "/api/ai/scan-recipe", (e) => {
    return handleAiScan(e, RECIPE_PROMPT);
});

routerAdd("POST", "/api/ai/scan-fridge", (e) => {
    return handleAiScan(e, FRIDGE_PROMPT);
});
