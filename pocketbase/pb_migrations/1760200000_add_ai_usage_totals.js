/// <reference path="../pb_data/types.d.ts" />

// Globálny denný počet AI skenov naprieč VŠETKÝMI domácnosťami — chráni
// pred neplánovaným účtom pri raste počtu registrácií (verejný launch).
// Nie je prístupná z frontendu, zapisuje/číta len server-side AI proxy hook.
migrate((app) => {
    const collection = new Collection({
        name: "ai_usage_totals",
        type: "base",
        listRule: null,
        viewRule: null,
        createRule: null,
        updateRule: null,
        deleteRule: null,
        fields: [
            { name: "date", type: "text", required: true, max: 10 },
            { name: "count", type: "number", min: 0 }
        ],
        indexes: [
            "CREATE UNIQUE INDEX idx_ai_usage_totals_date ON ai_usage_totals (date)"
        ]
    });
    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("ai_usage_totals");
    if (collection) {
        return app.delete(collection);
    }
});
