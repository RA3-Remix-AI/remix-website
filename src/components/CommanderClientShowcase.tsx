import { useEffect, useRef, useState } from "react";
import { FactionMark } from "./FactionMark";
import { NavIcon } from "./NavIcon";
import type { FactionKey } from "../content/showcase";
import "../styles/commander-client.css";

const profiles: { name: string; code: string; faction: FactionKey; focus: string; tactic: string; orders: string[]; weights: number[] }[] = [
  { name: "突击", code: "VANGUARD", faction: "soviet", focus: "集中突破 / 争夺主动", tactic: "集结正面力量，等待协同窗口", orders: ["侦察前沿交汇点", "评估正面压力与支援距离", "选择集中突破的交战窗口", "示意主力集结，支援跟进", "根据损耗与阵线变化重估"], weights: [82, 48, 62] },
  { name: "守备", code: "SENTINEL", faction: "allied", focus: "稳固阵线 / 保留预备队", tactic: "观察来袭方向，建立交叉支援", orders: ["整理已侦察的进攻方向", "评估基地与资源点风险", "优先保护关键生产与补给", "示意预备队接应防线", "观察威胁转移并调整驻防"], weights: [42, 88, 56] },
  { name: "机动", code: "PATHFINDER", faction: "empire", focus: "侦察迂回 / 局部优势", tactic: "寻找侧翼空隙，避免正面消耗", orders: ["侦察侧翼通路与交汇点", "评估响应距离和撤离路线", "选择局部兵力优势目标", "示意机动编队侧翼调度", "根据新情报切换目标"], weights: [60, 44, 91] },
];
const phases = ["感知", "判断", "决策", "调度", "反馈"];

export function CommanderClientShowcase() {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const windowElement = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const profile = profiles[selected]!;

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 900px), (max-height: 560px)");
    const canObserve = typeof IntersectionObserver !== "undefined";
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!track.current || !stage.current || !windowElement.current) return;
      // Only measure the natural track and untransformed stage, never the rotating window.
      const top = track.current.getBoundingClientRect().top;
      const targetTop = Math.max(24, window.innerHeight - stage.current.offsetHeight);
      if (!canObserve) setVisible(top < window.innerHeight && top + track.current.offsetHeight > 0);
      const start = window.innerHeight * .88;
      const progress = motion.matches || compact.matches ? 1 : Math.max(0, Math.min(1, (start - top) / Math.max(1, start - targetTop)));
      const remainder = 1 - progress;
      windowElement.current.style.transform = progress === 1 ? "none" : `translate3d(0,${remainder * 50}px,0) rotateX(${remainder * 20}deg) rotateY(${remainder * -12}deg) scale(${1 - remainder * .16})`;
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const preference = () => { setReduced(motion.matches); schedule(); };
    const visibility = () => setPageVisible(!document.hidden);
    preference(); visibility();
    const observer = canObserve ? new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: .1 }) : null;
    if (track.current) observer?.observe(track.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    compact.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame); observer?.disconnect();
      window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", preference); compact.removeEventListener("change", schedule);
    };
  }, []);

  useEffect(() => {
    if (paused || reduced || !visible || !pageVisible) return;
    const timer = window.setInterval(() => setPhase(value => (value + 1) % phases.length), 2400);
    return () => window.clearInterval(timer);
  }, [paused, reduced, visible, pageVisible]);

  return (
    <section id="commander-client" className="commander-showcase" aria-labelledby="client-showcase-title">
      <div className="shell client-story-heading">
        <div><p className="campaign-kicker"><span /> TACTICORE / RA3 ADAPTER</p><h2 id="client-showcase-title">下一位对手，<br /><em>也可以成为战友。</em></h2></div>
        <div><p>弈核 Tacticore，独立的 Agent 指挥程序。<br />从观察战况，到判断、调度与协同。</p><p>React + Tauri 桌面已实现备战配置、指挥官偏好和本机电台素材管理，真实游戏宿主接线待完成。下方保留战术推演的交互概念；本周进度展示当前客户端的实际界面。</p><a className="text-link" href="#tacticore-progress">查看实际桌面与本周进度 ↓</a></div>
      </div>
      <div ref={track} className="client-scroll-track shell">
        <div ref={stage} className="client-stage">
          <div ref={windowElement} className={`client-window faction-${profile.faction}`}>
            <div className="client-titlebar"><span className="client-app-emblem"><NavIcon name="command" /></span><strong>弈核 TACTICORE <span>客户端概念预览</span></strong><span className="client-build">CONCEPT / 0.1</span><div className="client-window-controls" aria-hidden="true"><i /><i /><i /></div></div>
            <div className="client-workspace">
              <aside className="client-sidebar" aria-label="指挥官演示配置">
                <p className="client-micro">COMMANDER PROFILES</p><h3>选择指挥风格</h3>
                <div className="client-profile-options" role="group" aria-label="切换离线演示配置">
                  {profiles.map((item, index) => <button type="button" key={item.code} className={`client-profile faction-${item.faction}`} aria-pressed={selected === index} onClick={() => { setSelected(index); setPhase(0); }}><FactionMark faction={item.faction} /><span><strong>{item.name}</strong><small>{item.code}</small></span><i aria-hidden="true" /></button>)}
                </div>
                <div className="client-future-slot"><span aria-hidden="true">＋</span><p>多 Agent 协作<small>后续规划 · 尚未实装</small></p></div>
                <p className="client-sidebar-foot">本地交互演示<br /><span>不发送网络指令</span></p>
              </aside>
              <div className="client-tactical">
                <div className="client-panel-heading"><div><p className="client-micro">TACTICAL SANDBOX</p><h3>战术推演台</h3></div><span className="client-offline"><i /> OFFLINE</span></div>
                <div className={`client-map client-map-${selected}`} aria-label={`${profile.name}配置的概念战术示意`}>
                  <div className="client-map-grid" /><div className="client-map-zone zone-a" /><div className="client-map-zone zone-b" /><span className="client-map-coordinate">SECTOR 07 / 示意地形</span>
                  <svg viewBox="0 0 500 240" preserveAspectRatio="none" aria-hidden="true" className="client-map-routes"><path className="client-route-base" d="M90 180 170 145 265 145 345 75 420 75"/><path className="client-route-order" d={selected === 0 ? "M90 180 170 145 265 145 345 75" : selected === 1 ? "M90 180 170 145 215 190 90 180" : "M90 180 95 80 265 40 345 75"}/></svg>
                  <span className="client-map-marker marker-base"><i />基地<small>己方</small></span><span className="client-map-marker marker-front"><i />交汇点<small>已侦察</small></span><span className="client-map-marker marker-scout"><i />侧翼<small>待观察</small></span>
                  <div className="client-map-caption"><span>当前推演</span><strong>{profile.tactic}</strong></div>
                </div>
                <div className="client-decision-chain" aria-label="指挥流程演示">{phases.map((name, index) => <span key={name} className={index === phase ? "is-current" : ""}><b>0{index + 1}</b>{name}</span>)}</div>
                <div className="client-doctrine"><p><span>风格倾向</span><strong>{profile.focus}</strong></p><div>{["施压", "守备", "机动"].map((label, index) => <span key={label}><small>{label}</small><i><b style={{ width: `${profile.weights[index]}%` }} /></i></span>)}</div></div>
              </div>
              <aside className="client-log" aria-label="模拟执行日志">
                <div className="client-panel-heading"><div><p className="client-micro">DECISION TRACE</p><h3>推演记录</h3></div><span className="client-log-label">模拟</span></div>
                <ol>{profile.orders.map((order, index) => <li key={`${selected}-${index}`} className={index === phase ? "is-current" : ""}><span>0{index + 1} / {phases[index]}</span><p>{order}</p></li>)}</ol>
                <div className="client-execution-state"><i /> 指令未执行<small>等待未来游戏接入</small></div>
              </aside>
            </div>
            <div className="client-statusbar"><span><i /> 研发概念 · 离线演示</span><span>REMIX 037 BASELINE</span><button type="button" onClick={() => setPaused(value => !value)} disabled={reduced} aria-pressed={paused || reduced}>{reduced ? "减少动态 · 静态展示" : paused ? "▷ 继续演示" : "Ⅱ 暂停演示"}</button></div>
          </div>
        </div>
      </div>
      <p className="shell client-showcase-note">演示配置与记录仅用于说明产品方向，非实时游戏状态；多 Agent 协作、并肩作战与通用模型对抗仍处探索阶段。</p>
    </section>
  );
}
