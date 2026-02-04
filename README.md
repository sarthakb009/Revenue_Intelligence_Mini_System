# Revenue Intelligence Console

Single-page console to help a CRO see why revenue is behind or ahead for the quarter and what to focus on next. Built with a TypeScript backend and React + Material UI + D3 frontend.

## Structure

- **backend** — Express server, reads from `data/*.json`, exposes REST APIs
- **frontend** — Vite + React + TypeScript, Material UI, D3 charts
- **data** — JSON files: `accounts.json`, `activities.json`, `deals.json`, `reps.json`, `targets.json`

## Run locally

**Data:** Ensure the five JSON files are in `./data/` (they are in the repo at project root).

**Option A — One command (recommended)**  
From project root, install once then run both backend and frontend:

```bash
npm install
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000` (proxies `/api` to the backend)

**Option B — Two terminals**  
If you prefer to run them separately:

1. **Backend** (must be running first, or the frontend will get proxy errors):

   ```bash
   cd backend && npm install && npm run dev
   ```

2. **Frontend** (in another terminal):

   ```bash
   cd frontend && npm install && npm run dev
   ```

If you see `ECONNREFUSED` or proxy errors in the frontend, the backend is not running — start it on port 4000 first.

## API endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/summary` | Current quarter revenue, target, gap %, QoQ change |
| `GET /api/drivers` | Pipeline size, win rate, avg deal size, sales cycle (days) |
| `GET /api/risk-factors` | Stale deals, underperforming reps, low-activity accounts |
| `GET /api/recommendations` | 3–5 actionable recommendations |

## Tech

- Backend: Node, Express, TypeScript (ESM), in-memory data from JSON
- Frontend: React 18, TypeScript, Vite, Material UI, D3

## Code structure

**Backend** (`backend/src/`)

- `config/` — env and paths
- `types/` — domain entities and API DTOs
- `utils/` — date helpers, constants (stages, thresholds)
- `data/` — JSON loaders and lookup maps
- `services/` — business logic (summary, drivers, risk factors, recommendations)
- `routes/` — API route definitions
- `middleware/` — async handler and global error handler
- `app.ts` — Express app factory; `index.ts` — server entry

**Frontend** (`frontend/src/`)

- `types/` — API response types
- `api/` — HTTP client (`apiGet`)
- `hooks/` — `useFetch` for data loading
- `utils/` — formatting (e.g. `formatCurrency`)
- `components/ui/` — reusable UI (MetricCard, SectionCard, EmptyState, SectionSkeleton)
- `components/charts/` — D3 charts (RevenueBarChart, DriversBarChart)
- `sections/` — feature sections (Summary, Drivers, Risk, Recommendations)
- `App.tsx` — layout and data wiring; `main.tsx` — root and theme

See **THINKING.md** for assumptions, data issues, tradeoffs, scaling notes, and how AI was used.
# Revenue_Intelligence_Mini_System
