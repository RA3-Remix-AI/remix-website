import media from "./story-media.json";
import { stories } from "./stories";
import { findStory, storyBlocks, storyNeighbours } from "../lib/story-reader";
import type { StoryImage } from "../lib/story-reader";

const storyMedia: Record<string, StoryImage[]> = media;
export function getStoryReader(articleId: string | undefined) {
  const story = findStory(stories, articleId);
  return story
    ? {
        story,
        blocks: storyBlocks(story, storyMedia[String(story.articleId)] ?? []),
        ...storyNeighbours(stories, story),
      }
    : undefined;
}
export function storyTitleForPath(pathname: string): string | undefined {
  const match = /^\/stories\/([^/]+)\/?$/.exec(pathname);
  return match ? findStory(stories, match[1])?.title : undefined;
}
