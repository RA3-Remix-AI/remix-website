import type { Story } from "./stories";

export interface StoryImage {
  src: string;
  alt: string;
  caption: string;
  sourceUrl: string;
}
export type StoryBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | ({ type: "image" } & StoryImage);

export function findStory(
  stories: readonly Story[],
  articleId: string | undefined,
): Story | undefined {
  if (
    !articleId ||
    !/^[1-9]\d*$/.test(articleId) ||
    !Number.isSafeInteger(Number(articleId))
  )
    return undefined;
  return stories.find((story) => String(story.articleId) === articleId);
}
export function storyNeighbours(stories: readonly Story[], current: Story) {
  const peers = stories.filter((story) => story.category === current.category);
  const index = peers.findIndex(
    (story) => story.articleId === current.articleId,
  );
  return {
    previous: index > 0 ? peers[index - 1] : undefined,
    next: index >= 0 ? peers[index + 1] : undefined,
  };
}
export function validStoryImage(image: StoryImage): boolean {
  // Only curated local files and HTTPS source links are accepted; no raw embeds or HTML.
  return (
    /^\/materials\/stories\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp|gif)$/i.test(
      image.src,
    ) &&
    image.alt.trim().length > 0 &&
    /^https:\/\//i.test(image.sourceUrl)
  );
}
export function storyBlocks(
  story: Story,
  images: readonly StoryImage[] = [],
): StoryBlock[] {
  if (!story.bodyRead || !story.summary.trim()) return [];
  const paragraphs: StoryBlock[] = story.summary
    .split(/\n\s*\n/)
    .filter((text) => text.trim())
    .map((text) => ({ type: "paragraph", text }));
  return [
    { type: "heading", text: "内容整理" },
    ...paragraphs,
    ...images
      .filter(validStoryImage)
      .map((image) => ({ type: "image" as const, ...image })),
  ];
}
