import { defineConfig } from "vite-plus";

export default defineConfig({
  run: { tasks: { build: { command: "vp pack", cache: true } } },
  pack: {
    entry: ["src/index.ts", "src/tabs.css"],
    deps: { neverBundle: [] },
    dts: true,
  },
});
