import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "vite";

test("deployment copies public assets while excluding ignored media, retired story images and symlinks", async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: "custom" });
  const root = await mkdtemp(join(tmpdir(), "remix-public-test-"));
  try {
    const { copyPublicAssets, supersededIntroAssets } = await server.ssrLoadModule("/scripts/public-assets.mjs");
    execFileSync("git", ["init", "-q"], { cwd: root });
    await mkdir(join(root, "public/materials/home-tour"), { recursive: true });
    await writeFile(join(root, ".gitignore"), "/public/materials/home-tour/\n");
    await writeFile(join(root, "public/tracked.svg"), "tracked");
    await writeFile(join(root, "public/deleted.svg"), "deleted");
    execFileSync("git", ["add", ".gitignore", "public/tracked.svg", "public/deleted.svg"], { cwd: root });
    await rm(join(root, "public/deleted.svg"));
    await writeFile(join(root, "public/new.webp"), "new");
    await writeFile(join(root, "public/materials/home-tour/local.mp4"), "local-only");
    await mkdir(join(root, "public/materials/stories"), { recursive: true });
    await writeFile(join(root, "public/materials/stories/retired.jpg"), "local-evidence");
    execFileSync("git", ["add", "public/materials/stories/retired.jpg"], { cwd: root });
    await mkdir(join(root, "public/materials/intro"), { recursive: true });
    for (const retired of supersededIntroAssets) {
      await writeFile(join(root, retired), "retained-local-master");
      execFileSync("git", ["add", retired], { cwd: root });
    }
    const activeIntro = "materials/intro/agent-arrival-web-180s-v2-desktop-newhash.mp4";
    await writeFile(join(root, "public", activeIntro), "current-delivery");
    const output = join(root, "dist");
    assert.equal(await copyPublicAssets(root, output), 3);
    assert.deepEqual((await readdir(output)).sort(), ["materials", "new.webp", "tracked.svg"]);
    assert.equal(await readFile(join(output, "tracked.svg"), "utf8"), "tracked");
    assert.equal(await readFile(join(output, activeIntro), "utf8"), "current-delivery");
    assert.deepEqual(await readdir(join(output, "materials/intro")), ["agent-arrival-web-180s-v2-desktop-newhash.mp4"]);
    for (const retired of supersededIntroAssets) assert.equal(await readFile(join(root, retired), "utf8"), "retained-local-master");
    await symlink(join(root, ".gitignore"), join(root, "public/outside.txt"));
    await assert.rejects(copyPublicAssets(root, output), /Symlinked public assets/);
  } finally {
    await server.close();
    await rm(root, { recursive: true, force: true });
  }
});
