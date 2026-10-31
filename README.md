# Remix-Ai 宣传门户

EA has not endorsed and does not support this product.

本项目未经 EA 认可或支持，非 EA 官方项目。Remix-Ai 仅供学习交流与研究，非商业、非盈利，不进行收费销售、付费访问、广告变现或其他盈利活动。Remix 原创 Mod 内容相关著作权归原作者及各贡献者；原游戏相关权利归 EA 及相应权利人。详见 [版权与非商业声明](COPYRIGHT.md)。

基于 React、TypeScript、Vite 和 React Router 的中文宣传前端。**弈核 Tacticore** 是独立的 Agent 指挥程序，已建立[独立工程仓库](https://github.com/RA3-Remix-AI/Tacticore)（当前可能需要访问权限），计划后续单独开源；**Remix-Ai** 是基于 Remix 037 的游戏内容适配版本。首页介绍弈核、展示客户端概念和实际桌面截图，并同步研发周报。PydanticAI 决策层与桌面本机功能已落地；新桌面真实宿主接线、Windows 实机验证、跨游戏适配与多 Agent 协作仍待推进，尚无正式发行版。

为了获得更好的对战体验，开发版本基于 **Remix 037** 已实装的协议与单位进行数值平衡和少量变更。原作者更新视频的集数不等于 Mod 版本号；本仓库负责宣传展示，不在浏览器中连接模型或控制游戏。

## 本地开发

需要 Node.js 22.22+。生产构建须在带 `.git` 的仓库检出中运行，并可调用 Git CLI，以筛除仅本地保留的制作素材。

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

采用 BrowserRouter，页面地址如 `/videos/`；保留旧 hash 地址的客户端兼容。正式站点域名为 `https://ra3-remix.com`，构建为 11 个主要页面与已完成的原创小说详情生成独立目录下的 `index.html`，同时生成 `404.html`、`robots.txt` 与 `sitemap.xml`。部署目标为域名根路径，静态服务需支持目录首页并对未知地址返回真正的 HTTP 404。部署平台尚未指定；构建与域名、收录相关说明见 [SEO 与静态部署](docs/seo.md)。

| 路由                  | 内容                                                       |
| --------------------- | ---------------------------------------------------------- |
| `/`                   | Agent 指挥官开场、项目愿景、研发预览与 Remix 037 基线说明         |
| `/remix-037` | 29 条原有单位与形态档案、原始肖像、对象数值与 AI版取舍 |
| `/protocols-037` | 三阵营 45 项协议图鉴、战术解读与 AI版取舍 |
| `/gameplay`           | 三阵营职责、七种单位改造前后对照、改造亮点与可筛选部队数据                           |
| `/stories`            | 《断线年代》故事书架，按阵营、融合阶段、主角和关键词筛选 |
| `/stories/world` | 原创世界观蓝本与七篇设定扩写，支持章节锚点阅读 |
| `/stories/fiction/:slug` | 完整原创小说，章节目录、阅读进度、字号、前后篇与返回筛选 |
| `/stories/:articleId` | 原作者历史详情已下线，返回未找到并标记 noindex |
| `/devlogs`            | 弈核研发周报与独立标明来源的 Remix 原作者历史更新视频                 |
| `/downloads`          | 按版本维护的下载入口                                       |
| `/videos`             | 68 条视频目录、搜索、分类、分批展示与播放器                |
| `/roadmap`            | 弈核已完成工作、下一阶段重点与后续探索，无承诺发布日期                            |
| `/copyright`          | 权利归属、非官方与非商业声明                               |

```text
src/app/App.tsx                     共享布局与路由
src/pages/                         独立页面
src/components/                    通用组件与导航
src/content/site.ts                导航、对比文案、玩法、下载与规划
src/content/tacticore-progress.ts   弈核本周进展与开发日志的共享数据
src/content/videos.ts              视频目录适配与精选更新
src/content/visuals.ts             原版 RA3 参考图与出处
src/content/story-canon.ts         原创世界观已确认蓝本
src/content/story-expansion.ts     基于蓝本的叙事扩写提案
src/components/StoryCanon.tsx      世界观时间线与阵营、指挥官设定
src/pages/StoriesPage.tsx          原创小说书架与筛选
src/pages/StoryWorldPage.tsx       世界观与设定扩写、章节导航
src/pages/FictionReaderPage.tsx    小说长文阅读器
src/content/fiction/              独立小说 JSON，每篇完整正文
src/content/fiction-index.json    自动生成的轻量目录（不含正文）
scripts/fiction-editorial.mjs     真实字数、目录生成与完整性审计
src/lib/videos.ts                  BV 白名单、筛选、日期与时长处理
src/styles/global.css              响应式布局与样式
docs/materials/remix-video-index.json  已核对的 B 站公开视频元数据
docs/materials/ra3-visual-sources.json  原版视觉素材出处记录
docs/materials/remix-story-sources.json  已阅读剧情专栏的来源与短摘要
public/materials/                  后续图片、视频等静态物料
tests/                             边界测试与路由渲染检查
```

## 当前内容覆盖

2026-10-31 起，故事区完全转为 Remix-Ai 原创内容。`/stories` 是《断线年代》小说书架；`/stories/world` 保留故事蓝本 0.9 的时间线、三阵营路线、浮岛战争、融合体指挥官与技术代价，并增加基于蓝本的七篇叙事扩写。扩写在整区入口明确标为提案，不自动升级为已确认设定。

REMIX 原作者的 40 篇历史故事已从公开页面、首页入口、站点地图和预渲染详情中移除，旧详情地址显示未找到。历史摘要、配图及署名来源仍作为本地证据保留；相关数据模块不进入网站生产依赖图，`public/materials/stories/` 不进入部署输出。原版单位/协议图鉴、历史更新视频及其版权归属继续保留。

## 动态游戏门户

首页首次会话展示 180 秒 v2 音效增强版开场影片（英文旁白 / 中英字幕），默认静音，可开启声音、暂停、跳过；主页提供重播入口。从其他页面直接进入不会弹出开场。减少动态效果偏好或浏览器报告省流 / 2G 网络时先显示静态画面，由用户主动播放。开场期间暂停后台指挥官视频与轮换，素材不可用时仍可进入网站。

网站使用 `public/materials/intro/` 中带内容哈希的 `agent-arrival-web-180s-v2-*.mp4` 与新版海报。当前成片来自 `tacticore-stroy/production/intro-cg-v2/edit-180s-v2-sound/delivery/`，桌面 720p 约 51.7 MB，手机 480p 约 12.4 MB，每次仅选择一种版本。两版均为 180 秒，展示原创分歧时间线，非游戏实机。旧 30 秒 Remotion 工程及独立制作素材仅在本地保留。素材来源与交付记录见 [开场视频记录](docs/materials/intro-video.md)。首页「弈核」现为 HTML/CSS 可交互客户端概念演示，可切换 Agent、阵营与任务，不代表真实游戏接入或多 Agent 战略接管已经完成。

首页研发进度和 `/devlogs#tacticore-2026-10-25` 同步记录 2026.10.19—10.25 本侧完成的框架、桌面本机功能、验证与文档工作。三张实际界面截图来自弈核 README 的浏览器开发预览，保存在 `public/materials/tacticore/`；它们展示本机配置与离线工具，不是 Windows 游戏实战验收。后续更新共享数据 `src/content/tacticore-progress.ts` 时，须保留日期、验证环境与下一阶段边界。

首页现展示铁锤、堡垒、幽灵三位原创概念指挥官，每 6 秒切换下一位，单段视频不循环，支持手动选择、左右键与暂停。网页专用 H.264 分为桌面 1280×720 与移动 768×432，只选择一个版本；短片按需加载并在当前首页实例中复用，避免轮播反复下载。暂停时不预取下一段，隐藏页面或离开视口时暂停；减少动态效果或省流模式下先显示海报。历史 Remix T4 影像仍作为来源素材保留，并非当前 Agent 实战。

带宽优化数据、构建排除规则与 EdgeOne 缓存配置见 [前端流量与部署](docs/performance.md)。三段视频完整文件体积减少约 80%（桌面）/ 92%（移动），旧 30 秒开场减少约 61%，图标减少约 99%；该开场比例为历史记录，不适用于当前 180 秒 v2，这些比例不等于 CDN 账单降幅。

首页以滚动视差、章节导航和卡片倾斜增强沉浸感，触屏停用鼠标倾斜与桌面视差，减少动态效果偏好下关闭新增运动效果，内容始终可读。

另有本地首页导览 `HomeTour`（2分42秒），重点介绍弈核与桌面工作区，沿用指定 MiniMax 音色、1.2 倍语速和英文 Remix 口播。已导出1080p / 30fps MP4，位于 `intro-video/out/tacticore-home-tour-2026-10-25.mp4`。预览、章节、配乐试听片段来源及字幕范围见 [首页介绍片制作记录](docs/materials/home-tour.md)；成片、视频工程与未混音素材继续仅本地保留。

`public/materials/showcase/` 保存视频片段、截帧与三张内置 ImageGen 扩展的宣传图；原始时码、处理方式和完整提示词见 `docs/materials/showcase-assets.json`。其余战场截帧及三张 AI 扩展图仍来自先前的 1080p 源，未重新生成，来源在清单中分别标注。这些是历史 Remix 影像与 AI 宣传演绎，并非 Remix-Ai 最新实机。宙斯未纳入 AI版首版；AI版钢铁堡垒的驻军定位也不同于源视频中的三炮造型。

## Remix-Ai 原创故事设定

官网已同步 `tacticore-stroy` 故事蓝本 **0.9（2026-10-29）** 的已确认设定。`/stories/world#remix-ai-canon` 可直接阅读 2023 年初代推理 AI、2035 年浮岛混战与曳取扩散、2035—2038 年试验演进，以及 2038 年融合体指挥官主线；另含三阵营算力路线、军工与平民处境和待定边界。

铁锤、堡垒、幽灵的正式姓名分别为维克托·莫罗佐夫、伊芙琳·卡特、神崎凛，稳定 ID 与现有媒体路径保留。三人原本为职业军人，2038 年登场时均已改造；剧情中的融合体不表示弈核软件已具备这些能力。原作者 40 篇历史图文仅在本地保留来源证据，不再公开展示。

叙事摘要维护于 `src/content/story-canon.ts`，人物身份维护于 `src/content/commanders.ts`。来源工作区哈希、源仓库 HEAD 与采用边界见 [设定同步记录](docs/materials/tacticore-story-sync.md)。

## 原创小说维护

小说计划与创作约束位于 `docs/editorial/fiction-contract.json`。完整稿以 `src/content/fiction/<id>.json` 交付；每篇仅计算正文段落中的 Unicode Han 汉字（不计标题、章节名、简介、标点、数字或英文），须为 5,000—10,000 字，至少五个章节。书架不把规划中的篇目伪装成已完成稿。

`npm run dev` / `npm run build` 前自动生成 `fiction-index.json`；开发服务器也监视正文增删改。目录仅收录字段匹配计划、字数合格且无重复长段落的实际正文，记录实测字数与按 400 字/分钟估算的阅读时间。`npm run fiction:audit` 要求 30 篇齐备并检查全部文件、范围和重复实质段落；生产构建也强制执行这一验收，缺稿或校验失败时停止。该脚本不能替代文学质量与蓝本一致性的独立审校。

正文通过动态导入分成独立 chunk，不放入首页主 bundle。预渲染逐篇载入全文，直达阅读页的 HTML 已含完整正文；浏览器按当前篇加载正文后水合。新稿需要重建才能进入生产站点地图，旧原作者详情仍为 404。插图按 `src/content/fiction-illustrations.json` 的 order 映射维护，`afterSection` 从 1 开始；来源记录在 `docs/editorial/fiction-illustration-sources.json`。

## 后续内容维护

- 已确认世界观维护于 `src/content/story-canon.ts`；叙事扩写维护于 `src/content/story-expansion.ts`，未经定稿不要将扩写细节写回已确认蓝本。新增篇章须使用稳定且唯一的 ID，章节导航与滚动定位随数据同步。
- `docs/materials/remix-story-sources.json`、`src/content/story-media.json` 和历史阅读模块仅为本地来源档案。不要重新导入公开页面或 SEO 模块；原作者故事配图由发布资源过滤器排除，版权来源记录继续保留。

- 下载地址提供后，在 `src/content/site.ts` 的 `downloads` 数据中填写对应版本的 `url` 并将 `status` 改为 `available`；`null` 显示等待提供或尚未发布状态，不生成下载按钮。通过 `kind` 分别指定 `base`（开发基线）、`historical`（历史版本）或 `development`（后续开发版本）。新版本须用已确认的名称与来源，勿把视频集数转成版本号。
- 截图等静态物料放入 `public/materials/`，使用 `/materials/文件名` 引用。首页当前使用上述视频与扩展图；既有 Steam《红色警戒 3》参考素材仍保留于 `public/materials/ra3/`，出处见 `docs/materials/ra3-visual-sources.json`。
- 视频索引只证明标题、日期与时长等元数据。确认 037 具体机制或故事前，应逐片核对或引用对应版本资料，不能由标题推断游戏功能。
- 视频页只接受索引中已知的 BV 号；选择视频不会直接连接第三方，点击“加载播放器”后才嵌入官方 B 站播放器，关闭自动播放，保留原站观看入口。第三方平台的登录、地区及可用性可能影响播放。
- 首页与玩法页明确区分通用 RTS 框架、待确认的 Mod 差异、尚处规划阶段的 AI 能力。AI 开发在相关项目推进，本仓库只承担宣传展示。

## Remix-Ai 单位与改造

玩法页已接入本地开发资料，支持阵营与职责搜索。当前数值为 2026-10-24 快照，素材出处与维护边界见 docs/materials/triadfront-sources.md。Remix-Ai 新规则不等于 Remix 037 原有规则。

## 037 图文档案与本版对照

037 原有内容见 `/remix-037`；Remix-Ai 改动见 `/gameplay`。两页采用本地真实肖像和模型离线预览，不使用生成图片冒充游戏画面。资料来源见 `docs/materials/remix037-sources.md`。资料原始目录中的 TriadFront 仅保留为历史路径，不代表当前产品或独立项目；软件名称为弈核 Tacticore，游戏内容适配版本为 Remix-Ai。

## 037 协议详解

`/protocols-037` 展示三阵营完整 45 项协议，含原始 5×3 面板、图标、最低军衔、点数、主动冷却、主动/升级双重说明、战术解读与 AI版取舍。支持阵营切换、搜索和 URL 直达具体协议。数据与重建方式见 `docs/materials/remix037-protocol-sources.md`。
