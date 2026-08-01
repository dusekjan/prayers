import { defineConfig } from "vite";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

/**
 * Složky, které nikdy nejsou samostatnou stránkou modlitby.
 */
const IGNORED_DIRS = new Set([
  "node_modules",
  "dist",
  "src",
  "public",
]);

/**
 * Automaticky najde všechny HTML vstupy: kořenový rozcestník a každou
 * top-level složku, která obsahuje `index.html` (jedna modlitba = jedna složka).
 * Přidání nové modlitby tak nevyžaduje žádnou úpravu konfigurace.
 */
function discoverHtmlEntries() {
  const entries = {
    main: resolve(rootDir, "index.html"),
  };

  for (const name of readdirSync(rootDir)) {
    if (IGNORED_DIRS.has(name) || name.startsWith(".")) {
      continue;
    }

    const dir = resolve(rootDir, name);
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
  build: {
    rollupOptions: {
      input: discoverHtmlEntries(),
    },
  },
});
