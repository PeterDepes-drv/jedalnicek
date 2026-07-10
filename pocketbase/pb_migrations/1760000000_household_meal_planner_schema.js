/// <reference path="../pb_data/types.d.ts" />

// Rodinný Jedálniček — základná schéma.
// Vytvára 8 kolekcií: households (auth) + 7 kolekcií naviazaných na domácnosť
// cez reláciu "household", chránených pravidlom `household = @request.auth.id`.
migrate((app) => {
    // ------------------------------------------------------------------
    // 1) households — auth kolekcia, nahrádza dnešné "rodinné heslo".
    //    Jedna domácnosť = jeden účet (email + heslo).
    // ------------------------------------------------------------------
    const households = new Collection({
        name: "households",
        type: "auth",
        listRule: "id = @request.auth.id",
        viewRule: "id = @request.auth.id",
        createRule: "", // verejná registrácia novej domácnosti
        updateRule: "id = @request.auth.id",
        deleteRule: "id = @request.auth.id",
        passwordAuth: {
            enabled: true,
            identityFields: ["email"]
        },
        oauth2: { enabled: false },
        otp: { enabled: false },
        mfa: { enabled: false },
        authAlert: { enabled: false },
        fields: [
            {
                name: "name",
                type: "text",
                required: true,
                max: 100
            }
        ]
    });
    app.save(households);

    // ------------------------------------------------------------------
    // 2) members — 4 pevné role (role1..role4) s prispôsobiteľným menom,
    //    zodpovedajú dnešným rolám Mama/Otec/Člen 1/Člen 2 vo frontende.
    // ------------------------------------------------------------------
    const members = new Collection({
        name: "members",
        type: "base",
        listRule: "household = @request.auth.id",
        viewRule: "household = @request.auth.id",
        createRule: "household = @request.auth.id",
        updateRule: "household = @request.auth.id",
        deleteRule: "household = @request.auth.id",
        fields: [
            {
                name: "household",
                type: "relation",
                required: true,
                collectionId: households.id,
                maxSelect: 1,
                cascadeDelete: true
            },
            {
                name: "name",
                type: "text",
                required: true,
                max: 60
            },
            {
                name: "role_key",
                type: "select",
                required: true,
                maxSelect: 1,
                values: ["role1", "role2", "role3", "role4"]
            },
            {
                name: "permission",
                type: "select",
                required: true,
                maxSelect: 1,
                values: ["spravca", "pomocnik"]
            }
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_members_household_role ON members (household, role_key)"
        ]
    });
    app.save(members);

    // ------------------------------------------------------------------
    // 3) meals — databáza receptov.
    // ------------------------------------------------------------------
    const meals = new Collection({
        name: "meals",
        type: "base",
        listRule: "household = @request.auth.id",
        viewRule: "household = @request.auth.id",
        createRule: "household = @request.auth.id",
        updateRule: "household = @request.auth.id",
        deleteRule: "household = @request.auth.id",
        fields: [
            {
                name: "household",
                type: "relation",
                required: true,
                collectionId: households.id,
                maxSelect: 1,
                cascadeDelete: true
            },
            { name: "name", type: "text", required: true, max: 150 },
            {
                name: "category",
                type: "select",
                required: true,
                maxSelect: 1,
                values: ["polievka", "hlavne", "rychle", "bezmasite", "dvojdnove", "lahke", "vikendove"]
            },
            { name: "servings", type: "number", min: 1 },
            { name: "prep_time", type: "number", min: 0 },
            {
                name: "difficulty",
                type: "select",
                maxSelect: 1,
                values: ["lahke", "stredne", "narocne"]
            },
            { name: "cook_for_two_days", type: "bool" },
            { name: "can_freeze", type: "bool" },
            {
                name: "popularity",
                type: "select",
                maxSelect: 1,
                values: ["velmi-oblubene", "bezne", "obcas"]
            },
            {
                name: "liked_by",
                type: "select",
                maxSelect: 4,
                values: ["role1", "role2", "role3", "role4"]
            },
            { name: "ingredients_text", type: "text", required: true, max: 4000 },
            { name: "instructions", type: "text", max: 4000 },
            { name: "note", type: "text", max: 500 },
            {
                name: "rating",
                type: "select",
                maxSelect: 1,
                values: ["chutilo", "bolo-v-poriadku", "menej-casto", "nechceme"]
            }
        ]
    });
    app.save(meals);

    // ------------------------------------------------------------------
    // 4) weekly_plans — jeden aktívny plán (7/14 dní) na domácnosť,
    //    dni sú uložené ako JSON presne v dnešnom tvare.
    // ------------------------------------------------------------------
    const weeklyPlans = new Collection({
        name: "weekly_plans",
        type: "base",
        listRule: "household = @request.auth.id",
        viewRule: "household = @request.auth.id",
        createRule: "household = @request.auth.id",
        updateRule: "household = @request.auth.id",
        deleteRule: "household = @request.auth.id",
        fields: [
            {
                name: "household",
                type: "relation",
                required: true,
                collectionId: households.id,
                maxSelect: 1,
                cascadeDelete: true
            },
            { name: "duration", type: "number", min: 1, max: 14 },
            { name: "start_date", type: "date" },
            { name: "days", type: "json", maxSize: 200000 }
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_weekly_plans_household ON weekly_plans (household)"
        ]
    });
    app.save(weeklyPlans);

    // ------------------------------------------------------------------
    // 5) shopping_items — jednotlivé položky nákupného zoznamu
    //    (samostatné záznamy kvôli realtime odškrtávaniu viacerými členmi naraz).
    // ------------------------------------------------------------------
    const shoppingItems = new Collection({
        name: "shopping_items",
        type: "base",
        listRule: "household = @request.auth.id",
        viewRule: "household = @request.auth.id",
        createRule: "household = @request.auth.id",
        updateRule: "household = @request.auth.id",
        deleteRule: "household = @request.auth.id",
        fields: [
            {
                name: "household",
                type: "relation",
                required: true,
                collectionId: households.id,
                maxSelect: 1,
                cascadeDelete: true
            },
            { name: "name", type: "text", required: true, max: 150 },
            { name: "quantity", type: "number" },
            { name: "unit", type: "text", max: 20 },
            {
                name: "category",
                type: "select",
                maxSelect: 1,
                values: ["zelenina", "maso", "mliecne", "pecivo", "trvanlive", "mrazene", "drogeria", "ostatne"]
            },
            { name: "checked", type: "bool" },
            { name: "manual", type: "bool" }
        ]
    });
    app.save(shoppingItems);

    // ------------------------------------------------------------------
    // 6) pantry_items — zásoby doma.
    // ------------------------------------------------------------------
    const pantryItems = new Collection({
        name: "pantry_items",
        type: "base",
        listRule: "household = @request.auth.id",
        viewRule: "household = @request.auth.id",
        createRule: "household = @request.auth.id",
        updateRule: "household = @request.auth.id",
        deleteRule: "household = @request.auth.id",
        fields: [
            {
                name: "household",
                type: "relation",
                required: true,
                collectionId: households.id,
                maxSelect: 1,
                cascadeDelete: true
            },
            { name: "name", type: "text", required: true, max: 100 },
            {
                name: "status",
                type: "select",
                required: true,
                maxSelect: 1,
                values: ["mame", "dochadza", "treba-kupit"]
            }
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_pantry_items_household_name ON pantry_items (household, name)"
        ]
    });
    app.save(pantryItems);

    // ------------------------------------------------------------------
    // 7) suggestions — priania pomocníkov (role3/role4) + ich hodnotenia.
    // ------------------------------------------------------------------
    const suggestions = new Collection({
        name: "suggestions",
        type: "base",
        listRule: "household = @request.auth.id",
        viewRule: "household = @request.auth.id",
        createRule: "household = @request.auth.id",
        updateRule: "household = @request.auth.id",
        deleteRule: "household = @request.auth.id",
        fields: [
            {
                name: "household",
                type: "relation",
                required: true,
                collectionId: households.id,
                maxSelect: 1,
                cascadeDelete: true
            },
            {
                name: "member_role",
                type: "select",
                required: true,
                maxSelect: 1,
                values: ["role3", "role4"]
            },
            { name: "meal_suggestions", type: "json", maxSize: 2000 },
            { name: "rated_meal_ids", type: "json", maxSize: 20000 }
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_suggestions_household_role ON suggestions (household, member_role)"
        ]
    });
    app.save(suggestions);

    // ------------------------------------------------------------------
    // 8) ai_scan_logs — interné počítadlo pre rate-limit AI skenera.
    //    Nie je prístupné z frontendu, zapisuje doň len server-side hook.
    // ------------------------------------------------------------------
    const aiScanLogs = new Collection({
        name: "ai_scan_logs",
        type: "base",
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            {
                name: "household",
                type: "relation",
                required: true,
                collectionId: households.id,
                maxSelect: 1,
                cascadeDelete: true
            },
            { name: "date", type: "text", required: true, max: 10 },
            { name: "count", type: "number", min: 0 }
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_ai_scan_logs_household_date ON ai_scan_logs (household, date)"
        ]
    });
    app.save(aiScanLogs);
}, (app) => {
    // Rollback v opačnom poradí, aby sa najprv zmazali závislé kolekcie.
    const names = [
        "ai_scan_logs",
        "suggestions",
        "pantry_items",
        "shopping_items",
        "weekly_plans",
        "meals",
        "members",
        "households"
    ];
    for (const name of names) {
        const collection = app.findCollectionByNameOrId(name);
        if (collection) {
            app.delete(collection);
        }
    }
});
