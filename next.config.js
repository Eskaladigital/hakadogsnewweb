/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año de caché para imágenes
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },
  
  // Comprimir todas las respuestas
  compress: true,
  
  // Optimizar para navegadores modernos (elimina polyfills innecesarios)
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimización experimental para reducir CSS bloqueante
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    // Mejorar renderizado inicial
    optimisticClientCache: true,
  },
  
  // Optimizar chunks para mejor caché
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      }
    }
    return config
  },
  
  // Headers de seguridad y performance
  async headers() {
    return [
      // Imágenes optimizadas por Next.js - caché 1 año
      {
        source: '/_next/image:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Imágenes y assets estáticos - caché 1 año
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // JS y CSS estáticos de Next.js - caché 1 año
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Páginas HTML - caché corta con revalidación inteligente
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.tiny.cloud; style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud https://fonts.googleapis.com; img-src 'self' data: https://images.unsplash.com https://jshqrsnzxzbizgjyfsde.supabase.co https://www.googletagmanager.com https://www.google-analytics.com blob:; font-src 'self' data: https://cdn.tiny.cloud https://fonts.gstatic.com; connect-src 'self' https://jshqrsnzxzbizgjyfsde.supabase.co https://www.google-analytics.com https://api.openai.com https://cdn.tiny.cloud https://www.googletagmanager.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=()'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
