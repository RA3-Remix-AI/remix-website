import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { readFileSync } from "node:fs";

test("all public pages and unknown routes render with truthful content", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { App } = await server.ssrLoadModule("/src/app/App.tsx");
    for (const [path, expected] of [
      ["/", "与原版，有何不同"],
      ["/gameplay", "发展基地"],
      ["/remix-037", "Remix 037 原有内容"],
      ["/protocols-037", "Remix 037 协议详解"],
      ["/stories", "断线年代"],
      ["/stories/world", "故事与设定"],
      ["/devlogs", "往期开发记录"],
      ["/downloads", "下载地址待提供"],
      ["/videos", "视频档案"],
      ["/roadmap", "初期研发"],
      ["/copyright", "版权与非商业声明"],
      ["/missing", "页面未找到"],
    ]) {
      const html = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: [path] },
          createElement(App),
        ),
      );
      assert.ok(html.includes(expected), `${path} should contain ${expected}`);
      if (path === "/stories/world") {
        const { storyExpansion } = await server.ssrLoadModule("/src/content/story-expansion.ts");
        assert.match(html, /2038，人的意志与机器的判断/);
        assert.ok(html.includes(storyExpansion.statusLabel));
        for (const section of storyExpansion.sections) {
          assert.ok(html.includes(`id="${section.id}"`));
          assert.ok(html.includes(`href="/stories/world#${section.id}"`));
          assert.ok(html.includes(section.title));
        }
        assert.doesNotMatch(html, /REMIX \/ STORY ARCHIVE|站内整理摘要|remix-archive|href="\/stories\/\d+/);
      }
      assert.match(html, /Remix-Ai/);
      assert.doesNotMatch(html, /<iframe/); // No third-party video loads before an explicit user action.
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    }
    const source = JSON.parse(readFileSync(new URL("../docs/materials/remix-story-sources.json", import.meta.url), "utf8"));
    const { resolveSeo } = await server.ssrLoadModule("/src/seo/metadata.ts");
    for (const id of [...source.articles.map(article => article.articleId), "nope", "01", "999999"]) {
      const path = `/stories/${id}`;
      const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, createElement(App)));
      assert.match(html, /页面未找到/);
      assert.doesNotMatch(html, /站内整理摘要|正文暂缺/);
      assert.equal(resolveSeo(path).noindex, true);
    }
    const { StoryBlocks } = await server.ssrLoadModule(
      "/src/components/StoryBlocks.tsx",
    );
    const escaped = renderToStaticMarkup(
      createElement(StoryBlocks, {
        blocks: [{ type: "paragraph", text: "<script>alert(1)</script>" }],
      }),
    );
    assert.doesNotMatch(escaped, /<script>/);
    assert.ok(escaped.includes("&lt;script&gt;"));
  } finally {
    await server.close();
  }
});
