# 前端流量与部署

2026-10-28 完成首页媒体交付优化。未改动 6 秒切换、单段不循环的展示节奏。此记录区分文件体积、浏览器请求和部署包大小，不能直接据此承诺 CDN 账单降幅。

## 实测文件体积

以下 MB / KB 采用十进制；为完整文件之和，不是首屏实际下载量。

| 资源 | 优化前 | 优化后 | 减少 |
| --- | ---: | ---: | ---: |
| 三位指挥官视频，桌面 | 11.90 MB | 2.41 MB | 79.7% |
| 三位指挥官视频，移动 | 11.90 MB | 0.895 MB | 92.5% |
| 30 秒开场，保留原音轨 | 8.52 MB | 3.29 MB | 61.3% |
| 三阵营图标 | 3.56 MB | 47.9 KB | 98.65% |
| 战场图 | 352.5 KB | 67.6 / 129.6 / 215.8 KB | 按所选尺寸变化 |

前三类（视频、开场、图标）合计从 23.98 MB 变为桌面 5.75 MB / 移动 4.24 MB，分别减少 76.0% / 82.3%。只有完整播放三段与开场、加载全部图标，且没有缓存时，才接近这个文件总量；实际还包含其他页面资产。不能将“每个访问”直接按这个数字计算。

视频 H.264 / yuv420p，faststart；桌面 1280×720、移动 768×432，保留原帧率和时长。开场原 AAC 音轨直接复制，配音与音乐不变。原母版保存在本地 Git 忽略目录 `intro-video/out/home-media-masters-2026-10-28/`，可从优化前 Git 版本恢复；制作来源未改变。派生与校验数据见 [视频清单](materials/home-media-optimization.json)、[图片清单](materials/home-image-optimization.json)。图标来自原阵营素材缩小与压缩，没有重绘。

## 请求策略

- 指挥官根据首页初始宽度选择一套视频；窗口尺寸变化不会再请求另一套。战场图片通过 `srcset` 与 `sizes` 交给浏览器选择尺寸，通常也受设备像素比影响。
- 当前片播放后才预取下一片，不一次下载三片。成功短片保留于当前首页实例的 Blob 缓存，后续轮播无需反复取远端 URL；最多三片，每片不超过 8 MiB。离开首页即中止未完成请求、撤销 Blob URL。
- 暂停时停止下一片的预取；页面隐藏、开场遮罩和离屏停止后台播放与准备。暂停时手动选择仍能按需载入目标画面。
- 支持 Network Information API 的浏览器，在 `saveData=true` 或 `effectiveType=2g/slow-2g` 时默认显示海报，点击“启用动态”才加载指挥官视频。开场同样先不设置视频 `src`，允许手动播放或直接进入网站。不能检测该 API 的浏览器维持正常播放；不能把该策略视为所有移动网络都自动省流。
- 减少动态效果偏好继续生效。媒体不可用时展示原海报，保留导航与阅读。

`preload="none"` 只是浏览器提示；此处对开场延迟赋予 `src`，对指挥官由按需请求控制实际下载。参考 [MDN preload](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preload) 与 [Save Data](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData)。

## 生产构建

Vite 默认会把整个 `public/` 原样复制，Git 忽略不会阻止这一行为。此前本地 `public/materials/home-tour/` 约 18 MiB 制作图片、配音和音乐也进入构建输出；它们并不全被首页请求，但扩大了发布包，并可能随静态站点发布。见 [Vite publicDir](https://vite.dev/config/shared-options#publicdir)。

现关闭 `build.copyPublicDir`，由 `scripts/public-assets.mjs` 仅复制 Git 已跟踪、或尚未跟踪但未被忽略的 `public/` 文件；工作区已删除文件不恢复，软链拒绝发布。本地制作物料留在磁盘，不会进入 `dist/`。原始图标和历史参考素材仍保留在网站资源中用于可追溯；未被页面引用不会产生对应浏览流量。

构建需要 Git CLI 与 `.git` 仓库元数据，应从 Git checkout 执行 `npm ci && npm run build`。不支持直接在不含 `.git` 的源码 ZIP 运行构建；这种情况下会明确失败，防止悄悄退回全量复制。新增网站素材须确认未被 `.gitignore` 排除，并在部署前纳入提交。

## EdgeOne 缓存

2026-10-28 从正式站读取到 `server: edgeone makers`。当时旧指挥官视频响应为 `Cache-Control: public,max-age=0,must-revalidate`，虽然已有 ETag 与边缘缓存命中，浏览器仍需重新验证。

仓库根目录 `edgeone.json` 为 Vite 带哈希的 `/assets/*`，以及本次带内容哈希的 MP4 / WebP 设置 `public, max-age=31536000, immutable`。HTML 保留平台默认的新鲜度校验，不对整站设置一年缓存，也不添加 SPA 全量回退规则，保持已预渲染页面与真实 404 的语义。未更改云端控制台，配置需部署后由 EdgeOne 读取。格式依据 [EdgeOne headers 配置](https://pages.edgeone.ai/document/edgeone-json) 与 [缓存说明](https://pages.edgeone.ai/document/configuring-cache)。

文件内容变化必须生成新哈希文件名并更新页面引用；不得覆盖同一长缓存 URL。旧的非哈希母版 MP4 已移出 `public/`，生成清单保留其历史路径。其他稳定名称图片未被赋予一年 immutable。规则中的 `*` 是 URL 通配符，最多一个，不能按文件系统 Glob 写多颗星。

部署后验证首页仍为短缓存、JS / 新视频 / WebP 为长缓存，且 Range 请求正常。示例（将视频路径替换为清单中的当前文件）：

```sh
curl -I https://ra3-remix.com/
curl -I https://ra3-remix.com/materials/commanders/hammer-desktop-4d5d4524dc.mp4
curl -I -H 'Range: bytes=0-1023' https://ra3-remix.com/materials/intro/agent-arrival-web-f031e53afa.mp4
```

浏览器中分别观察冷缓存与重复访问、首次三位轮播与再次轮播，确认只请求一套尺寸、成功短片没有反复取网、跳过开场不会继续下载。再对照 CDN 的实际下行字节、缓存命中、独立访客、机器人及热链情况；缓存只能减少重复访客和重复轮播的传输，不能消除新访客冷下载成本。

## 本轮验证

45 项现有与新增测试通过，类型检查及生产构建通过，生成 50 个可索引页面。新增测试覆盖短片复用与取消、暂停不预取、省流判断、过期异步加载、构建排除及软链边界。七段派生视频完整解码、文件大小与 SHA256 校验通过。`dist/materials/home-tour/` 不存在。本轮还未推送或部署，线上响应头仍需发布后核验。
