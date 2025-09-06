/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  // Configure webpack for Three.js and other dependencies
  webpack: (config, { isServer }) => {
    // Handle canvas module for server-side rendering
    if (isServer) {
      config.externals.push('canvas');
    }
    
    return config;
  },

};

export default nextConfig;
