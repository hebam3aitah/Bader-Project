// next.config.js
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: [
      'loremflickr.com',
       'res.cloudinary.com', // ✅ Cloudinary

        ],
 remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
    ],    
  },
};

export default nextConfig;
