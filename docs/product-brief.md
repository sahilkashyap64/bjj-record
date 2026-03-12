# Product Brief: BJJ Progress Tracker (Web App)

## Executive Summary
A privacy-first, offline-capable Progressive Web App (PWA) for Brazilian jiu-jitsu practitioners to:
- Log sessions in ~2 minutes.
- Track rounds, techniques, injuries, and partner interactions.
- Generate weekly/monthly KPIs (e.g., escape rate, guard pass defense, submission finish rate).
- Monitor training load with sRPE (`duration_min × sRPE`).

Primary differentiation:
- **Web-first + offline-first** UX.
- **Privacy by default** (partner pseudonyms, minimal telemetry, explicit sharing controls).
- **Strong portability** (CSV/JSON export + import).

---

## Personas
- **Novice hobbyist:** low-friction logging, consistency support.
- **Regular recreational practitioner:** trend detection + simple weekly reviews.
- **Competitor:** precise KPI tracking + camp load management.
- **Coach:** opt-in student oversight, aggregate trends, consent-respecting access.

---

## MVP Scope
### Must-have
- Session logging (quick flow)
- Rounds + key actions/events
- Technique library (minimal taxonomy)
- Partner management with pseudonyms by default
- Lightweight injury tracking
- Weekly + monthly dashboard (core KPIs)
- sRPE load tracking
- CSV/JSON export
- PWA offline support + sync

### Later phases
- Coach sharing and cohort views
- 12-week plan builder
- Custom KPI builder
- Local-only mode

---

## Data Model (PostgreSQL + JSONB)
Core entities:
- `users`
- `session_logs`
- `rounds`
- `round_actions`
- `techniques`
- `session_techniques`
- `partners`
- `injuries`
- `fitness_tests`
- `fitness_test_results`
- `plans`
- `plan_weeks`
- `export_jobs`

Key relationship chain for KPI analytics:
`users -> session_logs -> rounds -> round_actions`

Rationale:
- Relational integrity + SQL analytics for rollups.
- JSONB for flexible metadata fields with optional GIN indexing.

---

## KPI Definitions (Initial)
- **Escape rate** = `successful_escapes / escape_attempts`
- **Guard pass defense rate** = `stopped_passes / pass_attempts_against`
- **Submission finish rate** = `submission_finishes / submission_attempts`
- **sRPE load (session)** = `duration_min * sRPE`
- **sRPE load (week/month)** = sum of session loads

---

## Core UX Flows
### 1) Quick session entry (target: <2 min)
1. Tap **New Session** (prefilled defaults)
2. Select session type + gi/no-gi
3. Enter duration + sRPE
4. Optionally add rounds + key events
5. Save (offline supported)

### 2) Weekly review
- Sessions, mat minutes, total load, streak
- Top KPI cards
- Most frequent failure patterns
- Next-week focus picker

### 3) Monthly dashboard
- Month-over-month KPI deltas
- Trend cards/sparklines
- Optional export/share

### 4) 12-week plan builder (Phase 2)
- Weekly targets (sessions + load)
- Technique/position focus by week
- Checkpoints every 4 weeks

---

## API (v1)
### Sessions & reports
- `POST /v1/sessions`
- `GET /v1/sessions?from&to&cursor`
- `POST /v1/sessions/{id}/rounds`
- `GET /v1/reports/weekly?week_start=YYYY-MM-DD`
- `GET /v1/reports/monthly?month=YYYY-MM`

### Supporting resources
- `POST /v1/techniques`
- `POST /v1/partners`
- `PATCH /v1/partners/{id}`
- `POST /v1/exports`
- `GET /v1/exports/{id}`
- `POST /v1/imports/sessions`

### Sync
- `POST /v1/sync/push`
- `GET /v1/sync/pull?since=cursor`

---

## Offline-first Design
- PWA + Service Worker for caching and app-shell behavior.
- IndexedDB for local structured data and outbox queue.
- Sync queue model with batched push/pull.
- Conflict policy:
  - Default: last-write-wins (`server_updated_at`, `device_id`).
  - Important records: “needs review” merge UI.

---

## Security & Privacy Baseline
- HTTPS-only transport.
- OIDC/OAuth2 with PKCE for browser auth.
- Object-level authorization on every resource.
- Partner pseudonymization by default.
- Minimal telemetry and explicit consent for non-essential analytics.
- Data export + account deletion support to meet GDPR-like expectations.

---

## Delivery Roadmap (2-week sprints)
1. **Sprint 0:** PRD finalization, schema, wireframes, threat model.
2. **Sprint 1:** Auth + PWA shell.
3. **Sprint 2:** Session logging MVP + partner pseudonyms.
4. **Sprint 3:** Offline sync and conflict handling.
5. **Sprint 4:** Weekly/monthly dashboards.
6. **Sprint 5:** Export/import + privacy controls.
7. **Sprint 6:** Hardening, observability, beta.

---

## Success Metrics
- D7/D30 retention
- % users logging >=70% of sessions
- Median session logging time (<120 seconds target)
- Weekly review completion rate
- Export usage and share-link usage
- Churn reason distribution (effort, forgetfulness, privacy concerns)

---

## Suggested Stack
- **Frontend:** React + TypeScript PWA
- **Local store:** IndexedDB
- **Backend:** Node.js (Fastify/NestJS) or Go
- **DB:** PostgreSQL + JSONB
- **Auth:** Managed OIDC provider with PKCE
- **Infra:** Managed Postgres, object storage for exports, CDN
- **Observability:** logs + metrics + traces (privacy-safe)
