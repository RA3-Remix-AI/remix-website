import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  prepareStories,
  filterStories,
  storyCategories,
} from "../src/lib/stories.ts";
const sources = JSON.parse(
  readFileSync(
    new URL("../docs/materials/remix-story-sources.json", import.meta.url),
    "utf8",
  ),
);

test("story archive retains every source once with known categories and original links", () => {
  const entries = prepareStories(sources.articles);
  assert.equal(entries.length, sources.articles.length);
  assert.equal(
    new Set(entries.map((entry) => entry.articleId)).size,
    entries.length,
  );
  assert.deepEqual(
    new Set(entries.map((entry) => entry.articleId)),
    new Set(sources.articles.map((entry) => entry.articleId)),
  );
  for (const entry of entries) {
    assert.ok(
      storyCategories.some((category) => category.value === entry.category),
    );
    assert.match(entry.url, /^https:\/\/www\.bilibili\.com\/read\/cv\d+$/);
    assert.equal(entry.publishedDate, entry.publishedAt.slice(0, 10));
  }
});
test("unread article content never becomes an invented summary", () => {
  const [entry] = prepareStories([
    {
      ...sources.articles[0],
      accessLevel: "metadata_only",
      summary: "Unverified inference that must not be shown",
    },
  ]);
  assert.equal(entry.bodyRead, false);
  assert.equal(entry.summary, "");
  assert.equal(filterStories([entry], "unverified inference", "all").length, 0);
});
test("archive search combines category and body metadata without losing matching sources", () => {
  const entries = prepareStories(sources.articles);
  assert.equal(
    filterStories(entries, "", "all").length,
    sources.articles.length,
  );
  for (const category of storyCategories)
    assert.equal(
      filterStories(entries, "", category.value).length,
      entries.filter((entry) => entry.category === category.value).length,
    );
  const example = entries[0];
  assert.ok(
    filterStories(
      entries,
      `  ${example.title.toLowerCase()}  `,
      example.category,
    ).some((entry) => entry.articleId === example.articleId),
  );
  assert.equal(filterStories(entries, "no_such_article_000", "all").length, 0);
});

test("every relevant inventory article is represented and non-story notices remain excluded", () => {
  const inventory = JSON.parse(
    readFileSync(
      new URL(
        "../docs/materials/remix-article-inventory.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.equal(
    new Set(inventory.articles.map((article) => article.articleId)).size,
    inventory.reportedTotal,
  );
  const relevant = inventory.articles.filter(
    (article) => article.includedInStoryExtraction,
  );
  assert.deepEqual(
    new Set(sources.articles.map((article) => article.articleId)),
    new Set(relevant.map((article) => article.articleId)),
  );
  for (const source of sources.articles) {
    assert.ok(
      storyCategories.some((category) => category.value === source.category),
    );
    if (source.accessLevel === "full_article_body_read")
      assert.ok(source.summary.trim().length > 0);
    else assert.equal(source.summary, "");
  }
});

test("browser-read completion has consistent counts and bounded provenance evidence", () => {
  const log = JSON.parse(
    readFileSync(
      new URL(
        "../docs/materials/remix-browser-reading-log.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  const browserRead = sources.articles.filter(
    (article) => article.retrievalMethod === "computer_use_browser",
  );
  assert.equal(
    sources.readTotal,
    sources.articles.filter(
      (article) => article.accessLevel === "full_article_body_read",
    ).length,
  );
  assert.equal(
    sources.metadataOnlyTotal,
    sources.articles.filter(
      (article) => article.accessLevel === "metadata_only",
    ).length,
  );
  assert.equal(sources.readTotal, sources.selectedTotal);
  assert.equal(sources.metadataOnlyTotal, 0);
  assert.deepEqual(
    new Set(log.articles.map((article) => article.articleId)),
    new Set(browserRead.map((article) => article.articleId)),
  );
  for (const article of browserRead) {
    assert.equal(article.bodyCoverage, "browser_visible_body");
    assert.match(
      article.sourceBrowserUrl,
      /^https:\/\/www\.bilibili\.com\/opus\/\d+$/,
    );
    assert.equal(article.status, "read");
    assert.equal(article.error, undefined);
    assert.equal(article.bodyTextSha256, undefined);
    assert.ok(article.evidenceExcerpt.length <= 25);
  }
});
