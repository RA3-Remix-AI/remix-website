import { homeChapters } from "../hooks/useHomeImmersion";

export function HomeChapterRail({
  active,
  hidden,
}: {
  active: string;
  hidden: boolean;
}) {
  return (
    <div className="home-navigation-overlay" hidden={hidden}>
      <div
        className="home-reading-progress"
        role="progressbar"
        aria-label="首页阅读进度"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <span />
      </div>
      <nav className="home-chapter-rail" aria-label="首页章节">
        {homeChapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={`${index + 1}. ${chapter.label}`}
            aria-current={active === chapter.id ? "location" : undefined}
          >
            <span className="home-chapter-label">{chapter.label}</span>
            <span className="home-chapter-dot" aria-hidden="true" />
            <small aria-hidden="true">0{index + 1}</small>
          </a>
        ))}
      </nav>
    </div>
  );
}
