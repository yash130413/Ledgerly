-- Persist settings for JWT app users
alter table public.app_users
  add column if not exists preferences jsonb not null default '{}'::jsonb;

comment on column public.app_users.preferences is 'User UI/security preferences (theme, alerts, etc.)';
