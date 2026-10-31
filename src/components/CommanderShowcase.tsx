import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { commanders } from "../content/commanders";
import { createCommanderPlayback } from "../lib/commander-playback";
import type { CommanderPlaybackView } from "../lib/commander-playback";
import { createCommanderMediaCache } from "../lib/commander-media";
import { useMediaDeliveryPolicy } from "../hooks/useMediaDeliveryPolicy";
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
  const delivery = useMediaDeliveryPolicy();
  const [dataPlayback, setDataPlayback] = useState(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [inView, setInView] = useState(false);
  const [media, setMedia] = useState<CommanderPlaybackView>({ front: null, outgoing: null, transitioning: false, visible: false, pending: null });
  const firstVideo = useRef<HTMLVideoElement>(null);
  const secondVideo = useRef<HTMLVideoElement>(null);
  const playback = useRef<ReturnType<typeof createCommanderPlayback> | null>(null);
  const section = useRef<HTMLElement>(null);
  const commander = commanders[active]!;
  const dynamicAllowed = motionAllowed && delivery.ready && (!delivery.conserveData || dataPlayback);
  const animate = playing && dynamicAllowed && pageVisible && inView && !suspended;

  useEffect(() => {
    if (!delivery.ready || !firstVideo.current || !secondVideo.current) return;
    const sources = commanders.map(item => delivery.mobile && "videoMobile" in item ? item.videoMobile as string : item.video);
    const cache = createCommanderMediaCache(sources);
    const coordinator = createCommanderPlayback([firstVideo.current, secondVideo.current], sources, setActive, setMedia, window, cache);
    playback.current = coordinator;
    return () => { playback.current = null; coordinator.destroy(); cache.dispose(); };
  }, [delivery.ready, delivery.mobile]);

  useEffect(() => {
    playback.current?.setPolicy({ enabled: dynamicAllowed && pageVisible && inView && !suspended, motionAllowed: dynamicAllowed, playing });
  }, [dynamicAllowed, pageVisible, inView, suspended, playing]);

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
    if (!animate || media.pending !== null) return;
    const timer = window.setTimeout(() => playback.current?.request((active + 1) % commanders.length), 6000);
    return () => window.clearTimeout(timer);
  }, [active, animate, media.pending]);

  return (
    <section id="arrival" ref={section} className={`command-hero commander-hero commander-${commander.theme}`} aria-labelledby="hero-title">
      <div className="command-hero-media" aria-hidden="true">
        <img key={`poster-${commander.id}`} className="command-hero-poster" src={commander.image} alt="" width="1672" height="941" fetchPriority="high" />
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
          <p className="command-hero-description"><strong>三位指挥官，三种战场性格。</strong>铁锤、伊芙琳·卡特与神崎凛，都曾亲历 2035 年浮岛之战。2038 年，他们以人的意志约束 AI，以融合体指挥官的身份重返战场。</p>
          <div className="command-actions">
            <a className="button" href="#commander-client">探索指挥风格 <span aria-hidden="true">↓</span></a>
            <Link className="button button-secondary" to="/stories/world#remix-ai-canon">探索原创故事 <span aria-hidden="true">↗</span></Link>
          </div>
          <span className="command-release-state">弈核 · 独立 Agent 指挥程序 / 红色警戒 3 游戏适配研发中</span>
          {onReplayIntro && <button className="arrival-replay" type="button" onClick={onReplayIntro}>▷ 重播开场影像</button>}
        </div>
        <article className="commander-profile" aria-label={`${commander.name}的指挥特点`}>
          <div className="commander-mobile-media commander-video-stack">
            <img className="commander-mobile-portrait" src={commander.portrait} alt={commander.imageAlt} width="384" height="480" />
            {[firstVideo, secondVideo].map((ref, index) => <video
              key={`buffer-${index}`}
              ref={ref}
              className={`commander-motion${media.front === index ? " is-front" : ""}${media.outgoing === index ? " is-outgoing" : ""}`}
              data-buffer={index}
              muted playsInline preload="none" aria-hidden="true"
              style={{ opacity: media.visible && (media.front === index || media.outgoing === index) ? 1 : 0, zIndex: media.front === index ? 2 : 1, transition: media.front === index && media.transitioning ? "opacity 180ms ease" : "none" }}
            />)}
            <div className="command-hero-vignette commander-video-vignette" style={{ opacity: media.visible ? 1 : 0 }} />
          </div>
          <div className="command-unit commander-dossier" key={`dossier-${commander.id}`}>
            <p className="commander-profile-index"><span>0{active + 1}</span> / COMMANDER PROFILE</p>
            <div className="commander-profile-heading"><h2>{commander.name}</h2><span>{commander.style}</span></div>
            <p className="command-unit-english">{commander.fullName} · {commander.faction} / {commander.english}</p>
            <p className="command-unit-tagline">{commander.tagline}</p>
            <p className="commander-description">{commander.description}</p>
            <ul className="commander-traits" aria-label="性格关键词">{commander.traits.map(trait => <li key={trait}>{trait}</li>)}</ul>
            <p className="command-unit-note">指挥性格设定 · 不限定游戏阵营</p>
          </div>
        </article>
      </div>
      <div className="command-hero-console shell">
        <div className="command-reel-label"><span>选择指挥官</span><small>CHOOSE YOUR COMMANDER</small></div>
        <div className="command-unit-selectors" role="group" aria-label="选择展示的指挥官" aria-busy={media.pending !== null}>
          {commanders.map((item, index) => (
            <button
              type="button"
              className={`command-unit-selector commander-${item.theme} ${index === active ? "is-active" : ""}`}
              key={item.id}
              aria-pressed={index === active}
              onClick={() => playback.current?.request(index)}
              onKeyDown={event => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const next = (index + (event.key === "ArrowRight" ? 1 : -1) + commanders.length) % commanders.length;
                  playback.current?.request(next);
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
        <button type="button" className="command-motion-control" onClick={() => {
          if (delivery.conserveData && !dataPlayback) { setDataPlayback(true); setPlaying(true); }
          else setPlaying(value => !value);
        }} disabled={!motionAllowed || !delivery.ready} aria-label={!motionAllowed ? "已遵循减少动态效果偏好" : !dynamicAllowed ? "节省流量模式：点击启用指挥官动态影像" : playing ? "暂停指挥官影像与轮播" : "播放指挥官影像与轮播"} title={!motionAllowed ? "已遵循减少动态效果偏好" : !dynamicAllowed ? "当前网络默认展示静态海报，点击后加载动态影像" : undefined}>
          <span aria-hidden="true">{playing && dynamicAllowed ? "Ⅱ" : "▷"}</span>
          <small>{!motionAllowed ? "静态" : !dynamicAllowed ? "启用动态" : playing ? "暂停" : "播放"}</small>
        </button>
      </div>
      <div className="command-hero-credit shell"><span>人物为 AI 生成的原创概念视觉 · 剧情身份不代表软件实战能力</span><span>SCROLL TO EXPLORE <b>↓</b></span></div>
    </section>
  );
}
