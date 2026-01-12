import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, MapPin, Clock, Globe, Users, Waves, CloudRain, Dog, FileText, AlertCircle, Sunrise } from 'lucide-react'
import { getCityBySlug } from '@/lib/cities'
import { getExtendedCityData } from '@/lib/extendedCityData'
import { getCityContent } from '@/lib/supabase/cityContent'
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
    title: `Educación Canina en ${city.name}`,
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
          url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
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
      images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
    },
  }
}

export default async function LocalidadPage({ params }: { params: { ciudad: string } }) {
  const city = getCityBySlug(params.ciudad)
  const extendedData = getExtendedCityData(params.ciudad)

  if (!city) {
    notFound()
  }

  // Determinar si es mercado local (servicios presenciales) o remoto (cursos online)
  const isLocalMarket = city.isRemoteMarket === false
  const isRemoteMarket = city.isRemoteMarket === true

  // Para ciudades remotas, obtener contenido único de Supabase
  let uniqueContent = null
  if (isRemoteMarket) {
    uniqueContent = await getCityContent(params.ciudad)
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

      {/* Contenido para mercado REMOTO (> 40km de Archena) - CONTENIDO ÚNICO CON IA */}
      {isRemoteMarket && uniqueContent && (
        <>
          {/* Hero Intro - Por qué Online desde [Ciudad] */}
          <section className="py-16 bg-gradient-to-br from-sage/10 to-cream">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-forest/10 px-4 py-2 rounded-full mb-4">
                  <Globe className="w-5 h-5 text-forest" />
                  <span className="text-forest font-semibold">Formación Online Profesional</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-forest-dark mb-4">
                  Educación Canina Online desde {city.name}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {uniqueContent.introText}
                </p>
              </div>

              {/* Beneficios Locales Únicos */}
              <div className="grid md:grid-cols-2 gap-6">
                {uniqueContent.localBenefits.map((benefit: string, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md border-2 border-forest/10 hover:border-forest/30 transition-all">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-forest flex-shrink-0 mt-1" />
                      <p className="text-gray-700 leading-relaxed">{benefit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Información Local Específica - 4 Secciones */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-forest-dark mb-4">
                  Tu Perro en {city.name}
                </h2>
                <p className="text-lg text-gray-600">
                  Información real y actualizada sobre recursos caninos en tu ciudad
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Pipicanes y Zonas Caninas */}
                <div className="bg-gradient-to-br from-forest/5 to-sage/10 rounded-2xl p-8 border-2 border-forest/10 hover:border-forest/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-forest text-white p-3 rounded-xl">
                      <Dog className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-forest-dark">Pipicanes y Zonas Caninas</h3>
                      <p className="text-sm text-gray-600">Espacios para tu perro en {city.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {uniqueContent.localInfo.pipicanes}
                  </p>
                </div>

                {/* Playas y Naturaleza */}
                <div className="bg-gradient-to-br from-gold/5 to-gold/10 rounded-2xl p-8 border-2 border-gold/10 hover:border-gold/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gold text-white p-3 rounded-xl">
                      <Waves className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-forest-dark">Playas y Espacios Dog-Friendly</h3>
                      <p className="text-sm text-gray-600">Disfruta la naturaleza con tu perro</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {uniqueContent.localInfo.playas}
                  </p>
                </div>

                {/* Normativas Municipales */}
                <div className="bg-gradient-to-br from-sage/5 to-sage/10 rounded-2xl p-8 border-2 border-sage/20 hover:border-sage/30 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-sage text-white p-3 rounded-xl">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-forest-dark">Normativas y Ordenanzas</h3>
                      <p className="text-sm text-gray-600">Regulación municipal en {city.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {uniqueContent.localInfo.normativas}
                  </p>
                </div>

                {/* Clima y Entrenamiento */}
                <div className="bg-gradient-to-br from-forest/5 to-forest/10 rounded-2xl p-8 border-2 border-forest/10 hover:border-forest/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-forest text-white p-3 rounded-xl">
                      <CloudRain className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-forest-dark">Clima y Adiestramiento</h3>
                      <p className="text-sm text-gray-600">Cómo afecta el clima local</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {uniqueContent.localInfo.clima}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Desafíos Locales que Solucionamos */}
          {uniqueContent.challenges.length > 0 && (
            <section className="py-16 bg-gradient-to-br from-cream to-sage/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border-2 border-gold/20">
                  <div className="flex items-center gap-3 mb-8">
                    <AlertCircle className="w-8 h-8 text-gold" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-forest-dark">
                        Desafíos Comunes en {city.name}
                      </h2>
                      <p className="text-gray-600">Que nuestros cursos online te ayudan a superar</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {uniqueContent.challenges.map((challenge: string, index: number) => (
                      <div key={index} className="bg-gradient-to-br from-gold/5 to-gold/10 rounded-xl p-6 border-2 border-gold/20 hover:border-gold/30 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="bg-gold/20 rounded-full p-2 mt-1">
                            <CheckCircle2 className="w-5 h-5 text-gold" />
                          </div>
                          <p className="text-gray-700 leading-relaxed">{challenge}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CTA Cursos Online */}
          <OnlineCoursesCtaSection cityName={city.name} />

          {/* Testimonial Real de la Ciudad */}
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-gradient-to-br from-forest/5 to-sage/10 rounded-2xl p-8 md:p-12 border-2 border-forest/10 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-6 h-6 text-gold" />
                  <span className="text-sm font-semibold text-gold uppercase tracking-wide">Testimonio Real desde {city.name}</span>
                </div>
                <blockquote className="text-xl md:text-2xl text-gray-700 italic mb-6 leading-relaxed">
                  &ldquo;{uniqueContent.testimonial.text}&rdquo;
                </blockquote>
                <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t-2 border-forest/10">
                  <div>
                    <p className="font-bold text-forest-dark text-lg">{uniqueContent.testimonial.author}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {uniqueContent.testimonial.neighborhood}, {city.name}
                    </p>
                  </div>
                  <div className="bg-gold/20 px-4 py-2 rounded-full">
                    <p className="text-sm font-semibold text-gold">⭐⭐⭐⭐⭐ Verificado</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs Específicas de la Ciudad */}
          <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-forest-dark mb-8 text-center">
                Preguntas Frecuentes desde {city.name}
              </h2>
              <div className="space-y-4">
                {uniqueContent.faqs.map((faq: any, index: number) => (
                  <details key={index} className="bg-white rounded-xl p-6 shadow-md border-2 border-gray-100 hover:border-forest/20 transition-all group">
                    <summary className="font-semibold text-lg text-gray-800 cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <ArrowRight className="w-5 h-5 text-forest transform group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Sección Subsidiaria: Servicios Presenciales */}
          <section className="py-16 bg-gradient-to-br from-cream to-sage/10">
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border-2 border-gray-100 text-center">
                <Sunrise className="w-16 h-16 text-forest mx-auto mb-6" />
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  ¿Buscas Servicio Presencial?
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed max-w-2xl mx-auto">
                  Nuestros servicios presenciales de educación canina están disponibles en <strong>Archena, Murcia</strong> y localidades cercanas (radio de 40 km). 
                  Si estás en {city.name}, te recomendamos nuestros <strong>cursos online</strong> con la misma metodología profesional.
                </p>
                {city.distanceFromArchena && (
                  <div className="bg-sage/10 rounded-xl p-4 mb-6 inline-block">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sage" />
                      Distancia desde Archena: <strong className="text-forest">{city.distanceFromArchena} km</strong>
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link 
                    href="/cursos" 
                    className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-md"
                  >
                    Ver Cursos Online
                    <ArrowRight className="w-5 h-5" />
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
          </section>

          <SessionsShowcase />
          <AppsSection />
          <AboutSection />
          
          {/* CTA Final */}
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
