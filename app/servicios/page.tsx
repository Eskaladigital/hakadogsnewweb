import { Metadata } from 'next'
import ServicesHero from '@/components/services/ServicesHero'
import ServicesGrid from '@/components/services/ServicesGrid'
import OnlineCoursesSection from '@/components/services/OnlineCoursesSection'
import ProcessSection from '@/components/services/ProcessSection'
import PricingSection from '@/components/services/PricingSection'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'Servicios de Educación Canina - Presencial en Murcia',
  description: 'Educación básica, modificación de conducta, cachorros y clases grupales. Servicios presenciales en Archena y Murcia. Métodos positivos y personalizados. +8 años de experiencia.',
  alternates: {
    canonical: 'https://www.hakadogs.com/servicios',
  },
  openGraph: {
    title: 'Servicios de Educación Canina - Presencial en Murcia | Hakadogs',
    description: 'Educación básica, modificación de conducta, cachorros y clases grupales. Servicios presenciales en Archena y Murcia con métodos positivos.',
    url: 'https://www.hakadogs.com/servicios',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Servicios de Educación Canina',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios de Educación Canina | Hakadogs',
    description: 'Educación básica, modificación de conducta, cachorros y clases grupales en Murcia.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function ServiciosPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <OnlineCoursesSection />
      <ProcessSection />
      <PricingSection />
      <CTASection />
    </>
  )
}
