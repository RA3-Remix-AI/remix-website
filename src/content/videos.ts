import index from "../../docs/materials/remix-video-index.json";
import type { VideoEpisode } from "../lib/videos";

export const videoIndex = index;
export const videos: readonly VideoEpisode[] = [...index.episodes].sort(
  (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
);
export const allowedBvids: ReadonlySet<string> = new Set(
  videos.map((video) => video.bvid),
);
export const historicalUpdates = [1, 37, 52, 53, 54, 55, 67]
  .map((number) => videos.find((video) => video.updateNumber === number)!)
  .filter(Boolean)
  .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
