import { FactionMark } from "./FactionMark";
import type { FactionKey } from "../content/showcase";

const factionKeys: Record<string, FactionKey> = {
  盟军: "allied",
  苏联: "soviet",
  升阳: "empire",
};

export function FactionSelector({
  value,
  onChange,
  includeAll = true,
  label = "筛选阵营",
  countLabel,
}: {
  value: string;
  onChange: (faction: string) => void;
  includeAll?: boolean;
  label?: string;
  countLabel?: string;
}) {
  const options = includeAll
    ? ["全部", "盟军", "苏联", "升阳"]
    : ["盟军", "苏联", "升阳"];
  return (
    <div className="faction-selector" role="group" aria-label={label}>
      {options.map((name) => {
        const key = factionKeys[name];
        return (
          <button
            key={name}
            type="button"
            className={`faction-choice faction-${key ?? "all"}`}
            aria-pressed={value === name}
            onClick={() => onChange(name)}
          >
            {key && <FactionMark faction={key} />}
            <span>
              {name}
              {countLabel && <small>{countLabel}</small>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
