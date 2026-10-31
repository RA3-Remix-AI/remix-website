import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { createArrivalPlayback } from "../lib/arrival-playback";
import { useMediaDeliveryPolicy } from "../hooks/useMediaDeliveryPolicy";
import "../styles/arrival-intro.css";

const arrivalVideos = { desktop: "/materials/intro/agent-arrival-web-180s-v2-desktop-b48269a974.mp4", mobile: "/materials/intro/agent-arrival-web-180s-v2-mobile-0ec7bf70ce.mp4" };
const arrivalPoster = "/materials/intro/agent-arrival-180s-v2-poster-8c67789bc0.jpg";

export function ArrivalIntro({ onClose }: { onClose: () => void }) {
  const delivery = useMediaDeliveryPolicy();
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const skip = useRef<HTMLButtonElement>(null);
  const [requested, setRequested] = useState(false);
  const playback = useRef<ReturnType<typeof createArrivalPlayback> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState("点击播放才加载 180 秒影片，也可直接进入网站。");

  useEffect(() => {
    const element = dialog.current;
    const returnFocus = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    skip.current?.focus();
    document.body.style.overflow = "hidden";
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) setMessage("已遵循减少动态效果偏好。你可以手动播放，或直接进入网站。");
    const reduce = () => { if (preference.matches) { playback.current?.pause(); setMessage("已暂停动态效果，可手动播放。"); } };
    const visibility = () => { if (document.hidden) { playback.current?.pause(); setMessage("已暂停播放，返回后可点击继续。"); } };
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
    const media = video.current;
    if (!delivery.ready || !media) return;
    const controller = createArrivalPlayback(media, delivery.mobile ? arrivalVideos.mobile : arrivalVideos.desktop, state => {
      setRequested(state.requested);
      setFailed(state.failure === "media");
      if (state.failure === "media") setMessage("开场视频暂时不可用，可重试播放或直接进入网站。");
      else if (state.failure === "play") setMessage("未能开始播放，请点击播放重试，或直接进入网站。");
      else if (state.requested) setMessage("正在加载你选择的影片，可随时暂停或进入网站。");
      else setMessage("播放已暂停，可继续播放或进入网站。");
    });
    playback.current = controller;
    return () => {
      controller.destroy();
      playback.current = null;
    };
  }, [delivery.ready, delivery.mobile]);

  useEffect(() => {
    if (!delivery.ready || hasStarted || requested || failed) return;
    if (delivery.conserveData) setMessage("已启用省流模式，点击播放才加载影片，也可直接进入网站。");
  }, [delivery.ready, delivery.conserveData, hasStarted, requested, failed]);

  function togglePlayback() {
    playback.current?.toggle();
  }

  return (
    <dialog ref={dialog} className="arrival-intro" aria-labelledby="arrival-title" aria-describedby="arrival-description" onCancel={event => { event.preventDefault(); onClose(); }}>
      <div className="arrival-screen">
        <img className="arrival-poster" src={arrivalPoster} width="1280" height="720" alt="" />
        <video ref={video} poster={arrivalPoster} muted={muted} playsInline preload="none" aria-label="弈核 Tacticore：180 秒 v2 开场影片" onPlaying={() => { setPlaying(true); setHasStarted(true); setMessage(""); }} onPause={() => setPlaying(false)} onEnded={onClose} onError={() => playback.current?.fail()} />
        <div className="arrival-topline"><span style={{ visibility: hasStarted ? "hidden" : "visible" }}>TACTICORE / 180s · v2</span><button type="button" ref={skip} onClick={onClose}>跳过开场 ↗</button></div>
        <div className={`arrival-caption ${hasStarted && !failed ? "is-playing" : ""}`}>
          <p>Remix-Ai · 弈核 Tacticore</p>
          <h2 id="arrival-title">弈核 Tacticore<br />开场影片。</h2>
          <p id="arrival-description">180 秒 · v2 音效增强版 · 点击播放后加载 · 英文旁白 / 中英字幕。原创分歧时间线演绎，非当前游戏实机。</p>
        </div>
      </div>
      <div className="arrival-controls">
        <div><button type="button" onClick={togglePlayback} disabled={!delivery.ready}>{failed ? "重试播放" : requested ? "暂停" : "播放开场"}</button><button type="button" aria-pressed={!muted} onClick={() => setMuted(value => !value)}>{muted ? "开启声音" : "静音"}</button></div>
        <p role="status">{message || (playing ? (muted ? "静音播放中 · 可开启声音" : "声音已开启") : "播放已暂停，可继续播放或进入网站。")}</p>
        <button type="button" className="button" onClick={onClose}>进入弈核 ↗</button>
      </div>
      <p className="arrival-disclaimer">仅供学习交流 · 非商业、非盈利 · 未经 EA 认可或支持，非 EA 官方项目。<Link to="/copyright" onClick={onClose}>版权声明 ↗</Link></p>
    </dialog>
  );
}
