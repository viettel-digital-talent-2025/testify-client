import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  compress: true,
  poweredByHeader: false,

  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  compiler: {
    styledComponents: true,
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
