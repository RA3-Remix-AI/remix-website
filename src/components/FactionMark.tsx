import type { FactionKey } from "../content/showcase";

const emblems = {
  soviet: "/materials/factions/soviet-1a17ad5477.webp",
  allied: "/materials/factions/allied-f22cae454a.webp",
  empire: "/materials/factions/empire-a43252f42b.webp",
} satisfies Record<FactionKey, string>;

export function FactionMark({ faction }: { faction: FactionKey }) {
  return (
    <img
      src={emblems[faction]}
      width="128"
      height="128"
      alt=""
      aria-hidden="true"
      decoding="async"
      loading="lazy"
      className={`faction-mark faction-${faction}`}
    />
  );
}
