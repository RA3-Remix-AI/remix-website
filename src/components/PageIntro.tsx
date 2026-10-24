import type { ReactNode } from "react";

export function PageIntro({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="page-intro shell">
      <p className="eyebrow">REMIX 037 / {index}</p>
      <h1>
        {title}
        <span>.</span>
      </h1>
      <div className="page-description">{children}</div>
    </header>
  );
}
