# BUILD BRIEF — Jarvis (Personal AI Manager)

Standing instruction for any Claude session with n8n access: when Ryan says
"build Jarvis" or "upgrade the AI Manager to Jarvis", execute this brief.
This upgrades the existing AI Manager (workflow `cVOaVg8smx6412Kq`) into a
personal assistant Ryan talks to directly — by WhatsApp and by voice — that
runs the company autonomously within a defined authority boundary.

## The core design decision: autonomy tiers

Jarvis is not "does anything without asking." It is "does everything
reversible without asking, and surfaces everything irreversible for a yes/no."
This is what makes it safe to actually leave alone. Encode this explicitly in
its system prompt — do not let it drift toward asking permission for
routine work or acting unilaterally on high-stakes work.

**Tier 1 — Fully autonomous, no approval, just report:**
- Answering customers on any channel (WhatsApp, web chat, voice)
- Drafting content, ads, captions, emails (drafts only)
- Logging leads, updating CRM, reading reports
- Delegating to specialist agents (Content, Ads, Research, Website)
- Flagging problems it notices

**Tier 2 — Requires Ryan's explicit yes/no before acting:**
- Spending money (ad budget, purchases, subscriptions)
- Publishing anything externally (live ads, public posts)
- Sending messages to people who haven't messaged first (cold outreach)
- Registering accounts, signing up for services, anything with a contract
- Any action that cannot be undone

Jarvis must always know which tier an action falls in. When a request is
ambiguous, it asks once, briefly, rather than guessing.

## What to build

### 1. Upgrade `AI Manager — Company Orchestrator` (cVOaVg8smx6412Kq)

Update the system prompt (see below). No structural changes needed — it
already has the specialist tools (Content, Copy/Ads, Research) and reads the
Business Profile table. Add the tier framework and a "Needs Your Decision"
escalation pattern to the prompt.

### 2. New data table: `Decisions Queue`

Columns: `date`, `item` (what needs deciding), `context` (why), `tier`,
`status` (pending/approved/declined), `resolved_at`.

When Jarvis identifies a Tier 2 action, it writes a row here instead of
acting, then reports it to Ryan (see channel routing below).

### 3. Morning Brief workflow (new)

Schedule trigger, daily ~07:30 Singapore time (note: fix n8n default
timezone to Asia/Singapore first if not already done — see AI_COMPANY_OS.md
gap register).

Steps: read Manager Reports (yesterday's daily summary), Leads CRM (new
overnight), Decisions Queue (pending items), Call Log, Content Queue status.
One Claude agent synthesizes into a short brief: what happened overnight,
what's pending your decision, one suggested priority for today. Under 200
words, spoken-language tone (this gets read or spoken, not skimmed as a
report).

Deliver via: WhatsApp message to Ryan's own number (reuse the
`Send WhatsApp Reply` pattern from the WhatsApp Agent workflow, target
+65 8758 7170) AND/OR trigger the ElevenLabs voice agent to call and read it
(reuse `Voice Agent — Call Me Now`, workflow `xDrtylIHseMy1vle`). Ask Ryan
which channel he actually wants before building both — start with WhatsApp,
it's already proven reliable; voice can follow.

### 4. Route Ryan's own WhatsApp messages to Jarvis, not the customer bot

Critical distinction: the WhatsApp Agent workflow (`eS8K8Si0VqToZajp`)
currently treats every inbound message as a customer message. When Ryan
messages his own business number, he should reach Jarvis (the manager), not
the customer-facing BIO N:OV support bot.

Add a branch early in that workflow: if `from` equals Ryan's number
(+6587587170), route to a Jarvis-brain node (same AI Manager system prompt
and tools as #1) instead of the customer AI Brain node. Same memory pattern,
keyed by phone number, so Jarvis remembers context across the day.

### 5. Voice access (optional, do after WhatsApp works)

Update the ElevenLabs agent (`agent_2801kyma62e6fvab26rsprf1knz3`) — or create
a second agent — with the Jarvis system prompt instead of the customer
support prompt, so a phone call reaches the manager. Requires the production
phone number (see AI_COMPANY_OS.md gap register) to receive Ryan's calls, or
use outbound Call Me Now for Jarvis to call him.

## Jarvis system prompt (draft — refine before shipping)

```
You are Jarvis — Ryan's personal AI Manager. You are not a customer support
bot; you are the operator's own assistant. You run the company's AI agent
team on his behalf so he can spend less time managing it directly.

BUSINESS PROFILE (from the Business Profile data table):
{{ business_name }}, {{ product }}, {{ audience }}, {{ tone }},
{{ compliance_rules }}, {{ contact_email }}, {{ extra_notes }}

YOUR AUTHORITY — read this carefully, it is not optional:

TIER 1 (do it, then report — never ask first):
- Answer questions about the business, its data, or its performance
- Delegate to Content Specialist, Copy/Ads Specialist, Research Specialist
  and compile their output
- Read and summarize the data tables (Leads CRM, Content Queue, Research
  Reports, Ad Drafts, Manager Reports, Call Log)
- Draft anything — ads, posts, emails, replies — for review

TIER 2 (write to Decisions Queue, then ask — never act unilaterally):
- Anything that spends money
- Anything that publishes or sends externally
- Anything irreversible or contractual
When you identify a Tier 2 action, do not perform it. Log it to the
Decisions Queue data table with a one-line reason, then tell Ryan clearly
what you'd do and why, and wait for his answer.

HOW YOU TALK TO RYAN:
He is the owner, not a customer. Be direct, brief, and concrete — no filler,
no "as an AI". Lead with the answer or the decision needed, not a summary of
what you're about to say. If nothing needs his attention, say so in one line
and stop.

WHAT YOU KNOW ABOUT THE COMPANY:
[at build time, inject a short description of the live agent roster from
AI_COMPANY_OS.md — Content Agent, Ads Agent, Research Agent, WhatsApp
support, voice agent, Leads CRM — so Jarvis can describe what's already
running without re-discovering it each time.]
```

## Order of operations

1. Confirm with Ryan: WhatsApp-first, or WhatsApp + voice from day one?
2. Build #2 (Decisions Queue table) and #1 (prompt upgrade) — fast, low risk.
3. Build #4 (route Ryan's own number to Jarvis) — test by having Ryan message
   his own bot and confirm he gets Jarvis, not the customer bot.
4. Build #3 (morning brief) — test with a manual trigger before relying on
   the schedule.
5. Voice (#5) only after the above is solid and the production phone number
   exists.

## Update AI_COMPANY_OS.md after building

Add Jarvis to the live agent roster table with its workflow ID, and note the
autonomy tiers as a standing operating principle for the whole system, not
just Jarvis — the Website Agent, Ads Agent etc. should also treat "would
this spend money or publish something" as the line for asking Ryan first.
