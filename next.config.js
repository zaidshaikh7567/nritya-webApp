/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'localhost'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    
    // Alias react-router-dom to our shim
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-router-dom': require.resolve('./src/utils/ReactRouterShim.js'),
    };
    
    return config;
  },
  // Copy static assets
  async rewrites() {
    return [
      {
        source: '/src/assets/:path*',
        destination: '/src/assets/:path*',
      },
    ]
  },
}

module.exports = nextConfig 