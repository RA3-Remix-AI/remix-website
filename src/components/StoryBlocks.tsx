import type { StoryBlock } from "../lib/story-reader";
import { validStoryImage } from "../lib/story-reader";

export function StoryBlocks({ blocks }: { blocks: readonly StoryBlock[] }) {
  return (
    <div className="reading-prose">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return <h2 key={index}>{block.text}</h2>;
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "image":
            return validStoryImage(block) ? (
              <figure className="reading-image" key={block.src}>
                <img src={block.src} alt={block.alt} loading="lazy" />
                <figcaption>
                  <span>{block.caption}</span>
                  <a href={block.sourceUrl} target="_blank" rel="noreferrer">
                    图片来源 ↗<span className="sr-only">（新窗口打开）</span>
                  </a>
                </figcaption>
              </figure>
            ) : null;
        }
      })}
    </div>
  );
}
