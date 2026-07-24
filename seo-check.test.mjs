import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const sourceRoot = path.dirname(fileURLToPath(import.meta.url));
const checker = path.join(sourceRoot, "seo-check.mjs");
const files = fs
  .readdirSync(sourceRoot)
  .filter((file) => /\.(?:html|css|js|json|xml|txt|webmanifest)$/i.test(file));

function fixture() {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "rsps-seo-negative-"));
  for (const file of files) fs.copyFileSync(path.join(sourceRoot, file), path.join(target, file));
  fs.cpSync(path.join(sourceRoot, "assets"), path.join(target, "assets"), { recursive: true });
  return target;
}

function mutate(file, transform) {
  const source = fs.readFileSync(file, "utf8");
  fs.writeFileSync(file, transform(source), "utf8");
}

function replaceExactly(source, search, replacement, expectedCount = 1) {
  const count = source.split(search).length - 1;
  assert.equal(count, expectedCount, `expected ${expectedCount} occurrence(s) of mutation target, found ${count}`);
  return source.replace(search, replacement);
}

function expectFailure(name, change, expectedText) {
  const target = fixture();
  try {
    change(target);
    const result = spawnSync(process.execPath, [checker, target], {
      encoding: "utf8",
    });
    const output = `${result.stdout}\n${result.stderr}`;
    assert.notEqual(result.status, 0, `${name} unexpectedly passed`);
    assert.match(output, expectedText, `${name} failed for the wrong reason:\n${output}`);
    console.log(`PASS negative test: ${name}`);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

expectFailure(
  "missing H1",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, ""),
    ),
  /expected one H1, found 0/,
);

expectFailure(
  "wrong canonical",
  (target) =>
    mutate(path.join(target, "index.html"), (source) =>
      source.replace('rel="canonical" href="https://rsps-gold.github.io/"', 'rel="canonical" href="https://example.com/"'),
    ),
  /canonical is https:\/\/example\.com\//,
);

expectFailure(
  "noindex commercial page in sitemap",
  (target) =>
    mutate(path.join(target, "near-reality-gold.html"), (source) =>
      source.replace('content="index, follow"', 'content="noindex, follow"'),
    ),
  /commercial server page must be index, follow/,
);

expectFailure(
  "missing expected server URL",
  (target) =>
    mutate(path.join(target, "sitemap.xml"), (source) =>
      source.replace(/\s*<url>\s*<loc>https:\/\/rsps-gold\.github\.io\/near-reality-gold\.html<\/loc>[\s\S]*?<\/url>/, ""),
    ),
  /missing expected server URL .*near-reality-gold\.html/,
);

expectFailure(
  "invalid JSON-LD",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replace('{"@context":"https://schema.org"', '{BROKEN,"@context":"https://schema.org"'),
    ),
  /invalid JSON-LD/,
);

expectFailure(
  "forbidden marketing claim",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replace("</main>", "<p>100% safe with instant delivery.</p></main>"),
    ),
  /forbidden or undocumented claim/,
);

expectFailure(
  "wrong homepage server-card order",
  (target) =>
    mutate(path.join(target, "index.html"), (source) =>
      source.replace(
        /(<div class="server-grid">\s*)(<article class="server-card">[\s\S]*?<\/article>)\s*(<article class="server-card">[\s\S]*?<\/article>)/i,
        "$1$3\n$2",
      ),
    ),
  /server-card priority position 1/,
);

expectFailure(
  "missing SpawnPK trill terminology",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source
        .replace(/\btrill(?:ion|ions|s)?\b/gi, "amount")
        .replace(/\bCash Bags?\b/gi, "currency"),
    ),
  /missing required Cash Bag and trill-based terminology/,
);

expectFailure(
  "SpawnPK markets Blood Money",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace("</main>", "<p>Ask to buy Blood Money as another product.</p></main>"),
    ),
  /must not market Blood Money or BM/,
);

expectFailure(
  "wrong SpawnPK order message",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace("Amount needed: 10T", "Amount needed: 500M"),
    ),
  /SpawnPK order message does not match/,
);

expectFailure(
  "unqualified SpawnPK price",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      replaceExactly(
        source,
        '<p class="spawnpk-price">From <strong>$9</strong> per 1T</p>',
        '<p class="spawnpk-price">At <strong>$9</strong> per 1T</p>',
      ),
    ),
  /\$9 per 1T must always be qualified/,
);

expectFailure(
  "wrong restored SpawnPK metadata title",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      replaceExactly(
        source,
        "<title>Buy SpawnPK Gold | Starting at $9 per Trill</title>",
        "<title>Buy SpawnPK Gold – Trill &amp; Cash Bag Rates | RSPS Gold Hub</title>",
      ),
    ),
  /title does not match the approved concise metadata/,
);

expectFailure(
  "duplicate modern meta description",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      replaceExactly(
        source,
        "</head>",
        '  <meta name="description" content="Duplicate description." />\n  </head>',
      ),
    ),
  /expected one meta description, found 2/,
);

expectFailure(
  "newline in modern title",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      replaceExactly(
        source,
        "<title>Buy Roat PKZ Gold | Starting at $3.5 per Mill</title>",
        "<title>Buy Roat PKZ Gold |\nStarting at $3.5 per Mill</title>",
      ),
    ),
  /title must not contain a newline/,
);

expectFailure(
  "SpawnPK uses Starting price",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace(
        '<p class="spawnpk-rate-card__label">SPAWNPK GOLD RATE</p>',
        '<p class="spawnpk-rate-card__label">Starting price</p>',
      ),
    ),
  /must not use "Starting price"/,
);

expectFailure(
  "SpawnPK treats Cash Bags as separate stock",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace(
        "Available player-supplied gold",
        "Cash Bags currently available",
      ),
    ),
  /misleading Cash Bag terminology/,
);

expectFailure(
  "SpawnPK treats Cash Bags as a separate currency",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace(
        "Cash Bags are not a separate SpawnPK currency.",
        "Cash Bags are a separate SpawnPK currency.",
      ),
    ),
  /misleading Cash Bag terminology/,
);

expectFailure(
  "broken SpawnPK copy target",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replaceAll(
        'data-copy-target="spawnpk-order-message"',
        'data-copy-target="missing-spawnpk-message"',
      ),
    ),
  /expected two copy buttons connected to the SpawnPK order message, found 0/,
);

expectFailure(
  "missing SpawnPK account-access distinction",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace(
        "A buyer normally does not need to provide a SpawnPK login.",
        "Buyer access is handled separately.",
      ),
    ),
  /missing the required buyer-versus-seller account-access distinction/,
);

expectFailure(
  "absolute SpawnPK password claim",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace("</main>", "<p>No password needed.</p></main>"),
    ),
  /contains absolute password or login wording/,
);

expectFailure(
  "SpawnPK paragraph copied from Impact with substitutions",
  (target) =>
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace(
        "</main>",
        "<p>Better gear can make bossing smoother and help players take on harder PvM content. Some buyers use SpawnPK gold for weapons, armour and supplies instead of spending as much time rebuilding their cash stack.</p></main>",
      ),
    ),
  /text block is too similar to Impact after neutralizing server, currency, and rate terms/,
);

expectFailure(
  "unsupported server superlative",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replace("</main>", "<p>Impact is the most popular RSPS and has the largest market.</p></main>"),
    ),
  /forbidden or undocumented claim: (?:most popular RSPS|largest market)/,
);

expectFailure(
  "unqualified Impact price",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      replaceExactly(
        source,
        '<p class="impact-price">From <strong>$1</strong> per 1B</p>',
        '<p class="impact-price">At <strong>$1</strong> per 1B</p>',
      ),
    ),
  /\$1 per 1B must always be qualified/,
);

expectFailure(
  "public Impact SEO-report language",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replace("</main>", "<p>Search-led priority based on Search Console impressions and CTR.</p></main>"),
    ),
  /contains public-facing internal SEO language/,
);

expectFailure(
  "wrong Impact order message",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replace(
        "Hi, I want to buy Impact gold.",
        "Hi, I want to buy Roat PKZ gold.",
      ),
    ),
  /Impact order message does not match/,
);

expectFailure(
  "missing Impact sourcing section",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replace(
        "Where Does the Impact Gold Come From?",
        "Impact Supply",
      ),
    ),
  /missing required buyer-facing content: Where Does the Impact Gold Come From/,
);

expectFailure(
  "broken Impact copy target",
  (target) =>
    mutate(path.join(target, "impact-gold.html"), (source) =>
      source.replaceAll(
        'data-copy-target="impact-order-message"',
        'data-copy-target="missing-impact-message"',
      ),
    ),
  /missing copy button connected to the Impact order message/,
);

expectFailure(
  "unqualified Roat PKZ price",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      replaceExactly(
        source,
        '<p class="roat-price">From <strong>$3.50</strong> per 1M</p>',
        '<p class="roat-price">At <strong>$3.50</strong> per 1M</p>',
      ),
    ),
  /\$3\.50 per 1M must always be qualified/,
);

expectFailure(
  "wrong Roat PKZ order message",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      source.replace(
        "Hi, I’m looking to buy Roat PKZ PKP.",
        "Hi, I want to buy Impact gold.",
      ),
    ),
  /Roat PKZ order message does not match/,
);

expectFailure(
  "inconsistent visible Roat PKZ brand",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      source.replace(
        "Why Do Players Buy Roat PKZ Gold?",
        "Why Do Players Buy RoatPKZ Gold?",
      ),
    ),
  /visible content must consistently use Roat PKZ/,
);

expectFailure(
  "broken Roat PKZ copy target",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      source.replaceAll(
        'data-copy-target="roat-pkz-order-message"',
        'data-copy-target="missing-roat-pkz-message"',
      ),
    ),
  /missing copy button connected to the Roat PKZ order message/,
);

expectFailure(
  "missing Roat PKZ account-access distinction",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      source.replaceAll(
        "A buyer normally does not need to share a Roat PKZ login.",
        "Buyer access is handled separately.",
      ),
    ),
  /missing the required buyer-versus-seller account-access distinction/,
);

expectFailure(
  "duplicate HTML id",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      source.replace("</main>", '<div id="rates"></div></main>'),
    ),
  /duplicate HTML id rates/,
);

expectFailure(
  "Roat PKZ paragraph copied from Impact with substitutions",
  (target) =>
    mutate(path.join(target, "roat-pkz-gold.html"), (source) =>
      source.replace(
        "</main>",
        "<p>Better gear can make bossing smoother and help players take on harder PvM content. Some buyers use Roat PKZ gold for weapons, armour and supplies instead of spending as much time rebuilding their cash stack.</p></main>",
      ),
    ),
  /text block is too similar to Impact after neutralizing server, currency, and rate terms/,
);

expectFailure(
  "duplicate FAQ within an approved legacy page",
  (target) =>
    mutate(path.join(target, "alora-gold.html"), (source) =>
      source.replace(
        "</main>",
        "<details><summary>Do I need to share my password?</summary><p>Duplicate answer.</p></details></main>",
      ),
    ),
  /duplicate FAQ question within page: do i need to share my password/,
);

expectFailure(
  "duplicate FAQ across modern server pages",
  (target) => {
    for (const file of ["impact-gold.html", "spawnpk-gold.html"]) {
      mutate(path.join(target, file), (source) =>
        source.replace(
          "</main>",
          "<details><summary>Is this shared modern FAQ unique?</summary><p>Test answer.</p></details></main>",
        ),
      );
    }
  },
  /duplicate FAQ question: is this shared modern faq unique/,
);

expectFailure(
  "modern server pages still enforce main-content uniqueness",
  (target) => {
    const impactSource = fs.readFileSync(path.join(target, "impact-gold.html"), "utf8");
    const impactMain = impactSource.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
    assert.ok(impactMain, "Impact fixture is missing its main element");
    mutate(path.join(target, "spawnpk-gold.html"), (source) =>
      source.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, impactMain),
    );
  },
  /impact-gold\.html, spawnpk-gold\.html: main-content 3-word-shingle similarity 100\.0% exceeds 55%/,
);

expectFailure(
  "SpawnPK guide treats Cash Bags as a separate currency",
  (target) =>
    mutate(path.join(target, "spawnpk-guide.html"), (source) =>
      replaceExactly(
        source,
        "A Cash Bag is not a separate currency",
        "Cash Bags are a separate currency",
      ),
    ),
  /guide must not treat Cash Bags as a separate currency/,
);

expectFailure(
  "Roat PKZ guide calls Donation Credits standard gold",
  (target) =>
    mutate(path.join(target, "roat-pkz-guide.html"), (source) =>
      replaceExactly(
        source,
        "Donation Credits, Donator points and other server currencies are separate from PKP.",
        "Donation Credits are standard Roat PKZ gold orders.",
      ),
    ),
  /guide must keep Donation Credits separate from standard PKP orders/,
);

expectFailure(
  "Impact guide changes its approved rate",
  (target) =>
    mutate(path.join(target, "impact-guide.html"), (source) =>
      replaceExactly(source, "$1 per 1B", "$2 per 1B"),
    ),
  /guide CTA must retain the approved \$1 per 1B rate/,
);

expectFailure(
  "guide adds guaranteed profit",
  (target) =>
    mutate(path.join(target, "spawnpk-guide.html"), (source) =>
      source.replace("</main>", "<p>Profit is guaranteed with this setup.</p></main>"),
    ),
  /guide must not add a guaranteed profit claim/,
);

expectFailure(
  "guide pages duplicate the same main content",
  (target) => {
    const impactSource = fs.readFileSync(path.join(target, "impact-guide.html"), "utf8");
    const impactMain = impactSource.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
    assert.ok(impactMain, "Impact guide fixture is missing its main element");
    for (const file of ["roat-pkz-guide.html", "spawnpk-guide.html"]) {
      mutate(path.join(target, file), (source) =>
        source.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, impactMain),
      );
    }
  },
  /guide main-content similarity 100\.0% exceeds 55%/,
);

expectFailure(
  "guide omits its related sales-page links",
  (target) =>
    mutate(path.join(target, "impact-guide.html"), (source) =>
      source.replaceAll('href="impact-gold.html"', 'href="guides.html"'),
    ),
  /expected exactly two main commercial links to impact-gold\.html, found 0/,
);

expectFailure(
  "educational guide adds Product schema",
  (target) =>
    mutate(path.join(target, "impact-guide.html"), (source) =>
      replaceExactly(source, '"@type": "Article"', '"@type": "Product"'),
    ),
  /educational guide must not use Product schema/,
);

console.log("All negative SEO tests passed.");
