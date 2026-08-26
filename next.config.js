/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pfmqkioftagjnxqyrngk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año de caché para imágenes
    dangerouslyAllowSVG: false,
    unoptimized: false,
  },
  
  compress: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion', '@supabase/supabase-js'],
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
      // Páginas del administrador - SIN CACHÉ para ver cambios inmediatamente
      {
        source: '/administrator/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Link',
            value: '<https://pfmqkioftagjnxqyrngk.supabase.co>; rel=preconnect; crossorigin, <https://jshqrsnzxzbizgjyfsde.supabase.co>; rel=preconnect; crossorigin, <https://www.googletagmanager.com>; rel=preconnect'
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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.tiny.cloud https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://cdn.tiny.cloud https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://jshqrsnzxzbizgjyfsde.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://api.openai.com https://cdn.tiny.cloud https://www.googletagmanager.com https://www.google.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://www.recaptcha.net; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()'
          }
        ],
      },
      // Archivos .well-known para Deep Linking (Android App Links y iOS Universal Links)
      {
        source: '/.well-known/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          }
        ],
      },
      // Páginas HTML públicas - caché corta con revalidación inteligente
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
            value: '<https://pfmqkioftagjnxqyrngk.supabase.co>; rel=preconnect; crossorigin, <https://jshqrsnzxzbizgjyfsde.supabase.co>; rel=preconnect; crossorigin, <https://www.googletagmanager.com>; rel=preconnect'
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
            // CSP mejorado - IMPORTANTE: Incluir todos los dominios de Supabase + Google Analytics + reCAPTCHA
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.tiny.cloud https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://cdn.tiny.cloud https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://jshqrsnzxzbizgjyfsde.supabase.co https://www.google-analytics.com https://region1.google-analytics.com https://api.openai.com https://cdn.tiny.cloud https://www.googletagmanager.com https://www.google.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com https://www.recaptcha.net; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=()'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig
