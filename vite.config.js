import handlebars from "vite-plugin-handlebars";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync, readdirSync, statSync } from "node:fs";

const rootDir = dirname(fileURLToPath(import.meta.url));
const pagesDir = resolve(rootDir, "pages");

// Dev server: `src/` leží mimo Vite `root` (`pages/`), takže id začínající na
// `/src/...` (z relativních odkazů `../src/...` ve stránkách) přesměrujeme na
// skutečný soubor. Řeší to i pre-transform crawl. Build si poradí sám.
function serveSrcOutsideRoot() {
    return {
        name: "serve-src-outside-root",
        apply: "serve",
        enforce: "pre",
        resolveId(id) {
            if (id.startsWith("/src/")) {
                return resolve(rootDir, `.${id}`);
            }
        },
    };
}

/**
 * Automaticky najde všechny HTML vstupy: kořenový rozcestník a každou
 * top-level složku v `pages/`, která obsahuje `index.html`
 * (jedna modlitba = jedna složka). Přidání nové modlitby tak nevyžaduje
 * žádnou úpravu konfigurace.
 */
function discoverHtmlEntries() {
    const IGNORED_DIRS = new Set(["public"]);
    const entries = {
        main: resolve(pagesDir, "index.html"),
    };

    for (const name of readdirSync(pagesDir)) {
        if (IGNORED_DIRS.has(name) || name.startsWith(".")) {
            continue;
        }

        const dir = resolve(pagesDir, name);
        if (!statSync(dir).isDirectory()) {
            continue;
        }

        const htmlPath = resolve(dir, "index.html");
        if (existsSync(htmlPath)) {
            entries[name] = htmlPath;
        }
    }

    return entries;
}

export default defineConfig({
    appType: "mpa",
    root: pagesDir,
    server: {
        // `src/` leží mimo Vite root, musí být v allow listu pro dev server.
        fs: { allow: [rootDir] }
    },
    plugins: [
        serveSrcOutsideRoot(),
        handlebars({ partialDirectory: resolve(rootDir, "src/partials")})
    ],
    build: {
        outDir: resolve(rootDir, "dist"),
        emptyOutDir: true,
        rollupOptions: {
            input: discoverHtmlEntries()
        }
    }
});
