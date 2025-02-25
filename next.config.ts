import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      dns: false,
      tls: false,
      fs: false,
    };
    return config;
  },
  images: {
    unoptimized: true,
    domains: ['unpkg.com'], // untuk mengizinkan gambar dari unpkg.com (marker leaflet)
  }
};

export default nextConfig;
