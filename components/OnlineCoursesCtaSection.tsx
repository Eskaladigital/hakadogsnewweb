'use client'

import Link from 'next/link'
import { GraduationCap, Video, CheckCircle, Globe, ArrowRight, BookOpen, Play } from 'lucide-react'

interface OnlineCoursesCtaSectionProps {
  cityName: string
}

export default function OnlineCoursesCtaSection({ cityName }: OnlineCoursesCtaSectionProps) {
  const benefits = [
    {
      icon: Video,
      title: 'Formación Profesional',
      description: 'Misma calidad que nuestras sesiones presenciales'
    },
    {
      icon: Globe,
      title: 'Desde Cualquier Lugar',
      description: `Aprende sin importar tu ubicación en ${cityName}`
    },
    {
      icon: BookOpen,
      title: 'A Tu Ritmo',
      description: 'Accede 24/7 a todo el contenido del curso'
    },
    {
      icon: CheckCircle,
      title: 'Método Probado',
      description: '+500 perros educados con éxito'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-forest/5 via-sage/10 to-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Badge informativo */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-forest/20">
            <Globe className="w-5 h-5 text-forest" />
            <span className="font-semibold text-forest-dark">
              ¿No puedes asistir presencialmente?
            </span>
          </span>
        </div>

        {/* Título principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
            Aprende con Nuestros
            <span className="text-forest block mt-2">Cursos Online</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Si no estás cerca de nuestra ubicación en <strong>Archena, Murcia</strong>, 
            puedes recibir la misma formación de calidad desde la comodidad de tu hogar en <strong>{cityName}</strong>
          </p>
        </div>

        {/* Grid de beneficios */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-forest/20"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-forest/10 rounded-xl mb-4">
                  <Icon className="w-7 h-7 text-forest" />
                </div>
                <h3 className="font-bold text-forest-dark mb-2 text-lg">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Destacado principal con stats */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-forest/10 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Contenido izquierdo */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full mb-6">
                <GraduationCap className="w-5 h-5 text-gold" />
                <span className="font-semibold text-gold">Educación Profesional Online</span>
              </div>
              
              <h3 className="text-3xl font-bold text-forest-dark mb-4">
                Tu Educador Canino en {cityName}, Ahora Online
              </h3>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                Con <strong className="text-forest">+8 años de experiencia</strong> y <strong className="text-forest">+500 perros educados</strong>, 
                hemos desarrollado cursos online que replican fielmente nuestras sesiones presenciales. 
                Aprenderás técnicas profesionales de educación canina que podrás aplicar inmediatamente con tu perro.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Lecciones detalladas paso a paso',
                  'Soporte directo del educador profesional',
                  'Acceso de por vida a todo el contenido',
                  'Certificado de finalización incluido'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                Ver Cursos Disponibles
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Stats derecha */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '+8', label: 'Años Experiencia' },
                { value: '+500', label: 'Perros Educados' },
                { value: '100%', label: 'Método Positivo' },
                { value: '24/7', label: 'Acceso Total' }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-gradient-to-br from-forest/10 to-forest/5 rounded-2xl p-6 text-center border-2 border-forest/20"
                >
                  <div className="text-4xl font-bold text-forest mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mensaje final */}
        <div className="text-center bg-forest/5 rounded-2xl p-8 border-2 border-forest/10">
          <p className="text-lg text-gray-700 mb-4">
            💚 <strong className="text-forest">La distancia no es un obstáculo</strong> para la educación de calidad
          </p>
          <p className="text-gray-600">
            Únete a cientos de dueños en toda España que ya están educando a sus perros con nuestros cursos online
          </p>
        </div>
      </div>
    </section>
  )
}
