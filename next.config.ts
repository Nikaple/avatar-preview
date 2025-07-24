import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['*'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'sharp'];
    return config;
  },
};

export default nextConfig;
