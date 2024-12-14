import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Add webpack configuration to handle file watching
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: ['**/data/**']
      };
    }
    return config;
  },
};

export default nextConfig;
