import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

function environment(elements, reduced = false) {
  const listeners = new Set();
  const motion = {
    matches: reduced,
    addEventListener: (_, listener) => listeners.add(listener),
    removeEventListener: (_, listener) => listeners.delete(listener),
  };
  let observer;
  class Observer {
    observed = new Set();
    disconnected = false;
    constructor(callback) {
      this.callback = callback;
      observer = this;
    }
    observe(element) {
      this.observed.add(element);
    }
    unobserve(element) {
      this.observed.delete(element);
    }
    disconnect() {
      this.disconnected = true;
      this.observed.clear();
    }
  }
  return {
    root: { querySelectorAll: () => elements },
    browser: {
      innerHeight: 800,
      matchMedia: () => motion,
      IntersectionObserver: Observer,
    },
    get observer() {
      return observer;
    },
    listeners,
    reduce() {
      motion.matches = true;
      for (const listener of listeners) listener();
    },
  };
}
function element(top, parentElement, excluded = false) {
  const classes = new Set();
  const animations = [];
  return {
    classes,
    animations,
    parentElement,
    getBoundingClientRect: () => ({ top }),
    closest: () => (excluded ? {} : null),
    classList: {
      add: (name) => classes.add(name),
      remove: (name) => classes.delete(name),
    },
    animate(keyframes, options) {
      const animation = {
        keyframes,
        options,
        canceled: false,
        cancel() {
          this.canceled = true;
          this.oncancel?.();
        },
      };
      animations.push(animation);
      return animation;
    },
  };
}

test("home reveal leaves initial/unsupported content untouched and cancels work on reduced motion or unmount", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  try {
    const { startHomeReveal } = await server.ssrLoadModule(
      "/src/hooks/useHomeReveal.ts",
    );
    const group = {};
    const visible = element(100, group);
    const first = element(1000, group);
    const second = element(1000, group);
    const client = element(1200, group, true);
    const setup = environment([visible, first, second, client]);
    const dispose = startHomeReveal(setup.root, setup.browser);
    assert.deepEqual([...setup.observer.observed], [first, second]);
    assert.equal(
      first.classes.size,
      0,
      "pending content is not styled as hidden",
    );
    assert.equal(first.animations.length, 0);
    const entries = [first, second].map((target) => ({
      target,
      isIntersecting: true,
    }));
    setup.observer.callback(entries);
    assert.equal(first.animations.length, 1);
    assert.ok(
      second.animations[0].options.delay > first.animations[0].options.delay,
      "siblings enter with a bounded stagger",
    );
    setup.observer.callback(entries);
    assert.equal(
      first.animations.length,
      1,
      "queued repeated intersections do not replay",
    );
    setup.reduce();
    assert.equal(setup.observer.disconnected, true);
    assert.equal(first.animations[0].canceled, true);
    assert.equal(first.classes.size, 0);
    dispose();
    assert.equal(setup.listeners.size, 0);
    assert.equal(visible.animations.length, 0);
    assert.equal(client.animations.length, 0);
    for (const reduced of [false, true]) {
      const fallback = environment([element(1000, group)], reduced);
      if (!reduced) fallback.browser.IntersectionObserver = undefined;
      startHomeReveal(fallback.root, fallback.browser)();
      assert.equal(fallback.observer, undefined);
      assert.equal(fallback.listeners.size, 0);
    }
    const teardownElement = element(1200, group);
    const teardown = environment([teardownElement]);
    const cleanup = startHomeReveal(teardown.root, teardown.browser);
    teardown.observer.callback([
      { target: teardownElement, isIntersecting: true },
    ]);
    cleanup();
    assert.equal(teardownElement.animations[0].canceled, true);
    assert.equal(teardownElement.classes.size, 0);
  } finally {
    await server.close();
  }
});
