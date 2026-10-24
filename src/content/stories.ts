import sources from "../../docs/materials/remix-story-sources.json";
import { prepareStories } from "../lib/stories";
import type { StorySource } from "../lib/stories";

export const storyCollection = {
  title: "REMIX 故事档案",
  introduction:
    "从连载剧情到单位设定，在作者的图文中了解 REMIX 的创作背景。按类别浏览，或搜索人物、单位与篇名。",
  sourceUrl: sources.sourceCollection,
};
export const stories = prepareStories(sources.articles as StorySource[]);
