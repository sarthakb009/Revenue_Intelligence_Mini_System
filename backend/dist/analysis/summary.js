import { deals, targets } from "../data.js";
const QUARTER_MONTHS = {
    "2025-Q1": ["2025-01", "2025-02", "2025-03"],
    "2025-Q2": ["2025-04", "2025-05", "2025-06"],
    "2025-Q3": ["2025-07", "2025-08", "2025-09"],
    "2025-Q4": ["2025-10", "2025-11", "2025-12"],
};
const monthInQuarter = (month, quarter) => QUARTER_MONTHS[quarter]?.includes(month) ?? false;
function parseDate(s) {
    if (!s)
        return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}
function quarterFromMonth(month) {
    const [y, m] = month.split("-").map(Number);
    const q = Math.ceil(m / 3);
    return `${y}-Q${q}`;
}
export function getSummary() {
    const currentQuarter = "2025-Q4";
    const prevQuarter = "2025-Q3";
    const targetCurrent = targets
        .filter((t) => monthInQuarter(t.month, currentQuarter))
        .reduce((s, t) => s + t.target, 0) || 0;
    const targetPrev = targets
        .filter((t) => monthInQuarter(t.month, prevQuarter))
        .reduce((s, t) => s + t.target, 0) || 0;
    const closedWonInQuarter = (q) => deals.filter((d) => {
        if (d.stage !== "Closed Won")
            return false;
        const closed = parseDate(d.closed_at);
        if (!closed)
            return false;
        const m = closed.getFullYear() + "-" + String(closed.getMonth() + 1).padStart(2, "0");
        return monthInQuarter(m, q);
    });
    const revenueCurrent = closedWonInQuarter(currentQuarter).reduce((s, d) => s + (d.amount ?? 0), 0);
    const revenuePrev = closedWonInQuarter(prevQuarter).reduce((s, d) => s + (d.amount ?? 0), 0);
    const gapPct = targetCurrent ? ((revenueCurrent - targetCurrent) / targetCurrent) * 100 : 0;
    const qoqPct = revenuePrev ? ((revenueCurrent - revenuePrev) / revenuePrev) * 100 : 0;
    return {
        current_quarter_revenue: Math.round(revenueCurrent),
        target: targetCurrent,
        gap_percent: Math.round(gapPct * 10) / 10,
        qoq_change_percent: Math.round(qoqPct * 10) / 10,
        quarter_label: currentQuarter,
    };
}
