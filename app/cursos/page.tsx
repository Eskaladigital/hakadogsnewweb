'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Download, ShoppingCart, CheckCircle, Mail, FileText, Star, Clock, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CursosPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular envío (aquí iría la integración real con tu servicio de newsletter)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setLoading(false)
    setEmail('')
    
    // Reset después de 5 segundos
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cursos de Educación Canina
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto opacity-95">
            Aprende a educar a tu perro desde casa, a tu ritmo
          </p>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Materiales descargables y cursos completos diseñados por profesionales
          </p>
        </div>
      </section>

      {/* Curso Gratuito Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gold to-yellow-400 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 text-white">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Download className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Curso Gratuito</h2>
                    <p className="text-white/90">Introducción a la Educación Canina</p>
                  </div>
                </div>

                <p className="text-lg mb-6 text-white/95">
                  Descarga nuestro curso gratuito en PDF y aprende los fundamentos de la educación canina positiva. 
                  Perfecto para empezar tu camino con tu perro.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Conceptos Básicos</h3>
                      <p className="text-sm text-white/90">Comunicación canina y lenguaje corporal</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Primeros Pasos</h3>
                      <p className="text-sm text-white/90">Cómo establecer rutinas y límites</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Ejercicios Prácticos</h3>
                      <p className="text-sm text-white/90">Ejercicios paso a paso con imágenes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">PDF Descargable</h3>
                      <p className="text-sm text-white/90">Acceso inmediato tras suscripción</p>
                    </div>
                  </div>
                </div>

                {/* Newsletter Form */}
                <form onSubmit={handleNewsletterSubmit} className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Tu email"
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || submitted}
                      className="bg-white text-forest-dark font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {loading ? 'Enviando...' : submitted ? '✓ Enviado' : 'Descargar Gratis'}
                    </button>
                  </div>
                  {submitted && (
                    <p className="mt-4 text-sm text-white/90 text-center">
                      ✓ ¡Gracias! Revisa tu email para acceder al curso gratuito.
                    </p>
                  )}
                  <p className="mt-4 text-xs text-white/80 text-center">
                    Al suscribirte, aceptas recibir emails con contenido educativo. Puedes darte de baja en cualquier momento.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Curso de Pago Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Curso Completo de Educación Canina
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                El curso más completo para educar a tu perro desde cero hasta nivel avanzado
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Información del Curso */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-forest to-sage rounded-xl flex items-center justify-center mr-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Curso Premium</h3>
                    <p className="text-gray-600">Más de 10 horas de contenido</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-forest mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Módulos Completos</h4>
                      <p className="text-gray-600 text-sm">8 módulos con teoría y práctica detallada</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-forest mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Videos Explicativos</h4>
                      <p className="text-gray-600 text-sm">Más de 50 videos HD con ejercicios paso a paso</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-forest mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Materiales Descargables</h4>
                      <p className="text-gray-600 text-sm">PDFs, guías, checklists y recursos adicionales</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-forest mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Acceso de Por Vida</h4>
                      <p className="text-gray-600 text-sm">Una vez comprado, acceso ilimitado para siempre</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-forest mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Soporte por Email</h4>
                      <p className="text-gray-600 text-sm">Resuelve tus dudas con nuestro equipo</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-bold text-gray-900 mb-4">Contenido del Curso:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 1: Fundamentos de la Educación Canina
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 2: Comunicación y Lenguaje Corporal
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 3: Comandos Básicos (Sentado, Quieto, Ven)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 4: Paseo y Socialización
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 5: Resolución de Problemas Comunes
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 6: Ejercicios Avanzados
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 7: Mantenimiento y Refuerzo
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-forest rounded-full mr-3"></span>
                      Módulo 8: Recursos y Próximos Pasos
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Precio y Compra */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-forest to-sage rounded-2xl shadow-xl p-8 text-white sticky top-24"
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                    <Star className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">Curso Premium</h3>
                  <p className="text-white/90 mb-6">Educación Canina Completa</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold">99€</span>
                      <span className="text-xl text-white/70 ml-2">/único pago</span>
                    </div>
                    <p className="text-white/80 mt-2">Acceso de por vida</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                    <div className="space-y-4 text-left">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-3" />
                        <span>+10 horas de contenido</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 mr-3" />
                        <span>8 módulos completos</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-3" />
                        <span>Soporte incluido</span>
                      </div>
                      <div className="flex items-center">
                        <Download className="w-5 h-5 mr-3" />
                        <span>Materiales descargables</span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-white text-forest-dark font-bold py-4 px-8 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center whitespace-nowrap mb-4">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Comprar Ahora
                  </button>
                  
                  <p className="text-sm text-white/80">
                    Pago seguro • Garantía de 30 días • Acceso inmediato
                  </p>
                </div>

                {/* Testimonios */}
                <div className="border-t border-white/20 pt-6 mt-8">
                  <h4 className="font-semibold mb-4">Lo que dicen nuestros estudiantes:</h4>
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                        ))}
                      </div>
                      <p className="text-sm text-white/90 italic">
                        &quot;El mejor curso que he comprado. Mi perro ahora obedece perfectamente.&quot;
                      </p>
                      <p className="text-xs text-white/70 mt-2">- María G.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                        ))}
                      </div>
                      <p className="text-sm text-white/90 italic">
                        &quot;Muy completo y fácil de seguir. Los videos son excelentes.&quot;
                      </p>
                      <p className="text-xs text-white/70 mt-2">- Juan P.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿Cómo accedo al curso gratuito?</h3>
                <p className="text-gray-600">
                  Simplemente suscríbete con tu email arriba y recibirás el enlace de descarga del PDF en tu bandeja de entrada.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿El curso de pago es para siempre?</h3>
                <p className="text-gray-600">
                  Sí, una vez comprado el curso premium, tendrás acceso de por vida a todo el contenido y futuras actualizaciones.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿Puedo ver el curso en móvil?</h3>
                <p className="text-gray-600">
                  Sí, el curso es completamente responsive y puedes acceder desde cualquier dispositivo: móvil, tablet o ordenador.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿Hay garantía de devolución?</h3>
                <p className="text-gray-600">
                  Sí, ofrecemos garantía de 30 días. Si no estás satisfecho, te devolvemos el 100% de tu dinero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
