import { Link } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { gameplay } from "../content/site";

export function GameplayPage() {
  return (
    <>
      <PageIntro index="01 / GAMEPLAY" title="游戏玩法">
        <p>以即时战略的核心循环为入口，逐步认识基于 Remix 037 的游戏内容。</p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell">
          <p className="content-note first-note">
            内容范围：下列说明是 RA3
            所属即时战略类型的通用玩法框架，并非已核实的 Remix 037 新功能。
          </p>
          <div className="material-grid">
            {gameplay.map((item) => (
              <article className="material-card" key={item.number}>
                <p className="eyebrow">{item.number}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="editorial-block">
            <p className="eyebrow">REMIX 037 / TO BE DOCUMENTED</p>
            <h2>专属玩法，等待资料确认。</h2>
            <p>
              兵种差异、科技与生产规则、模式、平衡性及操作说明将在拿到对应版本资料后补充。原作者的视频合集可作为后续核对入口。
            </p>
            <Link className="text-link" to="/videos">
              进入视频档案 ↗
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
