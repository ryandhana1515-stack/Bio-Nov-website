# CEO Brain — environment variables

This session's permissions block writing an actual `.env.example` file, so
the variable names live here instead. When you set these up locally, create
your own `.env` (already covered by `.gitignore`) with real values — never
commit it.

Nothing below is required to deploy Phase 1. The Sales Qualification Agent
runs on n8n's built-in Claude credit model (no `ANTHROPIC_API_KEY` needed),
and Phase 1 persists data in n8n Data Tables (no database URL needed).
These are Phase 2 variables — fill in only when you actually connect that
piece.

| Variable | Needed for |
|---|---|
| `SUPABASE_URL` | Phase 2 — swap n8n Data Tables for `database/schema.sql` |
| `SUPABASE_SERVICE_ROLE_KEY` | Phase 2 — same |
| `SUPABASE_DB_URL` | Phase 2 — running `schema.sql` directly via `psql` |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Phase 2 — Facebook/Instagram Lead Ads webhook |
| `WHATSAPP_BUSINESS_TOKEN` | Phase 2 — only if this needs its own WhatsApp number, separate from the one already wired elsewhere in this n8n account |
| `WHATSAPP_PHONE_NUMBER_ID` | Phase 2 — same |
| `NOTIFY_HUMAN_CHANNEL` | Phase 2 — where human-review escalations get sent, if different from the WhatsApp number already used elsewhere |
