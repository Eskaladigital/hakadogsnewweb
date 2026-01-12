'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Phone } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-forest to-forest-dark text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para Transformar la Vida de tu Perro?
          </h2>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Agenda tu consulta gratuita y descubre cómo podemos ayudarte a construir la relación que siempre has soñado con tu perro.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/contacto" 
              className="inline-flex items-center bg-gold text-forest-dark px-8 py-4 rounded-xl font-bold hover:bg-gold/90 transition-all hover:scale-105 whitespace-nowrap"
            >
              Consulta Gratuita
              <ArrowRight className="ml-2 flex-shrink-0" size={20} />
            </Link>
            
            <a 
              href="tel:+34685648241" 
              className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all border-2 border-white/20"
            >
              <Phone size={20} className="mr-2" />
              685 64 82 41
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-300">
            Primera consulta sin compromiso · Respuesta en menos de 24h
          </p>
        </motion.div>
      </div>
    </section>
  )
}
