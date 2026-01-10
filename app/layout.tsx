import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import BackToTop from '@/components/ui/BackToTop'
import WhatsAppChat from '@/components/ui/WhatsAppChat'

export const metadata: Metadata = {
  title: 'Hakadogs - Educación Canina Profesional',
  description: 'Educación canina profesional con métodos positivos y respetuosos. +8 años de experiencia, +500 perros educados. BE HAKA!',
  keywords: ['educador canino murcia', 'adiestrador perros archena', 'educación canina', 'adiestramiento positivo'],
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/images/hakadogs-01.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/images/hakadogs-01.png',
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
      </body>
    </html>
  )
}
