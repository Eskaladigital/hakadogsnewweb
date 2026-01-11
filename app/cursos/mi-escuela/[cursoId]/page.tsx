'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Play, CheckCircle, Lock, Download, FileText, Clock, Loader2, AlertCircle, Video, Headphones, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSession } from '@/lib/supabase/auth'
import { getCourseBySlug, getCourseLessons, getUserCourseProgress, markLessonComplete, getLessonResources, getUserLessonsProgressBulk, courseHasModules, getCourseModulesWithStats, getLessonsByModule } from '@/lib/supabase/courses'
import type { Course, Lesson, Resource, ModuleWithStats } from '@/lib/supabase/courses'
import { useSwipe } from '@/lib/hooks/useSwipe'

export default function CursoDetailPage({ params }: { params: { cursoId: string } }) {
  const router = useRouter()
  const { cursoId } = params
  const [loading, setLoading] = useState(true)
  const [curso, setCurso] = useState<Course | null>(null)
  const [lecciones, setLecciones] = useState<Lesson[]>([])
  const [leccionActual, setLeccionActual] = useState<Lesson | null>(null)
  const [recursos, setRecursos] = useState<Resource[]>([])
  const [progreso, setProgreso] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'video' | 'audio' | 'content' | 'resources'>('content')
  const [completing, setCompleting] = useState(false)
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({})
  const [hasModules, setHasModules] = useState(false)
  const [modules, setModules] = useState<ModuleWithStats[]>([])
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
  const [moduleLoading, setModuleLoading] = useState<Record<string, boolean>>({})
  const [moduleLessons, setModuleLessons] = useState<Record<string, Lesson[]>>({})
  const contentRef = useRef<HTMLDivElement>(null)

  // Funciones para navegación con gestos
  const goToNextLesson = () => {
    if (!leccionActual) return
    
    const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
    if (currentIndex < lecciones.length - 1) {
      const nextLesson = lecciones[currentIndex + 1]
      
      // Verificar si está desbloqueada
      if (currentIndex >= 0 && lessonProgress[leccionActual.id]) {
        handleSelectLesson(nextLesson)
      }
    }
  }

  const goToPreviousLesson = () => {
    if (!leccionActual) return
    
    const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
    if (currentIndex > 0) {
      const previousLesson = lecciones[currentIndex - 1]
      handleSelectLesson(previousLesson)
    }
  }

  // Hook de gestos swipe
  const { isSwiping } = useSwipe({
    onSwipeLeft: goToNextLesson,
    onSwipeRight: goToPreviousLesson,
  }, {
    threshold: 80, // Requiere 80px de swipe
    timeout: 400,  // Máximo 400ms
  })

  // Función para alternar expansión de módulos (lazy loading de lecciones)
  const toggleModule = async (moduleId: string, moduleIndex: number) => {
    const isExpanded = expandedModules[moduleId]
    
    // Verificar si el módulo está desbloqueado
    if (moduleIndex > 0) {
      const previousModule = modules[moduleIndex - 1]
      const isUnlocked = previousModule.total_lessons > 0 && 
                        previousModule.completed_lessons === previousModule.total_lessons
      
      if (!isUnlocked) {
        // Módulo bloqueado - no expandir
        return
      }
    }
    
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !isExpanded
    }))

    // Si se está expandiendo y aún no se cargaron las lecciones, cargarlas
    if (!isExpanded && !moduleLessons[moduleId]) {
      setModuleLoading(prev => ({ ...prev, [moduleId]: true }))
      try {
        const lessons = await getLessonsByModule(moduleId)
        setModuleLessons(prev => ({
          ...prev,
          [moduleId]: lessons
        }))
      } catch (error) {
        console.error('Error cargando lecciones del módulo:', error)
      } finally {
        setModuleLoading(prev => ({ ...prev, [moduleId]: false }))
      }
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        // Verificar autenticación
        const { data: sessionData } = await getSession()
        if (!sessionData?.session) {
          router.push(`/cursos/auth/login?redirect=/cursos/mi-escuela/${cursoId}`)
          return
        }

        const uid = sessionData.session.user.id
        setUserId(uid)

        // Cargar curso
        const courseData = await getCourseBySlug(cursoId)
        if (!courseData) {
          setLoading(false)
          return
        }
        setCurso(courseData)

        // Verificar si el curso tiene módulos
        const hasModulesFlag = await courseHasModules(courseData.id)
        setHasModules(hasModulesFlag)

        if (hasModulesFlag) {
          // Curso con módulos: cargar módulos y estadísticas
          const modulesData = await getCourseModulesWithStats(courseData.id, uid)
          setModules(modulesData)

          // Expandir automáticamente el primer módulo
          if (modulesData.length > 0) {
            const firstModuleId = modulesData[0].id
            setExpandedModules({ [firstModuleId]: true })
            
            // Cargar lecciones del primer módulo
            const firstModuleLessons = await getLessonsByModule(firstModuleId)
            setModuleLessons({ [firstModuleId]: firstModuleLessons })
            setLecciones(firstModuleLessons)

            // Cargar progreso de lecciones del primer módulo
            if (firstModuleLessons.length > 0) {
              const lessonIds = firstModuleLessons.map(l => l.id)
              const progressMap = await getUserLessonsProgressBulk(uid, lessonIds)
              setLessonProgress(progressMap)

              // Seleccionar primera lección
              setLeccionActual(firstModuleLessons[0])
              if (firstModuleLessons[0].video_url) {
                setActiveTab('video')
              } else if (firstModuleLessons[0].audio_url) {
                setActiveTab('audio')
              } else {
                setActiveTab('content')
              }

              const resourcesData = await getLessonResources(firstModuleLessons[0].id)
              setRecursos(resourcesData)
            }
          }
        } else {
          // Curso sin módulos (estructura antigua/simple)
          const lessonsData = await getCourseLessons(courseData.id)
          setLecciones(lessonsData)

          // OPTIMIZACIÓN: Cargar progreso de TODAS las lecciones en UNA SOLA petición
          const lessonIds = lessonsData.map(lesson => lesson.id)
          const progressMap = await getUserLessonsProgressBulk(uid, lessonIds)
          setLessonProgress(progressMap)

          // Seleccionar primera lección
          if (lessonsData.length > 0) {
            const firstLesson = lessonsData[0]
            setLeccionActual(firstLesson)
            
            if (firstLesson.video_url) {
              setActiveTab('video')
            } else if (firstLesson.audio_url) {
              setActiveTab('audio')
            } else {
              setActiveTab('content')
            }

            const resourcesData = await getLessonResources(firstLesson.id)
            setRecursos(resourcesData)
          }
        }

        // Cargar progreso del curso
        const progressData = await getUserCourseProgress(uid, courseData.id)
        setProgreso(progressData)

      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [cursoId, router])

  const handleSelectLesson = async (lesson: Lesson) => {
    // Verificar si la lección está desbloqueada
    const leccionIndex = lecciones.findIndex(l => l.id === lesson.id)
    
    // La primera lección siempre está disponible
    if (leccionIndex > 0) {
      // Verificar si la lección anterior está completada
      const previousLesson = lecciones[leccionIndex - 1]
      if (!lessonProgress[previousLesson.id]) {
        // Lección bloqueada - no hacer nada
        return
      }
    }
    
    // Lección desbloqueada
    setLeccionActual(lesson)
    
    // Determinar pestaña según contenido disponible
    if (lesson.video_url) {
      setActiveTab('video')
    } else if (lesson.audio_url) {
      setActiveTab('audio')
    } else {
      setActiveTab('content')
    }

    // Cargar recursos de esta lección
    const resourcesData = await getLessonResources(lesson.id)
    setRecursos(resourcesData)
  }

  const handleMarkComplete = async () => {
    if (!leccionActual || !userId) return

    setCompleting(true)
    try {
      await markLessonComplete(userId, leccionActual.id)
      
      // Actualizar estado local
      setLessonProgress(prev => ({
        ...prev,
        [leccionActual.id]: true
      }))

      // Recargar progreso del curso
      if (curso) {
        const progressData = await getUserCourseProgress(userId, curso.id)
        setProgreso(progressData)
      }

      // Verificar si hay una siguiente lección para desbloquear
      const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
      const hasNextLesson = currentIndex < lecciones.length - 1
      
      if (hasNextLesson) {
        // Pequeña notificación visual de que la siguiente lección se desbloqueó
        console.log('¡Siguiente lección desbloqueada!')
      }
    } catch (error) {
      console.error('Error marcando lección:', error)
    } finally {
      setCompleting(false)
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
      basico: 'from-forest/80 to-sage/80',
      intermedio: 'from-amber-600 to-amber-700',
      avanzado: 'from-red-600 to-red-700'
    }
    return colors[difficulty] || colors.basico
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  const getVimeoEmbedUrl = (url: string) => {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
    return videoId ? `https://player.vimeo.com/video/${videoId}` : url
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    )
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Curso no encontrado</h1>
          <p className="text-gray-600 mb-6">No se pudo cargar el curso solicitado</p>
          <Link
            href="/cursos/mi-escuela"
            className="inline-block bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
          >
            Volver a Mi Escuela
          </Link>
        </div>
      </div>
    )
  }

  // Si el curso existe pero no tiene lecciones
  if (lecciones.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className={`bg-gradient-to-r ${getDifficultyColor(curso.difficulty)} text-white py-8`}>
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <Link
                href="/cursos/mi-escuela"
                className="inline-flex items-center text-white/80 hover:text-white transition mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Mi Escuela
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{curso.title}</h1>
              <div 
                className="text-white/90"
                dangerouslySetInnerHTML={{ __html: curso.short_description || curso.description || '' }}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Este curso aún no tiene contenido
            </h2>
            <p className="text-gray-600 mb-8">
              Las lecciones de este curso están siendo preparadas. Por favor, vuelve más tarde.
            </p>
            <Link
              href="/cursos/mi-escuela"
              className="inline-block bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
            >
              Volver a Mi Escuela
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!leccionActual) {
    return null // No debería llegar aquí si hay lecciones
  }

  const colorGradient = getDifficultyColor(curso.difficulty)
  const completedCount = Object.values(lessonProgress).filter(Boolean).length
  const progressPercentage = lecciones.length > 0 ? Math.round((completedCount / lecciones.length) * 100) : 0

  // Determinar qué pestañas mostrar
  const availableTabs = []
  if (leccionActual.video_url) availableTabs.push('video')
  if (leccionActual.audio_url) availableTabs.push('audio')
  if (leccionActual.content) availableTabs.push('content')
  if (recursos.length > 0) availableTabs.push('resources')

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colorGradient} text-white py-6 sm:py-8`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            <Link
              href="/cursos/mi-escuela"
              className="inline-flex items-center text-white/80 hover:text-white transition mb-4 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mi Escuela
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="mb-3 sm:mb-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{curso.title}</h1>
                  <div 
                    className="text-white/90 text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: curso.short_description || curso.description || '' }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {curso.duration_minutes} min
                  </span>
                  <span>{getDifficultyLabel(curso.difficulty)}</span>
                  <span>{completedCount}/{lecciones.length} completadas</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                <span>Progreso del curso</span>
                <span className="font-bold">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
                <div 
                  className="bg-white rounded-full h-2 sm:h-3 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-full lg:max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Video/Audio/Content Area */}
                {activeTab === 'video' && leccionActual.video_url && (
                  <div className="aspect-video bg-gray-900">
                    {leccionActual.video_provider === 'youtube' ? (
                      <iframe
                        src={getYouTubeEmbedUrl(leccionActual.video_url)}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : leccionActual.video_provider === 'vimeo' ? (
                      <iframe
                        src={getVimeoEmbedUrl(leccionActual.video_url)}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={leccionActual.video_url}
                        controls
                        className="w-full h-full"
                      />
                    )}
                  </div>
                )}

                {activeTab === 'audio' && leccionActual.audio_url && (
                  <div className="bg-gradient-to-br from-forest/10 to-sage/10 p-12 flex items-center justify-center">
                    <div className="w-full max-w-2xl">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-20 h-20 bg-forest/20 rounded-full flex items-center justify-center">
                          <Headphones className="w-10 h-10 text-forest" />
                        </div>
                      </div>
                      <audio
                        src={leccionActual.audio_url}
                        controls
                        className="w-full"
                      />
                      <p className="text-center text-gray-600 mt-4">{leccionActual.title}</p>
                    </div>
                  </div>
                )}

                {/* Tabs - Solo mostrar si hay más de una opción */}
                {availableTabs.length > 1 && (
                  <div className="border-b border-gray-200 overflow-x-auto">
                    <div className="flex min-w-max">
                      {leccionActual.video_url && (
                        <button
                          onClick={() => setActiveTab('video')}
                          className={`flex-1 min-w-[120px] py-3 sm:py-4 px-4 sm:px-6 font-semibold transition text-sm sm:text-base ${
                            activeTab === 'video'
                              ? 'border-b-2 border-forest text-forest' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Video className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                          Video
                        </button>
                      )}
                      {leccionActual.audio_url && (
                        <button
                          onClick={() => setActiveTab('audio')}
                          className={`flex-1 min-w-[120px] py-3 sm:py-4 px-4 sm:px-6 font-semibold transition text-sm sm:text-base ${
                            activeTab === 'audio'
                              ? 'border-b-2 border-forest text-forest' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Headphones className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                          Audio
                        </button>
                      )}
                      {leccionActual.content && (
                        <button
                          onClick={() => setActiveTab('content')}
                          className={`flex-1 min-w-[120px] py-3 sm:py-4 px-4 sm:px-6 font-semibold transition text-sm sm:text-base ${
                            activeTab === 'content'
                              ? 'border-b-2 border-forest text-forest' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <FileText className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                          Contenido
                        </button>
                      )}
                      {recursos.length > 0 && (
                        <button
                          onClick={() => setActiveTab('resources')}
                          className={`flex-1 min-w-[120px] py-3 sm:py-4 px-4 sm:px-6 font-semibold transition text-sm sm:text-base ${
                            activeTab === 'resources'
                              ? 'border-b-2 border-forest text-forest' 
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Download className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                          Recursos
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Area */}
                <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                  {activeTab === 'content' && leccionActual.content && (
                    <div className="w-full max-w-full overflow-x-hidden">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                        {leccionActual.title}
                      </h2>
                      {/* Renderizar HTML de TinyMCE */}
                      <div 
                        className="lesson-content prose prose-sm sm:prose-sm md:prose-base max-w-none w-full
                          prose-headings:text-gray-900 prose-headings:font-bold
                          prose-h1:text-lg sm:prose-h1:text-xl md:prose-h1:text-2xl prose-h1:mb-2 sm:prose-h1:mb-3 md:prose-h1:mb-4 prose-h1:mt-3 sm:prose-h1:mt-4 md:prose-h1:mt-6
                          prose-h2:text-base sm:prose-h2:text-lg md:prose-h2:text-xl prose-h2:mb-2 sm:prose-h2:mb-2 md:prose-h2:mb-3 prose-h2:mt-2 sm:prose-h2:mt-3 md:prose-h2:mt-4
                          prose-h3:text-sm sm:prose-h3:text-base md:prose-h3:text-lg prose-h3:mb-1 sm:prose-h3:mb-2 prose-h3:mt-2 sm:prose-h3:mt-2 md:prose-h3:mt-3
                          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-2 sm:prose-p:mb-2 md:prose-p:mb-3 prose-p:text-xs sm:prose-p:text-sm md:prose-p:text-base
                          prose-strong:text-gray-900 prose-strong:font-bold
                          prose-ul:list-disc prose-ul:ml-3 sm:prose-ul:ml-4 md:prose-ul:ml-5 prose-ul:mb-2 sm:prose-ul:mb-2 md:prose-ul:mb-3 prose-ul:space-y-1
                          prose-ol:list-decimal prose-ol:ml-3 sm:prose-ol:ml-4 md:prose-ol:ml-5 prose-ol:mb-2 sm:prose-ol:mb-2 md:prose-ol:mb-3 prose-ol:space-y-1
                          prose-li:text-gray-700 prose-li:text-xs sm:prose-li:text-sm md:prose-li:text-base
                          prose-a:text-forest prose-a:underline hover:prose-a:text-sage prose-a:break-words
                          prose-blockquote:border-l-4 prose-blockquote:border-forest prose-blockquote:pl-2 sm:prose-blockquote:pl-3 prose-blockquote:italic
                          prose-code:bg-gray-100 prose-code:px-1 sm:prose-code:px-1 prose-code:py-0.5 sm:prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-xs prose-code:break-words
                          prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-2 sm:prose-pre:p-2 md:prose-pre:p-3 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-xs sm:prose-pre:text-xs
                          prose-img:rounded-lg prose-img:shadow-lg prose-img:max-w-full prose-img:h-auto prose-img:mx-auto prose-img:block
                          prose-table:w-full prose-table:overflow-x-auto prose-table:block prose-table:text-xs sm:prose-table:text-xs
                          [&>*]:max-w-full [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_table]:block [&_table]:overflow-x-auto
                          [&_iframe]:max-w-full [&_iframe]:w-full [&_video]:max-w-full [&_video]:w-full
                          overflow-hidden break-words px-2 sm:px-3 md:px-4"
                        style={{ 
                          wordWrap: 'break-word', 
                          overflowWrap: 'break-word',
                          width: '100%',
                          maxWidth: '100%',
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                        }}
                        dangerouslySetInnerHTML={{ __html: leccionActual.content }}
                      />
                    </div>
                  )}

                  {activeTab === 'resources' && recursos.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recursos Descargables</h2>
                      <div className="space-y-4">
                        {recursos.map((recurso) => (
                          <div 
                            key={recurso.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                          >
                            <div className="flex items-center">
                              <FileText className="w-8 h-8 text-forest mr-4" />
                              <div>
                                <h3 className="font-semibold text-gray-900">{recurso.title}</h3>
                                {recurso.description && (
                                  <p className="text-sm text-gray-600">{recurso.description}</p>
                                )}
                              </div>
                            </div>
                            <a
                              href={recurso.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gradient-to-r from-forest to-sage text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Descargar
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botón Marcar como Completada */}
                  {!lessonProgress[leccionActual.id] && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={completing}
                      className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-forest to-sage text-white font-bold py-3 sm:py-4 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      {completing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Marcar como Completada
                        </>
                      )}
                    </button>
                  )}

                  {lessonProgress[leccionActual.id] && (
                    <div className="w-full mt-6 sm:mt-8 bg-green-50 border border-green-200 text-green-800 font-semibold py-3 sm:py-4 px-6 rounded-lg flex items-center justify-center text-sm sm:text-base">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Lección Completada
                    </div>
                  )}

                  {/* Navegación Anterior/Siguiente */}
                  <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                      {(() => {
                        const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
                        const previousLesson = currentIndex > 0 ? lecciones[currentIndex - 1] : null
                        const nextLesson = currentIndex < lecciones.length - 1 ? lecciones[currentIndex + 1] : null
                        const canGoNext = lessonProgress[leccionActual.id] && nextLesson
                        
                        return (
                          <>
                            {/* Botón Anterior */}
                            {previousLesson ? (
                              <button
                                onClick={goToPreviousLesson}
                                className="flex-1 flex items-center justify-start gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all group"
                              >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <div className="text-left">
                                  <p className="text-xs text-gray-500 font-medium">Anterior</p>
                                  <p className="text-sm font-semibold line-clamp-1">{previousLesson.title}</p>
                                </div>
                              </button>
                            ) : (
                              <div className="flex-1"></div>
                            )}

                            {/* Botón Siguiente */}
                            {nextLesson ? (
                              <button
                                onClick={goToNextLesson}
                                disabled={!canGoNext}
                                className={`flex-1 flex items-center justify-end gap-2 px-4 py-3 rounded-lg transition-all group ${
                                  canGoNext 
                                    ? 'bg-gradient-to-r from-forest to-sage text-white hover:opacity-90' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                              >
                                <div className="text-right">
                                  <p className={`text-xs font-medium ${canGoNext ? 'text-white/80' : 'text-gray-400'}`}>
                                    {canGoNext ? 'Siguiente' : 'Completa esta lección'}
                                  </p>
                                  <p className="text-sm font-semibold line-clamp-1">{nextLesson.title}</p>
                                </div>
                                {canGoNext ? (
                                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                ) : (
                                  <Lock className="w-5 h-5" />
                                )}
                              </button>
                            ) : (
                              <div className="flex-1 flex items-center justify-end">
                                <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-semibold">
                                  <CheckCircle className="w-5 h-5 inline mr-2" />
                                  ¡Curso Completado!
                                </div>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  
                  {/* Navegación entre lecciones (móvil) */}
                  <div className="mt-6 flex items-center justify-between gap-4 lg:hidden">
                    {/* Lección anterior */}
                    {lecciones.findIndex(l => l.id === leccionActual.id) > 0 && (
                      <button
                        onClick={goToPreviousLesson}
                        className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-forest text-forest font-semibold py-3 px-4 rounded-lg hover:bg-forest/5 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Anterior</span>
                      </button>
                    )}
                    
                    {/* Lección siguiente */}
                    {lecciones.findIndex(l => l.id === leccionActual.id) < lecciones.length - 1 && (
                      <button
                        onClick={goToNextLesson}
                        disabled={!lessonProgress[leccionActual.id]}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-forest to-sage text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="hidden sm:inline">Siguiente</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* Hint de swipe (solo móvil) */}
                  {isSwiping && (
                    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 lg:hidden z-50">
                      <div className="bg-black/75 text-white px-6 py-3 rounded-full text-sm font-medium backdrop-blur-sm">
                        ← Desliza para navegar →
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Lecciones (con/sin módulos) */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 lg:sticky lg:top-24">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Contenido del Curso</h3>
                
                {hasModules ? (
                  /* VISTA CON MÓDULOS */
                  <div className="space-y-3">
                    {modules.map((module, moduleIndex) => {
                      const isExpanded = expandedModules[module.id]
                      const lessons = moduleLessons[module.id] || []
                      const isLoading = moduleLoading[module.id]
                      const completionPercentage = module.total_lessons > 0 
                        ? Math.round((module.completed_lessons / module.total_lessons) * 100) 
                        : 0
                      
                      // Determinar si el módulo está bloqueado
                      const isLocked = moduleIndex > 0 && (
                        modules[moduleIndex - 1].total_lessons === 0 || 
                        modules[moduleIndex - 1].completed_lessons < modules[moduleIndex - 1].total_lessons
                      )

                      return (
                        <div key={module.id} className={`border rounded-lg overflow-hidden ${
                          isLocked 
                            ? 'border-gray-300 bg-gray-50/50 opacity-70' 
                            : 'border-gray-200'
                        }`}>
                          {/* Header del Módulo (siempre visible) */}
                          <button
                            onClick={() => toggleModule(module.id, moduleIndex)}
                            disabled={isLocked}
                            className={`w-full p-4 transition flex items-center justify-between group ${
                              isLocked
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold uppercase ${
                                  isLocked ? 'text-gray-400' : 'text-forest'
                                }`}>
                                  Módulo {module.order_index}
                                </span>
                                {isLocked && (
                                  <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                {!isLocked && completionPercentage === 100 && (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <h4 className={`font-bold text-sm sm:text-base transition ${
                                isLocked 
                                  ? 'text-gray-500' 
                                  : 'text-gray-900 group-hover:text-forest'
                              }`}>
                                {module.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>{module.total_lessons} lecciones</span>
                                <span>•</span>
                                <span>{module.duration_minutes} min</span>
                                {!isLocked && (
                                  <>
                                    <span>•</span>
                                    <span className={completionPercentage === 100 ? 'text-green-600 font-semibold' : ''}>
                                      {completionPercentage}% completado
                                    </span>
                                  </>
                                )}
                              </div>
                              {isLocked && (
                                <p className="text-xs text-gray-500 mt-2 italic">
                                  🔒 Completa el módulo anterior para desbloquear
                                </p>
                              )}
                            </div>
                            <div className="ml-3 flex-shrink-0">
                              {!isLocked && (
                                isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-forest" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-forest transition" />
                                )
                              )}
                            </div>
                          </button>

                          {/* Lecciones del Módulo (colapsables) */}
                          {!isLocked && isExpanded && (
                            <div className="border-t border-gray-200 bg-white">
                              {isLoading ? (
                                <div className="p-6 text-center">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-forest" />
                                  <p className="text-sm text-gray-500 mt-2">Cargando lecciones...</p>
                                </div>
                              ) : (
                                <div className="p-2 space-y-2">
                                  {lessons.map((leccion, index) => {
                                    const isLocked = index > 0 && !lessonProgress[lessons[index - 1].id]
                                    const isCompleted = lessonProgress[leccion.id]
                                    const isActive = leccionActual?.id === leccion.id
                                    
                                    return (
                                      <div key={leccion.id} className="relative group">
                                        <motion.button
                                          onClick={() => handleSelectLesson(leccion)}
                                          disabled={isLocked}
                                          className={`w-full text-left p-3 rounded-lg transition-all ${
                                            isActive
                                              ? 'bg-forest/10 border-2 border-forest'
                                              : isLocked
                                              ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                              : 'bg-gray-50 hover:bg-gray-100'
                                          }`}
                                          whileHover={isLocked ? {} : { scale: 1.02 }}
                                          whileTap={isLocked ? {} : { scale: 0.98 }}
                                        >
                                          <div className="flex items-start">
                                            <div className="mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                                              {isLocked ? (
                                                <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                                              ) : isCompleted ? (
                                                <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                                              ) : (
                                                <Play className="w-4 sm:w-5 h-4 sm:h-5 text-forest" />
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-semibold ${
                                                  isLocked ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                  Lección {index + 1}
                                                  {isLocked && ' • Bloqueada'}
                                                </span>
                                                <span className={`text-xs whitespace-nowrap ml-2 ${
                                                  isLocked ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                  {leccion.duration_minutes} min
                                                </span>
                                              </div>
                                              <p className={`text-sm font-semibold ${
                                                isActive 
                                                  ? 'text-forest' 
                                                  : isLocked 
                                                  ? 'text-gray-400' 
                                                  : 'text-gray-900'
                                              }`}>
                                                {leccion.title}
                                              </p>
                                            </div>
                                          </div>
                                        </motion.button>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* VISTA SIN MÓDULOS (estructura simple) */
                  <div className="space-y-2">
                    {lecciones.map((leccion, index) => {
                      const isLocked = index > 0 && !lessonProgress[lecciones[index - 1].id]
                      const isCompleted = lessonProgress[leccion.id]
                      const isActive = leccionActual?.id === leccion.id
                      
                      return (
                        <div key={leccion.id} className="relative group">
                          <motion.button
                            onClick={() => handleSelectLesson(leccion)}
                            disabled={isLocked}
                            className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all ${
                              isActive
                                ? 'bg-forest/10 border-2 border-forest'
                                : isLocked
                                ? 'bg-gray-100 opacity-60 cursor-not-allowed'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            whileHover={isLocked ? {} : { scale: 1.02 }}
                            whileTap={isLocked ? {} : { scale: 0.98 }}
                          >
                            <div className="flex items-start">
                              <div className="mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                                {isLocked ? (
                                  <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400" />
                                ) : isCompleted ? (
                                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                                ) : (
                                  <Play className="w-4 sm:w-5 h-4 sm:h-5 text-forest" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-xs font-semibold ${
                                    isLocked ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    Lección {index + 1}
                                    {isLocked && ' • Bloqueada'}
                                  </span>
                                  <span className={`text-xs whitespace-nowrap ml-2 ${
                                    isLocked ? 'text-gray-400' : 'text-gray-500'
                                  }`}>
                                    {leccion.duration_minutes} min
                                  </span>
                                </div>
                                <p className={`text-sm sm:text-base font-semibold truncate ${
                                  isActive 
                                    ? 'text-forest' 
                                    : isLocked 
                                    ? 'text-gray-400' 
                                    : 'text-gray-900'
                                }`}>
                                  {leccion.title}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                          
                          {/* Tooltip para lecciones bloqueadas */}
                          {isLocked && (
                            <div className="hidden lg:block absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg shadow-xl whitespace-nowrap">
                                <div className="flex items-center">
                                  <Lock className="w-4 h-4 mr-2 flex-shrink-0" />
                                  <span>Completa la lección anterior</span>
                                </div>
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
