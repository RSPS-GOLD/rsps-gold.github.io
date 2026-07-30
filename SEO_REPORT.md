# SEO-rapport: RSPS Gold Hub

Rapportdato: 2026-07-24
Nettsted: <https://rsps-gold.com/>
Status: Implementert lokalt, ikke publisert

## Sammendrag

RSPS Gold Hub er bygget om fra et sett med svært like salgssider til en tydelig
hub med ni selvstendige kommersielle landingssider. Eksisterende URL-er og
visuell profil er bevart. Den nummererte seksstegsmodulen på forsiden er også
bevart; det er bare presisjonen i teksten rundt kjøpsprosessen som er forbedret.

Den leverte Search Console-arbeidsboken viser tidlig organisk synlighet:

| Måling | Resultat |
|---|---:|
| Observert periode | 2026-07-03–2026-07-21 |
| Klikk | 30 |
| Visninger | 316 |
| CTR | 9,49 % |
| Visningsvektet posisjon | 10,67 |

Impact, Roat PKZ og SpawnPK er bekreftet som de tre viktigste kommersielle
serverne, i akkurat den rekkefølgen. De er derfor de tre første kortene i alle
primære serveroversikter. Impact, Roat PKZ, forsiden og SpawnPK er samtidig de
eneste sidene som vises i GSC-sidefanen og er første måleprioritet. De øvrige sidene er beholdt fordi
eier har bekreftet aktiv støtte, og fordi innholdet nå har en tydelig egen
oppgave, unik terminologi og tilstrekkelig selvstendig verdi.

De viktigste implementerte resultatene er:

- Ti indekserbare URL-er: forsiden og ni kommersielle sider.
- Forsidens kortrekkefølge starter med Impact, Roat PKZ og SpawnPK.
- Near-Reality er en normal kommersiell NRGP-side med `index, follow`, CTA,
  internlenker og sitemap-oppføring.
- Alle servertekstene er skrevet om fra grunnen av etter ferdige innholdsbrief.
- Udokumenterte priser, leveringstider, kundetall, garantier, refusjonsløfter
  og sikkerhetspåstander er fjernet. Impact viser nå den eierbekreftede laveste
  mulige satsen som «From $1 per 1B», alltid med synlig variasjonsforbehold.
- Alle kommersielle sider har unik tittel, beskrivelse, H1, FAQ, steg,
  internlenker og strukturert data.
- Et utvidet SEO-kontrollprogram og seks negative tester hindrer regresjoner.
- Visuell kontroll er gjennomført på mobil og desktop uten overflow, ødelagte
  bilder eller konsollfeil.

## Datagrunnlag og metode

### Search Console

Arbeidsboken inneholder fanene `Chart`, `Queries`, `Pages`, `Countries`,
`Devices`, `Search appearance` og `Filters`. Filterfanen sier «Last 3 months»,
men observerte datoer dekker bare 2026-07-03 til 2026-07-21. Rapporten bruker
derfor den faktiske perioden.

Dato-, land- og enhetsfanene stemmer overens på 30 klikk og 316 visninger.
Sidefanen summerer til 334 visninger, mens synlige søkeord summerer til 128.
Disse dimensjonene skal ikke legges sammen. Side- og søkeorddata brukes
retningsgivende, mens totalene kommer fra datofanen.

Reproduserbare beregninger:

- CTR: `30 / 316 = 9,4937 %`.
- Vektet posisjon:
  `sum(visninger × radposisjon) / sum(visninger) = 3372,5 / 316 = 10,6725`.
- Mobil CTR: `19 / 77 = 24,6753 %`.
- Desktop CTR: `11 / 239 = 4,6025 %`.

Forskjellen mellom mobil og desktop er beskrivende, ikke et bevist
årsakssammenheng. Utvalget er for lite til signifikans- eller sesonganalyse.

### Observerte sider

| Side | Klikk | Visninger | CTR | Posisjon | Tolkning |
|---|---:|---:|---:|---:|---|
| Impact | 13 | 163 | 7,98 % | 6,80 | Størst synlighet; beskytt kommersiell relevans |
| Roat PKZ | 10 | 65 | 15,38 % | 12,14 | God CTR; størst gevinst ligger i posisjon |
| Forsiden | 6 | 83 | 7,23 % | 13,94 | Eier generisk kjøpsintensjon |
| SpawnPK | 1 | 23 | 4,35 % | 18,13 | Trenger mer presis snippet og sideverdi |

Synlige søk støtter denne arkitekturen. Eksempler er `impact rsps gold`,
`rsps gold`, `buy rsps gold`, `spawnpk gold`, `buy spawnpk`, `roat pkz gold`
og `roat pkz`. Den brede frasen `impact rsps` har informasjons- og
navigasjonsintensjon; siden skal derfor først og fremst eie den kommersielle
frasen `impact rsps gold`.

### Søkeresultat- og autocomplete-kontroll

Kontroll 2026-07-24 viste at:

- Generiske resultater domineres av brede markedsplasser, forumtråder,
  eldre butikker og toplister.
- Eksakte kombinasjoner av servernavn + gold har mindre og ofte svakere
  konkurranse enn generiske fraser.
- Autocomplete viste kommersiell etterspørsel for blant annet Impact, Roat,
  SpawnPK, Alora, RuneX, Orion og Ferox.
- Near-Reality ga ikke nyttige autocomplete-forslag, så siden vurderes ut fra
  bekreftet aktiv støtte og serverens egne kilder, ikke påstått søkevolum.

## Mulighetsscore

Scoren er en prioriteringsmodell, ikke en trafikkprognose. Maks 100 poeng:

- Etterspørsel 0–20:
  `20 × sqrt(sidevisninger / 163)`, avrundet. Null når siden ikke finnes i
  eksportens sidefane.
- Rangeringsmulighet 0–15: posisjon 4–10 = 12, 11–20 = 15, 21–40 = 10,
  over 40 = 5, ingen data = 0.
- CTR-gap 0–10:
  `10 × max(0, (referanse-CTR − faktisk CTR) / referanse-CTR)`, avrundet.
  Referanser: posisjon 1–3 = 20 %, 4–10 = 10 %, 11–20 = 4 %,
  21–40 = 2 %, over 40 = 1 %.
- Kommersiell intensjon 0–15, side-/tjenesterelevans 0–10,
  konkurransegjennomførbarhet 0–10, opprinnelig kvalitetsgap 0–10 og
  konverteringsverdi 0–10 er dokumenterte redaksjonelle vurderinger.

| Side/tema | Ettersp. | Rang. | CTR-gap | Intensjon | Relevans | Konkurranse | Kvalitetsgap | Konvertering | Sum |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Impact | 20 | 12 | 2 | 15 | 10 | 6 | 7 | 10 | 82 |
| Roat PKZ | 13 | 15 | 0 | 15 | 10 | 7 | 6 | 10 | 76 |
| SpawnPK | 8 | 15 | 0 | 15 | 10 | 7 | 7 | 10 | 72 |
| Forsiden | 14 | 15 | 0 | 14 | 10 | 5 | 5 | 9 | 72 |
| Near-Reality | 0 | 0 | 0 | 15 | 10 | 6 | 8 | 10 | 49 |
| Alora | 0 | 0 | 0 | 15 | 10 | 6 | 8 | 10 | 49 |
| Orion | 0 | 0 | 0 | 15 | 10 | 6 | 8 | 10 | 49 |
| Ferox | 0 | 0 | 0 | 15 | 10 | 6 | 8 | 10 | 49 |
| RuneX | 0 | 0 | 0 | 14 | 10 | 7 | 8 | 9 | 48 |
| Andre RSPS | 0 | 0 | 0 | 9 | 8 | 5 | 6 | 6 | 34 |

Null i GSC-feltene betyr «ingen synlig rad i den leverte eksporten», ikke
bevist null etterspørsel.

## Søkeord-til-side-kart

| Primær klynge | Sekundære varianter | Søkeintensjon | Eier |
|---|---|---|---|
| rsps gold | buy rsps gold, rsps gold rates, rsps gold for sale | Generisk kommersiell | `/` |
| impact rsps gold | buy impact gold, impact gold for sale | Serverkommersiell | `/impact-gold.html` |
| roat pkz gold | PK Points, PKP, RoatPKZ, Roatz | Serverkommersiell | `/roat-pkz-gold.html` |
| spawnpk gold | buy SpawnPK Cash Bags, SpawnPK trills, SpawnPK gold in trillions, gold rate | Serverkommersiell | `/spawnpk-gold.html` |
| alora gold | Alora coins, Alora GP, platinum tokens | Serverkommersiell | `/alora-gold.html` |
| runex gold | RuneX coins, plats, Rune Coins | Serverkommersiell | `/runex-gold.html` |
| orion rsps gold | buy Orion gold, Orion currency | Serverkommersiell | `/orion-gold.html` |
| ferox rsps gold | Ferox coins, Ferox currency | Serverkommersiell | `/ferox-gold.html` |
| near-reality gold | buy NRGP, Near-Reality gold quote | Serverkommersiell | `/near-reality-gold.html` |
| other rsps gold | unlisted RSPS, request another server | Kvalifisering | `/other-rsps-gold.html` |

Det skal ikke opprettes egne sider for stavevarianter som `Roatz`, `RoatPKZ`
eller `PKP`. De tilhører samme kanoniske side.

## Serverfakta og innholdsstrategi

Det komplette kildegrunnlaget ligger i `CONTENT_SOURCES.md`, mens
sideoppdragene ligger i `CONTENT_BRIEFS.md`.

- Roat PKZ: den offisielle wikien identifiserer PK Points (PKP) som
  hovedvaluta. Andre poengsystemer omtales som separate.
- SpawnPK: siden fokuserer på Cash Bags og kjøpsmengder i trillions, naturlig
  skrevet som `trills` eller `T`. Eksempelordren bruker `10T`.
- Alora: coins/GP/platinum tokens skilles fra store tokens og activity points.
- RuneX: coins/plats skilles fra Rune Coins, RuneX Points og andre valutaer.
  Nåværende valutaordliste er en community-kilde og merkes derfor med lavere
  autoritet.
- Impact: kjøpersiden viser laveste mulige sats «From $1 per 1B», forklarer
  pris- og lagerendringer, har en egen 50B-kopimelding, tre kjøpssteg,
  spillerbasert forsyning, salgshenvendelser og identitets-/risikoveiledning.
- Orion: siden avklarer at forespørselen gjelder den aktuelle serveren på
  `orion.ps`, ikke andre produkter med samme navn.
- Ferox: coins skilles fra vote-, instance-, pet- og andre spesialtokens.
- Near-Reality: NRGP brukes eksplisitt. Siden lenker både den offisielle
  RWT-presentasjonen og den separate regelsiden, fordi de publiserte signalene
  ikke er fullt harmonisert.
- Andre RSPS: siden er en kvalifiseringsflyt som krever offisiell URL, eksakt
  valuta, modus, mengde og regelverk før tilbud.

## Implementert on-page SEO

- Unike titler, beskrivelser og H1-er for alle ti indekserbare URL-er.
- Én tydelig primær intensjon per side.
- Unike hero-tekster, valutaavklaringer, kjøpssteg, FAQ-er og relaterte lenker.
- Naturlig bruk av primære fraser uten repetitiv nøkkelordfylling.
- Synlige breadcrumbs på serverlandingssider.
- Kommersiell CTA til korrekt Discord-bruker-ID.
- «Current quote» brukes for alle variable priser. Impact viser i tillegg den
  dokumenterte laveste mulige satsen «From $1 per 1B» uten å love at alle ordre
  får denne prisen.
- «Availability confirmed» brukes i stedet for lagergarantier.
- Ingen konto-passord kreves i den beskrevne prosessen.
- Ingen udokumenterte betalingsmetoder, leveringstider, refusjoner,
  kundetall, garantier eller «100 % safe»-påstander.

Synlig tekst i `<main>` er 453–621 ord per kommersielle side. Høyeste
3-ords-shingle-Jaccard mellom to sider er 4,7 % (Alora/Impact), langt under
kontrollgrensen på 55 %. Sidene er derfor ikke lenger mekaniske varianter av
samme tekst.

## Teknisk SEO

### Indeksering og kanoniske signaler

- Sitemap inneholder nøyaktig ti kanoniske, indekserbare URL-er.
- Near-Reality er inkludert og har `index, follow`.
- `404.html` er `noindex, follow` og har egen metadata.
- Alle kanoniske lenker bruker den etablerte `.html`-strukturen.
- `robots.txt` tillater crawling og peker til riktig sitemap.
- Alle sitemap-datoer er satt til 2026-07-24 for de faktisk redigerte sidene.

### Strukturert data

Forsiden bruker `WebSite`, `Organization`, `WebPage` og `Service`. Hver av de
ni kommersielle sidene bruker `WebPage`, `Service` og `BreadcrumbList`.
JSON-LD er syntaktisk validert.

Det er bevisst ikke lagt inn `Product`, `Offer`, pris, lagerstatus, rating,
anmeldelser eller aggregert rating, fordi dokumentasjon for slike påstander
ikke er levert.

### Bilder og ytelse

- Alle HTML-bilder har alternativtekst og eksplisitt bredde/høyde.
- Kortlogoer under første skjermbilde bruker lazy loading og asynkron dekoding.
- Primært innhold er statisk HTML og krever ikke JavaScript for indeksering.
- `prefers-reduced-motion` og synlig `:focus-visible`-stil finnes.

Gjenværende ytelsesmulighet: bakgrunnsbildet, hovedlogoen og enkelte
serverlogoer er større enn nødvendig for vist størrelse. De bør konverteres
til visuelt godkjente WebP/AVIF-varianter i en egen bildeoppgave. Ingen
Lighthouse-score oppgis, fordi Lighthouse ikke var tilgjengelig i den lokale
kjøringen og en lokal score uansett ikke må forveksles med feltdata.

## Internlenking

Forsiden lenker til alle ni kommersielle sider. Impact, Roat PKZ og SpawnPK
står først i denne rekkefølgen på både mobil og desktop. Hver serverside lenker
tilbake til huben og til et kuratert sett relaterte sider. De tre prioriterte
serverne får tidligere, varierte kontekstlenker uten sitewide repetisjon av én
eksakt ankertekst. Near-Reality er behandlet som normal kommersiell side og er
tilgjengelig både fra forsiden, relaterte lenker og sitemap.

Dette gir:

- klar hub-og-spoke-struktur;
- én eier per søkeintensjon;
- ingen foreldreløse kommersielle sider;
- ingen variant-URL-er som konkurrerer med hverandre.

## Near-Reality-vurdering

Eier har eksplisitt bekreftet at Near-Reality-gull selges på samme måte som
andre støttede servere. Den tidligere `noindex`-beslutningen er derfor reversert.

Samtidig publiserer Near-Reality både en egen RWT-presentasjon og en regelside
med separat formulering om tredjepartshandel. Siden:

- er kommersiell og indekserbar;
- bruker NRGP presist;
- lenker til begge offisielle kilder;
- lover ikke at en bestemt transaksjon er regelmessig tillatt;
- ber brukeren kontrollere gjeldende vilkår før betaling.

Dette er den mest ærlige implementeringen med tilgjengelig dokumentasjon.
Reglene bør kontrolleres månedlig og umiddelbart ved endringer.

## SpawnPK-domene

Et separat SpawnPK-nettsted bruker samme identitet og eies av samme operatør.
To selvkanoniske domener med overlappende kommersiell intensjon kan gi
kannibalisering, motstridende påstander og svakere tillit.

Anbefalt strategi:

1. Velg RSPS Gold Hub som primær eiendom for SpawnPK-intensjonen fordi denne
   siden allerede vises i Search Console sammen med resten av huben.
2. 301-redirect den separate overlappende siden til
   `/spawnpk-gold.html`.
3. Ikke bruk cross-domain canonical som erstatning for redirect dersom den
   gamle siden faktisk skal avvikles.
4. Hvis begge domener må beholdes, gi dem klart ulike oppgaver og fjern
   konkurrerende kjøpsinnhold fra den sekundære eiendommen.

Ingen redirect eller domeneendring er utført i denne leveransen.

## Kontroll og regressjonssikring

`seo-check.mjs` kontrollerer blant annet:

- at de tre første forsidekortene er Impact, Roat PKZ og SpawnPK;
- at SpawnPK bruker Cash Bag-/trill-terminologi, har `10T` i
  eksempelmeldingen og ikke markedsfører andre valutaer;
- forventede indekserbare og kommersielle sider;
- tittel, beskrivelse, robots, canonical, H1 og metadataunikhet;
- Open Graph og Twitter metadata;
- JSON-LD og nødvendige typer;
- bilder, lokale assets, internlenker og fragmenter;
- Discord-ID og sikre attributter på eksterne lenker;
- CTA, FAQ, forbudte markedsføringspåstander;
- sitemap, robots og manifest;
- tekstlikhet og dupliserte FAQ-spørsmål.

`seo-check.test.mjs` beviser også at kontrollen stopper ved feil kortrekkefølge,
manglende SpawnPK-terminologi, feil SpawnPK-eksempel, uønsket
flervalutamarkedsføring og udokumenterte superlativer. De opprinnelige
regresjonene for H1, canonical, sitemap og JSON-LD er fortsatt dekket.

## Risiko og begrensninger

- GSC-perioden er bare 19 dager og synlige søkeord er ufullstendige.
- RuneX mangler en aktuell førsteparts valutaordliste.
- Orion mangler en aktuell førsteparts valutaordliste.
- Near-Reality-kildene bør overvåkes fordi de publiserte formuleringene kan
  tolkes ulikt.
- Serverregler og varetilgjengelighet kan endres uten varsel.
- Impact-satsen «From $1 per 1B» må oppdateres dersom eierens prisgulv endres.
- Juridiske vilkår, betalingsmetoder og refusjonsprosess skal ikke publiseres
  før eier leverer godkjent tekst.
- Faktisk GitHub Pages-cache, HTTP-status for custom 404 og Core Web Vitals må
  bekreftes etter publisering.

## 30/60/90-dagers plan

### 0–30 dager

- Publiser etter eiers gjennomgang.
- Send inn sitemap på nytt i Search Console.
- Be om indeksering av forsiden, Impact, Roat, SpawnPK og Near-Reality.
- Kontroller at alle ti kanoniske URL-er blir oppdaget og at 404 gir faktisk
  HTTP 404 i produksjon.
- Ta ukentlig eksport av sider, søkeord, dato og enhet med samme metode.
- Mål Discord-profilklikk og kopieringshandlinger først etter at godkjent
  analyseoppsett foreligger.

### 31–60 dager

- Sammenlign sidevisninger, CTR og posisjon mot denne baselinen.
- Prioriter Impact dersom posisjon eller CTR faller etter snippet-endringen.
- Se etter fremgang for Roat/PKP-varianter og SpawnPK.
- Kontroller om Alora, RuneX, Orion, Ferox og Near-Reality begynner å få egne
  søkeord; ikke slå sammen sider bare fordi tidlig volum er lavt.
- Optimaliser store bilder og kjør Lighthouse på publisert URL.

### 61–90 dager

- Bygg bare nye serversider når både faktisk støtte, kildegrunnlag og
  etterspørsel er dokumentert.
- Oppdater valuta- og regelkilder med ny kontroll-dato.
- Avgjør og gjennomfør SpawnPK-domene­konsolidering.
- Test nye titler kun på sider med nok visninger til at CTR-endringer kan
  tolkes.
- Evaluer konvertering per side uten å publisere persondata eller
  udokumenterte tillitspåstander.

## Konklusjon

Den lokale versjonen er teknisk og innholdsmessig klar for eiers
pre-publish-godkjenning. Kommersiell serverprioritet er Impact, Roat PKZ og
SpawnPK; forsiden er i tillegg en viktig generisk GSC-mulighet. Near-Reality er nå korrekt behandlet som en støttet,
kommersiell side, samtidig som regelusikkerheten forklares med lenker til
offisielle kilder. Ingen commit, push eller publisering er utført.
