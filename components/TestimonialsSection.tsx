'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'María González',
    dog: 'Luna (Golden Retriever)',
    text: 'Alfredo transformó completamente el comportamiento de Luna. Pasamos de paseos imposibles a disfrutar juntas cada salida. Su método es respetuoso y efectivo.',
    rating: 5,
    image: '👩'
  },
  {
    name: 'Carlos Martínez',
    dog: 'Max (Pastor Alemán)',
    text: 'La agresividad de Max con otros perros era un problema serio. Gracias a Hakadogs y las técnicas de Alfredo, ahora puede socializar sin problemas.',
    rating: 5,
    image: '👨'
  },
  {
    name: 'Ana López',
    dog: 'Coco (Cachorro)',
    text: 'Empezamos desde cachorro y fue la mejor decisión. Las bases que puso Alfredo han sido fundamentales. Ahora Coco es un perro equilibrado y feliz.',
    rating: 5,
    image: '👩‍🦰'
  }
]

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Historias reales de transformación y éxito
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-cream rounded-2xl p-8 relative"
            >
              <Quote className="absolute top-6 right-6 text-sage/20" size={48} />
              
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-gold fill-gold" size={20} />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-gray-700 mb-6 relative z-10">
                &quot;{testimonial.text}&quot;
              </p>
              
              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-forest-dark">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.dog}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Reviews Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-3 bg-white rounded-xl shadow-lg px-8 py-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-gold fill-gold" size={20} />
              ))}
            </div>
            <div className="border-l border-gray-300 pl-3">
              <div className="font-bold text-forest-dark">4.9/5</div>
              <div className="text-sm text-gray-600">50+ reseñas en Google</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
