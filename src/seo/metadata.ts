import { fictionCatalog, fictionIdForPath, findFiction } from "../lib/fiction";
import { normalizePath } from "./navigation";

export const defaultSiteUrl = "https://ra3-remix.com";
export function validateSiteUrl(value: string = defaultSiteUrl): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("VITE_SITE_URL 必须是完整的 http(s) 网站 origin");
  }
  if (
    value !== value.trim() ||
    !/^https?:\/\/[^/?#]+\/?$/.test(value) ||
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "VITE_SITE_URL 仅允许 http(s) origin，不允许路径、凭证、查询或片段",
    );
  }
  return url.origin;
}
export const pageDefinitions = [
  {
    path: "/",
    title: "Remix-Ai — 弈核 Tacticore · 红色警戒 3",
    label: "首页",
    description:
      "认识弈核 Tacticore 独立 Agent 指挥程序，计划后续单独开源。Remix-Ai 是基于红色警戒 3 Remix 037 的游戏内容适配版本，进行单位、协议和平衡调整，Agent 能力仍在初期研发。",
  },
  {
    path: "/gameplay",
    title: "AI版改动与核心玩法 — Remix-Ai",
    label: "AI版改动",
    description:
      "了解 Remix-Ai 基于 Remix 037 的单位、建筑、协议与平衡调整，以及发展、侦察、组合和调度等核心玩法。Agent 接入仍处于初期研发。",
  },
  {
    path: "/remix-037",
    title: "Remix 原版单位图鉴 · 037 — Remix-Ai",
    label: "Remix原版单位",
    description:
      "浏览 Remix 037 苏联、盟军、升阳单位与原有内容，区分开发基线和 Remix-Ai 的后续改造，查看整理的单位定位与来源。",
  },
  {
    path: "/protocols-037",
    title: "Remix 037 协议详解 — Remix-Ai",
    label: "Remix原版协议",
    description:
      "按苏联、盟军、升阳阵营浏览 Remix 037 协议图鉴，了解原有协议效果与使用说明，并区分本项目的调整内容。",
  },
  {
    path: "/stories",
    title: "断线年代 · 原创故事书架 — Remix-Ai",
    label: "故事与设定",
    description:
      "阅读《断线年代》原创小说集，从 2023 年到 2038 年，按阵营、融合阶段与主角寻找故事。走近铁锤、卡特、神崎凛与战争中的普通人，查看真实正文汉字数与阅读时间。",
  },
  {
    path: "/stories/world",
    title: "原创世界观与时间线 — Remix-Ai",
    label: "世界观蓝本",
    description: "从初代推理 AI 到融合体指挥官：阅读 Remix-Ai 蓝本 0.9 的三阵营、浮岛战争、曳取扩散与 2038 年人的选择，以及七篇设定扩写。",
  },
  {
    path: "/devlogs",
    title: "弈核 Tacticore 开发周报与 REMIX 历史记录 — Remix-Ai",
    label: "往期开发记录",
    description:
      "站内阅读弈核 Tacticore 开发周报：PydanticAI 决策框架、React 与 Tauri 桌面、备战室、指挥官工坊与战场电台的本机进展；按时间回看 REMIX 原作者历史更新，区分已实现功能与实机待验证项目。",
  },
  {
    path: "/downloads",
    title: "版本下载与发布状态 — Remix-Ai",
    label: "版本下载",
    description:
      "查看 Remix 037 开发基线与 Remix-Ai 的发布状态。下载地址和安装信息待提供，Remix-Ai 仍处于初期研发，尚未发布。",
  },
  {
    path: "/videos",
    title: "REMIX 更新视频档案 — Remix-Ai",
    label: "视频档案",
    description:
      "浏览 68 条 REMIX 历史视频，按关键词与分类查找更新记录，站内按需播放哔哩哔哩视频，并提供原始来源链接。",
  },
  {
    path: "/roadmap",
    title: "弈核 Tacticore · AI 与多 Agent 研发规划 — Remix-Ai",
    label: "AI 研发规划",
    description:
      "了解弈核 Tacticore 已完成的决策框架与本机桌面体验，以及真实宿主接线、Windows 验证、局内电台和多 Agent 的分阶段计划。Remix-Ai 基于 Remix 037；弈核独立维护，计划后续开源。",
  },
  {
    path: "/copyright",
    title: "版权与非商业声明 — Remix-Ai",
    label: "版权声明",
    description:
      "Remix-Ai 仅供学习交流与研究，非商业、非盈利。了解 Remix 原作者及贡献者、EA 与相关权利人的归属和素材来源说明。",
  },
] as const;
export const publicPaths = [
  ...pageDefinitions.map((page) => page.path),
  ...fictionCatalog.map(story => `/stories/fiction/${story.id}`),
];
export const canonicalPath = (path: string) =>
  normalizePath(path) === "/" ? "/" : `${normalizePath(path)}/`;
export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  noindex: boolean;
  image: string;
  structuredData: Record<string, unknown>;
}
export function resolveSeo(
  pathname: string,
  configuredOrigin = defaultSiteUrl,
): SeoMetadata {
  const origin = validateSiteUrl(configuredOrigin);
  const path = normalizePath(pathname);
  const page = pageDefinitions.find((item) => item.path === path);
  const fiction = findFiction(fictionIdForPath(path));
  const title = fiction ? `${fiction.title} · 断线年代 — Remix-Ai` : page?.title ?? "页面未找到 — Remix-Ai";
  const description = fiction?.summary ?? page?.description ?? "此地址没有对应内容，请返回 Remix-Ai 首页或原创世界观。";
  const canonical =
    origin +
    canonicalPath(
      path.startsWith("/") && !path.startsWith("//") ? path : "/404",
    );
  const crumbs = [{ name: "首页", url: origin + "/" }];
  if (path !== "/")
    crumbs.push({
      name: fiction?.title ?? page?.label ?? "页面未找到",
      url: canonical,
    });
  return {
    title,
    description,
    canonical,
    noindex: !page && !fiction,
    image: origin + "/materials/intro/agent-arrival-180s-v2-poster-8c67789bc0.jpg",
    structuredData: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": origin + "/#website",
          url: origin + "/",
          name: "Remix-Ai",
          inLanguage: "zh-CN",
        },
        {
          "@type": "WebPage",
          "@id": canonical + "#webpage",
          url: canonical,
          name: title,
          description,
          inLanguage: "zh-CN",
          isPartOf: { "@id": origin + "/#website" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: crumb.url,
          })),
        },
      ],
    },
  };
}
interface HeadNode {
  tag: "title" | "meta" | "link" | "script";
  attributes: Record<string, string>;
  text?: string;
}
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(
    /[<>&\u2028\u2029]/g,
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
}
export function seoHeadNodes(seo: SeoMetadata): HeadNode[] {
  const meta = (key: string, content: string, property = false): HeadNode => ({
    tag: "meta",
    attributes: { [property ? "property" : "name"]: key, content },
  });
  return [
    { tag: "title", attributes: {}, text: seo.title },
    meta("description", seo.description),
    meta("robots", seo.noindex ? "noindex, follow" : "index, follow"),
    { tag: "link", attributes: { rel: "canonical", href: seo.canonical } },
    meta("og:type", "website", true),
    meta("og:site_name", "Remix-Ai", true),
    meta("og:locale", "zh_CN", true),
    meta("og:title", seo.title, true),
    meta("og:description", seo.description, true),
    meta("og:url", seo.canonical, true),
    meta("og:image", seo.image, true),
    meta("og:image:width", "1280", true),
    meta("og:image:height", "720", true),
    meta("og:image:alt", "弈核 Tacticore · 180 秒 v2 开场影片 — Remix-Ai", true),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", seo.title),
    meta("twitter:description", seo.description),
    meta("twitter:image", seo.image),
    {
      tag: "script",
      attributes: { type: "application/ld+json" },
      text: safeJson(seo.structuredData),
    },
  ];
}
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}
export function renderSeoHead(seo: SeoMetadata): string {
  return seoHeadNodes(seo)
    .map((node) => {
      const opening = `<${node.tag} data-seo="true"${Object.entries(
        node.attributes,
      )
        .map(([name, value]) => ` ${name}="${escapeHtml(value)}"`)
        .join("")}>`;
      return node.tag === "meta" || node.tag === "link"
        ? opening
        : `${opening}${node.tag === "script" ? node.text : escapeHtml(node.text ?? "")}</${node.tag}>`;
    })
    .join("\n");
}
