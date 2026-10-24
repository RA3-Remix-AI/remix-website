# Remix-Ai 开场视频

Remotion 工程位于 `intro-video/`，仅在本地保留，不纳入 Git 仓库，也不参与网站构建。独立 MiniMax 配音、BGM 片段和终端参考截图同样仅本地保留；仓库中的网站使用混音后的 MP4 成片与海报。主合成 `AgentArrival` 为 1920 × 1080、30 fps、30 秒（900 帧）。画面包含中文说明，静音也可理解。

## 内容与时间线

| 时间     | 场景      | 内容                                      |
| -------- | --------- | ----------------------------------------- |
| 0–5 秒   | Arrival   | 2026，Agent 指挥官已到达战场              |
| 5–11 秒  | Factions  | 弈核 Tacticore 与不同风格的 Agent                |
| 11–19 秒 | Alliance  | 未来并肩协同或对抗前沿通用模型            |
| 19–25 秒 | Decisions | 判断、协同、应变；Remix037 基线与现有调整 |
| 25–30 秒 | Closing   | Remix-Ai 品牌、开发初期及非商业声明       |

弈核 Tacticore 为 Agent 指挥系统，Remix-Ai 为基于 037 的游戏适配版本。AI 与多智能体玩法均作为开发方向呈现；历史 Remix T4 影像不是当前 AI 玩法实机。每个场景另有独立 composition 便于编辑。

## 本地重新渲染

以下命令仅适用于仍持有 `intro-video/` 制作工程及独立制作物料的本地环境；仅克隆网站仓库无法执行这些命令。网站运行不依赖该工程。

```sh
cd intro-video
npm ci
npm run dev
# 打开 http://localhost:3030/AgentArrival
npm run typecheck
npm run poster
npm run render
```

输出约定：

- `public/materials/intro/agent-arrival.mp4`
- `public/materials/intro/agent-arrival-poster.jpg`

`--public-dir ../public` 直接复用网站素材，没有再次复制 T4 片段和徽记。渲染需要 Remotion 的浏览器运行时；可执行 `npx remotion browser ensure` 安装。上述 render 为 H.264 / yuv420p，CRF 20，两个并发渲染器。

## 素材来源与范围

- `public/materials/showcase/{iron-fortress,giga-fortress,zeus}.mp4`：用户提供的历史 Remix 视频裁切，原创发布者 knight-vvv。完整出处、截取时间和处理说明见 [showcase-assets.json](showcase-assets.json)。三个站内片段均无音轨。
- `public/materials/showcase/{battlefield,iron-fortress-wide}.jpg`：同一历史视频的已有静帧，来源记录同上。
- `public/materials/factions/{soviet,allied,empire}.png`：用户提供的 RA3 原阵营徽记截图，经图像工具提取适配，详见 [faction-emblems.json](faction-emblems.json)。不作为独立原创商标宣称。
- 背景音乐：《Hell March 3》，作曲 Frank Klepacki，来自其[官网 Music Demos](https://www.frankklepacki.com/listen/music-demos) 中标为《Command & Conquer: Red Alert 3》的条目。查阅于 2026-10-24。原始音频链接：<https://static1.squarespace.com/static/5cb8811d5239585cb782f0e0/5cdc9ae6f9619a3ad193f68b/5cdcd2fe104c7b9d1ea08a3e/1559668436074/Hell+March+3.mp3>。
- 本地制作物料保留该音乐 **00:40.000–01:10.000** 的 30 秒片段 `public/materials/intro/hell-march-3-excerpt.m4a`，不随仓库提交；网站成片已混入该片段。48 kHz 立体声 AAC 192 kbps，响度目标 -20 LUFS，峰值目标 -3 dBTP，首 0.5 秒淡入、末 1.6 秒淡出；来源整曲不进入网站或仓库。公开试听来源不等于另行授予使用许可。
- 正式旁白使用 MiniMax，独立制作文件 `minimax-01.mp3` 至 `minimax-05.mp3` 仅本地保留，不随仓库提交，网站播放混音成片：`speech-2.8-hd`、`ttv-voice-2026030721382326-G0G3MsUf`，速度 1.33、音调 0、calm，44.1 kHz 单声道 MP3。实际生成设置和文字保存在 `intro-video/generated/minimax-NN.json`。本地 API 密钥由调用脚本读取，不进入素材或源代码。
- 五句旁白从 0.5 / 5.5 / 11.4 / 19.4 / 25.6 秒开始，时长 2.879274 / 2.751565 / 4.098322 / 3.041814 / 2.275556 秒；不对配音做额外加速。`src/soundtrack.ts` 将音乐音量从 0.8 平滑降到旁白期间的 0.3，攻击 0.25 秒、释放 0.45 秒。最后一句结束后仍有 约 2.12 秒尾声。
- `public/materials/intro/commander-terminal.png` 为本地终端参考截图，不随仓库提交；首页已使用 HTML/CSS 可交互客户端概念演示。
- 被弃用的本地 Tingting 旁白和自制终端声床已移至被 Git 忽略的 `intro-video/out/legacy-audio/`，不参与网站构建。`npm run audio:placeholder` 也仅写入该备份目录。

原游戏与 Mod 权利归相应权利人；项目仅学习交流，具体声明见根目录 `COPYRIGHT.md`。文件引用和加工不改变第三方权利归属。

## 当前检查

已完成 TypeScript 检查、900 帧正式渲染与全片 ffmpeg 解码，无解码错误。已检查实际成片的第 3、8、15、22、27 秒画面，文字与徽记无重叠或裁切；海报使用第 90 帧。

ffprobe：H.264 1920×1080、30fps、视频 30.000 秒；AAC 48kHz 立体声，容器 30.016 秒（音频封装尾帧），文件 8,516,419 字节。ffmpeg volumedetect：平均 -23.9 dB，峰值 -7.2 dB，无满幅削波。2026-10-25 将原项目旧名统一更新为弈核 Tacticore，仅重新生成第 2 句旁白「弈核，让不同风格的指挥官加入战局。」；沿用用户指定音色、1.33 语速、其他四段旁白和原 BGM。第 2 段音乐压低窗口为 5.5–8.251565 秒。重新完成 900 帧渲染、海报输出及全片解码；本次检查第 3、8 秒画面，页脚与主标题均为弈核 / TACTICORE，无旧名或文字裁切。音频主观试听与网页播放由主任务继续验证。
