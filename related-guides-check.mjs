import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const sharedStyles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const guidePages = [
  "impact-money-making-guide.html",
  "impact-donator-benefits-guide.html",
  "impact-slayer-guide.html",
  "impact-hunter-guide.html",
  "impact-thieving-guide.html",
  "impact-gemstone-crab-guide.html",
  "impact-chambers-of-xeric-guide.html",
  "impact-theatre-of-blood-guide.html",
  "impact-tombs-of-amascut-guide.html",
  "roat-pkz-starter-guide.html",
  "roat-pkz-money-making-guide.html",
  "roat-pkz-donator-ranks-guide.html",
  "spawnpk-starter-guide.html",
  "spawnpk-money-making-guide.html",
  "spawnpk-donator-ranks-guide.html",
];

const destinationNames = new Map([
  ["impact-guide.html", "Impact Guide Hub"],
  ["impact-money-making-guide.html", "Impact Money Making Guide"],
  ["impact-donator-benefits-guide.html", "Impact Donator Ranks Guide"],
  ["impact-slayer-guide.html", "Impact Slayer Guide"],
  ["impact-hunter-guide.html", "Impact Hunter Guide"],
  ["impact-thieving-guide.html", "Impact Thieving Guide"],
  ["impact-gemstone-crab-guide.html", "Impact Gemstone Crab Guide"],
  ["impact-chambers-of-xeric-guide.html", "Impact Chambers of Xeric Guide"],
  ["impact-theatre-of-blood-guide.html", "Impact Theatre of Blood Guide"],
  ["impact-tombs-of-amascut-guide.html", "Impact Tombs of Amascut Guide"],
  ["roat-pkz-guide.html", "Roat Pkz Guide Hub"],
  ["roat-pkz-starter-guide.html", "Roat Pkz Starter Guide"],
  ["roat-pkz-money-making-guide.html", "Roat Pkz Money Making Guide"],
  ["roat-pkz-donator-ranks-guide.html", "Roat Pkz Donator Ranks Guide"],
  ["spawnpk-guide.html", "SpawnPK Guide Hub"],
  ["spawnpk-starter-guide.html", "SpawnPK Starter Guide"],
  ["spawnpk-money-making-guide.html", "SpawnPK Money Making Guide"],
  ["spawnpk-donator-ranks-guide.html", "SpawnPK Donator Ranks Guide"],
]);

const failures = [];
const inventory = [];

function fail(message) {
  failures.push(message);
}

function clean(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function attribute(markup, name) {
  return markup.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] || "";
}

function getDestinationPageTitle(href) {
  const destinationSource = fs.readFileSync(path.join(root, href), "utf8");
  return clean(destinationSource.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
}

function extractRelatedSection(source) {
  const start = source.search(/<section\b[^>]*class=["'][^"']*\brelated-guides\b[^"']*["'][^>]*>/i);
  if (start < 0) return "";

  const tokenPattern = /<\/?section\b[^>]*>/gi;
  tokenPattern.lastIndex = start;
  let depth = 0;
  let match;

  while ((match = tokenPattern.exec(source))) {
    if (/^<section\b/i.test(match[0])) depth += 1;
    else depth -= 1;
    if (depth === 0) return source.slice(start, tokenPattern.lastIndex);
  }

  return "";
}

for (const file of guidePages) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const relatedMatches = source.match(/\bclass=["'][^"']*\brelated-guides\b[^"']*["']/gi) || [];
  if (relatedMatches.length !== 1) {
    fail(`${file}: expected one shared related-guides section, found ${relatedMatches.length}`);
    continue;
  }

  const section = extractRelatedSection(source);
  if (!section) {
    fail(`${file}: related-guides section is not balanced`);
    continue;
  }

  if (!/aria-labelledby=["']related-guides-title["']/i.test(section)) {
    fail(`${file}: related-guides section must reference #related-guides-title`);
  }
  if (!/<p\b[^>]*class=["']related-guides__eyebrow["'][^>]*>\s*Related guides\s*<\/p>/i.test(section)) {
    fail(`${file}: related-guides eyebrow is missing or inconsistent`);
  }

  const heading = clean(section.match(/<h2\b[^>]*id=["']related-guides-title["'][^>]*>([\s\S]*?)<\/h2>/i)?.[1] || "");
  const server = file.startsWith("impact-") ? "Impact" : file.startsWith("roat-pkz-") ? "Roat Pkz" : "SpawnPK";
  if (heading !== `Continue with another ${server} guide`) {
    fail(`${file}: inconsistent related-guides heading "${heading}"`);
  }

  const anchors = [...section.matchAll(/<a\b([^>]*\bclass=["'][^"']*\brelated-guide-card\b[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi)];
  if (anchors.length < 3 || anchors.length > 4) {
    fail(`${file}: expected three or four related-guide cards, found ${anchors.length}`);
  }

  const seenDestinations = new Set();
  for (const match of anchors) {
    const attrs = match[1];
    const body = match[2];
    const href = attribute(attrs, "href");
    const action = attribute(attrs, "data-action");
    const title = clean(body.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1] || "");
    const description = clean(body.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] || "");
    const ctaMatch = body.match(/<span\b([^>]*\bclass=["'][^"']*\brelated-guide-card__cta\b[^"']*["'][^>]*)>([\s\S]*?)<\/span>/i);
    const cta = clean(ctaMatch?.[2] || "");
    const expectedTitle = destinationNames.get(href);
    const destinationPageTitle = href && fs.existsSync(path.join(root, href))
      ? getDestinationPageTitle(href)
      : "";
    const clearlyDescribesDestination = title === expectedTitle && (
      cta === `Open ${expectedTitle}` ||
      cta === `Browse ${expectedTitle}`
    );

    inventory.push({
      source: file,
      cardTitle: title,
      description,
      cta,
      destinationUrl: href,
      destinationPageTitle,
      componentClass: "related-guide-card",
      wholeCardClickable: true,
      visibleButton: false,
      visibleAction: Boolean(cta),
      clearlyDescribesDestination,
      action,
    });

    if (!href || !expectedTitle) fail(`${file}: unrecognized related-guide destination "${href}"`);
    if (href && !destinationPageTitle) fail(`${file}: ${href} is missing a destination page title`);
    if (href === file) fail(`${file}: related-guide card links to its own page`);
    if (seenDestinations.has(href)) fail(`${file}: duplicate related-guide destination ${href}`);
    seenDestinations.add(href);
    if (!action) fail(`${file}: ${href} is missing its existing analytics action`);
    if (title !== expectedTitle) {
      fail(`${file}: card for ${href} must be titled "${expectedTitle}", found "${title}"`);
    }
    if (description.length < 45) fail(`${file}: ${href} needs a useful destination description`);
    if (!ctaMatch || !/\baria-hidden=["']true["']/i.test(ctaMatch[1])) {
      fail(`${file}: ${href} needs a decorative visible CTA span`);
    }
    if (/<button\b/i.test(body)) fail(`${file}: ${href} must not nest a button inside the card link`);
    const expectedCta = expectedTitle?.endsWith("Guide Hub")
      ? `Browse ${expectedTitle}`
      : `Open ${expectedTitle}`;
    if (cta !== expectedCta) fail(`${file}: ${href} CTA must be "${expectedCta}", found "${cta}"`);
    if (/\btarget=["']_blank["']/i.test(attrs)) fail(`${file}: internal related-guide cards must open in the same tab`);
    if (!fs.existsSync(path.join(root, href))) fail(`${file}: destination file does not exist: ${href}`);
  }

  for (const vague of [
    "Use the guide that matches the next decision",
    "Build the account first",
    "Compare current activities",
    "Choose the next SpawnPK guide",
    "Continue progression",
  ]) {
    if (section.includes(vague)) fail(`${file}: vague related-guide wording remains: "${vague}"`);
  }
}

const guidePagesWithOldComponents = guidePages.filter((file) => {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  return /\bclass=["'][^"']*\b(?:guide-related|server-related-card|server-related-grid|related-links)\b/i.test(source);
});
if (guidePagesWithOldComponents.length) {
  fail(`legacy related-guide classes remain in: ${guidePagesWithOldComponents.join(", ")}`);
}

for (const [pattern, message] of [
  [/\.related-guide-card:focus-visible\s*\{/i, "shared cards need a visible keyboard focus rule"],
  [/\.related-guide-card:hover\s*\{/i, "shared cards need a hover rule"],
  [/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.related-guide-card/i, "shared cards need reduced-motion handling"],
  [/@media\s*\(max-width:\s*600px\)[\s\S]*?\.related-guides__grid[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/i, "shared cards need a one-column mobile layout"],
]) {
  if (!pattern.test(sharedStyles)) fail(message);
}

if (/\.(?:guide-related|server-related-grid|server-related-card|starter-related)\b/i.test(sharedStyles)) {
  fail("legacy related-guide selectors remain in styles.css");
}

if (failures.length) {
  console.error(`Related-guide validation failed (${failures.length}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

const byServer = inventory.reduce((counts, item) => {
  const server = item.source.startsWith("impact-") ? "Impact" : item.source.startsWith("roat-pkz-") ? "Roat Pkz" : "SpawnPK";
  counts[server] = (counts[server] || 0) + 1;
  return counts;
}, {});

console.log(
  `Related-guide check passed: ${guidePages.length} pages, ${inventory.length} explicit destination cards ` +
    `(${Object.entries(byServer).map(([server, count]) => `${server}: ${count}`).join(", ")}).`,
);

if (process.argv.includes("--inventory")) {
  console.table(inventory);
}
