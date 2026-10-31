import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { countHan, bodyText, generateFictionIndex } from "../scripts/fiction-editorial.mjs";

test("fiction counts only body Han characters, excluding titles, Latin text and punctuation",()=>{
  assert.equal(countHan("中文，AI 2038！𠀀"),3);
  assert.equal(countHan(bodyText({title:"标题不计",summary:"梗概不计",sections:[{title:"章节不计",paragraphs:["正文。","第二段 AI 2038"]}]})),5);
});

test("catalog only publishes valid manuscripts; filters, lazy loading and SSR reading preserve the full text",async()=>{
  generateFictionIndex();
  const server=await createServer({server:{middlewareMode:true,hmr:false},appType:"custom"});
  try{
    const {fictionCatalog,filterFiction,loadFiction,cachedFiction,formatSectionTitle}=await server.ssrLoadModule("/src/lib/fiction.ts");
    const {App}=await server.ssrLoadModule("/src/app/App.tsx");
    assert.equal(formatSectionTitle("一、一个人的凌晨"),"一个人的凌晨");
    assert.equal(formatSectionTitle("一座工厂"),"一座工厂");
    assert.equal(await loadFiction("../../private"),undefined);
    for(const meta of fictionCatalog){
      assert.ok(meta.hanCount>=5000 && meta.hanCount<=10000);
      assert.ok(!("paragraphs" in meta));
      const query=new URLSearchParams({faction:meta.faction,phase:meta.phase,commander:meta.commander,q:meta.title});
      assert.ok(filterFiction(query).some(item=>item.id===meta.id));
      assert.equal(filterFiction(new URLSearchParams({q:"no-matching-story-xyz"})).length,0);
      const story=await loadFiction(meta.id);
      assert.equal(cachedFiction(meta.id),story);
      assert.equal(countHan(bodyText(story)),meta.hanCount);
      const html=renderToStaticMarkup(createElement(MemoryRouter,{initialEntries:[`/stories/fiction/${meta.id}?faction=${meta.faction}`]},createElement(App)));
      assert.ok(html.includes(story.sections[0].paragraphs[0].slice(0,30)));
      assert.ok(html.includes(story.sections.at(-1).paragraphs.at(-1).slice(0,30)));
      assert.ok(html.includes(`href="/stories?faction=${meta.faction}"`));
      assert.match(html,/aria-label="本篇章节"/);
      assert.match(html,/aria-label="阅读进度"/);
      assert.doesNotMatch(html,/正在翻开故事/);
    }
  }finally{await server.close();}
});
