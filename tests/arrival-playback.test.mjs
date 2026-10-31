import test from "node:test";
import assert from "node:assert/strict";
import { createArrivalPlayback } from "../src/lib/arrival-playback.ts";

function mockMedia() {
  let src;
  const events = [];
  const attempts = [];
  return {
    events, attempts,
    get src() { return src; },
    set src(value) { src = value; events.push(["src", value]); },
    play() {
      events.push(["play"]);
      return new Promise((resolve, reject) => attempts.push({ resolve, reject }));
    },
    pause() { events.push(["pause"]); },
    load() { events.push(["load"]); },
    removeAttribute(name) { if (name === "src") src = undefined; events.push(["remove", name]); },
  };
}

test("arrival never attaches a source until clicked; pause/resume keeps one rendition and one resource", () => {
  for (const source of ["/desktop.mp4", "/mobile.mp4"]) {
    const media = mockMedia();
    const states = [];
    const controller = createArrivalPlayback(media, source, state => states.push(state));
    assert.equal(media.src, undefined, "even a ready normal-network player is poster-only");
    assert.deepEqual(media.events, []);
    controller.pause(); // Hidden/reduced-motion notifications before the first click.
    assert.equal(media.src, undefined, "preference changes cannot start a download");
    controller.toggle();
    assert.equal(media.src, source);
    assert.equal(states.at(-1).requested, true);
    controller.pause(); // Tab hiding pauses, does not detach/reload the source.
    assert.equal(states.at(-1).requested, false);
    assert.equal(media.src, source);
    controller.toggle(); // The next explicit click resumes, including save-data users.
    assert.equal(states.at(-1).requested, true);
    controller.toggle(); // User pause.
    controller.toggle();
    assert.equal(media.events.filter(([name]) => name === "src").length, 1);
    assert.equal(media.events.filter(([name]) => name === "load").length, 0);
    controller.destroy();
    assert.equal(media.src, undefined);
    assert.deepEqual(media.events.slice(-3), [["pause"], ["remove", "src"], ["load"]]);
    const count = media.events.length;
    controller.toggle();
    controller.destroy();
    assert.equal(media.events.length, count, "closed dialog cannot restart");
  }
});

test("play rejection and media error require explicit retry; stale attempts cannot change current intent", async () => {
  const media = mockMedia();
  const states = [];
  const controller = createArrivalPlayback(media, "/mobile.mp4", state => states.push(state));
  controller.toggle();
  controller.pause();
  controller.toggle();
  media.attempts[0].reject(new Error("aborted old request"));
  await Promise.resolve();
  assert.equal(states.at(-1).requested, true);
  media.attempts[1].reject(new Error("blocked"));
  await Promise.resolve();
  assert.deepEqual(states.at(-1), { requested: false, failure: "play" });
  assert.equal(media.attempts.length, 2, "no automatic retry");
  controller.toggle();
  assert.equal(media.events.filter(([name]) => name === "load").length, 0, "play rejection does not re-download");
  controller.fail();
  assert.deepEqual(states.at(-1), { requested: false, failure: "media" });
  controller.toggle();
  assert.equal(media.events.filter(([name]) => name === "src").length, 1);
  assert.equal(media.events.filter(([name]) => name === "load").length, 1, "only explicit media-error retry reloads");
  controller.destroy();
  const count = states.length;
  media.attempts.at(-1).reject(new Error("closed"));
  await Promise.resolve();
  assert.equal(states.length, count);
});
