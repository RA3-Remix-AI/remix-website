import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { commanders } from "../content/commanders";
import "../styles/commander-showcase.css";

export function observeShowcaseVisibility(element: Element, Observer: typeof IntersectionObserver | undefined, onChange: (visible: boolean) => void) {
  if (typeof Observer !== "function") { onChange(true); return () => {}; }
  let disposed = false;
  const observer = new Observer(entries => {
    if (disposed) return;
    for (const entry of entries) if (entry.target === element) onChange(entry.isIntersecting);
  }, { threshold: 0 });
  observer.observe(element);
  return () => { disposed = true; observer.disconnect(); };
}

export function CommanderShowcase({ suspended = false, onReplayIntro }: { suspended?: boolean; onReplayIntro?: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const section = useRef<HTMLElement>(null);
  const commander = commanders[active]!;
  const animate = playing && motionAllowed && pageVisible && inView && !suspended;

  useEffect(() => {
    if (!section.current) return;
    return observeShowcaseVisibility(section.current, window.IntersectionObserver, setInView);
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionAllowed(!preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!animate) return;
    const timer = window.setTimeout(() => setActive(value => (value + 1) % commanders.length), 8000);
    return () => window.clearTimeout(timer);
  }, [active, animate]);

  return (
    <section id="arrival" ref={section} className={`command-hero commander-hero commander-${commander.theme}`} aria-labelledby="hero-title">
      <div className="command-hero-media" aria-hidden="true">
        <img key={commander.id} className="command-hero-poster" src={commander.image} alt="" width="1672" height="941" fetchPriority="high" />
        <div className="command-hero-vignette" />
        <div className="command-hero-grain" />
        {animate && <div key={`sweep-${commander.id}`} className="command-signal-sweep" />}
      </div>
      <div className="command-hero-topline shell">
        <span><i /> TACTICORE / COMMANDER PROFILES</span>
        <span>不同的判断 <b>→</b> 同一片战场</span>
      </div>
      <div className="command-hero-body shell">
        <div className="command-hero-copy">
          <p className="campaign-kicker"><span /> 弈核 TACTICORE · Agent 指挥官</p>
          <h1 id="hero-title">指挥官，<br /><em>已到达战场。</em></h1>
          <p className="command-hero-brand">Remix<span>-Ai</span></p>
          <p className="command-hero-description"><strong>三位指挥官，三种战场性格。</strong>铁锤的突破、堡垒的经营、幽灵的机动。认识弈核的不同指挥倾向，选择与你合拍的战友，或值得迎战的对手。</p>
          <div className="command-actions">
            <a className="button" href="#commander-client">探索指挥风格 <span aria-hidden="true">↓</span></a>
            <Link className="button button-secondary" to="/roadmap">了解弈核计划 <span aria-hidden="true">↗</span></Link>
          </div>
          <span className="command-release-state">弈核 · 独立 Agent 指挥程序 / 红色警戒 3 游戏适配研发中</span>
          {onReplayIntro && <button className="arrival-replay" type="button" onClick={onReplayIntro}>▷ 重播开场影像</button>}
        </div>
        <article className="commander-profile" key={commander.id} aria-label={`${commander.name}的指挥特点`}>
          <img className="commander-mobile-portrait" src={commander.portrait} alt={commander.imageAlt} width="384" height="480" />
          <div className="command-unit commander-dossier">
            <p className="commander-profile-index"><span>0{active + 1}</span> / COMMANDER PROFILE</p>
            <div className="commander-profile-heading"><h2>{commander.name}</h2><span>{commander.style}</span></div>
            <p className="command-unit-english">{commander.english}</p>
            <p className="command-unit-tagline">{commander.tagline}</p>
            <p className="commander-description">{commander.description}</p>
            <ul className="commander-traits" aria-label="性格关键词">{commander.traits.map(trait => <li key={trait}>{trait}</li>)}</ul>
            <p className="command-unit-note">指挥性格设定 · 不限定游戏阵营</p>
          </div>
        </article>
      </div>
      <div className="command-hero-console shell">
        <div className="command-reel-label"><span>选择指挥官</span><small>CHOOSE YOUR COMMANDER</small></div>
        <div className="command-unit-selectors" role="group" aria-label="选择展示的指挥官">
          {commanders.map((item, index) => (
            <button
              type="button"
              className={`command-unit-selector commander-${item.theme} ${index === active ? "is-active" : ""}`}
              key={item.id}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              onKeyDown={event => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const next = (index + (event.key === "ArrowRight" ? 1 : -1) + commanders.length) % commanders.length;
                  setActive(next);
                  event.currentTarget.parentElement?.querySelectorAll("button")[next]?.focus();
                }
              }}
            >
              <span className="command-selector-number">0{index + 1}</span>
              <img className="command-selector-portrait" src={item.portrait} width="48" height="60" alt="" />
              <span><small>{item.english}</small><strong>{item.name}</strong><span className="commander-selector-style">{item.style}</span></span>
              {index === active && <i key={`${active}-${animate}`} className={animate ? "reel-progress is-running" : "reel-progress"} />}
            </button>
          ))}
        </div>
        <button type="button" className="command-motion-control" onClick={() => setPlaying(value => !value)} disabled={!motionAllowed} aria-label={playing && motionAllowed ? "暂停指挥官轮播" : motionAllowed ? "播放指挥官轮播" : "已遵循减少动态效果偏好"} title={motionAllowed ? undefined : "已遵循减少动态效果偏好"}>
          <span aria-hidden="true">{playing && motionAllowed ? "Ⅱ" : "▷"}</span>
          <small>{!motionAllowed ? "静态" : playing ? "暂停" : "播放"}</small>
        </button>
      </div>
      <div className="command-hero-credit shell"><span>人物为 AI 生成的原创概念视觉 · 指挥特点为性格设计倾向</span><span>SCROLL TO EXPLORE <b>↓</b></span></div>
    </section>
  );
}
