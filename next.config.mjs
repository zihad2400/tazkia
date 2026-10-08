/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warnings ignore করব — errors build fail করবে
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
