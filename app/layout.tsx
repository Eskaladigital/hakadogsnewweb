import './globals.css'
import type { Metadata } from 'next'
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
