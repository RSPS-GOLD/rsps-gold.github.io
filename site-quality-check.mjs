import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteOrigin = "https://rsps-gold.com";
const htmlFiles = fs
  .readdirSync(root)
  .filter((file) => file.endsWith(".html"))
  .sort();
const failures = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function decode(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&nbsp;/gi, " ");
}

function text(value) {
  return decode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(
    /([:\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g,
  )) {
    result[match[1].toLowerCase()] =
      match[2] ?? match[3] ?? match[4] ?? "";
  }
  return result;
}

function jsonLdNodes(source, file) {
  const nodes = [];
  for (const match of source.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(match[1]);
      nodes.push(...(Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed]));
    } catch (error) {
      failures.push(`${file}: invalid JSON-LD (${error.message})`);
    }
  }
  return nodes;
}

function itemList(nodes) {
  return nodes.find((node) => {
    const type = node?.["@type"];
    return type === "ItemList" || (Array.isArray(type) && type.includes("ItemList"));
  });
}

function localTarget(href, sourceFile) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return null;
  }
  try {
    const url = new URL(href, `https://local.test/${sourceFile}`);
    if (url.hostname !== "local.test") return null;
    const pathname = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
    return {
      file: pathname || "index.html",
      fragment: decodeURIComponent(url.hash.slice(1)),
    };
  } catch {
    return null;
  }
}

const idsByFile = new Map();
const linksToFile = new Map();

for (const file of htmlFiles) {
  const source = read(file);
  const h1s = [...source.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  if (h1s.length !== 1) {
    failures.push(`${file}: expected one H1, found ${h1s.length}`);
  }

  const ids = [
    ...source.matchAll(/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/gi),
  ].map((match) => match[1] ?? match[2]);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) {
    failures.push(`${file}: duplicate IDs: ${duplicateIds.join(", ")}`);
  }
  idsByFile.set(file, new Set(ids));

  for (const match of source.matchAll(/<(?:a|link)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (!Object.hasOwn(attrs, "href")) continue;
    if (!attrs.href.trim()) failures.push(`${file}: empty href`);
    const target = localTarget(attrs.href.trim(), file);
    if (!target) continue;
    if (!linksToFile.has(target.file)) linksToFile.set(target.file, new Set());
    linksToFile.get(target.file).add(file);
  }

  for (const match of source.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi)) {
    const attrs = attributes(match[0].slice(0, match[0].indexOf(">") + 1));
    if (!text(match[1]) && !attrs["aria-label"] && !attrs["aria-labelledby"]) {
      failures.push(`${file}: empty button`);
    }
  }

  for (const match of source.matchAll(/<img\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    if (!Object.hasOwn(attrs, "alt")) {
      failures.push(`${file}: image missing alt`);
    }
    if (!attrs.src) {
      failures.push(`${file}: image missing src`);
      continue;
    }
    const target = localTarget(attrs.src, file);
    if (target && !fs.existsSync(path.join(root, target.file))) {
      failures.push(`${file}: missing image ${attrs.src}`);
    }
    if (!attrs.width || !attrs.height) {
      warnings.push(`${file}: image lacks explicit dimensions (${attrs.src})`);
    }
  }

  for (const match of source.matchAll(/<(?:script|link)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    const resource = attrs.src || attrs.href;
    const target = localTarget(resource, file);
    if (
      target &&
      /\.(?:css|js|json|webmanifest)$/i.test(target.file) &&
      !fs.existsSync(path.join(root, target.file))
    ) {
      failures.push(`${file}: missing local resource ${resource}`);
    }
  }

  for (const match of source.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)) {
    const attrs = attributes(match[0]);
    const rel = new Set((attrs.rel || "").toLowerCase().split(/\s+/));
    if (!rel.has("noopener")) failures.push(`${file}: target=_blank link lacks noopener`);
  }

  const labels = new Set(
    [...source.matchAll(/<label\b[^>]*for=["']([^"']+)["'][^>]*>/gi)].map(
      (match) => match[1],
    ),
  );
  for (const match of source.matchAll(/<(?:input|select|textarea)\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    const before = source.slice(0, match.index);
    const nestedInLabel =
      before.lastIndexOf("<label") > before.lastIndexOf("</label>");
    if (
      attrs.type === "hidden" ||
      attrs["aria-label"] ||
      attrs["aria-labelledby"] ||
      (attrs.id && labels.has(attrs.id)) ||
      nestedInLabel
    ) {
      continue;
    }
    failures.push(`${file}: unlabeled form control${attrs.id ? ` #${attrs.id}` : ""}`);
  }

  const nodes = jsonLdNodes(source, file);
  const jsonIds = nodes.map((node) => node?.["@id"]).filter(Boolean);
  const duplicateJsonIds = [
    ...new Set(jsonIds.filter((id, index) => jsonIds.indexOf(id) !== index)),
  ];
  if (duplicateJsonIds.length) {
    failures.push(`${file}: duplicate top-level JSON-LD @id`);
  }

  if (file !== "404.html") {
    const canonical = source.match(
      /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,
    )?.[1];
    const expected =
      file === "index.html"
        ? `${siteOrigin}/`
        : `${siteOrigin}/${file}`;
    if (canonical !== expected) {
      failures.push(`${file}: canonical should be ${expected}`);
    }

    const meta = new Map();
    for (const match of source.matchAll(/<meta\b[^>]*>/gi)) {
      const attrs = attributes(match[0]);
      const key = (attrs.property || attrs.name || "").toLowerCase();
      if (key) meta.set(key, attrs.content || "");
    }
    for (const key of [
      "og:image",
      "og:image:width",
      "og:image:height",
      "og:image:alt",
      "twitter:image",
      "twitter:image:alt",
    ]) {
      if (!meta.get(key)?.trim()) failures.push(`${file}: missing ${key}`);
    }
    if (
      file.includes("guide") &&
      /\/(?:roat-pkz|spawnpk)-logo\.png$/i.test(meta.get("og:image") || "")
    ) {
      failures.push(`${file}: small server logo is unsuitable as a large social preview`);
    }
  }
}

for (const file of htmlFiles) {
  const source = read(file);
  for (const match of source.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const target = localTarget(match[1], file);
    if (!target) {
      if (match[1].startsWith("#")) {
        const fragment = decodeURIComponent(match[1].slice(1));
        if (fragment && !idsByFile.get(file)?.has(fragment)) {
          failures.push(`${file}: missing fragment #${fragment}`);
        }
      }
      continue;
    }
    if (!fs.existsSync(path.join(root, target.file))) {
      failures.push(`${file}: missing local link target ${match[1]}`);
      continue;
    }
    if (target.fragment && !idsByFile.get(target.file)?.has(target.fragment)) {
      failures.push(`${file}: ${match[1]} points to a missing fragment`);
    }
  }
}

const hubConfig = {
  "impact-guide.html": {
    server: "Impact",
    files: htmlFiles.filter(
      (file) => /^impact-.+-guide\.html$/.test(file) && file !== "impact-guide.html",
    ),
  },
  "roat-pkz-guide.html": {
    server: "Roat Pkz",
    files: htmlFiles.filter(
      (file) =>
        /^roat-pkz-.+-guide\.html$/.test(file) && file !== "roat-pkz-guide.html",
    ),
  },
  "spawnpk-guide.html": {
    server: "SpawnPK",
    files: htmlFiles.filter(
      (file) => /^spawnpk-.+-guide\.html$/.test(file) && file !== "spawnpk-guide.html",
    ),
  },
};

for (const [hub, config] of Object.entries(hubConfig)) {
  const source = read(hub);
  const cardMatches = [
    ...source.matchAll(
      /<a\b[^>]*class=["'][^"']*\bserver-guide-card\b[^"']*["'][^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    ),
  ];
  const cards = cardMatches.map((match) => ({
    href: match[1],
    title: text(
      match[2].match(
        /<h3\b[^>]*class=["'][^"']*\bserver-guide-card__title\b[^"']*["'][^>]*>([\s\S]*?)<\/h3>/i,
      )?.[1] || "",
    ),
  }));
  const cardFiles = cards.map((card) => card.href.split("#")[0]);
  const expected = new Set(config.files);
  const missingCards = config.files.filter((file) => !cardFiles.includes(file));
  const invalidCards = cardFiles.filter((file) => !expected.has(file));
  if (missingCards.length) {
    failures.push(`${hub}: missing guide cards for ${missingCards.join(", ")}`);
  }
  if (invalidCards.length) {
    failures.push(`${hub}: invalid guide card targets ${invalidCards.join(", ")}`);
  }

  const list = itemList(jsonLdNodes(source, hub));
  if (!list) {
    failures.push(`${hub}: missing ItemList schema`);
    continue;
  }
  const schemaItems = Array.isArray(list.itemListElement) ? list.itemListElement : [];
  const schemaFiles = schemaItems.map((entry) => {
    const url = entry.url || entry.item || "";
    return String(url).split("/").pop().split("#")[0];
  });
  if (list.numberOfItems !== cards.length) {
    failures.push(
      `${hub}: numberOfItems ${list.numberOfItems} does not match ${cards.length} cards`,
    );
  }
  if (schemaFiles.join("|") !== cardFiles.join("|")) {
    failures.push(`${hub}: ItemList order or URLs do not match visible guide cards`);
  }
  const schemaNames = schemaItems.map((entry) => text(String(entry.name || "")));
  if (schemaNames.join("|") !== cards.map((card) => card.title).join("|")) {
    failures.push(`${hub}: ItemList names do not match visible guide-card titles`);
  }

  for (const guide of config.files) {
    if (!read(guide).includes(`href="${hub}"`)) {
      failures.push(`${guide}: no direct link back to ${hub}`);
    }
  }

  console.log(
    `${config.server}: ${config.files.length} guide files, ${cards.length} hub cards, ${schemaItems.length} ItemList entries`,
  );
}

const guidesSource = read("guides.html");
const guideHubCards = [
  ...guidesSource.matchAll(
    /<article\b[^>]*class=["'][^"']*\bguide-card\b[^"']*["'][^>]*>([\s\S]*?)<\/article>/gi,
  ),
].map((match) => {
  const body = match[1];
  return {
    href:
      body.match(
        /<a\b[^>]*class=["'][^"']*\bguide-card__logo\b[^"']*["'][^>]*href=["']([^"']+)["']/i,
      )?.[1] || "",
    title: text(body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || ""),
  };
});
const expectedHubFiles = Object.keys(hubConfig);
if (
  guideHubCards.map((card) => card.href).join("|") !== expectedHubFiles.join("|")
) {
  failures.push("guides.html: server-card order or URLs do not match guide hubs");
}
const guidesList = itemList(jsonLdNodes(guidesSource, "guides.html"));
if (!guidesList) {
  failures.push("guides.html: missing ItemList schema for server guide hubs");
} else {
  const items = Array.isArray(guidesList.itemListElement)
    ? guidesList.itemListElement
    : [];
  const files = items.map((entry) =>
    String(entry.url || entry.item || "").split("/").pop().split("#")[0],
  );
  if (
    guidesList.numberOfItems !== guideHubCards.length ||
    files.join("|") !== guideHubCards.map((card) => card.href).join("|")
  ) {
    failures.push("guides.html: ItemList does not match visible server guide cards");
  }
}

if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (failures.length) {
  console.error(`Failures (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Site quality check passed: ${htmlFiles.length} HTML files, valid local links, assets, forms, JSON-LD and guide-hub parity.`,
);
