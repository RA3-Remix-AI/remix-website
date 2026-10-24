import { Link, useSearchParams } from "react-router";
import { PageIntro } from "../components/PageIntro";
import { stories, storyCollection } from "../content/stories";
import { filterStories, storyCategories } from "../lib/stories";
import type { Story, StoryFilter } from "../lib/stories";

function StoryCard({
  story,
  archiveSearch,
}: {
  story: Story;
  archiveSearch: string;
}) {
  return (
    <article className="archive-card">
      <Link
        className="archive-reading-link"
        to={`/stories/${story.articleId}`}
        state={{ archiveSearch }}
      >
        <h3 className="archive-title">{story.title}</h3>
        <span className="archive-meta">
          <span>
            发布于{" "}
            <time dateTime={story.publishedAt}>{story.publishedDate}</time>
          </span>
          <span>{story.bodyRead ? "站内整理摘要" : "正文暂缺"}</span>
        </span>
        <p className="archive-preview">
          {story.bodyRead && story.summary
            ? story.summary
            : "正文尚待补充，目前可查看目录信息与原文链接。"}
        </p>
        <span className="archive-read-action">
          {story.bodyRead ? "站内阅读" : "查看条目"} →
        </span>
      </Link>
      <div className="archive-card-footer">
        <span>
          {story.credits.writer
            ? `文案：${story.credits.writer}`
            : `发布：${story.publisher.name}`}
        </span>
        <a href={story.url} target="_blank" rel="noreferrer">
          原文来源 ↗<span className="sr-only">（新窗口打开）</span>
        </a>
      </div>
    </article>
  );
}

export function StoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const categoryValue = searchParams.get("category") ?? "all";
  const category: StoryFilter = storyCategories.some(
    (item) => item.value === categoryValue,
  )
    ? (categoryValue as StoryFilter)
    : "all";
  function updateSearch(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value && !(key === "category" && value === "all")) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  }
  const filtered = filterStories(stories, query, category);
  const readCount = stories.filter((story) => story.bodyRead).length;
  return (
    <>
      <PageIntro index="02 / STORIES" title="故事与设定">
        <p>{storyCollection.introduction}</p>
      </PageIntro>
      <section className="panel-section content-section">
        <div className="shell">
          <div className="story-archive-heading">
            <div>
              <p className="eyebrow">REMIX / STORY ARCHIVE</p>
              <h2>{storyCollection.title}</h2>
              <p>
                收录 {stories.length} 篇剧情与设定相关图文，其中 {readCount}{" "}
                篇已整理正文摘要。
              </p>
            </div>
            <a
              className="text-link"
              href={storyCollection.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              查看作者图文 ↗<span className="sr-only">（新窗口打开）</span>
            </a>
          </div>
          <p className="content-note">
            摘要依据已读取的原文整理，保留各篇署名；同人作品单独分类。图文内容与
            Remix 037 的对应关系尚未确认，不代表已实装的战役或单位机制。
          </p>
          <div className="video-controls story-controls">
            <label>
              搜索图文
              <input
                type="search"
                placeholder="人物、单位、篇名或文案作者"
                value={query}
                onChange={(event) => updateSearch("q", event.target.value)}
              />
            </label>
            <label>
              内容分类
              <select
                value={category}
                onChange={(event) =>
                  updateSearch("category", event.target.value)
                }
              >
                <option value="all">全部图文</option>
                {storyCategories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}（
                    {
                      stories.filter((story) => story.category === item.value)
                        .length
                    }
                    ）
                  </option>
                ))}
              </select>
            </label>
            <p role="status">找到 {filtered.length} 篇</p>
          </div>
          {storyCategories.map((group) => {
            const entries = filtered.filter(
              (story) => story.category === group.value,
            );
            return entries.length ? (
              <section
                className="archive-group"
                key={group.value}
                aria-labelledby={`stories-${group.value}`}
              >
                <div className="archive-group-heading">
                  <h2 id={`stories-${group.value}`}>
                    {group.label}
                    <span>{entries.length}</span>
                  </h2>
                  <p>{group.description}</p>
                </div>
                <div className="archive-grid">
                  {entries.map((story) => (
                    <StoryCard
                      key={story.articleId}
                      story={story}
                      archiveSearch={searchParams.toString()}
                    />
                  ))}
                </div>
              </section>
            ) : null;
          })}
          {!filtered.length && (
            <p className="empty-state">
              没有找到匹配的图文，请调整关键词或分类。
            </p>
          )}
          <aside className="story-future" aria-label="后续战役探索">
            <p>
              <strong>后续探索</strong>本项目计划研究 AI
              如何增强战役体验，目前仍处规划阶段。
            </p>
            <Link className="text-link" to="/roadmap">
              查看 AI 规划 ↗
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
