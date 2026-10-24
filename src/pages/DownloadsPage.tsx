import { PageIntro } from "../components/PageIntro";
import { downloads } from "../content/site";

const releaseLabels = {
  base: "BASE VERSION / 开发基线",
  historical: "ARCHIVE / 历史版本",
  development: "PROJECT / 后续开发版本",
} as const;

export function DownloadsPage() {
  return (
    <>
      <PageIntro index="04 / DOWNLOADS" title="版本下载">
        <p>
          按版本维护下载入口。当前开发基线为 Remix 037，实际地址将由项目方补充。
        </p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell download-list">
          {downloads.map((release) => (
            <article className="download-entry" key={release.id}>
              <div>
                <p className="eyebrow">{releaseLabels[release.kind]}</p>
                <h2>{release.title}</h2>
                <p>{release.description}</p>
              </div>
              <div>
                {release.status === "available" && release.url ? (
                  <a
                    className="button"
                    href={release.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    前往下载 ↗<span className="sr-only">（新窗口打开）</span>
                  </a>
                ) : (
                  <span className="download-pending">
                    {release.status === "planned"
                      ? "尚未发布"
                      : "下载地址待提供"}
                  </span>
                )}
              </div>
            </article>
          ))}
          <p className="content-note">
            安装方法、文件校验信息与所需游戏环境将随下载物料一并更新。视频集数不作为版本号使用。
          </p>
        </div>
      </section>
    </>
  );
}
