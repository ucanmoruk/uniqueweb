// Generates sitemap.xml from the built HTML files and writes robots.txt.
// Run after the page generators so every test detail page is included.

import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_ORIGIN } from "./lib/site-schema.mjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Legacy English duplicates of the Turkish directory pages — kept on disk but
// excluded from the sitemap (their canonical points at the Turkish version).
const EXCLUDE = new Set([
  "about.html",
  "contact.html",
  "europe.html",
  "services.html",
  "reports.html"
]);

const findHtmlFiles = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
};

const toUrlPath = (relPath) => {
  if (relPath === "index.html") return "/";
  if (relPath.endsWith("/index.html")) return `/${relPath.slice(0, -"index.html".length)}`;
  return `/${relPath}`;
};

const files = await findHtmlFiles(rootDir);
const entries = [];

for (const file of files) {
  const rel = path.relative(rootDir, file);
  if (EXCLUDE.has(rel)) continue;
  const { mtime } = await stat(file);
  entries.push({
    loc: `${SITE_ORIGIN}${toUrlPath(rel)}`,
    lastmod: mtime.toISOString().slice(0, 10)
  });
}

entries.sort((a, b) => a.loc.localeCompare(b.loc));

const urlset = entries
  .map(
    (entry) =>
      `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlset}\n</urlset>\n`;
await writeFile(path.join(rootDir, "sitemap.xml"), sitemap, "utf8");

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`;
await writeFile(path.join(rootDir, "robots.txt"), robots, "utf8");

console.log(`Wrote sitemap.xml with ${entries.length} URLs and robots.txt.`);
