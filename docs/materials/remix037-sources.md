# Remix 037 图文资料与 Remix-A 对照

展示名称：本版本为 Remix-A。TriadFront / 三极战线仅保留为本地开发源目录、历史资料名称，不作为本版网站品牌。

## 037 原有内容

- 原包：本机 `Mods/Remix037/Remix_0.3.7.big`，只读。
- 原始对象解析：本地 `E:/RA3Modding/Analysis/Remix037/decoded-token-assets.json`。
- 中文名称与定位：同目录 `mod-strings.json`。
- 原始肖像：依据 `assets.json` 的 PackedTextureImage 引用，读取对应纹理图集并按原生矩形裁切，输出 PNG。个别肖像引用原版 StaticStream 的纹理，按资源键补齐，不任意替图。
- 选题与整理说明：`remix037-curation.json`。共 29 条代表性单位与形态记录，包含 037 扩展单位与六种常规装甲，不宣称完整生产名册。
- 站内快照：`src/content/remix037.json`，逐条保留对象、肖像、纹理与资源来源标识。
- 本地素材：`public/materials/remix037/`。

对象字段证明存在该配置，不能单凭对象价格和时间认定正常生产入口。核心与展开平台分开；0 秒展示为未列时长，不当作瞬间招募。

## Remix-A 改动

文案与当前数值来自本地 TriadFront 改动清单与开发数据，见 `triadfront-sources.md`。五个常规单位与两种要塞是对已有素材和定位的重新设计，不称为相对 037 全新出现的单位。

- 对照表中的 037 数值来自原始对象；A 版预算来自本地测试工程。
- 钢铁堡垒对照 037 `SAAV4` 平台，生产方式不同，不将原来的 0 秒解释为可正常瞬间生产。
- 超级要塞数值对照采用 `JapanFortressShipEgg` 核心：037 核心 9000/40 秒/400 生命；A 版核心 5000/50 秒/800 生命。展开平台另行说明。
- 规则卡片中的流程为 Remix-A 战术示意；配图为对应 037 原始模型的离线预览，不能证明 A 版最终外观或运行效果。

## 视觉来源

肖像、模型、贴图和动画属于原作与 Mod 原作者素材，不宣称原创。模型预览来自 `TriadFront/references/remix037/models/*-mesh.png`，由本地解析器离线渲染；绑定姿态不等于游戏待机动画。原作者公开内容继续由站内往期视频与故事档案链接提供署名和来源。

可通过 `scripts/import-remix037.py` 从同一份本地解析结果重建 037 快照与肖像，参数要求显式提供 analysis、base-manifest 与 base-bin；不会修改游戏文件。
