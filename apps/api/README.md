# @ledgerly/api (NestJS)

Production-grade modular backend API for **Ledgerly** AI Spend Audit & Optimization.

---

## 🏛️ Architecture Overview

The backend is built with **NestJS 11** following Domain-Driven Design (DDD) principles:

```
src/
├── common/              # Global filters, interceptors, and guards
├── config/              # Centralized environment and configuration validation
├── health/              # Liveness and readiness health checks (/api/health)
├── infra/               # External service adapters (Supabase Admin, Resend mailer)
├── modules/
│   ├── auth/            # JWT authentication, login, signup, session verification
│   ├── audits/          # Audit creation, deterministic engine runs, persistence
│   ├── organizations/   # Multi-tenant organization boundaries and seat scopes
│   ├── recommendations/ # Recommendation state management, ROI tracking
│   ├── integrations/    # Provider credentials and connection manager
│   ├── billing/         # Plan limits and billing tier checks
│   └── users/           # User management, profile settings, and preferences
└── main.ts              # Application bootstrap, CORS, global prefix (/api)
```

---

## 🛠️ Local Development

From the repository root:
```bash
npm run dev:api
```

Or from inside `apps/api`:
```bash
# Watch mode
npm run start:dev

# Production build test
npm run build
npm run start:prod
```

Default local address: `http://localhost:3001/api`

---

## 🧪 Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e
```

---

## 🌐 Production Deployment (Render)

* **Build Command:** `npm install && npm run build:api` (from repo root)
* **Start Command:** `npm run start:api`
* **Port:** `10000` (Render default)
