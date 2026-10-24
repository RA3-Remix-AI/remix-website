import { PageIntro } from "../components/PageIntro";
import { copyright } from "../content/copyright";

export function CopyrightPage() {
  return (
    <>
      <PageIntro index="RIGHTS / NON-COMMERCIAL" title="版权与非商业声明">
        <p>
          Remix-Ai 基于 Remix 037 进行学习、交流与研究，是非商业、非盈利项目。
        </p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell copyright-document">
          <div className="copyright-official-notice">
            <p>{copyright.eaNotice}</p>
            <p>本项目未经 EA 认可或支持，非 EA 官方项目。</p>
          </div>
          <section>
            <h2>Remix 内容归属</h2>
            <p>
              Remix / Remix 037 原创 Mod
              内容的相关著作权归原作者及各贡献者所有。公开发布者为{" "}
              <a href={copyright.creatorUrl} target="_blank" rel="noreferrer">
                knight-vvv ↗<span className="sr-only">（新窗口打开）</span>
              </a>
              ；各篇文案、模型、图像及其他贡献保留对应作者的署名，不将全部 Remix
              内容归为单一个人所有。
            </p>
          </section>
          <section>
            <h2>原游戏与第三方权利</h2>
            <p>
              《红色警戒 3》、Command &amp; Conquer、Red
              Alert，以及原游戏代码、美术、音乐、商标等相关权利，归 Electronic
              Arts Inc.（EA / 艺电）及相应权利人所有。
            </p>
            <p>
              第三方内容的权利不因修改、裁剪或 AI
              适配而转移。本声明本身不授予第三方素材的使用许可，也不将这些素材改为开源授权。
            </p>
          </section>
          <section>
            <h2>非商业、非盈利用途</h2>
            <p>
              本项目仅用于学习、交流与研究，不进行收费销售、付费访问、广告变现或其他盈利活动。
            </p>
            <p>
              本项目不声称与 EA 或 Remix
              原作者具有官方联属，也不声称获得其授权、认可或支持。非商业用途不等于自动获得第三方授权。
            </p>
          </section>
          <section>
            <h2>来源与权利沟通</h2>
            <p>
              网站保留原作者署名、原文链接和素材来源记录。如有权利问题，可通过{" "}
              <a href={copyright.issuesUrl} target="_blank" rel="noreferrer">
                项目 GitHub Issues ↗
                <span className="sr-only">（新窗口打开）</span>
              </a>{" "}
              提供相关页面、素材及权利说明，我们将协助核实和处理。
            </p>
          </section>
          <section className="copyright-references">
            <h2>参考政策</h2>
            <ul>
              <li>
                <a
                  href={copyright.moddingGuidelinesUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  EA Command &amp; Conquer Modding Guidelines ↗
                  <span className="sr-only">（新窗口打开）</span>
                </a>
              </li>
              <li>
                <a
                  href={copyright.contentPolicyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  EA Content Policy ↗
                  <span className="sr-only">（新窗口打开）</span>
                </a>
              </li>
            </ul>
            <p>
              查阅日期：{copyright.checkedOn}。列出政策来源不代表本项目已获得 EA
              授权或完整政策合规认证。
            </p>
          </section>
        </div>
      </section>
    </>
  );
}
