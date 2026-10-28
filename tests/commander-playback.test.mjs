import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("commander video ignores interrupted and obsolete playback but falls back on current playback failure", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { syncCommanderPlayback } = await server.ssrLoadModule("/src/components/CommanderShowcase.tsx");
    let failures = 0;
    const video = () => {
      let rejectPlay;
      const element = {
        muted: false,
        pauses: 0,
        plays: 0,
        play() { this.plays++; return new Promise((_, reject) => { rejectPlay = reject; }); },
        pause() { this.pauses++; },
      };
      return { element, reject: error => rejectPlay(error) };
    };
    const obsolete = video();
    const cancel = syncCommanderPlayback(obsolete.element, true, () => failures++);
    assert.equal(obsolete.element.muted, true);
    cancel();
    obsolete.reject(new Error("old slide playback failed after switching commander"));
    await Promise.resolve();
    assert.equal(failures, 0, "a stale playback promise must not remove the next commander's video");
    assert.equal(obsolete.element.pauses, 1, "slide/layout cleanup pauses the old media element");

    const interrupted = video();
    const stopInterrupted = syncCommanderPlayback(interrupted.element, true, () => failures++);
    interrupted.reject(Object.assign(new Error("play was interrupted by pause"), { name: "AbortError" }));
    await Promise.resolve();
    assert.equal(failures, 0, "browser-generated play/pause interruptions are recoverable");
    stopInterrupted();

    const rejected = video();
    const stopRejected = syncCommanderPlayback(rejected.element, true, () => failures++);
    rejected.reject(Object.assign(new Error("autoplay is unavailable"), { name: "NotAllowedError" }));
    await Promise.resolve();
    assert.equal(failures, 1, "an active failed attempt must switch back to its poster");
    stopRejected();

    const suspended = video();
    const stopSuspended = syncCommanderPlayback(suspended.element, false, () => failures++);
    assert.equal(suspended.element.plays, 0);
    assert.equal(suspended.element.pauses, 1, "suspended, hidden or offscreen media does not keep playing");
    stopSuspended();
  } finally { await server.close(); }
});
