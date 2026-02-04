import { readFileSync } from "fs";
import { join } from "path";
import { config } from "../config/index.js";
function loadJson(filename) {
    const raw = readFileSync(join(config.dataDir, filename), "utf-8");
    return JSON.parse(raw);
}
export const accounts = loadJson("accounts.json");
export const reps = loadJson("reps.json");
export const deals = loadJson("deals.json");
export const activities = loadJson("activities.json");
export const targets = loadJson("targets.json");
export const accountById = new Map(accounts.map((a) => [a.account_id, a]));
export const repById = new Map(reps.map((r) => [r.rep_id, r]));
