import { useState } from "react";
import { Link } from "react-router";
import { PageIntro } from "../components/PageIntro";
import baseline from "../content/remix037.json";
import { adoptionFor } from "../content/versions";

export function Remix037Page() {
  const [faction, setFaction] = useState("全部");
  const [query, setQuery] = useState("");
  const [adoption, setAdoption] = useState("全部");
  const filtered = baseline.units.filter(unit =>
    (faction === "全部" || unit.faction === faction) &&
    (adoption === "全部" || adoptionFor(unit.id) === adoption) &&
    `${unit.name} ${unit.role} ${unit.summary}`.includes(query.trim()),
  );
  return <>
    <PageIntro index="037 / ORIGINAL CONTENT" title="Remix 037 原有内容">
      <p>从帕拉丁到超级要塞，认识 037 已有的扩展兵种与经典装甲。再看 Remix-A 如何重新分配它们的战场职责。</p>
    </PageIntro>
    <section className="panel-section content-section"><div className="shell">
      <div className="version-path"><span className="status">BASE / Remix 037</span><p>原有单位、原有数值、原始肖像</p><Link className="text-link" to="/gameplay">查看 Remix-A 本版本改动 ↗</Link></div>
      <div className="version-showcase">
        <figure><img src="/materials/remix037/models/Paladin.png" alt="037 帕拉丁原始模型的离线预览" width="512" height="512" /><figcaption>盟军 · 支援与高科技</figcaption></figure>
        <figure><img src="/materials/remix037/models/IronFortress.png" alt="037 钢铁堡垒原始模型的离线预览" width="512" height="512" /><figcaption>苏联 · 装甲与重火力</figcaption></figure>
        <figure><img src="/materials/remix037/models/GigaFortress.png" alt="037 超级要塞原始模型的离线预览" width="512" height="512" /><figcaption>升阳 · 机甲与要塞形态</figcaption></figure>
      </div>
      <p className="content-note">上图为本机 037 模型离线预览，部分部件处于绑定姿态，不代表游戏待机动画。下列肖像、名称、定位与基础数值来自本地 Remix 0.3.7 包；介绍为整理说明。这里选取 29 条代表性单位与形态记录，包含原版沿用单位，并非完整生产名册。</p>
      <div className="unit-filters">
        <label>阵营<select value={faction} onChange={e => setFaction(e.target.value)}>{["全部", "盟军", "苏联", "升阳"].map(side => <option key={side}>{side}</option>)}</select></label>
        <label>A 版取舍<select value={adoption} onChange={e => setAdoption(e.target.value)}>{["全部", "Remix-A 改造", "Remix-A 常规基础", "未纳入 A 版首版"].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>搜索单位<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="名称、职责或说明" /></label>
        <p role="status">显示 {filtered.length} / {baseline.units.length} 条档案</p>
      </div>
      <div className="unit-grid baseline-grid">{filtered.map(unit => <article className="unit-card" key={unit.id}>
        <div className="unit-card-top"><img src={unit.image} alt={`Remix 037 ${unit.name}原始肖像`} width="128" height="128" loading="lazy" /><div><p className="eyebrow">REMIX 037 / {unit.faction}</p><h2>{unit.name}</h2><p>{unit.role}</p></div></div>
        <p>{unit.summary}</p>
        <dl className="unit-stats"><div><dt>037 对象造价</dt><dd>{unit.price ?? "未列明"}</dd></div><div><dt>对象生产时间</dt><dd>{unit.time > 0 ? `${unit.time} 秒` : "未列时长"}</dd></div><div><dt>037 生命</dt><dd>{unit.hp}</dd></div></dl>
        <span className="status">{adoptionFor(unit.id)}</span>
        <details className="source-detail"><summary>资料与数值说明</summary><p>对象：{unit.source.object}。数据为该形态的原始对象字段，不保证常规生产入口；0 秒不表示免费瞬间招募。升级、部署与协议可能改变实际成本或能力。肖像来自 037 与其引用的原版素材。</p></details>
      </article>)}</div>
      {filtered.length === 0 && <p className="content-note">没有符合条件的单位，请调整筛选。</p>}
      <div className="editorial-block"><p className="eyebrow">037 → A / DESIGN CHOICES</p><h2>同一个外形，可以承担新的职责。</h2><p>Remix-A 对部分 037 单位进行玩法重做，同时取舍其他扩展单位。宙斯、未来坦克、平定者等在这里保留为 037 内容介绍，不代表本版本已经加入。</p><Link className="button" to="/gameplay">查看图文改动对照 ↗</Link></div>
    </div></section>
  </>;
}
