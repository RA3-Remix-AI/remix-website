import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

function createClock() {
  let next = 0;
  let now = 0;
  const timers = new Map();
  const frames = new Map();
  return {
    timers, frames,
    setTimeout(fn, delay) { const id = ++next; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    requestAnimationFrame(fn) { const id = ++next; frames.set(id, fn); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    paint() { const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn(now)); },
    advance(delay) {
      const until = now + delay;
      for (;;) {
        const due = [...timers].filter(([, timer]) => timer.at <= until).sort((a, b) => a[1].at - b[1].at)[0];
        if (!due) break;
        const [id, timer] = due; now = timer.at; timers.delete(id); timer.fn();
      }
      now = until;
    },
  };
}

class Video extends EventTarget {
  src = "";
  currentSrc = "";
  readyState = 0;
  paused = true;
  seeking = false;
  muted = false;
  preload = "none";
  error = null;
  style = {};
  loads = 0;
  plays = 0;
  frames = new Map();
  nextFrame = 0;
  playFailure;
  load() { this.loads++; this.readyState = 0; this.currentSrc = ""; this.error = null; }
  play() {
    this.plays++;
    if (this.playFailure) return Promise.reject(this.playFailure);
    this.paused = false;
    this.dispatchEvent(new Event("playing"));
    return Promise.resolve();
  }
  pause() { this.paused = true; }
  removeAttribute(name) { if (name === "src") this.src = ""; }
  requestVideoFrameCallback(fn) { const id = ++this.nextFrame; this.frames.set(id, fn); return id; }
  cancelVideoFrameCallback(id) { this.frames.delete(id); }
  decoded() { this.readyState = 2; this.currentSrc = this.src; this.dispatchEvent(new Event("loadeddata")); }
  present() { const pending = [...this.frames.values()]; this.frames.clear(); pending.forEach(fn => fn(0, {})); }
}

test("commander handoffs retain the displayed decoder until the latest target has a frame", async t => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { createCommanderPlayback } = await server.ssrLoadModule("/src/lib/commander-playback.ts");
    const make = () => {
      const clock = createClock();
      const videos = [new Video(), new Video()];
      const commits = [];
      const views = [];
      const player = createCommanderPlayback(videos, ["hammer.mp4", "bastion.mp4", "ghost.mp4"], index => commits.push(index), view => views.push(view), clock);
      const start = () => {
        player.setPolicy({ enabled: true, motionAllowed: true, playing: true });
        videos[0].decoded(); videos[0].present(); clock.advance(180);
      };
      return { clock, videos, commits, views, player, start, view: () => views.at(-1) };
    };

    await t.test("cold load keeps the old frame, source and playback, then commits video and copy together", () => {
      const h = make(); h.start();
      h.player.request(2);
      assert.deepEqual(h.commits, [0]);
      assert.equal(h.videos[0].src, "hammer.mp4");
      assert.equal(h.videos[0].paused, false);
      assert.equal(h.view().front, 0);
      assert.equal(h.view().pending, 2);
      h.videos[1].decoded();
      assert.deepEqual(h.commits, [0], "loaded data alone cannot expose an unpresented playing target");
      h.videos[1].present();
      assert.deepEqual(h.commits, [0, 2]);
      assert.equal(h.view().front, 1);
      assert.equal(h.view().outgoing, 0);
      assert.equal(h.videos[0].paused, false, "the old image stays live throughout the incoming fade");
      h.clock.advance(180);
      assert.equal(h.videos[0].paused, true);
      assert.equal(h.videos[1].paused, false);
      h.player.destroy();
    });

    await t.test("prewarmed target is reused and duplicate requests do not reload it", async () => {
      const h = make(); h.start();
      assert.equal(h.videos[1].src, "bastion.mp4");
      h.videos[1].decoded();
      const loads = h.videos[1].loads;
      h.player.request(1); h.player.request(1);
      await Promise.resolve();
      assert.equal(h.videos[1].loads, loads);
      h.videos[1].present();
      assert.equal(h.commits.at(-1), 1);
      const plays = h.videos[1].plays;
      h.player.request(1);
      assert.equal(h.videos[1].plays, plays);
      h.player.destroy();
    });

    await t.test("a stale first-frame callback cannot win after rapid clicks or a return to the displayed target", async () => {
      const h = make(); h.start();
      h.player.request(1); h.videos[1].decoded();
      const late = [...h.videos[1].frames.values()][0];
      h.player.request(2);
      late(0, {});
      assert.deepEqual(h.commits, [0]);
      assert.equal(h.videos[1].src, "ghost.mp4");
      h.player.request(0);
      h.videos[1].decoded();
      await Promise.resolve();
      h.videos[1].present();
      assert.deepEqual(h.commits, [0]);
      assert.equal(h.view().front, 0);
      assert.equal(h.view().pending, null);
      h.player.destroy();
    });

    await t.test("a third request during the first fade pins the current front opaque before reusing the outgoing slot", () => {
      const h = make(); h.start();
      h.player.request(1); h.videos[1].decoded(); h.videos[1].present();
      h.clock.advance(35);
      assert.equal(h.view().transitioning, true);
      h.player.request(2);
      assert.equal(h.view().front, 1);
      assert.equal(h.view().transitioning, false, "the renderer pins front opacity to 1 without a transition");
      assert.equal(h.view().outgoing, null);
      assert.equal(h.videos[1].style.opacity, "1", "the cover is pinned before the old decoder is reused, without awaiting a React render");
      assert.equal(h.videos[1].style.transition, "none");
      assert.equal(h.videos[1].src, "bastion.mp4");
      assert.equal(h.videos[0].src, "ghost.mp4");
      h.videos[0].decoded(); h.videos[0].present();
      assert.deepEqual(h.commits, [0, 1, 2]);
      h.player.destroy();
    });

    await t.test("paused selection presents a decoded target without starting long-running playback", () => {
      const h = make(); h.start();
      h.player.setPolicy({ enabled: true, motionAllowed: true, playing: false });
      h.player.request(1); h.videos[1].decoded();
      assert.equal(h.videos[1].plays, 0);
      assert.equal(h.commits.at(-1), 0);
      h.clock.paint(); h.clock.paint();
      assert.equal(h.commits.at(-1), 1);
      assert.equal(h.videos.every(video => video.paused), true);
      h.player.destroy();
    });

    await t.test("playing and decoded double paint completes if an invisible buffer gets no video-frame callback", () => {
      const h = make(); h.start();
      h.player.request(2); h.videos[1].decoded();
      h.clock.paint();
      assert.equal(h.commits.at(-1), 0);
      h.clock.paint();
      assert.equal(h.commits.at(-1), 2);
      assert.equal(h.videos[1].frames.size, 0);
      h.player.destroy();
    });

    await t.test("hidden policy stops preparation and playback, while reduced motion uses static selection", () => {
      const h = make(); h.start();
      h.player.request(2); h.videos[1].decoded();
      h.player.setPolicy({ enabled: false, motionAllowed: true, playing: true });
      assert.equal(h.videos.every(video => video.paused), true);
      assert.equal(h.videos[1].src, "");
      assert.equal(h.clock.frames.size, 0);
      assert.equal(h.clock.timers.size, 0);
      assert.equal(h.videos[1].frames.size, 0);
      h.player.setPolicy({ enabled: false, motionAllowed: false, playing: true });
      h.player.request(1);
      assert.equal(h.commits.at(-1), 1);
      assert.equal(h.view().visible, false);
      h.player.destroy();
    });

    await t.test("load timeout falls back even when the browser retains the previous currentSrc", () => {
      const h = make(); h.start();
      h.player.request(2);
      h.videos[1].currentSrc = "bastion.mp4";
      h.clock.advance(15000);
      assert.equal(h.commits.at(-1), 2);
      assert.equal(h.view().pending, null);
      assert.equal(h.view().visible, false);
      h.player.destroy();
    });

    await t.test("a genuine target play rejection uses its poster and retrying the same commander is possible", async () => {
      const h = make(); h.start();
      h.videos[1].playFailure = Object.assign(new Error("autoplay denied"), { name: "NotAllowedError" });
      h.player.request(2); h.videos[1].decoded();
      await Promise.resolve(); await Promise.resolve();
      assert.equal(h.commits.at(-1), 2);
      assert.equal(h.view().visible, false);
      assert.equal(h.view().pending, null);
      h.videos[1].playFailure = undefined;
      h.player.request(2);
      await Promise.resolve();
      h.videos[1].present();
      assert.equal(h.view().visible, true);
      h.player.destroy();
    });

    await t.test("destroy cancels every pending callback and stale async work cannot commit", () => {
      const h = make(); h.start();
      h.player.request(2); h.videos[1].decoded();
      const late = [...h.videos[1].frames.values()][0];
      h.player.destroy(); late(0, {});
      assert.deepEqual(h.commits, [0]);
      assert.equal(h.clock.frames.size, 0);
      assert.equal(h.clock.timers.size, 0);
      assert.equal(h.videos.every(video => video.paused && video.frames.size === 0 && video.src === ""), true);
    });
  } finally { await server.close(); }
});
