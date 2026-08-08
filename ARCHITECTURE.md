# Static architecture and performance record

Recorded on 2026-08-02 before the repository-wide refactor.

## Starting point

- 34 HTML documents: 33 indexable pages plus the custom 404 page.
- 8 CSS files, 4 JavaScript files, and 10 separate legacy validation scripts.
- 135 static assets totaling approximately 24.56 MB.
- No package manifest, lockfile, deterministic build command, or deployment workflow.
- The global `styles.css` (255,958 bytes) and `script.js` (83,465 bytes) were loaded broadly, including on pages that used only a small part of them.
- Five legacy checks passed. Five failed because their page counts, copy assertions, or fixtures had drifted from the current site.
- 293 visible FAQ entries existed across 33 pages. The existing structured-data scope covered 19 pages and 166 FAQ entries; those 166 visible/schema pairs matched before editing.

## Local versus production drift

The local and production versions of 39 public HTML/core files were compared before editing. After normalizing line endings, content drift was zero: 7 files were byte-identical and 32 differed only by CRLF/LF line endings.

## Dependency flow

```text
src/data/site.mjs --+
src/data/pages.mjs -+--> tools/build.mjs --> dist/
root HTML/CSS/JS ---+           |
                                +--> visible FAQ -> FAQPage JSON-LD
                                +--> canonical/hreflang/sitemap
                                +--> page-specific CSS/JS
                                +--> optimized image references

tools/validate.mjs --> source checks + two isolated builds + output checks
GitHub Actions -----> validate -> build -> artifact -> deploy
```

## Source-of-truth ownership

| Concern | Owner |
|---|---|
| Discord username, user ID, profile URL | `src/data/site.mjs` |
| Site identity and canonical origin | `src/data/site.mjs` |
| Supported servers, aliases, currencies, units, published rates | `src/data/site.mjs` |
| Payment-policy wording | `src/data/site.mjs` |
| Public paths and English/Spanish relationships | `src/data/pages.mjs` |
| FAQPage inclusion scope | `src/data/pages.mjs` |
| Page CSS/JavaScript features | `src/data/pages.mjs` |
| Visible FAQ-to-schema synchronization | `tools/build.mjs` |
| Canonical hostname | `src/data/site.mjs`; root `CNAME` is a validated GitHub Pages marker and the deployment CNAME is generated |
| Robots sitemap URL, sitemap, webmanifest identity | generated from `src/data/site.mjs` |

## Representative static-load baseline and build result

Figures are uncompressed local bytes for each HTML document and the CSS, JavaScript, and eager local images it references. They are deterministic transfer-size indicators, not field Core Web Vitals.

| Page | Metric | Before | Built |
|---|---:|---:|---:|
| Homepage | HTML | 108,056 | 61,483 |
|  | CSS | 297,112 | 164,662 |
|  | JavaScript | about 88,100 | 20,234 |
|  | Eager local images | 1,607,890 | 610,974 |
| Impact gold | HTML | 27,083 | 27,229 |
|  | CSS | 255,958 | 114,988 |
|  | JavaScript | 83,465 | 15,574 |
|  | Eager local images | 1,628,444 | 631,528 |
| Spanish homepage | HTML | 103,159 | 61,249 |
|  | CSS | about 297,100 | 159,963 |
|  | JavaScript | about 88,100 | 20,331 |
|  | Eager local images | 1,607,890 | 610,974 |
| Impact thieving guide | HTML | 54,169 | 52,517 |
|  | CSS | 255,958 | 113,244 |
|  | JavaScript | 83,465 | 15,461 |
|  | Eager local images | 904,889 | 567,058 |
| SpawnPK money-making guide | HTML | 75,486 | 73,498 |
|  | CSS | 282,501 | 113,525 |
|  | JavaScript | 92,162 | 16,251 |
|  | Eager local images | 839,645 | 501,814 |

Nine optimized local WebP derivatives include a clean Discord CTA background whose central copy is rendered from configuration. The established profile avatar intentionally retains its `a6d9` artwork. Their combined size fell from 8,716,015 to 1,224,572 bytes (85.95% smaller); original asset URLs remain available for compatibility.

The final artifact uses 20 unique CSS files for 34 page records and 15 unique JavaScript files for 33 scripted pages. The custom 404 page uses a dedicated 4,038-byte stylesheet and no JavaScript. Identical bundles share the same content-addressed URL, and the seven page-local stylesheets plus three page-local runtimes are included in those hashed bundles rather than loaded as extra cache-versioned requests.

The build preserves all source H1/H2/H3 text and semantic IDs, every established public path, all 33 sitemap pages, four English/Spanish page pairs, the 19-page FAQPage scope, and existing page-specific functionality.
