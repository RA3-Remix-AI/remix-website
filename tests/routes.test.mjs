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
      ["/stories", "故事与设定"],
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
      if (path === "/stories") {
        const source = JSON.parse(
          readFileSync(
            new URL(
              "../docs/materials/remix-story-sources.json",
              import.meta.url,
            ),
            "utf8",
          ),
        );
        for (const article of source.articles)
          assert.ok(
            html.includes(article.url),
            `Story route must expose source ${article.articleId}`,
          );
        for (const article of source.articles)
          assert.ok(html.includes(`href="/stories/${article.articleId}"`));
      }
      assert.match(html, /Remix-Ai/);
      assert.doesNotMatch(html, /<iframe/); // No third-party video loads before an explicit user action.
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    }
    const { getStoryReader, storyTitleForPath } = await server.ssrLoadModule(
      "/src/content/story-reader.ts",
    );
    const source = JSON.parse(
      readFileSync(
        new URL("../docs/materials/remix-story-sources.json", import.meta.url),
        "utf8",
      ),
    );
    for (const article of source.articles) {
      const path = `/stories/${article.articleId}`;
      const html = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: [path] },
          createElement(App),
        ),
      );
      assert.ok(html.includes(article.url));
      assert.ok(
        html.includes(
          article.accessLevel === "full_article_body_read"
            ? "站内整理摘要"
            : "正文暂缺",
        ),
      );
      assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
      assert.equal(storyTitleForPath(path), article.title);
      const reader = getStoryReader(String(article.articleId));
      for (const peer of [reader.previous, reader.next].filter(Boolean))
        assert.equal(peer.category, article.category);
      if (article.credits.revision)
        assert.ok(html.includes(article.credits.revision));
    }
    for (const id of ["nope", "-1", "01", "9999999999999999999999", "999999"]) {
      const html = renderToStaticMarkup(
        createElement(
          MemoryRouter,
          { initialEntries: [`/stories/${id}`] },
          createElement(App),
        ),
      );
      assert.ok(html.includes("文章未找到"));
      assert.equal(storyTitleForPath(`/stories/${id}`), undefined);
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
