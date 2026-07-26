# Siste pre-publish QA

Dato: 2026-07-24
Resultat: **PASS for lokal implementering**
Publisering: Ikke utført

## Viktigste konklusjon

SEO-endringene er konsistente, testbare og klare for eiers sluttgjennomgang.
Den eksisterende seksstegsdesignen på forsiden er bevart. Near-Reality er nå
en vanlig kommersiell, indekserbar side og inngår i navigasjon, internlenking
og sitemap.

Forsidens første tre serverkort er verifisert i denne eksakte rekkefølgen:
**Impact, Roat PKZ, SpawnPK**. SpawnPK-siden er avgrenset til Cash Bags og
trill-baserte mengder.

## Bekreftede eieropplysninger

- Discord-brukernavn: `a6d9`.
- Discord-ID: `640265737050652672`.
- Impact, Roat PKZ, SpawnPK, Alora, RuneX, Orion, Ferox, Near-Reality og
  forespørsler om andre RSPS støttes aktivt.
- Near-Reality-gull selges etter samme tilbudsbaserte prosess som andre
  støttede servere.
- Konto-passord skal ikke innhentes.
- Tjenesten er uavhengig og ikke tilknyttet Jagex, RuneScape eller
  servereierne.
- Det separate SpawnPK-domenet har samme eier og identitet.
- Pris, lager, betalingsdetaljer og leveringsplan avklares internt før
  gjennomføring.

## Testmatrise

| Kontroll | Resultat |
|---|---|
| `node --check script.js` | PASS |
| `node --check seo-check.mjs` | PASS |
| `node --check seo-check.test.mjs` | PASS |
| `node seo-check.mjs` | PASS |
| 16 negative SEO-fixtures | PASS; alle ga forventet feil |
| Første tre forsidekort | Impact → Roat PKZ → SpawnPK |
| Kortrekkefølge i HTML-kilden | PASS |
| Rendret kortrekkefølge, 390 og 1440 px | PASS; identisk prioritering uten overflow |
| SpawnPK Cash Bag-/trill-terminologi | PASS |
| SpawnPK-eksempel med `10T` | PASS |
| SpawnPK flervalutamarkedsføring | Ingen funnet |
| SpawnPK, 390 og 1440 px | Ingen overflow eller ødelagte bilder |
| Impact, 390 og 1440 px | Én H1, ingen overflow eller ødelagte bilder; fem navigasjonslenker synlige |
| Impact-kopimelding | Eksakt Impact-melding med `Amount: 50B` kopiert |
| Forsidens eksisterende eksempelmelding | Fortsatt korrekt Roat PKZ/100M-melding |
| Impact Discord-kopiering | `a6d9` kopiert |
| Impact FAQ | Seks spørsmål; én åpen om gangen |
| Tastaturfokus | Synlig 2 px gullfokus på FAQ-kontroll |
| Impact/forside konsoll | Ingen feil eller advarsler |
| Udokumenterte superlativer | Ingen funnet |
| HTML-filer kontrollert | 11 |
| Forventede indekserbare sider | 10 |
| Kommersielle serversider | 9 |
| Sitemap-URL-er | 10 |
| Unike title/description/H1 | PASS |
| Canonical/robots/sitemap-samsvar | PASS |
| JSON-LD-parsing og typer | PASS |
| Lokale assets og internlenker | PASS |
| Bilder med alt og dimensjoner | PASS |
| Forbudte påstander | Ingen funnet |
| Høyeste 3-ords tekstlikhet | 4,7 %; grense 55 % |
| Mobil 390 px, alle 11 sider | Ingen overflow, ingen ødelagte bilder, én H1 |
| Desktop 1440 px, alle 11 sider | Ingen overflow, ingen ødelagte bilder, én H1 |
| Forside 360/768/1024 px | Ingen overflow, ingen ødelagte bilder, én H1 |
| Discord-kopiering | `a6d9` kopiert |
| Eksempelmelding | Komplett melding kopiert |
| FAQ | Åpnet korrekt |
| `#servers`-navigasjon | Korrekt URL-fragment |
| Konsollfeil/advarsler | Ingen på forsiden eller Near-Reality |
| `git diff --check` | PASS; kun forventede LF/CRLF-varsler |

## Side- og sitemapstatus

| URL | Indeksering | Sitemap | Kommersiell |
|---|---|---|---|
| `/` | index, follow | Ja | Ja |
| `/roat-pkz-gold.html` | index, follow | Ja | Ja |
| `/spawnpk-gold.html` | index, follow | Ja | Ja |
| `/alora-gold.html` | index, follow | Ja | Ja |
| `/runex-gold.html` | index, follow | Ja | Ja |
| `/impact-gold.html` | index, follow | Ja | Ja |
| `/orion-gold.html` | index, follow | Ja | Ja |
| `/ferox-gold.html` | index, follow | Ja | Ja |
| `/near-reality-gold.html` | index, follow | Ja | Ja |
| `/other-rsps-gold.html` | index, follow | Ja | Ja |
| `/404.html` | noindex, follow | Nei | Nei |

## Påstandsrevisjon

| Påstandstype | QA-resultat |
|---|---|
| Pris | Impact: kun eierbekreftet «From $1 per 1B» med variasjonsforbehold; ingen andre faste priser |
| Leveringstid/responstid | Ikke lovet |
| Kundetall/anmeldelser | Ikke publisert |
| Garanti/«100 % safe» | Ikke publisert |
| Refusjonsløfte | Ikke publisert |
| Permanent lagerstatus | Ikke publisert |
| Betalingsmetoder | Ikke oppgitt uten godkjent dokumentasjon |
| Discord-identitet | Eksakt ID brukt konsekvent |
| Ikke behov for passord | Oppgitt konsekvent |
| Uavhengighet/ikke-tilknytning | Synlig formulert |
| Servervalutaer | Kildebasert eller tydelig bedt bekreftet i spillet |

## SpawnPK-sluttverdier

- Title: `Buy SpawnPK Gold & Cash Bags | Request a Quote`
- Meta description: `Request a current SpawnPK gold and Cash Bag quote in trills. Send the amount in T, then confirm availability, the rate, and delivery details on Discord.`
- H1: `Buy SpawnPK Gold in Trills`
- Relevant enhet: Cash Bags og mengder i `trills`/`T`
- Eksempel:

  ```text
  Hi, I want to buy SpawnPK Cash Bags.
  Amount: 10T
  What is the current quote and availability?
  ```

Tidligere flervalutatekst er fjernet fra offentlige sider, innholdsbrief og
SEO-rapport. Valideringen inneholder en eksplisitt negativ regel som hindrer
at slik markedsføring introduseres igjen.

## Impact-sluttverdier

- Title: `Buy Impact RSPS Gold – Price & Stock | RSPS Gold Hub`
- Meta description: `Buy Impact RSPS gold from $1 per 1B. Check the current price, available stock and delivery details with a6d9 on Discord.`
- H1: `Buy Impact RSPS Gold`
- Laveste mulige sats: `From $1 per 1B`
- Eksempelmelding: Impact, `Amount: 50B`, spørsmål om current price and stock
- Kjøpsprosess: tre steg
- Nye kjøperseksjoner: pris/lager, forsyning, salg av Impact-gull,
  Discord-verifisering, kontosikkerhet og kort FAQ
- Intern SEO-rapporttekst i offentlig Impact-HTML: ingen funnet
- Pris uten «from»/«starting from»: ingen funnet

## Near-Reality

Tidligere `noindex`-behandling er fjernet i tråd med eiers bekreftelse.
Sluttversjonen:

- har kommersiell CTA;
- bruker NRGP som eksakt valuta;
- er `index, follow`;
- står i sitemap og forsiden;
- har `WebPage`, `Service` og `BreadcrumbList`;
- lenker til både den offisielle RWT-siden og regelsiden;
- ber brukeren kontrollere gjeldende vilkår før betaling.

Dette er et overvåkingspunkt etter publisering, ikke en teknisk blokkering.

## Manuelle kontroller etter publisering

1. Åpne alle ti sitemap-URL-er på produksjonsdomenet og bekreft HTTP 200.
2. Åpne en tilfeldig ukjent URL og bekreft custom 404 med faktisk HTTP 404.
3. Kjør Lighthouse mobile og desktop på produksjons-URL.
4. Kontroller canonical og JSON-LD i URL Inspection.
5. Send inn sitemap på nytt i Search Console.
6. Bekreft at Discord-profilen som åpnes tilhører riktig konto.
7. Kontroller Near-Reality-kildene på nytt før første publisering og månedlig.
8. Planlegg 301-konsolidering av det separate SpawnPK-domenet.

## Begrensninger

- Ingen Lighthouse-score er oppgitt.
- Produksjonscache, HTTP-headere, faktisk 404-status og feltbaserte Core Web
  Vitals kan ikke verifiseres før deploy.
- GSC-utvalget er kort og delvis anonymisert.
- RuneX og Orion mangler en aktuell, komplett førsteparts valutaordliste.

## Leveransebeslutning

**Klar for eiers pre-publish-godkjenning.** Ingen commit, push eller deploy er
utført. Etter godkjenning bør produksjonskontrollene over gjennomføres før
Search Console-innsending.
