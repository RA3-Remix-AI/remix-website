# 指挥官轻动作视频

2026-10-28 按用户要求，通过已配置的 oiioii CLI 调用 **MiniMax-H3**（模型 ID `45`、variant `minimax-h3`），分别以铁锤、堡垒、幽灵原始 PNG 为参考生成横屏人物视频。未切换到 H3 Max、Turbo 或其他模型。

## 生成与成片

- 提交参数：`2k`、`16:9`、每条 6 秒、单张人物参考图；服务端使用 `generate_video_minimax_h3` / `omni2Video`。
- 实际原生输出：**2560 × 1440，24 fps，158 帧，约 6.583 秒**。没有通过放大低分辨率视频达到目标尺寸。
- 三条均生成成功，实际各扣 66 积分，总计 **198 积分**。本轮没有付费重试。
- 官网视频保留原生 H.264 / yuv420p 视频流；只移除生成的音轨、将 MP4 索引前置，未缩放或重新编码画面。

| 指挥官 | 动作方向 | 官网 MP4 | 完整提示词 |
| --- | --- | --- | --- |
| 铁锤 | 轻抬头、调整重心，保持手扶战术桌的稳定姿态 | [hammer.mp4](../../../public/materials/commanders/hammer.mp4) | [hammer-motion-prompt.txt](hammer-motion-prompt.txt) |
| 堡垒 | 低头查看终端，随后沉着回望战场 | [bastion.mp4](../../../public/materials/commanders/bastion.mp4) | [bastion-motion-prompt.txt](bastion-motion-prompt.txt) |
| 幽灵 | 轻微侧头观察侧翼，头发与披风轻动 | [ghost.mp4](../../../public/materials/commanders/ghost.mp4) | [ghost-motion-prompt.txt](ghost-motion-prompt.txt) |

每条网页成片约 3.1–4.2 MiB。带生成音轨的原始下载保存于本地忽略目录 `intro-video/out/commander-motion-2026-10-28/`，官网仅使用上述无音轨成片。

任务 ID、参考资源、实际扣费、时长、尺寸、文件大小与 SHA-256 均记录于 [motion-manifest.json](motion-manifest.json)。不记录 API Key、授权请求头或临时签名下载地址。

## 首页播放

- 桌面用全幅横屏背景，手机复用同一横屏视频裁切人物区域；共用两个稳定的视频缓冲节点，屏幕断点变化不重建视频。
- 默认静音、内联循环播放，提前预载下一位人物。目标视频首帧可呈现前，保持当前视频与人物文案；就绪后同步切换人物并以约 180ms 淡入交接，旧层在过渡结束后暂停。原图仅用于首次加载、减少动态效果或播放失败时的回退。
- 暂停按钮同时控制影像与轮播；开场遮罩、页面隐藏、滚出视口会暂停，减少动态效果偏好下只显示静态人物图。
- 快速点选时取消过期准备，仅最新目标可以提交切换；暂停状态仍可准备目标帧，且不自动恢复播放。隐藏、离屏和卸载时取消加载监听、帧回调与计时器，释放后台缓冲的资源。

视频为 AI 生成的人物概念视觉，不是游戏实机影像。人物性格文案沿用原项目配置。
