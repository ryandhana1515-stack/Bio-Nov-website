# Marketing Skills

Vendored from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) (MIT).

- **Version:** 2.10.0
- **Upstream commit:** `7868cb9251fad80a73d26e488a5ad5f6c4a9f335` (2026-07-27)
- **Skills:** 49

These are agent skills — Claude Code loads them automatically when a request
matches a skill's `description`, or you can invoke one by name (e.g. `/cro`).

Coverage includes CRO, copywriting, cold email, SEO / AI SEO, paid ads, ad
creative, video, image generation, pricing, offers, referrals, churn
prevention, launch planning, public relations, and AARRR marketing plans.

## Updating

```sh
git clone --depth 1 https://github.com/coreyhaines31/marketingskills.git /tmp/ms
rm -rf .claude/skills/*/
cp -r /tmp/ms/skills/. .claude/skills/
find .claude/skills -type d -name evals -exec rm -rf {} +
```

Then bump the version and commit hash above.

## Notes

Upstream `evals/` directories are omitted — they are CI test fixtures for the
source repo and are not used at runtime.
