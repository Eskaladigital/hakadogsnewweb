'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Download, ShoppingCart, CheckCircle, Mail, Clock, Loader2, ChevronDown, MapPin, Phone, Calendar, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { getAllCourses } from '@/lib/supabase/courses'
import type { Course } from '@/lib/supabase/courses'

export default function CursosPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cursosGratuitos, setCursosGratuitos] = useState<Course[]>([])
  const [cursosPago, setCursosPago] = useState<Course[]>([])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    async function loadCursos() {
      try {
        const allCourses = await getAllCourses(false) // Solo publicados
        const gratuitos = allCourses.filter(c => c.is_free)
        const pago = allCourses.filter(c => !c.is_free)
        
        setCursosGratuitos(gratuitos)
        setCursosPago(pago)
      } catch (error) {
        console.error('Error cargando cursos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCursos()
  }, [])

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
      basico: 'bg-green-100 text-green-700',
      intermedio: 'bg-amber-100 text-amber-700',
      avanzado: 'bg-red-100 text-red-700'
    }
    return colors[difficulty] || colors.basico
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Verificar si hay sesión
    const session = localStorage.getItem('hakadogs_cursos_session')
    if (session) {
      const data = JSON.parse(session)
      if (data.loggedIn) {
        // Si está logueado, dar acceso directo
        setSubmitted(true)
        setLoading(false)
        setEmail('')
        setTimeout(() => {
          window.location.href = '/cursos/mi-escuela/curso-gratuito'
        }, 2000)
        return
      }
    }
    
    // Si no está logueado, redirigir a registro
    setLoading(false)
    window.location.href = '/cursos/auth/registro'
  }

  const handleBuyCourse = (cursoSlug: string) => {
    // Verificar si hay sesión
    const session = localStorage.getItem('hakadogs_cursos_session')
    if (session) {
      const data = JSON.parse(session)
      if (data.loggedIn) {
        // Si está logueado, ir a comprar
        window.location.href = `/cursos/comprar/${cursoSlug}`
        return
      }
    }
    // Si no está logueado, ir a registro
    window.location.href = '/cursos/auth/registro'
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: '¿Cómo accedo al curso gratuito?',
      answer: 'Simplemente regístrate con tu email arriba y tendrás acceso inmediato al curso gratuito en tu panel "Mi Escuela".'
    },
    {
      question: '¿Cuántos cursos hay disponibles?',
      answer: 'Actualmente tenemos más de 10 cursos específicos disponibles, cada uno enfocado en un problema concreto. Seguimos añadiendo nuevos cursos regularmente.'
    },
    {
      question: '¿Los cursos de pago son para siempre?',
      answer: 'Sí, una vez comprado cualquier curso, tendrás acceso de por vida a todo el contenido y futuras actualizaciones de ese curso específico.'
    },
    {
      question: '¿Puedo comprar varios cursos?',
      answer: '¡Por supuesto! Puedes comprar todos los cursos que necesites. Cada uno es independiente y se enfoca en un problema específico. Compra solo los que necesites según tu situación.'
    },
    {
      question: '¿Hay garantía de devolución?',
      answer: 'No, una vez comprado un curso, el dinero no puede ser reembolsado, puesto que ya se ha tenido acceso completo al contenido del curso de forma inmediata. Al tratarse de contenido digital con acceso instantáneo, todas las compras son finales.'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    )
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
            Múltiples cursos específicos para problemas concretos
          </p>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Más de 10 cursos cortos y prácticos. Cada uno resuelve un problema específico: sentarse, venir, no tirar de la correa, solucionar mordidas, socialización y más.
          </p>
        </div>
      </section>

      {/* Curso Gratuito Section */}
      {cursosGratuitos.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {cursosGratuitos.map((curso, index) => (
                <motion.div
                  key={curso.id}
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
                        <h2 className="text-3xl font-bold">{curso.title}</h2>
                        <p className="text-white/90">Curso Gratuito</p>
                      </div>
                    </div>

                    <div 
                      className="text-lg mb-6 text-white/95 prose prose-invert max-w-none prose-p:text-white/95 prose-strong:text-white prose-ul:text-white/95 prose-li:text-white/95"
                      dangerouslySetInnerHTML={{ __html: curso.short_description || curso.description || '' }}
                    />

                    {curso.what_you_learn && curso.what_you_learn.length > 0 && (
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {curso.what_you_learn.map((item, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-white/95">{item}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

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
                          disabled={submitted}
                          className="bg-white text-forest-dark font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {submitted ? '✓ Enviado' : 'Acceder Gratis'}
                        </button>
                      </div>
                      {submitted && (
                        <p className="mt-4 text-sm text-white/90 text-center">
                          ✓ ¡Gracias! Revisa tu email para acceder al curso gratuito.
                        </p>
                      )}
                      <p className="mt-4 text-xs text-white/80 text-center">
                        Al registrarte, tendrás acceso inmediato al curso gratuito.
                      </p>
                    </form>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cursos de Pago Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cursos Específicos por Problema
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
              Más de 10 cursos disponibles. Cada uno resuelve un problema concreto de forma rápida y efectiva.
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Elige el curso que necesitas según tu problema específico. Puedes comprar uno o varios cursos según tus necesidades.
            </p>
          </div>

          {/* Grid de Cursos */}
          {cursosPago.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Próximamente nuevos cursos disponibles</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {cursosPago.map((curso, index) => {
                const difficultyColor = getDifficultyColor(curso.difficulty)
                const difficultyLabel = getDifficultyLabel(curso.difficulty)
                
                return (
                  <motion.div
                    key={curso.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all flex flex-col border border-gray-100"
                  >
                    {/* Header con dificultad */}
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor}`}>
                          {difficultyLabel}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{curso.title}</h3>
                      <div 
                        className="text-gray-600 text-sm prose prose-sm max-w-none prose-p:text-gray-600 prose-strong:text-gray-900 prose-ul:text-gray-600 prose-li:text-gray-600"
                        dangerouslySetInnerHTML={{ __html: curso.short_description || curso.description || '' }}
                      />
                    </div>

                    {/* Contenido */}
                    <div className="p-6 flex-grow">
                      {/* Duración */}
                      <div className="flex items-center text-gray-600 mb-4">
                        <Clock className="w-4 h-4 mr-2 text-forest" />
                        <span className="text-sm font-medium">{curso.duration_minutes} min</span>
                      </div>

                      {/* Qué aprenderás */}
                      {curso.what_you_learn && curso.what_you_learn.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Qué aprenderás:</h4>
                          <ul className="space-y-2">
                            {curso.what_you_learn.map((item, i) => (
                              <li key={i} className="flex items-start text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-forest mr-2 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Footer con precio y botón */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-gray-900">{curso.price.toFixed(2)}€</span>
                          <span className="text-gray-600 text-sm ml-1">/único pago</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyCourse(curso.slug)}
                        className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center whitespace-nowrap shadow-md hover:shadow-lg"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Comprar Curso
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <h3 className="font-bold text-gray-900 pr-4">{faq.question}</h3>
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform duration-200 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner CTA Servicios Presenciales */}
      <section className="py-16 bg-gradient-to-br from-forest/5 via-sage/5 to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-forest to-forest-dark rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Izquierda - Imagen/Decoración */}
              <div className="relative h-full min-h-[400px] bg-gradient-to-br from-sage/30 to-forest-dark/30 p-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                    <MapPin className="w-16 h-16 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-w-sm">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">+8</div>
                      <div className="text-xs text-white/90 font-medium">Años Experiencia</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">+500</div>
                      <div className="text-xs text-white/90 font-medium">Perros Educados</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">100%</div>
                      <div className="text-xs text-white/90 font-medium">Positivo</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
                      <div className="text-3xl font-bold text-white mb-1">1 a 1</div>
                      <div className="text-xs text-white/90 font-medium">Personalizado</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Derecha - Contenido */}
              <div className="p-8 md:p-12 text-white">
                <div className="inline-flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-full mb-4">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span className="text-gold font-semibold text-sm">Servicios Presenciales</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  ¿Vives cerca de Archena?
                </h2>
                
                <p className="text-lg text-white/90 mb-6 leading-relaxed">
                  Si te encuentras en <strong className="text-white">Archena, Murcia</strong> o localidades cercanas 
                  (radio de 40 km), puedes optar por nuestros <strong className="text-white">servicios presenciales de educación canina</strong>. 
                  Atención personalizada 1 a 1, en tu entorno o en exteriores.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-white/95">Sesiones personalizadas adaptadas a tu perro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-white/95">Educación en tu hogar o en espacios exteriores</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-white/95">Seguimiento continuo con resultados garantizados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-white/95">+8 años de experiencia y +500 perros educados</span>
                  </li>
                </ul>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/servicios"
                    className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-forest px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                  >
                    Ver Servicios Presenciales
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/contacto"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border-2 border-white text-white px-6 py-3 rounded-xl font-bold transition-all backdrop-blur-sm"
                  >
                    <Phone className="w-5 h-5" />
                    Contactar
                  </Link>
                </div>

                <p className="text-sm text-white/70 mt-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Zona de cobertura: Archena, Murcia y alrededores (40 km)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
