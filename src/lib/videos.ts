export interface VideoEpisode {
  bvid: string;
  title: string;
  url: string;
  publishedAt: string;
  durationSeconds: number;
  kind: string;
  updateNumber?: number;
}
export type VideoCategory = "all" | "update" | "trailer";

export function buildPlayerUrl(
  bvid: string,
  allowedBvids: ReadonlySet<string>,
): string {
  if (!/^BV[0-9A-Za-z]{10}$/.test(bvid) || !allowedBvids.has(bvid))
    throw new Error("Video is not in the verified index");
  const url = new URL("https://player.bilibili.com/player.html");
  url.search = new URLSearchParams({
    bvid,
    p: "1",
    autoplay: "0",
    danmaku: "0",
    poster: "1",
  }).toString();
  return url.href;
}

export function filterVideos<T extends VideoEpisode>(
  videos: readonly T[],
  query: string,
  category: VideoCategory,
): T[] {
  const normalized = query.trim().toLocaleLowerCase();
  return videos.filter(
    (video) =>
      (category === "all" || video.kind === category) &&
      `${video.title} ${video.bvid}`.toLocaleLowerCase().includes(normalized),
  );
}
export function formatDuration(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
export function publicationDate(iso: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}
