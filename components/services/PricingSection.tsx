'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const plans = [
  {
    name: 'Educación Básica',
    price: '250€',
    sessions: '8-10 sesiones',
    features: [
      'Evaluación inicial completa',
      '8-10 sesiones personalizadas',
      'Comandos básicos completos',
      'Control de paseo',
      'Material de apoyo',
      'Seguimiento por WhatsApp',
      'Acceso a las 3 apps'
    ],
    popular: false
  },
  {
    name: 'Modificación Conducta',
    price: 'Desde 270€',
    sessions: '12-15 sesiones',
    features: [
      'Evaluación exhaustiva',
      '12-15 sesiones especializadas',
      'Plan personalizado',
      'Técnicas específicas',
      'Seguimiento intensivo',
      'Soporte 24/7 en emergencias',
      'Acceso a las 3 apps',
      'Revisiones gratuitas'
    ],
    popular: true
  },
  {
    name: 'Cachorros',
    price: '200€',
    sessions: '6-8 sesiones',
    features: [
      'Evaluación inicial',
      '6-8 sesiones adaptadas',
      'Socialización temprana',
      'Prevención de problemas',
      'Guía de cachorros',
      'Seguimiento por WhatsApp',
      'Acceso a las 3 apps'
    ],
    popular: false
  }
]

export default function PricingSection() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forest-dark mb-4">
            Planes y Precios
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Inversión en la felicidad y bienestar de tu perro
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-4 border-forest shadow-2xl scale-105' 
                  : 'border-2 border-sage/20'
              }`}
            >
              {plan.popular && (
                <div className="bg-forest text-white text-sm font-bold px-4 py-2 rounded-full inline-block mb-4">
                  Más Popular
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-forest-dark mb-2">
                {plan.name}
              </h3>
              
              <div className="mb-4">
                <div className="text-4xl font-bold text-forest">{plan.price}</div>
                <div className="text-sm text-gray-600">{plan.sessions}</div>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start space-x-2">
                    <Check className="text-forest flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                href="/contacto"
                className={`block text-center py-3 px-6 rounded-xl font-bold transition-all ${
                  plan.popular
                    ? 'bg-forest text-white hover:bg-forest-dark'
                    : 'bg-forest/10 text-forest hover:bg-forest hover:text-white'
                }`}
              >
                Empezar Ahora
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            <strong>Clases Grupales:</strong> 15€/sesión o bonos mensuales disponibles
          </p>
          <p className="text-sm text-gray-500">
            Todos los precios incluyen acceso completo a las 3 apps de Hakadogs
          </p>
        </motion.div>
      </div>
    </section>
  )
}
