import type { NextConfig } from 'next';

/**
 * RECIPRA Web — Next.js configuration.
 *
 * HITO 1: Minimal configuration. No external integrations.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No external images domains yet
  images: {
    remotePatterns: [],
  },
  // No rewrites/redirects yet
  async rewrites() {
    return [];
  },
  // No headers yet
  async headers() {
    return [];
  },
};

export default nextConfig;
