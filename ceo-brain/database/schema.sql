-- CEO Brain — Phase 1 database schema (Postgres / Supabase compatible)
--
-- Multi-tenant ready: every business table carries account_id so future
-- client companies never see each other's data. Phase 1 runs against a
-- single row in `accounts` (created below); nothing here depends on
-- Supabase being connected yet — see ceo-brain/README.md for how Phase 1
-- actually persists data (n8n Data Tables) until this schema is deployed.
--
-- Apply with: psql $SUPABASE_DB_URL -f ceo-brain/database/schema.sql
-- (or paste into the Supabase SQL editor).

create extension if not exists "pgcrypto";

create table accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table companies (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  name text not null,
  industry text,
  company_size text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  company_id uuid references companies(id),
  full_name text,
  email text,
  phone text,
  is_decision_maker boolean,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- lead_status enum kept as text (not a Postgres enum) so new statuses can be
-- added without a migration. Valid values enforced by the agent's schema,
-- not the database, in Phase 1.
create table leads (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  company_id uuid references companies(id),
  contact_id uuid references contacts(id),
  source text,                 -- facebook | instagram | tiktok | whatsapp | website | referral | manual
  original_message text,
  status text not null default 'NEW',
  problem text,
  current_tools text,
  desired_automation text,
  budget text,
  timeline text,
  lead_temperature text,       -- cold | warm | hot
  missing_information jsonb not null default '[]',
  human_review_required boolean not null default false,
  next_action text,
  follow_up_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Audit trail of status changes, separate from audit_logs (which covers
-- every entity) so the sales pipeline history is cheap to query on its own.
create table lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id),
  from_status text,
  to_status text not null,
  changed_by text not null,     -- 'agent:sales_qualification' | 'human:<email>'
  reason text,
  created_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  lead_id uuid references leads(id),
  channel text,                 -- whatsapp | facebook | instagram | tiktok | email | web_chat
  external_thread_id text,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id),
  direction text not null,      -- inbound | outbound
  sender text,                  -- 'lead' | 'agent:sales_qualification' | 'human:<email>'
  body text not null,
  created_at timestamptz not null default now()
);

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  lead_id uuid references leads(id),
  stage text not null default 'PROPOSAL_REQUIRED',
  estimated_value numeric,
  currency text default 'SGD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  lead_id uuid references leads(id),
  title text not null,
  due_at timestamptz,
  status text not null default 'OPEN',   -- OPEN | DONE | CANCELLED
  assigned_to text,
  created_at timestamptz not null default now()
);

-- One row per AI agent invocation. `output` holds the full structured JSON
-- the agent returned, for debugging and for training/eval later. Never
-- write secrets into `input_ref` or `output` — reference the lead/message
-- id instead of copying credentials or tokens into this table.
create table agent_runs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  agent_name text not null,      -- 'sales_qualification'
  lead_id uuid references leads(id),
  input_ref text,
  output jsonb,
  model text,
  success boolean not null,
  error text,
  workflow_run_id uuid,
  created_at timestamptz not null default now()
);

create table workflow_runs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  workflow_name text not null,   -- 'phase1_lead_sales_agent'
  n8n_execution_id text,
  status text not null,          -- success | error | running
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id),
  actor text not null,           -- 'agent:sales_qualification' | 'human:<email>' | 'system'
  action text not null,          -- 'lead.status_changed' | 'lead.created' | 'lead.human_review_flagged' | ...
  entity_type text not null,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create index leads_account_status_idx on leads (account_id, status);
create index leads_follow_up_idx on leads (account_id, follow_up_at) where follow_up_at is not null;
create index messages_conversation_idx on messages (conversation_id, created_at);
create index agent_runs_account_lead_idx on agent_runs (account_id, lead_id);
create index audit_logs_entity_idx on audit_logs (account_id, entity_type, entity_id);

-- Phase 2 (not applied now): enable Row Level Security and add a policy per
-- table scoping every read/write to auth.jwt() -> account_id, so one
-- client's Supabase queries can never return another client's rows.
