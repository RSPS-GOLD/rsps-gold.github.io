import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const file = "spawnpk-donator-ranks-guide.html";
const source = fs.readFileSync(path.join(root, file), "utf8");
const stylesheet = fs.readFileSync(path.join(root, "spawnpk-donator-ranks.css"), "utf8");
const calculatorScript = fs.readFileSync(path.join(root, "spawnpk-donator-ranks.js"), "utf8");
const failures = [];

const fail = (message) => failures.push(message);
const matches = (pattern) => [...source.matchAll(pattern)];
const strip = (value) =>
  value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

const ranks = [
  ["normal", "Normal Donator", "$10–$49", "spawnpk-rank-normal.png", 10],
  ["super", "Super Donator", "$50–$99", "spawnpk-rank-super.png", 50],
  ["elite", "Elite Donator", "$100–$499", "spawnpk-rank-elite.png", 100],
  ["vip", "VIP Donator", "$500–$999", "spawnpk-rank-vip.png", 500],
  ["legendary", "Legendary Donator", "$1,000–$2,499", "spawnpk-rank-legendary.png", 1000],
  ["sponsor", "Sponsor Donator", "$2,500–$4,999", "spawnpk-rank-sponsor.gif", 2500],
  ["mythic", "Mythic Donator", "$5,000–$9,999", "spawnpk-rank-mythic.gif", 5000],
  ["cosmic", "Cosmic Donator", "$10,000+", "spawnpk-rank-cosmic.png", 10000]
];

if (matches(/<h1\b/gi).length !== 1) fail("page must contain exactly one H1");
if (/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(source)) fail("page must remain indexable");
if (/"datePublished"\s*:/i.test(source)) fail("unsupported datePublished must not be present");

const ids = matches(/\bid=["']([^"']+)["']/gi).map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) fail(`duplicate IDs: ${duplicateIds.join(", ")}`);

const idSet = new Set(ids);
for (const match of source.matchAll(/\bhref=["']#([^"']+)["']/gi)) {
  if (!idSet.has(match[1])) fail(`missing anchor target #${match[1]}`);
}

for (const [key, name, range, asset, minimum] of ranks) {
  if (!source.includes(`id="rank-${key}"`)) fail(`missing detail section for ${name}`);
  if (!source.includes(range)) fail(`missing visible threshold ${range} for ${name}`);
  if (!source.includes(`assets/spawnpk-ranks/${asset}`)) fail(`missing ${name} image reference`);
  if (!fs.existsSync(path.join(root, "assets", "spawnpk-ranks", asset))) {
    fail(`missing local asset ${asset}`);
  }
  if (!source.includes(`value="${key}"`)) fail(`calculator target missing ${name}`);
  if (!new RegExp(`key:\\s*"${key}"[\\s\\S]{0,80}minimum:\\s*${minimum}\\b`).test(calculatorScript)) {
    fail(`calculator minimum is missing or incorrect for ${name}`);
  }
}

for (const command of [
  "::dzone",
  "::ezone",
  "::vip",
  "::sponsor",
  "::mythic",
  "::cosmic",
  "::bank",
  "::week",
  "::drops"
]) {
  if (!source.includes(`<code>${command}</code>`)) fail(`missing semantic command ${command}`);
}

if (!/data-spawnpk-rank-calculator/i.test(source)) fail("calculator root is missing");
if (!/aria-live=["']polite["']/i.test(source)) fail("calculator needs a live result region");
if (!/<table\b[^>]*class=["'][^"']*spawnpk-comparison/i.test(source)) fail("comparison table is missing");
if (!/<caption>[^<]+<\/caption>/i.test(source)) fail("comparison table caption is missing");
if (!/spawnpk-rank-cosmic\.png/i.test(source)) fail("Cosmic stand-in is not referenced locally");
if (/official cosmic icon/i.test(source)) fail("Cosmic visual must not be described as official");
if (/\b(?:fetch|XMLHttpRequest|sendBeacon)\b/.test(calculatorScript)) {
  fail("calculator must not transmit input data");
}

for (const width of [1180, 960, 700, 520, 380]) {
  if (!new RegExp(`@media\\s*\\(max-width:\\s*${width}px\\)`).test(stylesheet)) {
    fail(`missing responsive breakpoint at ${width}px`);
  }
}
if (!/\.spawnpk-comparison-wrap\s*\{[\s\S]*?overflow-x:\s*auto/i.test(stylesheet)) {
  fail("comparison table must scroll inside its own container");
}
if (!/\.spawnpk-donator-guide\s*\{[\s\S]*?overflow-x:\s*clip/i.test(stylesheet)) {
  fail("page-level horizontal overflow guard is missing");
}
if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(stylesheet)) {
  fail("reduced-motion handling is missing");
}

const jsonBlocks = matches(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
if (!jsonBlocks.length) fail("JSON-LD is missing");
let graph = [];
for (const block of jsonBlocks) {
  try {
    const parsed = JSON.parse(block[1]);
    graph.push(...(parsed["@graph"] || [parsed]));
  } catch (error) {
    fail(`invalid JSON-LD: ${error.message}`);
  }
}

for (const type of ["Organization", "WebSite", "WebPage", "Article", "BreadcrumbList", "FAQPage"]) {
  if (!graph.some((node) => node["@type"] === type)) fail(`missing ${type} schema`);
}
for (const forbidden of ["Product", "Offer", "Review", "AggregateRating"]) {
  if (graph.some((node) => node["@type"] === forbidden)) fail(`forbidden ${forbidden} schema`);
}

const visibleFaq = matches(
  /<details\b[^>]*class=["'][^"']*\bguide-faq__item\b[^"']*["'][^>]*>[\s\S]*?<span\b[^>]*class=["'][^"']*\bguide-faq__question\b[^"']*["'][^>]*>([\s\S]*?)<\/span>[\s\S]*?<div\b[^>]*class=["'][^"']*\bguide-faq__answer\b[^"']*["'][^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/details>/gi
).map((match) => ({ question: strip(match[1]), answer: strip(match[2]) }));
const faqNode = graph.find((node) => node["@type"] === "FAQPage");
const schemaFaq = (faqNode?.mainEntity || []).map((item) => ({
  question: item.name,
  answer: item.acceptedAnswer?.text
}));

if (visibleFaq.length < 7 || visibleFaq.length > 10) {
  fail(`expected 7–10 visible FAQ items, found ${visibleFaq.length}`);
}
if (
  visibleFaq.length !== schemaFaq.length ||
  visibleFaq.some(
    (item, index) =>
      item.question !== schemaFaq[index]?.question ||
      item.answer !== schemaFaq[index]?.answer
  )
) {
  fail("visible FAQ and FAQPage schema do not match exactly");
}

if (failures.length) {
  console.error(`SpawnPK Donator validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `SpawnPK Donator validation passed: ${ranks.length} ranks, ${visibleFaq.length} FAQs, unique IDs, valid anchors, local assets and JSON-LD parity.`
);
