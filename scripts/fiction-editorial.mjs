import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
export const countHan = text => (text.match(/\p{Script=Han}/gu) ?? []).length;
export const bodyText = story => story.sections.flatMap(section => section.paragraphs).join("\n");
export function inspectFiction() {
  const contract = JSON.parse(readFileSync(resolve(root, "docs/editorial/fiction-contract.json"), "utf8"));
  const plan = Object.values(contract.allocation).flat();
  const directory = resolve(root, "src/content/fiction");
  mkdirSync(directory, { recursive: true });
  const stories = [], errors = [], duplicates = new Map(), orders = new Set(), ids = new Set();
  for (const file of readdirSync(directory).filter(file => file.endsWith(".json")).sort()) {
    let story;
    try { story = JSON.parse(readFileSync(resolve(directory, file), "utf8")); }
    catch { errors.push(`${file}: invalid JSON`); continue; }
    const issues = [];
    const expected = plan.find(row => row[0] === story.order);
    if (!expected) issues.push("order not in the 30-story plan");
    if (typeof story.id !== "string" || !/^\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(story.id) || basename(file, ".json") !== story.id) issues.push("id must match the ASCII filename");
    if (ids.has(story.id) || orders.has(story.order)) issues.push("duplicate id/order");
    ids.add(story.id); orders.add(story.order);
    if (expected) for (const [index, key] of [[1,"title"],[2,"year"],[3,"faction"],[4,"phase"],[5,"commander"]]) if (String(story[key]) !== String(expected[index])) issues.push(`${key} differs from the agreed plan`);
    if (typeof story.summary !== "string" || countHan(story.summary) < 80 || countHan(story.summary) > 120) issues.push("summary must contain 80–120 Han characters");
    if (Number(story.id?.slice(0,2)) !== story.order) issues.push("id prefix differs from order");
    if (!Array.isArray(story.sections) || story.sections.length < 5 || story.sections.some(s => typeof s.title !== "string" || !s.title.trim() || !Array.isArray(s.paragraphs) || !s.paragraphs.length || s.paragraphs.some(p => typeof p !== "string" || !p.trim()))) {
      issues.push("at least five titled sections with nonempty paragraphs required");
      errors.push(...issues.map(issue => `${file}: ${issue}`)); continue;
    }
    const hanCount = countHan(bodyText(story));
    if (hanCount < 5000 || hanCount > 10000) issues.push(`body Han count ${hanCount} outside 5000–10000`);
    for (const paragraph of story.sections.flatMap(s => s.paragraphs)) {
      const normalized = paragraph.replace(/[^\p{Script=Han}a-z0-9]/giu, "");
      if (countHan(normalized) < 60) continue;
      if (duplicates.has(normalized)) issues.push(`repeated substantive paragraph also in ${duplicates.get(normalized)}`);
      else duplicates.set(normalized, file);
    }
    errors.push(...issues.map(issue => `${file}: ${issue}`));
    if (!issues.length) stories.push({ story, hanCount, minutes: Math.ceil(hanCount / 400) });
  }
  return { stories: stories.sort((a,b) => a.story.order-b.story.order), errors, missing: plan.filter(row => !stories.some(item => item.story.order === row[0])).map(row => row[0]), plannedCount: contract.count };
}
export function generateFictionIndex() {
  const result = inspectFiction();
  const items = result.stories.map(({ story, hanCount, minutes }) => ({ id:story.id, order:story.order, title:story.title, year:story.year, faction:story.faction, phase:story.phase, commander:story.commander, summary:story.summary, hanCount, minutes, sections:story.sections.map(s => s.title) }));
  const output = resolve(root, "src/content/fiction-index.json");
  const text = JSON.stringify(items, null, 2) + "\n";
  if (!existsSync(output) || readFileSync(output,"utf8") !== text) writeFileSync(output,text);
  return result;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = generateFictionIndex();
  console.log(JSON.stringify({published:result.stories.length, planned:result.plannedCount, stories:result.stories.map(({story,hanCount})=>({order:story.order,title:story.title,hanCount})),missing:result.missing,errors:result.errors},null,2));
  if (process.argv.includes("--audit") && (result.errors.length || result.missing.length)) process.exitCode = 1;
}
