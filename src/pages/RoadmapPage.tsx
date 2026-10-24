import { PageIntro } from "../components/PageIntro";
import { roadmap, site } from "../content/site";

export function RoadmapPage() {
  return (
    <>
      <PageIntro index="06 / ROADMAP" title="AI 开发规划">
        <p>
          以 Remix 037
          为基础，探索快速模型在人机对抗、战役体验与兵种选择中的作用。
        </p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell">
          <div className="planning-banner">
            <span className="status">全部为拟议阶段</span>
            <p>
              以下是可讨论的推进顺序，不代表已完成能力或发布日期。实际 AI
              接入将在相关项目中推进。
            </p>
          </div>
          <div className="roadmap-list">
            {roadmap.map((item) => (
              <article key={item.number}>
                <span className="roadmap-number">{item.number}</span>
                <div>
                  <p className="eyebrow">PROPOSED / 待验证</p>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <p className="roadmap-outcome">{item.outcome}</p>
                </div>
              </article>
            ))}
          </div>
          <a
            className="text-link"
            href={site.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            访问项目 GitHub 组织 ↗
            <span className="sr-only">（新窗口打开）</span>
          </a>
        </div>
      </section>
    </>
  );
}
