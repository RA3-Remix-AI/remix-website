import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  buildPlayerUrl,
  filterVideos,
  formatDuration,
  publicationDate,
} from "../src/lib/videos.ts";
const index = JSON.parse(
  readFileSync(
    new URL("../docs/materials/remix-video-index.json", import.meta.url),
    "utf8",
  ),
);
const allowed = new Set(index.episodes.map((video) => video.bvid));

test("only verified BV identifiers produce non-autoplay official player URLs", () => {
  const url = new URL(buildPlayerUrl(index.episodes[0].bvid, allowed));
  assert.equal(url.origin, "https://player.bilibili.com");
  assert.equal(url.searchParams.get("autoplay"), "0");
  assert.equal(url.searchParams.get("p"), "1");
  for (const input of [
    "BV0000000000",
    "javascript:alert(1)",
    "BV1A4411g72d&autoplay=1",
    "",
  ])
    assert.throws(() => buildPlayerUrl(input, allowed));
});
test("combined category and title filters preserve indexed metadata", () => {
  assert.equal(filterVideos(index.episodes, "  remix ", "update").length, 67);
  assert.equal(filterVideos(index.episodes, "", "trailer").length, 1);
  assert.equal(filterVideos(index.episodes, "建筑特效", "update").length, 2);
  assert.equal(filterVideos(index.episodes, "不存在的关键词", "all").length, 0);
  assert.equal(
    filterVideos(index.episodes, index.episodes[0].bvid.toLowerCase(), "all")[0]
      .bvid,
    index.episodes[0].bvid,
  );
});
test("archive is unique and episode numbers are not used as release versions", () => {
  assert.equal(allowed.size, 68);
  assert.deepEqual(
    index.episodes
      .filter((v) => v.kind === "update")
      .map((v) => v.updateNumber),
    Array.from({ length: 67 }, (_, i) => i + 1),
  );
  assert.equal(index.coverage.videoContentReviewed, false);
  assert.equal(formatDuration(354), "5:54");
  assert.equal(publicationDate("2025-01-01T20:00:00Z"), "2025/01/02");
});
