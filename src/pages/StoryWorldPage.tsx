import { Link } from "react-router";
import { StoryCanon } from "../components/StoryCanon";
import { PageIntro } from "../components/PageIntro";
import { storyExpansion } from "../content/story-expansion";

export const storySectionIds = ["remix-ai-canon", "story-expansion", ...storyExpansion.sections.map(section => section.id)];

export function StoryWorldPage() {
  return <>
    <PageIntro index="02 / ORIGINAL WORLD" title="故事与设定">
      <p>从 2023 年的初代推理，到 2038 年的融合体指挥官。走进 Remix-Ai 的原创分歧时间线，阅读三阵营的选择，以及战争留在人身上的痕迹。</p>
      <Link className="text-link" to="/stories">← 返回小说书架</Link>
    </PageIntro>
    <nav className="shell story-chapters" aria-label="故事章节导航">
      <Link to="#remix-ai-canon">世界观蓝本</Link>
      {storyExpansion.sections.map((section, index) => <Link key={section.id} to={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</Link>)}
    </nav>
    <StoryCanon />
    <section id="story-expansion" className="panel-section content-section story-expansion" aria-labelledby="expansion-title">
      <div className="shell">
        <header className="expansion-intro">
          <p className="eyebrow">REMIX-AI / STORIES</p>
          <h2 id="expansion-title">{storyExpansion.title}</h2>
          <p className="content-note"><strong>{storyExpansion.statusLabel}</strong><br />{storyExpansion.introduction}</p>
        </header>
        <div className="expansion-reading">
          {storyExpansion.sections.map((section, index) => <article id={section.id} key={section.id} className="expansion-chapter" aria-labelledby={`${section.id}-title`}>
            <p className="eyebrow">CHAPTER {String(index + 1).padStart(2, "0")}</p>
            <h3 id={`${section.id}-title`}>{section.title}</h3>
            <p className="chapter-subtitle">{section.subtitle}</p>
            {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            <Link className="text-link chapter-return" to="#story-expansion">返回篇章开头 ↑</Link>
          </article>)}
        </div>
      </div>
    </section>
  </>;
}
