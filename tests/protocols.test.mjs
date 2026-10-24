import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";

const snapshot = JSON.parse(readFileSync(new URL("../src/content/protocols037.json", import.meta.url), "utf8"));

test("037 snapshot covers exactly the three real 5x3 panels with original icons", () => {
  assert.equal(snapshot.protocols.length, 45);
  assert.equal(new Set(snapshot.protocols.map(item => item.id)).size, 45);
  for (const side of ["盟军", "苏联", "升阳"]) {
    const items = snapshot.protocols.filter(item => item.faction === side);
    assert.equal(items.length, 15);
    assert.equal(new Set(items.map(item => `${item.row},${item.column}`)).size, 15);
    for (const item of items) {
      assert.ok(item.row >= 1 && item.row <= 5 && item.column >= 1 && item.column <= 3);
      assert.equal(item.points, 1);
      assert.equal(item.rank, item.row);
      assert.ok(existsSync(new URL(`../public${item.image}`, import.meta.url)));
      assert.ok(item.source.panel && item.source.tech && item.description);
      assert.ok(item.dependencies.some(dep => dep.endsWith(`Generic_Rank_${item.rank}`)));
      assert.ok(!item.dependencies.some(dep => snapshot.protocols.some(peer => peer.source.tech === dep)));
      for (const power of item.powers) assert.ok(power.cooldown > 0 && Number.isFinite(power.cooldown));
    }
  }
  assert.equal(snapshot.protocols.filter(item => item.powers.length === 0).length, 5);
});

test("037 identifiers do not replace actual rank requirements or A-version rules", () => {
  const find = id => snapshot.protocols.find(item => item.id === id);
  assert.equal(find("Allied_ChronoRift_Rank3").rank, 4);
  assert.equal(find("Soviet_OrbitalRefuse_Rank3").rank, 5);
  assert.equal(find("Japan_EmperorsRage_Rank3").name, "天皇鬼王");
  assert.equal(find("Japan_EmperorsRage_Rank3").powers[0].cooldown, 360);
  assert.equal(find("Allied_SatelliteSweep").powers[0].cooldown, 120);
  assert.equal(find("Allied_Power_Money").powers.length, 0);
  assert.equal(find("ProductionBonus_Soviet").verifiedFields.find(field => field.field === "BuildCostBonus").value, -0.25);
});

test("each protocol has its own deep-linked explanation, search and version distinction", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  try {
    const { Protocols037Page } = await server.ssrLoadModule("/src/pages/Protocols037Page.tsx");
    const { protocols, protocolKind, filterProtocols } = await server.ssrLoadModule("/src/content/protocols.ts");
    for (const protocol of protocols) {
      assert.ok(protocol.usage && protocol.caution && protocol.remixA);
      assert.ok(protocol.active || protocol.upgrade);
      assert.equal(Boolean(protocol.active), protocol.powers.length > 0);
      const params = new URLSearchParams({ faction: protocol.faction, protocol: protocol.id });
      const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/protocols-037?${params}`] }, createElement(Protocols037Page)));
      assert.ok(html.includes(`id="protocol-name">${protocol.name}</h2>`));
      assert.ok(html.includes(protocol.usage));
      assert.ok(html.includes(protocol.remixA));
      assert.ok(html.includes(protocolKind(protocol)));
      assert.ok(!html.includes("undefined"));
    }
    assert.deepEqual(filterProtocols("升阳", "天皇").map(item => item.id), ["Japan_EmperorsRage_Rank3"]);
    assert.equal(filterProtocols("盟军", "  不存在的协议  ").length, 0);
    assert.ok(filterProtocols("盟军", "飓风").some(item => item.id === "Allied_SatelliteSweep"));
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/protocols-037?faction=盟军&q=不存在的协议"] }, createElement(Protocols037Page)));
    assert.ok(html.includes("没有匹配的协议"));
  } finally {
    await server.close();
  }
});
