'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const galleryImages = [
  {
    src: '/images/hakadogs/6694D2C8-51F8-42C0-867C-D48893A11691.jpeg',
    alt: 'Sesión de educación canina profesional - Hakadogs'
  },
  {
    src: '/images/hakadogs/IMG_5217.jpeg',
    alt: 'Pastor alemán en entrenamiento - Hakadogs'
  },
  {
    src: '/images/hakadogs/1e6a0b3a-db28-45da-902a-0e6fd90dc3f9.jpeg',
    alt: 'Educación canina con técnicas positivas'
  },
  {
    src: '/images/hakadogs/IMG_7864.jpeg',
    alt: 'Sesión de juego educativo con perro'
  },
  {
    src: '/images/hakadogs/IMG_5942.jpeg',
    alt: 'Trabajo con múltiples perros - Hakadogs'
  },
  {
    src: '/images/hakadogs/IMG_9864.jpeg',
    alt: 'Natación y ejercicio canino en Murcia'
  }
]

export default function GallerySection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-forest/10 rounded-full mb-6">
              <span className="text-forest font-semibold text-sm">Nuestro Trabajo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
              Transformaciones Reales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada perro tiene una historia. Estas son algunas de nuestras sesiones de trabajo.
            </p>
          </motion.div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
          <p className="text-gray-600 mb-4">
            ¿Quieres que tu perro sea el próximo caso de éxito?
          </p>
          <a href="/contacto" className="btn-primary inline-block">
            Reserva tu Primera Sesión
          </a>
        </motion.div>
      </div>
    </section>
  )
}

