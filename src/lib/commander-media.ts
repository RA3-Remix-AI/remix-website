/** Small homepage clips only: at most three successful blobs, never a whole library. */
export function createCommanderMediaCache(sources: readonly string[], transport: typeof fetch = fetch, urls = URL) {
  if (sources.length > 3) throw new Error("Commander cache supports at most three clips");
  const allowed = new Set(sources);
  const entries = new Map<string, { controller: AbortController; users: number; url?: string; promise: Promise<string> }>();
  let disposed = false;
  return {
    acquire(source: string) {
      if (disposed || !allowed.has(source)) throw new Error("Unknown or disposed commander clip");
      let entry = entries.get(source);
      if (!entry) {
        const controller = new AbortController();
        const created = { controller, users: 0, url: undefined as string | undefined, promise: Promise.resolve("") };
        created.promise = transport(source, { signal: controller.signal, cache: "force-cache" }).then(async response => {
          if (!response.ok) throw new Error("Commander clip unavailable");
          const blob = await response.blob();
          if (disposed || controller.signal.aborted) throw new DOMException("Cancelled", "AbortError");
          if (blob.size > 8 * 1024 * 1024) throw new Error("Commander clip exceeds cache budget");
          created.url = urls.createObjectURL(blob);
          return created.url;
        }).catch(error => {
          if (entries.get(source) === created) entries.delete(source);
          throw error;
        });
        entries.set(source, created);
        entry = created;
      }
      entry.users++;
      const held = entry;
      let released = false;
      return {
        promise: held.promise,
        cancel() {
          if (released) return;
          released = true;
          held.users--;
          // A warm buffer can be claimed by the next request in this same turn.
          queueMicrotask(() => {
            if (!held.users && !held.url && entries.get(source) === held) {
              entries.delete(source);
              held.controller.abort();
            }
          });
        },
      };
    },
    dispose() {
      disposed = true;
      for (const entry of entries.values()) {
        entry.controller.abort();
        if (entry.url) urls.revokeObjectURL(entry.url);
      }
      entries.clear();
    },
  };
}

type Connection = { saveData?: boolean; effectiveType?: string };
export function conserveCommanderData(connection?: Connection) {
  return Boolean(connection?.saveData || connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g");
}
