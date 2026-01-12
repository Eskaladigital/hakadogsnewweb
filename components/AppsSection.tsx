'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Dumbbell, Users as UsersIcon, Smartphone } from 'lucide-react'

const apps = [
  {
    icon: Heart,
    name: 'HakaHealth',
    tagline: 'Salud y Seguimiento',
    description: 'Historial médico completo, veterinarios cercanos y seguimiento del programa de educación.',
    features: ['Vacunas y recordatorios', 'Sesiones con el educador', 'Progreso de comandos'],
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Dumbbell,
    name: 'HakaTrainer',
    tagline: 'Entrenamiento y Juegos',
    description: 'Biblioteca completa de ejercicios, juegos interactivos y seguimiento de tu progreso.',
    features: ['50+ ejercicios detallados', 'Juegos mentales', 'Sistema de logros'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: UsersIcon,
    name: 'HakaCommunity',
    tagline: 'Red Social Canina',
    description: 'Conecta con otros dueños, busca amigos para tu perro y participa en eventos.',
    features: ['Buscar amigos caninos', 'Foro y eventos', 'Mapa de recursos'],
    color: 'from-green-500 to-emerald-500'
  }
]

export default function AppsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-forest-dark to-forest text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3 mb-6">
              <Smartphone size={20} />
              <span className="font-semibold">Plataforma Digital Completa</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              3 Apps Revolucionarias
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              La única plataforma completa de educación canina en España. 
              Mantén a tu perro saludable, entrenado y socializado todo en un solo lugar.
            </p>
          </motion.div>
        </div>

        {/* Apps Grid */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {apps.map((app, index) => (
            <motion.div
              key={app.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:bg-white/15 transition-all"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center mb-6`}>
                <app.icon size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">{app.name}</h3>
              <p className="text-gold font-semibold mb-4">{app.tagline}</p>
              <p className="text-gray-300 mb-6">{app.description}</p>
              
              <ul className="space-y-2">
                {app.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <div className="inline-block bg-gold/50 text-forest-dark px-8 py-4 rounded-xl font-bold cursor-not-allowed opacity-75">
            🚧 Próximamente - Por desarrollar
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Las apps estarán disponibles en dominios únicos próximamente
          </p>
        </motion.div>
      </div>
    </section>
  )
}
