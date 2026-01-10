import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies - GDPR | Hakadogs',
  description: 'Información sobre el uso de cookies en Hakadogs. Cumplimiento GDPR. Cookies necesarias, analíticas y de marketing. Gestiona tus preferencias.',
  openGraph: {
    title: 'Política de Cookies | Hakadogs',
    description: 'Información sobre el uso de cookies en Hakadogs. Cumplimiento GDPR. Gestiona tus preferencias.',
    url: 'https://www.hakadogs.com/legal/cookies',
    images: [
      {
        url: '/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Política de Cookies',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Cookies | Hakadogs',
    description: 'Información sobre cookies y GDPR.',
    images: ['/images/logo_facebook_1200_630.jpg'],
  },
}

export default function CookiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
