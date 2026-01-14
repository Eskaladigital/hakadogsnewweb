'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function ServicesGallery() {
  const photos = [
    {
      src: '/images/hakadogs/6694D2C8-51F8-42C0-867C-D48893A11691.jpeg',
      alt: 'Sesión de educación canina en exterior',
      label: 'Trabajo en Exterior'
    },
    {
      src: '/images/hakadogs/IMG_2775.jpeg',
      alt: 'Educación personalizada uno a uno',
      label: 'Atención Personalizada'
    },
    {
      src: '/images/hakadogs/IMG_5942.jpeg',
      alt: 'Trabajo con múltiples perros',
      label: 'Socialización'
    },
    {
      src: '/images/hakadogs/IMG_9864.jpeg',
      alt: 'Actividades y juego estructurado',
      label: 'Juego Estructurado'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-sage/5 to-cream/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-forest-dark mb-4">
            Así Trabajamos
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fotos reales de nuestras sesiones. Cada servicio adaptado a las necesidades específicas de tu perro.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.src}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm">{photo.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
