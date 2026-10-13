-- Early-access waitlist table. Run in the Supabase SQL editor (or psql).
-- The API writes with the service-role key from the server only; no browser access is needed,
-- so row-level security stays enabled with no public policies.

create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  role        text,
  source      text not null default 'website',
  user_agent  text,
  created_at  timestamptz not null default now(),
  constraint waitlist_email_unique unique (email),
  constraint waitlist_role_check check (
    role is null or role in ('investor', 'founder', 'researcher_engineer', 'community_builder', 'other')
  )
);

alter table public.waitlist enable row level security;

comment on table public.waitlist is 'Early-access signups from the marketing site.';
