import { Link } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { historicalUpdates, videoIndex } from "../content/videos";
import { publicationDate } from "../lib/videos";
import { tacticoreProgress } from "../content/tacticore-progress";
import "../styles/development-progress.css";

export function DevlogsPage() {
  return (
    <>
      <PageIntro index="03 / DEVELOPMENT ARCHIVE" title="往期开发记录">
        <p>
          阅读弈核 Tacticore 的研发周报，回看 Remix 原作者的历史更新。
          本项目的工程进展与原 Mod 的开发档案分别记录，按时间由新到旧展示。
        </p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell">
          <article className="development-report" id="tacticore-2026-10-25" aria-labelledby="weekly-report-title">
            <header className="development-report-heading">
              <p className="eyebrow">TACTICORE / 本周研发记录</p>
              <time dateTime={tacticoreProgress.publishedAt}>发布于 2026-10-25 · {tacticoreProgress.periodLabel}</time>
              <h2 id="weekly-report-title">{tacticoreProgress.title}</h2>
              <p>{tacticoreProgress.summary}</p>
            </header>
            <div className="development-report-boundary">
              <strong>当前阶段：本机功能已落地，实机接线继续推进</strong>
              <p>本周这一侧聚焦桌面体验、决策框架和工程交接；Windows 侧继续迭代策略算法与模型交互。下文的界面操作与测试结果属于本机开发验证，新桌面尚未连接真实游戏宿主。</p>
            </div>
            <section aria-labelledby="weekly-completed-title">
              <h3 id="weekly-completed-title">本周完成了什么</h3>
              <div className="development-report-deliveries">
                {tacticoreProgress.completed.map((item, index) => <div key={item.title}><span>0{index + 1}</span><div><h4>{item.title}</h4><p>{item.body}</p></div></div>)}
              </div>
            </section>
            <section aria-labelledby="weekly-experience-title">
              <h3 id="weekly-experience-title">三个工作区，先把准备与交流做顺手</h3>
              <div className="development-feature-grid">
                <div><span>01 / PREPARATION</span><h4>战前备战室</h4><p>选择阵营、地图和队友 / 对手关系，保存、恢复或导出备战方案。游戏初始资金计划、Agent 生产总支出上限、资源保留底线独立配置，避免混淆。</p><small>当前保存的是本机计划；游戏大厅资金仍需玩家设置，读回与应用待接。</small></div>
                <div><span>02 / COMMANDERS</span><h4>指挥官工坊</h4><p>稳健经营、均衡应变、主动施压、侧翼游击四类预设，搭配进攻时机、风险承受、经济投入、侦察积极、追击尺度五维五档偏好，即时查看三类行为说明。</p><small>预设映射到现有三类宿主人格；行为说明与偏好草案尚未下发真实模型。</small></div>
                <div><span>03 / RADIO</span><h4>战场电台</h4><p>按指挥官导入本地视频、音频和字幕，试听开局、危机、重大损失、救援、胜利、失败六种场景。支持频率、音量、静音、仅字幕，以及冷却、中断和过期处理。</p><small>局内指挥官与右上角电台入口已存在；新素材库与真实战况事件的同步仍待接入。</small></div>
              </div>
            </section>
            <section className="development-report-validation" aria-labelledby="weekly-evidence-title">
              <h3 id="weekly-evidence-title">验证到哪一步</h3>
              <ul>{tacticoreProgress.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
              <p>macOS 已构建并实际打开 Tauri debug 应用；本轮未调用真实模型、读取游戏或派发游戏指令。Windows 构建、DPAPI、服务商兼容、真实网络取消和新 GUI 游戏接入仍需目标环境验收。</p>
            </section>
            <section aria-labelledby="weekly-next-title">
              <h3 id="weekly-next-title">下一步，把本机体验接到真实战场</h3>
              <ol className="development-report-next">{tacticoreProgress.next.map((item) => <li key={item}>{item}</li>)}</ol>
              <p className="development-report-future">伴随小窗、快速配合意图、战后关键时刻、模型健康与用量属于后续体验计划。多 Agent 并肩 / 对抗将在会话、视野和执行权隔离通过同场验证后推进。</p>
            </section>
            <footer className="development-report-footer">
              <p>弈核作为独立程序维护，代码已同步独立 GitHub 仓库，计划后续独立开源。Remix-Ai 继续以 Remix 037 作为游戏内容基线。本周同时补齐 README 截图、Feature 计划、玩家指南、Windows 交接和第三方来源说明。</p>
              <div className="development-report-links"><Link className="text-link" to="/roadmap">查看完整研发规划 ↗</Link><a className="text-link" href={tacticoreProgress.repositoryUrl} target="_blank" rel="noreferrer">弈核工程仓库 ↗<span className="sr-only">（新窗口打开）</span></a></div>
              <small>工程仓库及文档链接可能需要访问权限；本页周报可直接站内阅读。</small>
            </footer>
          </article>
          <div className="development-history-heading"><p className="eyebrow">REMIX / 原作者历史档案</p><h2>回看 Remix 的演进</h2><p>以下为原作者发布的历史视频，按发布时间倒排，保留来源与原始标题。</p></div>
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
