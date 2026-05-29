import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // remotePatterns: [{ hostname: "we2plp04mq.ufs.sh", protocol: "https" }],
    remotePatterns: [
  { protocol: "https", hostname: "**.ufs.sh" },
  { protocol: "https", hostname: "**.amazonaws.com" },
],
  },
};

export default nextConfig;
