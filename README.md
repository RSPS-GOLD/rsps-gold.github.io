# RSPS Gold Hub

Static GitHub Pages website for Discord-based RSPS gold quote requests.

Live site:
https://rsps-gold.com/

Tech:
- Static HTML
- CSS
- Vanilla JavaScript
- GitHub Pages

Local SEO validation:

```text
node seo-check.mjs
node seo-check.test.mjs
node site-quality-check.mjs
node related-guides-check.mjs
node guide-header-check.mjs
node spanish-mvp-check.mjs
```

The checks cover titles, descriptions, H1s, canonicals, sitemap membership,
JSON-LD, image metadata, assets, links, claims, FAQ duplication, and content
similarity. They also enforce the homepage business-priority order
Impact → Roat PKZ → SpawnPK and the SpawnPK Cash Bag/trill terminology. The
Impact checks enforce the qualified “from $1 per 1B” rate, buyer-facing
sections, three-step process, and server-specific copy message. The negative
test suite verifies that deliberate regressions fail.

`site-quality-check.mjs` validates every public HTML file, including local
links and fragments, assets, form labels, social-image metadata, JSON-LD and
parity between published guide files, visible hub cards and ItemList schema.

`related-guides-check.mjs` inventories every bottom-of-article guide card and
enforces the shared component, explicit destination titles and CTAs, valid
local destinations, preserved analytics actions and same-tab behavior.

`guide-header-check.mjs` inventories every public header and validates the
shared server context, active guide navigation, secondary pricing links and
mobile-menu coverage.

Supporting documentation:

- `CONTENT_BRIEFS.md` — page intent and content plan.
- `CONTENT_SOURCES.md` — server fact and source log.
- `SEO_REPORT.md` — full analysis, implementation record, and measurement plan.
- `PRE_PUBLISH_QA.md` — final local release checklist and verified test results.
