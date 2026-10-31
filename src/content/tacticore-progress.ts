/** Weekly progress is shared by the homepage and the dated development archive. */
export const tacticoreProgress = {
  periodLabel: "2026.10.19 — 10.25",
  publishedAt: "2026-10-25",
  title: "弈核开发周报：指挥核心与桌面工作台",
  summary: "这一周，弈核完成决策框架迁移与桌面重构，把战前准备、指挥风格和电台素材整理为可操作的本机体验。下一步接通真实宿主，再到 Windows 战场逐项验证。",
  completed: [
    {
      title: "决策模型层接入 PydanticAI",
      body: "三个模型命令入口统一使用默认运行时；战局记忆、任务、视野约束与执行校验继续由弈核宿主管理，模型返回不等于游戏执行成功。",
    },
    {
      title: "统一 React + Tauri 桌面",
      body: "移除旧 Windows 界面，建立六个工作区，覆盖备战、作战、指挥官、电台、模型连接与演练记录；macOS 原生开发窗口已构建并检查。",
    },
    {
      title: "三项本机体验落地",
      body: "备战计划可保存与导出；工坊提供四种打法预设、五维五档偏好；电台支持本地视频、音频、字幕素材与六类场景演练。游戏应用与事件同步待接线。",
    },
    {
      title: "补齐交接、指南与来源记录",
      body: "更新 README、真实桌面截图、玩家指南、Feature 计划与 Windows 验证顺序，单独记录参考工程、实际复用和素材归属。独立工程已同步 GitHub，计划后续独立开源。",
    },
  ],
  next: [
    "接通新桌面与真实宿主：完成检查、启动、观察和停止回执。",
    "对接游戏设置读回、指挥偏好下发，以及真实战况驱动的电台通讯。",
    "在 Windows 验证模型兼容性、网络取消与受控实战，再推进伴随小窗、战后复盘和多 Agent。",
  ],
  evidence: [
    "macOS 开发验证：32 项前端测试、28 项模型运行时测试通过。",
    "策略回归 166 项通过，2 项 Windows DPAPI 测试在 macOS 跳过。",
    "TypeScript、Vite 与 Tauri macOS debug 应用构建通过；本轮未调用付费模型或启动游戏。",
  ],
  repositoryUrl: "https://github.com/RA3-Remix-AI/Tacticore",
  reportUrl: "/devlogs#tacticore-2026-10-25",
} as const;
