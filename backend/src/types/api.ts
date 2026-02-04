/**
 * API response DTOs (what we send to the client).
 */

export interface SummaryResponse {
  current_quarter_revenue: number;
  target: number;
  gap_percent: number;
  qoq_change_percent: number;
  quarter_label: string;
}

export interface DriversResponse {
  pipeline_size: number;
  pipeline_deal_count: number;
  win_rate_percent: number;
  closed_won_count: number;
  closed_lost_count: number;
  average_deal_size: number;
  average_sales_cycle_days: number;
}

export interface StaleDealDto {
  deal_id: string;
  account_id: string;
  rep_id: string;
  days_inactive: number;
  amount: number;
  account_name?: string;
  rep_name?: string;
}

export interface UnderperformingRepDto {
  rep_id: string;
  name: string;
  win_rate_percent: number;
  deals_closed: number;
}

export interface LowActivityAccountDto {
  account_id: string;
  name: string;
  segment: string;
  open_deals: number;
  activity_count: number;
}

export interface RiskFactorsResponse {
  stale_deals: StaleDealDto[];
  underperforming_reps: UnderperformingRepDto[];
  low_activity_accounts: LowActivityAccountDto[];
}

export interface RecommendationsResponse {
  recommendations: string[];
}

export interface ApiError {
  error: string;
}
