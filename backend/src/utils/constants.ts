/**
 * Deal stages and analysis thresholds.
 */

export const OPEN_STAGES = [
  "Prospecting",
  "Negotiation",
  "Qualification",
  "Discovery",
  "Proposal",
] as const;

export const CLOSED_WON = "Closed Won";
export const CLOSED_LOST = "Closed Lost";

export const STALE_DAYS = 30;
export const LOW_ACTIVITY_THRESHOLD = 2;
export const UNDERPERFORMING_WIN_RATE_GAP = 10;
export const MIN_DEALS_FOR_REP_METRICS = 3;

export const CURRENT_QUARTER = "2025-Q4";
export const PREV_QUARTER = "2025-Q3";

export const MAX_STALE_DEALS_RETURNED = 15;
export const MAX_UNDERPERFORMING_REPS = 10;
export const MAX_LOW_ACTIVITY_ACCOUNTS = 15;
export const MAX_RECOMMENDATIONS = 5;
