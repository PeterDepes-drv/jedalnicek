// Konfigurácia self-hosted PocketBase backendu.
// Toto je jediné miesto, kde treba nastaviť adresu tvojho PocketBase servera.
const PB_URL = "https://api.jedalnicek.depes.online";

// Endpointy pre AI proxy (skener receptov / chladničky) — bežia priamo v PocketBase.
const AI_SCAN_RECIPE_ENDPOINT = PB_URL + "/api/ai/scan-recipe";
const AI_SCAN_FRIDGE_ENDPOINT = PB_URL + "/api/ai/scan-fridge";
