import Hero from '@/components/Hero'
import ServicesSection from '@/components/ServicesSection'
import SessionsShowcase from '@/components/SessionsShowcase'
import AppsSection from '@/components/AppsSection'
import AboutSection from '@/components/AboutSection'
import GallerySection from '@/components/GallerySection'
import TestimonialsSection from '@/components/TestimonialsSection'
import CTASection from '@/components/CTASection'
import Link from 'next/link'
import { GraduationCap, Play, CheckCircle, ArrowRight, BookOpen, Clock, Award } from 'lucide-react'

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
          text: 'Consulta Gratuita',
          href: '/contacto'
        }}
        secondaryCTA={{
          text: 'Ver Servicios',
          href: '/servicios'
        }}
      />
      
      <ServicesSection />
      
      {/* Sección Cursos Online (NUEVA - DESTACADA) */}
      <section className="py-20 bg-gradient-to-br from-gold/5 via-cream to-white relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full mb-4">
              <GraduationCap className="text-gold" size={20} />
              <span className="text-gold font-semibold text-sm">Formación Online Profesional</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
              Cursos Online de Educación Canina
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aprende desde casa con la misma calidad que nuestras sesiones presenciales. 
              11+ cursos específicos por problema, disponibles 24/7 para toda España.
            </p>
          </div>

          {/* Grid de Beneficios */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: BookOpen,
                title: '11+ Cursos',
                description: 'Específicos por problema'
              },
              {
                icon: Play,
                title: 'Vídeos HD',
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
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-center border-2 border-gray-100 hover:border-gold/30">
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="text-gold" size={28} />
                </div>
                <h3 className="font-bold text-forest-dark mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Grande */}
          <div className="bg-gradient-to-br from-gold to-yellow-400 rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
              {/* Izquierda - Contenido */}
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-4">
                  Empieza Hoy con Nuestro Curso Gratuito
                </h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Accede gratis a nuestro curso introductorio y descubre cómo la metodología BE HAKA 
                  puede transformar la relación con tu perro. Sin tarjeta de crédito.
                </p>

                <ul className="space-y-3 mb-6">
                  {[
                    'Fundamentos de educación positiva',
                    'Comunicación efectiva con tu perro',
                    'Ejercicios prácticos paso a paso',
                    'Acceso inmediato y para siempre'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <span className="text-white/95">{item}</span>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">+8</div>
                  <div className="text-sm text-white/90">Años Experiencia</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">+500</div>
                  <div className="text-sm text-white/90">Perros Educados</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">11+</div>
                  <div className="text-sm text-white/90">Cursos Disponibles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">24/7</div>
                  <div className="text-sm text-white/90">Acceso Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial rápido */}
          <div className="mt-12 text-center">
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
      
      {/* Apps Section - Actualizada con nota */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-forest-dark mb-4">
              Próximamente: Ecosistema Digital Completo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos desarrollando 3 aplicaciones que complementarán nuestros servicios presenciales y cursos online
            </p>
          </div>
          <AppsSection />
          <div className="text-center mt-8">
            <p className="inline-flex items-center gap-2 bg-sage/10 px-6 py-3 rounded-full text-sage font-semibold">
              🚧 En desarrollo · Próximo lanzamiento 2026
            </p>
          </div>
        </div>
      </section>
      
      <AboutSection />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
