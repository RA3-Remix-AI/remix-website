export const ARRIVAL_INTRO_KEY = "remix-ai:agent-arrival:180s-v2";

/** One offer per browser session; storage failures must never block the site. */
export function createArrivalGate() {
  let offeredInMemory = false;
  return (entryPath: string, getStorage: () => Pick<Storage, "getItem" | "setItem">) => {
    if (entryPath !== "/" || offeredInMemory) return false;
    offeredInMemory = true;
    try {
      const storage = getStorage();
      if (storage.getItem(ARRIVAL_INTRO_KEY)) return false;
      storage.setItem(ARRIVAL_INTRO_KEY, "seen");
    } catch { /* Private browsing and blocked storage still allow skipping. */ }
    return true;
  };
}

export const claimArrivalIntro = createArrivalGate();
