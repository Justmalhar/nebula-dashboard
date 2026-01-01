import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.31.88", "localhost:3000"],
};

export default nextConfig;
