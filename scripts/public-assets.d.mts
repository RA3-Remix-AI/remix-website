import type { Plugin } from "vite";
export function copyPublicAssets(root: string, output: string): Promise<number>;
export function publicAssets(): Plugin;
