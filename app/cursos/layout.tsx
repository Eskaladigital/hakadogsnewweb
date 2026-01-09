import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakadogs - Cursos de Educación Canina',
  description: 'Múltiples cursos online de educación canina. Curso gratuito en PDF y más de 10 cursos específicos por problema: sentarse, venir, no tirar de la correa, solucionar mordidas, socialización y más.',
  keywords: 'cursos educación canina, adiestramiento perros, cursos online perros, enseñar perro sentarse, perro tirar correa, solucionar mordidas perro',
}

export default function CursosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
