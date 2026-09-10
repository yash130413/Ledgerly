-- Store original workspace inputs so dashboard can rebuild charts without mocks
alter table public.audits
  add column if not exists workspaces jsonb;

comment on column public.audits.workspaces is 'WorkspaceMetrics[] used to generate this audit';
