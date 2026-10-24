import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("SEO resolver keeps real pages canonical and safely serializes titles and JSON-LD", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const {
      resolveSeo,
      publicPaths,
      renderSeoHead,
      validateSiteUrl,
      safeJson,
    } = await server.ssrLoadModule("/src/seo/metadata.ts");
    assert.equal(publicPaths.length, 50);
    assert.equal(new Set(publicPaths).size, 50);
    const titles = new Set();
    for (const path of publicPaths) {
      const seo = resolveSeo(path + "?q=ignored#section");
      assert.equal(seo.noindex, false);
      assert.equal(
        seo.canonical,
        `https://ra3-remix.com${path === "/" ? "/" : path + "/"}`,
      );
      titles.add(seo.title);
      assert.ok(seo.description.length > 30);
      assert.deepEqual(
        seo.structuredData["@graph"].map((item) => item["@type"]),
        ["WebSite", "WebPage", "BreadcrumbList"],
      );
      const head = renderSeoHead(seo);
      assert.equal((head.match(/<title\b/g) ?? []).length, 1);
      assert.equal((head.match(/rel="canonical"/g) ?? []).length, 1);
    }
    assert.equal(titles.size, 50);
    for (const path of [
      "/missing",
      "/404",
      "/stories/nope",
      "/stories/01",
      "/stories/9999999999999999999999999",
    ])
      assert.equal(resolveSeo(path).noindex, true);
    assert.equal(
      resolveSeo("/stories/", "https://example.com/").canonical,
      "https://example.com/stories/",
    );
    for (const value of [
      "ftp://example.com",
      "https://user:pass@example.com",
      "https://example.com/blog",
      "https://example.com/?a=1",
      "https://example.com/#x",
      "//evil.com",
      " https://example.com",
      "javascript:alert(1)",
      "",
    ])
      assert.throws(() => validateSiteUrl(value));
    assert.equal(
      validateSiteUrl("http://localhost:4173/"),
      "http://localhost:4173",
    );
    const attack = '</script><script>alert("x")</script>&\u2028';
    assert.equal(JSON.parse(safeJson({ attack })).attack, attack);
    const head = renderSeoHead({
      ...resolveSeo("/"),
      title: attack,
      description: '" onload="alert(1)',
      structuredData: { attack },
    });
    assert.doesNotMatch(head, /<script>alert|content="" onload/);
    assert.match(head, /&lt;\/script&gt;/);
    assert.match(head, /\\u003c/);
  } finally {
    await server.close();
  }
});

test("legacy hash routes preserve queries without open redirects and only matching snapshots hydrate", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { legacyHashTarget, canHydrate, subscribeLegacyHashRoutes } =
      await server.ssrLoadModule("/src/seo/navigation.ts");
    assert.equal(
      legacyHashTarget(
        "#/stories/13394005?q=%E8%A5%BF%E5%BE%B7&category=narrative",
      ),
      "/stories/13394005?q=%E8%A5%BF%E5%BE%B7&category=narrative",
    );
    assert.equal(
      legacyHashTarget("#/protocols-037?faction=allied"),
      "/protocols-037?faction=allied",
    );
    assert.equal(legacyHashTarget("#/"), "/");
    for (const hash of [
      "#main",
      "#//evil.test",
      "#/\\evil.test",
      "#/%2fevil.test",
      "#/%5cevil.test",
      "#/%0aevil.test",
      "#/%ZZ",
      "#https://evil.test",
    ])
      assert.equal(legacyHashTarget(hash), undefined);
    assert.equal(canHydrate("/stories/", "/stories/", "", false), true);
    assert.equal(canHydrate("/stories/", "/stories/", "?q=all", false), false);
    assert.equal(canHydrate("/", "/stories/", "", true), false);
    assert.equal(canHydrate("/", "/missing", "", false), false);
    assert.equal(canHydrate(undefined, "/", "", false), false);
    const events = new EventTarget();
    const location = { hash: "" };
    const navigations = [];
    const unsubscribe = subscribeLegacyHashRoutes(
      {
        location,
        addEventListener: events.addEventListener.bind(events),
        removeEventListener: events.removeEventListener.bind(events),
      },
      (target) => navigations.push(target),
    );
    location.hash = "#/protocols-037?faction=allied";
    events.dispatchEvent(new Event("hashchange"));
    assert.deepEqual(navigations, ["/protocols-037?faction=allied"]);
    location.hash = "#//evil.example";
    events.dispatchEvent(new Event("hashchange"));
    assert.equal(navigations.length, 1);
    unsubscribe();
    location.hash = "#/stories";
    events.dispatchEvent(new Event("hashchange"));
    assert.equal(navigations.length, 1, "unmounted bridge must stop listening");
  } finally {
    await server.close();
  }
});
