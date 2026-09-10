# Architecture

Credex = AI spend audit & optimization platform.

## Target system

```
Next.js (apps/web) → NestJS modular monolith (apps/api) → PostgreSQL
                              ↓
                    worker (apps/worker) ← Redis/BullMQ
```

## Domains

- audits / recommendations — core product
- organizations / memberships — multi-tenant
- integrations — provider connections / ingest
- leads — public funnel capture
- billing — Stripe (later)
- documents — CSV / invoices (later)
- notifications — email / in-app (later)
- auth / users / admin / audit-log — platform

ADRs go in `docs/adr/`.
