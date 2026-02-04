import {
  deals,
  activities,
  accountById,
  repById,
} from "../data/index.js";
import { parseDate, daysAgo } from "../utils/date.js";
import {
  OPEN_STAGES,
  STALE_DAYS,
  LOW_ACTIVITY_THRESHOLD,
  UNDERPERFORMING_WIN_RATE_GAP,
  MIN_DEALS_FOR_REP_METRICS,
  MAX_STALE_DEALS_RETURNED,
  MAX_UNDERPERFORMING_REPS,
  MAX_LOW_ACTIVITY_ACCOUNTS,
} from "../utils/constants.js";
import type {
  RiskFactorsResponse,
  StaleDealDto,
  UnderperformingRepDto,
  LowActivityAccountDto,
} from "../types/api.js";

function isOpenStage(stage: string): boolean {
  return OPEN_STAGES.some((s) => stage.toLowerCase().includes(s.toLowerCase()));
}

export function getRiskFactors(): RiskFactorsResponse {
  const openDeals = deals.filter((d) => isOpenStage(d.stage));

  const lastActivityByDeal = new Map<string, Date>();
  for (const a of activities) {
    const t = parseDate(a.timestamp);
    if (!t) continue;
    const existing = lastActivityByDeal.get(a.deal_id);
    if (!existing || t > existing) lastActivityByDeal.set(a.deal_id, t);
  }

  const staleDeals: StaleDealDto[] = [];
  for (const d of openDeals) {
    const lastAct = lastActivityByDeal.get(d.deal_id);
    const created = parseDate(d.created_at);
    const refDate = lastAct ?? created;
    if (!refDate) continue;
    const inactive = daysAgo(refDate);
    if (inactive >= STALE_DAYS) {
      staleDeals.push({
        deal_id: d.deal_id,
        account_id: d.account_id,
        rep_id: d.rep_id,
        days_inactive: inactive,
        amount: d.amount ?? 0,
        account_name: accountById.get(d.account_id)?.name,
        rep_name: repById.get(d.rep_id)?.name,
      });
    }
  }
  staleDeals.sort((a, b) => b.days_inactive - a.days_inactive);

  const repClosedWon = new Map<string, number>();
  const repClosedLost = new Map<string, number>();
  for (const d of deals) {
    if (d.stage === "Closed Won")
      repClosedWon.set(d.rep_id, (repClosedWon.get(d.rep_id) ?? 0) + 1);
    if (d.stage === "Closed Lost")
      repClosedLost.set(d.rep_id, (repClosedLost.get(d.rep_id) ?? 0) + 1);
  }

  const teamWon = [...repClosedWon.values()].reduce((a, b) => a + b, 0);
  const teamLost = [...repClosedLost.values()].reduce((a, b) => a + b, 0);
  const teamWinRate = teamWon + teamLost ? (teamWon / (teamWon + teamLost)) * 100 : 0;

  const underperformingReps: UnderperformingRepDto[] = [];
  for (const [repId, rep] of repById) {
    const w = repClosedWon.get(repId) ?? 0;
    const l = repClosedLost.get(repId) ?? 0;
    if (w + l < MIN_DEALS_FOR_REP_METRICS) continue;
    const wr = (w / (w + l)) * 100;
    if (wr < teamWinRate - UNDERPERFORMING_WIN_RATE_GAP) {
      underperformingReps.push({
        rep_id: repId,
        name: rep.name,
        win_rate_percent: Math.round(wr * 10) / 10,
        deals_closed: w + l,
      });
    }
  }
  underperformingReps.sort((a, b) => a.win_rate_percent - b.win_rate_percent);

  const activityCountByDeal = new Map<string, number>();
  for (const a of activities) {
    activityCountByDeal.set(a.deal_id, (activityCountByDeal.get(a.deal_id) ?? 0) + 1);
  }

  const accountOpenDeals = new Map<string, string[]>();
  for (const d of openDeals) {
    const list = accountOpenDeals.get(d.account_id) ?? [];
    list.push(d.deal_id);
    accountOpenDeals.set(d.account_id, list);
  }

  const lowActivityAccounts: LowActivityAccountDto[] = [];
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
    stale_deals: staleDeals.slice(0, MAX_STALE_DEALS_RETURNED).map((d) => ({
      ...d,
      account_name: d.account_name ?? d.account_id,
      rep_name: d.rep_name ?? d.rep_id,
    })),
    underperforming_reps: underperformingReps.slice(0, MAX_UNDERPERFORMING_REPS),
    low_activity_accounts: lowActivityAccounts.slice(0, MAX_LOW_ACTIVITY_ACCOUNTS),
  };
}
