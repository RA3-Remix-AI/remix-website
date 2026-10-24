import { PageIntro } from "../components/PageIntro";
import { commandDecisionCycle, roadmap, site } from "../content/site";

export function RoadmapPage() {
  return (
    <>
      <PageIntro index="06 / ROADMAP" title="三极战线 · Agent 研发规划">
        <p>
          Remix-Ai 基于 Remix 037 已实装的单位与协议，进行平衡调整和少量修改。
          三极战线优先探索快速模型参与战场判断与部队调度，形成多种风格的 Agent 指挥官。
        </p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell">
          <div className="planning-banner">
            <span className="status">初期研发 · 后续能力为拟议阶段</span>
            <p>
              指挥闭环与游戏接入仍待验证。多 Agent、并肩作战和对抗前沿通用模型是未来探索，不代表已实装对战能力或发布日期。
            </p>
          </div>
          <section className="roadmap-command-cycle" aria-labelledby="command-cycle-title">
            <p className="eyebrow">AI COMMANDER / 拟议设计</p>
            <h2 id="command-cycle-title">从可见战况，到下一步行动。</h2>
            <p>快速模型拟参与局势判断与战术决策，依据游戏可见信息评估战况。研发目标是以判断与调度形成挑战，不依赖经济作弊或笨拙的固定脚本；以下流程仍待接入与验证。</p>
            <ol className="command-decision-cycle" aria-label="拟验证的 AI 指挥流程">
              {commandDecisionCycle.map((step, index) => <li key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}
            </ol>
            <p className="campaign-ai-capability-focus">反馈回到感知与判断，重新评估资源、攻防与进退时机。</p>
          </section>
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
