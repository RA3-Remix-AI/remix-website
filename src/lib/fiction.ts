import catalog from "../content/fiction-index.json";
export interface FictionMeta {
  id: string; order: number; title: string; year: string; faction: string; phase: string; commander: string; summary: string; hanCount: number; minutes: number; sections: string[];
}
export interface FictionStory extends Omit<FictionMeta, "hanCount" | "minutes" | "sections"> { sections: { title: string; paragraphs: string[] }[] }
export const fictionCatalog: readonly FictionMeta[] = catalog;
export const factionLabels: Record<string,string> = { soviet:"苏联", allied:"盟军", empire:"升阳", cross:"跨阵营" };
export const phaseLabels: Record<string,string> = { before:"融合之前", transition:"断裂与试验", after:"融合之后" };
export const commanderLabels: Record<string,string> = { hammer:"铁锤 · 莫罗佐夫", bastion:"堡垒 · 卡特", ghost:"幽灵 · 神崎凛", ensemble:"时代群像" };
export const volumes = [{ id:"before",number:"I",years:"2023—2034",title:"机器尚未有名字" },{id:"transition",number:"II",years:"2035—2037",title:"浮岛之后"},{id:"after",number:"III",years:"2038",title:"人的意志"}];
const loaders = import.meta.glob<{ default: FictionStory }>("../content/fiction/*.json");
const cache = new Map<string,FictionStory>();
export const findFiction = (id: string | undefined) => fictionCatalog.find(story => story.id === id);
export const cachedFiction = (id: string) => cache.get(id);
export async function loadFiction(id: string) {
  if (!findFiction(id)) return undefined;
  if (cache.has(id)) return cache.get(id);
  const loader = loaders[`../content/fiction/${id}.json`];
  if (!loader) throw new Error("The story file is unavailable");
  const result = (await loader()).default;
  cache.set(id, result);
  return result;
}
export const fictionIdForPath = (path: string) => /^\/stories\/fiction\/([a-z0-9-]+)\/?$/.exec(path)?.[1];
export function filterFiction(params: URLSearchParams) {
  const query = (params.get("q") ?? "").trim().toLocaleLowerCase();
  return fictionCatalog.filter(story => ["faction","phase","commander"].every(key => !params.get(key) || params.get(key) === "all" || story[key as "faction"|"phase"|"commander"] === params.get(key)) && (!query || [story.title,story.summary,story.year,commanderLabels[story.commander]].join(" ").toLocaleLowerCase().includes(query)));
}

/** Chapter numbers are supplied by the reader UI, not duplicated from manuscript headings. */
export const formatSectionTitle = (title: string) => title.replace(/^\s*[一二三四五六七八九十百零〇0-9]+[、.．]\s*/, "");
