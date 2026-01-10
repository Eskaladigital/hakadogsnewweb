'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, CheckCircle, CreditCard, Lock, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ComprarCursoPage({ params }: { params: { cursoId: string } }) {
  const { cursoId } = params
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')

  // Mock data
  const curso = {
    id: cursoId,
    title: 'Cómo Enseñar a tu Perro a Caminar sin Tirar de la Correa',
    description: 'Paseos relajados y disfrutables. Deja de luchar con tu perro en cada paseo.',
    price: 19.99,
    duration: '1 hora',
    difficulty: 'Intermedio',
    icon: '🚶',
    color: 'from-purple-500 to-purple-600',
    whatYouLearn: [
      'Técnicas de paseo sin tirar',
      'Cómo usar la correa correctamente',
      'Ejercicios progresivos de dificultad',
      'Solución para perros que tiran mucho'
    ],
    includes: [
      '5 lecciones en video HD',
      'Guías descargables en PDF',
      'Acceso de por vida',
      'Soporte por email'
    ]
  }

  const handleComprarCurso = () => {
    // Aquí iría la integración con Stripe/PayPal
    setTimeout(() => {
      setStep('success')
    }, 1500)
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Compra Realizada con Éxito!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Ya tienes acceso al curso <span className="font-semibold">&quot;{curso.title}&quot;</span>
              </p>
              <div className="space-y-4">
                <Link
                  href={`/cursos/mi-escuela/${cursoId}`}
                  className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all"
                >
                  Comenzar Curso Ahora
                </Link>
                <Link
                  href="/cursos/mi-escuela"
                  className="block w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Ir a Mi Escuela
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/cursos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Cursos
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info del Curso */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <div className={`bg-gradient-to-r ${curso.color} rounded-xl p-8 text-white mb-8`}>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{curso.title}</h1>
                    <p className="text-white/90 text-lg">{curso.description}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {curso.duration}
                    </span>
                    <span>{curso.difficulty}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Qué aprenderás:</h2>
                  <ul className="space-y-3">
                    {curso.whatYouLearn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Este curso incluye:</h2>
                  <ul className="space-y-3">
                    {curso.includes.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>

                  <div className="space-y-4 mb-6">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center ${
                        paymentMethod === 'card'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Tarjeta de Crédito/Débito</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, American Express</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('paypal')}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center ${
                        paymentMethod === 'paypal'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-6 h-6 mr-3 flex items-center justify-center">
                        <span className="text-2xl">💳</span>
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">PayPal</div>
                        <div className="text-sm text-gray-600">Pago seguro con PayPal</div>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Número de tarjeta
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fecha de expiración
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nombre en la tarjeta
                        </label>
                        <input
                          type="text"
                          placeholder="Juan Pérez"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600 mb-6">
                    <Lock className="w-4 h-4 mr-2" />
                    Pago 100% seguro y encriptado
                  </div>

                  <button
                    onClick={handleComprarCurso}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all"
                  >
                    Completar Compra - {curso.price}€
                  </button>
                </motion.div>
              )}
            </div>

            {/* Resumen de Compra */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de Compra</h3>
                
                <div className="mb-6">
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Precio del curso:</span>
                    <span className="font-semibold">{curso.price}€</span>
                  </div>
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>IVA (21%):</span>
                    <span className="font-semibold">{(curso.price * 0.21).toFixed(2)}€</span>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span>{(curso.price * 1.21).toFixed(2)}€</span>
                  </div>
                </div>

                {step === 'info' ? (
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center mb-4"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Proceder al Pago
                  </button>
                ) : null}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Garantía de 30 días
                  </h4>
                  <p className="text-sm text-green-800">
                    Si no estás satisfecho, te devolvemos el 100% de tu dinero.
                  </p>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    Acceso inmediato tras el pago
                  </p>
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    Contenido disponible 24/7
                  </p>
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                    Actualizaciones gratuitas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
