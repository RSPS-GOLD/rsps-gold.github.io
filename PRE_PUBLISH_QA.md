# Pre-publish QA

Run from a clean checkout with Node.js 24:

```text
npm ci
npm run validate
npm run build
```

Before authorizing a deployment, confirm:

- `npm run validate` reports a deterministic build and no validation failures.
- `npm run build` recreates `dist/` successfully.
- The full Git diff contains only intended source, pipeline, workflow, and optimized-asset changes.
- Homepage, one featured gold page, one English/Spanish pair, and representative interactive guides work at desktop and mobile widths.
- Language chooser, navigation, FAQ controls, Discord links, and guide calculators work without console errors.
- No page has horizontal overflow or broken local assets.
- GitHub Pages is configured to publish with GitHub Actions.
- The custom domain remains `rsps-gold.com`.

The workflow deploys only the generated `dist/` artifact after its quality job passes. Pull requests never deploy.

Deployment status for this refactor: **not pushed and not deployed**.
