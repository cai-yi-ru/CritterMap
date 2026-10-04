import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: '/review/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, nosnippet' }],
    }];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
