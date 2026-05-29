import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "standalone",
  allowedDevOrigins: [],
  serverExternalPackages: ["typeorm", "pg", "reflect-metadata"],
};

export default nextConfig;
