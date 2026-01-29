import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, CheckCircle, Clock, GraduationCap, Target, PlayCircle, ArrowLeft } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import type { Course, CourseModule, Lesson } from '@/lib/supabase/courses'
import CourseClientActions from './CourseClientActions'
import CourseModulesAccordion from './CourseModulesAccordion'

// Cliente de Supabase para server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface Props {
  params: Promise<{ slug: string }>
}

// =====================================================
// GENERACIÓN ESTÁTICA DE PÁGINAS
// =====================================================
// Esta función le dice a Next.js qué rutas generar en build time
export async function generateStaticParams() {
  try {
    const { data: courses } = await supabase
      .from('courses')
      .select('slug')
      .eq('is_published', true)

    if (!courses) return []

    return courses.map((course) => ({
      slug: course.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

// Configuración de revalidación
// Regenera las páginas cada 60 segundos si hay cambios
export const revalidate = 60

// =====================================================
// METADATA DINÁMICA PARA SEO
// =====================================================
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) {
    return {
      title: 'Curso no encontrado | Hakadogs',
      description: 'El curso que buscas no está disponible.',
    }
  }

  // Extraer texto plano de la descripción HTML
  const plainDescription = course.short_description
    ? course.short_description.replace(/<[^>]*>/g, '').substring(0, 160)
    : course.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 'Curso de educación canina profesional'

  return {
    title: `${course.title} | Curso de Educación Canina | Hakadogs`,
    description: plainDescription,
    openGraph: {
      title: course.title,
      description: plainDescription,
      type: 'website',
      url: `https://www.hakadogs.com/cursos/${course.slug}`,
      images: course.cover_image_url ? [
        {
          url: course.cover_image_url,
          width: 1200,
          height: 675,
          alt: course.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: course.title,
      description: plainDescription,
      images: course.cover_image_url ? [course.cover_image_url] : undefined,
    },
  }
}

// =====================================================
// FUNCIONES DE DATOS
// =====================================================

// Obtener curso por slug
async function getCourse(slug: string): Promise<Course | null> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data as Course
}

// Obtener módulos del curso
async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) return []
  return data as CourseModule[]
}

// Obtener lecciones por módulo
async function getLessonsByModule(courseId: string, moduleId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true })

  if (error) return []
  return data as Lesson[]
}

// Obtener lecciones sin módulo
async function getLessonsWithoutModule(courseId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', courseId)
    .is('module_id', null)
    .order('order_index', { ascending: true })

  if (error) return []
  return data as Lesson[]
}

// Verificar si el curso tiene módulos
async function courseHasModules(courseId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('id')
    .eq('course_id', courseId)
    .limit(1)

  if (error) return false
  return (data?.length || 0) > 0
}

// Helpers para dificultad
function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    basico: 'Básico',
    intermedio: 'Intermedio',
    avanzado: 'Avanzado'
  }
  return labels[difficulty] || difficulty
}

function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    basico: 'bg-green-100 text-green-700',
    intermedio: 'bg-amber-100 text-amber-700',
    avanzado: 'bg-red-100 text-red-700'
  }
  return colors[difficulty] || colors.basico
}

export default async function CursoPage({ params }: Props) {
  const { slug } = await params
  
  // Obtener datos del curso en el servidor
  const course = await getCourse(slug)
  
  if (!course) {
    notFound()
  }

  // Cargar módulos y lecciones
  const hasModules = await courseHasModules(course.id)
  let courseModules: CourseModule[] = []
  let moduleLessons: Record<string, Lesson[]> = {}
  let lessonsWithoutModule: Lesson[] = []

  if (hasModules) {
    courseModules = await getCourseModules(course.id)
    
    // Cargar lecciones de cada módulo en paralelo
    const lessonsPromises = courseModules.map(async (mod) => {
      const lessons = await getLessonsByModule(course.id, mod.id)
      return { moduleId: mod.id, lessons }
    })
    
    const results = await Promise.all(lessonsPromises)
    results.forEach(({ moduleId, lessons }) => {
      moduleLessons[moduleId] = lessons
    })
    
    lessonsWithoutModule = await getLessonsWithoutModule(course.id)
  } else {
    lessonsWithoutModule = await getLessonsWithoutModule(course.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
      {/* Breadcrumb y navegación */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/cursos"
              className="inline-flex items-center gap-2 text-forest hover:text-forest-dark transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Volver a cursos</span>
              <span className="sm:hidden">Volver</span>
            </Link>
            <CourseClientActions courseTitle={course.title} courseSlug={course.slug} actionType="share" />
          </div>
        </div>
      </div>

      {/* Hero del curso - DISEÑO MEJORADO */}
      <section className="relative bg-gradient-to-br from-forest via-sage to-forest-dark overflow-hidden">
        {/* Imagen de fondo con overlay si existe - OPTIMIZADA PARA LCP */}
        {course.cover_image_url && (
          <div className="absolute inset-0">
            <Image 
              src={course.cover_image_url} 
              alt={course.title}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-forest/95 via-sage/90 to-forest-dark/95"></div>
          </div>
        )}

        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Columna izquierda: Contenido */}
              <div className="text-white space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(course.difficulty)} backdrop-blur-sm`}>
                    {getDifficultyLabel(course.difficulty)}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {course.duration_minutes} minutos
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white flex items-center">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {course.total_lessons} lecciones
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  {course.title}
                </h1>
                
                {course.short_description && (
                  <div 
                    className="text-lg sm:text-xl text-white/95 prose prose-invert prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.short_description }}
                  />
                )}

                {/* CTA en hero solo en móvil */}
                <div className="lg:hidden pt-4">
                  <CourseClientActions 
                    courseTitle={course.title} 
                    courseSlug={course.slug} 
                    actionType="buy" 
                    price={course.price}
                  />
                </div>
              </div>

              {/* Columna derecha: Imagen destacada (solo desktop) - OPTIMIZADA */}
              {course.cover_image_url && (
                <div className="hidden lg:block">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm aspect-[4/3]">
                    <Image 
                      src={course.cover_image_url} 
                      alt={course.title}
                      fill
                      priority
                      fetchPriority="high"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                    {course.is_free && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-gold text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                          GRATUITO
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal - DISEÑO MÁS AMPLIO */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
              {/* Columna principal - MÁS ANCHA */}
              <div className="lg:col-span-2 space-y-8">
                {/* Descripción completa */}
                {course.description && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center">
                      <BookOpen className="w-7 h-7 mr-3 text-forest" />
                      Descripción del Curso
                    </h2>
                    <div 
                      className="prose prose-xl max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                  </div>
                )}

                {/* Qué aprenderás - GRID MÁS AMPLIO */}
                {course.what_you_learn && course.what_you_learn.length > 0 && (
                  <div className="bg-gradient-to-br from-forest/5 to-sage/5 rounded-2xl shadow-xl p-8 sm:p-10 border border-forest/10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center">
                      <Target className="w-7 h-7 mr-3 text-forest" />
                      Qué Aprenderás
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-5">
                      {course.what_you_learn.map((item, idx) => (
                        <div key={idx} className="flex items-start bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                          <CheckCircle className="w-6 h-6 text-forest mr-4 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-800 font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Temario */}
                <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-100">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <GraduationCap className="w-7 h-7 mr-3 text-forest" />
                    Temario del Curso
                  </h2>
                  
                  {hasModules ? (
                    <div className="space-y-3">
                      {courseModules.length === 0 && lessonsWithoutModule.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No hay lecciones disponibles aún.</p>
                        </div>
                      ) : (
                        <>
                          {/* Componente cliente para acordeón interactivo */}
                          <CourseModulesAccordion 
                            modules={courseModules} 
                            moduleLessons={moduleLessons}
                          />

                          {/* Lecciones sin módulo (estáticas) */}
                          {lessonsWithoutModule.length > 0 && (
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                              <div className="bg-gray-50 p-4">
                                <h3 className="font-bold text-gray-900">Lecciones adicionales</h3>
                                <p className="text-sm text-gray-600">
                                  {lessonsWithoutModule.length} lección{lessonsWithoutModule.length !== 1 ? 'es' : ''}
                                </p>
                              </div>
                              <div className="bg-white divide-y divide-gray-100">
                                {lessonsWithoutModule.map((lesson, idx) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-start p-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                      <span className="text-xs font-semibold text-gray-600">{idx + 1}</span>
                                    </div>
                                    <div className="flex-grow min-w-0">
                                      <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                                      {lesson.duration_minutes > 0 && (
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                          <Clock className="w-3 h-3 mr-1" />
                                          <span>{lesson.duration_minutes} min</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {lessonsWithoutModule.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-6 text-center">
                          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No hay lecciones disponibles aún.</p>
                        </div>
                      ) : (
                        lessonsWithoutModule.map((lesson, idx) => (
                          <div
                            key={lesson.id}
                            className="flex items-start bg-white border border-gray-200 rounded-xl p-4 hover:border-forest/30 hover:shadow-sm transition-all"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-forest">{idx + 1}</span>
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="font-semibold text-gray-900 mb-1">{lesson.title}</h4>
                              {lesson.duration_minutes > 0 && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{lesson.duration_minutes} min</span>
                                  {lesson.is_free_preview && (
                                    <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold rounded-full font-medium">
                                      Vista previa
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

              {/* Sidebar con precio y CTA - DISEÑO MEJORADO */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 sticky top-24 border-2 border-forest/10">
                  {/* Precio */}
                  <div className="text-center mb-8 pb-8 border-b-2 border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Precio del curso</p>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-6xl font-black text-forest-dark">{course.price.toFixed(2)}</span>
                      <span className="text-3xl font-bold text-forest-dark ml-1">€</span>
                    </div>
                    <p className="text-forest font-semibold mb-1">pago único</p>
                    <div className="inline-block px-4 py-2 bg-forest/10 rounded-full">
                      <p className="text-sm text-forest font-bold">✨ Acceso de por vida</p>
                    </div>
                  </div>

                  {/* Botón comprar - Cliente */}
                  <div className="mb-8">
                    <CourseClientActions courseTitle={course.title} courseSlug={course.slug} actionType="buy" price={course.price} />
                  </div>

                  {/* Características - DISEÑO MEJORADO */}
                  <div className="space-y-4 bg-white rounded-xl p-6 shadow-inner">
                    <div className="flex items-center text-gray-700 hover:text-forest transition-colors">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-forest" />
                      </div>
                      <span className="font-medium">Acceso inmediato</span>
                    </div>
                    <div className="flex items-center text-gray-700 hover:text-forest transition-colors">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-forest" />
                      </div>
                      <span className="font-medium">Actualizaciones incluidas</span>
                    </div>
                    <div className="flex items-center text-gray-700 hover:text-forest transition-colors">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-forest" />
                      </div>
                      <span className="font-medium">Certificado de finalización</span>
                    </div>
                    <div className="flex items-center text-gray-700 hover:text-forest transition-colors">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-forest" />
                      </div>
                      <span className="font-medium">Soporte por email</span>
                    </div>
                  </div>

                  {/* Botón compartir - Cliente */}
                  <div className="mt-6">
                    <CourseClientActions courseTitle={course.title} courseSlug={course.slug} actionType="share-button" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - DISEÑO MEJORADO */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-forest via-sage to-forest-dark relative overflow-hidden">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
              ¿Listo para empezar?
            </h2>
            <p className="text-xl sm:text-2xl text-white/95 mb-8 leading-relaxed">
              Obtén acceso instantáneo a todas las lecciones y transforma el comportamiento de tu perro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <CourseClientActions courseTitle={course.title} courseSlug={course.slug} actionType="buy-cta" price={course.price} />
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Acceso de por vida</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Todas las actualizaciones</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Soporte incluido</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
