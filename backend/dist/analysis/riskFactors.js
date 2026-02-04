import { deals, activities, reps } from "../data.js";
import { accountById, repById } from "../data.js";
const OPEN_STAGES = ["Prospecting", "Negotiation", "Qualification", "Discovery", "Proposal"];
const STALE_DAYS = 30;
const LOW_ACTIVITY_THRESHOLD = 2;
function parseDate(s) {
    if (!s)
        return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
}
function daysAgo(date) {
    return Math.round((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
}
export function getRiskFactors() {
    const now = new Date();
    const openDeals = deals.filter((d) => OPEN_STAGES.some((s) => d.stage.toLowerCase().includes(s.toLowerCase())));
    const lastActivityByDeal = new Map();
    for (const a of activities) {
        const t = parseDate(a.timestamp);
        if (!t)
            continue;
        const existing = lastActivityByDeal.get(a.deal_id);
        if (!existing || t > existing)
            lastActivityByDeal.set(a.deal_id, t);
    }
    const staleDeals = [];
    for (const d of openDeals) {
        const lastAct = lastActivityByDeal.get(d.deal_id);
        const created = parseDate(d.created_at);
        const refDate = lastAct ?? created;
        if (!refDate)
            continue;
        const inactive = daysAgo(refDate);
        if (inactive >= STALE_DAYS)
            staleDeals.push({
                deal_id: d.deal_id,
                account_id: d.account_id,
                rep_id: d.rep_id,
                days_inactive: inactive,
                amount: d.amount ?? 0,
            });
    }
    staleDeals.sort((a, b) => b.days_inactive - a.days_inactive);
    const repClosedWon = new Map();
    const repClosedLost = new Map();
    const repPipeline = new Map();
    for (const d of deals) {
        if (d.stage === "Closed Won")
            repClosedWon.set(d.rep_id, (repClosedWon.get(d.rep_id) ?? 0) + 1);
        if (d.stage === "Closed Lost")
            repClosedLost.set(d.rep_id, (repClosedLost.get(d.rep_id) ?? 0) + 1);
        if (OPEN_STAGES.some((s) => d.stage.toLowerCase().includes(s.toLowerCase())))
            repPipeline.set(d.rep_id, (repPipeline.get(d.rep_id) ?? 0) + (d.amount ?? 0));
    }
    let teamWinRate = 0;
    let totalClosed = 0;
    reps.forEach((r) => {
        const w = repClosedWon.get(r.rep_id) ?? 0;
        const l = repClosedLost.get(r.rep_id) ?? 0;
        totalClosed += w + l;
    });
    const teamWon = reps.reduce((s, r) => s + (repClosedWon.get(r.rep_id) ?? 0), 0);
    const teamLost = reps.reduce((s, r) => s + (repClosedLost.get(r.rep_id) ?? 0), 0);
    teamWinRate = teamWon + teamLost ? (teamWon / (teamWon + teamLost)) * 100 : 0;
    const underperformingReps = [];
    reps.forEach((r) => {
        const w = repClosedWon.get(r.rep_id) ?? 0;
        const l = repClosedLost.get(r.rep_id) ?? 0;
        if (w + l < 3)
            return;
        const wr = (w / (w + l)) * 100;
        if (wr < teamWinRate - 10)
            underperformingReps.push({
                rep_id: r.rep_id,
                name: r.name,
                win_rate_percent: Math.round(wr * 10) / 10,
                deals_closed: w + l,
            });
    });
    underperformingReps.sort((a, b) => a.win_rate_percent - b.win_rate_percent);
    const activityCountByDeal = new Map();
    for (const a of activities)
        activityCountByDeal.set(a.deal_id, (activityCountByDeal.get(a.deal_id) ?? 0) + 1);
    const accountOpenDeals = new Map();
    for (const d of openDeals) {
        const list = accountOpenDeals.get(d.account_id) ?? [];
        list.push(d.deal_id);
        accountOpenDeals.set(d.account_id, list);
    }
    const lowActivityAccounts = [];
    accountOpenDeals.forEach((dealIds, accountId) => {
        const totalActs = dealIds.reduce((s, did) => s + (activityCountByDeal.get(did) ?? 0), 0);
        if (dealIds.length >= 1 && totalActs <= LOW_ACTIVITY_THRESHOLD) {
            const acc = accountById.get(accountId);
            lowActivityAccounts.push({
                account_id: accountId,
                name: acc?.name ?? accountId,
                segment: acc?.segment ?? "—",
                open_deals: dealIds.length,
                activity_count: totalActs,
            });
        }
    });
    lowActivityAccounts.sort((a, b) => a.activity_count - b.activity_count);
    return {
        stale_deals: staleDeals.slice(0, 15).map((d) => ({
            ...d,
            account_name: accountById.get(d.account_id)?.name ?? d.account_id,
            rep_name: repById.get(d.rep_id)?.name ?? d.rep_id,
        })),
        underperforming_reps: underperformingReps.slice(0, 10),
        low_activity_accounts: lowActivityAccounts.slice(0, 15),
    };
}
