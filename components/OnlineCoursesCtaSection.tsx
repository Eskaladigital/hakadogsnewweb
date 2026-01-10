'use client'

import { motion } from 'framer-motion'
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
    <section className="py-20 bg-gradient-to-br from-forest/5 via-sage/10 to-cream relative overflow-hidden">
      {/* Patrón de fondo decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-forest rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Badge informativo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border-2 border-forest/20">
            <Globe className="w-5 h-5 text-forest" />
            <span className="font-semibold text-forest-dark">
              ¿No puedes asistir presencialmente?
            </span>
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
            Aprende con Nuestros
            <span className="text-forest block mt-2">Cursos Online</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Si no estás cerca de nuestra ubicación en <strong>Archena, Murcia</strong>, 
            puedes recibir la misma formación de calidad desde la comodidad de tu hogar en <strong>{cityName}</strong>
          </p>
        </motion.div>

        {/* Grid de beneficios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
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
              </motion.div>
            )
          })}
        </motion.div>

        {/* Destacado principal con stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-forest/10 mb-12"
        >
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
                  'Vídeos HD paso a paso de cada ejercicio',
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
                { value: '+8', label: 'Años Experiencia', color: 'forest' },
                { value: '+500', label: 'Perros Educados', color: 'gold' },
                { value: '100%', label: 'Método Positivo', color: 'sage' },
                { value: '24/7', label: 'Acceso Total', color: 'forest' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-gradient-to-br from-${stat.color}/10 to-${stat.color}/5 rounded-2xl p-6 text-center border-2 border-${stat.color}/20`}
                >
                  <div className={`text-4xl font-bold text-${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mensaje final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center bg-forest/5 rounded-2xl p-8 border-2 border-forest/10"
        >
          <p className="text-lg text-gray-700 mb-4">
            💚 <strong className="text-forest">La distancia no es un obstáculo</strong> para la educación de calidad
          </p>
          <p className="text-gray-600">
            Únete a cientos de dueños en toda España que ya están educando a sus perros con nuestros cursos online
          </p>
        </motion.div>
      </div>
    </section>
  )
}
