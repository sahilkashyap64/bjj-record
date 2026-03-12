# Project Setup Guide

## Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

## Quick Start (Local Development)

### 1. Clone & Install
```bash
# Install root dependencies
yarn install

# This will install both backend and frontend due to workspaces
```

### 2. Setup Environment

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env

# Configure these:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bjj_record
JWT_SECRET=your-secret-key-here
```

**Frontend** (`frontend/.env`):
```bash
cp frontend/.env.example frontend/.env
VITE_API_URL=http://localhost:3000
```

### 3. Database Setup

Create the database:
```bash
createdb bjj_record
```

Run migrations:
```bash
psql -U postgres -d bjj_record -f backend/src/database/migrations/001_initial_schema.sql
```

### 4. Start Development Servers

```bash
# From root directory - starts both backend and frontend
yarn dev

# Or individually:
# Backend: yarn workspace backend dev  (runs on :3000)
# Frontend: yarn workspace frontend dev (runs on :5173)
```

## Docker Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Project Structure

```
bjj-record/
├── backend/               # NestJS API
│   ├── src/
│   │   ├── entities/     # TypeORM entities
│   │   ├── modules/      # Feature modules
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── package.json
├── frontend/             # React PWA
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API & IDB clients
│   │   ├── store/        # Zustand stores
│   │   └── main.tsx
│   └── public/           # Static assets & SW
└── docs/                 # Documentation
```

## API Endpoints

All endpoints require Bearer token authentication.

### Auth
- `POST /v1/auth/login` - Login/Register
- `GET /v1/auth/me` - Get current user

### Sessions
- `POST /v1/sessions` - Create session
- `GET /v1/sessions` - List sessions
- `GET /v1/sessions/:id` - Get session
- `PUT /v1/sessions/:id` - Update session
- `DELETE /v1/sessions/:id` - Delete session

### Partners
- `POST /v1/partners` - Create partner
- `GET /v1/partners` - List partners
- `PATCH /v1/partners/:id` - Update partner

### Techniques
- `POST /v1/techniques` - Create technique
- `GET /v1/techniques` - List techniques

### Injuries
- `POST /v1/injuries` - Log injury
- `GET /v1/injuries` - List injuries
- `PATCH /v1/injuries/:id` - Update injury

### Reports
- `GET /v1/reports/weekly?week_start=YYYY-MM-DD` - Weekly report
- `GET /v1/reports/monthly?month=YYYY-MM` - Monthly report

### Sync
- `POST /v1/sync/push` - Push offline changes
- `GET /v1/sync/pull?since=cursor` - Pull server changes

## Testing

```bash
# Backend tests
yarn workspace backend test

# Frontend tests
yarn workspace frontend test
```

## Building for Production

```bash
# Build both packages
yarn build

# Backend: Creates dist/
# Frontend: Creates dist/

# Docker build
docker build -t bjj-record:latest .
```

## Environment Variables

### Backend (backend/.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bjj_record
JWT_SECRET=change-me-in-production
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (frontend/.env)
```
VITE_API_URL=http://localhost:3000
```

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DB_HOST`, `DB_PORT`, credentials in `.env`
- Verify database exists: `psql -l | grep bjj_record`

### CORS Errors
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Default: `http://localhost:5173`

### Service Worker Issues
- Clear browser cache: DevTools → Application → Storage → Clear site data
- Check `/public/sw.ts` is being served correctly

## Next Steps

1. **Expand Schema:** Add fitness tests, plans, export jobs
2. **UI Enhancements:** Build rounds editor, technique selector
3. **Offline Sync:** Implement full conflict resolution UI
4. **Analytics:** Add KPI trend charts, export to CSV/JSON
5. **Coach Tools:** Build student cohort views, sharing

See [product-brief.md](./docs/product-brief.md) for full product specification.
