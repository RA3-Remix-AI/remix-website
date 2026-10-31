import { generateFictionIndex } from "./fiction-editorial.mjs";
export function fictionCatalog() {
  return {
    name: "fiction-catalog",
    buildStart() { generateFictionIndex(); },
    configureServer(server) {
      const update = file => { if (/\/src\/content\/fiction\/[^/]+\.json$/.test(file)) generateFictionIndex(); };
      server.watcher.on("add", update).on("change", update).on("unlink", update);
    },
  };
}
