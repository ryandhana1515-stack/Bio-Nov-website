# Workflow blueprint — Phase 1 Lead & Sales Agent

Status: **designed, not yet deployed.** n8n access in this session requires
reauthorization (Settings → Connectors → n8n, or the sliders icon on the
message box → n8n → on). The moment it's back, this blueprint gets compiled
into a real workflow with `n8n_workflow_sdk`, validated, deployed and tested
end to end — the same way every other agent in this account was built. This
file is the exact spec for that, so nothing is guessed when it happens.

## Why n8n Data Tables, not Supabase, for Phase 1

`database/schema.sql` is the target production schema. It needs a Supabase
project and a `SUPABASE_DB_URL` — a credential that doesn't exist yet.
Rather than block Phase 1 on that, it runs on **n8n Data Tables** (already
proven, zero extra credentials, same pattern as every other agent here).
Two tables:

- **`CEO Brain Leads`** — columns: `date`, `source`, `company_name`,
  `contact_name`, `phone`, `email`, `original_message`, `status`,
  `problem`, `budget`, `timeline`, `lead_temperature`,
  `missing_information`, `human_review_required`, `next_action`,
  `recommended_reply`
- **`CEO Brain Agent Runs`** — columns: `date`, `lead_ref`, `agent_name`,
  `output`, `model`, `success`

When Supabase is connected, swap the Data Table nodes below for Postgres
nodes against `schema.sql` — the AI Agent step and its contract don't change.

## Node-by-node flow

```
1. Webhook Trigger          POST /ceo-brain/lead-in
   Accepts: { name, phone, email, company, industry, source, message,
              conversation_history? }
   This shape works for a real Facebook/Instagram/TikTok Lead Ad webhook
   payload once mapped, AND for a manual test call with the mock lead in
   ceo-brain/tests/mock-lead-john-tan.md — same node, no separate "test
   trigger" needed.

2. Normalize Lead (Set node)
   Defaults every field so a partial payload never breaks downstream nodes:
   name ?? "there", phone ?? "", email ?? "", company ?? "unknown",
   industry ?? "unknown", source ?? "manual", message ?? "".

3. Sales Qualification Agent (AI Agent node)
   System prompt: agents/sales-qualification-agent.md
   Output parser: schemas/lead-analysis.schema.json
   Model: n8n credit Claude (no API key needed)
   Input: the normalized lead fields + conversation_history if present.

4. Save Lead (Data Table upsert — "CEO Brain Leads")
   Match on phone+email (or a lead_id passed in conversation_history for a
   returning lead) so a follow-up message updates the same row instead of
   creating a duplicate.

5. Log Agent Run (Data Table insert — "CEO Brain Agent Runs")
   Records the full structured output for every call, success or failure —
   this is the agent_runs table from schema.sql, simplified for Data Tables.

6. Human Review? (IF node, on output.human_review_required)
   TRUE  -> Notify Human branch (see below) -> respond with a holding
            message, not recommended_reply, since a human must approve
            anything past this boundary.
   FALSE -> Respond with recommended_reply directly.

7. Notify Human (TRUE branch)
   Phase 1: log to the Decisions-style pattern already used elsewhere in
   this account (see docs/JARVIS_BUILD_BRIEF.md pattern if present, or a
   simple WhatsApp/email notify node) — deliberately left as a placeholder
   node here because it depends on which channel Ryan wants escalations on
   (WhatsApp to his own number is the obvious default, already proven
   elsewhere in this n8n instance).

8. Respond to Webhook
   Returns { lead_status, recommended_reply or holding_message,
   human_review_required } so the calling channel (WhatsApp adapter,
   website form, etc.) can act on it immediately.
```

## Mock mode (works today, no credentials needed beyond n8n itself)

Trigger step 1 manually with the payload in
`ceo-brain/tests/mock-lead-john-tan.md`. Every node from 2 onward runs
exactly as it would for a real Facebook/WhatsApp lead — "mock mode" here
just means the trigger is a manual test call instead of a live channel
webhook, not a separate code path. This is why the webhook accepts a plain
JSON body rather than a channel-specific payload shape.

## What this connects to later (Phase 2, not built now)

- Facebook/Instagram/TikTok Lead Ads → map their payload shape into the
  same Normalize Lead node.
- WhatsApp Business → this account already has a working WhatsApp adapter
  pattern (`WhatsApp Agent — Sandbox`); Phase 2 wires its inbound messages
  into this same lead pipeline instead of (or alongside) the customer
  support bot.
- Supabase → swap Data Table nodes for Postgres nodes against `schema.sql`.
- Calendar/tasks/proposals/payments → new nodes after step 8, gated by the
  same human-review boundary for anything irreversible.
