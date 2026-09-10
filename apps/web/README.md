# @ledgerly/web (Next.js)

Production UI for Ledgerly AI spend audit.

```
src/app/           # routes
src/components/    # UI (landing frozen)
src/features/      # feature shells — migrate into over time
src/lib/           # helpers + BFF proxy
src/modules/       # thin web adapters
```

```bash
npm run dev -w @ledgerly/web
```

Env is loaded from the **monorepo root** `.env.local` via `next.config.ts`.
