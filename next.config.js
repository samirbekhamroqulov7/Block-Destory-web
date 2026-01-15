/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Временно отключаем ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Временно отключаем проверку TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    // Настройки для изображений если нужно
    domains: [],
  },
}

module.exports = nextConfig