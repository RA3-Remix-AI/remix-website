export const storyCategories = [
  {
    value: "narrative",
    label: "剧情连载",
    description: "跟随人物与部队，阅读连载中的战场故事。",
  },
  {
    value: "unit",
    label: "单位设定",
    description: "从创作背景与设定文字认识兵种与装备。",
  },
  {
    value: "worldbuilding",
    label: "世界观",
    description: "补充故事世界与各方背景的设定资料。",
  },
  {
    value: "fanwork",
    label: "同人作品",
    description: "独立标记的同人创作，不视为正式游戏设定。",
  },
  {
    value: "development",
    label: "创作故事",
    description: "与项目制作、文案创作相关的背景文章。",
  },
] as const;
export type StoryCategory = (typeof storyCategories)[number]["value"];
export type StoryFilter = StoryCategory | "all";
export interface StorySource {
  articleId: number;
  title: string;
  url: string;
  category?: StoryCategory;
  summary: string;
  publishedAt: string;
  accessLevel: "full_article_body_read" | "metadata_only";
  publisher: { name: string; mid: number };
  credits: {
    writer?: string;
    group?: string;
    plotReview?: string;
    literaryReview?: string;
    finalReview?: string;
    revision?: string;
  };
}
export interface Story extends Omit<StorySource, "category"> {
  category: StoryCategory;
  bodyRead: boolean;
  publishedDate: string;
}
export function prepareStories(sources: readonly StorySource[]): Story[] {
  return sources
    .map((source) => ({
      ...source,
      category: source.category ?? "narrative",
      // An inaccessible article must not inherit a title-derived or cached guess.
      summary:
        source.accessLevel === "full_article_body_read" ? source.summary : "",
      bodyRead: source.accessLevel === "full_article_body_read",
      publishedDate: source.publishedAt.slice(0, 10),
    }))
    .sort(
      (a, b) =>
        a.publishedAt.localeCompare(b.publishedAt) || a.articleId - b.articleId,
    );
}
export function filterStories(
  stories: readonly Story[],
  query: string,
  category: StoryFilter,
): Story[] {
  const normalized = query.trim().toLocaleLowerCase();
  return stories.filter(
    (story) =>
      (category === "all" || story.category === category) &&
      `${story.title} ${story.summary} ${story.credits.writer ?? ""} ${story.publisher.name}`
        .toLocaleLowerCase()
        .includes(normalized),
  );
}
