# BJJ Record Tracker - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                 Browser (PWA)                        │
│  React + TypeScript + IndexedDB + Service Worker    │
└──────────┬──────────────────────────────────────┬────┘
           │                                      │
           │ HTTPS (REST API)                     │ Offline
           │ + JWT Auth                           │ + IndexedDB
           │                                      │
┌──────────▼──────────────────────────────────────▼────┐
│            NestJS backend (Node.js)                   │
│  ├─ Auth Module (JWT/PKCE)                           │
│  ├─ Sessions Module                                  │
│  ├─ Partners Module                                  │
│  ├─ Techniques Module                                │
│  ├─ Reports Module (KPI analytics)                   │
│  ├─ Sync Module (pull/push)                          │
│  └─ Injuries Module                                  │
└──────────┬──────────────────────────────────────────────┘
           │
           │ SQL Queries + TypeORM
           │
┌──────────▼──────────────────────────────────────────────┐
│              PostgreSQL Database                        │
│  ├─ users                                              │
│  ├─ session_logs (+ JSONB metadata)                    │
│  ├─ rounds                                             │
│  ├─ round_actions                                      │
│  ├─ partners                                           │
│  ├─ techniques                                         │
│  └─ injuries                                           │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

### Session Logging (Online/Offline)

```
User Action
    ↓
Write to IndexedDB
    ↓
(Online?)
├─ YES → API POST /v1/sessions → Update sync_status
└─ NO  → Queue in syncQueue → User sees "pending"

Background Sync
├─ Detect online
├─ GET /v1/sync/pull (fetch updates)
├─ POST /v1/sync/push (send queued changes)
└─ Resolve conflicts (last-write-wins or manual review)
```

### KPI Calculation

```
Session + Rounds + Round Actions
    ↓
Service calculates KPIs:
├─ Escape Rate = successful_escapes / escape_attempts
├─ Guard Pass Defense = stopped_passes / pass_attempts
├─ Submission Finish = finishes / attempts
└─ sRPE Load = duration_min * sRPE
    ↓
Weekly/Monthly aggregation
    ↓
Dashboard display
```

## Key Technologies

### Backend
- **Runtime:** Node.js 20
- **Framework:** NestJS (TypeScript)
- **ORM:** TypeORM with PostgreSQL
- **Auth:** JWT + Passport
- **Validation:** class-validator
- **Database:** PostgreSQL 14+ with JSONB

### Frontend
- **Framework:** React 18 + TypeScript
- **State:** Zustand
- **Routing:** React Router v6
- **Local Storage:** IndexedDB with idb library
- **HTTP Client:** Axios
- **Build:** Vite
- **Charts:** Chart.js + react-chartjs-2
- **PWA:** Service Worker + Web App Manifest

### Infrastructure
- **Docker:** Multi-stage builds
- **Compose:** Local dev + PostgreSQL
- **Deployment:** (TBD) Vercel/Netlify (frontend) + Railway/Render (backend)

## Authentication Flow

```
User Email
    ↓
POST /v1/auth/login (email + optional displayName)
    ↓
Server: Lookup or create user
    ↓
Generate JWT Token
    ↓
Client: Store token in localStorage
    ↓
All future requests include:
Authorization: Bearer <token>
```

**Note:** Current implementation uses simple email auth for MVP. Production should integrate OIDC/OAuth2 with PKCE.

## Offline-First Sync Strategy

### Conflict Resolution
**Default:** Last-write-wins
- Client stores `device_id` + `server_updated_at`
- On sync, server compares timestamps
- Later timestamp wins

**Edge Cases:** "Needs Review" UI for critical records

### Sync Queue
1. User creates session offline
2. IndexedDB stores session + adds to syncQueue
3. UI shows "pending" status
4. When online:
   - `GET /v1/sync/pull?since=last_cursor` → fetch server changes
   - `POST /v1/sync/push { changes: [...] }` → send queued items
   - Update local IndexedDB with server state
   - Clear syncQueue

## Privacy by Design

- **Partner Pseudonym:** Default, real name optional
- **Minimal Telemetry:** No third-party analytics by default
- **Data Export:** Easy CSV/JSON export (Sprint 5)
- **Account Deletion:** One-click data wipe
- **Consent Model:** Explicit opt-in for non-essential features
- **HTTPS-Only:** No unencrypted transport

## Performance Targets

- Session logging: **< 120 seconds**
- App shell load (offline): **< 1s**
- Weekly report generation: **< 500ms**
- Sync operation: **< 2-5s** (batched)
- PWA install: Prompted on 2nd visit

## Monitoring & Observability

- Server logs (stdout → structured JSON)
- Request metrics (response time, status codes)
- Sync success/failure rates
- Session logging completion rates
- Privacy: No PII in logs; use user IDs

## Future Enhancements

1. **Coach Dashboard:** Aggregate student trends (with consent)
2. **12-Week Plans:** Template-driven training cycles
3. **Custom KPIs:** User-defined calculation formulas
4. **Local-Only Mode:** Never sync certain data
5. **Mobile Apps:** React Native or PWA standalone
6. **AI Insights:** Pattern detection, rep suggestions
