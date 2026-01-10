import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - Consulta Gratuita | Hakadogs',
  description: 'Contacta con Hakadogs para consultas sobre educación canina. Servicios presenciales en Murcia y cursos online. Respuesta en menos de 24 horas. Tel: 685 64 82 41',
  openGraph: {
    title: 'Contacto - Consulta Gratuita | Hakadogs',
    description: 'Contacta con Hakadogs para servicios presenciales en Murcia o cursos online. Respuesta en menos de 24 horas.',
    url: 'https://www.hakadogs.com/contacto',
    images: [
      {
        url: '/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Contacto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto | Hakadogs',
    description: 'Servicios presenciales en Murcia y cursos online. Tel: 685 64 82 41',
    images: ['/images/logo_facebook_1200_630.jpg'],
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

