# Mock lead — test case for Phase 1

## Input (POST body to the webhook once deployed)

```json
{
  "name": "John Tan",
  "phone": null,
  "email": null,
  "company": "ABC Property Pte Ltd",
  "industry": "Real estate",
  "source": "facebook",
  "message": "Hi, I run a property agency with 25 agents. We get many Facebook leads but my agents don't follow up properly. I want AI to reply through WhatsApp and help book appointments."
}
```

## Expected output shape

This is a **reasoned walkthrough**, not a captured result from a live run —
the agent isn't deployed yet (n8n needs reauthorizing; see
`../workflows/phase1-lead-sales-agent.md`). It shows what the Sales
Qualification Agent's system prompt should produce, so the real first run
can be checked against it once deployed.

```json
{
  "company_name": "ABC Property Pte Ltd",
  "contact_name": "John Tan",
  "industry": "Real estate",
  "company_size": "25 agents",
  "problem": "Facebook leads aren't followed up properly by agents",
  "current_tools": null,
  "lead_sources": "Facebook",
  "desired_automation": "AI replies via WhatsApp and books appointments",
  "budget": null,
  "timeline": null,
  "decision_maker": null,
  "missing_information": ["current_tools", "budget", "timeline", "decision_maker"],
  "lead_temperature": "warm",
  "lead_status": "QUALIFYING",
  "intent": "AI automation for real estate lead follow-up",
  "summary": "John Tan runs a 25-agent property agency in Singapore. Facebook generates leads but agent follow-up is inconsistent. He wants an AI to reply via WhatsApp and book appointments.",
  "recommended_reply": "Hi John, thanks for reaching out! That's a really common bottleneck — leads going cold because follow-up can't keep up with volume. A couple of quick questions so I can scope this properly: do your agents currently use any CRM or system to track these leads, and is there a rough timeline you're hoping to get this running by?",
  "next_action": "Send recommended_reply and wait for current_tools and timeline",
  "follow_up_at": null,
  "human_review_required": false,
  "human_review_reason": null
}
```

## Why `human_review_required` is `false` here

Nothing in this message touches the boundary in
`../agents/sales-qualification-agent.md` (price, contract, refund, payment,
deletion, deployment, credentials, irreversible commitment) — it's a
discovery-stage enquiry. If John had asked "how much would this cost me"
or "can you start this week and I'll pay a deposit", the agent should set
`human_review_required: true` and hold, rather than quote a number itself.

## How to actually run this once n8n is reconnected

1. Say "deploy Phase 1" — the blueprint in
   `../workflows/phase1-lead-sales-agent.md` gets compiled, validated and
   published as a real n8n workflow.
2. Send this file's input JSON to the deployed webhook (or trigger it
   manually from n8n with this payload pinned).
3. Compare the real output against the reasoned example above — differences
   are expected (the agent will phrase things in its own words), but the
   *fields present, statuses, and human_review_required call* should match
   this shape.
