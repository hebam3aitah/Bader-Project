// // next.config.js
// import path from 'path';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack: (config) => {
//     config.resolve.alias['@'] = path.resolve(__dirname, 'src');
//     return config;
//   },
//   images: {
//     domains: [
//       'loremflickr.com',
//        'res.cloudinary.com', // ✅ Cloudinary

//         ],
//  remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'cdn.pixabay.com',
//         pathname: '/**',
//       },
//     ],    
//   },
// };

// export default nextConfig;
// next.config.js
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
  images: {
    domains: [
      'loremflickr.com',
      'res.cloudinary.com',
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
