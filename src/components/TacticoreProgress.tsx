import { useState } from "react";
import { Link } from "react-router";
import { tacticoreProgress } from "../content/tacticore-progress";
import "../styles/tacticore-progress.css";

const previews = [
  {
    id: "preparation", title: "战前备战室", code: "PREPARATION",
    description: "准备阵营、队友关系与开局资金计划，分别设置生产额度和资源保留底线。方案可在本机保存、恢复与导出，游戏实际设置仍需核验。",
    alt: "2026-10-25 弈核战前备战室历史离线界面，展示阵营与资金配置",
  },
  {
    id: "commander-workshop", title: "指挥官工坊", code: "COMMANDERS",
    description: "稳健经营、均衡应变、主动施压、侧翼游击四类预设，配合五维五档偏好与行为说明。当时形成本机配置草案，尚未下发真实宿主或模型。",
    alt: "2026-10-25 弈核指挥官工坊历史离线界面，展示打法预设与五档偏好",
  },
  {
    id: "radio", title: "战场电台", code: "RADIO",
    description: "导入本地视频、音频和字幕，设置关怀频率、静音与仅字幕模式，手动演练六类战况。真实局内事件与电台播放接口仍待接通。",
    alt: "2026-10-25 弈核战场电台历史离线界面，展示本地素材与通讯预览",
  },
] as const;

export function TacticoreProgress() {
  const [selected, setSelected] = useState(0);
  const current = previews[selected]!;

  return (
    <section id="tacticore-progress" className="tacticore-progress" aria-labelledby="tacticore-progress-title">
      <div className="shell">
        <div className="tacticore-progress-heading">
          <div>
            <p className="campaign-kicker"><span /> DEVELOPMENT DISPATCH / 弈核开发进度</p>
            <h2 id="tacticore-progress-title">第一份 Windows beta，<br /><em>走进真实战场。</em></h2>
          </div>
          <div className="tacticore-progress-brief">
            <time dateTime={tacticoreProgress.publishedAt}>本周纪要 / {tacticoreProgress.periodLabel}</time>
            <p>{tacticoreProgress.summary}</p>
            <span className="tacticore-progress-state"><i aria-hidden="true" /> v0.1.0-beta.1 · Windows 限定预发布</span>
          </div>
        </div>

        <div className="tacticore-progress-grid">
          {tacticoreProgress.completed.map((item, index) => (
            <article className="tacticore-progress-card" key={item.title}>
              <p><span>0{index + 1}</span><small>本周已完成</small></p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="tacticore-progress-preview">
          <div className="tacticore-preview-toolbar">
            <span>HISTORY / 2026-10-25 历史界面</span>
            <small>OFFLINE PREVIEW · 非 beta 截图</small>
          </div>
          <div className="tacticore-preview-options" role="group" aria-label="选择 2026-10-25 历史离线界面截图">
            {previews.map((item, index) => (
              <button key={item.id} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
                <small>0{index + 1}</small><span>{item.title}</span><b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>
          <figure>
            <div className="tacticore-preview-image">
              <img key={current.id} src={`/materials/tacticore/${current.id}.jpg`} width="1366" height="900" loading="lazy" alt={current.alt} />
            </div>
            <figcaption>
              <div><span>{current.code}</span><h3>{current.title}</h3></div>
              <p>{current.description}</p>
            </figcaption>
          </figure>
          <p className="tacticore-preview-note">以上为 2026-10-25 历史离线浏览器预览，与当时 Tauri 桌面共用界面；不是本次 Windows beta 截图，不能作为 beta 游戏接入的证据。</p>
        </div>

        <div className="tacticore-progress-footer">
          <div className="tacticore-progress-validation">
            <p className="tacticore-progress-label">VERIFICATION / 本次 beta 验证</p>
            <ul>{tacticoreProgress.evidence.map(item => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="tacticore-progress-next">
            <p className="tacticore-progress-label">NEXT MILESTONE / 接下来</p>
            <ol>{tacticoreProgress.next.map(item => <li key={item}>{item}</li>)}</ol>
          </div>
        </div>
        <div className="tacticore-progress-actions">
          <Link className="button button-secondary" to={tacticoreProgress.reportUrl}>阅读完整开发周报 ↗</Link>
          <a className="text-link" href={tacticoreProgress.releaseUrl} target="_blank" rel="noreferrer">源码与 beta 发布记录 ↗<span className="sr-only">（新窗口打开）</span></a>
          <small>beta 预发布已公开 · 适用条件与安装说明见发布页</small>
        </div>
      </div>
    </section>
  );
}
