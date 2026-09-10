import type { NextConfig } from "next";
import path from "path";
import { loadEnvConfig } from "@next/env";

// Load monorepo root .env.local (keeps secrets in one place)
loadEnvConfig(path.resolve(__dirname, "../.."));

const nextConfig: NextConfig = {
  transpilePackages: ["@ledgerly/audit-engine"],
};

export default nextConfig;
