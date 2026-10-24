export interface NavigationItem {
  href: string;
  label: string;
  title: string;
  children?: readonly NavigationItem[];
}

export const site = {
  name: "Remix-Ai",
  baseVersion: "Remix 037",
  githubUrl: "https://github.com/RA3-Remix",
  sourceVideoUrl: "https://www.bilibili.com/video/BV1A4411g72d/",
  navigation: [
    { href: "/", label: "首页", title: "红色警戒 3 · Remix-Ai" },
    { href: "/remix-037", label: "Remix原版", title: "Remix 037 原有内容", children: [
      { href: "/remix-037", label: "单位", title: "Remix 037 原有内容" },
      { href: "/protocols-037", label: "协议", title: "Remix 037 协议详解" },
    ] },
    { href: "/gameplay", label: "AI版改动", title: "Remix-Ai 本版本改动" },
    { href: "/stories", label: "故事设定", title: "故事设定" },
    { href: "/devlogs", label: "往期记录", title: "往期开发记录" },
    { href: "/downloads", label: "版本下载", title: "版本下载" },
    { href: "/videos", label: "视频档案", title: "视频档案" },
    { href: "/roadmap", label: "AI 规划", title: "AI 开发规划" },
  ] as readonly NavigationItem[],
} as const;

export const comparisons = [
  {
    label: "内容基础",
    vanilla: "《红色警戒 3》原版游戏",
    original: "扩展单位与既有视觉资产；原有内容单独整理为图鉴。",
    remix: "本版本名称为 Remix-Ai，围绕三阵营职责重新设计玩法。",
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
    original: "原作者故事与历史视频保留为独立档案，不作为 AI版功能承诺。",
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
    title: "Remix-Ai",
    kind: "development",
    status: "planned",
    description: "基于 Remix 037 的单位与协议进行平衡调整和少量修改，探索三极战线 Agent 指挥官。当前处于初期研发，尚未发布。",
    url: null,
  },
];

export const commandDecisionCycle = [
  { title: "战场感知", description: "依游戏可见信息，整理资源、部队与已侦察战况。" },
  { title: "局势判断", description: "评估发展空间、攻防压力与兵力组合。" },
  { title: "战术决策", description: "权衡资源投入、进退时机与交战目标。" },
  { title: "部队调度", description: "尝试将作战计划转为可执行的部队指令。" },
  { title: "反馈调整", description: "观察执行后的战况，重新判断并调整计划。" },
] as const;

export const roadmap = [
  {
    number: "01",
    title: "建立指挥官的感知与执行接口",
    description:
      "以 Remix 037 为基线，评估如何获取游戏可见信息、表达部队指令与确认执行结果。决策依据限于指挥官可见的资源、己方部队和已侦察情报。",
    outcome: "拟验证：信息可用性、指令可执行性与反馈记录。",
  },
  {
    number: "02",
    title: "验证快速模型参与的指挥闭环",
    description: "让快速模型参与局势判断与战术决策，尝试完成感知、判断、决策、调度、反馈的循环。围绕资源与发展、攻防转换、兵种组合和进退时机设计对抗场景。",
    outcome: "拟验证：决策是否可执行、能否根据战况修正，以及运行稳定性与实际对抗表现。",
  },
  {
    number: "03",
    title: "探索多风格 Agent 与并肩作战",
    description:
      "在单个指挥官的闭环可行后，探索不同决策风格、多 Agent 协作和与玩家并肩作战，并延伸战役与兵种协同体验。",
    outcome: "拟验证：协作分工、风格差异与玩家体验。",
  },
  {
    number: "04",
    title: "探索与前沿通用模型对抗",
    description: "在接入、规则边界与评测方式明确后，尝试让不同模型参与同一战场的决策对抗。当前未实装这类模型对战。",
    outcome: "未来方向：比较战局判断与调度表现，范围取决于前期验证。",
  },
] as const;
