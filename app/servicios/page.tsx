import { Metadata } from 'next'
import ServicesHero from '@/components/services/ServicesHero'
import ServicesGrid from '@/components/services/ServicesGrid'
import OnlineCoursesSection from '@/components/services/OnlineCoursesSection'
import ProcessSection from '@/components/services/ProcessSection'
import PricingSection from '@/components/services/PricingSection'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'Hakadogs - Servicios de Educación Canina',
  description: 'Educación básica, modificación de conducta, cachorros y clases grupales. Métodos positivos y personalizados.',
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
