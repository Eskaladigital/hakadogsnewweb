import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getCityBySlug } from '@/lib/cities'
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
import OnlineCoursesCtaSection from '@/components/OnlineCoursesCtaSection'

// NO generamos páginas estáticas - se renderizan dinámicamente
// Esto reduce el build time de minutos a segundos
export const dynamic = 'force-dynamic'

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
      title: `Educación Canina Profesional en ${city.name} | Hakadogs`,
      description: city.description,
      url: `https://www.hakadogs.com/localidades/${city.slug}`,
      type: 'website',
      locale: 'es_ES',
      images: [
        {
          url: '/images/logo_facebook_1200_630.jpg',
          width: 1200,
          height: 630,
          alt: `Hakadogs - Educación Canina en ${city.name}`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Educación Canina en ${city.name} | Hakadogs`,
      description: city.description,
      images: ['/images/logo_facebook_1200_630.jpg'],
    },
  }
}

export default function LocalidadPage({ params }: { params: { ciudad: string } }) {
  const city = getCityBySlug(params.ciudad)
  const extendedData = getExtendedCityData(params.ciudad)

  if (!city) {
    notFound()
  }

  // Determinar si es mercado local (servicios presenciales) o remoto (cursos online)
  const isLocalMarket = city.isRemoteMarket === false
  const isRemoteMarket = city.isRemoteMarket === true

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
        description={
          isLocalMarket 
            ? `Transforma la relación con tu perro a través de métodos positivos y respetuosos. Servicio profesional presencial en ${city.name} y alrededores.`
            : `Educación canina profesional desde ${city.name}. Aprende con nuestros cursos online diseñados por expertos. La misma calidad que nuestras sesiones presenciales, desde la comodidad de tu hogar.`
        }
        primaryCTA={{
          text: isLocalMarket ? 'Primera Sesión Gratis' : 'Ver Cursos Online',
          href: isLocalMarket ? '/contacto' : '/cursos'
        }}
        secondaryCTA={{
          text: isLocalMarket ? 'Ver Servicios' : 'Saber Más',
          href: isLocalMarket ? '/servicios' : '/sobre-nosotros'
        }}
        stats={[
          { value: '+8', label: 'Años Experiencia' },
          { value: isLocalMarket ? 'Presencial' : 'Online', label: isLocalMarket ? 'En tu Ciudad' : 'Desde Casa' },
          { value: '100%', label: 'Método Positivo' }
        ]}
        floatingBadge={{
          emoji: isLocalMarket ? '📍' : '🌐',
          title: city.name,
          subtitle: isLocalMarket ? `${city.province} · Servicio Presencial` : `${city.province} · Cursos Online`
        }}
      />
      
      {/* Contenido para mercado LOCAL (< 40km de Archena) */}
      {isLocalMarket && (
        <>
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

          {/* Sección adicional de Cursos Online (complementaria) */}
          <section className="py-16 bg-gradient-to-br from-sage/10 to-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border-2 border-forest/10">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Izquierda - Texto */}
                  <div>
                    <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full mb-4">
                      <span className="text-gold font-semibold">🎓 Formación Online</span>
                    </div>
                    <h2 className="text-3xl font-bold text-forest-dark mb-4">
                      ¿Prefieres aprender desde casa?
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Además de nuestros servicios presenciales en {city.name}, también ofrecemos 
                      <strong className="text-forest"> cursos online completos</strong> que puedes seguir 
                      a tu ritmo. Perfectos si prefieres la flexibilidad del aprendizaje online o 
                      quieres complementar tus sesiones presenciales.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2 text-gray-700">
                        ✅ Mismo contenido profesional que sesiones presenciales
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        ✅ Acceso 24/7 desde cualquier dispositivo
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        ✅ Soporte directo del educador
                      </li>
                      <li className="flex items-center gap-2 text-gray-700">
                        ✅ Complementa tus sesiones presenciales
                      </li>
                    </ul>
                    <Link
                      href="/cursos"
                      className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      Explorar Cursos Online
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>

                  {/* Derecha - Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-forest/10 to-forest/5 rounded-2xl p-6 text-center border-2 border-forest/20">
                      <div className="text-4xl font-bold text-forest mb-2">11+</div>
                      <div className="text-sm text-gray-600 font-medium">Cursos Disponibles</div>
                    </div>
                    <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 text-center border-2 border-gold/20">
                      <div className="text-4xl font-bold text-gold mb-2">24/7</div>
                      <div className="text-sm text-gray-600 font-medium">Acceso Total</div>
                    </div>
                    <div className="bg-gradient-to-br from-forest/10 to-forest/5 rounded-2xl p-6 text-center border-2 border-forest/20">
                      <div className="text-4xl font-bold text-forest mb-2">HD</div>
                      <div className="text-sm text-gray-600 font-medium">Vídeos Calidad</div>
                    </div>
                    <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-2xl p-6 text-center border-2 border-gold/20">
                      <div className="text-4xl font-bold text-gold mb-2">100%</div>
                      <div className="text-sm text-gray-600 font-medium">Online Flexible</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <CTASection />
        </>
      )}

      {/* Contenido para mercado REMOTO (> 40km de Archena) */}
      {isRemoteMarket && (
        <>
          {/* CTA Destacado de Cursos Online */}
          <OnlineCoursesCtaSection cityName={city.name} />

          {/* Información sobre servicios presenciales (solo informativo) */}
          <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  ¿Buscas Servicio Presencial?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nuestros servicios presenciales de educación canina están disponibles en la zona de <strong>Archena, Murcia</strong> y localidades cercanas (radio de 40 km). 
                  Si estás en {city.name}, te recomendamos nuestros <strong>cursos online</strong>, diseñados con la misma metodología profesional y con soporte directo.
                </p>
                {city.distanceFromArchena && (
                  <p className="text-sm text-gray-500 mb-4">
                    📍 Distancia desde Archena: <strong>~{city.distanceFromArchena} km</strong>
                  </p>
                )}
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/cursos" 
                    className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white px-8 py-4 rounded-xl font-semibold transition-all"
                  >
                    Ver Cursos Online
                  </Link>
                  <Link 
                    href="/servicios" 
                    className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-forest border-2 border-forest px-8 py-4 rounded-xl font-semibold transition-all"
                  >
                    Info Servicios Presenciales
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <SessionsShowcase />
          <AppsSection />
          <AboutSection />
          
          {/* CTA final enfocado en cursos online */}
          <section className="py-20 bg-gradient-to-br from-forest via-forest-dark to-forest">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                ¿Listo para Transformar la Vida de tu Perro?
              </h2>
              <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
                Únete a cientos de familias en {city.name} que ya están educando a sus perros con nuestros cursos profesionales online.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  href="/cursos"
                  className="inline-flex items-center gap-2 bg-white hover:bg-cream text-forest px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-xl"
                >
                  Ver Todos los Cursos
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contacto"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-white/10 text-white border-2 border-white px-8 py-4 rounded-xl font-semibold transition-all"
                >
                  Contactar
                </Link>
              </div>
              <p className="text-cream/80 mt-8 text-sm">
                Primera lección gratuita · Sin compromiso · Soporte incluido
              </p>
            </div>
          </section>
        </>
      )}
    </>
  )
}
