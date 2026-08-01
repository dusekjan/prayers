import { existsSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(rootDir, "dist");

const SITE_URL = "https://modlitbyonline.cz";

const IGNORED_DIRS = new Set([
  "node_modules",
  "dist",
  "src",
  "public",
]);

/**
 * Projde top-level složky a vrátí cesty stránek (rozcestník + interní modlitby).
 * Externí modlitby se do sitemap nezahrnují – patří na své domény.
 */
function discoverRoutes() {
  const routes = ["/"];

  for (const name of readdirSync(rootDir)) {
    if (IGNORED_DIRS.has(name) || name.startsWith(".")) {
      continue;
    }

    const dir = resolve(rootDir, name);
    if (!statSync(dir).isDirectory()) {
      continue;
    }

    if (existsSync(resolve(dir, "index.html"))) {
      routes.push(`/${name}/`);
    }
  }

  return routes;
}

function buildSitemap(routes, lastmod) {
  const body = routes
    .map(
      (route) =>
        `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

if (!existsSync(distDir)) {
  throw new Error("Složka dist/ neexistuje – spusť nejdřív `vite build`.");
}

const routes = discoverRoutes();
const lastmod = new Date().toISOString().slice(0, 10);
const sitemap = buildSitemap(routes, lastmod);

writeFileSync(resolve(distDir, "sitemap.xml"), sitemap, "utf8");
console.log(`sitemap.xml vygenerován (${routes.length} URL) → dist/sitemap.xml`);
