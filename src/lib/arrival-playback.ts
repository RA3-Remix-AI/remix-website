export interface ArrivalPlaybackState {
  requested: boolean;
  failure: "media" | "play" | null;
}

type ArrivalMedia = Pick<HTMLVideoElement, "src" | "play" | "pause" | "load" | "removeAttribute">;

/** No source or play request until an explicit user action. One rendition per dialog. */
export function createArrivalPlayback(
  media: ArrivalMedia,
  source: string,
  onChange: (state: ArrivalPlaybackState) => void,
) {
  let state: ArrivalPlaybackState = { requested: false, failure: null };
  let attached = false;
  let destroyed = false;
  let attempt = 0;
  const publish = (next: ArrivalPlaybackState) => {
    state = next;
    onChange(next);
  };
  const pause = () => {
    if (destroyed) return;
    attempt++;
    media.pause();
    publish({ ...state, requested: false });
  };
  const start = () => {
    if (destroyed) return;
    const retry = state.failure === "media";
    const current = ++attempt;
    if (!attached) {
      media.src = source;
      attached = true;
    } else if (retry) media.load();
    publish({ requested: true, failure: null });
    // Called inside the click handler so browsers retain user activation.
    void media.play().catch(() => {
      if (destroyed || current !== attempt) return;
      publish({ requested: false, failure: "play" });
    });
  };
  return {
    toggle() { if (state.requested) pause(); else start(); },
    pause,
    fail() {
      if (destroyed || !attached) return;
      attempt++;
      media.pause();
      publish({ requested: false, failure: "media" });
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      attempt++;
      media.pause();
      media.removeAttribute("src");
      media.load(); // Abort resource selection / pending requests when the dialog closes.
    },
  };
}
