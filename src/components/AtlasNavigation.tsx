import { Link, useLocation } from "react-router";
import { normalizePath } from "../seo/navigation";

export function AtlasNavigation() {
  const pathname = normalizePath(useLocation().pathname);
  return (
    <nav className="atlas-tabs shell" aria-label="Remix原版分类">
      <span>Remix原版</span>
      <Link
        to="/remix-037"
        className={pathname === "/remix-037" ? "active" : undefined}
        aria-current={pathname === "/remix-037" ? "page" : undefined}
      >
        单位
      </Link>
      <Link
        to="/protocols-037"
        className={pathname === "/protocols-037" ? "active" : undefined}
        aria-current={pathname === "/protocols-037" ? "page" : undefined}
      >
        协议
      </Link>
    </nav>
  );
}
