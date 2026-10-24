import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";

test("arrival gate respects deep links, session persistence and unavailable storage", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { createArrivalGate, ARRIVAL_INTRO_KEY } = await server.ssrLoadModule("/src/lib/arrival-intro.ts");
    const values = new Map();
    const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const claim = createArrivalGate();
    assert.equal(claim("/stories/123", () => { throw new Error("deep links must not touch storage"); }), false);
    assert.equal(claim("/", () => storage), true);
    assert.equal(values.get(ARRIVAL_INTRO_KEY), "seen");
    assert.equal(claim("/", () => storage), false, "remounts do not replay");
    assert.equal(createArrivalGate()("/", () => storage), false, "reloads retain the session choice");
    const blocked = createArrivalGate();
    assert.equal(blocked("/", () => { throw new Error("SecurityError"); }), true);
    assert.equal(blocked("/", () => { throw new Error("SecurityError"); }), false);
    const writeBlocked = createArrivalGate();
    assert.equal(writeBlocked("/", () => ({ getItem: () => null, setItem: () => { throw new Error("QuotaExceededError"); } })), true);
    assert.equal(writeBlocked("/", () => storage), false);
  } finally { await server.close(); }
});

test("arrival dialog exposes an immediate exit, silent inline media and copyright link", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { ArrivalIntro } = await server.ssrLoadModule("/src/components/ArrivalIntro.tsx");
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(ArrivalIntro, { onClose() {} })));
    assert.match(html, /<dialog[^>]*aria-labelledby="arrival-title"/);
    assert.match(html, /<video[^>]*muted=""[^>]*playsInline=""/);
    assert.match(html, /跳过开场/);
    assert.match(html, /进入三极战线/);
    assert.match(html, /开启声音/);
    assert.match(html, /href="\/copyright"/);
    assert.match(html, /非 EA 官方项目/);
    assert.doesNotMatch(html, /<iframe|autoPlay=|loop=/);
  } finally { await server.close(); }
});
