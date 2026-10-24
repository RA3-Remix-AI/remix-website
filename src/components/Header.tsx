import { Link, NavLink } from "react-router";
import { site } from "../content/site";

export function Header() {
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
        {site.navigation.map((item, index) => (
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
