/// <reference path="../pb_data/types.d.ts" />

// Pridá voliteľné pole "photo" (fotka jedla) do existujúcej kolekcie meals.
migrate((app) => {
    const collection = app.findCollectionByNameOrId("meals");

    collection.fields.add(new Field({
        type: "file",
        name: "photo",
        maxSelect: 1,
        maxSize: 8388608, // 8 MB
        mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic"],
        thumbs: ["100x100", "400x400"],
        required: false
    }));

    return app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId("meals");
    const field = collection.fields.getByName("photo");
    if (field) {
        collection.fields.removeById(field.id);
    }
    return app.save(collection);
});
