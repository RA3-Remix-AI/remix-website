import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { site } from "../content/site";
import { normalizePath } from "../seo/navigation";
import { NavIcon, navIconForPath } from "./NavIcon";
import "../styles/nav-icons.css";

export function Header() {
  const { pathname: locationPath } = useLocation();
  const pathname = normalizePath(locationPath);
  const [menuOpen, setMenuOpen] = useState(false);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);
  const atlasToggle = useRef<HTMLButtonElement>(null);
  const menuToggle = useRef<HTMLButtonElement>(null);

  const closeNavigation = () => {
    setMenuOpen(false);
    setAtlasOpen(false);
  };
  useEffect(() => {
    setMenuOpen(false);
    setAtlasOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!atlasOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!group.current?.contains(event.target as Node)) setAtlasOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [atlasOpen]);

  return (
    <header
      className={`site-header shell campaign-header ${menuOpen ? "menu-open" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          closeNavigation();
          menuToggle.current?.focus();
        }
      }}
    >
      <Link
        className="brand"
        to="/"
        aria-label="Remix-Ai 首页"
        onClick={closeNavigation}
      >
        <span className="brand-mark" aria-hidden="true">
          RA<span>3</span>
        </span>
        <span className="brand-text">
          Remix-Ai<span>COMMAND & CONQUER MOD</span>
        </span>
      </Link>
      <button
        type="button"
        ref={menuToggle}
        className="campaign-menu-toggle"
        aria-controls="primary-navigation"
        aria-expanded={menuOpen}
        onClick={() => {
          setMenuOpen((open) => !open);
          setAtlasOpen(false);
        }}
        aria-label={menuOpen ? "关闭导航菜单" : "打开导航菜单"}
      >
        <NavIcon name={menuOpen ? "close" : "menu"} />
        <small>导航</small>
      </button>
      <nav id="primary-navigation" aria-label="主导航">
        {site.navigation.map((item) =>
          item.children ? (
            <div
              className="nav-group"
              key={item.href}
              ref={group}
              onKeyDown={(event) => {
                if (event.key === "Escape" && atlasOpen) {
                  event.stopPropagation();
                  setAtlasOpen(false);
                  atlasToggle.current?.focus();
                }
              }}
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                )
                  setAtlasOpen(false);
              }}
            >
              <button
                type="button"
                ref={atlasToggle}
                className={
                  item.children.some((child) => child.href === pathname)
                    ? "nav-group-toggle active"
                    : "nav-group-toggle"
                }
                aria-expanded={atlasOpen}
                aria-controls="atlas-submenu"
                onClick={() => setAtlasOpen((open) => !open)}
              >
                <NavIcon name={navIconForPath(item.href)} />
                <span className="nav-label">
                  {item.label}{" "}
                  <span className="nav-chevron" aria-hidden="true">
                    ⌄
                  </span>
                </span>
              </button>
              <div
                className="nav-submenu"
                id="atlas-submenu"
                hidden={!atlasOpen}
              >
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href}
                    className={pathname === child.href ? "active" : undefined}
                    aria-current={pathname === child.href ? "page" : undefined}
                    onClick={closeNavigation}
                  >
                    <NavIcon
                      name={
                        child.href === "/remix-037"
                          ? "unit"
                          : navIconForPath(child.href)
                      }
                    />
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              onClick={closeNavigation}
            >
              <NavIcon name={navIconForPath(item.href)} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ),
        )}
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
