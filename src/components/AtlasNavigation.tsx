import { NavLink } from "react-router";

export function AtlasNavigation() {
  return <nav className="atlas-tabs shell" aria-label="037 图鉴分类">
    <span>037 图鉴</span>
    <NavLink to="/remix-037" end>单位</NavLink>
    <NavLink to="/protocols-037" end>协议</NavLink>
  </nav>;
}
