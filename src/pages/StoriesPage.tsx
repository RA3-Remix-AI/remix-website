import { Link, Navigate, useLocation, useSearchParams } from "react-router";
import { commanders } from "../content/commanders";
import { fictionCatalog, filterFiction, factionLabels, phaseLabels, commanderLabels, volumes } from "../lib/fiction";
import { storySectionIds } from "./StoryWorldPage";
import "../styles/fiction.css";

export function StoriesPage() {
  const { hash } = useLocation();
  const [params, setParams] = useSearchParams();
  if (storySectionIds.includes(hash.slice(1))) return <Navigate replace to={`/stories/world${hash}`} />;
  const stories = filterFiction(params);
  const update = (key:string,value:string) => { const next = new URLSearchParams(params); if(value && value !== "all") next.set(key,value); else next.delete(key);setParams(next,{replace:true}); };
  return <div className="fiction-library">
    <section className="library-hero shell">
      <div className="library-hero-copy"><p className="eyebrow">TACTICORE / ORIGINAL FICTION</p><p className="library-series">THE YEARS BETWEEN SIGNALS</p><h1>断线年代<span>人的选择，留在战报之外。</span></h1><p className="library-lead">一场未曾终结的战争，三条算力路线。读军官、工人和普通人的故事，看他们如何在机器给出的答案之外，承担自己的决定。</p><div className="library-stats"><span><b>{fictionCatalog.length}</b> 篇可读故事</span><span><b>3</b> 卷年代编排</span><span>2023 — 2038</span></div><Link className="text-link" to="/stories/world">先了解世界观与时间线 ↗</Link></div>
      <div className="library-hero-art" aria-hidden="true"><img src="/materials/commanders/hammer-portrait.webp" alt="" /><img src="/materials/commanders/bastion-portrait.webp" alt="" /><img src="/materials/commanders/ghost-portrait.webp" alt="" /><span>THREE FRONTS · ONE UNFINISHED WORLD</span></div>
    </section>
    <div className="shell"><p className="library-scope">本集为基于故事蓝本 0.9 的原创小说。新增人物、地点与局部事件属于文学扩写，不自动回写正式蓝本。字数仅统计正文汉字，阅读时间按每分钟 400 字估算。</p>
      <section className="library-tools" aria-label="筛选故事"><label className="library-search">查找一本故事<input type="search" placeholder="篇名、人物、年代或关键词" value={params.get("q") ?? ""} onChange={event=>update("q",event.target.value)} /></label>{[["faction","阵营",factionLabels],["phase","融合阶段",phaseLabels],["commander","主角",commanderLabels]].map(([key,label,options])=><label key={key as string}>{label as string}<select value={params.get(key as string) ?? "all"} onChange={event=>update(key as string,event.target.value)}><option value="all">全部{label as string}</option>{Object.entries(options).map(([value,name])=><option key={value} value={value}>{name}</option>)}</select></label>)}<button className="library-reset" type="button" onClick={()=>setParams({},{replace:true})}>重置筛选</button></section>
      <p className="library-results" role="status">找到 {stories.length} 篇故事{fictionCatalog.length < 30 ? ` · 全集计划 30 篇，其余篇目仍在创作` : ""}</p>
      {volumes.map(volume=>{ const entries=stories.filter(story=>story.phase===volume.id);return entries.length?<section className="library-volume" key={volume.id} aria-labelledby={`volume-${volume.id}`}><header><span className="volume-number">{volume.number}</span><div><p className="eyebrow">{volume.years} / {entries.length} STORIES</p><h2 id={`volume-${volume.id}`}>{volume.title}</h2></div><span className="volume-rule" /></header><div className="book-grid">{entries.map(story=>{const commander=commanders.find(item=>item.id===story.commander);return <Link key={story.id} className={`story-book faction-${story.faction}`} to={`/stories/fiction/${story.id}${params.size ? `?${params.toString()}` : ""}`}><div className="book-cover">{commander?<img src={commander.portrait} alt="" loading="lazy" />:<div className="book-symbol" aria-hidden="true">{story.year}<span>{factionLabels[story.faction]}</span></div>}<span className="book-order">{String(story.order).padStart(2,"0")}</span><div className="book-cover-caption"><p>{factionLabels[story.faction]} / {story.year}</p><h3>{story.title}</h3></div></div><div className="book-info"><p className="book-meta">{commanderLabels[story.commander]}<span>{story.hanCount.toLocaleString("zh-CN")} 字 · {story.minutes} 分钟</span></p><p className="book-summary">{story.summary}</p><span className="book-action">翻开故事 <b aria-hidden="true">↗</b></span></div></Link>;})}</div></section>:null;})}
      {!stories.length && <div className="library-empty"><h2>{fictionCatalog.length ? "这一格书架暂时没有故事" : "故事正在写入书架"}</h2><p>{fictionCatalog.length ? "试试其他阵营、人物或关键词。" : "完成正文并通过字数检查的篇目会在这里出现。也可以先阅读世界观。"}</p><Link className="text-link" to="/stories/world">阅读世界观 ↗</Link></div>}
    </div>
  </div>;
}
