import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Award, Heart, TrendingUp, Users, Target, BookOpen, ArrowRight, Gamepad2, BarChart3, MapPin, GraduationCap, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nosotros - Alfredo Gandolfo',
  description: 'Alfredo Gandolfo, educador canino profesional en Archena-Murcia. Enfoque BE HAKA. Binomio perro-guía. Educamos desde el equilibrio.',
  alternates: {
    canonical: 'https://www.hakadogs.com/sobre-nosotros',
  },
  openGraph: {
    title: 'Sobre Nosotros - Alfredo Gandolfo | Hakadogs',
    description: 'Conoce a Alfredo y el Enfoque BE HAKA: binomio perro-guía, juego estructurado y resultados medibles. Educamos desde el equilibrio.',
    url: 'https://www.hakadogs.com/sobre-nosotros',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Alfredo Gandolfo - Educador Canino Profesional',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre Nosotros - Alfredo Gandolfo | Hakadogs',
    description: 'Conoce a Alfredo y el Enfoque BE HAKA. Educamos desde el equilibrio. Creamos binomios.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-cream via-white to-sage/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-forest/10 rounded-full mb-4 sm:mb-6">
                <span className="text-forest font-semibold text-xs sm:text-sm">Sobre Nosotros</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-forest-dark mb-4 sm:mb-6">
                Alfredo Gandolfo
                <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-sage mt-2">Educador Canino Profesional</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6">
                Con <strong className="text-forest">amplia experiencia en el sector</strong>, he desarrollado el <strong className="text-forest">Enfoque BE HAKA</strong>: un sistema basado en el binomio perro-guía, juego estructurado y resultados medibles. <strong className="text-forest">Educamos desde el equilibrio</strong>.
              </p>

              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-6 sm:mb-8">
                Desde Archena (Murcia), ofrezco <strong>servicios presenciales</strong> en un radio de 40 km y <strong>cursos online profesionales</strong> para toda España, llevando la misma calidad de formación a cualquier rincón del país.
              </p>

              <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-forest">Educamos desde</div>
                  <div className="text-xs sm:text-sm text-gray-600">el equilibrio</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-forest">Amplia experiencia</div>
                  <div className="text-xs sm:text-sm text-gray-600">en el sector</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-forest">Creamos</div>
                  <div className="text-xs sm:text-sm text-gray-600">binomios</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src="/images/hakadogs_educacion_canina_home_2.png"
                  alt="Alfredo Gandolfo - Educador Canino Profesional"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              
              {/* Badges flotantes */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-gold text-forest-dark px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl font-bold text-center">
                <div className="text-lg sm:text-xl md:text-2xl">BE HAKA</div>
                <div className="text-xs">Enfoque</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Propuesta: Dual (Presencial + Online) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-forest-dark mb-3 sm:mb-4">
              Nuestra Propuesta de Valor
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Educación canina adaptada a tu ubicación: servicios presenciales en Murcia o cursos online en toda España
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {/* Servicios Presenciales */}
            <div className="bg-gradient-to-br from-forest/10 to-sage/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-forest/20">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-forest/10 rounded-xl flex items-center justify-center">
                  <MapPin className="text-forest" size={24} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-forest-dark">Servicios Presenciales</h3>
                  <p className="text-xs sm:text-sm text-gray-600">Archena y alrededores (40 km)</p>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Sesiones 1 a 1 personalizadas en tu entorno o en espacios exteriores. 
                Trabajo directo contigo y tu perro para resolver problemas específicos y construir hábitos duraderos.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Educación básica y obediencia</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Modificación de conducta</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Educación de cachorros</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-forest rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Clases grupales</span>
                </li>
              </ul>

              <Link
                href="/servicios"
                className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Ver Servicios
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Cursos Online */}
            <div className="bg-gradient-to-br from-gold/10 to-yellow-50 rounded-3xl p-8 border-2 border-gold/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-gold" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-forest-dark">Cursos Online</h3>
                  <p className="text-sm text-gray-600">Toda España · 24/7 Acceso</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Formación profesional desde casa con la misma calidad que las sesiones presenciales. 
                11+ cursos específicos por problema, con contenido detallado y acceso de por vida.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Cursos específicos por problema</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Lecciones paso a paso</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Aprende a tu ritmo</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 text-sm">Acceso de por vida</span>
                </li>
              </ul>

              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-forest-dark px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Ver Cursos Online
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enfoque BE HAKA */}
      <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Enfoque BE HAKA
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Un sistema completo basado en ciencia, estructura y respeto al binomio perro-guía
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Users className="text-gold" size={32} />
                <h3 className="font-bold text-xl">Binomio Perro-Guía</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                No entrenamos perros solos, trabajamos con el sistema completo: tú, tu perro y vuestro entorno como unidad.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Gamepad2 className="text-gold" size={32} />
                <h3 className="font-bold text-xl">Juego Estructurado</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                El juego como herramienta técnica para construir conexión, activación funcional y pasividad con control.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-gold" size={32} />
                <h3 className="font-bold text-xl">Principio de Premack</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                El entorno como reforzador gestionado. Más libertad se gana con mejor reenganche.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-gold" size={32} />
                <h3 className="font-bold text-xl">Datos, No Sensaciones</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Medimos recuperación, latencia de respuesta y tasa de éxito. Ajustamos según datos reales.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-gold" size={32} />
                <h3 className="font-bold text-xl">Un Criterio a la Vez</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                Simplicidad operativa: un objetivo claro por ejercicio, una variable de progresión por ciclo.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-gold" size={32} />
                <h3 className="font-bold text-xl">Bienestar Emocional</h3>
              </div>
              <p className="text-white/90 text-sm leading-relaxed">
                El éxito es ejecución funcional con estabilidad emocional. Si no hay recuperación, el diseño falla.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
            <p className="text-xl text-white font-semibold mb-2">
              &quot;La estructura protege el aprendizaje&quot;
            </p>
            <p className="text-white/80">
              Menos ejercicios, mejor ejecutados, con más calidad emocional
            </p>
            <Link
              href="/metodologia"
              className="inline-flex items-center gap-2 bg-white text-forest px-6 py-3 rounded-xl font-semibold mt-6 hover:bg-white/90 transition-all"
            >
              Conocer Enfoque Completo
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Galería de Trabajo Real */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-forest-dark mb-4">
              Nuestro Día a Día
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fotos reales de nuestras sesiones de trabajo. Así es como transformamos la vida de perros y familias
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="/images/hakadogs/6694D2C8-51F8-42C0-867C-D48893A11691.jpeg"
                alt="Sesión de educación canina en exterior"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-semibold">Trabajo en Exterior</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="/images/hakadogs/IMG_5217.jpeg"
                alt="Entrenamiento personalizado"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-semibold">Educación Personalizada</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="/images/hakadogs/IMG_9864.jpeg"
                alt="Trabajo con agua y natación"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-semibold">Actividades Acuáticas</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="/images/hakadogs/1e6a0b3a-db28-45da-902a-0e6fd90dc3f9.jpeg"
                alt="Conexión perro-guía"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-semibold">Binomio Perro-Guía</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="/images/hakadogs/IMG_5942.jpeg"
                alt="Socialización controlada"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-semibold">Socialización</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl group">
              <Image
                src="/images/hakadogs/IMG_7864.jpeg"
                alt="Juego estructurado"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-sm font-semibold">Juego Estructurado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            Nuestros Valores
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Respeto Absoluto',
                description: 'Métodos 100% positivos basados en el respeto mutuo. Sin castigos físicos, sin herramientas aversivas, sin dominancia.'
              },
              {
                icon: Target,
                title: 'Personalización Total',
                description: 'Cada perro es único. Adaptamos la metodología a la personalidad, edad, historial y necesidades específicas de cada caso.'
              },
              {
                icon: TrendingUp,
                title: 'Resultados Medibles',
                description: 'Nos comprometemos con el éxito. Medimos el progreso con datos reales y ajustamos el enfoque hasta lograr los objetivos.'
              }
            ].map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-forest" size={32} />
                </div>
                <h3 className="text-xl font-bold text-forest-dark mb-3 text-center">{value.title}</h3>
                <p className="text-gray-700 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            ¿Por Qué Elegir Hakadogs?
          </h2>
          
          <div className="space-y-6">
            {[
              {
                icon: Award,
                title: 'Experiencia Comprobada',
                description: 'Amplia experiencia en el sector, educamos desde el equilibrio en toda la Región de Murcia y España'
              },
              {
                icon: Users,
                title: 'Atención Personalizada',
                description: 'No somos una franquicia. Conocerás siempre al mismo educador: Alfredo. Trato directo y seguimiento continuo'
              },
              {
                icon: BookOpen,
                title: 'Enfoque Probado',
                description: 'BE HAKA: sistema estructurado basado en ciencia, resultados medibles y respeto al binomio perro-guía'
              },
              {
                icon: GraduationCap,
                title: 'Formación Continua',
                description: 'Actualización constante en etología, neurociencia y últimas técnicas de educación positiva'
              },
              {
                icon: MapPin,
                title: 'Doble Opción',
                description: 'Servicios presenciales en Murcia o cursos online para toda España. La misma calidad en ambos formatos'
              },
              {
                icon: Heart,
                title: 'Pasión Genuina',
                description: 'Esto no es solo un trabajo, es nuestra vocación. Amamos lo que hacemos y se nota en cada sesión'
              }
            ].map((reason) => (
              <div key={reason.title} className="flex items-start space-x-4 bg-cream rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <reason.icon className="text-forest" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-forest-dark text-lg mb-2">{reason.title}</h3>
                  <p className="text-gray-700">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-sage/20 to-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-forest-dark mb-4">
            ¿Listo para BE HAKA?
          </h2>
          <p className="text-xl text-gray-700 mb-2">
            Cuéntanos sobre tu perro y cómo podemos ayudaros
          </p>
          <p className="text-gray-600 mb-8">
            Servicios presenciales en Murcia · Cursos online en toda España
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/contacto"
              className="inline-flex items-center bg-forest hover:bg-forest-dark text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Solicitar Consulta Gratuita
              <ArrowRight className="ml-2 flex-shrink-0" size={20} />
            </Link>
            <Link 
              href="/cursos"
              className="inline-flex items-center bg-gold hover:bg-gold/90 text-forest-dark px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Ver Cursos Online
              <GraduationCap className="ml-2 flex-shrink-0" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
