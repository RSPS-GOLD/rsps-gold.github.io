# RSPS Gold Hub

Static source and deterministic build pipeline for [rsps-gold.com](https://rsps-gold.com/).

## Requirements

- Node.js 24
- npm (included with the standard Node.js distribution)

## Commands

```text
npm ci
npm run validate
npm run build
```

`npm run validate` is the single release gate. It validates the authoring source, creates two independent builds, compares every output hash for determinism, and checks the generated pages, links, assets, structured data, translations, rates, payment policy, feature bundles, and performance budgets.

`npm run build` recreates `dist/` from the checked-in source. Never edit `dist/`; it is generated and intentionally ignored by Git.

## Architecture

- Root HTML, CSS, and JavaScript files are the authoring source. The root `CNAME` file is the GitHub Pages domain marker and is validated against the configured origin; the remaining public metadata files are generated.
- `src/data/site.mjs` is the source of truth for site identity and canonical origin, Discord identity, supported servers, published rates and payment-policy wording.
- `src/data/pages.mjs` is the source of truth for public paths, sitemap membership, English/Spanish relationships, FAQ schema scope, and per-page CSS/JavaScript features.
- `src/templates/site.webmanifest.json` contains only the non-identity web-app manifest fields.
- `tools/build.mjs` renders shared facts, synchronizes visible FAQ content with existing `FAQPage` JSON-LD, folds page-local styles and runtimes into content-addressed bundles, rewrites optimized image references, generates the deployment CNAME/robots/sitemap/webmanifest, and writes `dist/`.
- `tools/validate.mjs` is the consolidated repository-wide validator.
- `.github/workflows/pages.yml` validates, builds, and uploads the generated `dist/` artifact before deployment is allowed.

All established public page paths are preserved. Compatibility copies of historical CSS/JavaScript asset URLs remain in the artifact, while generated pages load smaller content-addressed bundles that are reused whenever their bytes match.

See `ARCHITECTURE.md` for the dependency map, recorded baseline, and measured before/after results.

## Publishing

GitHub Pages must use **GitHub Actions** as its publishing source. Pull requests run the quality gate without deploying. A push to `main` can deploy only after validation and the production build both pass.

Do not push or deploy without the site owner's explicit authorization.
