import { deals } from "../data.js";
const OPEN_STAGES = ["Prospecting", "Negotiation", "Qualification", "Discovery", "Proposal"];
const CLOSED_WON = "Closed Won";
const CLOSED_LOST = "Closed Lost";
function parseDate(s) {
    if (!s)
        return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}
function daysBetween(a, b) {
    return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
}
export function getDrivers() {
    const openDeals = deals.filter((d) => OPEN_STAGES.some((s) => d.stage.toLowerCase().includes(s.toLowerCase())));
    const closedWon = deals.filter((d) => d.stage === CLOSED_WON && (d.amount ?? 0) > 0);
    const closedLost = deals.filter((d) => d.stage === CLOSED_LOST);
    const closedWithDates = deals.filter((d) => (d.stage === CLOSED_WON || d.stage === CLOSED_LOST) && d.closed_at && d.created_at);
    const pipelineSize = openDeals.reduce((s, d) => s + (d.amount ?? 0), 0);
    const totalClosed = closedWon.length + closedLost.length;
    const winRate = totalClosed ? (closedWon.length / totalClosed) * 100 : 0;
    const avgDealSize = closedWon.length > 0
        ? closedWon.reduce((s, d) => s + (d.amount ?? 0), 0) / closedWon.length
        : 0;
    const cycleDays = [];
    for (const d of closedWithDates) {
        const created = parseDate(d.created_at);
        const closed = parseDate(d.closed_at);
        if (created && closed)
            cycleDays.push(daysBetween(created, closed));
    }
    const avgSalesCycleDays = cycleDays.length > 0 ? cycleDays.reduce((a, b) => a + b, 0) / cycleDays.length : 0;
    return {
        pipeline_size: Math.round(pipelineSize),
        pipeline_deal_count: openDeals.length,
        win_rate_percent: Math.round(winRate * 10) / 10,
        closed_won_count: closedWon.length,
        closed_lost_count: closedLost.length,
        average_deal_size: Math.round(avgDealSize),
        average_sales_cycle_days: Math.round(avgSalesCycleDays),
    };
}
