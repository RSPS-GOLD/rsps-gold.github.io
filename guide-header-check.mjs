import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const styles = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const script = fs.readFileSync(path.join(root, "script.js"), "utf8");
const publicPages = fs.readdirSync(root).filter((file) => file.endsWith(".html")).sort();

const individualGuides = new Map([
  ["impact-money-making-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-donator-benefits-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-slayer-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-hunter-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-thieving-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-gemstone-crab-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-chambers-of-xeric-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-theatre-of-blood-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["impact-tombs-of-amascut-guide.html", ["Impact", "impact-guide.html", "impact-gold.html", "impact-guides-hub"]],
  ["roat-pkz-starter-guide.html", ["Roat Pkz", "roat-pkz-guide.html", "roat-pkz-gold.html", "roat-pkz-guides-hub"]],
  ["roat-pkz-money-making-guide.html", ["Roat Pkz", "roat-pkz-guide.html", "roat-pkz-gold.html", "roat-pkz-guides-hub"]],
  ["roat-pkz-donator-ranks-guide.html", ["Roat Pkz", "roat-pkz-guide.html", "roat-pkz-gold.html", "roat-pkz-guides-hub"]],
  ["spawnpk-starter-guide.html", ["SpawnPK", "spawnpk-guide.html", "spawnpk-gold.html", "spawnpk-guides-hub"]],
  ["spawnpk-money-making-guide.html", ["SpawnPK", "spawnpk-guide.html", "spawnpk-gold.html", "spawnpk-guides-hub"]],
  ["spawnpk-donator-ranks-guide.html", ["SpawnPK", "spawnpk-guide.html", "spawnpk-gold.html", "spawnpk-guides-hub"]],
]);

const serverHubs = new Map([
  ["impact-guide.html", ["Impact", "impact-gold.html"]],
  ["roat-pkz-guide.html", ["Roat Pkz", "roat-pkz-gold.html"]],
  ["spawnpk-guide.html", ["SpawnPK", "spawnpk-gold.html"]],
]);

const failures = [];
const inventory = [];
const allGuidePages = [
  "guides.html",
  ...serverHubs.keys(),
  ...individualGuides.keys(),
];

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

function getAttribute(markup, name) {
  return markup.match(new RegExp(`\\b${name}=["']([^"']+)["']`, "i"))?.[1] || "";
}

function firstElement(source, tag, className) {
  return source.match(new RegExp(`<${tag}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/${tag}>`, "i"))?.[0] || "";
}

for (const file of publicPages) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const header = source.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
  const announcementEnd = header ? source.indexOf(header) : -1;
  const announcementStart = announcementEnd >= 0 ? source.lastIndexOf('<div class="announcement"', announcementEnd) : -1;
  const announcement = announcementStart >= 0 ? source.slice(announcementStart, announcementEnd) : "";
  const headerClass = getAttribute(header.match(/<header\b[^>]*>/i)?.[0] || "", "class");
  const ctaTexts = [...header.matchAll(/<(?:a|button)\b[^>]*>([\s\S]*?)<\/(?:a|button)>/gi)]
    .map((match) => clean(match[1]))
    .filter(Boolean);

  inventory.push({
    sourcePage: file,
    headerVariant: headerClass || "none",
    announcementText: clean(announcement),
    headerActions: ctaTexts.join(" | "),
    duplicateGoldAction: (clean(announcement + header).match(/View Gold Prices/g) || []).length > 1,
    serverContext: source.includes('class="guide-context"'),
    mobileMenu:
      /rank-header__menu-toggle|rank-site-header__menu/i.test(header)
        ? "HTML button"
        : /\bsite-header\b/.test(headerClass)
          ? "progressive script button"
          : "none",
  });
}

for (const file of allGuidePages) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const header = source.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
  const navigation = firstElement(header, "nav", "guide-header-nav");
  const navigationHrefs = [...navigation.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)]
    .map((match) => match[1]);
  const expectedHrefs = ["guides.html", "impact-guide.html", "roat-pkz-guide.html", "spawnpk-guide.html"];
  const goldActions = [...header.matchAll(/<a\b[^>]*class=["'][^"']*\bheader__cta\b[^"']*["'][^>]*>/gi)];

  if (!/\bclass=["'][^"']*\bsite-header\b[^"']*["']/i.test(header)) {
    fail(`${file}: does not use the original shared site header`);
  }
  if (navigationHrefs.join("|") !== expectedHrefs.join("|")) {
    fail(`${file}: global guide navigation links or order are inconsistent`);
  }
  if (goldActions.length !== 1) fail(`${file}: expected exactly one Gold Prices action`);
  if (/<button\b/i.test(header)) fail(`${file}: mobile menu must be progressively added, not duplicated in HTML`);
  if (!/\bclass=["'][^"']*\bbtn\b[^"']*\bbtn--gold\b[^"']*\bheader__cta\b/i.test(header)) {
    fail(`${file}: header must use the original Gold Prices button classes`);
  }
}

for (const [file, [server, hub, , action]] of individualGuides) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const header = source.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
  const contextMatches = source.match(/\bclass=["'][^"']*\bguide-context\b[^"']*["']/gi) || [];
  const context = firstElement(source, "nav", "guide-context");
  const expectedServer = `${server} Guide`;
  const expectedHubLabel = `All ${server} Guides`;
  const goldLinks = [...header.matchAll(/<a\b([^>]*\bclass=["'][^"']*\bheader__cta\b[^"']*["'][^>]*)>([\s\S]*?)<\/a>/gi)];
  const currentLinks = [...header.matchAll(/<a\b([^>]*\baria-current=["']page["'][^>]*)>([\s\S]*?)<\/a>/gi)];

  if (!/\bclass=["'][^"']*\bsite-header\b[^"']*["']/i.test(header)) {
    fail(`${file}: expected the original shared site-header`);
  }
  if (!/<nav\b[^>]*class=["'][^"']*\bnav\b[^"']*\bguide-header-nav\b[^"']*["'][^>]*aria-label=["']Primary navigation["']/i.test(header)) {
    fail(`${file}: expected the original shared Primary navigation`);
  }
  if (currentLinks.length !== 0) {
    fail(`${file}: child guides must not mark a server-hub link as the current page`);
  }
  if (contextMatches.length !== 1) fail(`${file}: expected one guide-context component`);
  if (!new RegExp(`aria-label=["']${server.replace(" ", "\\s+")} guide context["']`, "i").test(context)) {
    fail(`${file}: guide context needs the correct accessible label`);
  }
  if (!context.includes("You are reading")) fail(`${file}: guide context is missing its reading label`);
  if (!new RegExp(`<strong\\b[^>]*>${expectedServer}<\\/strong>`, "i").test(context)) {
    fail(`${file}: guide context must identify "${expectedServer}"`);
  }
  if (!new RegExp(`<a\\b[^>]*href=["']${hub}["'][^>]*data-action=["']${action}["'][^>]*>[\\s\\S]*?${expectedHubLabel}`, "i").test(context)) {
    fail(`${file}: guide context must link to ${hub} as "${expectedHubLabel}"`);
  }
  if (
    goldLinks.length !== 1 ||
    getAttribute(goldLinks[0]?.[1] || "", "href") !== "index.html#servers" ||
    clean(goldLinks[0]?.[2] || "") !== "View Gold Prices"
  ) {
    fail(`${file}: header must contain one original View Gold Prices button`);
  }
  if (/Calculate Progress|Calculate Rank Cost|Calculate Net Profit|Find Your Method|Find Your Task|Start Checklist|Start the Checklist|Compare All Ranks|Compare Methods/i.test(clean(header))) {
    fail(`${file}: a guide tool is still promoted as the header CTA`);
  }
  if (source.indexOf(context) < source.indexOf("</header>")) {
    fail(`${file}: guide context must follow the main header`);
  }
}

{
  const source = fs.readFileSync(path.join(root, "guides.html"), "utf8");
  const header = source.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
  const announcement = source.slice(source.indexOf('<div class="announcement"'), source.indexOf("<header"));
  if ((clean(announcement + header).match(/Gold Prices/g) || []).length !== 1) {
    fail("guides.html: Gold Prices must appear exactly once in the combined header area");
  }
  if (/<a\b|<button\b/i.test(announcement)) {
    fail("guides.html: announcement bar must remain text-only");
  }
  if (!/<a\b[^>]*href=["']guides\.html["'][^>]*aria-current=["']page["'][^>]*>\s*All Guides\s*<\/a>/i.test(header)) {
    fail('guides.html: "All Guides" needs aria-current="page"');
  }
}

for (const [file, [server]] of serverHubs) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const header = source.match(/<header\b[^>]*>[\s\S]*?<\/header>/i)?.[0] || "";
  const currentLinks = [...header.matchAll(/<a\b([^>]*\baria-current=["']page["'][^>]*)>([\s\S]*?)<\/a>/gi)];
  if (currentLinks.length !== 1 || getAttribute(currentLinks[0]?.[1] || "", "href") !== file) {
    fail(`${file}: only the current ${server} global navigation item may be active`);
  }
  if (source.includes('class="guide-context"')) {
    fail(`${file}: guide hub must not add a context link back to itself`);
  }
}

for (const [pattern, message] of [
  [/\.guide-context\s*\{/i, "missing shared guide-context styles"],
  [/\.guide-context__hub-link:focus-visible/i, "guide-context hub link needs a visible focus style"],
  [/\.guide-header-nav a\[aria-current="page"\][\s\S]*?font-weight:\s*800/i, "active guide navigation needs the original subtle text treatment"],
  [/\.site-header:has\(\.guide-header-nav\)\s*\{/i, "missing shared guide-header sticky positioning"],
  [/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.guide-context__hub-link/i, "guide context needs reduced-motion handling"],
]) {
  if (!pattern.test(styles)) fail(message);
}

for (const obsolete of [
  "global-guide-header",
  "global-guide-nav",
  "guide-header__gold-link",
  "guide-directory__gold-cta",
]) {
  if (styles.includes(obsolete)) fail(`obsolete redesigned selector remains: ${obsolete}`);
  for (const file of allGuidePages) {
    const source = fs.readFileSync(path.join(root, file), "utf8");
    if (source.includes(obsolete)) fail(`${file}: obsolete redesigned class remains: ${obsolete}`);
  }
}

const activeRule = styles.match(/\.guide-header-nav a\[aria-current="page"\]\s*\{([^}]*)\}/i)?.[1] || "";
if (/background|box-shadow|border/i.test(activeRule)) {
  fail("active guide navigation must not use the boxed or tab-style redesign");
}

if (!/function initCompactHeaderMenu\(\)/.test(script)) {
  fail("progressive mobile menu support is missing from script.js");
}

if (failures.length) {
  console.error(`Guide-header validation failed (${failures.length}):`);
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(
  `Guide-header check passed: ${publicPages.length} public pages inventoried, ` +
    `${individualGuides.size} individual guides use the shared server context, and all guide pages use page-aware global navigation.`,
);

if (process.argv.includes("--inventory")) {
  console.table(inventory);
}
