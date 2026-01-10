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
        url: '/images/logo_facebook_1200_630.jpg',
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
    images: ['/images/logo_facebook_1200_630.jpg'],
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/images/hakadogs-01.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/images/hakadogs-01.png',
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NXPT2KNYGJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NXPT2KNYGJ');
          `}
        </Script>
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <BackToTop />
        <WhatsAppChat />
        <CookieConsent />
      </body>
    </html>
  )
}
