import { useEffect, useRef } from "react";
import "../styles/home-reveal.css";

const revealSelector = [
  ".campaign-intro > div",
  ".campaign-section-heading",
  ".campaign-faction",
  ".campaign-battlefield-copy",
  ".campaign-battlefield-rules",
  ".campaign-version",
  ".campaign-archive-heading",
  ".campaign-archive-entry",
  ".campaign-future-copy",
  ".campaign-ai-capability",
].join(",");

type RevealBrowser = Pick<
  typeof window,
  "innerHeight" | "matchMedia" | "IntersectionObserver"
>;

/** Progressive enhancement only: no inline or stylesheet state hides pending content. */
export function startHomeReveal(
  root: HTMLElement,
  browser: RevealBrowser,
): () => void {
  if (
    typeof browser.IntersectionObserver !== "function" ||
    typeof browser.matchMedia !== "function"
  )
    return () => {};
  const motion = browser.matchMedia("(prefers-reduced-motion: reduce)");
  if (motion.matches || typeof motion.addEventListener !== "function")
    return () => {};

  let stopped = false;
  const animations = new Map<HTMLElement, Animation>();
  const pending = new Map<HTMLElement, number>();
  const groupCounts = new Map<Element, number>();
  for (const element of root.querySelectorAll<HTMLElement>(revealSelector)) {
    // The hero and the sticky client demonstration own their animation lifecycles.
    if (
      element.closest(".command-hero, .commander-showcase, .tacticore-section") ||
      typeof element.animate !== "function"
    )
      continue;
    // Never fade content that was already visible when hydration / the effect completed.
    if (element.getBoundingClientRect().top < browser.innerHeight) continue;
    const group = element.parentElement ?? root;
    const ordinal = groupCounts.get(group) ?? 0;
    groupCounts.set(group, ordinal + 1);
    pending.set(element, Math.min(ordinal, 2) * 80);
  }

  const observer = new browser.IntersectionObserver(
    (entries) => {
      if (stopped || motion.matches) return;
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting || !pending.has(element)) continue;
        const delay = pending.get(element)!;
        pending.delete(element);
        observer.unobserve(element);
        element.classList.add("home-reveal-running");
        try {
          const animation = element.animate(
            [
              { opacity: 0.35, translate: "0 20px" },
              { opacity: 1, translate: "0 0" },
            ],
            {
              duration: 620,
              delay,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            },
          );
          animations.set(element, animation);
          const release = () => {
            element.classList.remove("home-reveal-running");
            animations.delete(element);
          };
          animation.onfinish = release;
          animation.oncancel = release;
        } catch {
          // A missing/partial animation implementation must leave the original page intact.
          element.classList.remove("home-reveal-running");
        }
      }
    },
    { rootMargin: "0px 0px -32px 0px", threshold: 0 },
  );

  const stop = () => {
    stopped = true;
    observer.disconnect();
    pending.clear();
    for (const [element, animation] of animations) {
      animation.cancel();
      element.classList.remove("home-reveal-running");
    }
    animations.clear();
  };
  const onMotionChange = () => {
    if (motion.matches) stop();
  };
  motion.addEventListener("change", onMotionChange);
  for (const element of pending.keys()) observer.observe(element);
  return () => {
    stop();
    motion.removeEventListener("change", onMotionChange);
  };
}

export function useHomeReveal<T extends HTMLElement>() {
  const root = useRef<T>(null);
  useEffect(() => {
    if (!root.current) return;
    return startHomeReveal(root.current, window);
  }, []);
  return root;
}
