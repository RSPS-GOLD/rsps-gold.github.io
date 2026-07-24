import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const siteOrigin = "https://rsps-gold.github.io";
const discordId = "640265737050652672";
const priorityServerCards = [
  "impact-gold.html",
  "roat-pkz-gold.html",
  "spawnpk-gold.html",
];
// These six approved legacy pages intentionally retain their shared historical content model.
const legacyServerFiles = [
  "alora-gold.html",
  "runex-gold.html",
  "orion-gold.html",
  "ferox-gold.html",
  "near-reality-gold.html",
  "other-rsps-gold.html",
];
const legacyServerFileSet = new Set(legacyServerFiles);
const serverFiles = [
  "impact-gold.html",
  "roat-pkz-gold.html",
  "spawnpk-gold.html",
  ...legacyServerFiles,
];
const guideFiles = [
  "guides.html",
  "impact-guide.html",
  "roat-pkz-guide.html",
  "spawnpk-guide.html",
];
const articleGuideFiles = guideFiles.filter((file) => file !== "guides.html");
const guideRequirements = {
  "guides.html": {
    title: "RSPS Gold Guides – Impact, Roat PKZ &amp; SpawnPK",
    description:
      "Explore practical Impact, Roat PKZ and SpawnPK guides covering currencies, gear planning, PvM, PvP and realistic account budgets.",
    h1: "RSPS Gold Guides",
    schema: ["WebPage", "CollectionPage", "BreadcrumbList"],
  },
  "impact-guide.html": {
    title: "Impact Gear &amp; Gold Guide | RSPS Gold Hub",
    description:
      "Plan Impact gear, PvM and PvP budgets with a practical guide to billions, upgrade priorities, supplies, reserves and account goals.",
    h1: "Impact Gear, Gold and Progression Guide",
    salesPage: "impact-gold.html",
    salesAction: "guide-to-impact-gold",
    copyLabel: "Copy Impact Request",
    schema: ["WebPage", "Article", "BreadcrumbList"],
  },
  "roat-pkz-guide.html": {
    title: "Roat PKZ PKP &amp; Gear Guide | RSPS Gold Hub",
    description:
      "Understand Roat PKZ PKP and plan practical PvP, PvM, gear and replacement budgets without confusing PK Points with other currencies.",
    h1: "Roat PKZ PKP, Gear and Progression Guide",
    salesPage: "roat-pkz-gold.html",
    salesAction: "guide-to-roat-pkz-gold",
    copyLabel: "Copy PKP Request",
    schema: ["WebPage", "Article", "BreadcrumbList"],
  },
  "spawnpk-guide.html": {
    title: "SpawnPK Trills &amp; Cash Bags Guide | RSPS Gold Hub",
    description:
      "Learn how SpawnPK trills and Cash Bags relate, then plan PvP, raid, gear, pet and replacement budgets around clear account goals.",
    h1: "SpawnPK Trills, Cash Bags and Gear Guide",
    salesPage: "spawnpk-gold.html",
    salesAction: "guide-to-spawnpk-gold",
    copyLabel: "Copy SpawnPK Request",
    schema: ["WebPage", "Article", "BreadcrumbList"],
  },
};
const modernMetadata = {
  "impact-gold.html": {
    title: "Buy Impact RSPS Gold | Starting at $1 per Bill",
    description:
      "Buy Impact RSPS gold through RSPS Gold Hub. Starting price from $1 per Bill. Contact a6d9 on Discord for current rate, stock, and delivery.",
    ogTitle: "Buy Impact RSPS Gold | Starting at $1 per Bill",
    ogDescription:
      "Buy Impact RSPS gold through RSPS Gold Hub. Contact a6d9 on Discord for current rate, stock, and delivery.",
    twitterTitle: "Buy Impact RSPS Gold | RSPS Gold Hub",
    twitterDescription:
      "Starting price from $1 per Bill. Confirm current Impact rates and stock on Discord.",
    removedTitle: "Buy Impact RSPS Gold – Price & Stock | RSPS Gold Hub",
  },
  "roat-pkz-gold.html": {
    title: "Buy Roat PKZ Gold | Starting at $3.5 per Mill",
    description:
      "Buy Roat PKZ gold through RSPS Gold Hub. Starting price from $3.5 per Mill. Contact a6d9 on Discord to confirm stock, rate, and delivery method.",
    ogTitle: "Buy Roat PKZ Gold | Starting at $3.5 per Mill",
    ogDescription:
      "Buy Roat PKZ gold through RSPS Gold Hub. Contact a6d9 on Discord to confirm stock, rate, and delivery method.",
    twitterTitle: "Buy Roat PKZ Gold | RSPS Gold Hub",
    twitterDescription:
      "Starting price from $3.5 per Mill. Confirm current Roat PKZ rates and stock on Discord.",
    removedTitle: "Buy Roat PKZ Gold – PKP Price & Stock | RSPS Gold Hub",
  },
  "spawnpk-gold.html": {
    title: "Buy SpawnPK Gold | Starting at $9 per Trill",
    description:
      "Buy SpawnPK gold through RSPS Gold Hub. Starting price from $9 per Trill. Contact a6d9 on Discord to confirm current rate, stock, and delivery.",
    ogTitle: "Buy SpawnPK Gold | Starting at $9 per Trill",
    ogDescription:
      "Buy SpawnPK gold through RSPS Gold Hub. Starting price from $9 per Trill. Contact a6d9 on Discord to confirm current rate, stock, and delivery.",
    twitterTitle: "Buy SpawnPK Gold | Starting at $9 per Trill",
    twitterDescription:
      "Buy SpawnPK gold through RSPS Gold Hub. Starting price from $9 per Trill. Contact a6d9 on Discord to confirm current rate, stock, and delivery.",
    removedTitle: "Buy SpawnPK Gold – Trill &amp; Cash Bag Rates | RSPS Gold Hub",
  },
};
const expectedIndexable = ["index.html", ...serverFiles, ...guideFiles];
const failures = [];
const warnings = [];
const pages = [];
const inboundLinks = new Map();
const faqOwners = new Map();

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

function warn(file, message) {
  warnings.push(`${file}: ${message}`);
}

function firstMatch(source, pattern) {
  const match = source.match(pattern);
  return match ? match[1].trim() : "";
}

function stripTags(value) {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:nbsp|amp|quot|#39);/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value) {
  return stripTags(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

const approvedSharedOperationalBlocks = new Set(
  [
    "The final price depends on the amount you need, stock and demand.",
    "Rates start from $1 per 1B. The final price depends on the amount you need, stock and demand.",
    "Rates start from $3.50 per 1M PKP. The final price depends on the amount you need, stock and demand.",
    "Rates start from $9 per 1T. The final price depends on the amount you need, stock and demand.",
    "Impact rates start from $1 per 1B. The final price depends on how much you need, how much gold is in stock and current demand.",
    "Rates start from $3.50 per 1M PKP. The final price depends on the amount you need, current stock and demand.",
    "Rates start from $9 per 1T. The final price depends on how many trills you need, stock and demand.",
    "Once the amount and quote are confirmed, follow the transfer instructions agreed on Discord.",
  ].map(normalize),
);

function expectedCanonical(file) {
  return file === "index.html" ? `${siteOrigin}/` : `${siteOrigin}/${file}`;
}

function getAttribute(tag, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return firstMatch(tag, new RegExp(`\\b${escaped}\\s*=\\s*["']([^"']*)["']`, "i"));
}

function getMeta(source, name, property = false) {
  for (const match of source.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    const key = getAttribute(tag, property ? "property" : "name");
    if (key.toLowerCase() === name.toLowerCase()) return getAttribute(tag, "content");
  }
  return "";
}

function localTarget(fromFile, href) {
  if (!href || /^(?:https?:|mailto:|tel:|javascript:)/i.test(href)) return null;
  const [rawPath, hash = ""] = href.split("#", 2);
  const targetFile = rawPath
    ? path.resolve(root, path.dirname(fromFile), rawPath)
    : path.resolve(root, fromFile);
  return { targetFile, hash };
}

function jsonLdTypes(json) {
  const nodes = json?.["@graph"] || [json];
  return new Set(nodes.flatMap((node) => node?.["@type"] || []));
}

function shingles(text, size = 3) {
  const words = normalize(text).split(/\s+/).filter(Boolean);
  const result = new Set();
  for (let index = 0; index <= words.length - size; index += 1) {
    result.add(words.slice(index, index + size).join(" "));
  }
  return result;
}

function jaccard(left, right) {
  let intersection = 0;
  for (const item of left) if (right.has(item)) intersection += 1;
  const union = left.size + right.size - intersection;
  return union ? intersection / union : 0;
}

function visibleContentBlocks(source) {
  return [...source.matchAll(/<(p|h2|h3|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi)]
    .map((match) => stripTags(match[2]))
    .filter((text) => normalize(text).split(/\s+/).length >= 10)
    .filter((text) => !approvedSharedOperationalBlocks.has(normalize(text)))
    .filter(
      (text) =>
        !/independent third-party service/i.test(text) &&
        !/RSPS Gold Hub helps buyers connect/i.test(text) &&
        !/temporary access to (?:the )?.*?\baccount holding/i.test(text),
    );
}

function neutralizeServerTerms(text) {
  return normalize(
    text
      .replace(/\b(?:Roat\s+PKZ|Impact(?:\s+RSPS)?|SpawnPK)\b/gi, " server ")
      .replace(/\b(?:PK Points?|PKP|Cash Bags?|trills?|gold)\b/gi, " currency ")
      .replace(/\$\d+(?:\.\d+)?|\b\d+(?:\.\d+)?[MBT]?\b/gi, " value "),
  );
}

if (!fs.existsSync(root)) {
  console.error(`FAIL root does not exist: ${root}`);
  process.exit(1);
}

const htmlFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html"))
  .sort();

for (const file of htmlFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const titleMatches = [...source.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  const rawTitle = titleMatches[0]?.[1] || "";
  const title = rawTitle.trim();
  const descriptionTags = [...source.matchAll(/<meta\b[^>]*>/gi)].filter(
    (match) => getAttribute(match[0], "name").toLowerCase() === "description",
  );
  const description = getMeta(source, "description");
  const robots = getMeta(source, "robots").toLowerCase();
  const canonical = firstMatch(
    source,
    /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/i,
  );
  const h1s = [...source.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(
    (match) => stripTags(match[1]),
  );
  const indexable = !robots.includes("noindex");
  const ogTitle = getMeta(source, "og:title", true);
  const ogDescription = getMeta(source, "og:description", true);
  const ogUrl = getMeta(source, "og:url", true);
  const twitterCard = getMeta(source, "twitter:card");
  const twitterTitle = getMeta(source, "twitter:title");
  const twitterDescription = getMeta(source, "twitter:description");
  const main = firstMatch(source, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const ldTypes = new Set();
  let jsonLdCount = 0;

  if (!title) fail(file, "missing title");
  if (!description) fail(file, "missing meta description");
  if (titleMatches.length !== 1) {
    fail(file, `expected one title, found ${titleMatches.length}`);
  }
  if (descriptionTags.length !== 1) {
    fail(file, `expected one meta description, found ${descriptionTags.length}`);
  }
  if (/[\r\n]/.test(rawTitle)) {
    fail(file, "title must not contain a newline");
  }
  if (!robots) fail(file, "missing meta robots");
  if (h1s.length !== 1) fail(file, `expected one H1, found ${h1s.length}`);
  if (!canonical) fail(file, "missing canonical");
  if (canonical && canonical !== expectedCanonical(file)) {
    fail(file, `canonical is ${canonical}; expected ${expectedCanonical(file)}`);
  }
  if (!ogTitle || !ogDescription || !ogUrl) fail(file, "incomplete Open Graph metadata");
  if (!twitterCard || !twitterTitle || !twitterDescription) {
    fail(file, "incomplete Twitter metadata");
  }
  if (ogUrl && ogUrl !== expectedCanonical(file)) {
    fail(file, `og:url is ${ogUrl}; expected ${expectedCanonical(file)}`);
  }
  const expectedMetadata = modernMetadata[file];
  if (expectedMetadata) {
    for (const [label, actual, expected] of [
      ["title", title, expectedMetadata.title],
      ["meta description", description, expectedMetadata.description],
      ["og:title", ogTitle, expectedMetadata.ogTitle],
      ["og:description", ogDescription, expectedMetadata.ogDescription],
      ["twitter:title", twitterTitle, expectedMetadata.twitterTitle],
      ["twitter:description", twitterDescription, expectedMetadata.twitterDescription],
    ]) {
      if (actual !== expected) {
        fail(file, `${label} does not match the approved concise metadata`);
      }
    }
    if (source.includes(expectedMetadata.removedTitle)) {
      fail(file, "removed long metadata title is still present");
    }
  }
  const expectedGuide = guideRequirements[file];
  if (expectedGuide) {
    for (const [label, actual, expected] of [
      ["title", title, expectedGuide.title],
      ["meta description", description, expectedGuide.description],
      ["H1", h1s[0] || "", expectedGuide.h1],
    ]) {
      if (actual !== expected) fail(file, `${label} does not match the approved guide metadata or heading`);
    }
  }

  for (const match of source.matchAll(
    /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi,
  )) {
    jsonLdCount += 1;
    try {
      const json = JSON.parse(match[1]);
      for (const type of jsonLdTypes(json)) ldTypes.add(type);
    } catch (error) {
      fail(file, `invalid JSON-LD (${error.message})`);
    }
  }
  if (file !== "404.html" && !jsonLdCount) fail(file, "missing JSON-LD");
  if (serverFiles.includes(file)) {
    for (const type of ["WebPage", "Service", "BreadcrumbList"]) {
      if (!ldTypes.has(type)) fail(file, `JSON-LD missing ${type}`);
    }
  }
  if (expectedGuide) {
    for (const type of expectedGuide.schema) {
      if (!ldTypes.has(type)) fail(file, `guide JSON-LD missing ${type}`);
    }
    for (const prohibitedType of ["Product", "Offer", "Review", "AggregateRating"]) {
      if (ldTypes.has(prohibitedType)) {
        fail(file, `educational guide must not use ${prohibitedType} schema`);
      }
    }
  }

  for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
    const tag = match[0];
    const src = getAttribute(tag, "src");
    if (!/\balt=["'][^"']*["']/i.test(tag)) {
      fail(file, `image is missing alt text: ${src || tag}`);
    }
    if (!/\bwidth=["']\d+["']/i.test(tag) || !/\bheight=["']\d+["']/i.test(tag)) {
      fail(file, `image is missing width/height: ${src || tag}`);
    }
    if (src && !/^(?:https?:|data:)/i.test(src)) {
      const assetPath = path.resolve(root, path.dirname(file), src);
      if (!fs.existsSync(assetPath)) fail(file, `missing image asset ${src}`);
    }
  }

  const ids = new Set();
  for (const match of source.matchAll(/<[a-z][^>]*\bid=["'][^"']+["'][^>]*>/gi)) {
    const id = getAttribute(match[0], "id");
    if (ids.has(id)) fail(file, `duplicate HTML id ${id}`);
    ids.add(id);
  }

  for (const match of source.matchAll(/<a\b[^>]*>/gi)) {
    const tag = match[0];
    const href = getAttribute(tag, "href");
    if (!href) continue;
    if (/^https?:/i.test(href)) {
      if (getAttribute(tag, "target") !== "_blank") {
        fail(file, `external link missing target="_blank": ${href}`);
      }
      const rel = getAttribute(tag, "rel").toLowerCase().split(/\s+/);
      if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
        fail(file, `external link missing noopener noreferrer: ${href}`);
      }
    }
    if (href.includes("discord.com/users/")) {
      if (href !== `https://discord.com/users/${discordId}`) {
        fail(file, `Discord link does not use the approved user ID: ${href}`);
      }
    }
    const target = localTarget(file, href);
    if (!target) continue;
    if (!fs.existsSync(target.targetFile)) {
      fail(file, `broken internal link ${href}`);
      continue;
    }
    if (
      target.targetFile.startsWith(root) &&
      target.targetFile.endsWith(".html") &&
      path.basename(target.targetFile) !== file
    ) {
      const targetName = path.basename(target.targetFile);
      inboundLinks.set(targetName, (inboundLinks.get(targetName) || 0) + 1);
    }
    if (target.hash) {
      const targetSource = fs.readFileSync(target.targetFile, "utf8");
      const escaped = target.hash.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!new RegExp(`\\bid=["']${escaped}["']`, "i").test(targetSource)) {
        fail(file, `missing fragment target ${href}`);
      }
    }
  }

  const pageFaqQuestions = new Set();
  for (const match of source.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)) {
    const question = normalize(match[1]);
    if (!question) continue;
    if (pageFaqQuestions.has(question)) {
      fail(file, `duplicate FAQ question within page: ${question}`);
    }
    pageFaqQuestions.add(question);
    if (legacyServerFileSet.has(file)) continue;
    const owners = faqOwners.get(question) || [];
    faqOwners.set(question, [...owners, file]);
  }

  const visible = stripTags(source);
  const forbiddenClaims = [
    [/\b100%\s+safe\b/i, "100% safe"],
    [/\binstant delivery\b/i, "instant delivery"],
    [/\b(?:gold|currency|stock)\s+is always available\b|\balways in stock\b/i, "always available/in stock"],
    [/\b\d[\d,]*\+\s+(?:customers|orders|trades)\b/i, "numeric customer/order count"],
    [/\bmoney[- ]back guarantee\b/i, "money-back guarantee"],
    [/\bguaranteed delivery\b/i, "guaranteed delivery"],
    [/\bmost popular RSPS\b/i, "most popular RSPS"],
    [/\blargest market\b/i, "largest market"],
    [/\bmost buyers\b/i, "most buyers"],
    [/\bbest[- ]selling server\b/i, "best-selling server"],
    [/\b(?:number one|#1)\s+(?:RSPS|server)\b/i, "number-one server"],
  ];
  for (const [pattern, label] of forbiddenClaims) {
    if (pattern.test(visible)) fail(file, `forbidden or undocumented claim: ${label}`);
  }

  if (serverFiles.includes(file)) {
    if (!indexable) fail(file, "commercial server page must be index, follow");
    if (!new RegExp(`discord\\.com/users/${discordId}`, "i").test(source)) {
      fail(file, "commercial server page missing approved Discord CTA");
    }
    if (!/<(?:a|button)\b[^>]*>(?:[\s\S]*?)(?:quote|discord|request)(?:[\s\S]*?)<\/(?:a|button)>/i.test(source)) {
      fail(file, "commercial server page missing a visible quote/request CTA");
    }
    if (!/<details\b/i.test(source)) fail(file, "commercial server page missing FAQ content");
  }

  const pathPatterns = [
    /[A-Z]:\\(?:Users|Documents|Downloads|AppData)\\/i,
    /C:\/Users\//i,
    /127\.0\.0\.1|localhost:\d+/i,
  ];
  for (const pattern of pathPatterns) {
    if (pattern.test(source)) fail(file, "contains a local path or local server address");
  }

  pages.push({
    file,
    title,
    description,
    robots,
    canonical,
    h1: h1s[0] || "",
    indexable,
    main,
    ldTypes,
  });
}

const homepageSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const homepageCardOrder = [
  ...homepageSource.matchAll(
    /<article\b[^>]*\bclass=["'][^"']*\bserver-card\b[^"']*["'][^>]*>[\s\S]*?<a\b[^>]*\bclass=["'][^"']*\bserver-logo\b[^"']*["'][^>]*\bhref=["']([^"']+)["']/gi,
  ),
].map((match) => match[1]);
for (let index = 0; index < priorityServerCards.length; index += 1) {
  if (homepageCardOrder[index] !== priorityServerCards[index]) {
    fail(
      "index.html",
      `server-card priority position ${index + 1} is ${homepageCardOrder[index] || "missing"}; expected ${priorityServerCards[index]}`,
    );
  }
}

const homepageGuideLinks = [
  ...homepageSource.matchAll(/<a\b[^>]*\bhref=["']guides\.html["'][^>]*>/gi),
];
if (!homepageGuideLinks.length) fail("index.html", "homepage is missing its guide-hub link");
if (
  homepageGuideLinks.some(
    (match) => getAttribute(match[0], "data-action") !== "guides-hub",
  )
) {
  fail("index.html", "homepage guide-hub links must use data-action guides-hub");
}

const guideHubSource = fs.existsSync(path.join(root, "guides.html"))
  ? fs.readFileSync(path.join(root, "guides.html"), "utf8")
  : "";
if (guideHubSource) {
  for (const [guideFile, action] of [
    ["impact-guide.html", "open-impact-guide"],
    ["roat-pkz-guide.html", "open-roat-pkz-guide"],
    ["spawnpk-guide.html", "open-spawnpk-guide"],
  ]) {
    const matches = [
      ...guideHubSource.matchAll(
        new RegExp(`<a\\b[^>]*\\bhref=["']${guideFile}["'][^>]*>`, "gi"),
      ),
    ];
    if (!matches.length) fail("guides.html", `missing guide-directory link to ${guideFile}`);
    if (matches.some((match) => getAttribute(match[0], "data-action") !== action)) {
      fail("guides.html", `${guideFile} links must use data-action ${action}`);
    }
  }
  for (const [salesFile, action] of [
    ["impact-gold.html", "guide-to-impact-gold"],
    ["roat-pkz-gold.html", "guide-to-roat-pkz-gold"],
    ["spawnpk-gold.html", "guide-to-spawnpk-gold"],
  ]) {
    const match = guideHubSource.match(
      new RegExp(`<a\\b[^>]*\\bhref=["']${salesFile}["'][^>]*>`, "i"),
    );
    if (!match) fail("guides.html", `missing educational-card link to ${salesFile}`);
    else if (getAttribute(match[0], "data-action") !== action) {
      fail("guides.html", `${salesFile} link must use data-action ${action}`);
    }
  }
}

for (const [salesFile, guideFile, label, action] of [
  [
    "impact-gold.html",
    "impact-guide.html",
    "Read the Impact Gold & Progression Guide",
    "open-impact-guide",
  ],
  [
    "roat-pkz-gold.html",
    "roat-pkz-guide.html",
    "Read the Roat PKZ PKP & Gear Guide",
    "open-roat-pkz-guide",
  ],
  [
    "spawnpk-gold.html",
    "spawnpk-guide.html",
    "Read the SpawnPK Trills & Cash Bags Guide",
    "open-spawnpk-guide",
  ],
]) {
  const source = fs.readFileSync(path.join(root, salesFile), "utf8");
  const link = source.match(
    new RegExp(`<a\\b[^>]*\\bhref=["']${guideFile}["'][^>]*>([\\s\\S]*?)<\\/a>`, "i"),
  );
  if (!link) fail(salesFile, `missing compact guide link to ${guideFile}`);
  else {
    if (normalize(link[1]) !== normalize(label)) fail(salesFile, `guide link label must be "${label}"`);
    if (getAttribute(link[0], "data-action") !== action) {
      fail(salesFile, `guide link must use data-action ${action}`);
    }
  }
}

for (const file of articleGuideFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const main = firstMatch(source, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const requirement = guideRequirements[file];
  if (!/<nav\b[^>]*\bclass=["'][^"']*\bbreadcrumbs\b/i.test(main)) {
    fail(file, "guide is missing visible breadcrumbs");
  }
  if (!/<aside\b[^>]*\bclass=["'][^"']*\bguide-toc\b/i.test(main)) {
    fail(file, "guide is missing its table of contents");
  }
  if (!/<time\b[^>]*\bdatetime=["']2026-07-24["'][^>]*>July 24, 2026<\/time>/i.test(main)) {
    fail(file, "guide is missing the approved Last reviewed date");
  }
  if (!/Sources and Further Reading/i.test(main)) fail(file, "guide is missing sources and further reading");
  if (!/Server-rules note:/i.test(main)) fail(file, "guide is missing its visible server-rules note");
  if (/<code\b[^>]*>\s*::gamble\s*<\/code>/i.test(main)) {
    fail(file, "::gamble must appear as ordinary sentence text");
  }
  if (/\b(?:guaranteed profit|profit is guaranteed)\b/i.test(stripTags(main))) {
    fail(file, "guide must not add a guaranteed profit claim");
  }

  const salesLinks = [
    ...main.matchAll(
      new RegExp(`<a\\b[^>]*\\bhref=["']${requirement.salesPage}["'][^>]*>`, "gi"),
    ),
  ];
  if (salesLinks.length !== 2) {
    fail(file, `expected exactly two main commercial links to ${requirement.salesPage}, found ${salesLinks.length}`);
  }
  if (
    salesLinks.some(
      (match) => getAttribute(match[0], "data-action") !== requirement.salesAction,
    )
  ) {
    fail(file, `sales-page links must use data-action ${requirement.salesAction}`);
  }

  const copyButtons = [
    ...main.matchAll(
      /<button\b[^>]*\bclass=["'][^"']*\bcopy-btn\b[^"']*["'][^>]*>([\s\S]*?)<\/button>/gi,
    ),
  ];
  if (
    copyButtons.length !== 1 ||
    stripTags(copyButtons[0][1]) !== requirement.copyLabel ||
    getAttribute(copyButtons[0][0], "data-action") !== "guide-copy-request" ||
    !getAttribute(copyButtons[0][0], "data-copy-target")
  ) {
    fail(file, "guide copy request must use the approved label, target and analytics action");
  }

  for (const relatedFile of articleGuideFiles.filter((item) => item !== file)) {
    if (!new RegExp(`href=["']${relatedFile}["']`, "i").test(main)) {
      fail(file, `guide is missing related link to ${relatedFile}`);
    }
  }
  if (!/href=["']guides\.html["']/i.test(main)) fail(file, "guide is missing its back link to guides.html");
  if (!/href=["']index\.html["']/i.test(main)) fail(file, "guide is missing its homepage link");
}

const impactGuideSource = fs.existsSync(path.join(root, "impact-guide.html"))
  ? fs.readFileSync(path.join(root, "impact-guide.html"), "utf8")
  : "";
const impactGuideVisible = stripTags(impactGuideSource);
if (!/\b1B means one billion coins\b/i.test(impactGuideVisible)) {
  fail("impact-guide.html", "guide must explain that 1B means one billion coins");
}
if (!impactGuideVisible.includes("$1 per 1B")) {
  fail("impact-guide.html", "guide CTA must retain the approved $1 per 1B rate");
}
if (!/lucky win at ::gamble/i.test(impactGuideVisible)) {
  fail("impact-guide.html", "guide must mention ::gamble as an unreliable possible bank source");
}

const roatGuideSource = fs.existsSync(path.join(root, "roat-pkz-guide.html"))
  ? fs.readFileSync(path.join(root, "roat-pkz-guide.html"), "utf8")
  : "";
const roatGuideVisible = stripTags(roatGuideSource);
if (!/\bPKP means PK Points\b/i.test(roatGuideVisible)) {
  fail("roat-pkz-guide.html", "guide must explain that PKP means PK Points");
}
if (!/\b1M PKP means one million PK Points\b/i.test(roatGuideVisible)) {
  fail("roat-pkz-guide.html", "guide must explain the 1M PKP unit");
}
if (!/Donation Credits[\s\S]{0,120}\bseparate from PKP\b/i.test(roatGuideVisible)) {
  fail("roat-pkz-guide.html", "guide must keep Donation Credits separate from standard PKP orders");
}
if (!roatGuideVisible.includes("$3.50 per 1M PKP")) {
  fail("roat-pkz-guide.html", "guide CTA must retain the approved $3.50 per 1M PKP rate");
}
if (!/Gambling can result in losses and should not be treated as a reliable way to build PKP\./i.test(roatGuideVisible)) {
  fail("roat-pkz-guide.html", "guide is missing the approved gambling-risk statement");
}

const spawnpkGuideSource = fs.existsSync(path.join(root, "spawnpk-guide.html"))
  ? fs.readFileSync(path.join(root, "spawnpk-guide.html"), "utf8")
  : "";
const spawnpkGuideVisible = stripTags(spawnpkGuideSource);
for (const [pattern, message] of [
  [/\b1T means one trillion coins\b/i, "guide must explain that 1T means one trillion coins"],
  [/\bEach Cash Bag represents 100M coins\b/i, "guide must explain the 100M Cash Bag value"],
  [/\bCash Bag is not a separate currency\b/i, "guide must not treat Cash Bags as a separate currency"],
  [/\btransfer can use coins, Cash Bags or a combination\b/i, "guide must explain mixed transfer formats"],
]) {
  if (!pattern.test(spawnpkGuideVisible)) fail("spawnpk-guide.html", message);
}
if (!spawnpkGuideVisible.includes("$9 per 1T")) {
  fail("spawnpk-guide.html", "guide CTA must retain the approved $9 per 1T rate");
}
const conversionSentence =
  "Because one Cash Bag represents 100M coins, 1T is equal in value to 10,000 Cash Bags.";
if (spawnpkGuideVisible.split(conversionSentence).length - 1 !== 1) {
  fail("spawnpk-guide.html", "Cash Bag conversion example must appear exactly once");
}

for (let leftIndex = 0; leftIndex < articleGuideFiles.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < articleGuideFiles.length; rightIndex += 1) {
    const left = pages.find((page) => page.file === articleGuideFiles[leftIndex]);
    const right = pages.find((page) => page.file === articleGuideFiles[rightIndex]);
    if (!left || !right) continue;
    const score = jaccard(shingles(left.main), shingles(right.main));
    if (score > 0.55) {
      fail(
        `${left.file}, ${right.file}`,
        `guide main-content similarity ${(score * 100).toFixed(1)}% exceeds 55%`,
      );
    }
  }
}

const interactionScript = fs.readFileSync(path.join(root, "script.js"), "utf8");
if (!/new CustomEvent\(["']rspshub:interaction["']/i.test(interactionScript)) {
  fail("script.js", "missing the rspshub:interaction event");
}
if (!/querySelectorAll\(["']\[data-action\]:not\(\.copy-btn\)["']\)/i.test(interactionScript)) {
  fail("script.js", "non-copy guide analytics hooks are not connected to the interaction event");
}

const spawnPage = pages.find((page) => page.file === "spawnpk-gold.html");
if (spawnPage) {
  const spawnSource = fs.readFileSync(path.join(root, spawnPage.file), "utf8");
  const spawnVisible = stripTags(spawnPage.main);
  const expectedSpawnMessage =
    "Hi, I’m looking to buy SpawnPK gold.\n\nAmount needed: 10T\n\nWhat rate and stock are currently available?";
  const spawnMessage = firstMatch(
    spawnSource,
    /<pre\b[^>]*\bid=["']spawnpk-order-message["'][^>]*>([\s\S]*?)<\/pre>/i,
  )
    .replace(/\r/g, "")
    .trim();

  if (!/\bcash bags?\b/i.test(spawnVisible) || !/\btrill(?:ion|ions|s)?\b|\b\d+\s*T\b/i.test(spawnVisible)) {
    fail("spawnpk-gold.html", "missing required Cash Bag and trill-based terminology");
  }
  if (/\bblood money\b|\bBM\b/i.test(spawnVisible)) {
    fail("spawnpk-gold.html", "must not market Blood Money or BM");
  }
  if (spawnPage.h1 !== "Buy SpawnPK Gold") {
    fail("spawnpk-gold.html", "SpawnPK H1 must be Buy SpawnPK Gold");
  }

  const spawnRateMatches = [...spawnVisible.matchAll(/\$9\s+per\s+1T/gi)];
  for (const match of spawnRateMatches) {
    const prefix = spawnVisible.slice(Math.max(0, match.index - 50), match.index);
    if (!/(?:from|start(?:s|ing)?\s+from|begin(?:s|ning)?\s+from|rates?\s+from:)\s*$/i.test(prefix)) {
      fail("spawnpk-gold.html", '$9 per 1T must always be qualified as "from", "starts from", or "begins from"');
    }
  }
  if (!spawnRateMatches.length) {
    fail("spawnpk-gold.html", "missing the approved from $9 per 1T rate");
  }
  if (/\bStarting price\b/i.test(spawnVisible)) {
    fail("spawnpk-gold.html", 'must not use "Starting price"');
  }
  if (
    /\b(?:No password needed|No login credentials are ever required|Never share any game-account password)\b/i.test(
      spawnVisible,
    )
  ) {
    fail("spawnpk-gold.html", "contains absolute password or login wording");
  }
  for (const forbiddenTerminology of [
    /\bcurrency or Cash Bags?\b/i,
    /\bCash Bag supply\b/i,
    /\bCash Bag availability\b/i,
    /\bCash Bag price\b/i,
    /\bCash Bags currently available\b/i,
    /\bplayer-supplied Cash Bags\b/i,
    /\bHave SpawnPK Gold or Cash Bags to Sell\b/i,
    /\bCash Bags are a separate (?:SpawnPK )?currency\b/i,
  ]) {
    if (forbiddenTerminology.test(spawnSource)) {
      fail(
        "spawnpk-gold.html",
        `misleading Cash Bag terminology: ${forbiddenTerminology.source}`,
      );
    }
  }

  for (const required of [
    "SpawnPK gold is usually traded in trills.",
    "Custom Gear, Competitive PvP End-Game Raids",
    "Why Do Players Buy SpawnPK Gold?",
    "SpawnPK Gold Rates Availability",
    "How SpawnPK Gold and Cash Bags Work",
    "Cash Bags are not a separate SpawnPK currency.",
    "Each Cash Bag represents 100M coins",
    "A normal coin stack is limited to roughly 2.147B coins, so Cash Bags are useful for the much larger amounts traded on SpawnPK.",
    "How a SpawnPK Gold Order Works",
    "How Does SpawnPK Gold Reach Our Stock?",
    "Have SpawnPK Gold to Sell?",
    "Check the Discord Identity Before Trading",
    "Tell Us How Many Trills You Need",
    "This website is an independent third-party service and is not affiliated with or endorsed by SpawnPK.",
  ]) {
    if (!spawnVisible.includes(required)) {
      fail("spawnpk-gold.html", `missing required buyer-facing content: ${required}`);
    }
  }
  for (const requiredFactor of [
    "Total gold requested",
    "Available player-supplied gold",
    "Current buyer demand",
  ]) {
    if (!spawnVisible.includes(requiredFactor)) {
      fail("spawnpk-gold.html", `missing SpawnPK rate factor: ${requiredFactor}`);
    }
  }
  if (
    !/\bA buyer normally does not need to provide a SpawnPK login\b/i.test(spawnVisible) ||
    !/\btemporary access to the (?:SpawnPK )?account holding the gold\b/i.test(spawnVisible) ||
    !/\bNever provide email access, recovery (?:details|methods), authenticator backup codes, payment(?:-account)? credentials\b/i.test(
      spawnVisible,
    )
  ) {
    fail("spawnpk-gold.html", "missing the required buyer-versus-seller account-access distinction");
  }
  if (spawnMessage !== expectedSpawnMessage) {
    fail("spawnpk-gold.html", "SpawnPK order message does not match the approved server-specific text");
  }
  const spawnCopyButtons = [
    ...spawnSource.matchAll(
      /<button\b[^>]*\bdata-copy-target=["']spawnpk-order-message["'][^>]*>/gi,
    ),
  ];
  if (spawnCopyButtons.length !== 2) {
    fail(
      "spawnpk-gold.html",
      `expected two copy buttons connected to the SpawnPK order message, found ${spawnCopyButtons.length}`,
    );
  }
  if (
    spawnCopyButtons.some(
      (match) =>
        !/\bdata-copy-success=["']Request copied["']/i.test(match[0]) ||
        !/\bdata-action=["']copy-spawnpk-order["']/i.test(match[0]),
    )
  ) {
    fail("spawnpk-gold.html", "SpawnPK copy buttons must use the approved success state and tracking action");
  }

  const spawnSteps = firstMatch(
    spawnSource,
    /<section\b[^>]*\bid=["']how-to-order["'][^>]*>([\s\S]*?)<\/section>/i,
  );
  const spawnStepCount = (spawnSteps.match(/<article\b[^>]*\bclass=["'][^"']*\bstep-card\b/gi) || [])
    .length;
  if (spawnStepCount !== 3) {
    fail("spawnpk-gold.html", `expected three SpawnPK buying steps, found ${spawnStepCount}`);
  }
  for (const requiredAnchor of [
    "#rates",
    "#why-buy",
    "#how-to-order",
    "#cash-bags",
    "#source",
    "#safety",
    "#faq",
  ]) {
    if (!new RegExp(`<a\\b[^>]*\\bhref=["']${requiredAnchor}["']`, "i").test(spawnSource)) {
      fail("spawnpk-gold.html", `missing SpawnPK header navigation anchor ${requiredAnchor}`);
    }
  }
  for (const requiredFaq of [
    "How much does SpawnPK gold cost?",
    "What does 1T mean?",
    "What are SpawnPK Cash Bags?",
    "Should I request gold or Cash Bags?",
    "How do I check the current rate and stock?",
    "Why do players buy SpawnPK gold?",
    "Where does the SpawnPK gold come from?",
    "Can I sell my SpawnPK gold?",
    "Will a buyer need to provide a SpawnPK login?",
    "Is third-party SpawnPK trading risk-free?",
  ]) {
    if (!spawnVisible.includes(requiredFaq)) {
      fail("spawnpk-gold.html", `missing required SpawnPK FAQ: ${requiredFaq}`);
    }
  }
  for (const [label, href] of [
    ["Buy Impact Gold", "impact-gold.html"],
    ["Buy RoatPKZ Gold", "roat-pkz-gold.html"],
    ["Browse all supported RSPS servers", "index.html#servers"],
    ["Request an unlisted server", "other-rsps-gold.html"],
  ]) {
    const linkPattern = new RegExp(
      `<a\\b[^>]*\\bhref=["']${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>${label}</a>`,
      "i",
    );
    if (!linkPattern.test(spawnSource)) {
      fail("spawnpk-gold.html", `missing approved related link ${label} -> ${href}`);
    }
  }
  if (
    !/<a\b[^>]*\bhref=["']https:\/\/www\.spawnpk\.net\/["'][^>]*\btarget=["']_blank["'][^>]*\brel=["']noopener noreferrer["'][^>]*>Official server reference: SpawnPK website<\/a>/i.test(
      spawnSource,
    )
  ) {
    fail("spawnpk-gold.html", "missing the approved secured official SpawnPK website reference");
  }
  for (const forbiddenType of ["Product", "Offer", "Review", "AggregateRating"]) {
    if (spawnPage.ldTypes.has(forbiddenType)) {
      fail("spawnpk-gold.html", `unsupported structured-data type ${forbiddenType}`);
    }
  }
}

const roatPage = pages.find((page) => page.file === "roat-pkz-gold.html");
if (roatPage) {
  const roatSource = fs.readFileSync(path.join(root, roatPage.file), "utf8");
  const roatVisible = stripTags(roatPage.main);
  const expectedRoatMessage =
    "Hi, I’m looking to buy Roat PKZ PKP.\n\nAmount needed: 50M PKP\n\nPlease let me know the current rate and how much is available.";
  const roatMessage = firstMatch(
    roatSource,
    /<pre\b[^>]*\bid=["']roat-pkz-order-message["'][^>]*>([\s\S]*?)<\/pre>/i,
  )
    .replace(/\r/g, "")
    .trim();

  if (roatPage.h1 !== "Buy Roat PKZ Gold") {
    fail("roat-pkz-gold.html", "Roat PKZ H1 must be Buy Roat PKZ Gold");
  }

  const roatRateMatches = [...roatVisible.matchAll(/\$3\.50\s+per\s+1M(?:\s+PKP)?/gi)];
  for (const match of roatRateMatches) {
    const prefix = roatVisible.slice(Math.max(0, match.index - 50), match.index);
    if (!/(?:from|start(?:s|ing)?\s+from|begin(?:s|ning)?\s+from|rates?\s+from:)\s*$/i.test(prefix)) {
      fail("roat-pkz-gold.html", '$3.50 per 1M must always be qualified as "from", "starts from", or "begins from"');
    }
  }
  if (!roatRateMatches.length) {
    fail("roat-pkz-gold.html", "missing the approved from $3.50 per 1M rate");
  }
  if (/\bStarting price\b/i.test(roatVisible)) {
    fail("roat-pkz-gold.html", 'must not use "Starting price"');
  }
  const roatBrandVisible = roatVisible;
  if (/\b(?:Roat Pkz|RoatPKZ|Roatz)\b/.test(roatBrandVisible)) {
    fail("roat-pkz-gold.html", "visible content must consistently use Roat PKZ");
  }

  for (const required of [
    "Buy PKP for PvP gear, replacement sets and supplies.",
    "Why Do Players Buy Roat PKZ Gold?",
    "Roat PKZ PKP Rates and Availability",
    "What Currency Do Roat PKZ Gold Orders Use?",
    "How Do We Source Roat PKZ Gold?",
    "Looking to Sell Roat PKZ Gold?",
    "Confirm Who You Are Trading With",
    "Tell Us How Much PKP You Need",
    "This website is an independent third-party service and is not affiliated with or endorsed by Roat PKZ.",
  ]) {
    if (!roatVisible.includes(required)) {
      fail("roat-pkz-gold.html", `missing required buyer-facing content: ${required}`);
    }
  }
  for (const requiredFactor of [
    "Requested PKP amount",
    "Currency currently available",
    "Active buying and selling demand",
  ]) {
    if (!roatVisible.includes(requiredFactor)) {
      fail("roat-pkz-gold.html", `missing Roat PKZ rate factor: ${requiredFactor}`);
    }
  }
  if (
    !/\bA buyer normally does not need to share a Roat PKZ login\b/i.test(roatVisible) ||
    !/\btemporary access to the (?:Roat PKZ )?account holding the PKP\b/i.test(roatVisible) ||
    !/\bEmail access, recovery details, authenticator backup codes and payment-account credentials must remain private\b/i.test(roatVisible)
  ) {
    fail("roat-pkz-gold.html", "missing the required buyer-versus-seller account-access distinction");
  }
  if (roatMessage !== expectedRoatMessage) {
    fail("roat-pkz-gold.html", "Roat PKZ order message does not match the approved server-specific text");
  }
  if (
    !new RegExp(
      `<button\\b[^>]*\\bdata-copy-target=["']roat-pkz-order-message["'][^>]*>`,
      "i",
    ).test(roatSource)
  ) {
    fail("roat-pkz-gold.html", "missing copy button connected to the Roat PKZ order message");
  }

  const roatSteps = firstMatch(
    roatSource,
    /<section\b[^>]*\bid=["']how-to-order["'][^>]*>([\s\S]*?)<\/section>/i,
  );
  const roatStepCount = (roatSteps.match(/<article\b[^>]*\bclass=["'][^"']*\bstep-card\b/gi) || [])
    .length;
  if (roatStepCount !== 3) {
    fail("roat-pkz-gold.html", `expected three Roat PKZ buying steps, found ${roatStepCount}`);
  }
  const roatFaq = firstMatch(
    roatSource,
    /<section\b[^>]*\bid=["']faq["'][^>]*>([\s\S]*?)<\/section>/i,
  );
  const requiredRoatFaqQuestions = [
    "How much does Roat PKZ PKP cost?",
    "What does 1M PKP mean?",
    "Are PK Points and Donation Credits the same?",
    "Can the quoted rate change for a larger order?",
    "How do I sell PKP to a6d9?",
    "Will a buyer need to provide a Roat PKZ login?",
    "What information may be requested during a direct sell transfer?",
    "Can third-party PKP trading affect my account?",
  ];
  for (const question of requiredRoatFaqQuestions) {
    if (!stripTags(roatFaq).includes(question)) {
      fail("roat-pkz-gold.html", `missing required PKP FAQ question: ${question}`);
    }
  }
  for (const forbiddenType of ["Product", "Offer", "Review", "AggregateRating"]) {
    if (roatPage.ldTypes.has(forbiddenType)) {
      fail("roat-pkz-gold.html", `unsupported structured-data type ${forbiddenType}`);
    }
  }
}

const impactPage = pages.find((page) => page.file === "impact-gold.html");
if (impactPage) {
  const impactSource = fs.readFileSync(path.join(root, impactPage.file), "utf8");
  const impactVisible = stripTags(impactPage.main);
  const expectedImpactMessage =
    "Hi, I want to buy Impact gold.\n\nAmount: 50B\n\nWhat is the current price and stock?";
  const impactMessage = firstMatch(
    impactSource,
    /<pre\b[^>]*\bid=["']impact-order-message["'][^>]*>([\s\S]*?)<\/pre>/i,
  )
    .replace(/\r/g, "")
    .trim();

  if (impactPage.h1 !== "Buy Impact RSPS Gold") {
    fail("impact-gold.html", "Impact H1 must be Buy Impact RSPS Gold");
  }

  for (const match of impactVisible.matchAll(/\$1\s+per\s+1B/gi)) {
    const prefix = impactVisible.slice(Math.max(0, match.index - 40), match.index);
    if (!/(?:from|start(?:s|ing)?\s+from|lowest possible rate is\s+from)\s*$/i.test(prefix)) {
      fail("impact-gold.html", '$1 per 1B must always be qualified as "from" or "starting from"');
    }
  }
  if (![...impactVisible.matchAll(/\$1\s+per\s+1B/gi)].length) {
    fail("impact-gold.html", "missing the approved from $1 per 1B rate");
  }

  const internalSeoTerms = [
    /search[- ]led priority/i,
    /query[- ]to[- ]page/i,
    /search console/i,
    /\b(?:clicks|impressions|CTR|average position)\b/i,
    /must rank for/i,
    /keyword planning/i,
    /first[- ]party glossar/i,
  ];
  for (const pattern of internalSeoTerms) {
    if (pattern.test(impactVisible)) {
      fail("impact-gold.html", `contains public-facing internal SEO language: ${pattern}`);
    }
  }

  for (const required of [
    "Where Does the Impact Gold Come From?",
    "Do You Have Impact Gold to Sell?",
    "Verify the Discord Account Before Trading",
    "This website is an independent third-party service and is not affiliated with or endorsed by Impact.",
  ]) {
    if (!impactVisible.includes(required)) {
      fail("impact-gold.html", `missing required buyer-facing content: ${required}`);
    }
  }
  if (
    !/\bThe Impact gold we sell comes from other players\b/i.test(impactVisible) ||
    !/\bPvM drops\b/i.test(impactVisible) ||
    !/::gamble/i.test(impactVisible)
  ) {
    fail("impact-gold.html", "Impact sourcing section is missing required player-supply context");
  }
  if (impactMessage !== expectedImpactMessage) {
    fail("impact-gold.html", "Impact order message does not match the approved server-specific text");
  }
  if (
    !new RegExp(
      `<button\\b[^>]*\\bdata-copy-target=["']impact-order-message["'][^>]*>`,
      "i",
    ).test(impactSource)
  ) {
    fail("impact-gold.html", "missing copy button connected to the Impact order message");
  }

  const impactSteps = firstMatch(
    impactSource,
    /<section\b[^>]*\bid=["']how-to-order["'][^>]*>([\s\S]*?)<\/section>/i,
  );
  const impactStepCount = (impactSteps.match(/<article\b[^>]*\bclass=["'][^"']*\bstep-card\b/gi) || [])
    .length;
  if (impactStepCount !== 3) {
    fail("impact-gold.html", `expected three Impact buying steps, found ${impactStepCount}`);
  }
  for (const forbiddenType of ["Product", "Offer", "Review", "AggregateRating"]) {
    if (impactPage.ldTypes.has(forbiddenType)) {
      fail("impact-gold.html", `unsupported structured-data type ${forbiddenType}`);
    }
  }
}

for (const [leftPage, rightPage] of [
  [roatPage, impactPage],
  [spawnPage, impactPage],
  [spawnPage, roatPage],
]) {
  if (!leftPage || !rightPage) continue;
  const leftBlocks = visibleContentBlocks(leftPage.main);
  const rightBlocks = visibleContentBlocks(rightPage.main);
  const rightName =
    rightPage.file === "impact-gold.html"
      ? "Impact"
      : rightPage.file === "roat-pkz-gold.html"
        ? "Roat PKZ"
        : "SpawnPK";
  for (const leftBlock of leftBlocks) {
    const neutralLeft = neutralizeServerTerms(leftBlock);
    const leftShingles = shingles(neutralLeft);
    for (const rightBlock of rightBlocks) {
      const neutralRight = neutralizeServerTerms(rightBlock);
      const score = jaccard(leftShingles, shingles(neutralRight));
      if (neutralLeft === neutralRight || score >= 0.72) {
        fail(
          leftPage.file,
          `text block is too similar to ${rightName} after neutralizing server, currency, and rate terms (${(score * 100).toFixed(1)}%): ${leftBlock.slice(0, 90)}`,
        );
      }
    }
  }
}

for (const file of expectedIndexable) {
  const page = pages.find((item) => item.file === file);
  if (!page) fail(file, "expected indexable page is missing");
  else if (!page.indexable) fail(file, "expected indexable page is noindex");
}

for (const page of pages.filter(
  (item) => item.indexable && item.file !== "index.html" && item.file !== "404.html",
)) {
  if (!inboundLinks.get(page.file)) fail(page.file, "indexable page has no internal inbound link");
}

for (const field of ["title", "description", "h1"]) {
  const groups = new Map();
  for (const page of pages.filter((item) => item.indexable)) {
    const value = normalize(page[field]);
    if (!value) continue;
    groups.set(value, [...(groups.get(value) || []), page.file]);
  }
  for (const [value, files] of groups) {
    if (files.length > 1) fail(files.join(", "), `duplicate ${field}: ${value}`);
  }
}

for (const [question, files] of faqOwners) {
  if (files.length > 1) {
    fail(files.join(", "), `duplicate FAQ question: ${question}`);
  }
}

for (let leftIndex = 0; leftIndex < serverFiles.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < serverFiles.length; rightIndex += 1) {
    const left = pages.find((page) => page.file === serverFiles[leftIndex]);
    const right = pages.find((page) => page.file === serverFiles[rightIndex]);
    if (!left || !right) continue;
    const score = jaccard(shingles(left.main), shingles(right.main));
    const approvedLegacyPair =
      legacyServerFileSet.has(left.file) && legacyServerFileSet.has(right.file);
    if (score > 0.55 && !approvedLegacyPair) {
      fail(
        `${left.file}, ${right.file}`,
        `main-content 3-word-shingle similarity ${(score * 100).toFixed(1)}% exceeds 55%`,
      );
    } else if (score > 0.4) {
      warn(
        `${left.file}, ${right.file}`,
        `main-content similarity is ${(score * 100).toFixed(1)}%`,
      );
    }
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  fail("sitemap.xml", "missing file");
} else {
  const sitemapSource = fs.readFileSync(sitemapPath, "utf8");
  if (!/^\s*<\?xml\b/.test(sitemapSource) || !/<urlset\b[^>]*>[\s\S]*<\/urlset>\s*$/i.test(sitemapSource)) {
    fail("sitemap.xml", "invalid or incomplete XML structure");
  }
  const urlOpen = (sitemapSource.match(/<url>/g) || []).length;
  const urlClose = (sitemapSource.match(/<\/url>/g) || []).length;
  if (urlOpen !== urlClose) fail("sitemap.xml", "unbalanced url elements");
  const sitemapUrls = new Set(
    [...sitemapSource.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim()),
  );
  const expectedUrls = new Set(expectedIndexable.map(expectedCanonical));
  for (const url of expectedUrls) {
    if (!sitemapUrls.has(url)) fail("sitemap.xml", `missing expected server URL ${url}`);
  }
  for (const url of sitemapUrls) {
    if (!expectedUrls.has(url)) fail("sitemap.xml", `contains non-indexable or unknown URL ${url}`);
  }
  if (sitemapUrls.size !== expectedUrls.size) {
    fail("sitemap.xml", `expected ${expectedUrls.size} unique URLs, found ${sitemapUrls.size}`);
  }
  for (const match of sitemapSource.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
    const value = match[1].trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      fail("sitemap.xml", `lastmod must use YYYY-MM-DD: ${value}`);
      continue;
    }
    const date = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(date.valueOf())) fail("sitemap.xml", `invalid lastmod ${value}`);
    else if (date > new Date(Date.now() + 86_400_000)) fail("sitemap.xml", `future lastmod ${value}`);
  }
}

const manifestPath = path.join(root, "site.webmanifest");
try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.name || !manifest.short_name || !manifest.start_url) {
    fail("site.webmanifest", "missing required name, short_name, or start_url");
  }
  if (!Array.isArray(manifest.icons) || !manifest.icons.length) {
    fail("site.webmanifest", "missing icons");
  }
  for (const icon of manifest.icons || []) {
    const iconPath = path.resolve(root, String(icon.src || "").replace(/^\//, ""));
    if (!fs.existsSync(iconPath)) fail("site.webmanifest", `missing icon ${icon.src}`);
  }
} catch (error) {
  fail("site.webmanifest", `invalid JSON (${error.message})`);
}

const robotsPath = path.join(root, "robots.txt");
if (!fs.existsSync(robotsPath)) fail("robots.txt", "missing file");
else {
  const robotsSource = fs.readFileSync(robotsPath, "utf8");
  if (!robotsSource.includes(`Sitemap: ${siteOrigin}/sitemap.xml`)) {
    fail("robots.txt", "missing canonical sitemap declaration");
  }
}

const publishableFiles = fs
  .readdirSync(root)
  .filter((file) => /\.(?:html|css|js|mjs|json|xml|txt|md)$/i.test(file));
for (const file of publishableFiles) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  if (/[A-Z]:\\Users\\|C:\/Users\//i.test(source)) {
    fail(file, "contains a local Windows user path");
  }
  if (/BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY/i.test(source)) {
    fail(file, "contains private-key material");
  }
}

const rawGscFiles = fs
  .readdirSync(root)
  .filter((file) => /(?:queries|pages|devices|countries|search.?appearance|chart)\.(?:csv|xlsx)$/i.test(file));
if (rawGscFiles.length) fail(rawGscFiles.join(", "), "raw Search Console export must not be committed");

console.log(
  `Checked ${htmlFiles.length} HTML files, ${expectedIndexable.length} expected indexable pages, ${serverFiles.length} commercial server pages, ${guideFiles.length} guide pages, homepage card priority, pricing/content/message requirements, guide facts and analytics, sitemap, manifest, links, schema, claims, and content similarity.`,
);
for (const message of warnings) console.log(`WARN ${message}`);
if (failures.length) {
  for (const message of failures) console.error(`FAIL ${message}`);
  console.error(`SEO check failed with ${failures.length} issue(s).`);
  process.exit(1);
}
console.log("SEO check passed.");
