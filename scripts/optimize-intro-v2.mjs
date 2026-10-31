import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Offline authoring only: requires ffmpeg/libx264 and the approved sound master.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = "production/intro-cg-v2/edit-180s-v2-sound/delivery";
const source = process.argv[2] ? resolve(process.argv[2]) : resolve(root, "../tacticore-stroy", sourceDirectory, "intro-cg-180s-v2-sound.mp4");
const local = join(root, "intro-video/out/intro-v2-cdn-2026-10-31");
mkdirSync(local, { recursive: true });
const run = (bin, args) => {
  const result = spawnSync(bin, args, { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`${bin}: ${result.error?.message || result.stderr}`);
  return result.stdout;
};
const hash = path => createHash("sha256").update(readFileSync(path)).digest("hex");
const probe = path => JSON.parse(run("ffprobe", ["-v", "error", "-show_entries", "format=duration,size,bit_rate:stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames,pix_fmt,channels,sample_rate,bit_rate", "-of", "json", path]));
const manifestPath = join(root, "docs/materials/intro-180s-v2.json");
const previous = JSON.parse(readFileSync(manifestPath, "utf8"));
if (hash(source) !== "1f9d9f233cdad9363c66f050a4c7b6b393b897661ad67c883fa6f537823842e7") throw new Error("Source is not the approved 180s v2 sound master");
const sourceInfo = probe(source);
const sampleTimesSeconds = [18, 85, 112, 156];
const sampleFrames = (path, label) => {
  for (const time of sampleTimesSeconds) run("ffmpeg", ["-v", "error", "-ss", String(time), "-i", path, "-frames:v", "1", "-y", join(local, `${label}-${time}.png`)]);
};
sampleFrames(source, "source");
const variants = [];
for (const settings of [
  { variant: "desktop", width: 1280, height: 720, videoKbps: 660, audioKbps: 96, maxrateKbps: 1200, bufsizeKbps: 2400, byteLimit: 18000000 },
  { variant: "mobile", width: 854, height: 480, videoKbps: 270, audioKbps: 80, maxrateKbps: 600, bufsizeKbps: 1200, byteLimit: 9000000 },
]) {
  console.log(`Encoding ${settings.variant} (two passes)...`);
  const temp = join(local, `${settings.variant}.mp4`);
  const passlog = join(local, `${settings.variant}-pass`);
  const videoArgs = ["-vf", `scale=${settings.width}:${settings.height}:flags=lanczos`, "-r", "30", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-b:v", `${settings.videoKbps}k`, "-maxrate", `${settings.maxrateKbps}k`, "-bufsize", `${settings.bufsizeKbps}k`, "-passlogfile", passlog];
  const input = ["-hide_banner", "-loglevel", "error", "-y", "-i", source, "-map", "0:v:0"];
  run("ffmpeg", [...input, ...videoArgs, "-pass", "1", "-an", "-f", "null", "/dev/null"]);
  run("ffmpeg", [...input, "-map", "0:a:0", ...videoArgs, "-pass", "2", "-c:a", "aac", "-b:a", `${settings.audioKbps}k`, "-ar", "48000", "-ac", "2", "-t", "180", "-movflags", "+faststart", "-map_metadata", "-1", temp]);
  run("ffmpeg", ["-v", "error", "-xerror", "-i", temp, "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
  const info = probe(temp);
  const video = info.streams.find(s => s.codec_type === "video");
  if (Number(info.format.duration) !== 180 || Number(video.nb_frames) !== 5400 || video.r_frame_rate !== "30/1") throw new Error("Duration/frame count changed");
  if (statSync(temp).size > settings.byteLimit) throw new Error("Byte budget exceeded");
  const sha256 = hash(temp);
  const filename = `agent-arrival-web-180s-v2-${settings.variant}-${sha256.slice(0, 10)}.mp4`;
  const target = join(root, "public/materials/intro", filename);
  copyFileSync(temp, target);
  const bytes = readFileSync(target);
  const faststart = bytes.indexOf(Buffer.from("moov")) < bytes.indexOf(Buffer.from("mdat"));
  if (!faststart) throw new Error("Missing faststart");
  sampleFrames(target, settings.variant);
  variants.push({ ...settings, path: `/materials/intro/${filename}`, sha256, bytes: statSync(target).size, info, fullDecode: "passed", faststart });
  console.log(`${settings.variant}: ${statSync(target).size} bytes ${filename}`);
}
// Preserve old deliveries locally, removing them from the deployable public tree.
const archived = previous.archivedVariants || previous.variants.map(v => ({ path: v.path, bytes: v.bytes, sha256: v.sha256 }));
for (const old of previous.variants) {
  if (variants.some(v => v.path === old.path)) continue;
  const oldPath = join(root, "public", old.path);
  if (existsSync(oldPath)) renameSync(oldPath, join(local, old.path.split("/").at(-1)));
}
writeFileSync(manifestPath, JSON.stringify({ date: "2026-10-31", sourceProject: "tacticore-stroy", sourceDirectory, sourceFile: "intro-cg-180s-v2-sound.mp4", sourceSha256: hash(source), sourceBytes: statSync(source).size, sourceInfo, encoder: run("ffmpeg", ["-version"]).split("\n")[0], script: "scripts/optimize-intro-v2.mjs", encoding: "libx264 slow two-pass ABR with VBV, Lanczos, yuv420p, 30fps; AAC stereo re-encoded without mixing or timing changes; faststart", archiveDirectory: "intro-video/out/intro-v2-cdn-2026-10-31", sampleTimesSeconds, sampleNote: "Compare source-{seconds}.png, desktop-{seconds}.png and mobile-{seconds}.png manually after regeneration; automated validation does not certify visual quality.", archivedVariants: archived, poster: previous.poster, variants }, null, 2) + "\n");
