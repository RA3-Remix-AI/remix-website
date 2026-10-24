import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "../styles/arrival-intro.css";

const arrivalVideo = "/materials/intro/agent-arrival.mp4?v=minimax-133-custom-20261024";
const arrivalPoster = "/materials/intro/agent-arrival-poster.jpg?v=minimax-133-custom-20261024";

export function ArrivalIntro({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const [requested, setRequested] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState("正在准备开场影像，可随时跳过。");

  useEffect(() => {
    const element = dialog.current;
    const returnFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    skip.current?.focus();
    document.body.style.overflow = "hidden";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    setRequested(!preference.matches);
    if (preference.matches) setMessage("已遵循减少动态效果偏好。你可以手动播放，或直接进入网站。");
    const reduce = () => { if (preference.matches) { setRequested(false); setMessage("已暂停动态效果，可手动播放。"); } };
    const visibility = () => setVisible(!document.hidden);
    visibility();
    preference.addEventListener("change", reduce);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      preference.removeEventListener("change", reduce);
      document.removeEventListener("visibilitychange", visibility);
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let cancelled = false;
    if (requested && visible && !failed) {
      void element.play().catch((error: unknown) => {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) return;
        setRequested(false);
        setMessage("暂未自动播放。可点击播放，或直接进入网站。");
      });
    } else element.pause();
    return () => { cancelled = true; element.pause(); };
  }, [requested, visible, failed]);

  function togglePlayback() {
    if (failed) {
      setFailed(false);
      video.current?.load();
      setRequested(true);
    } else setRequested(value => !value);
  }

  return (
    <dialog ref={dialog} className="arrival-intro" aria-labelledby="arrival-title" aria-describedby="arrival-description" onCancel={event => { event.preventDefault(); onClose(); }}>
      <div className="arrival-screen">
        <img className="arrival-poster" src={arrivalPoster} width="1920" height="1080" alt="" />
        <video ref={video} src={arrivalVideo} poster={arrivalPoster} muted={muted} playsInline preload="metadata" aria-label="2026，Agent 指挥官已到达战场：项目开场影像" onPlaying={() => { setPlaying(true); setHasStarted(true); setMessage(""); }} onPause={() => setPlaying(false)} onEnded={onClose} onError={() => { setFailed(true); setRequested(false); setMessage("开场视频暂时不可用，你仍可直接进入网站。"); }} />
        <div className="arrival-topline"><span>TRIAD FRONT / 2026</span><button type="button" ref={skip} onClick={onClose}>跳过开场 ↗</button></div>
        <div className={`arrival-caption ${hasStarted && !failed ? "is-playing" : ""}`}>
          <p>Remix-Ai · 三极战线</p>
          <h2 id="arrival-title">Agent 指挥官<br />已到达战场。</h2>
          <p id="arrival-description">初期研发预告 · 多风格 Agent、并肩作战与模型对抗仍在探索中。</p>
        </div>
      </div>
      <div className="arrival-controls">
        <div><button type="button" onClick={togglePlayback}>{failed ? "重试播放" : requested ? "暂停" : "播放开场"}</button><button type="button" aria-pressed={!muted} onClick={() => setMuted(value => !value)}>{muted ? "开启声音" : "静音"}</button></div>
        <p role="status">{message || (playing ? (muted ? "静音播放中 · 可开启声音" : "声音已开启") : "播放已暂停，可继续播放或进入网站。")}</p>
        <button type="button" className="button" onClick={onClose}>进入三极战线 ↗</button>
      </div>
      <p className="arrival-disclaimer">仅供学习交流 · 非商业、非盈利 · 未经 EA 认可或支持，非 EA 官方项目。<Link to="/copyright" onClick={onClose}>版权声明 ↗</Link></p>
    </dialog>
  );
}
