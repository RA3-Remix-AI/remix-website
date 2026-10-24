import { useRef, useState } from "react";
import { PageIntro } from "../components/PageIntro";
import { videos, allowedBvids, videoIndex } from "../content/videos";
import {
  buildPlayerUrl,
  filterVideos,
  formatDuration,
  publicationDate,
} from "../lib/videos";
import type { VideoCategory, VideoEpisode } from "../lib/videos";

const PAGE_SIZE = 12;
export function VideosPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<VideoCategory>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<VideoEpisode>(videos[0]!);
  const [loaded, setLoaded] = useState(false);
  const player = useRef<HTMLDivElement>(null);
  const results = filterVideos(videos, query, category);
  function chooseVideo(video: VideoEpisode) {
    setSelected(video);
    setLoaded(false);
    requestAnimationFrame(() => {
      player.current?.focus({ preventScroll: true });
      player.current?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }
  return (
    <>
      <PageIntro index="05 / VIDEO ARCHIVE" title="视频档案">
        <p>
          原作者 {videoIndex.creator.name} 的 Remix 更新合集：67 期更新介绍与 1
          支预告片。可在此选择视频并加载哔哩哔哩播放器。
        </p>
      </PageIntro>
      <section className="shell video-section">
        <div
          className="video-player"
          ref={player}
          role="region"
          tabIndex={-1}
          aria-label={`所选视频：${selected.title}`}
        >
          {loaded ? (
            <iframe
              key={selected.bvid}
              src={buildPlayerUrl(selected.bvid, allowedBvids)}
              title={`哔哩哔哩播放器：${selected.title}`}
              allow="fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="player-placeholder">
              <p className="eyebrow">BILIBILI / REMIX ARCHIVE</p>
              <h2>{selected.title}</h2>
              <p>点击后连接哔哩哔哩；视频不会自动播放。</p>
              <button className="button" onClick={() => setLoaded(true)}>
                加载播放器 <span aria-hidden="true">▷</span>
              </button>
            </div>
          )}
        </div>
        <div className="player-details">
          <div aria-live="polite">
            <h2>{selected.title}</h2>
            <p>
              {publicationDate(selected.publishedAt)} ·{" "}
              {formatDuration(selected.durationSeconds)} ·{" "}
              {videoIndex.creator.name}
            </p>
          </div>
          <a
            className="text-link"
            href={selected.url}
            target="_blank"
            rel="noreferrer"
          >
            在哔哩哔哩打开 ↗<span className="sr-only">（新窗口打开）</span>
          </a>
        </div>
        <p className="content-note">
          播放受哔哩哔哩的访问、地区和登录条件影响；加载异常时可前往原站观看。合集并非
          Remix 037 的版本清单。
        </p>
      </section>
      <section className="panel-section content-section">
        <div className="shell">
          <div className="video-controls">
            <label>
              搜索视频
              <input
                type="search"
                placeholder="标题或 BV 号"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
            </label>
            <label>
              视频类型
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value as VideoCategory);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="all">全部视频</option>
                <option value="update">更新介绍</option>
                <option value="trailer">预告片</option>
              </select>
            </label>
            <p role="status">找到 {results.length} 个视频</p>
          </div>
          <div className="video-grid">
            {results.slice(0, visibleCount).map((video) => (
              <button
                className={`video-card${selected.bvid === video.bvid ? " selected" : ""}`}
                key={video.bvid}
                aria-pressed={selected.bvid === video.bvid}
                onClick={() => chooseVideo(video)}
              >
                <span className="card-top">
                  <span>
                    {video.kind === "trailer"
                      ? "TRAILER"
                      : `UPDATE / ${String(video.updateNumber).padStart(2, "0")}`}
                  </span>
                  <span>{formatDuration(video.durationSeconds)}</span>
                </span>
                <span className="video-card-title">{video.title}</span>
                <span className="video-card-bottom">
                  {publicationDate(video.publishedAt)}
                  <span>
                    {selected.bvid === video.bvid ? "已选中" : "选择视频 ↑"}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {results.length === 0 && (
            <p className="empty-state">
              没有匹配的视频，请调整搜索内容或类型。
            </p>
          )}
          {visibleCount < results.length && (
            <button
              className="button show-more"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              显示更多（剩余 {results.length - visibleCount}） ↓
            </button>
          )}
          <p className="content-note">
            来源：原作者合集《{videoIndex.series.title}
            》。已核对目录与发布时间，尚未逐片核实游戏机制。
          </p>
        </div>
      </section>
    </>
  );
}
