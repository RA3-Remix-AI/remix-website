import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function FactionTransition({
  value,
  className = "",
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const previous = useRef(value);
  useEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    const element = container.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element?.animate || preference.matches) return;
    const animation = element.animate(
      [
        { opacity: 0.55, transform: "translateY(6px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 200, easing: "ease-out" },
    );
    const stopForPreference = () => {
      if (preference.matches) animation.cancel();
    };
    preference.addEventListener("change", stopForPreference);
    return () => {
      animation.cancel();
      preference.removeEventListener("change", stopForPreference);
    };
  }, [value]);
  return (
    <div ref={container} className={`faction-results ${className}`}>
      {children}
    </div>
  );
}
