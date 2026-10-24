import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { prepareStories } from "../src/lib/stories.ts";
import {
  findStory,
  storyBlocks,
  storyNeighbours,
  validStoryImage,
} from "../src/lib/story-reader.ts";
const source = JSON.parse(
  readFileSync(
    new URL("../docs/materials/remix-story-sources.json", import.meta.url),
    "utf8",
  ),
);
const stories = prepareStories(source.articles);

test("strict article lookup and category boundaries prevent wrong detail pages", () => {
  assert.equal(findStory(stories, String(stories[0].articleId)), stories[0]);
  for (const id of [
    undefined,
    "",
    `0${stories[0].articleId}`,
    `${stories[0].articleId}x`,
    "1e7",
    "-10",
  ])
    assert.equal(findStory(stories, id), undefined);
  for (const category of new Set(stories.map((s) => s.category))) {
    const peers = stories.filter((s) => s.category === category);
    assert.equal(storyNeighbours(stories, peers[0]).previous, undefined);
    assert.equal(storyNeighbours(stories, peers.at(-1)).next, undefined);
  }
});
test("reading blocks contain only verified short summaries and curated local images", () => {
  const read = stories.find((s) => s.bodyRead);
  const unread = { ...read, bodyRead: false, summary: "" };
  const image = {
    src: "/materials/stories/example.jpg",
    alt: "参考配图",
    caption: "来源配图",
    sourceUrl: read.url,
  };
  assert.ok(validStoryImage(image));
  assert.deepEqual(storyBlocks(unread, [image]), []);
  const blocks = storyBlocks(read, [
    image,
    { ...image, src: "https://untrusted.example/file.jpg" },
  ]);
  assert.deepEqual(
    blocks.filter((b) => b.type === "paragraph").map((b) => b.text),
    read.summary.split(/\n\s*\n/),
  );
  assert.equal(blocks.filter((b) => b.type === "image").length, 1);
  for (const src of [
    "javascript:alert(1)",
    "/materials/stories/../secret.png",
    "data:image/png,a",
    "/materials/stories/file.svg",
  ])
    assert.equal(validStoryImage({ ...image, src }), false);
  assert.equal(
    validStoryImage({ ...image, sourceUrl: "javascript:alert(1)" }),
    false,
  );
});
test("every curated image belongs to an indexed article and exists on disk", () => {
  const media = JSON.parse(
    readFileSync(
      new URL("../src/content/story-media.json", import.meta.url),
      "utf8",
    ),
  );
  for (const [articleId, images] of Object.entries(media)) {
    assert.ok(findStory(stories, articleId));
    for (const image of images) {
      assert.ok(validStoryImage(image));
      assert.ok(existsSync(new URL(`../public${image.src}`, import.meta.url)));
    }
  }
});
