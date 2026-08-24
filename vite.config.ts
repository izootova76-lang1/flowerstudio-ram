// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

const repoBasePath = "/flowerstudio-ram";

export default defineConfig({
  // GitHub Pages is static hosting: skip Nitro's SSR/static adapter, which
  // feeds HTML into Vite's SSR rollup input and fails the production build.
  nitro: false,
  tanstackStart: {
    server: { entry: "server" },
    spa: {
      enabled: true,
      prerender: { outputPath: "/" },
    },
    router: { basepath: repoBasePath },
  },
  vite: {
    base: `${repoBasePath}/`,
    preview: { host: "127.0.0.1" },
    environments: {
      ssr: {
        build: {
          rollupOptions: {
            input: "./src/server.ts",
          },
        },
      },
    },
    plugins: [mcpPlugin()],
  },
});
