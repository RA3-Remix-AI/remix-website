import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Offline authoring tool; neither ffmpeg nor the masters are required by npm run build.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const masters = join(root, "intro-video/out/home-media-masters-2026-10-28");
mkdirSync(masters, { recursive: true });
const run = (bin, args) => {
  const result = spawnSync(bin, args, { encoding: "utf8", maxBuffer: 4 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`${bin} failed: ${result.error?.message || result.stderr}`);
  return result.stdout;
};
const hash = path => createHash("sha256").update(readFileSync(path)).digest("hex");
const probe = path => JSON.parse(run("ffprobe", ["-v", "error", "-show_entries", "format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate", "-of", "json", path]));
const records = [];
for (const id of ["hammer", "bastion", "ghost", "agent-arrival"]) {
  const intro = id === "agent-arrival";
  const directory = `public/materials/${intro ? "intro" : "commanders"}`;
  const original = join(root, directory, `${id}.mp4`);
  const source = join(masters, `${id}.mp4`);
  if (!existsSync(source)) {
    if (!existsSync(original)) throw new Error(`Missing master ${source}; restore the original source before authoring.`);
    copyFileSync(original, source);
  }
  const sourceInfo = probe(source);
  const record = { id, source: `intro-video/out/home-media-masters-2026-10-28/${id}.mp4`, sourceSha256: hash(source), sourceBytes: statSync(source).size, sourceInfo, variants: [] };
  for (const variant of intro ? [{ name: "web", width: 1280, crf: 24 }] : [{ name: "desktop", width: 1280, crf: 25 }, { name: "mobile", width: 768, crf: 26 }]) {
    const temp = join(root, directory, `${id}-${variant.name}.encoding.mp4`);
    run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", source,
      "-map", "0:v:0", ...(intro ? ["-map", "0:a:0?", "-c:a", "copy"] : ["-an"]),
      "-vf", `scale=${variant.width}:-2:flags=lanczos`, "-c:v", "libx264", "-preset", "slow", "-crf", String(variant.crf),
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-map_metadata", "-1", temp]);
    run("ffmpeg", ["-v", "error", "-i", temp, "-f", "null", "-"]);
    const sha256 = hash(temp);
    const filename = `${id}-${variant.name}-${sha256.slice(0, 10)}.mp4`;
    const target = join(root, directory, filename);
    renameSync(temp, target);
    record.variants.push({ ...variant, path: `${directory}/${filename}`, sha256, bytes: statSync(target).size, info: probe(target), fullDecode: "passed" });
  }
  records.push(record);
}
const manifest = { createdAt: "2026-10-28", encoder: run("ffmpeg", ["-version"]).split("\n")[0], note: "Web delivery derivatives. Original generation provenance remains in commanders/motion-manifest.json. Sources are preserved locally under ignored intro-video/out; video durations and frame rates remain unchanged. Reconnect new hashed output paths if regenerated with a different ffmpeg version.", records };
writeFileSync(join(root, "docs/materials/home-media-optimization.json"), `${JSON.stringify(manifest, null, 2)}\n`);
for (const record of records) console.log(`${record.id}: ${record.sourceBytes} -> ${record.variants.map(v => `${v.name} ${v.bytes} bytes`).join(", ")}`);
