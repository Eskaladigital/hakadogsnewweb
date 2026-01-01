import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakadogs - Blog',
  description: 'Artículos y consejos sobre educación canina, adiestramiento y cuidado de perros.',
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

