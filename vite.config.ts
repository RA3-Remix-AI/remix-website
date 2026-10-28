import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { publicAssets } from "./scripts/public-assets.mjs";

export default defineConfig({ plugins: [react(), publicAssets()], build: { copyPublicDir: false } });
