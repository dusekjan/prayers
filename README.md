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
│   ├── partials/             # sdílené Handlebars části (header, footer)
│   ├── scripts/              # app.ts (hlavní/sdílená logika), <slug>.ts a ostatní
│   └── styles/               # base.css (hlavní/sdílené styly), <slug>.css a ostatní
├── generate-sitemap.js       # generuje dist/sitemap.xml
└── vite.config.js            # automatická detekce HTML vstupů
```

> `src/` leží **mimo** Vite root (`pages/`), proto se na něj z HTML odkazuje
> **relativně** (`../src/...` z rozcestníku, `../../src/...` ze stránky modlitby),
> nikoli absolutně.

**Externí** (cizí doména): stačí přidat záznam `{ type: "external", url: "https://...", title: "…" }`.

**Interní** (na `modlitbyonline.cz`):

1. Vytvoř složku `pages/<slug>/index.html` s obsahem stránky a příslušnými meta tagy.
2. Vytvoř `pages/public/<slug>/manifest.json`.
3. Vytvoř `src/styles/<slug>.css` (s `@import "./base.css";`) a `src/scripts/<slug>.ts` (s importem z `./app`) a nalinkuj je v hlavičce nové stránky **relativně** (`../../src/...`).
4. Zaregistruj v `app.ts`: `{ type: "internal", url: "<slug>", title: "…" }`.

**Důležité:** `vite.config.js` i `generate-sitemap.js` do `app.ts` vůbec
nekoukají – novou stránku poznají jen podle složky s `index.html`. Proto musí
`url` (aka slug) interní modlitby přesně odpovídat názvu složky, jinak build i sitemap
proběhnou v pořádku, ale odkaz na rozcestníku povede jinam.
