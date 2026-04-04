import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist', 'canvas'],
  turbopack: {
    root: '.',
  },
};

export default nextConfig;
