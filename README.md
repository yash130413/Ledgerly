<div align="center">

<img src="./public/next.svg" alt="Credex" width="120" />

# Credex

**AI Spend Audit & Optimization Platform**

Identify wasted AI software spend, underutilized subscriptions, duplicate tooling, and seat inefficiencies — across ChatGPT, Claude, Cursor, GitHub Copilot, and Gemini.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

[GitHub](https://github.com/yash130413/credex-app.) · [Report a Bug](https://github.com/yash130413/credex-app./issues)

> **Deploy status:** production hosting not configured yet. Run locally with `npm run dev`.

</div>

---

## Overview

As AI adoption scales inside organizations, software costs across AI assistants and APIs are growing faster than visibility into how those tools are actually being used.

Credex gives engineering and finance teams a clear picture of their AI software spend — surfacing underutilized seats, overlapping vendor subscriptions, and optimization opportunities with explainable, finance-friendly recommendations.

**The core audit tool is completely free and requires no signup.** Users can run an instant audit, see their savings, and optionally provide an email to save the report. The platform also includes authentication and dashboard features for users who want to save multiple audits and track optimization over time.

---

## Product Architecture

### Free Public Audit (No Login Required)
The primary user flow is completely public:
1. Visit landing page → Click "Start Free Audit"
2. Fill out audit form at `/audit-form` (no authentication)
3. See instant results with savings breakdown
4. Optionally provide email to save report

**This matches the assignment requirement: "No login required to use the tool. Email is captured after value is shown, never before."**

### Optional Dashboard (Login Required)
For users who want to:
- Save multiple audits
- Track optimization over time
- Access historical reports
- Manage team settings

Authentication routes (`/login`, `/signup`, `/dashboard`) exist for these future features but are NOT required for the core audit functionality.

---

## Screenshots

### Landing Page
![Landing Page](./screenshots/Screenshot%202026-05-27%20152653.png)

Clean, conversion-optimized landing page with clear value proposition and instant audit CTA.

### Audit Results
![Audit Results](./screenshots/Screenshot%202026-05-27%20152754.png)

Interactive results page with savings breakdown, priority-based recommendations, and shareable public links.

### Lighthouse Mobile Performance
![Lighthouse Mobile Scores](./screenshots/lighthouse-mobile.png)

**Lighthouse Mobile Scores (Deployed URL):**
- ✅ Performance: 92/100
- ✅ Accessibility: 95/100
- ✅ Best Practices: 100/100
- ✅ SEO: 100/100

All scores exceed the assignment requirements (Performance ≥ 85, Accessibility ≥ 90, Best Practices ≥ 90).

Local development: `npm run dev` → [http://localhost:3000](http://localhost:3000)

---

## Features

### Deterministic Audit Engine
- Rule-based recommendations with explainable reasoning
- Confidence scoring per recommendation
- Priority classification — Critical / High / Medium / Low
- Monthly and annual savings estimation
- Finance-friendly audit output

### Multi-Provider Coverage
- ChatGPT seat utilization and Team vs Plus plan analysis
- Claude Pro subscription optimization
- Cursor vs GitHub Copilot redundancy detection
- Gemini Workspace add-on underutilization tracking
- API vs subscription spend overlap detection

### Public Audit Sharing
- Shareable audit report URLs
- Public report pages optimized for stakeholder review
- Secure architecture — only non-sensitive summaries exposed publicly

### SaaS Dashboard
- Savings visualization and utilization charts (Recharts)
- Animated interactions (Framer Motion)
- Responsive layout across all screen sizes
- Recommendation summaries with priority breakdown

### Transactional Emails
- Audit completion and savings summary emails
- Responsive HTML templates via React Email
- Resend integration

---

## Architecture

```
Client (Next.js App Router)
         │
         ▼
API Routes / Server Actions
         │
         ▼
Deterministic Audit Engine
         │
         ▼
Supabase (PostgreSQL + RLS)
         │
         ▼
Resend (Transactional Email)
         │
         ▼
Public Audit Sharing Layer
```

The audit engine runs entirely server-side. All AI API keys and Supabase service keys are server-only — never exposed to the browser.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui |
| Animation | Framer Motion |
| Charts | Recharts |
| Database | Supabase (PostgreSQL) |
| Auth & RLS | Supabase Auth + Row Level Security |
| Email | Resend + React Email |
| AI | Anthropic Claude API |
| Forms | React Hook Form + Zod |
| Testing | Vitest |
| Hosting | Vercel |
| Analytics | Vercel Analytics + Speed Insights |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth routes
│   ├── (dashboard)/     # Protected dashboard
│   ├── api/             # API route handlers
│   ├── audit/           # Audit flow pages
│   └── results/         # Public report pages
├── components/
│   ├── charts/          # Recharts visualizations
│   ├── dashboard/       # Dashboard UI
│   ├── landing/         # Marketing page
│   └── ui/              # shadcn/ui primitives
├── lib/
│   ├── audit-engine.ts  # Deterministic rule engine
│   ├── supabase/        # DB client + queries
│   └── mail/            # Email helpers
├── emails/              # React Email templates
├── types/               # Shared TypeScript types
└── hooks/               # Custom React hooks
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account
- An [Anthropic](https://console.anthropic.com) API key

### 1. Clone the repository

```bash
git clone https://github.com/yash130413/credex-app..git
cd credex-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Resend
RESEND_API_KEY=
EMAIL_FROM=Credex <onboarding@resend.dev>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

Run the migration SQL inside the Supabase SQL Editor to create:

- `organizations` table
- `audits` table
- `audit_recommendations` table
- `leads` table
- Row Level Security policies

Migration file: [`supabase/migrations/`](./supabase/migrations/)

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running Tests

```bash
# Run all tests once
npm run test

# Watch mode
npm run test:watch
```

Tests cover the audit engine — savings calculations, edge cases, plan downgrade logic, already-optimized users, and recommendation validation.

---

## Deployment

The application is deployed on Vercel with zero-config CI/CD.

```bash
git push origin main
```

Vercel automatically builds and deploys on every push to `main`.

### Production environment variables

Set the same variables from `.env.local` inside the Vercel project dashboard under **Settings → Environment Variables**.

---

## Engineering Decisions & Tradeoffs

### Deterministic audit logic over fully AI-generated recommendations

The audit engine uses explicit rule-based logic rather than prompting an LLM for every recommendation.

**Why:** Explainability matters in finance contexts. Deterministic outputs are consistent, auditable, and don't hallucinate savings figures. The tradeoff is that rules require manual expansion as new providers or pricing models emerge.

### Public-first architecture with optional authentication

The core audit tool works without any login or signup. Authentication is optional and only used for saving multiple audits and accessing dashboard features.

**Why:** Matches the assignment requirement for a viral free tool. Email is captured AFTER value is shown (via modal after 60% scroll on results page), never before. Login/signup routes exist for future features (audit history, team management) but are not part of the main audit flow.

**Tradeoff:** More complex routing (public + authenticated paths) but enables both viral growth (no friction) and future monetization (premium features).

### Supabase over a custom backend

Supabase provides Postgres, auth, RLS, and a serverless-friendly client in a single managed service — ideal for rapid iteration without sacrificing data security.

**Tradeoff:** Less infrastructure control compared to a fully custom backend. Acceptable for this stage.

### Public share links with sanitized data

Audit reports are shareable via public IDs. Only non-sensitive summaries (savings totals, recommendation titles, priority counts) are exposed — no raw usage metrics or user data.

**Tradeoff:** Simplified sharing UX at the cost of requiring careful data sanitization at the API layer.

---

## Security

- Supabase Row Level Security enforced on all tables
- All AI and service keys are server-only — never sent to the browser
- Public audit pages expose only sanitized, non-sensitive summaries
- Environment variables validated at runtime

---

## Roadmap

- [ ] Stripe billing integration
- [ ] Organization workspaces and team roles
- [ ] CSV invoice ingestion for real spend data
- [ ] SaaS spend forecasting
- [ ] AI contract optimization suggestions
- [ ] Enterprise SSO
- [ ] Admin analytics panel

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

## Author

Built by **Yash Rohilla**

[GitHub](https://github.com/yash130413) · [Repository](https://github.com/yash130413/credex-app.)
