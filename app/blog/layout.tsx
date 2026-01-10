import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Consejos y Educación Canina | Hakadogs',
  description: 'Artículos y consejos sobre educación canina, adiestramiento y cuidado de perros. Metodología BE HAKA, trucos, ejercicios y más.',
  alternates: {
    canonical: 'https://www.hakadogs.com/blog',
  },
  openGraph: {
    title: 'Blog - Consejos y Educación Canina | Hakadogs',
    description: 'Artículos sobre educación canina, adiestramiento y cuidado de perros con metodología BE HAKA.',
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
    title: 'Blog - Consejos y Educación Canina | Hakadogs',
    description: 'Artículos sobre educación canina y adiestramiento.',
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

