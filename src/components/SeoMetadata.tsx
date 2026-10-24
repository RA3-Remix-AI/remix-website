import { useEffect } from "react";
import { useLocation } from "react-router";
import { resolveSeo, seoHeadNodes, validateSiteUrl } from "../seo/metadata";

const origin = validateSiteUrl(import.meta.env.VITE_SITE_URL);
export function SeoMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const nodes = seoHeadNodes(resolveSeo(pathname, origin)).map((item) => {
      const element = document.createElement(item.tag);
      element.dataset.seo = "true";
      for (const [key, value] of Object.entries(item.attributes))
        element.setAttribute(key, value);
      if (item.text) element.textContent = item.text;
      return element;
    });
    document.head
      .querySelectorAll('[data-seo="true"]')
      .forEach((node) => node.remove());
    document.head.append(...nodes);
  }, [pathname]);
  return null;
}
