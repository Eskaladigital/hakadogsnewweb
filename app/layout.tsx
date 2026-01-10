import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BackToTop from '@/components/ui/BackToTop'
import WhatsAppChat from '@/components/ui/WhatsAppChat'
import CookieConsent from '@/components/ui/CookieConsent'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hakadogs.com'),
  title: {
    default: 'Hakadogs - Educación Canina Profesional | Archena, Murcia',
    template: '%s | Hakadogs'
  },
  description: 'Educación canina profesional con metodología BE HAKA. Servicios presenciales en Murcia y cursos online en toda España. +8 años de experiencia, +500 perros educados. Métodos 100% positivos.',
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
    description: 'Educación canina profesional con metodología BE HAKA. Servicios presenciales en Murcia y cursos online en toda España. +8 años de experiencia, +500 perros educados.',
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
    description: 'Educación canina profesional con metodología BE HAKA. +8 años de experiencia, +500 perros educados.',
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
  
  // Theme Color (barra de navegación en móvil)
  themeColor: '#059669',
  
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
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Hakadogs" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Hakadogs" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#059669" />
        
        {/* Preconnect a dominios externos para reducir latencia */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload logo crítico para mejorar LCP */}
        <link 
          rel="preload" 
          as="image" 
          href="/images/hakadogs_logo_texto_transparente.webp"
          type="image/webp"
        />
        
        {/* Google Analytics - estrategia lazyOnload para no bloquear renderizado */}
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
