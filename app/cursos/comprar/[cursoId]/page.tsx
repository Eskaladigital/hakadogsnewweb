'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, CheckCircle, CreditCard, Lock, Clock, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSession } from '@/lib/supabase/auth'
import { getCourseBySlug, hasPurchasedCourse, createPurchase } from '@/lib/supabase/courses'
import type { Course } from '@/lib/supabase/courses'

export default function ComprarCursoPage({ params }: { params: { cursoId: string } }) {
  const router = useRouter()
  const { cursoId } = params
  const [loading, setLoading] = useState(true)
  const [curso, setCurso] = useState<Course | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [alreadyPurchased, setAlreadyPurchased] = useState(false)
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card')
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    async function loadData() {
      try {
        // Verificar autenticación
        const { data: sessionData } = await getSession()
        if (!sessionData?.session) {
          router.push(`/cursos/auth/login?redirect=/cursos/comprar/${cursoId}`)
          return
        }

        const uid = sessionData.session.user.id
        setUserId(uid)

        // Cargar curso desde la BD
        const courseData = await getCourseBySlug(cursoId)
        
        if (!courseData) {
          setError('Curso no encontrado')
          setLoading(false)
          return
        }

        // Verificar si es gratuito
        if (courseData.is_free) {
          router.push('/cursos/mi-escuela')
          return
        }

        setCurso(courseData)

        // Verificar si ya lo compró
        const purchased = await hasPurchasedCourse(uid, courseData.id)
        if (purchased) {
          setAlreadyPurchased(true)
        }

      } catch (error) {
        console.error('Error cargando datos:', error)
        setError('Error al cargar el curso')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [cursoId, router])

  const handleComprarCurso = async () => {
    if (!curso || !userId) return

    setProcessing(true)
    setError(null)

    try {
      // Aquí iría la integración real con Stripe
      // Por ahora, simulamos el pago y registramos directamente
      
      // Registrar la compra en la BD
      await createPurchase({
        user_id: userId,
        course_id: curso.id,
        price_paid: curso.price,
        payment_status: 'completed',
        payment_method: paymentMethod,
        payment_id: `mock_${Date.now()}`, // En producción vendría de Stripe
        purchase_date: new Date().toISOString()
      })

      // Éxito
      setStep('success')
    } catch (error) {
      console.error('Error al procesar la compra:', error)
      setError('Error al procesar el pago. Por favor, intenta de nuevo.')
    } finally {
      setProcessing(false)
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      basico: 'Básico',
      intermedio: 'Intermedio',
      avanzado: 'Avanzado'
    }
    return labels[difficulty] || difficulty
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      basico: 'from-green-500 to-green-600',
      intermedio: 'from-amber-500 to-amber-600',
      avanzado: 'from-red-500 to-red-600'
    }
    return colors[difficulty] || colors.basico
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    )
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Curso no encontrado'}
          </h1>
          <Link
            href="/cursos"
            className="inline-block bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
          >
            Volver a Cursos
          </Link>
        </div>
      </div>
    )
  }

  if (alreadyPurchased) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Ya tienes este curso
          </h1>
          <p className="text-gray-600 mb-6">
            Este curso ya está disponible en tu escuela
          </p>
          <Link
            href={`/cursos/mi-escuela/${curso.slug}`}
            className="inline-block bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
          >
            Ir al Curso
          </Link>
        </div>
      </div>
    )
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
                  href={`/cursos/mi-escuela/${curso.slug}`}
                  className="block w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all"
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

  const colorGradient = getDifficultyColor(curso.difficulty)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-full lg:max-w-6xl mx-auto">
          <Link
            href="/cursos"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Cursos
          </Link>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info del Curso */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                <div className={`bg-gradient-to-r ${colorGradient} rounded-xl p-8 text-white mb-8`}>
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{curso.title}</h1>
                    <p className="text-white/90 text-lg">{curso.short_description || curso.description}</p>
                  </div>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {curso.duration_minutes} min
                    </span>
                    <span>{getDifficultyLabel(curso.difficulty)}</span>
                  </div>
                </div>

                {curso.what_you_learn && curso.what_you_learn.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Qué aprenderás:</h2>
                    <ul className="space-y-3">
                      {curso.what_you_learn.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Este curso incluye:</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-forest mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{curso.total_lessons} lecciones en video HD</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-forest mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Materiales descargables</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-forest mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Acceso de por vida</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-forest mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Actualizaciones gratuitas</span>
                    </li>
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
                      disabled={processing}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center ${
                        paymentMethod === 'card'
                          ? 'border-forest bg-forest/5'
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
                      disabled={processing}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center ${
                        paymentMethod === 'paypal'
                          ? 'border-forest bg-forest/5'
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
                          disabled={processing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                            disabled={processing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            disabled={processing}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                          disabled={processing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>Completar Compra - {curso.price.toFixed(2)}€</>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Al completar la compra, aceptas nuestros términos y condiciones. El acceso al curso será inmediato.
                  </p>
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
                    <span className="font-semibold">{curso.price.toFixed(2)}€</span>
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
                    className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center mb-4"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Proceder al Pago
                  </button>
                ) : null}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Política de Reembolso
                  </h4>
                  <p className="text-sm text-amber-800">
                    No hay devoluciones una vez que se ha accedido al contenido del curso. Todas las compras son finales debido a la naturaleza digital del producto.
                  </p>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-forest mr-2 mt-0.5 flex-shrink-0" />
                    Acceso inmediato tras el pago
                  </p>
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-forest mr-2 mt-0.5 flex-shrink-0" />
                    Contenido disponible 24/7
                  </p>
                  <p className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-forest mr-2 mt-0.5 flex-shrink-0" />
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
