import baseline from "./remix037.json";

export const reworks = [
  { id: "Paladin", before: "反飞弹与反隐形支援", after: "拦截与辅助攻击互斥，明确模式取舍", model: "Paladin" },
  { id: "AlliedLegionnaireInfantry", before: "先进冰冻武器步兵", after: "短程地面减速，不施加完整冻结", model: "CryoLegionnaire" },
  { id: "SovietDesolatorInfantry", before: "化学防护与先进反步兵", after: "短促前向辐射喷射，不留下持续毒区", model: "Desolator" },
  { id: "SovietAntiVehicleVehicleTech2", before: "磁暴冲击，强调车辆瘫痪", after: "只压制敌方地面载具射速，不限制移动", model: "TeslaTank" },
  { id: "JapanArcherInfantry", before: "防空 / 对地双重定位", after: "专职对空，取消地面溅射与死亡二次攻击", model: "ArcherMaiden" },
  { id: "SAAV4", before: "拥有自身重火力的重型两栖坦克", after: "容纳 6 人的驻军支援平台，取消自身武器", model: "IronFortress" },
  { id: "JapanFortressShipEgg", before: "核心展开为具备对地 / 防空职责的平台", after: "核心部署、海空转换与定向攻坚，需防空护航", model: "GigaFortress" },
] as const;

const reworked = new Set<string>([...reworks.map(unit => unit.id), "JapanFortressShip"]);
const conventional = new Set([
  "AlliedAntiVehicleVehicleTech1", "SovietAntiVehicleVehicleTech1", "JapanAntiVehicleVehicleTech1",
  "AlliedAntiVehicleVehicleTech3", "SovietAntiVehicleVehicleTech3", "JapanAntiVehicleVehicleTech3",
]);
export function adoptionFor(id: string) {
  if (reworked.has(id)) return "Remix-Ai 改造";
  if (conventional.has(id)) return "Remix-Ai 常规基础";
  return "未纳入 AI版首版";
}
export function baselineFor(index: number) {
  return baseline.units.find(unit => unit.id === reworks[index]?.id);
}
export const illustratedChanges = [
  { image: "IronFortress", caption: "钢铁堡垒 · 037 底材参考", steps: ["部队搭配", "驻扎准备", "驻军输出"] },
  { image: "TeslaTank", caption: "磁爆坦克 · 037 底材参考", steps: ["正面牵制", "侧后包夹", "兵种克制"] },
  { image: "CryoLegionnaire", caption: "冰冻军团 · 037 底材参考", steps: ["侦察信息", "减速窗口", "精确协同"] },
  { image: "Desolator", caption: "化学部队 · 037 底材参考", steps: ["工事推进", "战场回收", "局部过载"] },
  { image: "GigaFortress", caption: "超级要塞 · 037 底材参考", steps: ["部署核心", "选择形态", "舰队护航"] },
  { image: "Paladin", caption: "帕拉丁 · 037 底材参考", steps: ["脱战维修", "有限保护", "重新接战"] },
] as const;
