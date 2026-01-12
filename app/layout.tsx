import './globals.css'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BackToTop from '@/components/ui/BackToTop'
import WhatsAppChat from '@/components/ui/WhatsAppChat'
import CookieConsent from '@/components/ui/CookieConsent'
import { localBusinessSchema, organizationSchema, websiteSchema, serviceSchema } from '@/lib/schema'

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hakadogs.com'),
  title: {
    default: 'Hakadogs - Educación Canina Profesional | Archena, Murcia',
    template: '%s | Hakadogs'
  },
  description: 'Educador canino en Archena y Murcia con +8 años de experiencia. Metodología BE HAKA: educación presencial en Región de Murcia y cursos online España. ¡500+ perros felices!',
  keywords: ['educador canino murcia', 'adiestrador perros archena', 'educación canina', 'adiestramiento positivo', 'cursos online perros', 'BE HAKA', 'hakadogs'],
  authors: [{ name: 'Alfredo García - Hakadogs' }],
  creator: 'Hakadogs',
  publisher: 'Hakadogs',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.hakadogs.com',
    siteName: 'Hakadogs - Educación Canina Profesional',
    title: 'Hakadogs - Educación Canina Profesional | Archena, Murcia',
    description: 'Educador canino en Archena y Murcia con +8 años de experiencia. Metodología BE HAKA: educación presencial en Región de Murcia y cursos online España. ¡500+ perros felices!',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Educación Canina Profesional',
      }
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@hakadogs',
    creator: '@hakadogs',
    title: 'Hakadogs - Educación Canina Profesional',
    description: 'Educador canino Archena-Murcia. Metodología BE HAKA, +8 años experiencia, 500+ perros felices. Servicios presenciales y online.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/images/hakadogs-01.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/images/hakadogs-01.png',
  },
  
  // PWA Manifest
  manifest: '/manifest.json',
  
  // Apple Web App
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hakadogs',
  },
  
  // Otros metadatos
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'df6887502d2f32b6',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Critical CSS inline - Solo para above the fold */}
        <style dangerouslySetInnerHTML={{__html: `
          :root{--forest-dark:#1a3d23;--forest:#2d5f3a;--sage:#6b8e5f;--gold:#c9a961;--cream:#f9f6f1}
          *{margin:0;padding:0;box-sizing:border-box}
          html{scroll-behavior:smooth}
          body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:var(--forest-dark);background:#fff;line-height:1.6}
          @keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
          .animate-fade-in-up{animation:fadeIn 0.5s ease-out forwards}
          @keyframes scaleIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
          .animate-fade-in-scale{animation:scaleIn 0.5s ease-out forwards;will-change:transform,opacity}
        `}} />
        
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Hakadogs" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Hakadogs" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#059669" />
        
        {/* Preconnect a dominios externos críticos */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://jshqrsnzxzbizgjyfsde.supabase.co" />
        
        {/* Schema.org Structured Data - Datos estructurados para SEO */}
        <Script
          id="schema-local-business"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Script
          id="schema-service"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        
        {/* Google Analytics - Lazy extremo para no bloquear */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NXPT2KNYGJ"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NXPT2KNYGJ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        
        {/* Service Worker Registration - DESHABILITADO para mejorar LCP */}
        {/* 
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker
                  .register('/sw.js')
                  .then((registration) => {
                    console.log('✅ Service Worker registrado:', registration.scope);
                  })
                  .catch((error) => {
                    console.error('❌ Error registrando Service Worker:', error);
                  });
              });
            }
          `}
        </Script>
        */}
      </head>
      <body>
        {/* Skip to main content link (accesibilidad) */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[10000] focus:bg-forest focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Saltar al contenido principal
        </a>
        
        <Navigation />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <BackToTop />
        <WhatsAppChat />
        <CookieConsent />
      </body>
    </html>
  )
}
