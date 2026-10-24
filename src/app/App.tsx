import { useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router";
import { Header } from "../components/Header";
import { CopyrightPage } from "../pages/CopyrightPage";
import { copyright } from "../content/copyright";
import { PageIntro } from "../components/PageIntro";
import { site } from "../content/site";
import { HomePage } from "../pages/HomePage";
import { GameplayPage } from "../pages/GameplayPage";
import { Remix037Page } from "../pages/Remix037Page";
import { Protocols037Page } from "../pages/Protocols037Page";
import { StoriesPage } from "../pages/StoriesPage";
import { StoryReaderPage } from "../pages/StoryReaderPage";
import { SeoMetadata } from "../components/SeoMetadata";
import { LegacyHashBridge } from "../components/LegacyHashBridge";
import { normalizePath } from "../seo/navigation";
import { DevlogsPage } from "../pages/DevlogsPage";
import { DownloadsPage } from "../pages/DownloadsPage";
import { VideosPage } from "../pages/VideosPage";
import { RoadmapPage } from "../pages/RoadmapPage";

export function App() {
  const { pathname: locationPath } = useLocation();
  const pathname = normalizePath(locationPath);
  const entryPath = useRef(pathname);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    main.current?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <SeoMetadata />
      <LegacyHashBridge />
      <button className="skip-link" onClick={() => main.current?.focus()}>
        跳转到主要内容
      </button>
      <Header />
      <main id="main" ref={main} tabIndex={-1}>
        <Routes>
          <Route
            path="/"
            element={<HomePage entryPath={entryPath.current} />}
          />
          <Route path="/gameplay" element={<GameplayPage />} />
          <Route path="/remix-037" element={<Remix037Page />} />
          <Route path="/protocols-037" element={<Protocols037Page />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:articleId" element={<StoryReaderPage />} />
          <Route path="/devlogs" element={<DevlogsPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/copyright" element={<CopyrightPage />} />
          <Route
            path="*"
            element={
              <>
                <PageIntro index="404 / NOT FOUND" title="页面未找到">
                  <p>这个地址暂时没有内容。</p>
                </PageIntro>
                <div className="shell not-found">
                  <Link className="button" to="/">
                    返回首页 ↗
                  </Link>
                </div>
              </>
            }
          />
        </Routes>
      </main>
      <footer className="shell site-footer">
        <Link className="footer-brand" to="/">
          Remix-Ai<span>.</span>
        </Link>
        <div className="footer-context">
          <p>红色警戒 3 · 基于 Remix 037 继续探索</p>
          <a href={site.sourceVideoUrl} target="_blank" rel="noreferrer">
            Remix 公开发布者：knight-vvv ↗
            <span className="sr-only">（新窗口打开）</span>
          </a>
        </div>
        <button
          className="footer-top"
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches
                ? "instant"
                : "smooth",
            });
            main.current?.focus({ preventScroll: true });
          }}
        >
          返回顶部 ↑
        </button>
        <div className="footer-rights">
          <div>
            <p>
              Remix 原创 Mod 内容 © 原作者及各贡献者；原游戏相关权利 © EA
              及相应权利人。
            </p>
            <p>
              Remix-Ai 仅供学习交流与研究，非商业、非盈利。本项目未经 EA
              认可或支持，非 EA 官方项目。
            </p>
            <p lang="en">{copyright.eaNotice}</p>
          </div>
          <Link to="/copyright">版权与非商业声明 ↗</Link>
        </div>
      </footer>
    </>
  );
}
