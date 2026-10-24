import { useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { AtlasNavigation } from "../components/AtlasNavigation";
import { protocols, protocolFactions, protocolKind, filterProtocols } from "../content/protocols";

export function Protocols037Page() {
  const [params, setParams] = useSearchParams();
  const detail = useRef<HTMLElement>(null);
  const faction = protocolFactions.find(side => side === params.get("faction")) ?? "盟军";
  const query = params.get("q") ?? "";
  const matches = filterProtocols(faction, query);
  const selected = matches.find(item => item.id === params.get("protocol")) ?? matches[0];
  const panel = protocols.filter(item => item.faction === faction);
  const matchingIds = new Set(matches.map(item => item.id));

  function selectProtocol(id: string) {
    const next = new URLSearchParams(params);
    next.set("faction", faction);
    next.set("protocol", id);
    setParams(next, { preventScrollReset: true });
    if (window.matchMedia("(max-width: 850px)").matches) {
      detail.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    }
  }

  return <>
    <PageIntro index="037 / PROTOCOL MANUAL" title="Remix 037 协议详解">
      <p>三阵营、45 项协议。主动施放、学习后升级与科技授权分开阅读，认识 037 真正的协议体系。</p>
    </PageIntro>
    <AtlasNavigation />
    <section className="panel-section content-section"><div className="shell">
      <div className="version-path"><span className="status">REMIX 037 / 45 PROTOCOLS</span><p>原包协议图标 · 原面板顺序 · 原始冷却与学习要求</p><Link className="text-link" to="/gameplay">查看 Remix-A 的规则改造 ↗</Link></div>
      <div className="protocol-primer material-grid">
        <article className="material-card"><p className="eyebrow">01 / LEARN</p><h2>学习与施放是两件事</h2><p>45 项协议各需 1 点。面板分为五行，每项有对应最低军衔；学习不等于立即施放，也不等于免费生成部队或建筑。</p></article>
        <article className="material-card"><p className="eyebrow">02 / TWO EFFECTS</p><h2>主动技能之外，还有升级</h2><p>例如空中侦察同时强化飓风战机，空中突袭同时授予飞行能力。另有电力转换、专业开采与三阵营防御塔授权等纯升级条目。</p></article>
        <article className="material-card"><p className="eyebrow">03 / ORIGINAL RULES</p><h2>037 与 A 版分别理解</h2><p>037 天皇鬼王会升级指定鬼王；037 超级要塞可由指定海军转化。这些都与 Remix-A 的短时增益、核心部署方案不同。</p></article>
      </div>
      <div className="protocol-controls">
        <div className="protocol-factions" role="group" aria-label="协议阵营">{protocolFactions.map(side => <button key={side} type="button" className={side === faction ? "active" : ""} aria-pressed={side === faction} onClick={() => setParams({ faction: side })}>{side}<small>15 项</small></button>)}</div>
        <label>搜索当前阵营<input type="search" value={query} placeholder="协议名称、兵种或作用" onChange={event => {
          const next = new URLSearchParams(params);
          next.set("q", event.target.value);
          setParams(next, { replace: true, preventScrollReset: true });
        }} /></label>
        <p role="status">匹配 {matches.length} / 15 项</p>
      </div>
      <div className="protocol-layout">
        <div>
          <div className="section-heading"><div><p className="eyebrow">{faction} / ORIGINAL 5 × 3 PANEL</p><h2>选择协议，查看详解。</h2></div></div>
          <div className="protocol-panel" aria-label={`${faction}原始五行三列协议面板`}>{panel.map(item => <button type="button" className="protocol-tile" key={item.id} aria-pressed={selected?.id === item.id} aria-controls="protocol-detail" disabled={!matchingIds.has(item.id)} onClick={() => selectProtocol(item.id)}>
            <span className="protocol-position">军衔 {item.rank} / {item.points} 点</span><img src={item.image} alt="" width="64" height="64" /><strong>{item.name}</strong><span>{protocolKind(item)}</span>
          </button>)}</div>
          <p className="content-note">按原面板五行三列排列。上下位置不表示必须沿列学习：当前 45 项的依赖字段列出了军衔与部分阵营条件，未列出其他面板协议作为前置。内部 ID 的 Rank 数字也不等于最低军衔。</p>
        </div>
        {selected ? <article className="protocol-detail unit-card" id="protocol-detail" ref={detail} aria-labelledby="protocol-name">
          <div className="unit-card-top"><img src={selected.image} alt={`037 ${selected.name}协议原始图标`} width="96" height="96" /><div><p className="eyebrow">REMIX 037 / {faction} / 第 {selected.row} 行 · 第 {selected.column} 列</p><h2 id="protocol-name">{selected.name}</h2><span className="status">{protocolKind(selected)}</span></div></div>
          <dl className="unit-stats protocol-stats"><div><dt>学习点数</dt><dd>{selected.points} 点</dd></div><div><dt>最低军衔</dt><dd>{selected.rank}</dd></div><div><dt>主动冷却</dt><dd>{selected.powers.length ? `${selected.powers[0].cooldown} 秒` : "不适用"}</dd></div></dl>
          <section className="protocol-effect"><h3>主动施放</h3><p>{selected.active ?? "此项为升级或科技授权，没有独立的主动施放入口。"}</p>{selected.powers.length > 0 && <p className="content-note">模板选点方式：{selected.powers.map(power => power.target).join(" / ")}。具体可选目标仍受技能过滤条件限制。</p>}</section>
          <section className="protocol-effect"><h3>学习后的升级 / 授权</h3><p>{selected.upgrade ?? "原协议说明未列出额外的学习后升级效果；不要把主动技能效果当成全军常驻加成。"}</p></section>
          <section className="protocol-effect"><h3>使用思路</h3><p>{selected.usage}</p></section>
          <p className="protocol-caution"><strong>理解要点</strong>{selected.caution}</p>
          <section className="protocol-a-note"><p className="eyebrow">REMIX-A / 本版本取舍</p><p>{selected.remixA}</p><Link className="text-link" to="/gameplay">阅读 A 版改动 ↗</Link></section>
          <details className="source-detail"><summary>核对原包说明与配置来源</summary><p className="protocol-source-text">{selected.description}</p><p>协议标识：{selected.source.tech}</p><p>读取字段：TechPointsRequired、TechDependency；主动冷却来自关联 SpecialPowerTemplate 的 ReloadTime。</p>{selected.powers.map(power => <p key={power.id}>{power.id} · {power.cooldown} 秒</p>)}</details>
        </article> : <div className="unit-card" role="status"><h2>没有匹配的协议</h2><p>请调整搜索词，或切换其他阵营。</p></div>}
      </div>
      <p className="content-note">资料来自本地 Remix 0.3.7 协议面板、中文按钮说明、科技依赖与主动技能配置。效果文字为整理说明，使用思路属于战术解读；未确认的伤害、持续时间、概率和倍率不填写推测值。“大量生产”的主动入口与旧文案有差异，已在该项中单独标明。这里的冷却不是生产时间或效果持续时间。</p>
      <Link className="text-link" to="/remix-037">返回 037 单位图鉴 ↗</Link>
    </div></section>
  </>;
}
