# Modlitby online

https://modlitbyonline.cz/

Multipage web (MPA) postavený na **Vite + TypeScriptu**, bez CSS knihoven a JS
frameworků. Každá modlitba je samostatná stránka s vlastním `index.html`.

## Skripty

```bash
npm install      # instalace závislostí
npm run dev      # vývojový server
npm run build    # produkční build + vygenerování sitemap.xml
npm run preview  # náhled produkčního buildu
```

## Struktura

```
.
├── pages/                    # kořen webu (Vite `root`) – jen stránky + public
│   ├── index.html            # rozcestník (modlitbyonline.cz/)
│   ├── <slug>/               # jedna interní modlitba = jedna top-level složka
│   │   └── index.html        # stránka modlitby (/<slug>/)
│   └── public/               # statické soubory kopírované do kořene webu
│       ├── favicon.ico
│       ├── robots.txt
│       ├── img/                  # loga a obrázky
│       └── <slug>/               # soubory modlitby
│           └── manifest.json
├── src/                      # veškerý zdrojový kód (mimo Vite root)
│   ├── partials/             # sdílené Handlebars části (nav, footer, prayer-card, icon-*)
│   ├── scripts/              # home.ts (rozcestník), <slug>.ts a ostatní
│   │   └── components/       # custom elementy (light DOM, bez shadow DOM)
│   └── styles/               # common.css (sdílené styly), <slug>.css a ostatní
├── generate-sitemap.js       # generuje dist/sitemap.xml
└── vite.config.js            # automatická detekce HTML vstupů
```

> `src/` leží **mimo** Vite root (`pages/`), proto se na něj z HTML odkazuje
> **relativně** (`../src/...` z rozcestníku, `../../src/...` ze stránky modlitby),
> nikoli absolutně.

## Přidání modlitby

**Externí** (cizí doména): stačí přidat kartu na rozcestník (viz níže) s `href` na cizí doménu.

**Interní** (na `modlitbyonline.cz`):

1. Vytvoř složku `pages/<slug>/index.html` s obsahem stránky a příslušnými meta tagy.
2. Vytvoř `pages/public/<slug>/manifest.json`.
3. Vytvoř `src/styles/<slug>.css` (s `@import "./common.css";`) a `src/scripts/<slug>.ts` a nalinkuj je v hlavičce nové stránky **relativně** (`../../src/...`).
4. Přidej kartu na rozcestník.

**Důležité:** `vite.config.js` i `generate-sitemap.js` do rozcestníku vůbec
nekoukají – novou stránku poznají jen podle složky s `index.html`. Proto musí
`href` interní modlitby přesně odpovídat názvu složky, jinak build i sitemap
proběhnou v pořádku, ale odkaz na rozcestníku povede jinam.

## Karta modlitby

Karta na rozcestníku se skládá z Handlebars partialu `prayer-card` (statické HTML,
renderuje se při buildu → je indexovatelné) a custom elementu `<prayer-card>`
(`src/scripts/components/prayer-card.ts`), který k hotovému HTML jen doplňuje chování.
Element **nic nerenderuje** a nemá shadow DOM; bez JS zůstane karta plně čitelná,
jen bez zaškrtávátka oblíbených.

```hbs
{{> prayer-card
    href="/krizova-cesta/"
    icon="icon-flame"
    badge="Pobožnost"
    title="Křížová cesta"
    description="…" }}
```

| Parametr      | Povinný | Význam                                                       |
|---------------|---------|--------------------------------------------------------------|
| `href`        | ano     | Cíl odkazu – `/<slug>/` nebo celá externí URL                  |
| `title`       | ano     | Název modlitby, zároveň text odkazu                            |
| `icon`        | ne      | Název partialu s ikonou, např. `icon-flame`                    |
| `badge`       | ne      | Štítek („Pobožnost“, „Novéna“, …)                              |
| `description` | ne      | Krátký popis pod nadpisem                                      |
| `favorite`    | ne      | `true` zobrazí zaškrtávátko oblíbených                         |

Ikony jsou samostatné partialy `src/partials/icon-*.html` s inline SVG
(`stroke="currentColor"`), takže se barví z CSS a nestojí request navíc.
Nová ikona = nový soubor `icon-<název>.html`, žádná další registrace.

Zaškrtnutí srdíčka přepne reflektovaný atribut `favorite` (stylovatelný přes
`prayer-card[favorite]`) a vyšle bublající událost `prayer-card:favorite`
s `detail: { favorite }`. Perzistenci ani panely *Naposledy navštívené* /
*Oblíbené* komponenta neřeší – ty patří do `home.ts`.
