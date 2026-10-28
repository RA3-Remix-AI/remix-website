import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

test("commander media delivery fetches once, releases cancelled work and stays bounded", async t => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { createCommanderMediaCache, conserveCommanderData } = await server.ssrLoadModule("/src/lib/commander-media.ts");
    await t.test("visiting clips lazily reuses successful blobs and revokes all URLs at disposal", async () => {
      const requests = []; const revoked = [];
      const cache = createCommanderMediaCache(["one", "two", "three"], async source => { requests.push(source); return { ok: true, blob: async () => new Blob([source]) }; }, { createObjectURL: blob => `blob:${blob.size}`, revokeObjectURL: url => revoked.push(url) });
      assert.deepEqual(requests, []);
      const first = cache.acquire("one");
      const duplicate = cache.acquire("one");
      assert.equal(await first.promise, await duplicate.promise);
      first.cancel(); duplicate.cancel(); await Promise.resolve();
      const again = cache.acquire("one"); await again.promise; again.cancel();
      assert.deepEqual(requests, ["one"]);
      const second = cache.acquire("two"); await second.promise; second.cancel();
      assert.deepEqual(requests, ["one", "two"], "third clip is not downloaded early");
      cache.dispose(); assert.equal(revoked.length, 2);
      assert.throws(() => cache.acquire("one"));
    });
    await t.test("a pending warm clip can transfer to a request without a duplicate fetch", async () => {
      let finish; let requests = 0; let signal;
      const cache = createCommanderMediaCache(["one"], async (_, options) => {
        requests++; signal = options.signal;
        return new Promise(resolve => { finish = resolve; });
      }, { createObjectURL: () => "blob:one", revokeObjectURL() {} });
      const warm = cache.acquire("one"); warm.cancel();
      const current = cache.acquire("one"); await Promise.resolve();
      assert.equal(signal.aborted, false);
      finish({ ok: true, blob: async () => new Blob(["one"]) });
      assert.equal(await current.promise, "blob:one");
      assert.equal(requests, 1); current.cancel(); cache.dispose();
    });
    await t.test("cancelled fetch aborts, failures can retry and oversized clips are rejected", async () => {
      let signal;
      const cache = createCommanderMediaCache(["one"], async (_, options) => {
        signal = options.signal;
        return new Promise((_, reject) => signal.addEventListener("abort", () => reject(new DOMException("Cancelled", "AbortError"))));
      });
      const pending = cache.acquire("one"); const failed = assert.rejects(pending.promise, { name: "AbortError" });
      pending.cancel(); await failed; assert.equal(signal.aborted, true); cache.dispose();
      let attempts = 0;
      const retry = createCommanderMediaCache(["one"], async () => { attempts++; return { ok: attempts > 1, blob: async () => ({ size: 9 * 1024 * 1024 }) }; });
      await assert.rejects(retry.acquire("one").promise, /unavailable/);
      await assert.rejects(retry.acquire("one").promise, /budget/);
      assert.equal(attempts, 2); retry.dispose();
      assert.throws(() => createCommanderMediaCache(["1", "2", "3", "4"]), /three/);
    });
    await t.test("only explicit data saver and slow networks opt out of automatic media", () => {
      for (const connection of [{ saveData: true }, { effectiveType: "2g" }, { effectiveType: "slow-2g" }]) assert.equal(conserveCommanderData(connection), true);
      assert.equal(conserveCommanderData({ effectiveType: "4g" }), false);
      assert.equal(conserveCommanderData(), false);
    });
  } finally { await server.close(); }
});
