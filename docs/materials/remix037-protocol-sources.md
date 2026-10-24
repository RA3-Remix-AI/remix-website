# Remix 037 协议资料来源（2026-10-24）

页面 `/protocols-037` 完整覆盖原包三阵营协议面板的 45 个按钮，每阵营 5 行 × 3 列。没有将百合子专用能力、建筑超级武器或包内其他未入协议面板的按钮混入这 45 项。

## 原始证据

本机 Remix 0.3.7 的 `assets.json`、`Extracted/data/mod.bin`、`mod-strings.json`、`decoded-token-assets.json`；未覆盖的原版引用从游戏 `GlobalStream.big` 及已提取的 StaticStream manifest/bin 补齐。所有源文件只读。

- 面板位置：`PlayerTechStoreTemplate` 的五行、每行三个购买按钮，按原序保存。
- 协议身份：`PurchasePlayerTechButtonTemplate` 对应的 `PlayerTech` 与 `ButtonSingleStateData`。
- 点数与依赖：`PlayerTech.TechPointsRequired` 和 `TechDependency`；最低军衔从实际 `PlayerTech_Generic_Rank_N` 依赖读取，不能从内部 ID 的 Rank 后缀猜测。
- 原包名称、效果与类型：按钮状态对应的中文 CSF 文案。
- 原始图标：按钮状态的 Image 引用，经 PackedTextureImage 的图集矩形裁切为 PNG；未用单位肖像替代。
- 主动冷却：从关联的 PlayerPowerButtonTemplate 找到 SpecialPowerTemplate，读取原生 ReloadTime。原生偏移 20 的 TargetType 与偏移 32 的 ReloadTime 对照官方 SDK schema；同类型冷却字段已有原分析工程独立 SDK 样本校准。
- 主动按钮状态文案同时保留。即使标题含有“Passive / Passtive”，也不据此认定协议没有主动入口。

## 文案与边界

`src/content/protocols037.json` 保留 45 项原始位置、依赖、点数、冷却、图标标识、购买和主动状态文案。
`src/content/protocol-notes.ts` 是逐项整理的主动效果、升级/授权、使用思路、理解要点与 Remix-A 取舍。

效果说明以原包按钮文案为基础；使用思路属于战术解读。没有完成全协议实机验收，不把未核对的伤害、概率、持续时间或强化倍率填成确定值；冷却时间不等于效果持续时间。学习点数不等于施放资金，未解析施放资金的条目不标作免费。

特殊核对：

- 三阵营共 45 项、每项 1 点；5 项没有独立主动入口：盟军电力转换、升阳专业开采、三阵营超级防御塔授权。
- 上下行不表示协议链。当前依赖是军衔与部分阵营条件，没有其他面板协议作为前置。
- 超时空裂缝虽然 ID 含 Rank3，最低军衔是 4；轨道垃圾雨最低军衔是 5。
- 037 天皇鬼王用于指定鬼王升级，与 Remix-A 天皇之怒不同。
- 037 超级要塞协议把指定海军转化为要塞，与 Remix-A 核心生产流程不同。
- 大量生产旧说明只强调经济升级，但配置含主动地点施放入口。`GameObject:PlayerSpellBook` 中对应 GiveProductionBonusSpecialPower 的 BuildCostBonus=-0.25，已保存为 verifiedFields；不由这个字段推断全局永久折扣、盟友收益或全部设施状态。其他关联生产设施修正也未擅填倍率。

## 重建资料

执行 `scripts/import-remix037-protocols.py`，显式传入 `--analysis`、`--base-manifest`、`--base-bin`、`--global-stream`。需要 Pillow。脚本仅写网站 JSON 快照与 PNG 图标。

原始图标版权与署名归原作及 Mod 原作者，不宣称本站原创；原作者历史资料的公开视频入口继续保留在站内档案中。
