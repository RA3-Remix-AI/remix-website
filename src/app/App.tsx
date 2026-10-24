import { useEffect, useRef } from "react";
import { Link, Route, Routes, useLocation } from "react-router";
import { Header } from "../components/Header";
import { PageIntro } from "../components/PageIntro";
import { site } from "../content/site";
import { visuals } from "../content/visuals";
import { HomePage } from "../pages/HomePage";
import { GameplayPage } from "../pages/GameplayPage";
import { Remix037Page } from "../pages/Remix037Page";
import { Protocols037Page } from "../pages/Protocols037Page";
import { StoriesPage } from "../pages/StoriesPage";
import { StoryReaderPage } from "../pages/StoryReaderPage";
import { storyTitleForPath } from "../content/story-reader";
import { DevlogsPage } from "../pages/DevlogsPage";
import { DownloadsPage } from "../pages/DownloadsPage";
import { VideosPage } from "../pages/VideosPage";
import { RoadmapPage } from "../pages/RoadmapPage";

export function App() {
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    document.title = `${storyTitleForPath(pathname) ?? site.navigation.find((item) => item.href === pathname)?.title ?? "页面未找到"} — Remix-A`;
    window.scrollTo({ top: 0, behavior: "instant" });
    main.current?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <button className="skip-link" onClick={() => main.current?.focus()}>
        跳转到主要内容
      </button>
      <Header />
      <main id="main" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gameplay" element={<GameplayPage />} />
          <Route path="/remix-037" element={<Remix037Page />} />
          <Route path="/protocols-037" element={<Protocols037Page />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/stories/:articleId" element={<StoryReaderPage />} />
          <Route path="/devlogs" element={<DevlogsPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
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
          REMIX-A<span>.</span>
        </Link>
        <div className="footer-context">
          <p>Remix-A · 037 原有内容与本版本改造</p>
          <a href={visuals.sourceUrl} target="_blank" rel="noreferrer">
            原版视觉素材：Steam / Electronic Arts ↗
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
      </footer>
    </>
  );
}
