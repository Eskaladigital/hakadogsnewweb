'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'

export default function SessionsShowcase() {
  const sessions = [
    {
      image: '/images/images_Foto 26-3-21 17 03 23.jpg',
      title: 'Trabajo en Exterior',
      description: 'Sesiones al aire libre para socialización y control en entornos reales'
    },
    {
      image: '/images/EwXEDf2XMAMGhqN.jpg',
      title: 'Educación Personalizada',
      description: 'Atención individual adaptada a cada perro y familia'
    },
    {
      image: '/images/d60234abc4831dfd6d07b333f8a73110.jpg',
      title: 'Conexión y Vínculo',
      description: 'Fortalecemos la relación entre perro y propietario'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 bg-forest/10 rounded-full px-6 py-3 mb-6">
              <Camera className="text-forest" size={20} />
              <span className="text-forest font-semibold">Sesiones en Acción</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
              Así Trabajamos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada sesión es única, adaptada a las necesidades específicas de tu perro
            </p>
          </motion.div>
        </div>

        {/* Sessions Grid */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {sessions.map((session, index) => (
            <motion.div
              key={session.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl mb-4">
                <Image
                  src={session.image}
                  alt={session.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{session.title}</h3>
                  <p className="text-sm text-gray-200">{session.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

