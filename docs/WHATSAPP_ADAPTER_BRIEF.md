# BUILD BRIEF — WhatsApp Adapter (Meta Cloud API sandbox → AI Brain)

Standing instruction for any Claude session with the n8n connector enabled:
when Ryan says "build the WhatsApp adapter", execute this brief exactly.
It is the missing piece of the AI Company OS (see AI_COMPANY_OS.md).

## Context

- n8n cloud instance: ryan1515.app.n8n.cloud, personal project `uFcEmgtYEFyGauyy`
- Existing system: Omnichannel AI Hub (workflow `JVGDhhmPFSATl7B7`) answers
  webhook messages with a Claude agent using the Business Profile data table
  and logs to Leads CRM. This adapter brings WhatsApp into that pattern.
- Meta WhatsApp Cloud API **sandbox** (test number, free):
  - Test number: +1 (555) 677-0991
  - Phone Number ID: `1321607761025022`
  - WhatsApp Business Account ID: `1034122678981935`
  - Access token: EXPIRES EVERY ~24H — ask Ryan to paste a fresh one from
    developers.facebook.com → his app → WhatsApp → Step 1 "Try it out" →
    Generate token. NEVER commit the token to the repo.
  - Allowed recipient (Ryan's phone): +65 8758 7170
- Data tables: Business Profile `DmIMqlKMj1YWLrBk`, Leads CRM `ehx3PzVSENmUUCHd`
- Model for agents: lmChatAnthropic, model value `claude-sonnet-4-6`
  (n8n credits auto-credential — omit credentials, they auto-assign)

## Workflow to build: "WhatsApp Agent — Sandbox"

Follow the n8n MCP flow (get_sdk_reference, best practices "chatbot",
search_nodes/get_node_types for any node not listed in AI_COMPANY_OS work).
Structure (single workflow):

1. **Webhook trigger** (n8n-nodes-base.webhook v2.1)
   - `multipleMethods: true` (GET + POST), path `whatsapp-in`,
     `responseMode: 'responseNode'`
   - GET output → **Respond Challenge** (respondToWebhook, respondWith `text`,
     responseBody `={{ $json.query['hub.challenge'] }}`) — Meta's verification
     handshake. Verify token Ryan will type into Meta: `biogreen-verify`
     (no server-side check needed for sandbox).
   - POST output → **Respond OK** (respondToWebhook, respondWith `text`,
     responseBody `ok`) FIRST, then continue processing (Meta needs a fast 200;
     it retries/duplicates on slow responses).

2. **Extract Message** (Set v3.5, after Respond OK):
   - `from`: `={{ $json.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ?? '' }}`
   - `text`: `={{ $json.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ?? '' }}`
   - `name`: `={{ $json.body?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name ?? 'there' }}`

3. **IF "Is a text message?"**: condition — `text` not empty AND `from` not
   empty (Meta also posts delivery-status events with no message; those must
   stop here, false branch → no-op).

4. **Get Business Profile** (dataTable row get, table id `DmIMqlKMj1YWLrBk`,
   limit 1).

5. **AI Brain** (agent v3.1, promptType define): prompt includes the business
   profile fields ($json.*) and the customer message via
   `$('Extract Message').item.json.*`. System message: same omnichannel
   support persona as the Hub — warm, concise, compliance rules from profile
   (supports/promotes/helps maintain, never cure/treat/prevent/diagnose;
   medication/pregnancy → advise doctor; orders/refunds → info@biogreenelixirs.com),
   reply in customer's language, plain text reply only (no JSON, no markdown
   — WhatsApp shows raw text).

6. **Send WhatsApp Reply** (httpRequest v4.4):
   - POST `https://graph.facebook.com/v21.0/1321607761025022/messages`
   - Headers: `Authorization: Bearer <FRESH_TOKEN_FROM_RYAN>` (sandbox: OK to
     inline in the node; swap to a Header Auth credential at production),
     `Content-Type: application/json`
   - JSON body: `{ "messaging_product": "whatsapp", "to": "={{ $('Extract Message').item.json.from }}", "type": "text", "text": { "body": "={{ $json.output }}" } }`
   - onError: continueRegularOutput

7. **Log to Leads CRM** (dataTable row insert, table `ehx3PzVSENmUUCHd`):
   date/channel='whatsapp'/name/contact=from/message=text/intent='whatsapp'/
   ai_reply=agent output/wants_call='false'/status='new'.

Publish the workflow after creation.

## Ryan's two manual steps after the build (tell him exactly this)

1. In developers.facebook.com → his app → left sidebar **Webhooks** (or
   WhatsApp → Configuration): Callback URL =
   `https://ryan1515.app.n8n.cloud/webhook/whatsapp-in`, Verify token =
   `biogreen-verify`, click Verify and save, then **subscribe to the
   `messages` field**.
2. Test: send any message from his phone (+65 8758 7170) via WhatsApp to
   +1 (555) 677-0991 — the AI must reply within ~20 seconds.

## After it works

- Production path: register Ryan's spare SIM number in Meta (Step 2
  "Production setup"), permanent token in a proper n8n Header Auth
  credential, same workflow with swapped IDs.
- Later upgrades: reuse the Omnichannel Hub's structured-output pattern
  (intent, wants_call → ElevenLabs outbound call trigger, agent id
  `agent_2801kyma62e6fvab26rsprf1knz3`).
