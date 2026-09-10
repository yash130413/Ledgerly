import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@ledgerly/audit-engine": path.resolve(
        __dirname,
        "./packages/audit-engine/src/index.ts"
      ),
    },
  },
  test: {
    environment: "node",
    include: ["packages/audit-engine/src/**/*.test.ts"],
  },
});
