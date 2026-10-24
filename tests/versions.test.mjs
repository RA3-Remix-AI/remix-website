import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createServer } from "vite";

const baseline = JSON.parse(readFileSync(new URL("../src/content/remix037.json", import.meta.url), "utf8"));

test("037 reference objects retain native portraits and distinct platform/core budgets", () => {
  assert.equal(baseline.units.length, 29);
  assert.equal(new Set(baseline.units.map(unit => unit.id)).size, 29);
  for (const unit of baseline.units) {
    assert.ok(unit.name && unit.summary && unit.source.object);
    assert.ok(existsSync(new URL(`../public${unit.image}`, import.meta.url)));
    assert.ok(unit.price >= 0 && unit.hp > 0);
  }
  const core = baseline.units.find(unit => unit.id === "JapanFortressShipEgg");
  const platform = baseline.units.find(unit => unit.id === "JapanFortressShip");
  assert.deepEqual([core.price, core.hp, core.time], [9000, 400, 40]);
  assert.deepEqual([platform.price, platform.hp, platform.time], [6300, 5000, 20]);
});

test("Remix-A reworks use matching 037 identities and preserve different budgets", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { units } = await server.ssrLoadModule("/src/content/units.ts");
    const { baselineFor, reworks, adoptionFor, illustratedChanges } = await server.ssrLoadModule("/src/content/versions.ts");
    const { site, downloads } = await server.ssrLoadModule("/src/content/site.ts");
    assert.equal(site.name, "Remix-A");
    assert.ok(downloads.some(release => release.title === "Remix-A" && release.status === "planned"));
    assert.equal(units.length, reworks.length);
    for (let index = 0; index < units.length; index++) {
      const original = baselineFor(index);
      assert.ok(original);
      assert.equal(original.faction, units[index].faction);
      assert.ok(existsSync(new URL(`../public/materials/remix037/models/${reworks[index].model}.png`, import.meta.url)));
    }
    assert.equal(baselineFor(0).hp, 720);
    assert.equal(units[0].hp, 600);
    assert.equal(baselineFor(6).id, "JapanFortressShipEgg");
    assert.equal(units[6].hp, 800);
    assert.equal(adoptionFor("Kodiak"), "未纳入 A 版首版");
    assert.equal(adoptionFor("JapanArcherInfantry"), "Remix-A 改造");
    for (const change of illustratedChanges) assert.ok(existsSync(new URL(`../public/materials/remix037/models/${change.image}.png`, import.meta.url)));
  } finally {
    await server.close();
  }
});
