import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cursos Online de Educación Canina | Hakadogs',
  description: 'Múltiples cursos online de educación canina. Curso gratuito + 11 cursos específicos por problema: sentarse, venir, no tirar de la correa, solucionar mordidas, socialización y más. Acceso 24/7.',
  keywords: 'cursos educación canina, adiestramiento perros online, cursos perros, enseñar perro sentarse, perro tirar correa, solucionar mordidas perro, BE HAKA',
  openGraph: {
    title: 'Cursos Online de Educación Canina | Hakadogs',
    description: 'Curso gratuito + 11 cursos específicos por problema. Aprende desde casa con la metodología BE HAKA. Acceso 24/7.',
    url: 'https://www.hakadogs.com/cursos',
    images: [
      {
        url: '/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Cursos Online de Educación Canina',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cursos Online de Educación Canina | Hakadogs',
    description: '11+ cursos específicos por problema. Metodología BE HAKA. Acceso 24/7.',
    images: ['/images/logo_facebook_1200_630.jpg'],
  },
}

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
