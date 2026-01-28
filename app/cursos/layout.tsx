import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursos de Educación Canina Online - Hakadogs',
  description: 'Cursos online de educación canina profesional. +11 cursos específicos por problema: sentarse, venir, tirar correa, mordidas, socialización. Acceso 24/7 en toda España.',
  openGraph: {
    title: 'Cursos de Educación Canina Online | Hakadogs',
    description: 'Más de 11 cursos online de educación canina. Aprende desde casa con metodología profesional. Curso gratuito disponible.',
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
    description: '+11 cursos online específicos por problema. Metodología BE HAKA.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
