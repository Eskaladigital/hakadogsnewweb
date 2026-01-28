import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto - Hakadogs',
  description: 'Contacta con Hakadogs para tu consulta gratuita de educación canina. Teléfono: 685 64 82 41. Archena, Murcia y alrededores. Respuesta en 24 horas.',
  openGraph: {
    title: 'Contacto | Hakadogs - Educación Canina Profesional',
    description: 'Solicita tu consulta gratuita de educación canina. Servicios presenciales en Archena, Murcia y alrededores.',
    url: 'https://www.hakadogs.com/contacto',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Contacto',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contacto | Hakadogs',
    description: 'Consulta gratuita de educación canina. Archena, Murcia.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
