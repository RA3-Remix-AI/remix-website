// 原版《红色警戒 3》Steam 商店素材；来源记录见 docs/materials/ra3-visual-sources.json。
// 只作原版视觉参考，不代表 Remix 037 的内容或实机截图。
export const visuals = {
  sourceUrl: "https://store.steampowered.com/app/17480/",
  hero: {
    src: "/materials/ra3/ra3-naval-battle.jpg",
    alt: "红色警戒 3 原版海上战斗参考画面",
  },
  screenshots: [
    {
      src: "/materials/ra3/ra3-soviet-base.jpg",
      alt: "红色警戒 3 原版建筑与装甲单位参考画面",
      title: "基地与装甲",
    },
    {
      src: "/materials/ra3/ra3-city-battle.jpg",
      alt: "红色警戒 3 原版城市交战参考画面",
      title: "城市交战",
    },
  ],
} as const;
