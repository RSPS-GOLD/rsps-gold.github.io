import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const siteOrigin = "https://rsps-gold.com";
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
const impactArticleFiles = [
  "impact-donator-benefits-guide.html",
  "impact-money-making-guide.html",
  "impact-gemstone-crab-guide.html",
  "impact-theatre-of-blood-guide.html",
  "impact-tombs-of-amascut-guide.html",
  "impact-chambers-of-xeric-guide.html",
  "impact-slayer-guide.html",
  "impact-thieving-guide.html",
  "impact-hunter-guide.html",
];
const serverHubFiles = ["roat-pkz-guide.html", "spawnpk-guide.html"];
const roatArticleFiles = [
  "roat-pkz-starter-guide.html",
  "roat-pkz-donator-ranks-guide.html",
  "roat-pkz-money-making-guide.html",
];
const spawnpkArticleFiles = [
  "spawnpk-starter-guide.html",
  "spawnpk-donator-ranks-guide.html",
  "spawnpk-money-making-guide.html",
];
const guideFiles = [
  "guides.html",
  "impact-guide.html",
  ...impactArticleFiles,
  ...serverHubFiles,
  ...roatArticleFiles,
  ...spawnpkArticleFiles,
];
const articleGuideFiles = [
  ...impactArticleFiles,
  ...roatArticleFiles,
  ...spawnpkArticleFiles,
];
const guideRequirements = {
  "guides.html": {
    title: "RSPS Gold Guides – Impact, Roat PKZ &amp; SpawnPK",
    description:
      "Explore practical Impact, Roat PKZ and SpawnPK guides covering currencies, gear planning, PvM, PvP and realistic account budgets.",
    h1: "RSPS Gold Guides",
    schema: ["WebPage", "CollectionPage", "BreadcrumbList"],
  },
  "impact-guide.html": {
    title: "Impact Guides – Raids, Money Making &amp; Skills",
    description:
      "Explore original Impact guides for Donator benefits, money making, raids, Gemstone Crab, Slayer, Thieving, Hunter and account progression.",
    h1: "Impact Guides",
    schema: ["WebPage", "CollectionPage", "BreadcrumbList"],
  },
  "impact-donator-benefits-guide.html": {
    title: "Impact RSPS Donator Ranks: Requirements &amp; Benefits",
    description:
      "Compare all 9 Impact RSPS Donator ranks, Spent Impax requirements, benefits and boss access, then calculate the GP needed for your next rank.",
    h1: "Impact RSPS Donator Ranks: Benefits and Requirements",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Rank requirements and benefits may change. Verify current information using the official Impact rank page, keyboard shortcuts, and Impact game rules.",
    schema: ["WebPage", "Article", "BreadcrumbList"],
  },
  "impact-money-making-guide.html": {
    title: "Impact RSPS Money Making Guide: Best GP Methods",
    description:
      "Compare the best Impact RSPS money-making methods for beginners, mass bossing, high-level PvM and PvP, with requirements, risk and upgrade advice.",
    h1: "Impact RSPS Money Making Guide: Best GP Methods",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Drops, rewards, prices and requirements can change. Verify current information using the official Money Making page, Getting Started, Armoured Zombies, Phantom Muspah, PvM Guides, Commands and Impact game rules.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "impact-gemstone-crab-guide.html": {
    title: "Impact Gemstone Crab Guide: Location, Drops &amp; Profit",
    description:
      "Find Gemstone Crab through the Spirit Tree at Home, meet the 12-hour voting requirement, survive its attacks and collect noted sapphire, dragonstone or onyx drops.",
    h1: "Impact Gemstone Crab Guide: Location, Drops and Profit",
    usesCompactSources: true,
    sourceNote:
      "Current access was checked against the supplied in-game Spirit Tree interface. The voting requirement, damage behaviour, healing guidance, three-location hole rotation and loot details were checked against the supplied screenshots and current player information. Content reviewed July 26, 2026.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "impact-theatre-of-blood-guide.html": {
    title: "Impact Theatre of Blood Guide: Verzik, Gear &amp; Phases",
    description:
      "Reach Impact Theatre of Blood from the Spirit Tree at Home, compare best-in-slot to budget gear and learn Verzik’s three phases, safe tiles and Hard Mode.",
    h1: "Impact Theatre of Blood Guide: Verzik, Gear and Phases",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Mechanics and gear tiers were checked against the Impact Wiki Theatre of Blood page. The access route was checked against the supplied Spirit Tree screenshot, and the setup images are player examples rather than mandatory loadouts. Content reviewed July 26, 2026.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "impact-tombs-of-amascut-guide.html": {
    title: "Impact ToA Guide: Invocations, Gear &amp; Wardens",
    description:
      "Reach Impact Tombs of Amascut from the Spirit Tree, compare high-level to budget setups, and learn invocations, Warden phases, tiles and enrage.",
    h1: "Impact Tombs of Amascut Guide: Wardens, Gear and Invocations",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Setup tiers, invocation lists and Wardens mechanics were checked against the Impact Wiki Tombs of Amascut page. The current access route was checked against the supplied Spirit Tree menu, and the Phase 1 and Phase 2 positions were illustrated with supplied in-game screenshots. Content reviewed July 26, 2026.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "impact-chambers-of-xeric-guide.html": {
    title: "Impact CoX Guide: Great Olm Roles, Gear &amp; Phases",
    description:
      "Reach Impact Chambers of Xeric from the Spirit Tree, mark Olm role tiles, compare trio and duo positions, choose gear and learn all four phases.",
    h1: "Impact Chambers of Xeric Guide: Olm Roles and Phases",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Access, setup tiers, Olm phases, prayer responses and special attacks were checked against the Impact Wiki Chambers of Xeric page. The current access route was checked against the supplied Spirit Tree interface, and role positioning was illustrated with the supplied in-game images. Content reviewed July 26, 2026.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "impact-slayer-guide.html": {
    title: "Impact RSPS Slayer Guide: Tasks, Levels &amp; Locations",
    description:
      "Train Slayer in Impact RSPS with normal, hard and elite task levels, Slayer point rewards, recommended blocks, monster locations and progression advice.",
    h1: "Impact RSPS Slayer Guide: Tasks, Levels and Locations",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Task pools, locations, reward costs and requirements can change. Verify current information using the official Slayer page, Getting Started, Commands, Maps, Home Area, PvM Guides and Impact game rules.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "impact-thieving-guide.html": {
    title: "Impact RSPS Thieving Guide: 1–99 Levels &amp; Locations",
    description:
      "Train Thieving from 1–99 in Impact RSPS with the Home starter route, Ardougne stall levels, Gem stalls, Arvel pickpocketing and clear directions.",
    h1: "Impact RSPS Thieving Guide: 1–99 Levels and Locations",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Level requirements, rewards and mechanics can change. Verify current target names and interactions using the official Thieving page, Getting Started, Home Area, Commands, Maps, Skilling Pets and Impact rules.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "impact-hunter-guide.html": {
    title: "Impact RSPS Hunter Guide: 1–99 Levels &amp; Locations",
    description:
      "Train Hunter from 1–99 in Impact RSPS with bird, chinchompa and black chinchompa routes, trap limits, Hunter Island directions and Wilderness advice.",
    h1: "Impact RSPS Hunter Guide: 1–99 Levels and Locations",
    salesPage: "impact-gold.html",
    salesAction: "impact-guide-to-gold",
    salesLinkCount: 1,
    usesCompactSources: true,
    sourceNote:
      "Creature locations, prices and mechanics can change. Verify the current teleport menu and Wilderness conditions using the official Hunter page, Getting Started, Home Area, Commands and Shops.",
    schema: [
      "Organization",
      "WebSite",
      "WebPage",
      "Article",
      "BreadcrumbList",
      "FAQPage",
    ],
  },
  "roat-pkz-guide.html": {
    title: "Roat Pkz Guides: Starter, Donator &amp; Money Making",
    description:
      "Browse independent Roat Pkz guides for beginner progression, Donator ranks and current PKP money-making methods.",
    h1: "Roat Pkz Guides",
    schema: ["Organization", "WebSite", "WebPage", "CollectionPage", "BreadcrumbList", "ItemList"],
  },
  "spawnpk-guide.html": {
    title: "SpawnPK Guides: Starter, Donator &amp; Money Making",
    description:
      "Browse independent SpawnPK guides for beginner progression, Donator benefits and current money-making methods.",
    h1: "SpawnPK Guides",
    schema: ["Organization", "WebSite", "WebPage", "CollectionPage", "BreadcrumbList", "ItemList"],
  },
  "roat-pkz-starter-guide.html": {
    title: "Roat Pkz Starter Guide: Commands, Kits &amp; Progression",
    description:
      "Start Roat Pkz with account security, item spawning, Custom Kits, shops, voting, PK Points and a practical first-hour progression route.",
    h1: "Roat Pkz Starter Guide: Commands, Kits and Progression",
    usesCompactSources: true,
    schema: ["Organization", "WebSite", "WebPage", "Article", "BreadcrumbList", "FAQPage"],
  },
  "roat-pkz-donator-ranks-guide.html": {
    title: "Roat Pkz Donator Ranks: Benefits &amp; Comparison",
    description:
      "Compare all six Roat Pkz Donator ranks, including commands, zones, drop-rate bonuses, bank slots, Trading Post capacity and rank-specific benefits.",
    h1: "Roat Pkz Donator Ranks: Benefits and Comparison",
    usesCompactSources: true,
    schema: ["Organization", "WebSite", "WebPage", "Article", "BreadcrumbList", "FAQPage"],
  },
  "roat-pkz-money-making-guide.html": {
    title: "Roat Pkz Money Making Guide: Best PKP Methods",
    description:
      "Compare Roat Pkz money-making methods including Wilderness bosses, Tormented Demons, Nex, Royal Revenants, Daily Tasks and Impling hunting.",
    h1: "Roat Pkz Money Making Guide: Best PKP Methods",
    usesCompactSources: true,
    schema: ["Organization", "WebSite", "WebPage", "Article", "BreadcrumbList", "FAQPage"],
  },
  "spawnpk-starter-guide.html": {
    title: "SpawnPK Starter Guide: Best Beginner Route &amp; Upgrades",
    description:
      "Follow the best SpawnPK beginner route: compare Trained and PKer modes, check current events, complete dailies, vote, learn the economy and plan first upgrades.",
    h1: "SpawnPK Starter Guide: Best Beginner Route and First Upgrades",
    usesCompactSources: true,
    schema: ["Organization", "WebSite", "WebPage", "Article", "BreadcrumbList", "FAQPage"],
  },
  "spawnpk-donator-ranks-guide.html": {
    title: "SpawnPK Donator Ranks: Benefits &amp; Requirements",
    description:
      "Compare all eight SpawnPK Donator ranks, cumulative benefits, total-donated requirements, zones, spawner limits and Mythic vs Cosmic value.",
    h1: "SpawnPK Donator Ranks: Benefits, Requirements and Comparison",
    usesCompactSources: true,
    schema: ["Organization", "WebSite", "WebPage", "Article", "BreadcrumbList", "FAQPage"],
  },
  "spawnpk-money-making-guide.html": {
    title: "SpawnPK Money Making Guide: Best Methods &amp; Profit",
    description:
      "Compare SpawnPK voting, daily tasks, PvM, raids and merching for beginner and advanced accounts by risk, consistency and estimated net profit.",
    h1: "SpawnPK Money Making Guide: Best Methods from Beginner to Advanced",
    usesCompactSources: true,
    schema: ["Organization", "WebSite", "WebPage", "Article", "BreadcrumbList", "FAQPage"],
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

function extractSharedGuideFaq(source) {
  const section = firstMatch(
    source,
    /<section\b[^>]*\bid=["']faq["'][^>]*>([\s\S]*?)<\/section>/i,
  );
  return [...section.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/gi)]
    .map((match) => {
      const item = match[1];
      return {
        question: normalize(
          firstMatch(
            item,
            /<span\b[^>]*\bclass=["'][^"']*\bguide-faq__question\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
          ),
        ),
        answer: normalize(
          firstMatch(
            item,
            /<div\b[^>]*\bclass=["'][^"']*\bguide-faq__answer\b[^"']*["'][^>]*>\s*<p\b[^>]*>([\s\S]*?)<\/p>/i,
          ),
        ),
      };
    })
    .filter((item) => item.question && item.answer);
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
  const bodyVisible = stripTags(firstMatch(source, /<body\b[^>]*>([\s\S]*?)<\/body>/i));
  const reviewDateVisible = bodyVisible;
  const ldTypes = new Set();
  let jsonLdCount = 0;

  for (const [pattern, label] of [
    [/\blast (?:reviewed|verified|checked|updated)\b/i, "Last reviewed/verified/checked/updated"],
    [/\b(?:reviewed|verified) on\b/i, "Reviewed/verified on"],
    [/\b(?:page|guide) (?:reviewed|verified)\b/i, "Page/guide reviewed or verified"],
    [/\b(?:review|verification|verified) date\b/i, "review or verification date"],
    [/\bsince this review\b/i, "since this review"],
    [
      /\b(?:page|guide|information|details|facts|requirements|benefits) (?:was |were )?(?:reviewed|verified|checked) against\b/i,
      "editorial content checked against a source",
    ],
    [
      /\b(?:reviewed|verified|checked|updated):\s*(?:\d{4}-\d{2}-\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})\b/i,
      "dated editorial label",
    ],
  ]) {
    if (
      ![
        "impact-gemstone-crab-guide.html",
        "impact-theatre-of-blood-guide.html",
        "impact-tombs-of-amascut-guide.html",
        "impact-chambers-of-xeric-guide.html",
      ].includes(file) &&
      pattern.test(reviewDateVisible)
    ) {
      fail(file, `visible review-date wording remains: ${label}`);
    }
  }

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
  const faqScope = source.replace(
    /<details\b[^>]*\bclass=["'][^"']*\bguide-sources-compact\b[^"']*["'][^>]*>[\s\S]*?<\/details>/gi,
    "",
  );
  for (const match of faqScope.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)) {
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
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
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
  const donatorGuideLink = guideHubSource.match(
    /<a\b[^>]*\bhref=["']impact-donator-benefits-guide\.html["'][^>]*>/i,
  );
  if (!donatorGuideLink) {
    fail("guides.html", "missing descriptive link to impact-donator-benefits-guide.html");
  } else if (
    getAttribute(donatorGuideLink[0], "data-action") !==
    "open-impact-donator-benefits-guide"
  ) {
    fail(
      "guides.html",
      "Impact Donator rank guide link must use data-action open-impact-donator-benefits-guide",
    );
  }
  const moneyGuideLink = guideHubSource.match(
    /<a\b[^>]*\bhref=["']impact-money-making-guide\.html["'][^>]*>/i,
  );
  if (!moneyGuideLink) {
    fail("guides.html", "missing descriptive link to impact-money-making-guide.html");
  } else if (
    getAttribute(moneyGuideLink[0], "data-action") !==
    "open-impact-money-making-guide"
  ) {
    fail(
      "guides.html",
      "Impact money-making guide link must use data-action open-impact-money-making-guide",
    );
  }
}

for (const [salesFile, guideFile, label, action] of [
  [
    "impact-gold.html",
    "impact-guide.html",
    "Browse Impact Guides",
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

const impactHubSource = fs.readFileSync(path.join(root, "impact-guide.html"), "utf8");
const impactHubMain = firstMatch(impactHubSource, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
const impactHubCards =
  impactHubMain.match(/<a\b[^>]*\bclass=["'][^"']*\bserver-guide-card\b/gi) || [];
if (impactHubCards.length !== impactArticleFiles.length) {
  fail("impact-guide.html", `expected nine Impact guide cards, found ${impactHubCards.length}`);
}
for (const file of impactArticleFiles) {
  const action = `open-${file.replace(/\.html$/, "")}`;
  const links = [
    ...impactHubMain.matchAll(
      new RegExp(`<a\\b[^>]*\\bhref=["']${file}["'][^>]*>`, "gi"),
    ),
  ];
  if (links.length !== 1) fail("impact-guide.html", `expected one hub card link to ${file}`);
  if (links.some((match) => getAttribute(match[0], "data-action") !== action)) {
    fail("impact-guide.html", `${file} must use data-action ${action}`);
  }
}
if (!/href=["']#impact-guide-library["'][^>]*data-action=["']impact-guides-hub["']/i.test(impactHubMain)) {
  fail("impact-guide.html", "Browse Impact Guides must scroll to the library with data-action impact-guides-hub");
}
if (!/href=["']impact-gold\.html["'][^>]*data-action=["']impact-guide-to-gold["']/i.test(impactHubMain)) {
  fail("impact-guide.html", "hub is missing the Impact gold CTA analytics action");
}

const relatedImpactGuides = {
  "impact-donator-benefits-guide.html": [
    "impact-money-making-guide.html",
    "impact-slayer-guide.html",
    "impact-guide.html",
  ],
  "impact-money-making-guide.html": [
    "impact-thieving-guide.html",
    "impact-slayer-guide.html",
    "impact-gemstone-crab-guide.html",
  ],
  "impact-gemstone-crab-guide.html": [
    "impact-guide.html",
    "impact-money-making-guide.html",
    "impact-slayer-guide.html",
  ],
  "impact-theatre-of-blood-guide.html": [
    "impact-tombs-of-amascut-guide.html",
    "impact-chambers-of-xeric-guide.html",
    "impact-money-making-guide.html",
  ],
  "impact-tombs-of-amascut-guide.html": [
    "impact-theatre-of-blood-guide.html",
    "impact-chambers-of-xeric-guide.html",
    "impact-money-making-guide.html",
  ],
  "impact-chambers-of-xeric-guide.html": [
    "impact-guide.html",
    "impact-money-making-guide.html",
    "impact-theatre-of-blood-guide.html",
    "impact-tombs-of-amascut-guide.html",
  ],
  "impact-slayer-guide.html": [
    "impact-money-making-guide.html",
    "impact-gemstone-crab-guide.html",
    "impact-hunter-guide.html",
  ],
  "impact-thieving-guide.html": [
    "impact-money-making-guide.html",
    "impact-hunter-guide.html",
    "impact-slayer-guide.html",
  ],
  "impact-hunter-guide.html": [
    "impact-slayer-guide.html",
    "impact-thieving-guide.html",
    "impact-money-making-guide.html",
  ],
};
const relatedServerGuides = {
  "roat-pkz-starter-guide.html": [
    "roat-pkz-money-making-guide.html",
    "roat-pkz-donator-ranks-guide.html",
    "roat-pkz-guide.html",
  ],
  "roat-pkz-donator-ranks-guide.html": [
    "roat-pkz-starter-guide.html",
    "roat-pkz-money-making-guide.html",
    "roat-pkz-guide.html",
  ],
  "roat-pkz-money-making-guide.html": [
    "roat-pkz-starter-guide.html",
    "roat-pkz-donator-ranks-guide.html",
    "roat-pkz-guide.html",
  ],
  "spawnpk-starter-guide.html": [
    "spawnpk-money-making-guide.html",
    "spawnpk-donator-ranks-guide.html",
    "spawnpk-guide.html",
  ],
  "spawnpk-donator-ranks-guide.html": [
    "spawnpk-starter-guide.html",
    "spawnpk-money-making-guide.html",
    "spawnpk-guide.html",
  ],
  "spawnpk-money-making-guide.html": [
    "spawnpk-starter-guide.html",
    "spawnpk-donator-ranks-guide.html",
    "spawnpk-guide.html",
  ],
};

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
  if (requirement.usesCompactSources) {
    if (
      !/<details\b[^>]*\bclass=["'][^"']*\bguide-sources-compact\b[^"']*["'][^>]*\bid=["']sources["']/i.test(
        main,
      )
    ) {
      fail(file, "guide is missing its compact sources disclosure");
    }
  } else {
    if (!/Sources and Further Reading/i.test(main)) {
      fail(file, "guide is missing sources and further reading");
    }
    if (!/Server-rules note:/i.test(main)) {
      fail(file, "guide is missing its visible server-rules note");
    }
  }
  if (/<code\b[^>]*>\s*::gamble\s*<\/code>/i.test(main)) {
    fail(file, "::gamble must appear as ordinary sentence text");
  }
  if (/\b(?:guaranteed profit|profit is guaranteed)\b/i.test(stripTags(main))) {
    fail(file, "guide must not add a guaranteed profit claim");
  }

  if (requirement.salesPage) {
    const salesLinks = [
      ...main.matchAll(
        new RegExp(`<a\\b[^>]*\\bhref=["']${requirement.salesPage}["'][^>]*>`, "gi"),
      ),
    ];
    const expectedSalesLinkCount = requirement.salesLinkCount ?? 2;
    if (salesLinks.length !== expectedSalesLinkCount) {
      fail(
        file,
        `expected exactly ${expectedSalesLinkCount} main commercial links to ${requirement.salesPage}, found ${salesLinks.length}`,
      );
    }
    if (
      salesLinks.some(
        (match) => getAttribute(match[0], "data-action") !== requirement.salesAction,
      )
    ) {
      fail(file, `sales-page links must use data-action ${requirement.salesAction}`);
    }
  }

  const copyButtons = [
    ...main.matchAll(
      /<button\b[^>]*\bclass=["'][^"']*\bcopy-btn\b[^"']*["'][^>]*>([\s\S]*?)<\/button>/gi,
    ),
  ];
  if (requirement.copyLabel) {
    const expectedCopyAction = impactArticleFiles.includes(file)
      ? "impact-guide-copy-request"
      : "guide-copy-request";
    if (
      copyButtons.length !== 1 ||
      stripTags(copyButtons[0][1]) !== requirement.copyLabel ||
      getAttribute(copyButtons[0][0], "data-action") !== expectedCopyAction ||
      !getAttribute(copyButtons[0][0], "data-copy-target")
    ) {
      fail(file, "guide copy request must use the approved label, target and analytics action");
    }
  } else if (copyButtons.length) {
    fail(file, "this guide must link to the Impact gold page without a copy-message component");
  }

  const expectedRelated = relatedImpactGuides[file] || relatedServerGuides[file] || [];
  for (const relatedFile of expectedRelated) {
    if (!new RegExp(`href=["']${relatedFile}["']`, "i").test(main)) {
      fail(file, `guide is missing related link to ${relatedFile}`);
    }
  }
  if (!/href=["']guides\.html["']/i.test(main)) fail(file, "guide is missing its back link to guides.html");
  if (!/href=["']index\.html["']/i.test(main)) fail(file, "guide is missing its homepage link");
  if (impactArticleFiles.includes(file)) {
    if (!/href=["']impact-guide\.html["']/i.test(main)) {
      fail(file, "Impact article is missing its link to the Impact Guides hub");
    }
    if (!/<img\b[^>]*\bclass=["'][^"']*\bguide-article-hero__logo\b[^"']*["'][^>]*\bsrc=["']assets\/impact-logo\.png["']/i.test(main)) {
      fail(file, "Impact article is missing the existing Impact logo");
    }
    const currentCrumb = stripTags(
      firstMatch(main, /<span\b[^>]*\baria-current=["']page["'][^>]*>([\s\S]*?)<\/span>/i),
    );
    let breadcrumbName = "";
    let articleHeadline = "";
    for (const match of source.matchAll(
      /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi,
    )) {
      const json = JSON.parse(match[1]);
      const nodes = json?.["@graph"] || [json];
      const breadcrumb = nodes.find((node) => node?.["@type"] === "BreadcrumbList");
      const article = nodes.find((node) => node?.["@type"] === "Article");
      const breadcrumbItems = breadcrumb?.itemListElement || [];
      breadcrumbName = breadcrumbItems.at(-1)?.name || breadcrumbName;
      articleHeadline = article?.headline || articleHeadline;
    }
    if (!currentCrumb || breadcrumbName !== currentCrumb) {
      fail(file, "visible breadcrumb does not match BreadcrumbList schema");
    }
    if (articleHeadline !== requirement.h1) {
      fail(file, "Article schema headline does not match the H1");
    }
    const visible = stripTags(main);
    const sourceNote =
      requirement.sourceNote ||
      "Impact mechanics, rewards and requirements may change. Check the current official information before relying on a specific value or setup.";
    if (!normalize(visible).includes(normalize(sourceNote))) {
      fail(file, "Impact article is missing the approved source note");
    }
    if (/\b(?:guaranteed drops?|drops? (?:are|is) guaranteed)\b/i.test(visible)) {
      fail(file, "guide must not add a guaranteed drop claim");
    }
    const hasHourlyClaim =
      /\b\d[\d,.]*\s*[KMBT]?\s*(?:GP|coins?)\s*(?:per|\/)\s*hour\b/i.test(visible);
    const hasQualifiedCrabEstimate =
      file === "impact-gemstone-crab-guide.html" &&
      /\b(?:roughly|approximately|around)\s+100m\s+GP\s+per\s+hour\b/i.test(visible) &&
      /\bnot a guarantee\b/i.test(visible);
    if (hasHourlyClaim && !hasQualifiedCrabEstimate) {
      fail(file, "guide must not publish a fixed money-per-hour claim");
    }
    const wordCount = visible.split(/\s+/).filter(Boolean).length;
    const longGuide = /(?:money-making|slayer|theatre-of-blood|tombs-of-amascut|chambers-of-xeric)/.test(file);
    const minimumWords = longGuide ? 1300 : 900;
    if (wordCount < minimumWords) {
      fail(file, `guide has ${wordCount} visible words; expected at least ${minimumWords}`);
    }
  }
}

const roatDonatorFile = "roat-pkz-donator-ranks-guide.html";
const roatDonatorSource = fs.readFileSync(path.join(root, roatDonatorFile), "utf8");
const roatDonatorSectionOrder = [
  "quick-answer",
  "rank-ladder",
  "rank-finder",
  "comparison",
  "benefits-matrix",
  "obtaining-a-rank",
  "rank-details",
  "player-benefits",
  "rank-vs-vip",
  "currencies",
  "royal",
  "divine",
  "rank-recommendations",
  "limitations",
  "next-step",
  "faq",
  "sources",
];
const roatDonatorSectionPositions = roatDonatorSectionOrder.map((id) =>
  roatDonatorSource.indexOf(`id="${id}"`),
);
if (
  roatDonatorSectionPositions.some((position) => position < 0) ||
  roatDonatorSectionPositions.some(
    (position, index) =>
      index > 0 && position <= roatDonatorSectionPositions[index - 1],
  )
) {
  fail(roatDonatorFile, "required Donator-rank sections are missing or out of order");
}
if ((roatDonatorSource.match(/\bA6D9\b/g) || []).length !== 1) {
  fail(roatDonatorFile, "A6D9 must appear exactly once");
}
if (
  /"@type"\s*:\s*"(?:Product|Offer|Review|AggregateRating|HowTo)"/i.test(
    roatDonatorSource,
  )
) {
  fail(roatDonatorFile, "rank guide must not use commercial or review schema types");
}

const roatDonatorJsonLd = JSON.parse(
  firstMatch(
    roatDonatorSource,
    /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i,
  ),
);
const roatDonatorNodes = roatDonatorJsonLd?.["@graph"] || [];
const roatDonatorFaq = roatDonatorNodes.find(
  (node) => node?.["@type"] === "FAQPage",
);
const roatDonatorVisibleFaq = extractSharedGuideFaq(roatDonatorSource);
const roatDonatorSchemaFaq = (roatDonatorFaq?.mainEntity || []).map((item) => ({
  question: normalize(item?.name || ""),
  answer: normalize(item?.acceptedAnswer?.text || ""),
}));
if (
  roatDonatorVisibleFaq.length !== 17 ||
  JSON.stringify(roatDonatorVisibleFaq) !== JSON.stringify(roatDonatorSchemaFaq)
) {
  fail(
    roatDonatorFile,
    "17 visible Donator-rank FAQs must match FAQPage questions and answers exactly",
  );
}

const roatDonatorData = JSON.parse(
  firstMatch(
    roatDonatorSource,
    /<script\s+type=["']application\/json["']\s+id=["']roat-donator-rank-data["']>([\s\S]*?)<\/script>/i,
  ),
);
const expectedRoatRankOrder = [
  "donator",
  "super-donator",
  "extreme-donator",
  "legendary-donator",
  "royal-donator",
  "divine-donator",
];
if (
  JSON.stringify(roatDonatorData.map((rank) => rank.id)) !==
  JSON.stringify(expectedRoatRankOrder)
) {
  fail(roatDonatorFile, "central rank dataset must preserve the official six-rank order");
}

const impactMoneyVisible = stripTags(
  fs.readFileSync(path.join(root, "impact-money-making-guide.html"), "utf8"),
);
if (/\$\s*\d+(?:\.\d+)?\s+per\s+1B/i.test(impactMoneyVisible)) {
  fail("impact-money-making-guide.html", "guide must not contain a fixed gold-sales rate");
}
if (/Copy Order Message|impact-money-request/i.test(impactMoneyVisible)) {
  fail("impact-money-making-guide.html", "guide must not contain the copied order-message component");
}
if (!/Gambling[\s\S]{0,100}(?:not dependable|can lose)/i.test(impactMoneyVisible)) {
  fail("impact-money-making-guide.html", "guide is missing the approved gambling-risk statement");
}

const impactSlayerSource = fs.readFileSync(
  path.join(root, "impact-slayer-guide.html"),
  "utf8",
);
const impactSlayerMain = firstMatch(
  impactSlayerSource,
  /<main\b[^>]*>([\s\S]*?)<\/main>/i,
);
for (const requiredId of [
  "quick-answer",
  "getting-started",
  "slayer-levels",
  "completing-tasks",
  "monster-locations",
  "barrage-tasks",
  "block-list",
  "slayer-rewards",
  "gear",
  "boss-slayer",
  "mistakes",
  "checklist",
  "faq",
  "sources",
]) {
  if (!new RegExp(`\\bid=["']${requiredId}["']`, "i").test(impactSlayerMain)) {
    fail("impact-slayer-guide.html", `missing required Slayer section #${requiredId}`);
  }
}
for (const asset of [
  "assets/impact-slayer/duradel-location.webp",
  "assets/impact-slayer/slayer-points-store.webp",
]) {
  if (!impactSlayerSource.includes(`src="${asset}"`)) {
    fail("impact-slayer-guide.html", `missing required Slayer screenshot ${asset}`);
  }
}
for (const [range, points] of [
  ["1–64", "400"],
  ["65–84", "700"],
  ["85–99", "1,250"],
]) {
  const escapedRange = range.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (
    !new RegExp(
      `${escapedRange}[\\s\\S]{0,180}${points}\\s+points`,
      "i",
    ).test(impactSlayerMain)
  ) {
    fail(
      "impact-slayer-guide.html",
      `missing Slayer tier range ${range} with ${points} points`,
    );
  }
}
if (!/Bloodvelds[\s\S]{0,100}Hellhounds/i.test(impactSlayerMain)) {
  fail("impact-slayer-guide.html", "hard-task guidance must include Bloodvelds and Hellhounds");
}
if (!/Editorial recommendation\s+—\s+not an official Impact block list\./i.test(stripTags(impactSlayerMain))) {
  fail("impact-slayer-guide.html", "editorial block strategy is missing its source label");
}
const slayerCommercialTags = [
  ...impactSlayerMain.matchAll(
    /<a\b[^>]*\bhref=["']impact-gold\.html["'][^>]*>/gi,
  ),
].map((match) => match[0]);
if (
  slayerCommercialTags.length !== 1 ||
  getAttribute(slayerCommercialTags[0] || "", "target") !== "_blank" ||
  getAttribute(slayerCommercialTags[0] || "", "rel") !== "noopener" ||
  getAttribute(slayerCommercialTags[0] || "", "data-action") !==
    "impact-guide-to-gold" ||
  !/opens in a new tab/i.test(
    firstMatch(
      impactSlayerMain,
      /<a\b[^>]*\bhref=["']impact-gold\.html["'][^>]*>([\s\S]*?)<\/a>/i,
    ),
  )
) {
  fail(
    "impact-slayer-guide.html",
    "Slayer commercial CTA must be the single accessible noopener new-tab link",
  );
}

const visibleSlayerFaq = extractSharedGuideFaq(impactSlayerMain);
let schemaSlayerFaq = [];
for (const match of impactSlayerSource.matchAll(
  /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi,
)) {
  try {
    const json = JSON.parse(match[1]);
    const nodes = Array.isArray(json?.["@graph"]) ? json["@graph"] : [json];
    const faqNode = nodes.find((node) => node?.["@type"] === "FAQPage");
    if (faqNode) {
      schemaSlayerFaq = (faqNode.mainEntity || []).map((item) => ({
        question: normalize(item?.name || ""),
        answer: normalize(item?.acceptedAnswer?.text || ""),
      }));
    }
  } catch {
    // General JSON-LD parsing reports the syntax failure earlier.
  }
}
if (
  visibleSlayerFaq.length !== 12 ||
  schemaSlayerFaq.length !== visibleSlayerFaq.length ||
  visibleSlayerFaq.some(
    (item, index) =>
      item.question !== schemaSlayerFaq[index]?.question ||
      item.answer !== schemaSlayerFaq[index]?.answer,
  )
) {
  fail(
    "impact-slayer-guide.html",
    "visible Slayer FAQ must match FAQPage questions and answers exactly",
  );
}

const impactHunterSource = fs.readFileSync(
  path.join(root, "impact-hunter-guide.html"),
  "utf8",
);
const impactHunterMain = firstMatch(
  impactHunterSource,
  /<main\b[^>]*>([\s\S]*?)<\/main>/i,
);
for (const requiredId of [
  "quick-answer",
  "supplies",
  "hunter-island",
  "progression",
  "bird-route",
  "chinchompa-route",
  "black-chinchompas",
  "level-planner",
  "trap-limits",
  "wilderness-safety",
  "mistakes",
  "checklist",
  "faq",
  "sources",
]) {
  if (!new RegExp(`\\bid=["']${requiredId}["']`, "i").test(impactHunterMain)) {
    fail("impact-hunter-guide.html", `missing required Hunter section #${requiredId}`);
  }
}
for (const asset of [
  "assets/impact-hunter/hunter-traps-shop.webp",
  "assets/impact-hunter/hunter-island-teleport.webp",
  "assets/impact-hunter/hunter-island-bird-locations.webp",
  "assets/impact-hunter/hunter-island-chinchompa-locations.webp",
  "assets/impact-hunter/black-chinchompa-wilderness.webp",
]) {
  if (!impactHunterSource.includes(`src="${asset}"`)) {
    fail("impact-hunter-guide.html", `missing required Hunter screenshot ${asset}`);
  }
}
for (const [range, creature] of [
  ["1–4", "Crimson swift"],
  ["5–8", "Golden warbler"],
  ["9–18", "Copper longtail"],
  ["19", "Tropical wagtail"],
  ["20–39", "Tropical wagtail"],
  ["40–52", "Tropical wagtail"],
  ["53–59", "Grey chinchompa"],
  ["60–62", "Grey chinchompa"],
  ["63–72", "Red chinchompa"],
  ["73–79", "Choose your route"],
  ["80–99", "Continue your route"],
]) {
  const escapedRange = range.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`${escapedRange}[\\s\\S]{0,180}${creature}`, "i").test(impactHunterMain)) {
    fail(
      "impact-hunter-guide.html",
      `missing Hunter route range ${range} with ${creature}`,
    );
  }
}
for (const [range, count] of [
  ["1–19", "1"],
  ["20–39", "2"],
  ["40–59", "3"],
  ["60–79", "4"],
  ["80–99", "5"],
]) {
  const escapedRange = range.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`${escapedRange}[\\s\\S]{0,100}>${count}<`, "i").test(impactHunterMain)) {
    fail(
      "impact-hunter-guide.html",
      `missing Hunter trap limit ${range} with ${count} traps`,
    );
  }
}
if (
  !/Recommended progression based on the official creature unlocks\./i.test(
    stripTags(impactHunterMain),
  )
) {
  fail(
    "impact-hunter-guide.html",
    "recommended Hunter route is missing its editorial source label",
  );
}
if (
  !/\bid=["']hunter-level-planner["']/i.test(impactHunterMain) ||
  !/\bid=["']hunter-current-level["']/i.test(impactHunterMain) ||
  !/\bid=["']hunter-planner-result["'][^>]*\baria-live=["']polite["']/i.test(
    impactHunterMain,
  )
) {
  fail("impact-hunter-guide.html", "Hunter level planner markup is incomplete");
}
const hunterScriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
if (
  !/var\s+impactHunterData\s*=\s*\{/i.test(hunterScriptSource) ||
  !/function\s+initImpactHunterPlanner\s*\(/i.test(hunterScriptSource)
) {
  fail(
    "impact-hunter-guide.html",
    "Hunter planner must use one central data object and guarded initializer",
  );
}
const hunterCommercialTags = [
  ...impactHunterMain.matchAll(
    /<a\b[^>]*\bhref=["']impact-gold\.html["'][^>]*>/gi,
  ),
].map((match) => match[0]);
if (
  hunterCommercialTags.length !== 1 ||
  getAttribute(hunterCommercialTags[0] || "", "target") !== "_blank" ||
  getAttribute(hunterCommercialTags[0] || "", "rel") !== "noopener" ||
  getAttribute(hunterCommercialTags[0] || "", "data-action") !==
    "impact-guide-to-gold" ||
  !/opens in a new tab/i.test(
    firstMatch(
      impactHunterMain,
      /<a\b[^>]*\bhref=["']impact-gold\.html["'][^>]*>([\s\S]*?)<\/a>/i,
    ),
  )
) {
  fail(
    "impact-hunter-guide.html",
    "Hunter commercial CTA must be the single accessible noopener new-tab link",
  );
}

const hunterFaqSection = firstMatch(
  impactHunterMain,
  /<section\b[^>]*\bid=["']faq["'][^>]*>([\s\S]*?)<\/section>/i,
);
const visibleHunterFaq = extractSharedGuideFaq(impactHunterMain);
let schemaHunterFaq = [];
for (const match of impactHunterSource.matchAll(
  /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi,
)) {
  try {
    const json = JSON.parse(match[1]);
    const nodes = Array.isArray(json?.["@graph"]) ? json["@graph"] : [json];
    const faqNode = nodes.find((node) => node?.["@type"] === "FAQPage");
    if (faqNode) {
      schemaHunterFaq = (faqNode.mainEntity || []).map((item) => ({
        question: normalize(item?.name || ""),
        answer: normalize(item?.acceptedAnswer?.text || ""),
      }));
    }
  } catch {
    // General JSON-LD parsing reports the syntax failure earlier.
  }
}
if (
  visibleHunterFaq.length !== 12 ||
  schemaHunterFaq.length !== visibleHunterFaq.length ||
  visibleHunterFaq.some(
    (item, index) =>
      item.question !== schemaHunterFaq[index]?.question ||
      item.answer !== schemaHunterFaq[index]?.answer,
  )
) {
  fail(
    "impact-hunter-guide.html",
    "visible Hunter FAQ must match FAQPage questions and answers exactly",
  );
}

const impactThievingSource = fs.readFileSync(
  path.join(root, "impact-thieving-guide.html"),
  "utf8",
);
const impactThievingMain = firstMatch(
  impactThievingSource,
  /<main\b[^>]*>([\s\S]*?)<\/main>/i,
);
for (const requiredId of [
  "quick-answer",
  "progression",
  "home-route",
  "ardougne",
  "fur-stall",
  "silver-stall",
  "spice-stall",
  "gem-stall",
  "arvel",
  "level-planner",
  "comparison",
  "efficiency",
  "mistakes",
  "checklist",
  "faq",
  "sources",
]) {
  if (!new RegExp(`\\bid=["']${requiredId}["']`, "i").test(impactThievingMain)) {
    fail(
      "impact-thieving-guide.html",
      `missing required Thieving section #${requiredId}`,
    );
  }
}
for (const asset of [
  "assets/impact-thieving/home-thieving-route.webp",
  "assets/impact-thieving/ardougne-teleport.webp",
  "assets/impact-thieving/ardougne-fur-stall.webp",
  "assets/impact-thieving/ardougne-silver-stall.webp",
  "assets/impact-thieving/home-spice-stall.webp",
  "assets/impact-thieving/home-gem-stall.webp",
  "assets/impact-thieving/home-arvel-pickpocket.webp",
]) {
  const escapedAsset = asset.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (
    !new RegExp(
      `<img\\b[^>]*\\ssrc=["']${escapedAsset}["']`,
      "i",
    ).test(impactThievingSource)
  ) {
    fail(
      "impact-thieving-guide.html",
      `missing required Thieving screenshot ${asset}`,
    );
  }
}
for (const [range, target] of [
  ["1–4", "Man"],
  ["5–19", "Bakery stall"],
  ["20–34", "Silk stall"],
  ["35–49", "Fur Stall"],
  ["50–64", "Silver Stall"],
  ["65–74", "Highlighted Home stall"],
  ["75–99", "End stall at Home"],
  ["85–99", "Arvel alternative"],
]) {
  const escapedRange = range.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`${escapedRange}[\\s\\S]{0,350}${target}`, "i").test(impactThievingMain)) {
    fail(
      "impact-thieving-guide.html",
      `missing Thieving route range ${range} with ${target}`,
    );
  }
}
if (
  !/\bid=["']thieving-level-planner["']/i.test(impactThievingMain) ||
  !/\bid=["']thieving-current-level["'][^>]*\bmin=["']1["'][^>]*\bmax=["']99["']/i.test(
    impactThievingMain,
  ) ||
  !/\bid=["']thieving-planner-result["'][^>]*\baria-live=["']polite["']/i.test(
    impactThievingMain,
  )
) {
  fail(
    "impact-thieving-guide.html",
    "Thieving level planner markup is incomplete",
  );
}
const thievingScriptSource = fs.readFileSync(path.join(root, "script.js"), "utf8");
if (
  !/var\s+impactThievingData\s*=\s*\{/i.test(thievingScriptSource) ||
  !/function\s+initImpactThievingPlanner\s*\(/i.test(thievingScriptSource)
) {
  fail(
    "impact-thieving-guide.html",
    "Thieving planner must use one central data object and guarded initializer",
  );
}
for (const [marker, target, range] of [
  ["1", "Man", "1–4"],
  ["2", "Bakery stall", "5–19"],
  ["3", "Silk stall", "20–34"],
]) {
  if (
    !new RegExp(
      `thieving-home-card[\\s\\S]{0,300}thieving-home-card__number[^>]*>${marker}<\\/span>[\\s\\S]{0,300}<h3>${target}<\\/h3>[\\s\\S]{0,200}Levels ${range}`,
      "i",
    ).test(impactThievingMain)
  ) {
    fail(
      "impact-thieving-guide.html",
      `Home route card ${marker} must map to ${target}, levels ${range}`,
    );
  }
}
if (
  !/<img\b[^>]*\bclass=["'][^"']*\bthieving-hero__skill-icon\b[^"']*["'][^>]*\bsrc=["']assets\/guide-icons\/impact-thieving\.webp["'][^>]*\balt=["']["'][^>]*>/i.test(
    impactThievingMain,
  ) ||
  /\bthieving-hero__path\b/i.test(impactThievingMain) ||
  !/<span\b[^>]*\bclass=["'][^"']*\bhunter-hero__level\b[^"']*["'][^>]*>1–99<\/span>/i.test(
    impactThievingMain,
  )
) {
  fail(
    "impact-thieving-guide.html",
    "Thieving hero must use the local skill icon and Hunter-style 1–99 badge without milestone markup",
  );
}
if (
  /first stall on the left|stall marked 3|first starter stall|second starter stall/i.test(
    `${impactThievingMain}\n${thievingScriptSource}`,
  )
) {
  fail(
    "impact-thieving-guide.html",
    "Thieving route contains an outdated starter-stall placeholder",
  );
}
const thievingCommercialTags = [
  ...impactThievingMain.matchAll(
    /<a\b[^>]*\bhref=["']impact-gold\.html["'][^>]*>/gi,
  ),
].map((match) => match[0]);
if (
  thievingCommercialTags.length !== 1 ||
  getAttribute(thievingCommercialTags[0] || "", "target") !== "_blank" ||
  getAttribute(thievingCommercialTags[0] || "", "rel") !== "noopener" ||
  getAttribute(thievingCommercialTags[0] || "", "data-action") !==
    "impact-guide-to-gold" ||
  !/opens in a new tab/i.test(
    firstMatch(
      impactThievingMain,
      /<a\b[^>]*\bhref=["']impact-gold\.html["'][^>]*>([\s\S]*?)<\/a>/i,
    ),
  )
) {
  fail(
    "impact-thieving-guide.html",
    "Thieving commercial CTA must be the single accessible noopener new-tab link",
  );
}
const thievingFaqSection = firstMatch(
  impactThievingMain,
  /<section\b[^>]*\bid=["']faq["'][^>]*>([\s\S]*?)<\/section>/i,
);
const visibleThievingFaq = extractSharedGuideFaq(impactThievingMain);
let schemaThievingFaq = [];
for (const match of impactThievingSource.matchAll(
  /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi,
)) {
  try {
    const json = JSON.parse(match[1]);
    const nodes = Array.isArray(json?.["@graph"]) ? json["@graph"] : [json];
    const faqNode = nodes.find((node) => node?.["@type"] === "FAQPage");
    if (faqNode) {
      schemaThievingFaq = (faqNode.mainEntity || []).map((item) => ({
        question: normalize(item?.name || ""),
        answer: normalize(item?.acceptedAnswer?.text || ""),
      }));
    }
  } catch {
    // General JSON-LD parsing reports the syntax failure earlier.
  }
}
if (
  visibleThievingFaq.length !== 11 ||
  schemaThievingFaq.length !== visibleThievingFaq.length ||
  visibleThievingFaq.some(
    (item, index) =>
      item.question !== schemaThievingFaq[index]?.question ||
      item.answer !== schemaThievingFaq[index]?.answer,
  )
) {
  fail(
    "impact-thieving-guide.html",
    "visible Thieving FAQ must match FAQPage questions and answers exactly",
  );
}
if (
  !/<a\b[^>]*\bhref=["']impact-thieving-guide\.html["'][^>]*\bdata-action=["']open-impact-thieving-guide["']/i.test(
    fs.readFileSync(path.join(root, "impact-guide.html"), "utf8"),
  )
) {
  fail(
    "impact-guide.html",
    "Impact Thieving card must preserve its URL and data-action",
  );
}

for (const [hubFile, expectedCards] of [
  [
    "roat-pkz-guide.html",
    [
      ["roat-pkz-starter-guide.html", "open-roat-pkz-starter-guide"],
      ["roat-pkz-donator-ranks-guide.html", "open-roat-pkz-donator-ranks-guide"],
      ["roat-pkz-money-making-guide.html", "open-roat-pkz-money-making-guide"],
    ],
  ],
  [
    "spawnpk-guide.html",
    [
      ["spawnpk-starter-guide.html", "open-spawnpk-starter-guide"],
      ["spawnpk-donator-ranks-guide.html", "open-spawnpk-donator-ranks-guide"],
      ["spawnpk-money-making-guide.html", "open-spawnpk-money-making-guide"],
    ],
  ],
]) {
  const source = fs.readFileSync(path.join(root, hubFile), "utf8");
  const main = firstMatch(source, /<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const cards = [
    ...main.matchAll(
      /<a\b[^>]*\bclass=["'][^"']*\bserver-guide-card\b[^"']*["'][^>]*>/gi,
    ),
  ];
  if (cards.length !== 3) fail(hubFile, `expected exactly three guide cards, found ${cards.length}`);
  expectedCards.forEach(([href, action], index) => {
    const card = cards[index]?.[0] || "";
    if (getAttribute(card, "href") !== href || getAttribute(card, "data-action") !== action) {
      fail(hubFile, `guide card ${index + 1} must link to ${href} with data-action ${action}`);
    }
  });
  if (/-gold\.html/i.test(main)) fail(hubFile, "informational hub must not include a commercial gold link");
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

const stylesheet = fs.readFileSync(path.join(root, "styles.css"), "utf8");
for (const [pattern, message] of [
  [/\.server-guide-grid--four\s*\{[\s\S]*?grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/i, "missing four-column server guide grid"],
  [/@media\s*\(max-width:\s*1100px\)[\s\S]*?\.server-guide-grid--four[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/i, "missing narrower-desktop server guide grid"],
  [/@media\s*\(max-width:\s*820px\)[\s\S]*?\.server-guide-grid--four[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/i, "missing tablet server guide grid"],
  [/@media\s*\(max-width:\s*560px\)[\s\S]*?\.server-guide-grid--four[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/i, "missing mobile server guide stack"],
  [/\.server-guide-card\s*\{[\s\S]*?min-width:\s*0/i, "server guide cards can overflow at narrow widths"],
  [/\.server-guide-card:focus-visible\s*\{[\s\S]*?outline:/i, "server guide cards are missing a visible focus style"],
  [/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.server-guide-card/i, "server guide cards do not respect reduced motion"],
]) {
  if (!pattern.test(stylesheet)) fail("styles.css", message);
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

for (const field of ["ogTitle", "ogDescription", "twitterTitle", "twitterDescription"]) {
  const groups = new Map();
  for (const page of pages.filter((item) => impactArticleFiles.includes(item.file))) {
    const value = normalize(page[field]);
    if (!value) continue;
    groups.set(value, [...(groups.get(value) || []), page.file]);
  }
  for (const [value, files] of groups) {
    if (files.length > 1) fail(files.join(", "), `duplicate Impact guide ${field}: ${value}`);
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
