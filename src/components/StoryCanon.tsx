import { storyCanon } from "../content/story-canon";
import { commanders } from "../content/commanders";
import "../styles/story-canon.css";

export function StoryCanon() {
  return <section id="remix-ai-canon" className="panel-section content-section story-canon" aria-labelledby="canon-title">
    <div className="shell">
      <p className="eyebrow">REMIX-AI / ORIGINAL TIMELINE</p>
      <h2 id="canon-title">2038，人的意志与机器的判断</h2>
      <p className="canon-lead">{storyCanon.introduction}</p>
      <p>{storyCanon.premise}</p>
      <p className="content-note">故事蓝本 v{storyCanon.version} · <time dateTime={storyCanon.date}>{storyCanon.date}</time> · 原创分歧设定，非 EA 官方剧情。</p>
      <h3>从初代推理到融合体指挥官</h3>
      <ol className="canon-timeline">{storyCanon.timeline.map(item => <li key={item.year}><span>{item.year}</span><div><h4>{item.title}</h4><p>{item.text}</p></div></li>)}</ol>
      <h3>三阵营，三条算力路线</h3>
      <div className="canon-grid">{storyCanon.factions.map(item => <article key={item.name}><p className="eyebrow">{item.name}</p><h4>{item.route}</h4><p>{item.text}</p></article>)}</div>
      <h3>2035：浮岛战争的转折</h3>
      <div className="canon-grid">{storyCanon.battle.map(item => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</div>
      <h3>三位指挥官，仍以人的意志作出选择</h3>
      <div className="canon-grid">{commanders.map(item => <article key={item.id} className="canon-commander"><img src={item.portrait} alt={item.imageAlt} width="384" height="480" loading="lazy" /><p className="eyebrow">{item.faction} / {item.english}</p><h4>{item.fullName}</h4><p>{item.romanName} · 代号「{item.name}」</p><p>{item.description}</p><p>职业军人 · 2038 年融合体指挥官</p></article>)}</div>
      <h3>技术背后的代价</h3>
      <div className="canon-grid">{storyCanon.themes.map(item => <article key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</div>
      <aside className="content-note"><strong>尚未定稿与实现边界</strong><p>{storyCanon.boundary}</p></aside>
      <a className="text-link" href="#story-expansion">阅读世界中的故事 ↓</a>
    </div>
  </section>;
}
