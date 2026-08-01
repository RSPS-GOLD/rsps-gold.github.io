import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const origin = "https://rsps-gold.com";
const discordId = "640265737050652672";
const discordUrl = `https://discord.com/users/${discordId}`;
const pairs = [
  { en: "index.html", es: "es/index.html", enUrl: `${origin}/`, esUrl: `${origin}/es/`, invariants: [] },
  { en: "impact-gold.html", es: "es/impact-gold.html", enUrl: `${origin}/impact-gold.html`, esUrl: `${origin}/es/impact-gold.html`, invariants: ["$1", "1B"] },
  { en: "roat-pkz-gold.html", es: "es/roat-pkz-gold.html", enUrl: `${origin}/roat-pkz-gold.html`, esUrl: `${origin}/es/roat-pkz-gold.html`, invariants: ["$3.50", "1M", "PKP"] },
  { en: "spawnpk-gold.html", es: "es/spawnpk-gold.html", enUrl: `${origin}/spawnpk-gold.html`, esUrl: `${origin}/es/spawnpk-gold.html`, invariants: ["$9", "1T", "10T", "25T", "100M", "Cash Bag"] },
];

const failures = [];
const warnings = [];
const results = [];
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const fail = (message) => failures.push(message);
const matchOne = (html, regex) => html.match(regex)?.[1] ?? null;
const attrs = (html, regex) => [...html.matchAll(regex)].map((match) => match[1]);

function resolveLocal(pageFile, url) {
  const clean = url.split("#")[0].split("?")[0];
  if (!clean || clean.startsWith("http:") || clean.startsWith("https:") || clean.startsWith("mailto:") || clean.startsWith("data:")) return null;
  return clean.startsWith("/")
    ? path.join(root, clean.replace(/^\/+/, ""))
    : path.resolve(path.dirname(path.join(root, pageFile)), clean);
}

function checkPage(file, expectedLang, expectedCanonical, expectedEn, expectedEs) {
  if (!fs.existsSync(path.join(root, file))) {
    fail(`${file}: file is missing`);
    return null;
  }

  const html = read(file);
  const lang = matchOne(html, /<html\b[^>]*\blang="([^"]+)"/i);
  const canonical = matchOne(html, /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
  const ogUrl = matchOne(html, /<meta\b[^>]*property="og:url"[^>]*content="([^"]+)"/i);
  const ogLocale = matchOne(html, /<meta\b[^>]*property="og:locale"[^>]*content="([^"]+)"/i);
  const ogLocaleAlternate = matchOne(html, /<meta\b[^>]*property="og:locale:alternate"[^>]*content="([^"]+)"/i);
  const alternates = Object.fromEntries(
    [...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*hreflang="([^"]+)"[^>]*href="([^"]+)"/gi)].map((match) => [match[1], match[2]]),
  );
  if (lang !== expectedLang) fail(`${file}: expected lang=${expectedLang}, found ${lang}`);
  if (canonical !== expectedCanonical) fail(`${file}: canonical ${canonical} does not match ${expectedCanonical}`);
  if (ogUrl !== expectedCanonical) fail(`${file}: og:url ${ogUrl} does not match ${expectedCanonical}`);
  if (ogLocale !== (expectedLang === "es" ? "es_ES" : "en_US")) fail(`${file}: incorrect or missing og:locale`);
  if (ogLocaleAlternate !== (expectedLang === "es" ? "en_US" : "es_ES")) fail(`${file}: incorrect or missing og:locale:alternate`);
  if (alternates.en !== expectedEn || alternates.es !== expectedEs || alternates["x-default"] !== expectedEn) {
    fail(`${file}: incomplete or incorrect hreflang cluster`);
  }

  const ids = attrs(html, /\sid="([^"]+)"/gi);
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) fail(`${file}: duplicate IDs: ${duplicateIds.join(", ")}`);

  const missingHashes = attrs(html, /href="#([^"]+)"/gi).filter((id) => !ids.includes(id));
  if (missingHashes.length) fail(`${file}: hash links without targets: ${[...new Set(missingHashes)].join(", ")}`);

  const resources = [
    ...attrs(html, /\b(?:href|src)="([^"]+)"/gi),
  ];
  const languageTargets = attrs(html, /<a\b[^>]*class="[^"]*language-option[^"]*"[^>]*href="([^"]+)"/gi);
  const missingResources = resources
    .map((url) => ({ url, resolved: resolveLocal(file, url) }))
    .filter((entry) => entry.resolved && !fs.existsSync(entry.resolved));
  if (missingResources.length) fail(`${file}: missing local resources: ${missingResources.map((entry) => entry.url).join(", ")}`);

  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const schemaNodes = [];
  for (const [index, schema] of schemas.entries()) {
    try {
      const parsed = JSON.parse(schema[1]);
      schemaNodes.push(...(parsed["@graph"] || [parsed]));
    } catch (error) {
      fail(`${file}: JSON-LD block ${index + 1} is invalid: ${error.message}`);
    }
  }

  if (!html.includes(discordUrl) || !html.includes(discordId) || !html.includes("a6d9")) {
    fail(`${file}: Discord identity or profile URL is missing`);
  }
  if (/Ã|â€“|â€œ|â€|�/.test(html)) fail(`${file}: possible encoding corruption detected`);

  if (expectedLang === "es") {
    const webPage = schemaNodes.find((node) => node["@type"] === "WebPage");
    const service = schemaNodes.find((node) => node["@type"] === "Service");
    if (!webPage || webPage.url !== expectedCanonical || webPage["@id"] !== `${expectedCanonical}#webpage` || webPage.inLanguage !== "es" || !webPage.name || !webPage.description) {
      fail(`${file}: Spanish WebPage schema is missing localized name/description or correct URL/@id`);
    }
    if (!service || service.url !== expectedCanonical || !service.name || !service.description) {
      fail(`${file}: Spanish Service schema is missing localized name/description or correct URL`);
    }
    for (const [label, pattern] of [
      ["title", /<title\b[^>]*>[^<]+<\/title>/i],
      ["meta description", /<meta\b[^>]*name="description"[^>]*content="[^"]+"/i],
      ["Open Graph title", /<meta\b[^>]*property="og:title"[^>]*content="[^"]+"/i],
      ["Open Graph description", /<meta\b[^>]*property="og:description"[^>]*content="[^"]+"/i],
      ["Open Graph image alt", /<meta\b[^>]*property="og:image:alt"[^>]*content="[^"]+"/i],
      ["Twitter title", /<meta\b[^>]*name="twitter:title"[^>]*content="[^"]+"/i],
      ["Twitter description", /<meta\b[^>]*name="twitter:description"[^>]*content="[^"]+"/i],
      ["Twitter image alt", /<meta\b[^>]*name="twitter:image:alt"[^>]*content="[^"]+"/i],
    ]) {
      if (!pattern.test(html)) fail(`${file}: localized ${label} is missing`);
    }
    const invalidSpanishTargets = attrs(html, /href="(\/es\/[^"]*)"/gi)
      .map((url) => url.split("#")[0].split("?")[0])
      .filter((url) => !["/es/", "/es/impact-gold.html", "/es/roat-pkz-gold.html", "/es/spawnpk-gold.html"].includes(url));
    if (invalidSpanishTargets.length) fail(`${file}: links to unsupported Spanish pages: ${[...new Set(invalidSpanishTargets)].join(", ")}`);
    if (!/class="language-switcher"[^>]*data-current-language="es"[\s\S]*aria-current="page"[^>]*lang="es"/.test(html)) {
      fail(`${file}: Spanish language switcher state is missing`);
    }
    if (!languageTargets.includes(expectedEn.replace(origin, ""))) {
      fail(`${file}: static English language link is missing`);
    }
  } else if (!/class="language-switcher"[^>]*data-current-language="en"[\s\S]*aria-current="page"[^>]*lang="en"/.test(html)) {
    fail(`${file}: English language switcher state is missing`);
  } else if (!languageTargets.includes(expectedEs.replace(origin, ""))) {
    fail(`${file}: static Spanish language link is missing`);
  }

  return { html, lang, canonical, alternates, schemas: schemas.length, ids: ids.length, resources: resources.length };
}

for (const pair of pairs) {
  const enResult = checkPage(pair.en, "en", pair.enUrl, pair.enUrl, pair.esUrl);
  const esResult = checkPage(pair.es, "es", pair.esUrl, pair.enUrl, pair.esUrl);
  if (!enResult || !esResult) continue;

  for (const token of ["a6d9", discordId, discordUrl, ...pair.invariants]) {
    if (!enResult.html.includes(token)) fail(`${pair.en}: invariant ${token} is missing`);
    if (!esResult.html.includes(token)) fail(`${pair.es}: invariant ${token} is missing`);
  }

  if (!esResult.html.includes("correo") && pair.es !== "es/index.html") {
    warnings.push(`${pair.es}: expected account-safety wording about email was not found`);
  }

  results.push({
    pair: `${pair.en} ↔ ${pair.es}`,
    lang: `${enResult.lang}/${esResult.lang}`,
    canonical: esResult.canonical,
    hreflang: Object.keys(esResult.alternates).sort().join(","),
    jsonLd: esResult.schemas,
  });
}

const paymentPages = [
  {
    file: "index.html",
    headings: ["Flexible payment options", "Payment methods for confirmed trades", "Pay with Apple Pay, Visa, Mastercard or card through Eldorado.gg", "Cryptocurrency or RuneScape gold", "Supported cryptocurrency", "RuneScape gold exchange", "Before payment"],
    categories: ["Marketplace checkout", "Direct trade"],
    safety: "Confirm the selected currency, network and wallet address before sending funds.",
    processor: "Eldorado.gg processes payments completed through its marketplace.",
    confirmation: "All trade details must be agreed with us before an Eldorado.gg order is placed, cryptocurrency is sent, or RuneScape gold is delivered.",
    secondaryEldorado: "View payment methods on Eldorado.gg",
  },
  {
    file: "es/index.html",
    headings: ["Opciones de pago flexibles", "Métodos de pago para operaciones confirmadas", "Pagar a través de Eldorado.gg", "Criptomonedas u oro de RuneScape", "Criptomonedas compatibles", "Intercambio con oro de RuneScape", "Antes del pago"],
    categories: ["Pago mediante marketplace", "Operación directa"],
    safety: "Confirma la criptomoneda, la red y la dirección de la billetera antes de enviar fondos.",
    processor: "Eldorado.gg muestra las opciones finales durante el proceso de compra y procesa los pagos realizados mediante su plataforma.",
    confirmation: "Todos los detalles de la operación deben acordarse antes de realizar un pedido en Eldorado.gg, enviar criptomonedas o entregar oro de RuneScape.",
    secondaryEldorado: "Ver los métodos de pago de Eldorado.gg",
  },
];

for (const paymentPage of paymentPages) {
  const html = read(paymentPage.file);
  const compactHtml = html.replace(/\s+/g, " ");
  const assetPrefix = paymentPage.file.startsWith("es/") ? "../" : "";
  const ratesPosition = html.indexOf('id="gold-rates"');
  const paymentPosition = html.indexOf('id="payment-methods"');
  const processPosition = html.indexOf('id="how-it-works"');
  if (!(ratesPosition < paymentPosition && paymentPosition < processPosition)) {
    fail(`${paymentPage.file}: payment methods must appear after gold rates and before How It Works`);
  }
  for (const heading of paymentPage.headings) {
    if (!html.includes(heading)) fail(`${paymentPage.file}: payment heading is missing: ${heading}`);
  }
  for (const category of paymentPage.categories) {
    if (!html.includes(category)) fail(`${paymentPage.file}: payment category is missing: ${category}`);
  }
  for (const method of ["Bitcoin", "BTC", "Ethereum", "ETH", "Litecoin", "LTC", "Tether", "USDT", "OSRS", "RS3"]) {
    if (!html.includes(method)) fail(`${paymentPage.file}: payment method is missing: ${method}`);
  }
  if (!html.includes(paymentPage.safety)) fail(`${paymentPage.file}: cryptocurrency safety notice is missing`);
  if (!compactHtml.includes(paymentPage.processor)) fail(`${paymentPage.file}: Eldorado payment processor clarification is missing`);
  if (!compactHtml.includes(paymentPage.confirmation)) fail(`${paymentPage.file}: concise pre-payment confirmation notice is missing`);
  if (!html.includes('href="https://support.eldorado.gg/en/articles/10213898-payment-methods"')) {
    fail(`${paymentPage.file}: official Eldorado payment-method link is missing`);
  }
  if (!html.includes('target="_blank"') || !html.includes('rel="noopener noreferrer"')) {
    fail(`${paymentPage.file}: external payment links are missing safe new-tab attributes`);
  }
  const paymentSection = html.slice(paymentPosition, processPosition);
  if (!paymentSection) fail(`${paymentPage.file}: unified payment section is missing`);
  if ((paymentSection.match(/class="payment-option payment-option--/g) || []).length !== 2) {
    fail(`${paymentPage.file}: expected exactly two options inside the shared payment panel`);
  }
  if ((paymentSection.match(/class="payment-options__panel"/g) || []).length !== 1) {
    fail(`${paymentPage.file}: expected exactly one shared payment options panel`);
  }
  if (!html.includes(`src="${assetPrefix}assets/eldorado-logo.png" alt="" width="46" height="46"`)) {
    fail(`${paymentPage.file}: decorative Eldorado logo is missing or incorrectly sized`);
  }
  for (const requiredClass of [
    "payment-options",
    "payment-options__heading",
    "payment-options__panel",
    "payment-option--eldorado",
    "payment-option--direct",
    "payment-option__brand",
    "payment-option__header--text",
    "payment-option__heading-copy",
    "payment-option__link",
    "direct-trade-grid",
    "direct-trade-section--crypto",
    "direct-trade-section--gold",
    "direct-trade-methods",
    "crypto-logo--ethereum",
    "gold-trade-methods",
    "gold-logo",
    "payment-options__notice",
  ]) {
    if (!html.includes(requiredClass)) fail(`${paymentPage.file}: required payment class is missing: ${requiredClass}`);
  }
  if ((paymentSection.match(/data-action="discord-profile"|class="[^"]*__cta|Discord/gi) || []).length !== 0) {
    fail(`${paymentPage.file}: Discord promotion or call to action remains in the payment section`);
  }
  if ((paymentSection.match(/<a\b/g) || []).length !== 1) {
    fail(`${paymentPage.file}: expected only the Eldorado informational link in the payment section`);
  }
  if ((paymentSection.match(/class="direct-trade-method"/g) || []).length !== 4) {
    fail(`${paymentPage.file}: expected exactly four cryptocurrency items`);
  }
  if ((paymentSection.match(/class="gold-trade-method"/g) || []).length !== 2) {
    fail(`${paymentPage.file}: expected OSRS and RS3 inside the combined direct-trade area`);
  }
  if (!paymentSection.includes(paymentPage.secondaryEldorado)) fail(`${paymentPage.file}: Eldorado informational link text is missing`);
  if ((paymentSection.match(/<h4\b/g) || []).length !== 2) fail(`${paymentPage.file}: expected two direct-trade subsection headings`);
  for (const logo of ["bitcoin", "ethereum", "litecoin", "tether"]) {
    const localSource = `src="${assetPrefix}assets/payment-logos/${logo}.svg"`;
    if ((html.split(localSource).length - 1) !== 1) {
      fail(`${paymentPage.file}: expected exactly one ${logo} logo inside the labeled crypto list`);
    }
  }
  for (const icon of ["osrs-logo.png", "rs3-logo.png"]) {
    const localSource = `src="${assetPrefix}assets/payment-icons/${icon}"`;
    if ((html.split(localSource).length - 1) !== 1) {
      fail(`${paymentPage.file}: expected exactly one ${icon} payment icon`);
    }
  }
  if (paymentSection.includes("payment-option__icon") || paymentSection.includes("direct-trade.svg")) {
    fail(`${paymentPage.file}: obsolete direct-trade icon markup remains`);
  }
  for (const obsoleteClass of [
    "payment-methods-section",
    "payment-methods-grid",
    "payment-method-card",
    "payment-options-section",
    "payment-options-grid",
    "payment-route-card",
    "payment-hub-section",
    "payment-hub__start",
    "payment-hub__steps",
    "payment-route",
    "payment-route__action",
    "payment-route__cta",
    "payment-route__action-note",
    "payment-brand-icon",
    "crypto-brand-stack",
    "crypto-brand-badge",
    "accepted-crypto-list",
    "crypto-method-grid",
    "gold-trade-options",
    "trade-condition-list",
  ]) {
    if (html.includes(obsoleteClass)) fail(`${paymentPage.file}: obsolete payment class remains: ${obsoleteClass}`);
  }
}

for (const logoFile of ["bitcoin.svg", "ethereum.svg", "litecoin.svg", "tether.svg"]) {
  const file = `assets/payment-logos/${logoFile}`;
  if (!fs.existsSync(path.join(root, file))) {
    fail(`${file}: local payment logo is missing`);
    continue;
  }
  const svg = read(file);
  if (!/<svg\b[^>]*\bviewBox="[^"]+"/i.test(svg)) fail(`${file}: SVG viewBox is missing`);
  if (/<script\b|\bon\w+\s*=|https?:\/\/|<foreignObject\b|\b(?:href|src)\s*=/i.test(svg.replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/i, ""))) {
    fail(`${file}: SVG contains a script, event handler or external reference`);
  }
  if (Buffer.byteLength(svg, "utf8") > 12_000) fail(`${file}: optimized logo exceeds 12 KB`);
}

const ethereumLogo = read("assets/payment-logos/ethereum.svg");
if (!/viewBox="0 0 32 48"/.test(ethereumLogo)) fail("assets/payment-logos/ethereum.svg: expected a tight Ethereum diamond viewBox");
if ((ethereumLogo.match(/<polygon\b/g) || []).length !== 6) fail("assets/payment-logos/ethereum.svg: expected six faceted diamond polygons");
if (/<rect\b|<image\b|<linearGradient\b|<radialGradient\b/i.test(ethereumLogo)) {
  fail("assets/payment-logos/ethereum.svg: background canvas, raster image or gradient remains");
}
if (/#5A9DED|#53D3E0|#FF9C92|#FFE94D|#9FDB6F|#D28ECB/i.test(ethereumLogo)) {
  fail("assets/payment-logos/ethereum.svg: old rainbow Ethereum colors remain");
}

for (const logoFile of ["osrs-logo.png", "rs3-logo.png"]) {
  const file = `assets/payment-icons/${logoFile}`;
  const absoluteFile = path.join(root, file);
  if (!fs.existsSync(absoluteFile)) {
    fail(`${file}: local RuneScape logo is missing`);
    continue;
  }
  if (fs.statSync(absoluteFile).size < 1_000) fail(`${file}: RuneScape logo file appears empty`);
}

const sitemap = read("sitemap.xml");
if (!sitemap.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) fail("sitemap.xml: xhtml namespace for hreflang is missing");
for (const pair of pairs) {
  if (!sitemap.includes(`<loc>${pair.esUrl}</loc>`)) fail(`sitemap.xml: missing ${pair.esUrl}`);
  for (const [lang, href] of [["en", pair.enUrl], ["es", pair.esUrl], ["x-default", pair.enUrl]]) {
    if (!sitemap.includes(`hreflang="${lang}" href="${href}"`)) fail(`sitemap.xml: missing ${lang} alternate for ${pair.esUrl}`);
  }
}

const languageScript = read("script.js");
for (const required of ["navigator.languages", "navigator.language", "selectedLanguage", "spanishLanguageSuggestionDismissed", "Esta página también está disponible en español.", "Ver en español", "Continuar en ", "English"]) {
  if (!languageScript.includes(required)) fail(`script.js: missing language-suggestion requirement: ${required}`);
}
if (/location\.(?:replace|assign)\s*\(/.test(languageScript)) fail("script.js: automatic or scripted language navigation remains");
if (/window\.setLanguage\b|function\s+setLanguage\b/.test(languageScript)) fail("script.js: obsolete JavaScript-only setLanguage implementation remains");

const intendedEnglish = [
  "English",
  "RSPS Gold Hub",
  "Discord",
  "Impact",
  "Roat PKZ",
  "RoatPKZ",
  "SpawnPK",
  "Cash Bag",
  "PKP",
  "PK Points",
  "Donation Credits",
  "PvP",
  "PvM",
  "Wilderness",
  "Last Man Standing",
  "Dice",
  "Blackjack",
  "Mines",
  "Flower Poker",
  "Collection Log",
  "Hiscores",
  "Eldorado",
  "Sythe",
  "A6D9",
  "::gamble",
];

for (const pair of pairs) {
  const html = read(pair.es);
  const quoted = [...html.matchAll(/<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/gi)].map((match) => match[0]);
  if (quoted.length) warnings.push(`${pair.es}: ${quoted.length} English public review/vouch excerpts intentionally preserved verbatim`);
  const visible = html
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<blockquote\b[^>]*>[\s\S]*?<\/blockquote>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
  const markers = [" the ", " and ", " current ", " stock ", " price ", " buy ", " sell ", " account ", " before ", " available ", " request "];
  const candidates = visible.split(/[.!?]+/).map((text) => text.trim()).filter((text) => markers.some((marker) => ` ${text.toLowerCase()} `.includes(marker)));
  const unresolved = candidates.filter((text) => !intendedEnglish.some((term) => text === term));
  if (unresolved.length) warnings.push(`${pair.es}: English-language candidates to review: ${[...new Set(unresolved)].slice(0, 8).join(" | ")}`);
}

console.table(results);
for (const warning of warnings) console.warn(`WARN: ${warning}`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Spanish MVP check passed: ${pairs.length} reciprocal page pairs, local resources, JSON-LD, IDs, hashes, sitemap and invariants.`);
}
