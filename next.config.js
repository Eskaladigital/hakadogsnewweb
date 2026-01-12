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
    optimizeCss: true, // Inline critical CSS
    optimizePackageImports: ['lucide-react', 'framer-motion', '@supabase/supabase-js'],
    // Mejorar renderizado inicial
    optimisticClientCache: true,
    // Purge CSS no utilizado agresivamente
    cssChunking: 'loose', // Permite mejor code splitting de CSS
  },
  
  // Optimizar chunks para mejor caché y reducir tareas largas en main thread
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Code splitting más agresivo para reducir main thread blocking
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Chunk de librerías base (React, Next.js core)
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Lucide icons separado para lazy load
          icons: {
            name: 'icons',
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
          // Librerías grandes separadas
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              return `npm.${packageName.replace('@', '')}`
            },
            priority: 20,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Commons (código compartido entre páginas)
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 10,
            reuseExistingChunk: true,
          },
        },
        // Límites de tamaño para evitar chunks grandes que bloquean
        maxInitialRequests: 25,
        maxAsyncRequests: 25,
        minSize: 20000,
        maxSize: 244000, // ~244KB max por chunk (evita tareas largas >50ms)
      }
    }
    return config
  },
  
  // Headers de seguridad y performance
  async headers() {
    return [
      // Imágenes optimizadas por Next.js - caché 1 año (ANTES de /:path*)
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
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
      // Fuentes y archivos de tipografía - caché 1 año
      {
        source: '/:all*(woff|woff2|ttf|otf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
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
            key: 'Link',
            value: '<https://jshqrsnzxzbizgjyfsde.supabase.co>; rel=preconnect; crossorigin, <https://www.googletagmanager.com>; rel=preconnect'
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
            // CSP mejorado - IMPORTANTE: Incluir todos los dominios de Supabase
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.tiny.cloud; style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://cdn.tiny.cloud https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://jshqrsnzxzbizgjyfsde.supabase.co https://www.google-analytics.com https://api.openai.com https://cdn.tiny.cloud https://www.googletagmanager.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
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
