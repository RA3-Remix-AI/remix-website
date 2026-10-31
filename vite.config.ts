import { defineConfig } from "vite";
import { fictionCatalog } from "./scripts/fiction-catalog.mjs";
import react from "@vitejs/plugin-react";
import { publicAssets } from "./scripts/public-assets.mjs";

export default defineConfig({ plugins: [fictionCatalog(), react(), publicAssets()], build: { copyPublicDir: false } });
