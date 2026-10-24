import { Link } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { historicalUpdates, videoIndex } from "../content/videos";
import { publicationDate } from "../lib/videos";

export function DevlogsPage() {
  return (
    <>
      <PageIntro index="03 / DEVELOPMENT ARCHIVE" title="往期开发记录">
        <p>
          从原作者的视频更新中回看 Remix
          的演进。这里收录的是历史视频条目，并非本项目已经完成的开发日志。
        </p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell">
          <p className="content-note first-note">
            本项目基于 Remix 037；下方“更新介绍”的数字是视频集数，不能直接对应
            Mod 版本。标题保留原作者表述，具体改动待逐片核实。
          </p>
          <div className="devlog-list">
            {historicalUpdates.map((video) => (
              <article key={video.bvid}>
                <div>
                  <time dateTime={video.publishedAt}>
                    {publicationDate(video.publishedAt)}
                  </time>
                  <p className="eyebrow">
                    原作者视频 / {videoIndex.creator.name}
                  </p>
                </div>
                <div>
                  <h2>{video.title}</h2>
                  <p>更新视频第 {video.updateNumber} 期 · 原作者历史记录</p>
                  <a
                    className="text-link"
                    href={video.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    查看视频来源 ↗
                    <span className="sr-only">（新窗口打开）</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
          <Link className="button" to="/videos">
            浏览完整视频档案 ↗
          </Link>
        </div>
      </section>
    </>
  );
}
