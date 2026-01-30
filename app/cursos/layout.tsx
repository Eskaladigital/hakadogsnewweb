import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursos de Educación Canina Online - Hakadogs',
  description: 'Cursos online de educación canina profesional con Enfoque BE HAKA. +11 cursos específicos por problema: sentarse, venir, tirar correa, mordidas, socialización. Acceso 24/7 en toda España.',
  openGraph: {
    title: 'Cursos de Educación Canina Online | Hakadogs',
    description: 'Más de 11 cursos online de educación canina. Aprende desde casa con el Enfoque BE HAKA. Curso gratuito disponible.',
    url: 'https://www.hakadogs.com/cursos',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Cursos de Educación Canina',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos de Educación Canina Online | Hakadogs',
    description: '+11 cursos online específicos por problema. Enfoque BE HAKA.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Preconnect para optimizar LCP de imágenes de Supabase Storage */}
      <link rel="preconnect" href="https://pfmqkioftagjnxqyrngk.supabase.co" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://pfmqkioftagjnxqyrngk.supabase.co" />
      {children}
    </>
  )
}
