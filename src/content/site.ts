export const site = {
  name: "Remix-A",
  baseVersion: "Remix 037",
  githubUrl: "https://github.com/RA3-Remix",
  sourceVideoUrl: "https://www.bilibili.com/video/BV1A4411g72d/",
  navigation: [
    { href: "/", label: "首页", title: "红色警戒 3 · Remix-A" },
    { href: "/remix-037", label: "037 图鉴", title: "Remix 037 原有内容" },
    { href: "/protocols-037", label: "037 协议", title: "Remix 037 协议详解" },
    { href: "/gameplay", label: "A 版改动", title: "Remix-A 本版本改动" },
    { href: "/stories", label: "故事设定", title: "故事设定" },
    { href: "/devlogs", label: "往期记录", title: "往期开发记录" },
    { href: "/downloads", label: "版本下载", title: "版本下载" },
    { href: "/videos", label: "视频档案", title: "视频档案" },
    { href: "/roadmap", label: "AI 规划", title: "AI 开发规划" },
  ],
} as const;

export const comparisons = [
  {
    label: "内容基础",
    vanilla: "《红色警戒 3》原版游戏",
    original: "扩展单位与既有视觉资产；原有内容单独整理为图鉴。",
    remix: "本版本名称为 Remix-A，围绕三阵营职责重新设计玩法。",
  },
  {
    label: "兵种与表现",
    vanilla: "以原版游戏内容为参照",
    original: "帕拉丁、冰冻军团、磁爆坦克、弓箭少女与要塞等已有内容。",
    remix: "改造五个常规单位、重做两种要塞；调整建筑、协议与装甲分层。",
  },
  {
    label: "人机与战役",
    vanilla: "以原版对抗与战役体验为参照",
    original: "原作者故事与历史视频保留为独立档案，不作为 A 版功能承诺。",
    remix: "拟探索 AI 人机对抗、战役及兵种选择；目前均属规划，未发布。",
  },
] as const;

export const gameplay = [
  {
    number: "01",
    title: "发展基地",
    description: "围绕资源与生产展开布局，为后续行动建立基础。",
  },
  {
    number: "02",
    title: "侦察与判断",
    description: "观察地图与对手动向，决定扩张、防守或进攻的时机。",
  },
  {
    number: "03",
    title: "组合与调度",
    description: "结合不同单位的分工组织部队，在战场中调整作战方式。",
  },
] as const;

export interface DownloadRelease {
  id: string;
  title: string;
  kind: "base" | "historical" | "development";
  status: "available" | "awaiting-link" | "planned";
  description: string;
  url: string | null;
}
export const downloads: DownloadRelease[] = [
  {
    id: "remix-037",
    title: "Remix 037",
    kind: "base",
    status: "awaiting-link",
    description: "本项目选定的开发基线。下载地址、安装说明与兼容要求待提供。",
    url: null,
  },
  {
    id: "project-development",
    title: "Remix-A",
    kind: "development",
    status: "planned",
    description: "本版本：单位职责、要塞、三阵营协议与基础规则改造。当前仍在开发测试，尚未发布。",
    url: null,
  },
];

export const roadmap = [
  {
    number: "01",
    title: "确认基线与接入条件",
    description:
      "整理 Remix 037 的玩法、版本和运行资料，评估游戏状态读取、决策执行与模型响应延迟。",
    outcome: "提议目标：形成可验证的接入方案。",
  },
  {
    number: "02",
    title: "探索快速模型与人机对抗",
    description: "研究快速模型参与人机决策的方式，并验证稳定性与实际对抗表现。",
    outcome: "提议目标：验证 AI 决策能否在游戏中有效运行。",
  },
  {
    number: "03",
    title: "探索战役与兵种选择",
    description:
      "在接入可行的基础上，尝试战役体验与兵种选择辅助；范围随验证结果调整。",
    outcome: "提议目标：确定值得继续开发的玩法方向。",
  },
] as const;
