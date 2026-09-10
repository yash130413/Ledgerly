# NestJS domain modules

Runtime modules (DDD):

```
modules/<name>/
├── domain/
├── application/services|use-cases|dto|...
├── infrastructure/persistence|...
├── presentation/http/controllers|dto|...
└── <name>.module.ts
```

Live: `audits`, `leads`, `organizations`, `memberships`, `integrations`, `billing`.  
Scaffolded (empty): `auth`, `users`, `recommendations`, `documents`, `notifications`, `audit-log`, `admin`.
