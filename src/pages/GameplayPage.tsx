import { useState } from "react";
import { FactionSelector } from "../components/FactionSelector";
import { FactionTransition } from "../components/FactionTransition";
import { Link } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { factions, units, changes } from "../content/units";
import { baselineFor, reworks, illustratedChanges } from "../content/versions";
import budgets from "../content/unit-budgets.json";

export function GameplayPage() {
  const [faction, setFaction] = useState("全部");
  const [query, setQuery] = useState("");
  const matches = (name: string, side: string, role: string) =>
    (faction === "全部" || side === faction) && `${name} ${role}`.includes(query.trim());
  const featured = units.map((unit, index) => ({ ...unit, index })).filter(u => matches(u.name, u.faction, u.role));
  const roster = Object.entries(budgets).filter(([, u]) => matches(u.name, u.faction === "旭日帝国" ? "升阳" : u.faction, u.role));

  return <>
    <PageIntro index="AI / VERSION CHANGES" title="Remix-Ai 本版本改动">
      <p>保留熟悉的轮廓，重新定义战场分工。从 037 原有单位出发，重做支援、控制与要塞玩法。</p>
    </PageIntro>
    <section className="panel-section content-section"><div className="shell">
      <div className="version-path"><span className="status">CURRENT / Remix-Ai</span><p>五个常规单位改造 · 两种要塞重做 · 三阵营规则调整</p><Link className="text-link" to="/remix-037">Remix原版单位 ↗</Link><Link className="text-link" to="/protocols-037">037 协议详解 ↗</Link></div>
      <p className="content-note first-note">以下为 Remix-Ai 开发中设计与当前测试包数据，更新于 2026-10-24。037 原始数据与 AI版数值分别列出；完整游戏内验收尚未完成。</p>
      <div className="material-grid">{factions.map(side => <article className="material-card" key={side.name}>
        <p className="eyebrow">Remix-Ai / {side.name}</p><h2>{side.name}</h2><p>{side.identity}</p><p>{side.construction}</p>
      </article>)}</div>
      <div className="section-heading unit-heading"><div><p className="eyebrow">037 → AI / UNIT REWORKS</p><h2>七种单位，各有战场职责。</h2></div><p>对照原有定位，读懂本版改造</p></div>
      <div className="unit-filters">
        <FactionSelector value={faction} onChange={setFaction} />
        <label>搜索单位与职责<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="例如：防空、坦克、控制" /></label>
        <p role="status">本版改造 {featured.length} 项 · 常规数据 {roster.length} 项（含生产变体）</p>
      </div>
      <FactionTransition value={faction} className="unit-grid">{featured.map(u => {
        const original = baselineFor(u.index);
        const rework = reworks[u.index];
        return <article className="unit-card rework-card" key={u.name}>
          <figure className="rework-visual"><img src={`/materials/remix037/models/${rework.model}.png`} alt={`${u.name}所用 037 模型底材的离线预览`} width="512" height="512" loading="lazy" /><figcaption>037 原始底材参考 · 非 AI版实机画面</figcaption></figure>
          <div className="unit-card-top"><img src={`/materials/units/${u.image}`} alt={`${u.name}的 037 来源肖像参考`} width="128" height="128" loading="lazy" /><div><p className="eyebrow">Remix-Ai / {u.faction} / {u.tier}</p><h3>{u.name}</h3><p>{u.role}</p></div></div>
          <div className="version-delta"><div><span>REMIX 037</span><p>{rework.before}</p></div><div><span>Remix-Ai</span><p>{rework.after}</p></div></div>
          {original && <div className="budget-delta" aria-label={`${u.name}的版本数值对照`}>
            <span>对象预算：037 → AII</span>
            <p>造价 <b>{original.price} → {u.price}</b></p>
            <p>生产 <b>{original.time > 0 ? `${original.time} 秒` : "未列时长"} → {u.time} 秒</b></p>
            <p>生命{u.name === "超级要塞" ? "（核心）" : ""} <b>{original.hp} → {u.hp}</b></p>
          </div>}
          <p>{u.description}</p><p className="content-note">{u.limit}</p>
        </article>;
      })}</FactionTransition>
      {featured.length === 0 && <p className="content-note">没有符合条件的改造单位，请调整筛选。</p>}
      <p className="content-note">037 底材原有模型、贴图与动画不宣称原创。钢铁堡垒的 037 数值取平台对象，AI版生产条件已重做，不能把原对象的 0 秒当作瞬间招募。超级要塞对照采用核心对象：AI版展开平台为 5000 生命。</p>
      <div className="section-heading unit-heading"><div><p className="eyebrow">Remix-Ai / RULE CHANGES</p><h2>改造的重点，是选择与配合。</h2></div></div>
      <div className="illustrated-rules">{changes.map((c, i) => {
        const visual = illustratedChanges[i];
        return <article className="rule-feature" key={c.title}>
          <figure><img src={`/materials/remix037/models/${visual.image}.png`} alt={visual.caption} width="512" height="512" loading="lazy" /><figcaption>{visual.caption}</figcaption></figure>
          <div><p className="eyebrow">0{i + 1} / Remix-Ai</p><h3>{c.title}</h3><p>{c.description}</p><ol className="rule-flow" aria-label="战术流程示意">{visual.steps.map(step => <li key={step}>{step}</li>)}</ol></div>
        </article>;
      })}</div>
      <div className="section-heading unit-heading"><div><p className="eyebrow">Remix-Ai / ROSTER</p><h2>常规部队数据</h2></div><p>造价、生产时间与生命 · 开发首轮预算</p></div>
      <p className="content-note">沿用上方筛选。下表是 AI版预算；037 数据请查看原有内容页。陆海生产变体保留独立行，不能仅凭生命与造价判断实战强弱。</p>
      <FactionTransition value={faction} className="comparison-wrap"><table className="comparison-table unit-table">
        <caption className="sr-only">Remix-Ai 常规单位开发预算，含生产变体</caption>
        <thead><tr><th scope="col">单位 / 阵营</th><th scope="col">职责</th><th scope="col">造价</th><th scope="col">生产 / 秒</th><th scope="col">生命</th></tr></thead>
        <tbody>{roster.map(([id, u]) => <tr key={id}><th scope="row">{u.name}<small>{u.faction} · {id}</small></th><td>{u.role}</td><td>{u.price}</td><td>{u.time}</td><td>{u.hp}</td></tr>)}</tbody>
      </table></FactionTransition>
      {roster.length === 0 && <p className="content-note">没有符合条件的常规单位。</p>}
      <div className="editorial-block"><p className="eyebrow">Remix-Ai / DEVELOPMENT</p><h2>已进入测试包，继续验证战场表现。</h2><p>当前资料记录了三档画质构建与离线配置核对。钢铁堡垒撤出驻军入口仍有已知问题；超级要塞正常生产、展开、转换与定向瞄准仍待实机验证。协议交互、AI 配兵和完整对局平衡也尚未验收。</p><Link className="text-link" to="/remix-037">回看 Remix原版单位 ↗</Link></div>
    </div></section>
  </>;
}
