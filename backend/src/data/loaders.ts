import { readFileSync } from "fs";
import { join } from "path";
import { config } from "../config/index.js";
import type { Account, Rep, Deal, Activity, Target } from "../types/domain.js";

function loadJson<T>(filename: string): T {
  const raw = readFileSync(join(config.dataDir, filename), "utf-8");
  return JSON.parse(raw) as T;
}

export const accounts: Account[] = loadJson("accounts.json");
export const reps: Rep[] = loadJson("reps.json");
export const deals: Deal[] = loadJson("deals.json");
export const activities: Activity[] = loadJson("activities.json");
export const targets: Target[] = loadJson("targets.json");

export const accountById = new Map(accounts.map((a) => [a.account_id, a]));
export const repById = new Map(reps.map((r) => [r.rep_id, r]));
