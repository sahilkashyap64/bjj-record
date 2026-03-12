# BJJ Record Tracker

A privacy-first, offline-capable Progressive Web App (PWA) for Brazilian jiu-jitsu practitioners to track sessions, techniques, KPIs, and training load.

## Features

✅ **Quick Session Logging** (~2 minutes per session)
✅ **Offline-First UX** - Works without internet
✅ **Privacy by Default** - Partner pseudonyms, minimal telemetry
✅ **KPI Tracking** - Escape rate, guard pass defense, submission finish rate, sRPE load
✅ **Weekly/Monthly Dashboards** - Trend analysis and progress visualization
✅ **Sync Enabled** - Automatic conflict resolution with last-write-wins
✅ **PWA Support** - Install on home screen, works offline
✅ **Data Portability** - Export/import JSON (coming soon)

## Tech Stack

### Frontend
- React 18 + TypeScript
- Zustand (state management)
- Vite (build tool)
- IndexedDB (offline storage)
- Service Worker (PWA)
- Axios (HTTP client)
- Chart.js (analytics visualization)

### Backend
- NestJS (TypeScript framework)
- TypeORM (database ORM)
- PostgreSQL (relational database)
- JWT authentication
- Docker & Docker Compose

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Docker)
- Yarn package manager

### Installation

```bash
# Clone repository
git clone https://github.com/sahilkashyap64/bjj-record.git
cd bjj-record

# Install dependencies
yarn install

# Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Setup database
createdb bjj_record
psql -U postgres -d bjj_record -f backend/src/database/migrations/001_initial_schema.sql

# Start development servers
yarn dev
```

**Frontend:** http://localhost:5173
**Backend:** http://localhost:3000

### Docker Compose (Alternative)

```bash
docker-compose up -d
```

## Project Structure

```
bjj-record/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── entities/       # TypeORM database entities
│   │   ├── modules/        # Feature modules (auth, sessions, partners, etc.)
│   │   ├── database/       # Migrations
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/               # React PWA application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API client, IndexedDB service
│   │   ├── store/          # Zustand state management
│   │   ├── types/          # TypeScript type definitions
│   │   ├── hooks/          # Custom React hooks
│   │   └── main.tsx
│   ├── public/             # Static assets & Service Worker
│   └── package.json
├── docs/
│   ├── product-brief.md    # Product specification
│   ├── api/API.md          # API reference
│   └── architecture/       # Technical architecture
├── docker-compose.yml      # Multi-container setup
├── Dockerfile              # Production image
└── SETUP.md                # Detailed setup guide
```

## API Overview

### Authentication
- `POST /v1/auth/login` - Login/Register with email
- `GET /v1/auth/me` - Get current user

### Core Resources
- **Sessions:** `GET /v1/sessions`, `POST /v1/sessions`
- **Rounds:** Nested under sessions
- **Partners:** `GET /v1/partners`, `POST /v1/partners`
- **Techniques:** `GET /v1/techniques`, `POST /v1/techniques`
- **Injuries:** `GET /v1/injuries`, `POST /v1/injuries`

### Analytics & Reports
- `GET /v1/reports/weekly?week_start=YYYY-MM-DD`
- `GET /v1/reports/monthly?month=YYYY-MM`

### Sync (Offline)
- `POST /v1/sync/push` - Push offline changes
- `GET /v1/sync/pull` - Pull server changes

See [API.md](docs/api/API.md) for complete endpoint documentation.

## Data Model

### Core Entities
- **Users** - Account holders
- **Session Logs** - Individual training sessions
- **Rounds** - Sparring rounds within a session
- **Round Actions** - Specific events (escapes, passes, submissions)
- **Partners** - Training partners (pseudonymized by default)
- **Techniques** - Moves and positions
- **Injuries** - Injury tracking and recovery

## KPI Definitions

- **Escape Rate** = `successful_escapes / escape_attempts`
- **Guard Pass Defense Rate** = `stopped_passes / pass_attempts_against`
- **Submission Finish Rate** = `submission_finishes / submission_attempts`
- **sRPE Load (session)** = `duration_min × sRPE`
- **sRPE Load (week/month)** = sum of session loads

## Offline-First Architecture

The app works seamlessly offline:

1. **Local Storage:** IndexedDB stores sessions, rounds, and partners
2. **Sync Queue:** Changes queue automatically when offline
3. **Service Worker:** Caches critical assets for app-shell model
4. **Smart Sync:** Auto-syncs when connection returns (last-write-wins conflict strategy)

## Privacy & Security

- ✅ **HTTPS-only** transport
- ✅ **Partner pseudonyms** by default
- ✅ **Minimal telemetry** - no third-party tracking
- ✅ **JWT authentication** with PKCE-ready design
- ✅ **Object-level authorization** on every API call
- ✅ **Data export** for portability (GDPR-compliant)
- ✅ **Account deletion** support

## Development

### Running Tests

```bash
# Backend tests
yarn workspace backend test

# Frontend tests
yarn workspace frontend test
```

### Building for Production

```bash
# Build all packages
yarn build

# Docker build
docker build -t bjj-record:latest .
```

### Code Style

- TypeScript strict mode enabled
- ESLint configured for both frontend and backend
- Prettier for code formatting

```bash
yarn lint          # Run linting
yarn format        # Format code
```

## Deployment

### Heroku/Railway/Render

```bash
# Set environment variables
DATABASE_URL=postgres://...
JWT_SECRET=...

# Deploy backend
git push heroku main

# Frontend can be deployed to Vercel/Netlify
```

### Docker

```bash
docker build -t bjj-record:latest .
docker run -e DATABASE_URL=... -p 3000:3000 bjj-record:latest
```

## Roadmap

### Sprint 0-2 (MVP)
- ✅ Project setup & database schema
- ⏳ Auth + PWA shell
- ⏳ Session logging + partner pseudonyms
- ⏳ Offline sync

### Sprint 3-4
- Weekly/monthly dashboards
- KPI calculations
- Export/import support

### Phase 2 (Post-MVP)
- Coach sharing & cohort views
- 12-week plan builder
- Custom KPI builder
- Mobile apps (React Native)

## Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check [docs/product-brief.md](docs/product-brief.md) for product details
- See [SETUP.md](SETUP.md) for troubleshooting

## Acknowledgments

Built for the Brazilian jiu-jitsu community with a focus on privacy, offline-first design, and data portability.

---

**Status:** 🚀 In Active Development (MVP Phase)
