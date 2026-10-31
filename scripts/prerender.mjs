import { createServer, loadEnv } from "vite";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const env = loadEnv("production", root, "VITE_SITE_URL");
const server = await createServer({
  root,
  mode: "production",
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
try {
  const { App } = await server.ssrLoadModule("/src/app/App.tsx");
  const {
    publicPaths,
    canonicalPath,
    validateSiteUrl,
    resolveSeo,
    renderSeoHead,
    escapeHtml,
  } = await server.ssrLoadModule("/src/seo/metadata.ts");
  const origin = validateSiteUrl(env.VITE_SITE_URL);
  const template = await readFile(join(dist, "index.html"), "utf8");
  if (
    !template.includes("<!--seo-head-->") ||
    !template.includes('<div id="root"></div>')
  )
    throw new Error("Missing prerender template markers");
  const { fictionIdForPath, loadFiction } = await server.ssrLoadModule("/src/lib/fiction.ts");
  for (const path of [...publicPaths, "/404"]) {
    const fictionId = fictionIdForPath(path);
    if (fictionId) await loadFiction(fictionId);
    const route = canonicalPath(path);
    const body = renderToString(
      createElement(StaticRouter, { location: route }, createElement(App)),
    );
    const html = template
      .replace("<!--seo-head-->", () => renderSeoHead(resolveSeo(path, origin)))
      .replace(
        '<div id="root"></div>',
        () =>
          `<div id="root" data-prerendered-path="${escapeHtml(route)}">${body}</div>`,
      );
    const output =
      path === "/404"
        ? join(dist, "404.html")
        : join(dist, path.slice(1), "index.html");
    await mkdir(resolve(output, ".."), { recursive: true });
    await writeFile(output, html);
  }
  const urls = publicPaths
    .map(
      (path) =>
        `<url><loc>${escapeHtml(origin + canonicalPath(path))}</loc></url>`,
    )
    .join("\n");
  await writeFile(
    join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile(
    join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
  );
  console.log(
    `Prerendered ${publicPaths.length} indexable pages and 404.html for ${origin}`,
  );
} finally {
  await server.close();
}
