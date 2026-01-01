import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCityBySlug, getAllCitySlugs } from '@/lib/cities'
import { getExtendedCityData } from '@/lib/extendedCityData'
import Hero from '@/components/Hero'
import ServicesSection from '@/components/ServicesSection'
import LocalParksSection from '@/components/LocalParksSection'
import SessionsShowcase from '@/components/SessionsShowcase'
import LocalInfoSection from '@/components/LocalInfoSection'
import AppsSection from '@/components/AppsSection'
import AboutSection from '@/components/AboutSection'
import LocalTestimonialsSection from '@/components/LocalTestimonialsSection'
import CTASection from '@/components/CTASection'

export async function generateStaticParams() {
  const slugs = getAllCitySlugs()
  return slugs.map((slug) => ({
    ciudad: slug,
  }))
}

export async function generateMetadata({ params }: { params: { ciudad: string } }): Promise<Metadata> {
  const city = getCityBySlug(params.ciudad)
  
  if (!city) {
    return {
      title: 'Hakadogs - Ciudad no encontrada',
    }
  }

  return {
    title: `Hakadogs - Educación Canina en ${city.name}`,
    description: city.description,
    keywords: city.keywords.join(', '),
    openGraph: {
      title: `Educación Canina Profesional en ${city.name}`,
      description: city.description,
      type: 'website',
      locale: 'es_ES',
    },
  }
}

export default function LocalidadPage({ params }: { params: { ciudad: string } }) {
  const city = getCityBySlug(params.ciudad)
  const extendedData = getExtendedCityData(params.ciudad)

  if (!city) {
    notFound()
  }

  return (
    <>
      <Hero
        badge={`Educación Canina en ${city.name} · ${city.province}`}
        title={
          <>
            Educación Canina
            <span className="block text-forest">en {city.name}</span>
          </>
        }
        description={`Transforma la relación con tu perro a través de métodos positivos y respetuosos. Servicio profesional en ${city.name} y alrededores.`}
        primaryCTA={{
          text: 'Primera Sesión Gratis',
          href: '/contacto'
        }}
        secondaryCTA={{
          text: 'Ver Servicios',
          href: '/servicios'
        }}
        stats={[
          { value: '+15', label: 'Años Experiencia' },
          { value: '3', label: 'Apps Exclusivas' },
          { value: '100%', label: 'Método Positivo' }
        ]}
        floatingBadge={{
          emoji: '📍',
          title: city.name,
          subtitle: city.province
        }}
      />
      
      <ServicesSection />

      {/* CONTENIDO ÚNICO: Parques Caninos */}
      {extendedData && extendedData.parks.length > 0 && (
        <LocalParksSection
          cityName={city.name}
          parks={extendedData.parks}
          description={`${city.name} cuenta con ${extendedData.parks.length} zonas principales donde tu perro puede ejercitarse y socializar de forma segura.`}
        />
      )}

      <SessionsShowcase />

      {/* CONTENIDO ÚNICO: Desafíos Locales */}
      {extendedData && extendedData.challenges.length > 0 && (
        <LocalInfoSection
          cityName={city.name}
          challenges={extendedData.challenges}
          localTip={extendedData.localTip}
        />
      )}

      <AppsSection />

      {/* CONTENIDO ÚNICO: Testimonios Locales */}
      {extendedData && extendedData.testimonials.length > 0 ? (
        <LocalTestimonialsSection
          cityName={city.name}
          testimonials={extendedData.testimonials}
        />
      ) : (
        <AboutSection />
      )}

      <CTASection />
    </>
  )
}
