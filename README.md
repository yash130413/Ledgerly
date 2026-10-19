<div align="center">

# Ledgerly

**Enterprise-Grade AI Spend Audit, FinOps & Optimization Platform**

Identify wasted AI software spend, underutilized subscriptions, duplicate tooling, and seat inefficiencies — across ChatGPT, Claude, Cursor, GitHub Copilot, and Gemini.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tests](https://img.shields.io/badge/Vitest-40%2F40%20Passing-green?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](./LICENSE)

[GitHub Repository](https://github.com/yash130413/Ledgerly) · [Live Frontend (Vercel)](https://ledgerly.vercel.app) · [Backend API (Render)](https://ledgerly-api.onrender.com)

</div>

---

## 🚀 Overview

As generative AI tools scale across modern engineering and enterprise teams, subscriptions and API costs often spiral out of control with zero centralized visibility.

**Ledgerly** acts as a specialized AI FinOps copilot. It audits subscription footprints, models real-world usage distributions, surfaces duplicate and ghost licenses, and delivers high-confidence, actionable recommendations that finance and engineering leadership can execute in minutes.

The platform includes:
1. **Free Public Audit (Zero-Friction):** Instant, non-intrusive self-serve assessment with shareable executive reports.
2. **Authenticated SaaS Dashboard:** Centralized workspace for tracking historical audits, monitoring organization-wide spend, and tracking optimization milestones over time.
3. **Advanced FinOps Engine:** 4-tier user segmentation, intelligent LLM model routing, effort/impact prioritization scoring, and industry peer benchmarking.

---

## ⚡ Key Production Features

### 1. 4-Tier User Segmentation Model
Unlike naive active/inactive binary audits, Ledgerly's engine segments total seat footprints into 4 behavioral tiers:
* 🧟 **Zombie Users (60+ days zero activity):** Ghost accounts and abandoned seats flagged for immediate zero-risk license de-provisioning.
* 🏃 **Casual Users (<5 prompts/week):** Users on expensive plans downgraded to lighter/free tiers.
* 👥 **Regular Users (5–30 prompts/week):** Balanced workload matching standard plan tiers.
* ⚡ **Power Users (30+ prompts/week):** Heavy adopters justified for premium copilot access.

### 2. 🧠 Smart Model Routing Recommendation Engine
Analyzes API consumption patterns beyond seat waste:
* Dynamically detects high API spend (`>$500/mo`) running exclusively on flagship models (`GPT-4o`, `Claude 3.5 Sonnet`, `Gemini 1.5 Pro`).
* Recommends lightweight routing (`GPT-4o-mini`, `Claude 3.5 Haiku`, `Gemini 1.5 Flash`) for routine queries (summarization, extraction, classification), unlocking up to **80% savings on simple queries (~48% net API reduction)** without quality degradation.

### 3. 🎯 Effort vs. Impact Prioritization Matrix
Every generated recommendation is tagged with tangible execution metadata for CFOs and Engineering Leads:
* **Effort Level:** `Trivial` (5 min), `Low` (15 min), `Medium` (1–2 hrs), `High` (2+ hrs).
* **Direct Ownership:** Designated action owners (`IT Admin`, `Finance`, `Engineering Lead`, `CTO`).
* **ROI Score:** `$ Annual Savings / Hour of Effort` ratio, giving teams instant guidance on what to execute first.

### 4. 📊 Industry Peer Benchmarking
Directly contextualizes spend against real-world startup & enterprise cohorts:
* **Cohorts:** `1–10 members ($20/dev/mo)`, `11–50 devs ($28/dev/mo)`, `51–200 devs ($35/dev/mo)`, `200+ enterprise ($42/dev/mo)`.
* Provides comparative metrics, spend-per-developer indicators, and executive urgency tags (`+50% Above Peer Benchmark`).

### 5. 🛡️ Multi-Provider Coverage & Redundancy Detection
* Cross-tool stack overlaps (e.g., dual subscriptions for both **Cursor** and **GitHub Copilot**, or **ChatGPT Plus** and **Claude Pro**).
* Annual commitment vs. month-to-month license waste.
* Plan right-sizing (Enterprise / Team / Pro / Plus).

---

## 🏗️ Monorepo Architecture

Ledgerly is structured as a modern, decoupled monorepo:

```
credex-app/
├── apps/
│   ├── web/                     # Next.js 16 (App Router, React 19, Tailwind CSS v4, Framer Motion)
│   ├── api/                     # NestJS 11 (Modular DDD, Supabase Service, Auth Guards, BFF endpoints)
│   └── worker/                  # Background worker queue shell for scheduled sync jobs
├── packages/
│   └── audit-engine/            # Pure TypeScript deterministic FinOps audit engine & rule registry
├── docs/                        # Architecture & ADR documentation
├── vercel.json                  # Monorepo build and routing configuration for Vercel
└── package.json                 # Monorepo npm workspaces configuration
```

### Data & Execution Flow
```mermaid
graph TD
    A[Browser / Client] -->|HTTPS| B[Next.js 16 Web App]
    B -->|BFF API Proxy| C[NestJS 11 Backend API]
    B -->|Shared Engine| D[@ledgerly/audit-engine]
    C -->|Rule Evaluation| D
    C -->|PostgreSQL + RLS| E[(Supabase Database)]
    C -->|Transactional Mail| F[Resend API]
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (Turbopack, App Router, React 19) |
| **Backend Framework** | [NestJS 11](https://nestjs.com/) (TypeScript, Express platform, Modular Architecture) |
| **Styling & Components** | [Tailwind CSS v4](https://tailwindcss.com/), Radix UI, shadcn/ui |
| **Animations & Visuals** | [Framer Motion](https://www.framer.com/motion/), [Recharts](https://recharts.org/) |
| **Core Audit Engine** | Decoupled TypeScript package (`@ledgerly/audit-engine`) |
| **Database & Security** | [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security) |
| **Authentication** | JWT Auth with HTTP-only secure cookie sessions |
| **Emails** | [Resend](https://resend.com/) + React Email |
| **Testing** | [Vitest](https://vitest.dev/) (40 Unit Tests covering all rules & benchmarking) |
| **Deployment** | Vercel (Frontend) & Render (Backend API) |

---

## 🚦 Getting Started Locally

### Prerequisites
* Node.js 20+ (Node 22+ recommended)
* npm 9+

### 1. Clone & Install
```bash
git clone https://github.com/yash130413/Ledgerly.git
cd Ledgerly
npm install
```

### 2. Environment Variables
Copy `.env.local.example` to `.env.local` in the project root:
```bash
cp .env.local.example .env.local
```
Fill in your Supabase project credentials and JWT secret.

### 3. Run Development Servers
You can run both web and API concurrently from the root:
```bash
# Run web and backend API together:
npm run dev

# Or run individually:
npm run dev:web  # Next.js on http://localhost:3000
npm run dev:api  # NestJS API on http://localhost:3001
```

### 4. Running Tests
Run the deterministic engine test suite:
```bash
# Run all tests (40 tests across engine & enricher)
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🧪 Testing & Quality Assurance

Ledgerly enforces comprehensive test coverage across all financial calculations and decision rules in `packages/audit-engine`:
* ✅ Savings accuracy (Monthly, Annualized, ROI ratio)
* ✅ Zombie user detection & immediate license reclaims
* ✅ Casual user plan downgrades
* ✅ Model tiering & token reduction triggers
* ✅ Industry peer benchmark cohort classification
* ✅ Provider-specific seat and cross-tool redundancy rules

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

---

## 👨‍💻 Author

**Yash Rohilla**  
* GitHub: [@yash130413](https://github.com/yash130413)  
* Project Repo: [https://github.com/yash130413/Ledgerly](https://github.com/yash130413/Ledgerly)
