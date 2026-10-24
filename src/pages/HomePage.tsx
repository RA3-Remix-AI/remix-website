import { Link } from "react-router";
import { visuals } from "../content/visuals";
import { comparisons, gameplay, site } from "../content/site";

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <img
          className="hero-image"
          src={visuals.hero.src}
          alt={visuals.hero.alt}
          width="1440"
          height="1080"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-inner shell">
          <p className="hero-kicker">COMMAND & CONQUER / MOD PROJECT</p>
          <div className="base-badge">
            开发基线 <strong>REMIX 037</strong>
          </div>
          <h1 id="hero-title">
            <span className="hero-title-cn">
              红色警戒 <b>3</b>
            </span>
            <span className="hero-title-en">REMIX</span>
          </h1>
          <p className="hero-tagline">经典战场，新的探索。</p>
          <p className="hero-description">
            基于 Remix 037 继续开发。
            <br />
            从现有玩法出发，探索 AI 与即时战略。
          </p>
          <div className="hero-actions">
            <Link className="button" to="/gameplay">
              了解游戏玩法 <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button-secondary" to="/downloads">
              版本下载 <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <p className="hero-lineage">
            红色警戒 3 <span> / </span> Remix 037 <span> / </span> 本项目
          </p>
        </div>
        <div className="hero-caption">
          <div className="shell">
            <span>背景：原版《红色警戒 3》画面参考，非 Remix 037 截图</span>
            <a href={visuals.sourceUrl} target="_blank" rel="noreferrer">
              Steam 素材来源 ↗<span className="sr-only">（新窗口打开）</span>
            </a>
          </div>
        </div>
      </section>
      <section
        className="panel-section content-section"
        aria-labelledby="difference-title"
      >
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">01 / THE DIFFERENCE</p>
              <h2 id="difference-title">与原版，有何不同？</h2>
            </div>
            <p>先明确基础，再逐项整理改动。</p>
          </div>
          <p className="section-lead">
            《红色警戒 3》是原版游戏，Remix 是其 Mod；本项目选择 Remix 037
            作为继续开发的基础。以下区分已确认的项目方向与仍待核实的内容。
          </p>
          <div className="comparison-wrap">
            <table className="comparison-table">
              <caption className="sr-only">
                原版红色警戒 3 与基于 Remix 037 的本项目对比
              </caption>
              <thead>
                <tr>
                  <th scope="col">维度</th>
                  <th scope="col">原版 RA3</th>
                  <th scope="col">Remix 037 / 本项目</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item) => (
                  <tr key={item.label}>
                    <th scope="row">{item.label}</th>
                    <td>{item.vanilla}</td>
                    <td>{item.remix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="content-note">
            视频标题与合集目录已整理，具体机制尚未逐片核实。视频“更新介绍
            37”不等同于 Mod 版本 037。
          </p>
          <Link className="text-link" to="/devlogs">
            查阅原作者更新记录 ↗
          </Link>
        </div>
      </section>
      <section
        className="panel-section content-section gameplay-preview"
        aria-labelledby="gameplay-title"
      >
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">02 / CORE GAMEPLAY</p>
              <h2 id="gameplay-title">发展、判断、调度。</h2>
            </div>
            <Link className="text-link" to="/gameplay">
              查看玩法说明 ↗
            </Link>
          </div>
          <p className="section-lead">
            以下为即时战略的通用玩法框架，帮助理解游戏；Remix 037
            的专属规则、兵种与数值待正式资料确认。
          </p>
          <div className="material-grid">
            {gameplay.map((item) => (
              <article className="material-card" key={item.number}>
                <p className="eyebrow">{item.number} / RTS</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className="reference-section content-section"
        aria-labelledby="reference-title"
      >
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">03 / VISUAL REFERENCE</p>
              <h2 id="reference-title">重返熟悉的战场</h2>
            </div>
            <p>原版画面参考 · 非 Remix 037 截图</p>
          </div>
          <div className="reference-grid">
            {visuals.screenshots.map((item, index) => (
              <figure className="reference-frame" key={item.src}>
                <img
                  src={item.src}
                  alt={item.alt}
                  width="1440"
                  height="1080"
                  loading="lazy"
                />
                <figcaption>
                  <div>
                    <span className="eyebrow">RED ALERT 3 / 0{index + 1}</span>
                    <strong>{item.title}</strong>
                  </div>
                  <a href={visuals.sourceUrl} target="_blank" rel="noreferrer">
                    原版素材来源 ↗
                    <span className="sr-only">（新窗口打开）</span>
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
      <section className="shell content-section">
        <div className="section-grid">
          <p className="section-label">
            <span>04 / EXPLORE</span>继续了解
          </p>
          <div>
            <h2>
              游戏的现在，
              <br />
              与计划中的未来。
            </h2>
            <div className="portal-links">
              {site.navigation.slice(2).map((item) => (
                <Link key={item.href} to={item.href}>
                  {item.label}
                  <span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <p className="content-note">
              AI 能力仍在规划中。下载地址将按版本补充。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
