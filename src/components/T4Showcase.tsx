import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { t4Showcase } from "../content/showcase";
import { FactionMark } from "./FactionMark";

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

export function T4Showcase({ suspended = false, onReplayIntro }: { suspended?: boolean; onReplayIntro?: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const section = useRef<HTMLElement>(null);
  const unit = t4Showcase[active]!;
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
    const timer = window.setTimeout(() => {
      setReady(false);
      setFailed(false);
      setActive((value) => (value + 1) % t4Showcase.length);
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [active, animate]);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    if (animate && !failed) {
      element.muted = true;
      void element.play().catch((error: unknown) => {
        // Pausing or replacing a loading video can reject its pending play().
        // Only a current, non-interrupted attempt may trigger the fallback.
        if (
          cancelled ||
          (typeof error === "object" &&
            error !== null &&
            "name" in error &&
            error.name === "AbortError")
        ) return;
        setFailed(true);
      });
    } else {
      element.pause();
    }
    return () => { cancelled = true; element.pause(); };
  }, [active, animate, failed]);

  function selectUnit(index: number) {
    if (index === active) return;
    setReady(false);
    setFailed(false);
    setActive(index);
  }

  return (
    <section id="arrival" ref={section} className={`command-hero faction-${unit.factionKey}`} aria-labelledby="hero-title">
      <div className="command-hero-media" aria-hidden="true">
        <img className="command-hero-poster" src={unit.poster} alt="" width="2560" height="1040" fetchPriority="high" />
        {motionAllowed && !failed && (
          <video
            key={unit.id}
            ref={video}
            className={ready ? "is-ready" : ""}
            src={unit.video}
            poster={unit.poster}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setReady(true)}
            onError={() => setFailed(true)}
          />
        )}
        <div className="command-hero-vignette" />
        <div className="command-hero-grain" />
        {animate && <div key={`sweep-${unit.id}`} className="command-signal-sweep" />}
      </div>
      <div className="command-hero-topline shell">
        <span><i /> RED ALERT 3 / REMIX PROJECT</span>
        <span>BASE 037 <b>→</b> Remix-Ai</span>
      </div>
      <div className="command-hero-body shell">
        <div className="command-hero-copy">
          <p className="campaign-kicker"><span /> 2026 / 弈核 TACTICORE · Agent 指挥官</p>
          <h1 id="hero-title">指挥官，<br /><em>已到达战场。</em></h1>
          <p className="command-hero-brand">Remix<span>-Ai</span></p>
          <p className="command-hero-description"><strong>弈核 Tacticore / 独立 Agent 指挥程序</strong>在红色警戒 3 探索指挥与协同，Remix-Ai 是基于 Remix 037 的游戏内容适配版本。弈核仍在初期研发，未来尝试并肩作战与模型对抗。</p>
          <div className="command-actions">
            <a className="button" href="#tacticore">认识弈核指挥官 <span aria-hidden="true">↓</span></a>
            <Link className="button button-secondary" to="/downloads">获取游戏 <span aria-hidden="true">↓</span></Link>
          </div>
          <span className="command-release-state">Remix-Ai · 初期研发 / 多 Agent 与通用模型对抗为未来探索</span>
          {onReplayIntro && <button className="arrival-replay" type="button" onClick={onReplayIntro}>▷ 重播开场影像</button>}
        </div>
        <div className="command-unit" key={unit.id}>
          <div className="command-unit-insignia"><FactionMark faction={unit.factionKey} /><span><strong>{unit.faction}</strong><small>{unit.domain}</small></span></div>
          <p className="command-unit-tier">TIER <strong>04</strong><span>REMIX 原作典藏</span></p>
          <h2>{unit.name}</h2>
          <p className="command-unit-english">{unit.english}</p>
          <p className="command-unit-tagline">{unit.tagline}</p>
          <p className="command-unit-note">{unit.note}</p>
          <Link className="command-unit-link" to={unit.destination}>查看单位档案 <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="command-hero-console shell">
        <div className="command-reel-label"><span>重装力量</span><small>T4 SHOWCASE</small></div>
        <div className="command-unit-selectors" role="group" aria-label="选择展示的 T4 单位">
          {t4Showcase.map((item, index) => (
            <button
              className={`command-unit-selector faction-${item.factionKey} ${index === active ? "is-active" : ""}`}
              key={item.id}
              aria-pressed={index === active}
              onClick={() => selectUnit(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const next = (index + (event.key === "ArrowRight" ? 1 : -1) + t4Showcase.length) % t4Showcase.length;
                  selectUnit(next);
                  const buttons = event.currentTarget.parentElement?.querySelectorAll("button");
                  buttons?.[next]?.focus();
                }
              }}
            >
              <span className="command-selector-number">0{index + 1}</span>
              <FactionMark faction={item.factionKey} />
              <img className="command-selector-portrait" src={item.portrait} width="72" height="72" alt="" />
              <span><small>{item.faction} / T4</small><strong>{item.name}</strong></span>
              {index === active && <i key={`${active}-${animate}`} className={animate ? "reel-progress is-running" : "reel-progress"} />}
            </button>
          ))}
        </div>
        <button className="command-motion-control" onClick={() => setPlaying(!playing)} disabled={!motionAllowed} aria-label={playing && motionAllowed ? "暂停动态展示" : motionAllowed ? "播放动态展示" : "已遵循减少动态效果偏好"} title={motionAllowed ? undefined : "已遵循减少动态效果偏好"}>
          <span aria-hidden="true">{playing && motionAllowed ? "Ⅱ" : "▷"}</span>
          <small>{!motionAllowed ? "静态" : playing ? "暂停" : "播放"}</small>
        </button>
      </div>
      <div className="command-hero-credit shell"><span>影像选自 knight-vvv 的 Remix 宣传片 · 非 AI版实机画面</span><span>SCROLL TO EXPLORE <b>↓</b></span></div>
    </section>
  );
}
