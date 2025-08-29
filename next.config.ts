import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'www.bootdey.com'
      }
    ]
  }
};

export default nextConfig;
