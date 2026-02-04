'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, CheckCircle, CreditCard, Lock, Clock, Loader2, AlertCircle, BookOpen, GraduationCap, ChevronRight, Tag, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSession } from '@/lib/supabase/auth'
import { getCourseBySlug, hasPurchasedCourse, getCourseModules, courseHasModules } from '@/lib/supabase/courses'
import type { Course, CourseModule, Lesson } from '@/lib/supabase/courses'
import { supabase } from '@/lib/supabase/client'
import { calculateDiscountedPrice } from '@/lib/supabase/coupons'

export default function ComprarCursoPage({ params }: { params: { cursoId: string } }) {
  const router = useRouter()
  const { cursoId } = params
  const [loading, setLoading] = useState(true)
  const [curso, setCurso] = useState<Course | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [alreadyPurchased, setAlreadyPurchased] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [courseModules, setCourseModules] = useState<CourseModule[]>([])
  const [moduleLessons, setModuleLessons] = useState<Record<string, Lesson[]>>({})
  const [lessonsWithoutModule, setLessonsWithoutModule] = useState<Lesson[]>([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [hasModules, setHasModules] = useState(false)
  
  // Estados para cupones
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string
    code: string
    discount_percentage: number
    partner_name: string | null
  } | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [loadingCoupon, setLoadingCoupon] = useState(false)

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

        // Cargar temario (módulos y lecciones)
        setLoadingLessons(true)
        try {
          const hasModulesConfig = await courseHasModules(courseData.id)
          setHasModules(hasModulesConfig)

          if (hasModulesConfig) {
            // Cargar módulos
            const modules = await getCourseModules(courseData.id)
            setCourseModules(modules)

            // Cargar lecciones de cada módulo
            const lessonsMap: Record<string, Lesson[]> = {}
            for (const courseModule of modules) {
              const { data: lessons } = await supabase
                .from('course_lessons')
                .select('*')
                .eq('course_id', courseData.id)
                .eq('module_id', courseModule.id)
                .order('order_index')
              
              if (lessons) {
                lessonsMap[courseModule.id] = lessons
              }
            }
            setModuleLessons(lessonsMap)

            // Cargar lecciones sin módulo
            const { data: lessonsNoModule } = await supabase
              .from('course_lessons')
              .select('*')
              .eq('course_id', courseData.id)
              .is('module_id', null)
              .order('order_index')

            if (lessonsNoModule) {
              setLessonsWithoutModule(lessonsNoModule)
            }
          } else {
            // Sin módulos, cargar todas las lecciones
            const { data: allLessons } = await supabase
              .from('course_lessons')
              .select('*')
              .eq('course_id', courseData.id)
              .order('order_index')
            
            if (allLessons) {
              setLessonsWithoutModule(allLessons)
            }
          }
        } catch (err) {
          console.error('Error cargando temario:', err)
        } finally {
          setLoadingLessons(false)
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Por favor, introduce un código de cupón')
      return
    }

    setLoadingCoupon(true)
    setCouponError(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setCouponError('Tu sesión ha expirado')
        return
      }

      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ code: couponCode }),
      })

      const data = await response.json()

      if (!response.ok || !data.valid) {
        setCouponError(data.error_message || 'Cupón no válido')
        return
      }

      // Cupón válido - aplicar
      setAppliedCoupon({
        id: data.coupon_id,
        code: data.code,
        discount_percentage: data.discount_percentage,
        partner_name: data.partner_name
      })
      setCouponCode('')
      setCouponError(null)
    } catch (error) {
      console.error('Error aplicando cupón:', error)
      setCouponError('Error al validar el cupón')
    } finally {
      setLoadingCoupon(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError(null)
  }

  const calculateFinalPrice = () => {
    if (!curso) return 0
    if (!appliedCoupon) return curso.price

    const { finalPrice } = calculateDiscountedPrice(
      curso.price,
      appliedCoupon.discount_percentage
    )
    return finalPrice
  }

  const calculateDiscount = () => {
    if (!curso || !appliedCoupon) return 0

    const { discountAmount } = calculateDiscountedPrice(
      curso.price,
      appliedCoupon.discount_percentage
    )
    return discountAmount
  }

  const handleComprarCurso = async () => {
    if (!curso || !userId) return

    setProcessing(true)
    setError(null)

    try {
      // Obtener el token de sesión de Supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.')
        router.push(`/cursos/auth/login?redirect=/cursos/comprar/${cursoId}`)
        return
      }

      // Crear sesión de checkout en Stripe con el token de autorización
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          courseId: curso.id,
          couponId: appliedCoupon?.id || null,
          couponCode: appliedCoupon?.code || null,
          discountPercentage: appliedCoupon?.discount_percentage || 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear sesión de pago')
      }

      const { sessionId, url } = await response.json()

      // Redirigir a Stripe Checkout usando la URL
      if (url) {
        window.location.href = url
      } else {
        throw new Error('No se recibió URL de pago')
      }
    } catch (error) {
      console.error('Error al procesar la compra:', error)
      setError(error instanceof Error ? error.message : 'Error al procesar el pago. Por favor, intenta de nuevo.')
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
      basico: 'from-sage to-forest',
      intermedio: 'from-forest to-forest-dark',
      avanzado: 'from-forest-dark to-forest-dark'
    }
    return colors[difficulty] || colors.basico
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
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
                    <div 
                      className="text-white/90 text-lg [&>p]:m-0" 
                      dangerouslySetInnerHTML={{ 
                        __html: curso.short_description || curso.description || '' 
                      }} 
                    />
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

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Este curso incluye:</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-forest mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{curso.total_lessons} lecciones completas</span>
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

                {/* Descripción completa */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-forest" />
                    Descripción del Curso
                  </h2>
                  <div 
                    className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: curso.short_description || curso.description || 'No hay descripción disponible.' 
                    }}
                  />
                </div>

                {/* Temario del Curso */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="w-6 h-6 mr-2 text-forest" />
                    Temario del Curso
                  </h2>

                  {loadingLessons ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
                      <p className="text-gray-600">Cargando temario...</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {hasModules ? (
                        <>
                          {/* Vista con módulos */}
                          {courseModules.map((courseModule, moduleIdx) => {
                            const lessons = moduleLessons[courseModule.id] || []
                            const isExpanded = expandedModules.has(courseModule.id)
                            const totalDuration = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)

                            return (
                              <div key={courseModule.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                {/* Header del Módulo */}
                                <button
                                  onClick={() => toggleModule(courseModule.id)}
                                  className="w-full bg-gradient-to-r from-forest/5 to-sage/5 hover:from-forest/10 hover:to-sage/10 p-3 sm:p-4 flex items-center justify-between transition-colors"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-forest text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                                      {moduleIdx + 1}
                                    </div>
                                    <div className="text-left">
                                      <h4 className="font-bold text-gray-900 text-sm sm:text-base">{courseModule.title}</h4>
                                      <p className="text-xs text-gray-600 mt-0.5">
                                        {lessons.length} lección{lessons.length !== 1 ? 'es' : ''}
                                        {totalDuration > 0 && ` • ${totalDuration} min`}
                                      </p>
                                    </div>
                                  </div>
                                  <ChevronRight 
                                    className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-600 transition-transform flex-shrink-0 ${
                                      isExpanded ? 'rotate-90' : ''
                                    }`}
                                  />
                                </button>

                                {/* Lecciones del módulo */}
                                {isExpanded && (
                                  <div className="bg-white divide-y divide-gray-100">
                                    {lessons.map((lesson, lessonIdx) => (
                                      <div
                                        key={lesson.id}
                                        className="flex items-start p-2.5 sm:p-3 hover:bg-gray-50 transition-colors"
                                      >
                                        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                                          <span className="text-xs font-semibold text-gray-600">{lessonIdx + 1}</span>
                                        </div>
                                        <div className="flex-grow min-w-0">
                                          <h5 className="text-xs sm:text-sm font-medium text-gray-900 break-words">{lesson.title}</h5>
                                          {lesson.duration_minutes > 0 && (
                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                              <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                                              <span>{lesson.duration_minutes} min</span>
                                              {lesson.is_free_preview && (
                                                <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold rounded-full font-medium text-xs">
                                                  Vista previa gratuita
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )
                          })}

                          {/* Lecciones sin módulo */}
                          {lessonsWithoutModule.length > 0 && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 p-3 sm:p-4">
                                <h4 className="font-bold text-gray-900 text-sm">Lecciones adicionales</h4>
                                <p className="text-xs text-gray-600 mt-0.5">
                                  {lessonsWithoutModule.length} lección{lessonsWithoutModule.length !== 1 ? 'es' : ''}
                                </p>
                              </div>
                              <div className="bg-white divide-y divide-gray-100">
                                {lessonsWithoutModule.map((lesson, idx) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-start p-2.5 sm:p-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gray-100 rounded-full flex items-center justify-center mr-2 sm:mr-3 mt-0.5">
                                      <span className="text-xs font-semibold text-gray-600">{idx + 1}</span>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                      <h5 className="text-xs sm:text-sm font-medium text-gray-900 break-words">{lesson.title}</h5>
                                      {lesson.duration_minutes > 0 && (
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                          <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                                          <span>{lesson.duration_minutes} min</span>
                                          {lesson.is_free_preview && (
                                            <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold rounded-full font-medium text-xs">
                                              Vista previa gratuita
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        /* Vista sin módulos (lista simple) */
                        lessonsWithoutModule.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            className="flex items-start bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:border-forest/30 hover:shadow-sm transition-all"
                          >
                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-forest/10 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                              <span className="text-xs sm:text-sm font-bold text-forest">{idx + 1}</span>
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base break-words">{lesson.title}</h4>
                              {lesson.duration_minutes > 0 && (
                                <div className="flex items-center text-xs text-gray-500 flex-wrap">
                                  <Clock className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span>{lesson.duration_minutes} min</span>
                                  {lesson.is_free_preview && (
                                    <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold rounded-full font-medium text-xs">
                                      Vista previa gratuita
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen de Compra */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen de Compra</h3>
                
                {/* Campo de Cupón de Descuento */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-forest" />
                    ¿Tienes un cupón de descuento?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !loadingCoupon && !appliedCoupon) {
                          handleApplyCoupon()
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={appliedCoupon !== null || loadingCoupon}
                      maxLength={50}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={loadingCoupon || appliedCoupon !== null || !couponCode.trim()}
                      className="px-4 py-2 bg-forest text-white rounded-lg font-semibold hover:bg-forest-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loadingCoupon ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Aplicar'
                      )}
                    </button>
                  </div>
                  
                  {/* Cupón aplicado */}
                  {appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start justify-between"
                    >
                      <div className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-800">
                            Cupón &quot;{appliedCoupon.code}&quot; aplicado
                          </p>
                          <p className="text-xs text-green-700">
                            {appliedCoupon.discount_percentage}% de descuento
                            {appliedCoupon.partner_name && ` · ${appliedCoupon.partner_name}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800 transition"
                        title="Quitar cupón"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* Error de cupón */}
                  {couponError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{couponError}</p>
                    </motion.div>
                  )}
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Precio del curso:</span>
                    <span className="font-semibold">{curso.price.toFixed(2)}€</span>
                  </div>
                  
                  {appliedCoupon && (
                    <>
                      <div className="flex justify-between text-green-600 font-semibold mb-2">
                        <span>Descuento ({appliedCoupon.discount_percentage}%):</span>
                        <span>-{calculateDiscount().toFixed(2)}€</span>
                      </div>
                      <div className="border-t border-gray-200 my-3"></div>
                      <div className="flex justify-between text-gray-700 mb-2">
                        <span>Subtotal:</span>
                        <span className="font-semibold">{calculateFinalPrice().toFixed(2)}€</span>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Base imponible:</span>
                    <span className="font-semibold">{(calculateFinalPrice() / 1.21).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>IVA (21%):</span>
                    <span className="font-semibold">{(calculateFinalPrice() - (calculateFinalPrice() / 1.21)).toFixed(2)}€</span>
                  </div>
                  <div className="border-t border-gray-200 my-4"></div>
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total (IVA incluido):</span>
                    <span className="text-forest">{calculateFinalPrice().toFixed(2)}€</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="mt-2 text-center">
                      <span className="text-sm text-gray-500 line-through">{curso.price.toFixed(2)}€</span>
                      <span className="ml-2 text-sm font-semibold text-green-600">
                        ¡Ahorras {calculateDiscount().toFixed(2)}€!
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleComprarCurso}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
                >
                  {processing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirigiendo al pago...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Proceder al Pago Seguro
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Pago 100% seguro con Stripe</span>
                </div>

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
