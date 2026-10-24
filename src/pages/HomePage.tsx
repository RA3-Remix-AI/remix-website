import { Link } from "react-router";
import { CommanderClientShowcase } from "../components/CommanderClientShowcase";
import { TacticoreSection } from "../components/TacticoreSection";
import { useHomeReveal } from "../hooks/useHomeReveal";
import { useHomeImmersion } from "../hooks/useHomeImmersion";
import { HomeChapterRail } from "../components/HomeChapterRail";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrivalIntro } from "../components/ArrivalIntro";
import { claimArrivalIntro } from "../lib/arrival-intro";
import { T4Showcase } from "../components/T4Showcase";
import { FactionMark } from "../components/FactionMark";
import { t4Showcase } from "../content/showcase";
import { videos } from "../content/videos";
import { stories } from "../content/stories";
import { publicationDate } from "../lib/videos";
import { commandDecisionCycle } from "../content/site";

const factionStories = [
  { title: "钢铁洪流", description: "经营战线、正面突破。让驻军与重装平台共同推进。", accent: "持续施压 / 前线支援" },
  { title: "精确协同", description: "侦察、控制、火力窗口。以精准调度掌握交战节奏。", accent: "战场情报 / 协同控制" },
  { title: "瞬息万变", description: "灵活部署、海空转换。在关键地点集中力量。", accent: "形态取舍 / 局部集中" },
];

export function HomePage({ entryPath = "/" }: { entryPath?: string }) {
  const revealRoot = useHomeReveal<HTMLDivElement>();
  const [introOpen, setIntroOpen] = useState(false);
  const [entryChecked, setEntryChecked] = useState(false);
  const activeChapter = useHomeImmersion(revealRoot, introOpen || !entryChecked);
  const checked = useRef(false);
  useEffect(() => {
    if (checked.current) return;
    checked.current = true;
    setIntroOpen(claimArrivalIntro(entryPath, () => window.sessionStorage));
    setEntryChecked(true);
  }, [entryPath]);
  const closeIntro = useCallback(() => setIntroOpen(false), []);
  return (
    <div className="campaign-home" ref={revealRoot}>
      <HomeChapterRail active={activeChapter} hidden={introOpen || !entryChecked} />
      {introOpen && <ArrivalIntro onClose={closeIntro} />}
      <T4Showcase suspended={introOpen || !entryChecked} onReplayIntro={() => setIntroOpen(true)} />
      <section className="campaign-intro shell" aria-labelledby="difference-title">
        <div className="campaign-intro-heading">
          <p className="campaign-kicker"><span /> 01 / REIMAGINED WARFARE</p>
          <h2 id="difference-title">与原版，有何不同？</h2>
          <p className="campaign-display-copy">交锋的，<br /><em>是指挥与判断。</em></p>
        </div>
        <div className="campaign-intro-copy">
          <span className="campaign-coordinate">RA3 → REMIX 037 → Remix-Ai</span>
          <p>弈核，探索多种指挥风格的 Agent。<br className="desktop-break" />以 Remix-Ai 为游戏内容适配版本，验证指挥与协同。</p>
          <p>Remix-Ai 基于 Remix 037 已实装的单位与协议，进行平衡调整和少量修改。弈核的研发目标是靠战场判断、调度与协同形成挑战，不以经济作弊或笨拙的固定脚本作为能力来源。</p>
          <Link className="text-link" to="/gameplay">了解本版本的改造 <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <TacticoreSection />
      <CommanderClientShowcase />

      <section id="factions" className="campaign-factions" aria-labelledby="factions-title">
        <div className="shell campaign-section-heading">
          <div><p className="campaign-kicker"><span /> 02 / CHOOSE YOUR SIDE</p><h2 id="factions-title">三方力量，同一片战场。</h2></div>
          <Link className="text-link" to="/gameplay">探索阵营与玩法 ↗</Link>
        </div>
        <div className="campaign-faction-grid">
          {t4Showcase.map((unit, index) => (
            <Link className={`campaign-faction faction-${unit.factionKey}`} to="/gameplay" key={unit.id}>
              <img className="campaign-faction-art" src={`/materials/showcase/${unit.id}-art.webp`} alt={`${unit.name}宣传演绎画`} width="1536" height="1024" loading="lazy" />
              <div className="campaign-faction-shade" />
              <div className="campaign-faction-top"><span>0{index + 1} / {unit.faction}</span><FactionMark faction={unit.factionKey} /></div>
              <div className="campaign-faction-copy"><p>{factionStories[index]!.accent}</p><h3>{factionStories[index]!.title}</h3><span>{factionStories[index]!.description}</span><b aria-hidden="true">↗</b></div>
            </Link>
          ))}
        </div>
        <p className="campaign-art-credit shell">以视频单位为参考的 AI 宣传演绎，非游戏实机。宙斯属于 Remix 原作，未纳入 AI 版首版。</p>
      </section>

      <section className="campaign-battlefield" aria-labelledby="battlefield-title">
        <img src="/materials/showcase/battlefield.jpg" alt="Remix 原作宣传片中的大规模战场" width="1920" height="1080" loading="lazy" />
        <div className="campaign-battlefield-shade" />
        <div className="shell campaign-battlefield-copy">
          <p className="campaign-kicker"><span /> EVERY MOVE MATTERS</p>
          <h2 id="battlefield-title">从一支小队，<br />到整片战场。</h2>
          <p>发展基地，读懂对手，组合你的部队。<br />一次侦察、一次包夹、一次及时的调度，<br />都可能成为攻势的起点。</p>
          <Link className="button button-secondary" to="/videos">观看游戏影像 <span aria-hidden="true">▷</span></Link>
          <small>画面来自 Remix 原作宣传片</small>
        </div>
        <div className="campaign-battlefield-rules shell"><span>01 <b>发展</b> BUILD</span><span>02 <b>判断</b> READ</span><span>03 <b>调度</b> COMMAND</span></div>
      </section>

      <section className="campaign-versions shell" aria-labelledby="versions-title">
        <div className="campaign-section-heading"><div><p className="campaign-kicker"><span /> 03 / THE LEGACY CONTINUES</p><h2 id="versions-title">熟悉的轮廓。新的分工。</h2></div><p>认识原作，走进下一阶段。</p></div>
        <div className="campaign-version-grid">
          <Link className="campaign-version campaign-version-base" to="/remix-037">
            <span className="campaign-version-number">037</span>
            <img src="/materials/remix037/models/GigaFortress.png" alt="Remix 037 超级要塞原始模型预览" width="512" height="512" loading="lazy" />
            <div><p className="campaign-coordinate">THE FOUNDATION / 内容基线</p><h3>Remix 原版<span>037 内容基线</span></h3><p>29 条单位与形态档案。浏览原始肖像、定位与数值，重新认识这片战场的重装力量。</p><span className="text-link">探索 Remix 原版 ↗</span></div>
          </Link>
          <Link className="campaign-version campaign-version-current" to="/gameplay">
            <span className="campaign-version-number">AI</span>
            <img src="/materials/remix037/models/IronFortress.png" alt="Remix-Ai 使用的钢铁堡垒底材模型参考" width="512" height="512" loading="lazy" />
            <div><p className="campaign-coordinate">THE NEXT CHAPTER / 开发测试中</p><h3>Remix-Ai<span>AI 版改动</span></h3><p>七种单位改造、三阵营协议与基础规则。从要塞到步兵，让战术选择更加鲜明。</p><span className="text-link">查看改造内容 ↗</span></div>
          </Link>
        </div>
        <p className="campaign-art-credit">模型为 037 原始资产的离线预览；AI 版仍在开发与实机验证。</p>
      </section>

      <section id="archive" className="campaign-archive" aria-labelledby="archive-title">
        <div className="shell campaign-archive-layout">
          <div className="campaign-archive-heading"><p className="campaign-kicker"><span /> 04 / INTELLIGENCE ARCHIVE</p><h2 id="archive-title">战场之外，<br />故事仍在继续。</h2><p>从更新影像到世界观创作，<br />回看 Remix 一路走来的轨迹。</p><Link className="text-link" to="/devlogs">查阅往期开发记录 ↗</Link></div>
          <div className="campaign-archive-entries">
            {videos.slice(0, 2).map((video, index) => (
              <Link className="campaign-archive-entry" to="/videos" key={video.bvid}><span className="campaign-entry-number">0{index + 1}</span><div><p><span>视频档案</span><time dateTime={video.publishedAt}>{publicationDate(video.publishedAt)}</time></p><h3>{video.title}</h3></div><b aria-hidden="true">↗</b></Link>
            ))}
            <Link className="campaign-archive-entry" to="/stories"><span className="campaign-entry-number">03</span><div><p><span>故事与设定</span><span>{stories.length} 篇整理摘要</span></p><h3>那些塑造战场的人与故事</h3></div><b aria-hidden="true">↗</b></Link>
          </div>
        </div>
      </section>

      <section id="future" className="campaign-future shell" aria-labelledby="future-title">
        <div className="campaign-future-symbol" aria-hidden="true"><span>AI</span><i /><i /><i /><small>TACTICORE / NEXT GENERATION</small></div>
        <div className="campaign-future-copy">
          <p className="campaign-kicker"><span /> 05 / INTELLIGENCE IN DEVELOPMENT</p>
          <h2 id="future-title">弈核指挥官，<br />从判断到行动。</h2>
          <p>弈核的核心探索：让快速模型参与指挥决策。<br />先在红色警戒 3 验证感知、判断、调度与反馈，再探索跨游戏适配。</p>
          <p className="campaign-ai-status"><span aria-hidden="true" /> 初期研发 · 指挥闭环与游戏接入待验证</p>
          <Link className="button" to="/roadmap">查看弈核研发计划 <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="campaign-ai-capabilities">
          <article className="campaign-ai-capability campaign-ai-commander">
            <div className="campaign-ai-capability-top"><span>CORE / AI COMMANDER</span><b>拟议设计 · 待接入</b></div>
            <h3>一套会随战况调整的指挥思路。</h3>
            <p>计划让指挥官依据游戏可见信息，在资源发展与攻防投入之间取舍，选择兵种组合，并判断何时进攻、坚守或撤退。</p>
            <ol className="command-decision-cycle" aria-label="拟验证的 AI 指挥流程">
              {commandDecisionCycle.map((step, index) => <li key={step.title}><span>0{index + 1}</span><h4>{step.title}</h4><p>{step.description}</p></li>)}
            </ol>
            <span className="campaign-ai-capability-focus">战况反馈后回到感知与判断 · 指挥闭环待验证</span>
          </article>
          <article className="campaign-ai-capability">
            <div className="campaign-ai-capability-top"><span>EXTENSION / CAMPAIGN</span><b>延伸方向</b></div>
            <h3>延伸：战役体验</h3>
            <p>探索 AI 辅助剧情与任务设计，让故事背景与战场目标产生更多联系。</p>
            <span className="campaign-ai-capability-focus">剧情探索 / 任务设计</span>
          </article>
          <article className="campaign-ai-capability">
            <div className="campaign-ai-capability-top"><span>EXTENSION / SYNERGY</span><b>延伸方向</b></div>
            <h3>延伸：兵种选择</h3>
            <p>研究配兵与协同建议，结合兵种职责、对手构成和交战环境辅助判断。</p>
            <span className="campaign-ai-capability-focus">部队搭配 / 战术协同</span>
          </article>
        </div>
      </section>
    </div>
  );
}
