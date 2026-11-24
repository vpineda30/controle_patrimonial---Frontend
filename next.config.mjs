/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://controle-patrimonial-backend-production.up.railway.app//:path*',
      },
    ]
  },
}

export default nextConfig
