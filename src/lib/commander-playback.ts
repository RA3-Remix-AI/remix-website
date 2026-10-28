export type CommanderPlaybackView = {
  front: number | null;
  outgoing: number | null;
  transitioning: boolean;
  visible: boolean;
  pending: number | null;
};

type Policy = { enabled: boolean; motionAllowed: boolean; playing: boolean };
type Clock = Pick<Window, "setTimeout" | "clearTimeout" | "requestAnimationFrame" | "cancelAnimationFrame">;
type Slot = { video: HTMLVideoElement; index: number | null; source: string; ready: boolean };
const interrupted = (error: unknown) => typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";

/** Two persistent decoders: the displayed frame is never discarded to load its successor. */
export function createCommanderPlayback(
  videos: readonly [HTMLVideoElement, HTMLVideoElement],
  sources: readonly string[],
  onCommit: (index: number) => void,
  onView: (view: CommanderPlaybackView) => void,
  clock: Clock = window,
  media?: { acquire(source: string): { promise: Promise<string>; cancel(): void } },
) {
  const slots: Slot[] = videos.map(video => ({ video, index: null, source: "", ready: false }));
  let policy: Policy = { enabled: false, motionAllowed: false, playing: true };
  let committed = 0;
  let wanted = 0;
  let front: number | null = null;
  let outgoing: number | null = null;
  let pending: number | null = null;
  let transitionTimer = 0;
  let epoch = 0;
  let disposed = false;
  let cancelRequest = () => {};
  let cancelPreload = () => {};

  const publish = () => onView({ front, outgoing, pending, transitioning: transitionTimer !== 0, visible: policy.motionAllowed && front !== null });
  const matches = (slot: Slot) => slot.video.src === slot.source && (!slot.video.currentSrc || slot.video.currentSrc === slot.source);
  const intended = (token: number, slot: Slot, index: number) => !disposed && policy.enabled && token === epoch && wanted === index && slot.index === index;
  const valid = (token: number, slot: Slot, index: number) => intended(token, slot, index) && matches(slot);
  const stopWork = () => { cancelRequest(); cancelRequest = () => {}; cancelPreload(); cancelPreload = () => {}; };
  const finishTransition = () => {
    if (transitionTimer && front !== null) {
      // Pin synchronously before load() can clear the outgoing decoder. React's
      // next render keeps these same styles, but cannot expose a gap meanwhile.
      slots[front]!.video.style.transition = "none";
      slots[front]!.video.style.opacity = policy.motionAllowed ? "1" : "0";
    }
    if (transitionTimer) clock.clearTimeout(transitionTimer);
    transitionTimer = 0;
    if (outgoing !== null && outgoing !== front) slots[outgoing]!.video.pause();
    outgoing = null;
  };
  const unload = (slot: Slot) => {
    slot.video.pause();
    slot.video.preload = "none";
    slot.video.removeAttribute("src");
    slot.video.load();
    slot.index = null; slot.source = ""; slot.ready = false;
  };

  function load(slot: Slot, index: number, ready: () => void, failed: () => void) {
    let cancelled = false;
    let timeout = 0;
    let sourceReady = !media;
    let releaseSource = () => {};
    const cleanup = () => {
      cancelled = true;
      releaseSource();
      clock.clearTimeout(timeout);
      slot.video.removeEventListener("loadeddata", check);
      slot.video.removeEventListener("canplay", check);
      slot.video.removeEventListener("error", error);
    };
    const check = () => {
      if (cancelled || !sourceReady || !matches(slot) || slot.video.readyState < 2 || slot.video.seeking) return;
      slot.ready = true;
      cleanup();
      ready();
    };
    const error = () => { if (!cancelled) { cleanup(); failed(); } };
    slot.video.pause();
    slot.video.preload = "auto";
    if (slot.index !== index || !matches(slot) || slot.video.error || (media && !slot.source)) {
      slot.index = index; slot.ready = false;
      const attach = (source: string) => {
        if (cancelled) return;
        slot.video.src = source;
        slot.source = slot.video.src;
        sourceReady = true;
        slot.video.load();
      };
      if (media) {
        slot.source = "";
        const request = media.acquire(sources[index]!);
        releaseSource = request.cancel;
        void request.promise.then(attach).catch(error);
      } else attach(sources[index]!);
    } else sourceReady = true;
    slot.video.addEventListener("loadeddata", check);
    slot.video.addEventListener("canplay", check);
    slot.video.addEventListener("error", error);
    timeout = clock.setTimeout(error, 15000);
    // An already warm decoder still yields so a newer click can supersede it.
    void Promise.resolve().then(check);
    return cleanup;
  }

  function present(slot: Slot, token: number, index: number, ready: () => void, failed: () => void) {
    let cancelled = false;
    let frameCallback: number | undefined;
    let frame = 0;
    let timeout = 0;
    const current = () => !cancelled && valid(token, slot, index);
    const cleanup = () => {
      cancelled = true;
      if (frameCallback !== undefined) slot.video.cancelVideoFrameCallback(frameCallback);
      if (frame) clock.cancelAnimationFrame(frame);
      clock.clearTimeout(timeout);
      slot.video.removeEventListener("playing", playing);
      slot.video.removeEventListener("error", error);
    };
    const complete = () => {
      if (!current() || slot.video.readyState < 2 || slot.video.seeking) return;
      cleanup();
      ready();
    };
    const paintedFallback = () => {
      if (!current() || frame || slot.video.readyState < 2 || slot.video.seeking) return;
      // Invisible buffers need not receive rVFC. A decoded, playing frame plus two
      // foreground paints is the bounded compatible path; never a blind timer.
      frame = clock.requestAnimationFrame(() => {
        frame = clock.requestAnimationFrame(() => { frame = 0; complete(); });
      });
    };
    const playing = () => { if (!slot.video.paused) paintedFallback(); };
    const error = () => { if (current()) { cleanup(); failed(); } };
    slot.video.addEventListener("playing", playing);
    slot.video.addEventListener("error", error);
    timeout = clock.setTimeout(error, 4000);
    if (!policy.playing) {
      // loadeddata already decoded the paused target's first frame.
      slot.video.pause();
      paintedFallback();
    } else {
      if (typeof slot.video.requestVideoFrameCallback === "function") {
        frameCallback = slot.video.requestVideoFrameCallback(complete);
      }
      slot.video.muted = true;
      void slot.video.play().then(() => {
        if (current() && !slot.video.paused) paintedFallback();
      }).catch((reason: unknown) => { if (current() && !interrupted(reason)) error(); });
    }
    return () => { cleanup(); if (slot !== slots[front ?? -1]) slot.video.pause(); };
  }

  function fallback(index: number) {
    stopWork(); finishTransition();
    slots.forEach(slot => slot.video.pause());
    front = null; pending = null; committed = index;
    onCommit(index); publish();
  }

  function resumeFront() {
    if (front === null) return;
    const slot = slots[front]!;
    if (!policy.enabled || !policy.playing) { slot.video.pause(); return; }
    const token = epoch;
    slot.video.muted = true;
    void slot.video.play().catch((reason: unknown) => {
      if (!disposed && token === epoch && policy.enabled && policy.playing && slots[front ?? -1] === slot && !interrupted(reason)) fallback(committed);
    });
  }

  function warmNext() {
    if (disposed || !policy.enabled || !policy.playing || front === null || pending !== null) return;
    cancelPreload();
    const slot = slots[front === 0 ? 1 : 0]!;
    cancelPreload = load(slot, (committed + 1) % sources.length, () => {}, () => {});
  }

  function commit(slotIndex: number, index: number, token: number) {
    if (!valid(token, slots[slotIndex]!, index)) return;
    cancelRequest = () => {};
    outgoing = front;
    front = slotIndex;
    committed = index; pending = null;
    // The old slot stays fully opaque under the incoming fade, so no poster
    // appears between two successfully decoded videos.
    transitionTimer = clock.setTimeout(() => { finishTransition(); publish(); warmNext(); }, 180);
    onCommit(index); publish();
    if (!policy.playing) slots[slotIndex]!.video.pause();
  }

  function startRequest() {
    const index = wanted;
    if (!policy.motionAllowed) { fallback(index); return; }
    if (!policy.enabled) { pending = index === committed ? null : index; publish(); return; }
    if (front !== null && slots[front]!.index === index && slots[front]!.ready) {
      pending = null; publish(); resumeFront(); warmNext(); return;
    }
    pending = index; publish();
    const token = epoch;
    const cached = slots.findIndex(slot => slot.index === index && slot.ready && matches(slot));
    const slotIndex = front === null ? Math.max(0, cached) : front === 0 ? 1 : 0;
    const slot = slots[slotIndex]!;
    let cancelPresentation = () => {};
    const cancelLoad = load(slot, index, () => {
      if (!valid(token, slot, index)) return;
      cancelPresentation = present(slot, token, index, () => commit(slotIndex, index, token), () => fallback(index));
    }, () => { if (intended(token, slot, index)) fallback(index); });
    cancelRequest = () => { cancelLoad(); cancelPresentation(); };
  }

  const errors = slots.map((slot, slotIndex) => {
    const handler = () => {
      if (disposed || front !== slotIndex || !policy.enabled) return;
      if (pending === null) fallback(committed);
      else { slot.video.pause(); finishTransition(); front = null; publish(); }
    };
    slot.video.addEventListener("error", handler);
    return handler;
  });

  return {
    request(index: number) {
      if (disposed || index < 0 || index >= sources.length || (index === wanted && (pending !== null || (front !== null && committed === index)))) return;
      wanted = index; epoch++;
      stopWork(); finishTransition(); publish();
      startRequest();
    },
    setPolicy(next: Policy) {
      if (disposed || (next.enabled === policy.enabled && next.motionAllowed === policy.motionAllowed && next.playing === policy.playing)) return;
      policy = next; epoch++;
      stopWork(); finishTransition();
      slots.forEach(slot => slot.video.pause());
      if (!next.enabled) {
        slots.forEach((slot, index) => { if (index !== front && slot.index !== null) unload(slot); });
        if (!next.motionAllowed) fallback(wanted);
        else { pending = wanted === committed ? null : wanted; publish(); }
        return;
      }
      resumeFront(); startRequest();
    },
    destroy() {
      if (disposed) return;
      disposed = true; epoch++;
      stopWork(); finishTransition();
      slots.forEach((slot, index) => { slot.video.removeEventListener("error", errors[index]!); unload(slot); });
    },
  };
}
