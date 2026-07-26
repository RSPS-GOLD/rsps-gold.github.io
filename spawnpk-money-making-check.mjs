import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlPath = path.join(root, "spawnpk-money-making-guide.html");
const cssPath = path.join(root, "spawnpk-money-making-guide.css");
const jsPath = path.join(root, "spawnpk-money-making-guide.js");
const html = fs.readFileSync(htmlPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");
const failures = [];

function fail(message) {
  failures.push(message);
}

function text(value) {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&mdash;|&#8212;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
if (h1s.length !== 1) fail(`expected one H1, found ${h1s.length}`);

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicateIds.length) fail(`duplicate IDs: ${[...new Set(duplicateIds)].join(", ")}`);

const localAnchors = [...html.matchAll(/href=["']#([^"']+)["']/gi)].map((match) => match[1]);
for (const anchor of localAnchors) {
  if (!ids.includes(anchor)) fail(`missing anchor target: #${anchor}`);
}

for (const requiredId of [
  "quick-answer",
  "method-finder",
  "comparison",
  "seasonal-event",
  "voting",
  "dailies",
  "beginner",
  "slayer",
  "pvm",
  "raids",
  "merching",
  "currencies",
  "donator",
  "wilderness",
  "profit-calculator",
  "gambling",
  "faq",
  "sources",
]) {
  if (!ids.includes(requiredId)) fail(`missing required section #${requiredId}`);
}

for (const sourceUrl of [
  "https://spawnpk.net/forums/index.php?/topic/18486-making-money-on-spawnpk-non-beginner/",
  "https://spawnpk.net/forums/index.php?/topic/5462-money-making-guide/",
  "https://spawnpk.net/forums/index.php?/topic/6433-money-making-guide/",
  "https://spawnpk.net/forums/index.php?/topic/111809-july-24th-2026-solar-summer-event-new-cbh-rewards-patch-notes/",
  "https://spawnpk.net/landing/vote.php",
  "https://spawnpk.net/forums/index.php?/topic/60733-september-1st-2025-golden-tournaments-daily-adventures-new-items-and-more/",
  "https://spawnpk.net/forums/index.php?/topic/111473-june-5th-2026-raids-rework-toa-release/",
  "https://spawnpk.net/forums/index.php?/topic/111601-june-15th-2026-patch-notes/",
  "https://spawnpk.net/forums/index.php?/topic/1084-server-rules/",
]) {
  if (!html.includes(sourceUrl)) fail(`missing source URL: ${sourceUrl}`);
}

for (const oldClaim of [
  /vote every 12 hours/i,
  /\b600-700m\b/i,
  /\b1\.2b every hour\b/i,
  /\b100b\+ within a day\b/i,
  /guaranteed profit/i,
  /\b::gamble\b/i,
  /\b::duel\b/i,
]) {
  if (oldClaim.test(text(html))) fail(`unsupported or discouraged claim remains: ${oldClaim}`);
}

const jsonScripts = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
if (jsonScripts.length !== 1) fail(`expected one JSON-LD block, found ${jsonScripts.length}`);
let graph = [];
try {
  const data = JSON.parse(jsonScripts[0]?.[1] || "{}");
  graph = data["@graph"] || [];
} catch (error) {
  fail(`JSON-LD parse error: ${error.message}`);
}

const faqNode = graph.find((node) => node["@type"] === "FAQPage");
const schemaFaq = faqNode?.mainEntity || [];
const visibleFaq = [...html.matchAll(/<details\b[^>]*class=["'][^"']*guide-faq__item[^"']*["'][^>]*>[\s\S]*?<span\b[^>]*class=["'][^"']*guide-faq__question[^"']*["'][^>]*>([\s\S]*?)<\/span>[\s\S]*?<div\b[^>]*class=["'][^"']*guide-faq__answer[^"']*["'][^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/details>/gi)].map(
  (match) => ({ question: text(match[1]), answer: text(match[2]) }),
);
if (visibleFaq.length !== 12) fail(`expected 12 visible FAQs, found ${visibleFaq.length}`);
if (schemaFaq.length !== visibleFaq.length) fail("FAQ schema and visible FAQ counts differ");
visibleFaq.forEach((item, index) => {
  if (schemaFaq[index]?.name !== item.question) fail(`FAQ question mismatch at ${index + 1}`);
  if (schemaFaq[index]?.acceptedAnswer?.text !== item.answer) fail(`FAQ answer mismatch at ${index + 1}`);
});

for (const field of [
  "gross",
  "acquisition",
  "supplies",
  "deaths",
  "fees",
  "entry",
  "runs",
  "hours",
  "failures",
]) {
  if (!new RegExp(`data-calc=["']${field}["']`).test(html)) fail(`missing calculator field: ${field}`);
}

for (const field of ["capital", "combat", "risk", "attention", "style", "group", "donator"]) {
  if (!new RegExp(`data-finder-field=["']${field}["']`).test(html)) fail(`missing finder field: ${field}`);
}

if (!html.includes("spawnpk-money-making-guide.css?v=20260726-related-guides-1")) fail("missing scoped stylesheet");
if (!html.includes("spawnpk-money-making-guide.js?v=20260726-2")) fail("missing scoped script");
for (const breakpoint of ["1120px", "900px", "720px", "520px", "360px"]) {
  if (!css.includes(`@media (max-width: ${breakpoint})`)) {
    fail(`missing responsive breakpoint: ${breakpoint}`);
  }
}
if (!css.includes("prefers-reduced-motion")) fail("missing reduced-motion CSS");
if (!js.includes("Number.isFinite")) fail("calculator lacks finite-number protection");
if (!js.includes('raw.match(/^(?:\\d+')) fail("calculator amount parser missing");

if (failures.length) {
  console.error(failures.map((message) => `FAIL ${message}`).join("\n"));
  process.exit(1);
}

console.log(
  `SpawnPK money guide check passed: ${ids.length} IDs, ${localAnchors.length} anchor links, ${visibleFaq.length} FAQs, 7 finder inputs and 9 calculator inputs.`,
);
