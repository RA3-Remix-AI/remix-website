# Remix-Ai 宣传门户

EA has not endorsed and does not support this product.

本项目未经 EA 认可或支持，非 EA 官方项目。Remix-Ai 仅供学习交流与研究，非商业、非盈利，不进行收费销售、付费访问、广告变现或其他盈利活动。Remix 原创 Mod 内容相关著作权归原作者及各贡献者；原游戏相关权利归 EA 及相应权利人。详见 [版权与非商业声明](COPYRIGHT.md)。

基于 React、TypeScript、Vite 和 React Router 的中文宣传前端。本版本为 **Remix-Ai**，核心方向是由**三极战线**提供不同风格的 Agent 指挥官，让玩家未来可以与 Agent 并肩作战，或与前沿通用智能模型对抗。项目目前处于开发初期，多 Agent 联合作战与完整战略接管属于后续研发目标，不能视为已发布功能。

为了获得更好的对战体验，开发版本基于 **Remix 037** 已实装的协议与单位进行数值平衡和少量变更。原作者更新视频的集数不等于 Mod 版本号；本仓库负责宣传展示，不在浏览器中连接模型或控制游戏。

## 本地开发

需要 Node.js 22.22+。

```sh
npm ci
npm run dev
npm run test       # 视频安全边界、筛选与所有页面的服务端渲染检查
npm run typecheck
npm run build      # 类型检查、前端构建并预渲染静态页面到 dist/
npm run preview
```

版权页位于 `/copyright/`，页脚保留版权声明与详情入口。

## 页面与目录

采用 BrowserRouter，页面地址如 `/videos/`；保留旧 hash 地址的客户端兼容。正式站点域名为 `https://ra3-remix.com`，构建为主要页面与故事详情生成独立目录下的 `index.html`，同时生成 `404.html`、`robots.txt` 与 `sitemap.xml`。部署目标为域名根路径，静态服务需支持目录首页并对未知地址返回真正的 HTTP 404。部署平台尚未指定；构建与域名、收录相关说明见 [SEO 与静态部署](docs/seo.md)。

| 路由                  | 内容                                                       |
| --------------------- | ---------------------------------------------------------- |
| `/`                   | Agent 指挥官开场、项目愿景、研发预览与 Remix 037 基线说明         |
| `/remix-037` | 29 条原有单位与形态档案、原始肖像、对象数值与 AI版取舍 |
| `/protocols-037` | 三阵营 45 项协议图鉴、战术解读与 AI版取舍 |
| `/gameplay`           | 三阵营职责、七种单位改造前后对照、改造亮点与可筛选部队数据                           |
| `/stories`            | 剧情与设定全量档案：分类、搜索与站内阅读入口               |
| `/stories/:articleId` | 独立图文阅读页：整理摘要、对应配图、署名、来源及同类前后篇 |
| `/devlogs`            | 原作者历史更新视频记录，并非本项目开发日志                 |
| `/downloads`          | 按版本维护的下载入口                                       |
| `/videos`             | 68 条视频目录、搜索、分类、分批展示与播放器                |
| `/roadmap`            | AI 接入拟议阶段，无承诺发布日期                            |
| `/copyright`          | 权利归属、非官方与非商业声明                               |

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

上述文章补读未新增配图；已有来源核实的配图继续使用，无对应配图的条目正常显示纯文字。

## 动态游戏门户

首页首次会话展示「2026，Agent 指挥官已到达战场」开场短片，默认静音，可开启声音、暂停、跳过；主页提供重播入口。从其他页面直接进入不会弹出开场。减少动态效果偏好下先显示静态画面，由用户主动播放。开场期间暂停后台 T4 视频与轮换，素材不可用时仍可进入网站。

网站使用 `public/materials/intro/` 中的开场成片 `agent-arrival.mp4` 与海报 `agent-arrival-poster.jpg`。Remotion 制作工程 `intro-video/` 仅在本地保留，不随仓库提交；独立配音、背景音乐片段和终端参考截图也仅本地保留。素材来源与本地重新渲染方式见 [开场视频记录](docs/materials/intro-video.md)。首页「三极战线」现为 HTML/CSS 可交互客户端概念演示，可切换 Agent、阵营与任务，不代表真实游戏接入或多 Agent 战略接管已经完成。

首页使用用户提供的 Remix 宣传片截取三大 T4 镜头，支持 8 秒轮换、手动选择、左右键与暂停。三段视频与海报现从用户提供的 3840×2160 / 60fps HEVC 源重新提取，裁去顶部水印带与底部字幕，以 2560×1040 / 30fps、CRF 20、无音轨 H.264 供网页播放（输出并非 4K）；页面保留原作者署名。隐藏页面时暂停，减少动态效果偏好或播放失败时显示海报。手机导航支持展开。

`public/materials/showcase/` 保存视频片段、截帧与三张内置 ImageGen 扩展的宣传图；原始时码、处理方式和完整提示词见 `docs/materials/showcase-assets.json`。其余战场截帧及三张 AI 扩展图仍来自先前的 1080p 源，未重新生成，来源在清单中分别标注。这些是历史 Remix 影像与 AI 宣传演绎，并非 Remix-Ai 最新实机。宙斯未纳入 AI版首版；AI版钢铁堡垒的驻军定位也不同于源视频中的三炮造型。

## 后续内容维护

- 站内阅读展示整理摘要，未提供原文全文。内容通过 `paragraph` / `heading` / `image` 结构化块渲染，不注入原始 HTML。未读取正文的文章保留目录、署名和来源入口。
- 原文配图维护于 `src/content/story-media.json`，键为文章 ID；值为 `{src, alt, caption, sourceUrl}` 数组。仅接受 `/materials/stories/` 下的本地 JPG/PNG/WebP/GIF，素材来源记录于 `docs/materials/remix-story-media-sources.json`。无图可正常阅读纯文字。

- 剧情相关图文条目统一维护于 `docs/materials/remix-story-sources.json`，`src/content/stories.ts` 全量读取，不手工限定文章 ID。页面按剧情、单位、世界观、同人和创作故事分类，支持搜索与站内详情阅读，筛选保存在 URL 参数中；从详情页返回档案时保留筛选。完整目录及非剧情排除理由保存在 `docs/materials/remix-article-inventory.json`；只有实际读取正文的条目展示摘要；新内容须先阅读原文并记录来源，区分故事内时间与发布日期，不能据此断言对应 Remix 037 的可玩战役。

- 下载地址提供后，在 `src/content/site.ts` 的 `downloads` 数据中填写对应版本的 `url` 并将 `status` 改为 `available`；`null` 显示等待提供或尚未发布状态，不生成下载按钮。通过 `kind` 分别指定 `base`（开发基线）、`historical`（历史版本）或 `development`（后续开发版本）。新版本须用已确认的名称与来源，勿把视频集数转成版本号。
- 截图等静态物料放入 `public/materials/`，使用 `/materials/文件名` 引用。首页当前使用上述视频与扩展图；既有 Steam《红色警戒 3》参考素材仍保留于 `public/materials/ra3/`，出处见 `docs/materials/ra3-visual-sources.json`。
- 视频索引只证明标题、日期与时长等元数据。确认 037 具体机制或故事前，应逐片核对或引用对应版本资料，不能由标题推断游戏功能。
- 视频页只接受索引中已知的 BV 号；选择视频不会直接连接第三方，点击“加载播放器”后才嵌入官方 B 站播放器，关闭自动播放，保留原站观看入口。第三方平台的登录、地区及可用性可能影响播放。
- 首页与玩法页明确区分通用 RTS 框架、待确认的 Mod 差异、尚处规划阶段的 AI 能力。AI 开发在相关项目推进，本仓库只承担宣传展示。

## Remix-Ai 单位与改造

玩法页已接入本地开发资料，支持阵营与职责搜索。当前数值为 2026-10-24 快照，素材出处与维护边界见 docs/materials/triadfront-sources.md。Remix-Ai 新规则不等于 Remix 037 原有规则。

## 037 图文档案与本版对照

037 原有内容见 `/remix-037`；Remix-Ai 改动见 `/gameplay`。两页采用本地真实肖像和模型离线预览，不使用生成图片冒充游戏画面。资料来源见 `docs/materials/remix037-sources.md`。原始开发目录仍名为 TriadFront，网站展示名统一为 Remix-Ai。

## 037 协议详解

`/protocols-037` 展示三阵营完整 45 项协议，含原始 5×3 面板、图标、最低军衔、点数、主动冷却、主动/升级双重说明、战术解读与 AI版取舍。支持阵营切换、搜索和 URL 直达具体协议。数据与重建方式见 `docs/materials/remix037-protocol-sources.md`。
