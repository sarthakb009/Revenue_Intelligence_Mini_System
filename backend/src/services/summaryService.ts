import { deals, targets } from "../data/index.js";
import { monthInQuarter, parseDate, monthString } from "../utils/date.js";
import { CURRENT_QUARTER, PREV_QUARTER } from "../utils/constants.js";
import type { SummaryResponse } from "../types/api.js";

function closedWonInQuarter(q: string): typeof deals {
  return deals.filter((d) => {
    if (d.stage !== "Closed Won") return false;
    const closed = parseDate(d.closed_at);
    if (!closed) return false;
    return monthInQuarter(monthString(closed), q);
  });
}

export function getSummary(): SummaryResponse {
  const targetCurrent =
    targets
      .filter((t) => monthInQuarter(t.month, CURRENT_QUARTER))
      .reduce((s, t) => s + t.target, 0) || 0;

  const targetPrev =
    targets
      .filter((t) => monthInQuarter(t.month, PREV_QUARTER))
      .reduce((s, t) => s + t.target, 0) || 0;

  const revenueCurrent = closedWonInQuarter(CURRENT_QUARTER).reduce(
    (s, d) => s + (d.amount ?? 0),
    0
  );
  const revenuePrev = closedWonInQuarter(PREV_QUARTER).reduce(
    (s, d) => s + (d.amount ?? 0),
    0
  );

  const gapPct = targetCurrent ? ((revenueCurrent - targetCurrent) / targetCurrent) * 100 : 0;
  const qoqPct = revenuePrev ? ((revenueCurrent - revenuePrev) / revenuePrev) * 100 : 0;

  return {
    current_quarter_revenue: Math.round(revenueCurrent),
    target: targetCurrent,
    gap_percent: Math.round(gapPct * 10) / 10,
    qoq_change_percent: Math.round(qoqPct * 10) / 10,
    quarter_label: CURRENT_QUARTER,
  };
}
