import fs from "node:fs";
import path from "node:path";

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const files = [
  "guides.html",
  "impact-guide.html",
  "impact-tombs-of-amascut-guide.html",
  "impact-theatre-of-blood-guide.html",
  "impact-chambers-of-xeric-guide.html",
  "impact-gemstone-crab-guide.html",
  "impact-money-making-guide.html",
  "impact-thieving-guide.html",
  "impact-hunter-guide.html",
  "impact-slayer-guide.html",
  "impact-donator-benefits-guide.html",
  "roat-pkz-guide.html",
  "roat-pkz-starter-guide.html",
  "roat-pkz-money-making-guide.html",
  "roat-pkz-donator-ranks-guide.html",
  "spawnpk-guide.html",
  "spawnpk-starter-guide.html",
  "spawnpk-money-making-guide.html",
  "spawnpk-donator-ranks-guide.html",
];
const failures = [];
let visibleQuestionCount = 0;
let schemaQuestionCount = 0;

function fail(file, message) {
  failures.push(`${file}: ${message}`);
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value.replace(
    /&(#x[\da-f]+|#\d+|[a-z]+);/gi,
    (match, entity) => {
      if (entity[0] === "#") {
        const number =
          entity[1].toLowerCase() === "x"
            ? Number.parseInt(entity.slice(2), 16)
            : Number.parseInt(entity.slice(1), 10);
        return Number.isFinite(number) ? String.fromCodePoint(number) : match;
      }
      return named[entity.toLowerCase()] ?? match;
    },
  );
}

function text(value) {
  return decodeEntities(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function typeIncludes(node, expected) {
  return (
    node?.["@type"] === expected ||
    (Array.isArray(node?.["@type"]) && node["@type"].includes(expected))
  );
}

for (const file of files) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const canonical = source.match(
    /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i,
  )?.[1];
  if (!canonical) fail(file, "missing canonical URL");

  const ids = [...source.matchAll(/\bid=["']([^"']+)["']/gi)].map(
    (match) => match[1],
  );
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicateIds.length) {
    fail(file, `duplicate IDs: ${duplicateIds.join(", ")}`);
  }
  const idSet = new Set(ids);
  for (const match of source.matchAll(/\baria-labelledby=["']([^"']+)["']/gi)) {
    for (const id of match[1].split(/\s+/)) {
      if (!idSet.has(id)) fail(file, `aria-labelledby points to missing #${id}`);
    }
  }

  const faqSections = [
    ...source.matchAll(
      /<section\b[^>]*\bid=["']faq["'][\s\S]*?<\/section>/gi,
    ),
  ];
  if (faqSections.length !== 1) {
    fail(file, `expected one visible #faq section, found ${faqSections.length}`);
    continue;
  }
  const faq = faqSections[0][0];
  if (
    !/class=["'][^"']*\bguide-faq\b/i.test(faq) ||
    !/aria-labelledby=["']faq-title["']/i.test(faq) ||
    !/<h2\b[^>]*\bid=["']faq-title["']/i.test(faq)
  ) {
    fail(file, "FAQ must use the shared guide-faq section and faq-title relationship");
  }
  if (/\b(?:server-faq|rank-faq|faq-list)\b/i.test(faq)) {
    fail(file, "FAQ still uses a legacy guide FAQ class");
  }

  const details = [
    ...faq.matchAll(
      /<details\b[^>]*class=["'][^"']*\bguide-faq__item\b[^"']*["'][^>]*>([\s\S]*?)<\/details>/gi,
    ),
  ];
  if (!details.length) fail(file, "FAQ has no shared FAQ items");
  const visible = [];
  for (const [index, detail] of details.entries()) {
    const body = detail[1];
    const summaries = [
      ...body.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi),
    ];
    if (summaries.length !== 1) {
      fail(file, `FAQ item ${index + 1} must contain exactly one summary`);
      continue;
    }
    const question = text(
      summaries[0][1].match(
        /<span\b[^>]*class=["'][^"']*\bguide-faq__question\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/i,
      )?.[1] || "",
    );
    const icon = summaries[0][1].match(
      /<span\b[^>]*class=["'][^"']*\bguide-faq__icon\b[^"']*["'][^>]*>/i,
    )?.[0];
    const answer = text(
      body.match(
        /<div\b[^>]*class=["'][^"']*\bguide-faq__answer\b[^"']*["'][^>]*>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/i,
      )?.[1] || "",
    );
    if (!question) fail(file, `FAQ item ${index + 1} has an empty question`);
    if (!answer) fail(file, `FAQ item ${index + 1} has an empty answer`);
    if (!icon || !/\baria-hidden=["']true["']/i.test(icon)) {
      fail(file, `FAQ item ${index + 1} icon must be aria-hidden`);
    }
    visible.push({question, answer});
  }
  visibleQuestionCount += visible.length;
  const duplicateQuestions = visible
    .map((item) => item.question)
    .filter((question, index, all) => all.indexOf(question) !== index);
  if (duplicateQuestions.length) {
    fail(file, `duplicate visible FAQ questions: ${[...new Set(duplicateQuestions)].join(", ")}`);
  }

  if (
    source.includes('class="guide-toc"') &&
    !/class=["'][^"']*\bguide-toc\b[\s\S]*?href=["']#faq["']/i.test(source)
  ) {
    fail(file, "article table of contents is missing its FAQ link");
  }
  if (source.indexOf('id="faq"') > source.indexOf("</main>")) {
    fail(file, "FAQ is not inside main content");
  }

  const nodes = [];
  for (const match of source.matchAll(
    /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const json = JSON.parse(match[1]);
      nodes.push(...(json["@graph"] || [json]));
    } catch (error) {
      fail(file, `invalid JSON-LD: ${error.message}`);
    }
  }
  const faqNodes = nodes.filter((node) => node?.["@type"] === "FAQPage");
  if (faqNodes.length !== 1) {
    fail(file, `expected one FAQPage node, found ${faqNodes.length}`);
    continue;
  }
  const faqNode = faqNodes[0];
  if (faqNode["@id"] !== `${canonical}#faq`) {
    fail(file, "FAQPage @id does not match canonical#faq");
  }
  const schema = (faqNode.mainEntity || []).map((item) => ({
    question: item?.name || "",
    answer: item?.acceptedAnswer?.text || "",
  }));
  schemaQuestionCount += schema.length;
  if (JSON.stringify(visible) !== JSON.stringify(schema)) {
    fail(file, "visible questions and answers do not exactly match FAQPage");
  }

  const webPage = nodes.find((node) => typeIncludes(node, "WebPage"));
  const parts = webPage?.hasPart
    ? Array.isArray(webPage.hasPart)
      ? webPage.hasPart
      : [webPage.hasPart]
    : [];
  if (!parts.some((part) => part?.["@id"] === `${canonical}#faq`)) {
    fail(file, "WebPage does not reference FAQPage through hasPart");
  }

  if (
    !/styles\.css\?v=20260726-spawnpk-card-icons-1/i.test(source)
  ) {
    fail(file, "guide does not use the shared FAQ stylesheet cache version");
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(
  `FAQ check passed: ${files.length} guide pages, ${visibleQuestionCount} visible questions, ${schemaQuestionCount} schema questions.`,
);
