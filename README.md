# RA3 Remix 宣传门户

基于 React、TypeScript、Vite 和 React Router 的中文宣传前端。本项目以 **Remix 037** 为后续开发基线；原作者更新视频的集数不等于 Mod 版本号。

## 本地开发

需要 Node.js 22.22+。

```sh
npm ci
npm run dev
npm run test       # 视频安全边界、筛选与所有页面的服务端渲染检查
npm run typecheck
npm run build      # 类型检查并生成 dist/
npm run preview
```

## 页面与目录

采用 HashRouter，页面地址如 `/#/videos`，适合不提供路由回退的静态托管环境。构建默认以域名根路径为基准；如部署到子目录，需相应配置 Vite `base`。当前未发布。

| 路由                  | 内容                                                       |
| --------------------- | ---------------------------------------------------------- |
| `/`                   | 原版、Remix 037 和本项目的关系，差异与核心玩法入口         |
| `/gameplay`           | 通用 RTS 玩法与待补充的 Mod 规则                           |
| `/stories`            | 剧情与设定全量档案：分类、搜索与站内阅读入口               |
| `/stories/:articleId` | 独立图文阅读页：整理摘要、对应配图、署名、来源及同类前后篇 |
| `/devlogs`            | 原作者历史更新视频记录，并非本项目开发日志                 |
| `/downloads`          | 按版本维护的下载入口                                       |
| `/videos`             | 68 条视频目录、搜索、分类、分批展示与播放器                |
| `/roadmap`            | AI 接入拟议阶段，无承诺发布日期                            |

```text
src/app/App.tsx                     共享布局与路由
src/pages/                         独立页面
src/components/                    通用组件与导航
src/content/site.ts                导航、对比文案、玩法、下载与规划
src/content/videos.ts              视频目录适配与精选更新
src/content/visuals.ts             原版 RA3 参考图与出处
src/content/stories.ts             全量图文索引适配
src/lib/stories.ts                 阅读状态、分类与搜索处理
src/lib/story-reader.ts            详情查找、前后篇与安全内容块
src/content/story-reader.ts        摘要与配图的阅读数据适配
src/content/story-media.json       按文章 ID 关联的本地配图
src/pages/StoryReaderPage.tsx       站内阅读页
src/components/StoryBlocks.tsx     安全段落、标题与配图渲染
src/lib/videos.ts                  BV 白名单、筛选、日期与时长处理
src/styles/global.css              响应式布局与样式
docs/materials/remix-video-index.json  已核对的 B 站公开视频元数据
docs/materials/ra3-visual-sources.json  原版视觉素材出处记录
docs/materials/remix-story-sources.json  已阅读剧情专栏的来源与短摘要
public/materials/                  后续图片、视频等静态物料
tests/                             边界测试与路由渲染检查
```

## 当前内容覆盖

截至 2026-10-23，公开专栏目录共 72 篇，其中 40 篇剧情与背景相关内容均已整理为站内摘要，待补读条目为 0。原有 15 篇摘要保留，另 25 篇通过原生浏览器公开页面补读，逐篇记录 `sourceBrowserUrl`、`retrievalMethod` 与 `bodyCoverage: browser_visible_body`；精简核对记录见 `docs/materials/remix-browser-reading-log.json`。这些摘要仍不等同于原文全文，也不代表已确认适用于 Remix 037。

本轮未新增图片；已有来源核实的配图继续使用，无对应配图的条目正常显示纯文字。

## 后续内容维护

- 站内阅读展示整理摘要，未提供原文全文。内容通过 `paragraph` / `heading` / `image` 结构化块渲染，不注入原始 HTML。未读取正文的文章保留目录、署名和来源入口。
- 原文配图维护于 `src/content/story-media.json`，键为文章 ID；值为 `{src, alt, caption, sourceUrl}` 数组。仅接受 `/materials/stories/` 下的本地 JPG/PNG/WebP/GIF，素材来源记录于 `docs/materials/remix-story-media-sources.json`。无图可正常阅读纯文字。

- 剧情相关图文条目统一维护于 `docs/materials/remix-story-sources.json`，`src/content/stories.ts` 全量读取，不手工限定文章 ID。页面按剧情、单位、世界观、同人和创作故事分类，支持搜索与站内详情阅读，筛选保存在 URL 参数中；从详情页返回档案时保留筛选。完整目录及非剧情排除理由保存在 `docs/materials/remix-article-inventory.json`；只有实际读取正文的条目展示摘要；新内容须先阅读原文并记录来源，区分故事内时间与发布日期，不能据此断言对应 Remix 037 的可玩战役。

- 下载地址提供后，在 `src/content/site.ts` 的 `downloads` 数据中填写对应版本的 `url` 并将 `status` 改为 `available`；`null` 显示等待提供或尚未发布状态，不生成下载按钮。通过 `kind` 分别指定 `base`（开发基线）、`historical`（历史版本）或 `development`（后续开发版本）。新版本须用已确认的名称与来源，勿把视频集数转成版本号。
- 截图等静态物料放入 `public/materials/`，使用 `/materials/文件名` 引用。当前首页使用 Steam《红色警戒 3》官方商店的原版截图作为视觉参考，已逐处注明并非 Remix 037 截图；出处集中记录于 `docs/materials/ra3-visual-sources.json`，页面引用维护在 `src/content/visuals.ts`。
- 视频索引只证明标题、日期与时长等元数据。确认 037 具体机制或故事前，应逐片核对或引用对应版本资料，不能由标题推断游戏功能。
- 视频页只接受索引中已知的 BV 号；选择视频不会直接连接第三方，点击“加载播放器”后才嵌入官方 B 站播放器，关闭自动播放，保留原站观看入口。第三方平台的登录、地区及可用性可能影响播放。
- 首页与玩法页明确区分通用 RTS 框架、待确认的 Mod 差异、尚处规划阶段的 AI 能力。AI 开发在相关项目推进，本仓库只承担宣传展示。
