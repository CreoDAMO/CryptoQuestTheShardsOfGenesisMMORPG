
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    // Temporarily ignore build errors during migration
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore linting errors during migration
    ignoreDuringBuilds: true,
  },
  // Configure for Replit deployment
  trailingSlash: false,
  output: 'standalone',
}

module.exports = nextConfig
