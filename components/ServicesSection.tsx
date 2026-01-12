'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GraduationCap, Heart, Baby, Users } from 'lucide-react'

const services = [
  {
    icon: GraduationCap,
    title: 'Educación Básica',
    description: 'Comandos esenciales y obediencia para una convivencia perfecta.',
    link: '/servicios/educacion-basica',
    color: 'forest'
  },
  {
    icon: Heart,
    title: 'Modificación de Conducta',
    description: 'Soluciones efectivas para problemas de comportamiento.',
    link: '/servicios/modificacion-conducta',
    color: 'terracotta'
  },
  {
    icon: Baby,
    title: 'Educación de Cachorros',
    description: 'Socialización temprana y bases sólidas desde el principio.',
    link: '/servicios/cachorros',
    color: 'gold'
  },
  {
    icon: Users,
    title: 'Clases Grupales',
    description: 'Socialización controlada y aprendizaje en grupo.',
    link: '/servicios/clases-grupales',
    color: 'sage'
  }
]

export default function ServicesSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Programas personalizados adaptados a las necesidades de cada perro y familia
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={service.link}>
                <div className="group bg-cream rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-forest/20">
                  <div className={`w-16 h-16 bg-${service.color}/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`text-${service.color}`} size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-forest-dark mb-3 group-hover:text-forest transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  
                  <div className="text-forest font-semibold group-hover:translate-x-2 transition-transform inline-block">
                    Saber más →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/servicios" className="btn-primary inline-block">
            Ver Todos los Servicios
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
