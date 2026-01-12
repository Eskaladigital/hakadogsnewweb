'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Award, Heart, TrendingUp, Users } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] relative">
                <Image
                  src="/images/EwXEDf2XMAMGhqN.jpg"
                  alt="Alfredo - Educador Canino Profesional"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            
            {/* Stats overlay */}
            <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-forest">+8</div>
                  <div className="text-sm text-gray-600">Años</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-forest">+500</div>
                  <div className="text-sm text-gray-600">Perros</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-2 bg-forest/10 rounded-full mb-6">
              <span className="text-forest font-semibold text-sm">Sobre Nosotros</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-6">
              Alfredo, tu Educador Canino de Confianza
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Con más de 8 años de experiencia y más de 500 perros educados, Alfredo ha perfeccionado 
              un método único que combina técnicas de educación positiva con un profundo entendimiento 
              del comportamiento canino.
            </p>
            
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Su filosofía <strong className="text-forest">&quot;BE HAKA&quot;</strong> se centra en el respeto 
              mutuo, la comunicación clara y el fortalecimiento del vínculo entre tú y tu perro.
            </p>

            {/* Key Points */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="text-forest" size={20} />
                </div>
                <div>
                  <div className="font-bold text-forest-dark">Certificado</div>
                  <div className="text-sm text-gray-600">Profesional Acreditado</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="text-forest" size={20} />
                </div>
                <div>
                  <div className="font-bold text-forest-dark">Métodos Positivos</div>
                  <div className="text-sm text-gray-600">Sin castigos físicos</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-forest" size={20} />
                </div>
                <div>
                  <div className="font-bold text-forest-dark">Resultados</div>
                  <div className="text-sm text-gray-600">100% satisfacción</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="text-forest" size={20} />
                </div>
                <div>
                  <div className="font-bold text-forest-dark">Personalizado</div>
                  <div className="text-sm text-gray-600">Para cada familia</div>
                </div>
              </div>
            </div>

            <Link href="/sobre-nosotros" className="btn-primary inline-block">
              Conoce Más Sobre Nosotros
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
