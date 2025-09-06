/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Handle static file serving
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/public/sw.js',
      },
    ];
  },
  // Configure webpack for Three.js and other dependencies
  webpack: (config, { isServer }) => {
    // Handle canvas module for server-side rendering
    if (isServer) {
      config.externals.push('canvas');
    }
    
    return config;
  },
  // Image optimization
  images: {
    domains: [],
    unoptimized: true, // Disable if you want Next.js image optimization
  },
};

export default nextConfig;
