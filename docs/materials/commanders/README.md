# 弈核指挥官人物物料

2026-10-28 使用 **Codex 内置 ImageGen** 分别生成三张原创人物概念图，供官网首页指挥官轮播使用。人物外貌为本轮视觉设计，性格文案依据弈核桌面项目已有默认指挥官配置；图像不代表游戏实机、真实人物或已验收的作战效果，也不将人格绑定为某个阵营。

| 指挥官 | 设计倾向 | 原始 PNG | 完整提示词 |
| --- | --- | --- | --- |
| 铁锤 / HAMMER | 主动侦察、集中突破；保留必要防空与经济，避免无情报的正面消耗 | [hammer.png](hammer.png) | [hammer-prompt.txt](hammer-prompt.txt) |
| 堡垒 / BASTION | 稳固资源与防线、保留预备力量；依据已侦察威胁支援，不盲目追击 | [bastion.png](bastion.png) | [bastion-prompt.txt](bastion-prompt.txt) |
| 幽灵 / GHOST | 侦察侧翼与撤退路线、建立局部优势；以机动和协同创造窗口 | [ghost.png](ghost.png) | [ghost-prompt.txt](ghost-prompt.txt) |

性格来源：`Tacticore/desktop-ui/src/state/settings.ts` 的 `defaultSettings.commanders`。仅据此提炼性格方向，没有新增伤害、胜率、模型能力等效果承诺。

## 图像与导出

- 原始图均为 1672 × 941 PNG，接近 16:9。提示词申请更高分辨率，工具实际返回上述尺寸，未上采样。
- 共用军事科幻写实概念美术：人物位于右中部，左侧预留首页文字区域；三人分别以暗红、冷蓝和琥珀色强调性格。
- 官网使用 `public/materials/commanders/{hammer,bastion,ghost}.webp`，通过 `cwebp -q 86 -m 6` 导出，单张约 171–211 KiB。PNG 保留在本目录，不进入网站静态资源目录。
- 头像为同图裁切导出：`cwebp -q 88 -m 6 -crop 750 0 600 750 -resize 384 480`，保存为 `public/materials/commanders/{id}-portrait.webp`。未重绘人物或修改颜色。
- 首页已接入以这些人物图为参考生成的 MiniMax-H3 轻动作视频，原图继续作为加载及播放失败时的回退画面。原有三阵营资料区的历史影像与来源说明单独保留。参数、成片与处理记录见 [人物动作视频记录](motion.md)。

完整原始提示词按人物分别存储于上表链接，便于后续保持造型一致。
