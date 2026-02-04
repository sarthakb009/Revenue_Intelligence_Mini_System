import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "../../data");
function loadJson(filename) {
    const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
    return JSON.parse(raw);
}
export const accounts = loadJson("accounts.json");
export const reps = loadJson("reps.json");
export const deals = loadJson("deals.json");
export const activities = loadJson("activities.json");
export const targets = loadJson("targets.json");
export const accountById = new Map(accounts.map((a) => [a.account_id, a]));
export const repById = new Map(reps.map((r) => [r.rep_id, r]));
