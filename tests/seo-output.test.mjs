import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnv } from "vite";

// Run after `npm run build`; ordinary source tests also work on a fresh checkout.
test(
  "built static HTML exposes every canonical page, source text, safe metadata and a noindex 404",
  { skip: !existsSync("dist/sitemap.xml") },
  () => {
    const origin = new URL(
      loadEnv("production", process.cwd(), "VITE_SITE_URL").VITE_SITE_URL ??
        "https://ra3-remix.com",
    ).origin;
    const sources = JSON.parse(
      readFileSync("docs/materials/remix-story-sources.json", "utf8"),
    );
    const paths = [
      "/",
      "/gameplay",
      "/remix-037",
      "/protocols-037",
      "/stories",
      "/stories/world",
      ...JSON.parse(readFileSync("src/content/fiction-index.json", "utf8")).map(story => `/stories/fiction/${story.id}`),
      "/devlogs",
      "/downloads",
      "/videos",
      "/roadmap",
      "/copyright",
    ];
    const sitemap = readFileSync("dist/sitemap.xml", "utf8");
    assert.equal((sitemap.match(/<loc>/g) ?? []).length, paths.length);
    assert.doesNotMatch(sitemap, /<lastmod>/);
    for (const [, loc] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g))
      assert.doesNotMatch(loc, /#|\?|\/404/);
    for (const path of paths) {
      const html = readFileSync(
        resolve("dist", path.slice(1), "index.html"),
        "utf8",
      );
      const canonical = `${origin}${path === "/" ? "/" : path + "/"}`;
      assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
      assert.ok(html.includes(`rel="canonical" href="${canonical}"`), path);
      assert.ok(
        html.includes(
          `data-prerendered-path="${path === "/" ? "/" : path + "/"}"`,
        ),
      );
      assert.equal((html.match(/<title\b/g) ?? []).length, 1);
      assert.equal((html.match(/name="description"/g) ?? []).length, 1);
      assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
      assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1);
      assert.match(html, /name="robots" content="index, follow"/);
      assert.doesNotMatch(html, /href="\/#\/|MINIMAX_API_KEY|<!--seo-head-->/);
      const json = JSON.parse(
        /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/s.exec(
          html,
        )[1],
      );
      assert.equal(json["@graph"][1].url, canonical);
      if (path === "/stories/world") {
        assert.match(html, /叙事扩写提案/);
        assert.doesNotMatch(html, /站内整理摘要|REMIX \/ STORY ARCHIVE/);
      }
    }
    for (const article of sources.articles) {
      assert.equal(existsSync(`dist/stories/${article.articleId}/index.html`), false);
      assert.ok(!sitemap.includes(`/stories/${article.articleId}/`));
    }
    assert.equal(existsSync("dist/materials/stories"), false);
    for (const meta of JSON.parse(readFileSync("src/content/fiction-index.json", "utf8"))) {
      const story = JSON.parse(readFileSync(`src/content/fiction/${meta.id}.json`, "utf8"));
      const html = readFileSync(`dist/stories/fiction/${meta.id}/index.html`, "utf8");
      assert.ok(html.includes(story.sections[0].paragraphs[0].slice(0,30)));
      assert.ok(html.includes(story.sections.at(-1).paragraphs.at(-1).slice(0,30)));
      assert.ok(!html.includes("正在翻开故事"));
    }
    const notFound = readFileSync("dist/404.html", "utf8");
    assert.match(notFound, /name="robots" content="noindex, follow"/);
    assert.match(notFound, /页面未找到/);
    assert.match(
      readFileSync("dist/robots.txt", "utf8"),
      new RegExp(
        `Sitemap: ${origin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/sitemap.xml`,
      ),
    );
  },
);
