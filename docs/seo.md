# SEO 与静态部署

正式域名为 `https://ra3-remix.com`。仓库提供可部署的静态页面；域名绑定、HTTPS、托管平台、搜索平台验证与站点地图提交仍需在上线时完成。生成文件不代表已经部署或被搜索引擎收录。

## 构建与网址

```sh
npm ci
npm run build
```

发布整个 `dist/`，包括 HTML、资源、媒体、`robots.txt` 与 `sitemap.xml`。构建为 10 个主要路由及当前 40 篇故事详情生成目录首页，并生成独立 `404.html`。故事数量随内容索引更新，不在部署配置中手工维护。

构建末尾由 `scripts/prerender.mjs` 生成静态页面。`src/seo/metadata.ts` 统一维护页面元数据，`src/components/SeoMetadata.tsx` 负责客户端切换页面时同步 head；`src/seo/navigation.ts` 处理旧链接迁移和路径归一化。

规范网址使用 HTTPS、无 `www` 的正式域名及末尾斜杠，例如 `https://ra3-remix.com/videos/` 与 `https://ra3-remix.com/stories/文章ID/`。首页为 `https://ra3-remix.com/`。搜索、筛选等查询参数不创建新的规范页面；站点地图只列规范内容地址。

构建时可覆盖公开站点地址：

```sh
VITE_SITE_URL=https://ra3-remix.com npm run build
```

`VITE_SITE_URL` 是公开元数据，不是秘密。这里只配置完整站点 origin；本项目按域名根路径部署，不把它当作子目录部署开关。修改域名后应重新构建，使 canonical、分享网址和站点地图保持一致。正式发布前确认没有使用本地或临时预览域名。

BrowserRouter 支持直接访问页面。旧 hash 路由通过客户端兼容转换；URL 片段不会发送到服务器，因此这不是服务器 301。新分享链接和站点地图统一使用普通路径。

## 静态服务器需要做什么

托管服务应直接返回 `/videos/index.html`、`/stories/文章ID/index.html` 等目录首页。存在的页面返回 200；不存在的地址使用 `404.html` 展示站内错误页，HTTP 状态仍须为 404。不要启用“所有未知地址都用首页返回 200”的 SPA 回退，否则错误页可能形成 soft 404。[Google 的 HTTP 状态说明](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes)解释了服务器状态与索引的关系。

如最终使用 nginx，可将以下片段放进已配置域名与 HTTPS 的 `server` 块。路径仅为部署示例，按实际发布目录替换；这不是已经应用的服务器配置。

```nginx
root /srv/ra3-remix/dist;
index index.html;

location / {
    try_files $uri $uri/ =404;
}

error_page 404 /404.html;
location = /404.html {
    internal;
}
```

目录请求由 `index.html` 响应，缺失路径走 404；不要把 `error_page` 改成 `=200`。参见 nginx 的 [try_files](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files) 与 [error_page](https://nginx.org/en/docs/http/ngx_http_core_module.html#error_page)。其他托管平台需要设置相同语义的目录首页和自定义 404，配置名称由平台决定。

上线后用真实公开地址检查：首页、视频页、一个故事页返回 200；不存在的路径返回 404；HTML 源码已有相应正文与页面标题；`robots.txt`、`sitemap.xml` 和分享海报可直接访问。Vite 开发或预览服务器的回退行为不能替代生产 HTTP 状态验收。若同时提供 HTTP 或 `www` 地址，应在托管层将它们永久重定向到正式 HTTPS 域名。

## 页面元数据与内容边界

页面使用各自的标题、描述与 canonical。规范链接、站点地图和分享网址应指向同一个公开页面，避免将查询变体当成独立内容。[Google 的 canonical 指南](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)说明了这些信号的作用。

Open Graph 等分享元数据使用同一张本地静态海报 `/materials/intro/agent-arrival-poster.jpg`（1920×1080），不依赖自动播放视频才能显示预览。海报属于宣传视觉，不能据此把视频或 AI 演绎标注成当前版本实机。更新海报时保留来源记录，并重新构建；社交平台可能需要刷新自己的分享缓存。

当前 JSON-LD 使用 `WebSite`、`WebPage` 与 `BreadcrumbList`，只描述页面实际呈现的信息。故事页展示的是整理摘要与来源，不是已授权转载的原文全文；保留原作者署名，不把站点写成原故事作者。Remix-Ai 处于初期研发，多 Agent、模型对抗和部分指挥能力是计划或验证方向。不能在结构化数据中添加不存在的发布日期、评分、价格、可下载产品或已完成 AI 能力。依据 [Google 结构化数据政策](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)，结构化数据应与可见内容一致，也不保证获得特殊搜索展示。

## 上线后的搜索平台操作

1. 在 [Google Search Console](https://search.google.com/search-console/) 验证域名或站点所有权，再提交 `https://ra3-remix.com/sitemap.xml`。
2. 在 [Bing Webmaster Tools](https://www.bing.com/webmasters/) 添加并验证站点，再提交同一个站点地图。
3. 使用各平台的 URL 检查与索引报告观察实际抓取结果；检查规范网址、404、页面正文和资源访问情况。

这些步骤尚未代用户执行。站点地图是发现网址的提示，不保证抓取或收录；无需每次访问都提交。[Google 站点地图指南](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)提供提交与维护说明。

## 后续维护

新增故事时按现有来源索引与阅读数据维护流程补充真实标题、摘要、署名和来源，再重新构建。构建应自动生成详情 HTML 与站点地图条目；抽查新页面的 canonical、标题、摘要与正文是否一致。不要用原文发表日期冒充本站整理发布日期，也不要仅为 SEO 更新日期。

新增主路由或修改页面定位时，同时维护对应元数据与预渲染路由列表。删除页面后移除站点地图条目；若有明确替代内容，再由部署层配置对应永久重定向，否则保留真实 404。无需追加关键词堆砌或无法验证的功能承诺。
