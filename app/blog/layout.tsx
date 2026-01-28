import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog de Educación Canina - Hakadogs',
  description: 'Blog de educación canina con consejos profesionales, guías y recursos para educar a tu perro. Artículos sobre adiestramiento, comportamiento y bienestar canino.',
  openGraph: {
    title: 'Blog de Educación Canina | Hakadogs',
    description: 'Consejos profesionales, guías y recursos para educar a tu perro. Artículos de expertos en comportamiento canino.',
    url: 'https://www.hakadogs.com/blog',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Blog de Educación Canina',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Educación Canina | Hakadogs',
    description: 'Consejos profesionales para educar a tu perro.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
