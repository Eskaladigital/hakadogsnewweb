import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies - Hakadogs',
  description: 'Política de cookies de Hakadogs. Información sobre el uso de cookies técnicas, analíticas y de preferencias en nuestro sitio web.',
  openGraph: {
    title: 'Política de Cookies | Hakadogs',
    description: 'Información sobre el uso de cookies en nuestro sitio web.',
    url: 'https://www.hakadogs.com/legal/cookies',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Política de Cookies',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Cookies | Hakadogs',
    description: 'Uso de cookies en Hakadogs.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
