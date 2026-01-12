'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const galleryImages = [
  {
    src: '/images/images_Foto 26-3-21 17 03 23.jpg',
    alt: 'Sesión de educación canina - Hakadogs'
  },
  {
    src: '/images/57c5c9f809d29326008b53ad.jpg',
    alt: 'Entrenamiento con perro - Hakadogs'
  },
  {
    src: '/images/EwXEDf2XMAMGhqN.jpg',
    alt: 'Educación canina profesional'
  },
  {
    src: '/images/d60234abc4831dfd6d07b333f8a73110.jpg',
    alt: 'Sesión de socialización canina'
  },
  {
    src: '/images/d2nomd8-0c6985e4-6016-47e3-a07a-92b7826da4ca.jpg',
    alt: 'Trabajo con cachorros - Hakadogs'
  },
  {
    src: '/images/7c96a9_0fb8981c949d418fb3191508ae90a7c5_mv2_d_1402_1600_s_2.jpg',
    alt: 'Educación canina en Murcia'
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

