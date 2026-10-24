import type { FactionKey } from "../content/showcase";

export function FactionMark({ faction }: { faction: FactionKey }) {
  return (
    <img
      src={`/materials/factions/${faction}.png`}
      width="128"
      height="128"
      alt=""
      aria-hidden="true"
      decoding="async"
      className={`faction-mark faction-${faction}`}
    />
  );
}
