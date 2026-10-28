import { execFile } from "node:child_process";
import { copyFile, lstat, mkdir } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execFile);

/** Git is the source of deployment eligibility; ignored local production media stays local. */
export async function copyPublicAssets(root, output) {
  const { stdout } = await exec("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", "public/"], { cwd: root, maxBuffer: 16 * 1024 * 1024 });
  const publicRoot = resolve(root, "public");
  if ((await lstat(publicRoot)).isSymbolicLink()) throw new Error("public/ must not be a symlink");
  const outputRoot = resolve(output);
  let copied = 0;
  for (const entry of new Set(stdout.split("\0").filter(Boolean))) {
    const source = resolve(root, entry);
    const path = relative(publicRoot, source);
    if (!path || isAbsolute(path) || path === ".." || path.startsWith(`..${sep}`)) throw new Error(`Invalid public asset path: ${entry}`);
    // Check every component so a symlinked directory cannot expose files outside public/.
    let current = publicRoot;
    let missing = false;
    for (const part of path.split(sep)) {
      current = resolve(current, part);
      try {
        if ((await lstat(current)).isSymbolicLink()) throw new Error(`Symlinked public assets cannot be deployed: ${entry}`);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        missing = true;
        break;
      }
    }
    if (missing) continue; // Tracked files removed in this working tree must not be restored.
    if (!(await lstat(source)).isFile()) continue;
    const destination = resolve(outputRoot, path);
    await mkdir(dirname(destination), { recursive: true });
    await copyFile(source, destination);
    copied++;
  }
  return copied;
}

export function publicAssets() {
  let config;
  return {
    name: "deployable-public-assets",
    apply: "build",
    configResolved(resolved) { config = resolved; },
    async writeBundle() {
      const count = await copyPublicAssets(config.root, resolve(config.root, config.build.outDir));
      config.logger.info(`Copied ${count} deployable public assets (Git-ignored files excluded)`);
    },
  };
}
