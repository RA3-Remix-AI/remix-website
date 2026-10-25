import { PageIntro } from "../components/PageIntro";
import { Link } from "react-router";
import { commandDecisionCycle } from "../content/site";
import { tacticoreProgress } from "../content/tacticore-progress";
import "../styles/development-progress.css";

const deliveryPhases = [
  { number: "01", status: "已完成 · 本机开发验证", title: "建立指挥核心与桌面工作台", description: "PydanticAI 成为默认模型运行层，策略合同、持续记忆与执行校验继续由弈核宿主管理。React + Tauri 2 统一桌面工程，提供备战、作战中心、指挥官工坊、电台、模型连接和演练记录六个工作区。", outcome: "本机可用：备战方案保存 / 导出、四预设与五档偏好、本地电台素材及事件演练。真实 GUI 接线尚未完成。" },
  { number: "02", status: "P0 / 下一阶段", title: "接通新桌面与真实战场", description: "先打通真实宿主的检查、启动、观察与停止回执，再接入游戏能力声明、备战配置读回、人格与偏好应用，以及局内电台的真实事件。Windows 侧同步验证新模型后端和受控对局。", outcome: "验收重点：本机草案、宿主接受和游戏实际值明确区分；每次应用与执行都有对应回执。" },
  { number: "03", status: "P1 / 体验扩展计划", title: "让配合可见，让决策可回看", description: "在真实事件与执行回执稳定后，扩展战中伴随小窗、快速配合意图、战后关键时刻，以及模型健康、请求延迟和用量。玩家能理解指挥官关注什么、为什么行动、结果如何。", outcome: "依赖：可信事件流、可追溯任务与回执、适配器支持的意图协议。当前仍为规划。" },
  { number: "04", status: "P2 / 长期探索", title: "多 Agent 并肩与对抗", description: "在单指挥官闭环通过后，探索多指挥官分工、不同模型同条件对照与观战体验。弈核保持独立产品身份，未来通过适配器研究更多 Mod 与游戏。", outcome: "前提：同场会话、各方视野、资源与执行权隔离验证；多个档案不代表多 Agent 同时实战已经可用。" },
];

export function RoadmapPage() {
  return (
    <>
      <PageIntro index="06 / ROADMAP" title="弈核 Tacticore · Agent 研发规划">
        <p>
          弈核 Tacticore 是独立的 Agent 指挥程序，代码已同步独立仓库，计划后续单独开源。
          从本机备战、指挥偏好到局内通讯，逐步验证模型的判断如何进入真实战场。Remix-Ai 是基于 Remix 037 的游戏内容适配版本。
        </p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell">
          <div className="planning-banner">
            <span className="status">初期研发 · 更新于 2026-10-25</span>
            <p>
              本机备战室、指挥官工坊与电台素材管理已实现；macOS 原生开发应用已构建并检查。下一优先级是新 GUI 接入真实宿主，以及 Windows、真实模型和游戏验证。公开发布与开源许可另行说明。
            </p>
          </div>
          <div className="development-roadmap-update"><div><p className="eyebrow">THIS WEEK / {tacticoreProgress.periodLabel}</p><h2>本周，从概念界面走到本机工作台。</h2><p>{tacticoreProgress.summary}</p></div><Link className="button" to={tacticoreProgress.reportUrl}>阅读全文周报 ↗</Link></div>
          <section className="roadmap-command-cycle" aria-labelledby="command-cycle-title">
            <p className="eyebrow">TACTICORE / 指挥闭环研发目标</p>
            <h2 id="command-cycle-title">从可见战况，到下一步行动。</h2>
            <p>已有宿主负责受视野约束的决策、持续记忆、任务与受控执行，新模型层统一管理有界请求。研发目标是通过战局判断与部队调度形成挑战；新桌面与这一真实链路的连接仍需验证。</p>
            <ol className="command-decision-cycle" aria-label="拟验证的 AI 指挥流程">
              {commandDecisionCycle.map((step, index) => <li key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}
            </ol>
            <p className="campaign-ai-capability-focus">反馈回到感知与判断，重新评估资源、攻防与进退时机。</p>
          </section>
          <div className="roadmap-list">
            {deliveryPhases.map((item) => (
              <article key={item.number}>
                <span className="roadmap-number">{item.number}</span>
                <div>
                  <p className="eyebrow">{item.status}</p>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <p className="roadmap-outcome">{item.outcome}</p>
                </div>
              </article>
            ))}
          </div>
          <a
            className="text-link"
            href={tacticoreProgress.repositoryUrl}
            target="_blank"
            rel="noreferrer"
          >
            查看弈核工程仓库（可能需访问权限）↗
            <span className="sr-only">（新窗口打开）</span>
          </a>
        </div>
      </section>
    </>
  );
}
