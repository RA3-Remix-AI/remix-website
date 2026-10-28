import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const work = join(tmpdir(), "remix-home-images");
mkdirSync(work, { recursive: true });
const definitions = [
  ...["soviet", "allied", "empire"].map(name => ({ source: `public/materials/factions/${name}.png`, width: 256, quality: 88, name })),
  ...[768, 1280, 1920].map(width => ({ source: "public/materials/showcase/battlefield.jpg", width, quality: 84, name: `battlefield-${width}` })),
];
const images = definitions.map(item => {
  const temporary = join(work, `${item.name}.webp`);
  const args = ["-quiet", "-q", String(item.quality), "-alpha_q", "100", "-resize", String(item.width), "0", join(root, item.source), "-o", temporary];
  execFileSync("cwebp", args);
  const hash = createHash("sha256").update(readFileSync(temporary)).digest("hex").slice(0, 10);
  const destination = item.source.replace(/[^/]+$/, `${item.name}-${hash}.webp`);
  copyFileSync(temporary, join(root, destination));
  return { ...item, destination, sourceBytes: statSync(join(root, item.source)).size, bytes: statSync(temporary).size, command: ["cwebp", ...args.map(arg => arg === temporary ? destination : arg === join(root, item.source) ? item.source : arg)] };
});
writeFileSync(join(root, "docs/materials/home-image-optimization.json"), JSON.stringify({ description: "Resize and WebP encode existing artwork only; original sources retained. No redraw or content changes.", images }, null, 2) + "\n");
console.log(images.map(image => `${image.destination}: ${image.bytes} bytes`).join("\n"));
