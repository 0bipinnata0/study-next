// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.mux.com" },
      {
        protocol: "https",
        hostname: "u4mp1it1wi.ufs.sh",
      },
        {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;

// initOpenNextCloudflareForDev();
