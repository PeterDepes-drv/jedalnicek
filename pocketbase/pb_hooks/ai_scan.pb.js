/// <reference path="../pb_data/types.d.ts" />

// AI proxy pre skener receptov a chladničky.
// Frontend sem posiela fotku ako base64 JSON (žiadny Gemini kľúč nikdy
// neopúšťa server). Endpoint vyžaduje platný token domácnosti a je
// obmedzený denným rate-limitom (na domácnosť aj globálne naprieč
// všetkými domácnosťami).
//
// DÔLEŽITÉ (zistené empiricky, nie z dokumentácie): v tejto verzii
// PocketBase JSVM nie sú top-level "const" ani samostatne definované
// top-level funkcie spoľahlivo viditeľné vnútri routerAdd() callbackov —
// volanie/referencia zlyhá s tichou generickou chybou 400 bez akéhokoľvek
// záznamu v logoch. Preto je VŠETKA logika každého route handlera
// zámerne vložená priamo dovnútra jeho vlastnej funkcie, aj za cenu
// menšej duplicity medzi scan-recipe a scan-fridge.

routerAdd("POST", "/api/ai/scan-recipe", (e) => {
    try {
        const authRecord = e.auth;
        if (!authRecord || authRecord.collection().name !== "households") {
            throw new UnauthorizedError("Musíte byť prihlásený ako domácnosť.", null);
        }

        const data = new DynamicModel({ imageBase64: "", mimeType: "" });
        e.bindBody(data);
        if (!data.imageBase64 || !data.mimeType) {
            throw new BadRequestError("Chýba fotografia (imageBase64/mimeType).", null);
        }

        const today = new Date().toISOString().slice(0, 10);
        const globalLimit = parseInt($os.getenv("AI_SCAN_GLOBAL_DAILY_LIMIT") || "200", 10);
        let globalRecord = null;
        try {
            globalRecord = e.app.findFirstRecordByFilter("ai_usage_totals", "date = {:date}", { date: today });
        } catch (err) {
            globalRecord = null;
        }
        if (!globalRecord) {
            const globalCollection = e.app.findCollectionByNameOrId("ai_usage_totals");
            globalRecord = new Record(globalCollection);
            globalRecord.set("date", today);
            globalRecord.set("count", 0);
        }
        const globalCurrent = globalRecord.getInt("count");
        if (globalCurrent >= globalLimit) {
            throw new ApiError(429, "AI skener dnes dosiahol celkový denný limit pre všetkých používateľov. Skúste to prosím zajtra.", null);
        }
        globalRecord.set("count", globalCurrent + 1);
        e.app.save(globalRecord);

        const householdLimit = parseInt($os.getenv("AI_SCAN_DAILY_LIMIT") || "5", 10);
        let logRecord = null;
        try {
            logRecord = e.app.findFirstRecordByFilter(
                "ai_scan_logs",
                "household = {:household} && date = {:date}",
                { household: authRecord.id, date: today }
            );
        } catch (err) {
            logRecord = null;
        }
        if (!logRecord) {
            const logCollection = e.app.findCollectionByNameOrId("ai_scan_logs");
            logRecord = new Record(logCollection);
            logRecord.set("household", authRecord.id);
            logRecord.set("date", today);
            logRecord.set("count", 0);
        }
        const householdCurrent = logRecord.getInt("count");
        if (householdCurrent >= householdLimit) {
            throw new ApiError(429, "Dosiahli ste denný limit " + householdLimit + " AI skenov pre vašu domácnosť. Skúste to prosím zajtra.", null);
        }
        logRecord.set("count", householdCurrent + 1);
        e.app.save(logRecord);

        const geminiKey = $os.getenv("GEMINI_API_KEY");
        if (!geminiKey) {
            throw new ApiError(500, "AI skener nie je na serveri nakonfigurovaný (chýba GEMINI_API_KEY).", null);
        }

        const promptText = "Si slovenský kulinársky asistent pre rodinu. Analyzuj tento obrázok (ktorý môže byť odfotenou stranou z kuchárskej knihy, rukou písaným receptom alebo priamo fotkou hotového uvareného jedla). Zisti názov a navrhni kompletné vyplnenie receptu v slovenskom jazyku. Výstup vráť STRIKTNE ako jeden platný JSON objekt (žiadny iný text okolo, žiadne markdown značky ako ```json). JSON musí presne zodpovedať tejto schéme:\n{\n  \"name\": \"Názov jedla (napr. Kurací perkelt)\",\n  \"category\": \"kategória (jedna z hodnôt: polievka, hlavne, rychle, bezmasite, dvojdnove, lahke, vikendove)\",\n  \"servings\": 4,\n  \"prepTime\": 45,\n  \"difficulty\": \"náročnosť (jedna z hodnôt: lahke, stredne, narocne)\",\n  \"cookForTwoDays\": true,\n  \"canFreeze\": false,\n  \"ingredientsText\": \"Zoznam surovín. Každá surovina musí byť na samostatnom riadku v presnom tvare: Názov, MnožstvoJednotka, kategória (napr: Zemiaky, 1kg, zelenina alebo Bravčové pliecko, 600g, maso). Kategórie surovín vyber len z: zelenina, maso, mliecne, pecivo, trvanlive, mrazene, drogeria, ostatne. Uisti sa, že za čiarkou je presné množstvo a kategória, napríklad: Cibuľa, 2ks, zelenina\",\n  \"instructions\": \"Stručný a jasný postup prípravy krok po kroku.\",\n  \"note\": \"Krátka poznámka alebo tip (napr. podávať s ryžou).\"\n}";

        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiKey;
        const requestBody = {
            contents: [{
                parts: [
                    { text: promptText },
                    { inlineData: { mimeType: data.mimeType, data: data.imageBase64 } }
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

        let cleaned = (textResponse || "").trim();
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();

        let recipe;
        try {
            recipe = JSON.parse(cleaned);
        } catch (err) {
            throw new ApiError(502, "AI vrátila neočakávaný formát odpovede.", null);
        }

        return e.json(200, recipe);
    } catch (err) {
        if (err && err.status) {
            throw err;
        }
        console.log("scan-recipe failed: " + err);
        throw new ApiError(500, "Neočakávaná chyba AI skenera: " + err, null);
    }
});

routerAdd("POST", "/api/ai/scan-fridge", (e) => {
    try {
        const authRecord = e.auth;
        if (!authRecord || authRecord.collection().name !== "households") {
            throw new UnauthorizedError("Musíte byť prihlásený ako domácnosť.", null);
        }

        const data = new DynamicModel({ imageBase64: "", mimeType: "" });
        e.bindBody(data);
        if (!data.imageBase64 || !data.mimeType) {
            throw new BadRequestError("Chýba fotografia (imageBase64/mimeType).", null);
        }

        const today = new Date().toISOString().slice(0, 10);
        const globalLimit = parseInt($os.getenv("AI_SCAN_GLOBAL_DAILY_LIMIT") || "200", 10);
        let globalRecord = null;
        try {
            globalRecord = e.app.findFirstRecordByFilter("ai_usage_totals", "date = {:date}", { date: today });
        } catch (err) {
            globalRecord = null;
        }
        if (!globalRecord) {
            const globalCollection = e.app.findCollectionByNameOrId("ai_usage_totals");
            globalRecord = new Record(globalCollection);
            globalRecord.set("date", today);
            globalRecord.set("count", 0);
        }
        const globalCurrent = globalRecord.getInt("count");
        if (globalCurrent >= globalLimit) {
            throw new ApiError(429, "AI skener dnes dosiahol celkový denný limit pre všetkých používateľov. Skúste to prosím zajtra.", null);
        }
        globalRecord.set("count", globalCurrent + 1);
        e.app.save(globalRecord);

        const householdLimit = parseInt($os.getenv("AI_SCAN_DAILY_LIMIT") || "5", 10);
        let logRecord = null;
        try {
            logRecord = e.app.findFirstRecordByFilter(
                "ai_scan_logs",
                "household = {:household} && date = {:date}",
                { household: authRecord.id, date: today }
            );
        } catch (err) {
            logRecord = null;
        }
        if (!logRecord) {
            const logCollection = e.app.findCollectionByNameOrId("ai_scan_logs");
            logRecord = new Record(logCollection);
            logRecord.set("household", authRecord.id);
            logRecord.set("date", today);
            logRecord.set("count", 0);
        }
        const householdCurrent = logRecord.getInt("count");
        if (householdCurrent >= householdLimit) {
            throw new ApiError(429, "Dosiahli ste denný limit " + householdLimit + " AI skenov pre vašu domácnosť. Skúste to prosím zajtra.", null);
        }
        logRecord.set("count", householdCurrent + 1);
        e.app.save(logRecord);

        const geminiKey = $os.getenv("GEMINI_API_KEY");
        if (!geminiKey) {
            throw new ApiError(500, "AI skener nie je na serveri nakonfigurovaný (chýba GEMINI_API_KEY).", null);
        }

        const promptText = "Si slovenský kulinársky asistent pre rodinu. Analyzuj túto fotografiu (ktorá zobrazuje otvorenú chladničku, špajzu, potraviny na stole alebo nákup). Rozpoznaj potraviny a suroviny, ktoré sú k dispozícii. Na základe nich navrhni presne 3 slovenské recepty, ktoré je možné z nich pripraviť. Výstup vráť STRIKTNE ako jeden platný JSON objekt (žiadny iný text okolo, žiadne markdown značky ako ```json). JSON musí presne zodpovedať tejto schéme:\n{\n  \"recognizedIngredients\": [\"zoznam rozpoznaných surovín (napr. vajcia, mrkva, syr)\"] ,\n  \"recipes\": [\n    {\n      \"name\": \"Názov jedla (napr. Miešané vajíčka so syrom)\",\n      \"category\": \"kategória (jedna z hodnôt: polievka, hlavne, rychle, bezmasite, dvojdnove, lahke, vikendove)\",\n      \"servings\": 4,\n      \"prepTime\": 20,\n      \"difficulty\": \"náročnosť (jedna z hodnôt: lahke, stredne, narocne)\",\n      \"cookForTwoDays\": false,\n      \"canFreeze\": false,\n      \"ingredientsWeHave\": [\n        \"zoznam surovín ktoré máme k dispozícii odfotené, každá v presnom tvare: Názov, MnožstvoJednotka, kategória (napr: Vajcia, 4ks, mliecne alebo Syr Eidam, 100g, mliecne). Kategórie surovín vyber len z: zelenina, maso, mliecne, pecivo, trvanlive, mrazene, drogeria, ostatne\"\n      ],\n      \"ingredientsMissing\": [\n        \"zoznam surovín ktoré nám na dokončenie receptu chýbajú a bude ich treba dokúpiť, v rovnakom tvare: Názov, MnožstvoJednotka, kategória (napr: Pažítka, 1ks, zelenina). Ak nič nechýba, nechaj prázdne.\"\n      ],\n      \"instructions\": \"Stručný a jasný postup prípravy krok po kroku.\",\n      \"note\": \"Krátka poznámka alebo tip na servírovanie.\"\n    }\n  ]\n}";

        const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiKey;
        const requestBody = {
            contents: [{
                parts: [
                    { text: promptText },
                    { inlineData: { mimeType: data.mimeType, data: data.imageBase64 } }
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

        let cleaned = (textResponse || "").trim();
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```\s*$/, "").trim();

        let result;
        try {
            result = JSON.parse(cleaned);
        } catch (err) {
            throw new ApiError(502, "AI vrátila neočakávaný formát odpovede.", null);
        }

        return e.json(200, result);
    } catch (err) {
        if (err && err.status) {
            throw err;
        }
        console.log("scan-fridge failed: " + err);
        throw new ApiError(500, "Neočakávaná chyba AI skenera: " + err, null);
    }
});
