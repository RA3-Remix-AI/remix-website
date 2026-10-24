export function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0];
  return pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
}

/** Convert only same-origin legacy hash routes; never use the hash as a redirect URL. */
export function legacyHashTarget(hash: string): string | undefined {
  if (!hash.startsWith("#/")) return undefined;
  const target = hash.slice(1);
  try {
    const decoded = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    if (
      !decoded.startsWith("/") ||
      decoded.startsWith("//") ||
      /[\\\u0000-\u0020]/.test(decoded)
    )
      return undefined;
    const parsed = new URL(target, "https://legacy.invalid");
    if (parsed.origin !== "https://legacy.invalid") return undefined;
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return undefined;
  }
}

export function canHydrate(
  prerenderedPath: string | undefined,
  pathname: string,
  search: string,
  migrated: boolean,
): boolean {
  // Filters are rendered client-side rather than hydrating the unfiltered static snapshot.
  return !migrated && !search && prerenderedPath === pathname;
}

/** Also support legacy links opened after the app is already running. */
export function subscribeLegacyHashRoutes(
  browser: Pick<
    Window,
    "location" | "addEventListener" | "removeEventListener"
  >,
  replace: (target: string) => void,
): () => void {
  const migrate = () => {
    const target = legacyHashTarget(browser.location.hash);
    if (target) replace(target);
  };
  browser.addEventListener("hashchange", migrate);
  migrate();
  return () => browser.removeEventListener("hashchange", migrate);
}
