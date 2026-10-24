import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import "../styles/tacticore.css";

const modes = [
  {
    name: "并肩作战", english: "COOPERATIVE", state: "协同推演", signal: "协作优先",
    description: "设计目标：读懂你的意图与战场变化，成为能够分工、接应并调整计划的队友。",
    priorities: [
      { title: "共享判断", text: "结合可见情报与队友意图，建立对战局的共同理解。" },
      { title: "协同分工", text: "围绕侦察、发展与支援分配职责，减少重复投入。" },
      { title: "及时接应", text: "依据战况反馈调整行动，寻找支援和接替的时机。" },
    ],
  },
  {
    name: "对抗演练", english: "ADVERSARIAL", state: "对抗推演", signal: "应变优先",
    description: "设计目标：以判断、时机与调度形成挑战，让对手的每次变化都值得重新思考。",
    priorities: [
      { title: "研判对手", text: "依据已侦察信息分析威胁、发展节奏与可能的意图。" },
      { title: "权衡机会", text: "比较资源投入、兵力组合与进退风险，选择交战窗口。" },
      { title: "修正策略", text: "根据行动结果重新推演，尝试跳出僵化的固定应对。" },
    ],
  },
];

const phases = [
  { name: "感知", english: "PERCEPTION", position: "top", intents: ["整理可见战况与队友意图，先建立共同的战场判断。", "结合侦察到的兵力与动向，辨别眼前威胁和信息缺口。"] },
  { name: "推演", english: "REASONING", position: "right", intents: ["比较分工与支援路线，推演协同行动可能带来的变化。", "权衡发展、兵力组合与交战风险，寻找值得把握的窗口。"] },
  { name: "决策", english: "DECISION", position: "bottom", intents: ["明确这一轮行动的优先级，让资源投入与队友计划相互配合。", "在进攻、守备与转移之间作出取舍，把判断转化为战术意图。"] },
  { name: "协同", english: "COORDINATION", position: "left", intents: ["协调部队接应与任务交接，再根据战况反馈重新判断。", "调度部队落实战术，根据行动结果修正下一轮计划。"] },
];

function TacticoreCore({ mode, phase }: { mode: number; phase: number }) {
  return <div className={`tacticore-core ${mode === 0 ? "is-cooperative" : "is-adversarial"}`} aria-hidden="true">
    <div className="tacticore-core-grid" /><div className="tacticore-core-depth" />
    <svg viewBox="0 0 480 480" className="tacticore-core-svg" fill="none">
      <defs><radialGradient id="tacticore-core-glow"><stop stopColor="#d9a954" stopOpacity=".22" /><stop offset="1" stopColor="#d9a954" stopOpacity="0" /></radialGradient></defs>
      <circle cx="240" cy="240" r="224" fill="url(#tacticore-core-glow)" />
      <g className="tacticore-orbits" stroke="currentColor">
        <circle cx="240" cy="240" r="196" strokeOpacity=".16" />
        <circle cx="240" cy="240" r="165" strokeOpacity=".36" strokeDasharray="2 9" />
        <path d="M240 44a196 196 0 0 1 196 196M240 436A196 196 0 0 1 44 240" strokeWidth="2" />
        <path d="M240 94 366 167v146L240 386l-126-73V167Z" strokeOpacity=".4" />
        <path d="M104 104 376 376M376 104 104 376" strokeOpacity=".13" />
      </g>
      <g className="tacticore-connections" stroke="currentColor" strokeWidth="1.5">
        <path d={mode === 0 ? "M82 240 146 240 192 212M398 240 334 240 288 268M240 82 240 146 268 192M240 398 240 334 212 288" : "M82 240 132 240 132 132 212 192M398 240 348 240 348 348 268 288M240 82 240 138 288 212M240 398 240 342 192 268"} />
        <path d="m240 170 61 35v70l-61 35-61-35v-70Z" fill="#181c17" strokeWidth="2" />
        <path d="m240 187 46 27v52l-46 27-46-27v-52Z" strokeOpacity=".4" />
        <path d="M76 234h12v12H76Zm316 0h12v12h-12ZM234 76h12v12h-12Zm0 316h12v12h-12Z" fill="#d1b172" />
      </g>
      <g stroke="currentColor" strokeOpacity=".4"><path d="M33 92V33h59m296 0h59v59M33 388v59h59m296 0h59v-59" /><path d="M28 240h18m388 0h18M240 28v18m0 388v18" /></g>
    </svg>
    <div className="tacticore-core-center"><strong>弈</strong><span>TACTICORE</span></div>
    {phases.map((item, index) => <span key={item.name} className={`tacticore-core-label label-${item.position}${phase === index ? " is-current" : ""}`}>{item.name}<small>{item.english}</small></span>)}
    <span className="tacticore-core-mode">{modes[mode]!.state}<small>CONCEPT SYSTEM</small></span>
  </div>;
}

export function TacticoreSection() {
  const [mode, setMode] = useState(0);
  const current = modes[mode]!;
  const [phase, setPhase] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const manualProgressRef = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const compact = window.matchMedia("(max-width: 900px), (max-height: 650px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const cinematic = !compact.matches && !reduced.matches;
      track.dataset.cinematic = String(cinematic);
      if (!cinematic) {
        track.style.removeProperty("--tacticore-tilt-x");
        track.style.removeProperty("--tacticore-tilt-y");
        track.style.removeProperty("--tacticore-depth");
        track.style.removeProperty("--tacticore-scale");
        track.style.removeProperty("--tacticore-orbit");
        return;
      }
      // A real content-box height gives sticky its travel; padding cannot.
      const stageHeight = stage.offsetHeight;
      track.style.setProperty("--tacticore-stage-height", `${stageHeight}px`);
      // Measure the untransformed track, never the moving core.
      const top = track.getBoundingClientRect().top;
      const viewport = window.innerHeight;
      const travel = Math.max(1, track.offsetHeight - stageHeight);
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 24;
      const entry = viewport * .78;
      const progress = Math.max(0, Math.min(1, (entry - top) / (entry - stickyTop + travel)));
      const fullyVisibleTop = Math.max(stickyTop, viewport - stageHeight);
      const approach = Math.max(0, Math.min(1, (entry - top) / Math.max(1, entry - fullyVisibleTop)));
      const eased = 1 - (1 - approach) ** 3;
      progressRef.current = progress;
      track.style.setProperty("--tacticore-tilt-x", `${(1 - eased) * 36}deg`);
      track.style.setProperty("--tacticore-tilt-y", `${(1 - eased) * -28}deg`);
      track.style.setProperty("--tacticore-depth", `${(1 - eased) * -140}px`);
      track.style.setProperty("--tacticore-scale", `${.75 + eased * .25}`);
      track.style.setProperty("--tacticore-orbit", `${-35 + progress * 85}deg`);
      // A deliberate phase selection wins until a meaningful new scroll gesture.
      if (manualProgressRef.current !== null && Math.abs(progress - manualProgressRef.current) > .13) manualProgressRef.current = null;
      if (manualProgressRef.current === null) setPhase(Math.min(3, Math.floor(progress * 4)));
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    compact.addEventListener("change", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      compact.removeEventListener("change", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  const selectPhase = (index: number) => {
    manualProgressRef.current = progressRef.current;
    setPhase(index);
  };
  return <section id="tacticore" className={`tacticore-section tacticore-mode-${mode}`} aria-labelledby="tacticore-title">
    <div className="shell tacticore-stage">
      <div className="tacticore-cinematic-track" ref={trackRef}>
      <div className="tacticore-cinematic-stage" ref={stageRef}>
      <div className="tacticore-copy">
        <p className="campaign-kicker"><span /> INDEPENDENT AGENT COMMAND SYSTEM</p>
        <h2 id="tacticore-title">弈核 <span>TACTICORE</span></h2>
        <p className="tacticore-tagline">与你并肩，也与你交锋。</p>
        <p className="tacticore-intent">强大的 Agent 指挥官，从读懂战场开始。</p>
        <p className="tacticore-description">弈核是一套独立的 Agent 指挥系统，围绕感知、推演、决策与协同展开研发。我们的设计目标，是让行动有判断，让协作有章法。</p>
        <span className="tacticore-development"><i /> 初期研发 · 指挥能力验证中</span>
        <div className="tacticore-mode-switch" role="group" aria-label="切换弈核概念模式">{modes.map((item, index) => <button type="button" key={item.english} aria-pressed={mode === index} onClick={() => setMode(index)}><span aria-hidden="true">0{index + 1}</span>{item.name}</button>)}</div>
        <div className="tacticore-actions"><Link className="button" to="/roadmap">探索弈核研发方向 ↗</Link><a className="text-link" href="#commander-client">查看弈核客户端 ↓</a></div>
      </div>
      <div className="tacticore-command-stage">
        <div className="tacticore-scene-heading"><span>指挥推演 / 概念流程</span><small>SCROLL TO EXPLORE <i aria-hidden="true">↓</i></small></div>
        <div className="tacticore-core-perspective"><TacticoreCore mode={mode} phase={phase} /></div>
        <div className="tacticore-phase-selector" role="group" aria-label="查看指挥推演阶段">{phases.map((item, index) => <button type="button" key={item.name} aria-pressed={phase === index} onClick={() => selectPhase(index)}><small>0{index + 1}</small><span>{item.name}</span></button>)}</div>
        <div className="tacticore-phase-intent"><span>0{phase + 1} / {phases[phase]!.english}</span><p key={`${mode}-${phase}`}>{phases[phase]!.intents[mode]}</p><small>策略概念示意 · 未连接实战</small></div>
      </div>
      </div>
      </div>
      <div className="tacticore-mode-panel">
        <div className="tacticore-mode-heading"><div><p>两种关系，同一个指挥核心。</p><span>当前概念模式：{current.name} · {current.signal}</span></div><span className="tacticore-mode-designation">{current.english}</span></div>
        <div className="tacticore-strategy" key={mode}>
          <div className="tacticore-strategy-intro"><span>{current.english} / {current.signal}</span><p>{current.description}</p></div>
          <div className="tacticore-priorities">{current.priorities.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </div>
      </div>
      <div className="tacticore-relationships" aria-label="软件与游戏版本关系"><div><strong>弈核 Tacticore</strong><span>独立 Agent 指挥程序（计划开源）</span></div><i aria-hidden="true">→</i><div><strong>Remix-Ai</strong><span>基于 Remix 037 的游戏内容适配版本</span></div></div>
      <p className="tacticore-adapter-note">弈核计划作为独立程序开源，仓库与发布信息后续公布。未来计划通过适配器探索更多 Mod 与游戏，跨项目兼容尚待研发验证。</p>
    </div>
  </section>;
}
