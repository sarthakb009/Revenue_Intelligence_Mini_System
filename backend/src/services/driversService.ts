import { deals, activities } from "../data/index.js";
import { parseDate, daysBetween } from "../utils/date.js";
import { OPEN_STAGES, CLOSED_WON, CLOSED_LOST } from "../utils/constants.js";
import type { DriversResponse } from "../types/api.js";

function isOpenStage(stage: string): boolean {
  return OPEN_STAGES.some((s) => stage.toLowerCase().includes(s.toLowerCase()));
}

export function getDrivers(): DriversResponse {
  const openDeals = deals.filter((d) => isOpenStage(d.stage));
  const closedWon = deals.filter((d) => d.stage === CLOSED_WON && (d.amount ?? 0) > 0);
  const closedLost = deals.filter((d) => d.stage === CLOSED_LOST);
  const closedWithDates = deals.filter(
    (d) =>
      (d.stage === CLOSED_WON || d.stage === CLOSED_LOST) && d.closed_at && d.created_at
  );

  const pipelineSize = openDeals.reduce((s, d) => s + (d.amount ?? 0), 0);
  const totalClosed = closedWon.length + closedLost.length;
  const winRate = totalClosed ? (closedWon.length / totalClosed) * 100 : 0;
  const avgDealSize =
    closedWon.length > 0
      ? closedWon.reduce((s, d) => s + (d.amount ?? 0), 0) / closedWon.length
      : 0;

  const cycleDays: number[] = [];
  for (const d of closedWithDates) {
    const created = parseDate(d.created_at);
    const closed = parseDate(d.closed_at);
    if (created && closed) cycleDays.push(daysBetween(created, closed));
  }
  const avgSalesCycleDays =
    cycleDays.length > 0 ? cycleDays.reduce((a, b) => a + b, 0) / cycleDays.length : 0;

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
