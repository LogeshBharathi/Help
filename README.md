# SSC Notice Intelligence Platform

Reconstructed Next.js application for browsing official SSC notices by exam category, with SQLite-backed summaries/tags and local bookmark persistence.

Recovered from the deployed Vercel build (`skill-deploy-q6920fl9re.vercel.app`) via RSC payloads, client bundles, CSS tokens, and live API responses.

## Stack

- **Next.js 14** App Router
- **TypeScript**
- **Tailwind CSS** (custom editorial theme from production CSS)
- **SWR** for client notice feeds
- **better-sqlite3** for local notice/summary persistence

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

On first run, SQLite initializes at `data/notices.db` and seeds:

- Full **CGL** archive from `data/seed-cgl.json` (captured from production API)
- Placeholder notices for other tabs (replace via SSC sync or your own seed files)

## Project structure

```
app/
  page.tsx                 # Homepage
  exam/[category]/page.tsx # Dynamic exam notice board
  api/notices/             # Category notice list
  api/notices/[id]/content # PDF text + metadata
  api/summaries/           # Manual summary persistence
  api/tags/                # User primary tag persistence
components/
  home/                    # Homepage sections
  exam/                    # Notice board + modals
  ExamCoverageModal.tsx    # Tab coverage explorer
lib/
  categories.ts            # Tab config + SSC exam id mapping
  db/                      # SQLite schema + repository
  ssc/client.ts            # SSC sync integration (mock by default)
data/
  seed-cgl.json            # Production-shaped seed bundle
```

## API routes (inferred)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/notices?category=CGL` | GET | List notices for a tab |
| `/api/notices?category=CGL&sync=1` | GET | Optional SSC sync then list |
| `/api/notices/:id/content` | GET | PDF text + tags for modal |
| `/api/summaries` | POST | Save manual summary (≥10 chars) |
| `/api/tags` | POST | Save user primary notice type |

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_PATH` | `data/notices.db` | SQLite file location |
| `SSC_SYNC_ENABLED` | `false` | Set `true` to attempt live SSC fetches |
| `SSC_API_BASE_URL` | `https://ssc.gov.in/api` | SSC API base (inferred) |

## Database schema

See [`lib/db/schema.sql`](lib/db/schema.sql). Core tables:

- `notices` — normalized SSC PDF records + summaries/tags/extracted text
- `sync_state` — per-category sync timestamps and enrichment counters

## Deployment notes

- **Bookmarks** are stored in `localStorage` (`ssc-notice-bookmarks.v1`).
- **SQLite** works on Node runtimes (local dev, VPS, container). For serverless Vercel without a volume, point `DATABASE_PATH` to a persistent store (e.g. Turso/libSQL) or replace `lib/db` with your hosted database.
- Set `SSC_SYNC_ENABLED=true` only when your SSC integration credentials/network are configured.

## Eligibility checker (CGL 2026 / May update)

- **`/eligibility`** — Save profile (localStorage), view all-exam results, browse full guide tabs (CGL, comparison, age relaxation, physical).
- **Homepage** — Orange eligibility card + header link with check icon.
- **Exam tabs** — `Official notices` | `Eligibility` on each `/exam/[category]` page (`?view=eligibility` deep link).
- **Badges** — Category cards and notice feed show **Eligible / Not eligible / Review** when a profile exists.

Profile key: `ssc-eligibility-profile.v1`. Rules live in `lib/eligibility/` (inferred from your HTML guide + CGL 2026 notice). Not legal advice — verify on ssc.gov.in.

## Assumptions documented in code

Parts of the backend pipeline (PDF text extraction, auto-summary generation, SSC auth) are **mocked or stubbed** where the original server source was unavailable. Search for `Assumption` and `Inferred` comments in `lib/ssc/` and `lib/db/`.
