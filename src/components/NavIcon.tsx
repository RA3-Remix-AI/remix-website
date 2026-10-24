import type { ReactNode } from "react";

export type NavIconName = "command" | "arsenal" | "calibrate" | "story" | "history" | "download" | "video" | "decisions" | "unit" | "protocol" | "menu" | "close";

const symbols: Record<NavIconName, ReactNode> = {
  command: <><path d="M3 9V5l2-2h4m6 0h4l2 2v4m0 6v4l-2 2h-4m-6 0H5l-2-2v-4" /><path d="m12 5 7 7-7 7-7-7Z" /><path className="nav-icon-accent" d="M9 12h6m-3-3v6" /></>,
  arsenal: <><path d="M4 6h16v13l-2 2H6l-2-2Zm2 0V3h12v3M4 10h16" /><path d="M8 14h8m-8 3h5" /><path className="nav-icon-accent" d="M17 14v4" /></>,
  calibrate: <><path d="M7 5h10l2 2v10l-2 2H7l-2-2V7Zm2-3v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" /><path className="nav-icon-accent" d="M8 10h8m-8 4h8m-5-6v4m3 0v4" /></>,
  story: <><path d="M12 6 5 3H2v15h3l7 3 7-3h3V3h-3l-7 3Zm0 0v15" /><path className="nav-icon-accent" d="m5 8 4 2m-4 3 4 2m6-5 4-2m-4 7 4-2" /></>,
  history: <><path d="M12 3H5L3 5v15h8M6 7h5M6 11h3" /><path d="M20 11a6 6 0 1 1-8 0l4-1Z" /><path className="nav-icon-accent" d="M16 12v4h3" /></>,
  download: <><path d="M3 15v5h18v-5M6 20v-3m12 3v-3" /><path className="nav-icon-accent" d="M12 3v12m-5-5 5 5 5-5" /><path d="M8 3h8" /></>,
  video: <><path d="M3 4h18v16H3Zm0 4h18M3 16h18M7 4v4m10-4v4M7 16v4m10-4v4" /><path className="nav-icon-accent" d="m10 10 5 2-5 2Z" /></>,
  decisions: <><path d="m12 2 4 4-4 4-4-4Zm-4 4H4v10m12-10h4v10M4 20v2h16v-2" /><path className="nav-icon-accent" d="M2 16h4v4H2Zm16 0h4v4h-4Zm-6-6v9m-3-3 3 3 3-3" /></>,
  unit: <><path d="M5 13h14l3 3-2 4H4l-2-4Zm3 0V9h7l3 4M12 9V6h9" /><path className="nav-icon-accent" d="M6 17h12" /><path d="M6 16v2m4-2v2m4-2v2m4-2v2" /></>,
  protocol: <><path d="M4 2h16v3M2 6h20v3M3 10h7v10H3Zm11 0h7v10h-7" /><path className="nav-icon-accent" d="m6 12 2 3H5l2 3m10-6h2m-2 3h2m-2 3h2" /></>,
  menu: <><path d="M3 6h18M3 12h18M3 18h18" /><path className="nav-icon-accent" d="M3 4v4m18 2v4M3 16v4" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /><path className="nav-icon-accent" d="M3 8V3h5m8 18h5v-5" /></>,
};

const routeIcons: Record<string, NavIconName> = {
  "/": "command", "/remix-037": "arsenal", "/gameplay": "calibrate", "/stories": "story",
  "/devlogs": "history", "/downloads": "download", "/videos": "video", "/roadmap": "decisions", "/protocols-037": "protocol",
};

export function navIconForPath(path: string): NavIconName {
  return routeIcons[path] ?? "command";
}

export function NavIcon({ name }: { name: NavIconName }) {
  return <svg className="nav-icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="bevel" aria-hidden="true" focusable="false">{symbols[name]}</svg>;
}
