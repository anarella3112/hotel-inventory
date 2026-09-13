import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel provides its own server output; standalone remains for Docker/self-hosting.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
