import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

function target() {
  const events = new Map();
  return {
    events,
    addEventListener(name, fn) {
      if (!events.has(name)) events.set(name, new Set());
      events.get(name).add(fn);
    },
    removeEventListener(name, fn) {
      events.get(name)?.delete(fn);
    },
    emit(name, event = {}) {
      for (const fn of events.get(name) ?? []) fn(event);
    },
  };
}
function style() {
  const values = new Map();
  return {
    values,
    setProperty: (key, value) => values.set(key, value),
    removeProperty: (key) => values.delete(key),
  };
}

test("immersion coalesces event frames, keeps stationary measurements and clears reduced-motion/unmount effects", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { startHomeImmersion } = await server.ssrLoadModule(
      "/src/hooks/useHomeImmersion.ts",
    );
    const frames = new Map();
    let nextFrame = 0;
    let scrollY = 0;
    const fine = { ...target(), matches: true };
    const reduced = { ...target(), matches: false };
    const doc = { ...target(), hidden: false };
    const browser = {
      ...target(),
      innerHeight: 800,
      Node: class {},
      matchMedia: (query) => (query.includes("reduce") ? reduced : fine),
      requestAnimationFrame: (fn) => {
        frames.set(++nextFrame, fn);
        return nextFrame;
      },
      cancelAnimationFrame: (id) => frames.delete(id),
    };
    const section = (top, height = 900) => ({
      getBoundingClientRect: () => ({ top: top - scrollY, left: 0, height }),
    });
    const hero = section(0);
    const field = section(3000);
    const card = {
      ...target(),
      style: style(),
      parentElement: section(2200),
      offsetLeft: 0,
      offsetTop: 0,
      offsetWidth: 300,
      offsetHeight: 400,
      closest() {
        return this;
      },
      contains: () => false,
    };
    const progress = { setAttribute() {} };
    const nodes = {
      ".command-hero": hero,
      ".campaign-battlefield": field,
      "#arrival": hero,
      "#tacticore": section(1000),
      "#commander-client": section(1800),
      "#factions": section(2200),
      "#archive": section(4000),
      "#future": section(4800),
      ".home-reading-progress": progress,
    };
    const root = {
      ...target(),
      style: style(),
      dataset: {},
      ownerDocument: doc,
      querySelector: (selector) => nodes[selector],
      querySelectorAll: () => [card],
      contains: (element) => element === card,
      getBoundingClientRect: () => ({ top: -scrollY, height: 6000 }),
    };
    const chapters = [];
    const stop = startHomeImmersion(root, browser, (id) => chapters.push(id));
    const flush = () => {
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((fn) => fn());
    };
    assert.equal(frames.size, 1);
    browser.emit("scroll");
    browser.emit("resize");
    browser.emit("scroll");
    assert.equal(frames.size, 1, "bursts share one scheduled frame");
    flush();
    assert.equal(frames.size, 0, "idle pages do not schedule another frame");
    assert.equal(root.dataset.immersion, "active");
    scrollY = 2200;
    browser.emit("scroll");
    flush();
    assert.equal(chapters.at(-1), "factions");
    root.emit("pointermove", {
      pointerType: "mouse",
      target: card,
      clientX: 300,
      clientY: 0,
    });
    flush();
    assert.equal(card.style.values.get("--immersion-rx"), "4.00deg");
    assert.equal(card.style.values.get("--immersion-ry"), "4.00deg");
    root.emit("pointerleave");
    assert.equal(card.style.values.size, 0);
    reduced.matches = true;
    reduced.emit("change");
    flush();
    assert.equal(root.dataset.immersion, undefined);
    assert.equal(root.style.values.has("--immersion-hero-y"), false);
    root.emit("pointermove", {
      pointerType: "mouse",
      target: card,
      clientX: 1,
      clientY: 1,
    });
    assert.equal(frames.size, 0);
    browser.emit("scroll");
    assert.equal(frames.size, 1);
    stop();
    assert.equal(frames.size, 0);
    assert.equal(root.style.values.size, 0);
    for (const eventTarget of [root, browser, doc, fine, reduced])
      for (const listeners of eventTarget.events.values())
        assert.equal(listeners.size, 0);
  } finally {
    await server.close();
  }
});

test("showcase visibility pauses offscreen eligibility and cleans observation with a no-IO fallback", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { observeShowcaseVisibility } = await server.ssrLoadModule(
      "/src/components/CommanderShowcase.tsx",
    );
    let observer;
    class Observer {
      constructor(callback) {
        this.callback = callback;
        observer = this;
      }
      observe(element) {
        this.element = element;
      }
      disconnect() {
        this.disconnected = true;
      }
    }
    const element = {};
    const states = [];
    const stop = observeShowcaseVisibility(element, Observer, (value) =>
      states.push(value),
    );
    observer.callback([{ target: element, isIntersecting: true }]);
    observer.callback([{ target: element, isIntersecting: false }]);
    assert.deepEqual(states, [true, false]);
    stop();
    assert.equal(observer.disconnected, true);
    observer.callback([{ target: element, isIntersecting: true }]);
    assert.deepEqual(states, [true, false]);
    observeShowcaseVisibility(element, undefined, (value) =>
      states.push(value),
    )();
    assert.equal(states.at(-1), true);
  } finally {
    await server.close();
  }
});
