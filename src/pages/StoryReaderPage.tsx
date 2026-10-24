import { Link, useParams, useLocation } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { StoryBlocks } from "../components/StoryBlocks";
import { getStoryReader } from "../content/story-reader";
import { storyCategories } from "../lib/stories";

export function StoryReaderPage() {
  const { articleId } = useParams();
  const { state } = useLocation();
  const archiveSearch =
    typeof state?.archiveSearch === "string"
      ? new URLSearchParams(state.archiveSearch).toString()
      : "";
  const archivePath = `/stories${archiveSearch ? `?${archiveSearch}` : ""}`;
  const reader = getStoryReader(articleId);
  if (!reader)
    return (
      <>
        <PageIntro index="404 / STORY NOT FOUND" title="文章未找到">
          <p>这个条目不在当前故事档案中。</p>
        </PageIntro>
        <div className="shell not-found">
          <Link className="button" to={archivePath}>
            返回故事档案 ↗
          </Link>
        </div>
      </>
    );
  const { story, blocks, previous, next } = reader;
  const category = storyCategories.find(
    (item) => item.value === story.category,
  )!;
  return (
    <article className="story-reader shell">
      <nav className="reading-breadcrumb" aria-label="文章位置">
        <Link to={archivePath}>← 故事档案</Link>
        <span aria-hidden="true">/</span>
        <span>{category.label}</span>
      </nav>
      <header className="reading-header">
        <p className="eyebrow">
          REMIX / {story.bodyRead ? "EDITED SUMMARY" : "ARTICLE RECORD"}
        </p>
        <h1>{story.title}</h1>
        <div className="reading-meta">
          <span className="status">
            {story.bodyRead ? "站内整理摘要" : "正文暂缺 · 仅目录信息"}
          </span>
          <span>
            发布于{" "}
            <time dateTime={story.publishedAt}>{story.publishedDate}</time>
          </span>
        </div>
        <div className="story-credits">
          {story.credits.writer && <span>文案：{story.credits.writer}</span>}
          {story.credits.group && <span>{story.credits.group}</span>}
          <span>发布：{story.publisher.name}</span>
          {story.credits.plotReview && (
            <span>剧情审核：{story.credits.plotReview}</span>
          )}
          {story.credits.literaryReview && (
            <span>文学审核：{story.credits.literaryReview}</span>
          )}
          {story.credits.revision && (
            <span>修订：{story.credits.revision}</span>
          )}
          {story.credits.finalReview && (
            <span>终审：{story.credits.finalReview}</span>
          )}
        </div>
      </header>
      <div className="reading-layout">
        <div className="reading-main">
          {story.bodyRead && blocks.length ? (
            <StoryBlocks blocks={blocks} />
          ) : (
            <section className="reading-unavailable">
              <h2>正文尚未收录</h2>
              <p>正文尚待补充，目前可查看目录信息与原文链接。</p>
              <a
                className="text-link"
                href={story.url}
                target="_blank"
                rel="noreferrer"
              >
                前往原文阅读 ↗<span className="sr-only">（新窗口打开）</span>
              </a>
            </section>
          )}
          <div className="reading-source">
            <p>原文：{story.title}</p>
            <a
              className="text-link"
              href={story.url}
              target="_blank"
              rel="noreferrer"
            >
              查看原文与出处 ↗<span className="sr-only">（新窗口打开）</span>
            </a>
          </div>
        </div>
        <aside className="reading-context" aria-label="阅读说明">
          <p className="eyebrow">阅读说明</p>
          <p>
            {story.bodyRead
              ? "根据已核对原文整理，完整内容见原文链接。"
              : "正文尚待补充，目前可查看目录信息与原文链接。"}
          </p>
          {story.category === "fanwork" && (
            <p>此篇为同人作品，单独归档，不视为正式游戏设定。</p>
          )}
          <p>
            内容与 Remix 037 的对应关系尚未确认，不代表已实装的战役或单位机制。
          </p>
        </aside>
      </div>
      <nav className="reading-navigation" aria-label="同类文章导航">
        {previous ? (
          <Link to={`/stories/${previous.articleId}`} state={{ archiveSearch }}>
            <span>← 同类上一篇</span>
            <strong>{previous.title}</strong>
          </Link>
        ) : (
          <span className="reading-edge">已是该类第一篇</span>
        )}
        {next ? (
          <Link to={`/stories/${next.articleId}`} state={{ archiveSearch }}>
            <span>同类下一篇 →</span>
            <strong>{next.title}</strong>
          </Link>
        ) : (
          <span className="reading-edge">已是该类最后一篇</span>
        )}
      </nav>
      <Link className="text-link reading-return" to={archivePath}>
        ← 返回故事档案
      </Link>
    </article>
  );
}
