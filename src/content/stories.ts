import sources from "../../docs/materials/remix-story-sources.json";
import { prepareStories } from "../lib/stories";
import type { StorySource } from "../lib/stories";

export const storyCollection = {
  title: "REMIX 故事档案",
  introduction:
    "了解 Remix-Ai 原创时间线、三阵营算力路线与融合体指挥官；继续向下浏览 REMIX 原作者的剧情、单位设定与创作档案。",
  sourceUrl: sources.sourceCollection,
};
export const stories = prepareStories(sources.articles as StorySource[]);
