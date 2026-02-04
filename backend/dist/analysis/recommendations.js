import { getRiskFactors } from "./riskFactors.js";
import { getDrivers } from "./drivers.js";
import { accountById } from "../data.js";
export function getRecommendations() {
    const recs = [];
    const risk = getRiskFactors();
    const drivers = getDrivers();
    const staleEnterprise = risk.stale_deals.filter((d) => {
        const acc = accountById.get(d.account_id);
        return acc?.segment === "Enterprise";
    });
    if (staleEnterprise.length > 0) {
        recs.push(`Focus on ${staleEnterprise.length} Enterprise deal(s) with no activity in 30+ days — follow up or disqualify to clean pipeline.`);
    }
    const staleOver30 = risk.stale_deals.filter((d) => d.days_inactive >= 30);
    if (staleOver30.length >= 3) {
        recs.push(`${staleOver30.length} open deals have had no activity in 30+ days. Prioritise outreach or move to closed-lost to keep forecast accurate.`);
    }
    for (const r of risk.underperforming_reps.slice(0, 2)) {
        recs.push(`Coach ${r.name} on win rate (${r.win_rate_percent}% vs team avg); consider pairing on calls or revisiting qualification criteria.`);
    }
    const segmentCount = new Map();
    for (const a of risk.low_activity_accounts) {
        segmentCount.set(a.segment, (segmentCount.get(a.segment) ?? 0) + 1);
    }
    const topSegment = [...segmentCount.entries()].sort((a, b) => b[1] - a[1])[0];
    if (topSegment && topSegment[1] >= 2) {
        recs.push(`Increase activity for ${topSegment[0]} accounts: ${topSegment[1]} have open deals with very few touches — schedule calls or demos.`);
    }
    if (drivers.win_rate_percent < 40 && drivers.closed_won_count + drivers.closed_lost_count > 10) {
        recs.push(`Overall win rate is ${drivers.win_rate_percent}%. Review loss reasons and tighten qualification so pipeline reflects real opportunities.`);
    }
    return recs.slice(0, 5);
}
