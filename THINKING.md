# Reflection: Revenue Intelligence Console

## Assumptions

- **Current quarter**: Targets only exist for 2025 (months `2025-01`–`2025-12`). The summary uses **Q4 2025** (Oct–Dec) as the “current” quarter so we can show revenue vs target and gap%. In production you’d plug in the real current quarter (e.g. from config or server date).
- **Open pipeline**: “Open” stages are treated as any stage whose name matches Prospecting, Negotiation, Qualification, Discovery, or Proposal. Closed = Closed Won / Closed Lost. No other stage names were assumed.
- **Stale deals**: Deals with no activity (or no `created_at`) in the last **30 days** are considered stale. “Last activity” is the latest `activities.timestamp` per deal; if a deal has no activities, we use `created_at`.
- **Underperforming reps**: Reps with at least 3 closed deals and win rate **more than 10 percentage points below** the team average are flagged.
- **Low-activity accounts**: Accounts that have at least one open deal and **≤2** total activities across those deals.
- **Currency**: Display uses INR for formatting; the data is numeric only.

## Data issues

- **Null amounts**: Many deals have `amount: null`, including some Closed Won. For revenue and averages we treat null as 0 so we don’t double-count or break; the spec says “may contain inconsistencies,” so this is a deliberate choice. A better fix would be to backfill or exclude those from “revenue” and note them in the UI.
- **Future closed_at**: At least one deal has `closed_at` in 2026 (e.g. `2026-03-05`) while data is 2025-heavy. It’s included in closed-won logic; if “current period” were strictly 2025, you’d filter closed_at by that range.
- **Orphaned activities**: Some `activities.deal_id` may not exist in `deals`. We don’t validate that; we only aggregate by deal_id. Orphans would be ignored in “last activity per deal” and in activity counts.
- **Account/rep references**: Deals reference `account_id` and `rep_id`; we assume they exist in `accounts` and `reps`. Missing IDs are handled by falling back to the raw id in the UI.

## Tradeoffs

- **No database**: Data is loaded from JSON at startup and kept in memory. Chosen for speed and simplicity; all APIs are synchronous reads. Tradeoff: no persistence, no concurrent writes, and a single process. Fine for a demo; at scale you’d use a DB and possibly a cache.
- **Summary quarter fixed to Q4 2025**: Keeps the API simple and the UI meaningful with the given targets. Tradeoff: not “live” current quarter without extra config.
- **Recommendations are heuristic**: Built from the same risk/driver outputs (stale deals, underperforming reps, low-activity segments). We don’t rank by impact or model conversion; we just surface 3–5 suggestions. Tradeoff: actionable but not optimised.
- **Frontend proxy**: Vite proxies `/api` to the backend so the app works with one origin. You run backend and frontend separately; production would use a reverse proxy or same-origin API.

## What would break at 10× scale?

- **Memory**: Loading all deals/activities/accounts into Node memory would grow linearly; at 10× you’d want pagination, streaming, or a DB with indexed queries.
- **Single process**: No sharding or read replicas; one Node process would become a bottleneck for concurrent requests.
- **No caching**: Every `/api/*` hit recomputes from in-memory data. At 10× traffic you’d add caching (e.g. short TTL for summary/drivers) or pre-aggregated tables.
- **Stale/risk/recommendations**: Loops over all deals and activities are O(n). At 10× data size you’d move this to batch jobs or DB aggregations and serve precomputed results.
- **Frontend**: One big JSON payload per endpoint is fine at current size; at 10× you’d paginate risk tables (stale deals, low-activity accounts) and maybe slice drivers by segment/rep.

## What did AI help with vs what I decided?

- **AI helped**: Boilerplate (Express routes, React hooks, MUI layout), TypeScript types for the APIs, and D3 bar charts (scales, rects, labels). Also phrasing in this doc.
- **I decided**: (1) Using Q4 2025 as the summary quarter so targets and revenue align. (2) Defining “stale” as 30 days and “underperforming” as 10 pts below team win rate. (3) Treating null amounts as 0 and not adding a separate “missing amount” bucket. (4) Design: IBM Plex Sans/Mono, warm neutrals, green accent, no gradients so it doesn’t look like generic AI UI. (5) In-memory JSON instead of SQLite so we don’t need schema or migrations for this dataset.
