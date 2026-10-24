import { useEffect, useState } from "react";
import type { RefObject } from "react";
import "../styles/home-immersion.css";

export const homeChapters = [
  { id: "arrival", label: "抵达" },
  { id: "tacticore", label: "弈核" },
  { id: "commander-client", label: "客户端" },
  { id: "factions", label: "阵营" },
  { id: "archive", label: "档案" },
  { id: "future", label: "未来" },
] as const;
const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const tiltVariables = [
  "--immersion-rx",
  "--immersion-ry",
  "--immersion-light-x",
  "--immersion-light-y",
  "--immersion-gloss",
];

/** One event-driven frame scheduler; never runs an idle animation loop. */
export function startHomeImmersion(
  root: HTMLElement,
  browser: Window & typeof globalThis,
  onChapter: (id: string) => void,
): () => void {
  const doc = root.ownerDocument;
  const fine = browser.matchMedia(
    "(min-width: 1101px) and (hover: hover) and (pointer: fine)",
  );
  const reduced = browser.matchMedia("(prefers-reduced-motion: reduce)");
  const hero = root.querySelector<HTMLElement>(".command-hero");
  const battlefield = root.querySelector<HTMLElement>(".campaign-battlefield");
  const chapters = homeChapters.map((chapter) => ({
    ...chapter,
    element: root.querySelector<HTMLElement>(`#${chapter.id}`),
  }));
  const cards = [
    ...root.querySelectorAll<HTMLElement>(
      ".campaign-faction,.campaign-version",
    ),
  ];
  let frame = 0;
  let disposed = false;
  let active = "";
  let pointer: { card: HTMLElement; x: number; y: number } | undefined;
  let previousCard: HTMLElement | undefined;
  const clearCard = (card: HTMLElement | undefined) => {
    if (card)
      for (const variable of tiltVariables) card.style.removeProperty(variable);
  };
  const clearMotion = () => {
    delete root.dataset.immersion;
    for (const key of [
      "--immersion-hero-y",
      "--immersion-hero-scale",
      "--immersion-field-y",
    ])
      root.style.removeProperty(key);
    cards.forEach(clearCard);
    previousCard = undefined;
    pointer = undefined;
  };
  const update = () => {
    frame = 0;
    if (disposed || doc.hidden) return;
    const height = browser.innerHeight;
    const rootBox = root.getBoundingClientRect();
    const progress = clamp(-rootBox.top / Math.max(1, rootBox.height - height));
    root.style.setProperty("--immersion-progress", progress.toFixed(4));
    root
      .querySelector<HTMLElement>(".home-reading-progress")
      ?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    let current: string = homeChapters[0].id;
    for (const chapter of chapters) {
      if (
        chapter.element &&
        chapter.element.getBoundingClientRect().top <= height * 0.42
      )
        current = chapter.id;
    }
    if (current !== active) {
      active = current;
      onChapter(current);
    }
    if (reduced.matches || !fine.matches) {
      clearMotion();
      return;
    }
    root.dataset.immersion = "active";
    // Measure stationary sections, not their transformed media children.
    if (hero) {
      const bounds = hero.getBoundingClientRect();
      const travel = clamp(-bounds.top / Math.max(1, bounds.height));
      root.style.setProperty(
        "--immersion-hero-y",
        `${(travel * 72).toFixed(2)}px`,
      );
      root.style.setProperty(
        "--immersion-hero-scale",
        (1 + travel * 0.045).toFixed(4),
      );
    }
    if (battlefield) {
      const bounds = battlefield.getBoundingClientRect();
      const travel = clamp((height - bounds.top) / (height + bounds.height));
      root.style.setProperty(
        "--immersion-field-y",
        `${((travel - 0.5) * 88).toFixed(2)}px`,
      );
    }
    if (pointer) {
      const { card, x, y } = pointer;
      // The positioned grid supplies an untransformed coordinate system for card tilt.
      const grid = card.parentElement!;
      const bounds = grid.getBoundingClientRect();
      const horizontal = clamp(
        (x - bounds.left - card.offsetLeft) / Math.max(1, card.offsetWidth),
      );
      const vertical = clamp(
        (y - bounds.top - card.offsetTop) / Math.max(1, card.offsetHeight),
      );
      if (previousCard !== card) clearCard(previousCard);
      previousCard = card;
      card.style.setProperty(
        "--immersion-rx",
        `${((0.5 - vertical) * 8).toFixed(2)}deg`,
      );
      card.style.setProperty(
        "--immersion-ry",
        `${((horizontal - 0.5) * 8).toFixed(2)}deg`,
      );
      card.style.setProperty("--immersion-light-x", `${horizontal * 100}%`);
      card.style.setProperty("--immersion-light-y", `${vertical * 100}%`);
      card.style.setProperty("--immersion-gloss", "1");
    }
  };
  const request = () => {
    if (!disposed && !frame && !doc.hidden)
      frame = browser.requestAnimationFrame(update);
  };
  const clearPointer = () => {
    pointer = undefined;
    clearCard(previousCard);
    previousCard = undefined;
  };
  const scroll = () => {
    clearPointer();
    request();
  };
  const preference = () => {
    clearMotion();
    request();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch" || reduced.matches || !fine.matches)
      return;
    const card = (event.target as Element).closest<HTMLElement>(
      ".campaign-faction,.campaign-version",
    );
    if (!card || !root.contains(card)) {
      clearPointer();
      return;
    }
    pointer = { card, x: event.clientX, y: event.clientY };
    request();
  };
  const out = (event: PointerEvent) => {
    const card = pointer?.card ?? previousCard;
    if (
      card &&
      (!(event.relatedTarget instanceof browser.Node) ||
        !card.contains(event.relatedTarget))
    )
      clearPointer();
  };
  const visibility = () => {
    if (doc.hidden && frame) {
      browser.cancelAnimationFrame(frame);
      frame = 0;
    }
    if (doc.hidden) clearPointer();
    else request();
  };
  browser.addEventListener("scroll", scroll, { passive: true });
  browser.addEventListener("resize", request, { passive: true });
  root.addEventListener("pointermove", move, { passive: true });
  root.addEventListener("pointerout", out, { passive: true });
  root.addEventListener("pointerleave", clearPointer, { passive: true });
  doc.addEventListener("visibilitychange", visibility);
  fine.addEventListener("change", preference);
  reduced.addEventListener("change", preference);
  const resize =
    typeof browser.ResizeObserver === "function"
      ? new browser.ResizeObserver(request)
      : undefined;
  resize?.observe(root);
  request();
  return () => {
    disposed = true;
    if (frame) browser.cancelAnimationFrame(frame);
    browser.removeEventListener("scroll", scroll);
    browser.removeEventListener("resize", request);
    root.removeEventListener("pointermove", move);
    root.removeEventListener("pointerout", out);
    root.removeEventListener("pointerleave", clearPointer);
    doc.removeEventListener("visibilitychange", visibility);
    fine.removeEventListener("change", preference);
    reduced.removeEventListener("change", preference);
    resize?.disconnect();
    clearMotion();
    root.style.removeProperty("--immersion-progress");
  };
}

export function useHomeImmersion(
  root: RefObject<HTMLDivElement | null>,
  suspended: boolean,
) {
  const [activeChapter, setActiveChapter] = useState<string>(
    homeChapters[0].id,
  );
  useEffect(() => {
    if (!root.current || suspended || typeof window.matchMedia !== "function")
      return;
    return startHomeImmersion(root.current, window, setActiveChapter);
  }, [root, suspended]);
  return activeChapter;
}
