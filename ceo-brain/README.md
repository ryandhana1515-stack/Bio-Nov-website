# CEO Brain — Phase 1: AI Lead & Sales Agent

A separate module inside this repo (not the BIO N:OV marketing site) — the
foundation of a platform for qualifying inbound leads with AI and,
eventually, running the rest of a business's sales/ops workflow. Built to
stand alone and move to its own repository later without any rework.

## What is already working

Nothing in this module is deployed yet — n8n access needs reauthorizing in
the session that builds it (see **How n8n is connected**, below). Everything
listed under **What was created** is designed, written, and ready to deploy
as soon as that happens; none of it has been claimed as "working" without
being run.

Separately, and unrelated to this module: this n8n account already runs a
working multi-agent system for the Bio Green Elixirs / BIO N:OV business
(WhatsApp support agent, content/ads/research agents, a manager
orchestrator, CRM data tables). Phase 1 reuses that account's proven
patterns — n8n's built-in Claude credit model, AI Agent + Structured Output
Parser, Data Table persistence — rather than inventing new ones.

## What was created

| File | Purpose |
|---|---|
| `agents/sales-qualification-agent.md` | The agent's system prompt, the 13 things it tries to learn, lead status meanings, and the human-review boundary |
| `schemas/lead-analysis.schema.json` | The exact structured output contract the agent must return |
| `workflows/phase1-lead-sales-agent.md` | Node-by-node n8n workflow blueprint, including how it runs in mock mode with zero extra credentials |
| `database/schema.sql` | Full Postgres/Supabase schema for `companies`, `contacts`, `leads`, `conversations`, `messages`, `opportunities`, `tasks`, `agent_runs`, `workflow_runs`, `audit_logs` — the Phase 2 production data layer |
| `tests/mock-lead-john-tan.md` | The test lead from the brief, with a reasoned example of what the agent should output |
| `ENV_VARIABLES.md` | Every environment variable Phase 2 will need, names only, no values |

## How to run it

Phase 1 needs no local setup — there's no separate Node app to `npm install`
and run. The "runtime" is an n8n workflow. Once deployed (see next section):

1. Send a lead to the webhook, or trigger the workflow manually with the
   payload in `tests/mock-lead-john-tan.md`.
2. The workflow normalizes it, runs the Sales Qualification Agent, saves the
   lead, logs the agent run, and either replies directly or flags it for
   human review — see `workflows/phase1-lead-sales-agent.md` for the full
   flow.

## How to test it

Use `tests/mock-lead-john-tan.md` as the standard smoke test: send its input
JSON to the deployed webhook and compare the real output's `lead_status`,
`missing_information`, and `human_review_required` against the reasoned
example in that file. Add new mock leads the same way to cover other cases —
especially one that should trip `human_review_required: true` (e.g. a
prospect asking for a firm price or offering to pay now).

## What credentials are still missing

**None are required to deploy and test Phase 1.** The one blocker is access,
not a credential:

- **n8n** needs reauthorizing for this session (Settings → Connectors → n8n
  on claude.ai, or the connector toggle in this chat). Once it's on, the
  blueprint in `workflows/phase1-lead-sales-agent.md` gets compiled,
  validated, deployed and tested against the mock lead in the same session.

Everything under Phase 2 in `ENV_VARIABLES.md` (Supabase, Facebook,
WhatsApp) is genuinely optional until you choose to connect it — Phase 1
runs without any of it.

## How n8n is connected

This account's n8n instance is reached through an MCP connector in Claude,
the same one used to build every other agent already running for the Bio
Green Elixirs business. No separate n8n API key or self-hosted setup is
needed — the connector handles authentication once it's toggled on for the
session.

## What Phase 2 will add

Not built now, on purpose — see the brief this module was built from for
the full list. In priority order once Phase 1 is proven:

1. Wire a real channel in (WhatsApp is the fastest, since this account
   already has a working adapter pattern to copy).
2. Swap n8n Data Tables for `database/schema.sql` on Supabase, so multiple
   client companies can run on this platform with real data isolation
   (`account_id` on every table, Row Level Security policies).
3. Add the next agent in the roster (Proposal Agent is the natural next
   step after Sales Qualification).
4. Calendar, tasks, and proposal generation — each gated by the same
   human-review boundary for anything irreversible.

Do not start Phase 2 until Phase 1 has been deployed and run against real
leads.
