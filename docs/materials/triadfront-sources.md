# Remix-A 本地开发资料快照（2026-10-24）

网站展示名为 Remix-A；本轮内容整理自同级本地 TriadFront 工程，不把其玩法配置归为 Remix 037 原版内容。

- `triadfront-changes-2026-10-24.txt`：改动清单原样快照，涵盖建筑、协议、常规部队、新增单位、T4 与已知问题。
- `src/content/unit-budgets.json`：来自 `TriadFront/config/unit-budgets.json` 的当前预算快照，含陆海生产变体。
- `src/content/units.ts`：根据改动清单、`reports/new-units.json` 和 `design/scope.json` 整理的中文展示文案；数值为开发值。
- `public/materials/units/`：来自 `TriadFront/references/remix037/` 的七张肖像 PNG；由本机 Remix_0.3.7.big 提取，仅作来源视觉参考，不代表最终二创或实机表现，不宣称原创。保留原作者权益。

当前工程以官方 RA3 SDK 1.12 构建独立 Mod，使用原版与 037 现有视觉资产；没有据此认定导入了 037 的玩法对象、协议、音效或地图。

更新内容时重新核对源工程，特别注意：超级要塞核心 800 生命、平台 5000 生命；钢铁堡垒撤出驻军入口仍未解决；离线编译检查不代表实战验收。
