/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudinary — product images
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        // Zyro CDN — temporary during migration
        protocol: 'https',
        hostname: 'cdn.zyrosite.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // Compress responses
  compress: true,
  // Remove powered by header for security
  poweredByHeader: false,
}

export default nextConfig
