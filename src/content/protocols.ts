import snapshot from "./protocols037.json";
import { protocolNotes } from "./protocol-notes";

export const protocolFactions = ["盟军", "苏联", "升阳"] as const;
export const protocols = snapshot.protocols.map(item => ({ ...item, ...protocolNotes[item.id] }));
export type Protocol = (typeof protocols)[number];

export function protocolKind(protocol: Protocol) {
  return protocol.active
    ? protocol.upgrade ? "主动 + 升级" : "主动施放"
    : "升级 / 授权";
}

export function filterProtocols(faction: string, query: string) {
  const term = query.trim().toLowerCase();
  return protocols.filter(protocol => protocol.faction === faction &&
    `${protocol.name} ${protocol.kind} ${protocol.active ?? ""} ${protocol.upgrade ?? ""} ${protocol.usage}`.toLowerCase().includes(term));
}
