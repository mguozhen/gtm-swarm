import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'gray-matter', 'js-yaml', 'node-cron'],
  experimental: {},
}

export default nextConfig
