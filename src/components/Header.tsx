import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { site } from "../content/site";

export function Header() {
  const { pathname } = useLocation();
  const [atlasOpen, setAtlasOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => { setAtlasOpen(false); }, [pathname]);
  useEffect(() => {
    if (!atlasOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!group.current?.contains(event.target as Node)) setAtlasOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [atlasOpen]);
  return (
    <header className="site-header shell">
      <Link className="brand" to="/" aria-label="Remix-A 首页">
        <span className="brand-mark" aria-hidden="true">
          RA<span>3</span>
        </span>
        <span className="brand-text">
          REMIX-A<span>红色警戒 3 · 基于 037 探索</span>
        </span>
      </Link>
      <nav aria-label="主导航">
        {site.navigation.map((item, index) => item.children ? (
          <div className="nav-group" key={item.href} ref={group} onKeyDown={event => {
            if (event.key === "Escape") { setAtlasOpen(false); toggle.current?.focus(); }
          }} onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAtlasOpen(false);
          }}>
            <button type="button" ref={toggle} className={item.children.some(child => child.href === pathname) ? "nav-group-toggle active" : "nav-group-toggle"} aria-expanded={atlasOpen} aria-controls="atlas-submenu" onClick={() => setAtlasOpen(open => !open)}>
              <span className="nav-index" aria-hidden="true">0{index + 1}</span>
              <span>{item.label} <span aria-hidden="true">⌄</span></span>
            </button>
            <div className="nav-submenu" id="atlas-submenu" hidden={!atlasOpen}>
              {item.children.map(child => <NavLink key={child.href} to={child.href} end onClick={() => setAtlasOpen(false)}>{child.label}</NavLink>)}
            </div>
          </div>
        ) : (
          <NavLink key={item.href} to={item.href} end={item.href === "/"}>
            <span className="nav-index" aria-hidden="true">
              0{index + 1}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <a
        className="header-github"
        href={site.githubUrl}
        target="_blank"
        rel="noreferrer"
      >
        GitHub ↗<span className="sr-only">（新窗口打开）</span>
      </a>
    </header>
  );
}
