/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ⚠️ Deshabilita ESLint durante el build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Opcional: deshabilita también TypeScript si hay errores
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig