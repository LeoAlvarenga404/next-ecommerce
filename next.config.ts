import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d1bbbbpdvc.ufs.sh",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
