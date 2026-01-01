'use client'

import { motion } from 'framer-motion'
import { Star, MapPin } from 'lucide-react'

interface Testimonial {
  name: string
  neighborhood: string
  rating: number
  text: string
  problem: string
}

interface LocalTestimonialsProps {
  cityName: string
  testimonials: Testimonial[]
}

export default function LocalTestimonialsSection({ cityName, testimonials }: LocalTestimonialsProps) {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-forest-dark mb-4">
            Testimonios Reales de {cityName}
          </h2>
          <p className="text-xl text-gray-600">
            Lo que dicen nuestros clientes en tu ciudad
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-gold fill-current" />
                ))}
              </div>

              {/* Problema resuelto */}
              <div className="inline-block px-3 py-1 bg-forest/10 rounded-full mb-4">
                <span className="text-xs font-semibold text-forest">
                  {testimonial.problem}
                </span>
              </div>

              {/* Testimonio */}
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Autor */}
              <div className="flex items-center pt-4 border-t border-gray-100">
                <div className="w-12 h-12 bg-forest-dark rounded-full flex items-center justify-center text-white font-bold text-xl mr-3 flex-shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-forest-dark">{testimonial.name}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin size={12} className="mr-1" />
                    {testimonial.neighborhood}, {cityName}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {testimonials.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600">
              <strong>+{testimonials.length - 3} testimonios más</strong> de clientes satisfechos en {cityName}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
