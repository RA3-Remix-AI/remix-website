import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { formatSectionTitle, cachedFiction, commanderLabels, factionLabels, fictionCatalog, findFiction, loadFiction, phaseLabels } from "../lib/fiction";
import type { FictionStory } from "../lib/fiction";
import illustrations from "../content/fiction-illustrations.json";
import "../styles/fiction.css";
const art = illustrations as Record<string,{src:string;alt:string;caption:string;afterSection:number}>;

export function FictionReaderPage() {
  const { slug = "" } = useParams();
  const meta = findFiction(slug);
  const { search, hash } = useLocation();
  const [story, setStory] = useState<FictionStory | undefined>(()=>cachedFiction(slug));
  const [failed,setFailed] = useState(false);
  const [fontSize,setFontSize] = useState(19);
  const [progress,setProgress] = useState(0);
  const article = useRef<HTMLDivElement>(null);
  const current = story?.id === slug ? story : undefined;
  useEffect(()=>{let active=true;setFailed(false);setStory(cachedFiction(slug));void loadFiction(slug).then(value=>{if(active)setStory(value);}).catch(()=>{if(active)setFailed(true);});return ()=>{active=false;};},[slug]);
  useEffect(()=>{try { const size = Number(localStorage.getItem("tacticore:reading-size")); if ([17,19,22].includes(size)) setFontSize(size); }catch{}},[]);
  useEffect(()=>{ if (!current) return; const target=/^#chapter-[1-9]\d*$/.test(hash)?document.getElementById(hash.slice(1)):null; target?.scrollIntoView({block:"start"}); const update=()=>{const node=article.current;if(!node)return;const rect=node.getBoundingClientRect();const distance=Math.max(1,rect.height-window.innerHeight+130);setProgress(Math.min(100,Math.max(0,Math.round((130-rect.top)/distance*100))));};update();window.addEventListener("scroll",update,{passive:true});window.addEventListener("resize",update);return ()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};},[current,hash,fontSize]);
  function changeSize(size:number) {setFontSize(size);try{localStorage.setItem("tacticore:reading-size",String(size));}catch{}}
  const shelf = `/stories${search}`;
  if (!meta) return <><PageIntro index="404 / NOT FOUND" title="页面未找到"><p>这篇故事尚未收录。</p></PageIntro><div className="shell not-found"><Link className="button" to={shelf}>返回书架 ↗</Link></div></>;
  const index=fictionCatalog.findIndex(item=>item.id===slug),previous=fictionCatalog[index-1],next=fictionCatalog[index+1];
  const illustration=art[String(meta.order)];
  return <article className="fiction-reader">
    <div className="reading-progress" role="progressbar" aria-label="阅读进度" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${progress}%`}} /></div>
    <header className="fiction-heading shell"><Link className="text-link" to={shelf}>← 返回书架</Link><p className="eyebrow">断线年代 / {String(meta.order).padStart(2,"0")} / {meta.year}</p><h1>{meta.title}</h1><p className="fiction-deck">{meta.summary}</p><p className="fiction-byline">{factionLabels[meta.faction]} · {phaseLabels[meta.phase]} · {commanderLabels[meta.commander]}<br />{meta.hanCount.toLocaleString("zh-CN")} 字 · 约 {meta.minutes} 分钟</p></header>
    <div className="fiction-reading-layout shell"><aside className="reading-sidebar"><nav aria-label="本篇章节"><p className="eyebrow">CONTENTS / 目录</p>{meta.sections.map((title,index)=><Link key={index} to={`${search}#chapter-${index+1}`}><span>{String(index+1).padStart(2,"0")}</span>{formatSectionTitle(title)}</Link>)}</nav><div className="reading-type-controls" aria-label="字号"><span>字号</span>{[17,19,22].map(size=><button key={size} type="button" aria-pressed={fontSize===size} onClick={()=>changeSize(size)}>{size===17?"小":size===19?"中":"大"}</button>)}</div><p className="reading-percentage" aria-live="off">已读 {progress}%</p></aside>
      <div className="fiction-text" ref={article} style={{fontSize}}>
        {!current && <p role="status">{failed?"正文暂时加载失败，请刷新页面重试。":"正在翻开故事……"}</p>}
        {current?.sections.map((section,index)=><section id={`chapter-${index+1}`} key={index} className="fiction-scene"><h2><span>{String(index+1).padStart(2,"0")}</span>{formatSectionTitle(section.title)}</h2>{section.paragraphs.map((paragraph,paragraphIndex)=><p key={paragraphIndex}>{paragraph}</p>)}{illustration && illustration.afterSection===index+1 && <figure className="fiction-illustration"><img src={illustration.src} alt={illustration.alt} loading="lazy" /><figcaption>{illustration.caption}</figcaption></figure>}</section>)}
        {current && <><div className="story-end"><span>✦</span><p>本篇完</p><Link to={shelf}>回到书架</Link></div><nav className="fiction-neighbours" aria-label="相邻故事">{previous?<Link to={`/stories/fiction/${previous.id}${search}`}><span>← 上一篇</span><strong>{previous.title}</strong></Link>:<span />}{next?<Link to={`/stories/fiction/${next.id}${search}`}><span>下一篇 →</span><strong>{next.title}</strong></Link>:<Link to={shelf}>返回书架 ↗</Link>}</nav></>}
      </div>
    </div>
  </article>;
}
