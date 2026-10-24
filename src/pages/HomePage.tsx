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
            本版本 <strong>REMIX-A</strong>
          </div>
          <h1 id="hero-title">
            <span className="hero-title-cn">
              红色警戒 <b>3</b>
            </span>
            <span className="hero-title-en">REMIX-A</span>
          </h1>
          <p className="hero-tagline">熟悉的轮廓，新的战场分工。</p>
          <p className="hero-description">
            基于 Remix 037 继续开发。
            <br />
            重整单位、协议与要塞，让每一次选择都有意义。
          </p>
          <div className="hero-actions">
            <Link className="button" to="/gameplay">
              查看单位与改造 <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button-secondary" to="/downloads">
              版本下载 <span aria-hidden="true">↓</span>
            </Link>
          </div>
          <p className="hero-lineage">
            红色警戒 3 <span> / </span> Remix 037 <span> / </span> Remix-A
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
            <p>037 原有内容与 A 版改造，分别呈现。</p>
          </div>
          <p className="section-lead">
            《红色警戒 3》是原版游戏，Remix 037 提供了丰富的扩展单位与视觉资产。
            本版本为 Remix-A，在已有素材基础上重新设计作战职责，当前仍在开发与实机验证。
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
                  <th scope="col">Remix 037</th>
                  <th scope="col">Remix-A 本版本</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item) => (
                  <tr key={item.label}>
                    <th scope="row">{item.label}</th>
                    <td>{item.vanilla}</td>
                    <td>{item.original}</td>
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
              查看单位与数据 ↗
            </Link>
          </div>
          <p className="section-lead">
            五个常规单位与钢铁堡垒、超级要塞已整理为改造对照；
            037 原始预算与 Remix-A 当前数值分别说明，支持按阵营与职责搜索。
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
      <section className="panel-section content-section" aria-labelledby="version-title">
        <div className="shell">
          <div className="section-heading"><div><p className="eyebrow">03 / TWO VERSIONS</p><h2 id="version-title">从 037，到 Remix-A。</h2></div><p>先认识原有内容，再读本版改造</p></div>
          <div className="version-portals">
            <Link className="version-portal" to="/remix-037">
              <img src="/materials/remix037/models/GigaFortress.png" alt="037 超级要塞模型离线预览" width="512" height="512" loading="lazy" />
              <div><p className="eyebrow">BASE / REMIX 037</p><h3>原有内容图鉴</h3><p>29 条单位与形态档案，收录原始肖像、定位和基础数值。从宙斯、磁爆坦克到超级要塞，认识原有阵容。</p><span className="text-link">进入 037 图鉴 ↗</span></div>
            </Link>
            <Link className="version-portal" to="/gameplay">
              <img src="/materials/remix037/models/IronFortress.png" alt="Remix-A 钢铁堡垒所用 037 模型底材参考" width="512" height="512" loading="lazy" />
              <div><p className="eyebrow">CURRENT / REMIX-A</p><h3>本版本的改造</h3><p>七种单位改造前后对照、三阵营规则与战术流程。看懂驻军平台、专职防空和定向攻坚的新分工。</p><span className="text-link">查看 Remix-A 改动 ↗</span></div>
            </Link>
          </div>
          <p className="content-note">上图为 037 原始模型离线预览与 A 版底材参考，均非 A 版实机截图；原有视觉资产不宣称原创。</p>
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
