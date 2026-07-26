import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const file = "spawnpk-starter-guide.html";
const source = fs.readFileSync(path.join(root, file), "utf8");
const stylesheet = fs.readFileSync(path.join(root, "spawnpk-starter-guide.css"), "utf8");
const checklistScript = fs.readFileSync(path.join(root, "spawnpk-starter-guide.js"), "utf8");
const failures = [];

const fail = (message) => failures.push(message);
const matches = (pattern) => [...source.matchAll(pattern)];
const strip = (value) =>
  value
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();

if (matches(/<h1\b/gi).length !== 1) fail("page must contain exactly one H1");
if (!source.includes("<title>SpawnPK Starter Guide: Best Beginner Route &amp; Upgrades</title>")) {
  fail("SEO title does not match the approved beginner-route title");
}
if (!source.includes("<h1>SpawnPK Starter Guide: Best Beginner Route and First Upgrades</h1>")) {
  fail("H1 does not match the approved page heading");
}
if (/<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(source)) fail("page must remain indexable");
if (/"datePublished"\s*:/i.test(source)) fail("unsupported datePublished must not be present");
if (!/"dateModified"\s*:\s*"2026-07-26"/i.test(source)) fail("dateModified must reflect this rebuild");

const ids = matches(/\bid=["']([^"']+)["']/gi).map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) fail(`duplicate IDs: ${duplicateIds.join(", ")}`);

const idSet = new Set(ids);
for (const match of source.matchAll(/\bhref=["']#([^"']+)["']/gi)) {
  if (!idSet.has(match[1])) fail(`missing anchor target #${match[1]}`);
}

for (const id of [
  "quick-answer",
  "first-session",
  "mode",
  "security",
  "seasonal-event",
  "dailies",
  "voting",
  "starter-rewards",
  "home",
  "economy",
  "first-upgrades",
  "first-hour",
  "combat",
  "buy-next",
  "checklist",
  "faq",
  "sources"
]) {
  if (!idSet.has(id)) fail(`required section #${id} is missing`);
}

for (const required of [
  "Swift Gloves",
  "Yoshi",
  "Twisted Bow",
  "Trained Account",
  "PKer Account",
  "::event",
  "::adxp",
  "::pc",
  "::pricecheck",
  "Trading Post",
  "Adventure Book Chapter III"
]) {
  if (!strip(source).includes(required)) fail(`required beginner content is missing: ${required}`);
}

if (/last\s+(?:verified|reviewed)\b/i.test(strip(source))) {
  fail("visible dated review labels are not allowed");
}

if (matches(/class=["'][^"']*\bstarter-route__number\b[^"']*["']/gi).length !== 7) {
  fail("first-session route must contain exactly seven numbered steps");
}
if (matches(/\bdata-checklist-item=["'][^"']+["']/gi).length !== 12) {
  fail("interactive checklist must contain exactly twelve actions");
}
if (!/aria-live=["']polite["']/i.test(source)) fail("checklist needs an aria-live progress message");
if (!/\blocalStorage\b/.test(checklistScript)) fail("checklist progress must use localStorage when available");
if (!/data-checklist-reset/i.test(source) || !/Checklist reset\./.test(checklistScript)) {
  fail("checklist reset control or announcement is missing");
}
if (/\b(?:fetch|XMLHttpRequest|sendBeacon)\b/.test(checklistScript)) {
  fail("checklist must not transmit progress data");
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

if (visibleFaq.length !== 10) fail(`expected 10 visible FAQ items, found ${visibleFaq.length}`);
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

for (const width of [1180, 1024, 900, 768, 640, 480, 380]) {
  if (!new RegExp(`@media\\s*\\(max-width:\\s*${width}px\\)`).test(stylesheet)) {
    fail(`missing responsive breakpoint at ${width}px`);
  }
}
if (!/\.spawnpk-starter-guide\s*\{[\s\S]*?overflow-x:\s*clip/i.test(stylesheet)) {
  fail("page-level horizontal overflow guard is missing");
}
if (!/\.starter-table-wrap\s*\{[\s\S]*?overflow-x:\s*auto/i.test(stylesheet)) {
  fail("wide tables must scroll inside their own container");
}
if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/i.test(stylesheet)) {
  fail("reduced-motion handling is missing");
}

const externalLinks = matches(/<a\b([^>]*\bhref=["']https?:\/\/[^"']+["'][^>]*)>/gi);
for (const link of externalLinks) {
  if (!/\btarget=["']_blank["']/i.test(link[1])) fail("external source link must open in a new tab");
  if (!/\brel=["'][^"']*\bnoopener\b[^"']*\bnoreferrer\b[^"']*["']/i.test(link[1])) {
    fail("external source link must include noopener noreferrer");
  }
}

if (failures.length) {
  console.error(`SpawnPK Starter validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `SpawnPK Starter validation passed: 7 route steps, 12 checklist actions, ${visibleFaq.length} matching FAQs, valid anchors, responsive CSS and JSON-LD parity.`
);
