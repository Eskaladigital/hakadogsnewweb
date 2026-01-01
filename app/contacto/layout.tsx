import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakadogs - Contacto',
  description: 'Contacta con Hakadogs para consultas sobre educación canina. Respuesta en menos de 24 horas.',
}

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

