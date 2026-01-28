import { Metadata } from 'next'
import Hero from '@/components/Hero'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { GraduationCap, Play, CheckCircle, ArrowRight, BookOpen, Clock, Award } from 'lucide-react'
import { Suspense } from 'react'
import { ServicesSkeleton, TestimonialsSkeleton, GallerySkeleton } from '@/components/ui/LoadingSkeleton'

export const metadata: Metadata = {
  title: 'Hakadogs - Educación Canina Profesional | Archena, Murcia',
  description: 'Educador canino en Archena y Murcia con +8 años de experiencia. Metodología BE HAKA: educación presencial en Región de Murcia y cursos online España. ¡500+ perros felices!',
  openGraph: {
    title: 'Hakadogs - Educación Canina Profesional | Archena, Murcia',
    description: 'Educador canino en Archena y Murcia con +8 años de experiencia. Metodología BE HAKA: educación presencial en Región de Murcia y cursos online España.',
    url: 'https://www.hakadogs.com',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Educación Canina Profesional',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hakadogs - Educación Canina Profesional',
    description: 'Educador canino Archena-Murcia. Metodología BE HAKA, +8 años experiencia, 500+ perros felices.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

// Lazy load componentes below-the-fold para mejorar FCP/LCP
const ServicesSection = dynamic(() => import('@/components/ServicesSection'))
const SessionsShowcase = dynamic(() => import('@/components/SessionsShowcase'))
const AppsSection = dynamic(() => import('@/components/AppsSection'))
const AboutSection = dynamic(() => import('@/components/AboutSection'))
const GallerySection = dynamic(() => import('@/components/GallerySection'))
const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'))
const CTASection = dynamic(() => import('@/components/CTASection'))

export default function Home() {
  return (
    <>
      <Hero
        title={
          <>
            Educación Canina
            <span className="block text-forest">Profesional</span>
          </>
        }
        description="Transforma la relación con tu perro a través de la metodología BE HAKA: servicios presenciales en Murcia y cursos online en toda España. +8 años de experiencia, +500 perros educados."
        primaryCTA={{
          text: 'Contacto',
          href: '/contacto'
        }}
        secondaryCTA={{
          text: 'Ver Servicios',
          href: '/servicios'
        }}
      />
      
      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>
      
      {/* Sección Cursos Online (NUEVA - DESTACADA) */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gold/5 via-cream to-white relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4">
              <GraduationCap className="text-gold" size={18} />
              <span className="text-gold font-semibold text-xs sm:text-sm">Formación Online Profesional</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-forest-dark mb-3 sm:mb-4">
              Cursos Online de Educación Canina
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Aprende desde casa con la misma calidad que nuestras sesiones presenciales. 
              11+ cursos específicos por problema, disponibles 24/7 para toda España.
            </p>
          </div>

          {/* Grid de Beneficios */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              {
                icon: BookOpen,
                title: '11+ Cursos',
                description: 'Específicos por problema'
              },
              {
                icon: Play,
                title: 'Contenido Completo',
                description: 'Paso a paso detallado'
              },
              {
                icon: Clock,
                title: '24/7 Acceso',
                description: 'Aprende a tu ritmo'
              },
              {
                icon: Award,
                title: 'Certificados',
                description: 'Al completar cada curso'
              }
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all text-center border-2 border-gray-100 hover:border-gold/30">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="text-gold" size={24} />
                </div>
                <h3 className="font-bold text-forest-dark mb-1 text-sm sm:text-base">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Grande */}
          <div className="bg-gradient-to-br from-gold to-yellow-400 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center p-6 sm:p-8 md:p-12">
              {/* Izquierda - Contenido */}
              <div className="text-white">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                  Empieza Hoy con Nuestro Curso Gratuito
                </h3>
                <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed">
                  Accede gratis a nuestro curso introductorio y descubre cómo la metodología BE HAKA 
                  puede transformar la relación con tu perro. Sin tarjeta de crédito.
                </p>

                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {[
                    'Fundamentos de educación positiva',
                    'Comunicación efectiva con tu perro',
                    'Ejercicios prácticos paso a paso',
                    'Acceso inmediato y para siempre'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-white" size={14} />
                      </div>
                      <span className="text-sm sm:text-base text-white/95">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/cursos"
                    className="inline-flex items-center gap-2 bg-white text-forest-dark px-8 py-4 rounded-xl font-bold hover:bg-white/90 transition-all shadow-lg"
                  >
                    Ver Todos los Cursos
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    href="/cursos/auth/registro"
                    className="inline-flex items-center gap-2 bg-white/10 border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    Acceder Gratis
                    <GraduationCap size={20} />
                  </Link>
                </div>
              </div>

              {/* Derecha - Stats */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">+8</div>
                  <div className="text-xs sm:text-sm text-white/90">Años Experiencia</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">+500</div>
                  <div className="text-xs sm:text-sm text-white/90">Perros Educados</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">11+</div>
                  <div className="text-xs sm:text-sm text-white/90">Cursos Disponibles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-white/20">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">24/7</div>
                  <div className="text-xs sm:text-sm text-white/90">Acceso Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial rápido */}
          <div className="mt-8 sm:mt-10 md:mt-12 text-center">
            <p className="text-gray-600 italic mb-2">
              &quot;Los cursos online de Hakadogs tienen la misma calidad que sus sesiones presenciales. 
              Alfredo explica todo con claridad y los resultados son increíbles.&quot;
            </p>
            <p className="text-sm text-gray-500">
              — Cliente satisfecho · Alicante
            </p>
          </div>
        </div>
      </section>
      
      <SessionsShowcase />
      
      {/* Apps Section - Solo contenido verde, full width */}
      <AppsSection />
      
      <AboutSection />
      
      <Suspense fallback={<GallerySkeleton />}>
        <GallerySection />
      </Suspense>
      
      <Suspense fallback={<TestimonialsSkeleton />}>
        <TestimonialsSection />
      </Suspense>
      
      <CTASection />
    </>
  )
}
