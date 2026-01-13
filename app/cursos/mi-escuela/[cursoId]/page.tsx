'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Play, CheckCircle, Download, FileText, Clock, Loader2, 
  AlertCircle, Video, Headphones, ChevronLeft, ChevronRight, ChevronDown, 
  ChevronUp, BookOpen, FolderOpen, ClipboardCheck, Trophy
} from 'lucide-react'
import { motion } from 'framer-motion'
import { getSession } from '@/lib/supabase/auth'
import { 
  getCourseBySlug, getCourseLessons, getUserCourseProgress, 
  getLessonResources, getUserLessonsProgressBulk, courseHasModules, 
  getCourseModulesWithStats, getLessonsByModule 
} from '@/lib/supabase/courses'
import type { Course, Lesson, Resource, ModuleWithStats } from '@/lib/supabase/courses'
import { getModuleTest, getModulesTestStatus, type ModuleTestStatus, type ModuleTest } from '@/lib/supabase/tests'
import ModuleTestComponent from '@/components/courses/ModuleTest'
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
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({})
  const [hasModules, setHasModules] = useState(false)
  const [modules, setModules] = useState<ModuleWithStats[]>([])
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
  const [moduleLoading, setModuleLoading] = useState<Record<string, boolean>>({})
  const [moduleLessons, setModuleLessons] = useState<Record<string, Lesson[]>>({})
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const contentRef = useRef<HTMLDivElement>(null)
  
  // Estado para tests
  const [modulesTestStatus, setModulesTestStatus] = useState<Record<string, ModuleTestStatus>>({})
  const [showingTest, setShowingTest] = useState(false)
  const [currentTest, setCurrentTest] = useState<ModuleTest | null>(null)
  const [currentTestModuleName, setCurrentTestModuleName] = useState('')

  // Funciones para navegación
  const goToNextLesson = async () => {
    if (!leccionActual) return
    
    if (hasModules) {
      const currentModuleIndex = modules.findIndex(module => {
        const lessons = moduleLessons[module.id] || []
        return lessons.some(l => l.id === leccionActual.id)
      })
      
      if (currentModuleIndex === -1) return
      
      const currentModule = modules[currentModuleIndex]
      const currentModuleLessons = moduleLessons[currentModule.id] || []
      const currentLessonIndex = currentModuleLessons.findIndex(l => l.id === leccionActual.id)
      
      // ¿Hay una siguiente lección en el módulo actual?
      if (currentLessonIndex < currentModuleLessons.length - 1) {
        const nextLesson = currentModuleLessons[currentLessonIndex + 1]
        handleSelectLesson(nextLesson)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } 
      // ¿Es la última lección del módulo? → Ir al siguiente módulo
      else if (currentModuleIndex < modules.length - 1) {
        const nextModule = modules[currentModuleIndex + 1]
        
        if (!expandedModules[nextModule.id]) {
          setExpandedModules(prev => ({ ...prev, [nextModule.id]: true }))
        }
        
        let nextModuleLessons = moduleLessons[nextModule.id]
        if (!nextModuleLessons) {
          setModuleLoading(prev => ({ ...prev, [nextModule.id]: true }))
          try {
            nextModuleLessons = await getLessonsByModule(nextModule.id)
            setModuleLessons(prev => ({
              ...prev,
              [nextModule.id]: nextModuleLessons
            }))
            
            if (userId && nextModuleLessons.length > 0) {
              const lessonIds = nextModuleLessons.map(l => l.id)
              const progressMap = await getUserLessonsProgressBulk(userId, lessonIds)
              setLessonProgress(prev => ({ ...prev, ...progressMap }))
            }
          } catch (error) {
            console.error('Error cargando siguiente módulo:', error)
            return
          } finally {
            setModuleLoading(prev => ({ ...prev, [nextModule.id]: false }))
          }
        }
        
        if (nextModuleLessons && nextModuleLessons.length > 0) {
          handleSelectLesson(nextModuleLessons[0])
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } else {
      const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
      if (currentIndex < lecciones.length - 1) {
        const nextLesson = lecciones[currentIndex + 1]
        handleSelectLesson(nextLesson)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const goToPreviousLesson = async () => {
    if (!leccionActual) return
    
    if (hasModules) {
      const currentModuleIndex = modules.findIndex(module => {
        const lessons = moduleLessons[module.id] || []
        return lessons.some(l => l.id === leccionActual.id)
      })
      
      if (currentModuleIndex === -1) return
      
      const currentModule = modules[currentModuleIndex]
      const currentModuleLessons = moduleLessons[currentModule.id] || []
      const currentLessonIndex = currentModuleLessons.findIndex(l => l.id === leccionActual.id)
      
      if (currentLessonIndex > 0) {
        const previousLesson = currentModuleLessons[currentLessonIndex - 1]
        handleSelectLesson(previousLesson)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      else if (currentModuleIndex > 0) {
        const previousModule = modules[currentModuleIndex - 1]
        
        if (!expandedModules[previousModule.id]) {
          setExpandedModules(prev => ({ ...prev, [previousModule.id]: true }))
        }
        
        let previousModuleLessons = moduleLessons[previousModule.id]
        if (!previousModuleLessons) {
          setModuleLoading(prev => ({ ...prev, [previousModule.id]: true }))
          try {
            previousModuleLessons = await getLessonsByModule(previousModule.id)
            setModuleLessons(prev => ({
              ...prev,
              [previousModule.id]: previousModuleLessons
            }))
          } catch (error) {
            console.error('Error cargando módulo anterior:', error)
            return
          } finally {
            setModuleLoading(prev => ({ ...prev, [previousModule.id]: false }))
          }
        }
        
        if (previousModuleLessons && previousModuleLessons.length > 0) {
          const lastLesson = previousModuleLessons[previousModuleLessons.length - 1]
          handleSelectLesson(lastLesson)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } else {
      const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
      if (currentIndex > 0) {
        const previousLesson = lecciones[currentIndex - 1]
        handleSelectLesson(previousLesson)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  // Hook de gestos swipe
  const { isSwiping } = useSwipe({
    onSwipeLeft: goToNextLesson,
    onSwipeRight: goToPreviousLesson,
  }, {
    threshold: 80,
    timeout: 400,
  })

  // Función para alternar expansión de módulos (sin bloqueos)
  const toggleModule = async (moduleId: string) => {
    const isExpanded = expandedModules[moduleId]
    
    if (!isExpanded && !moduleLessons[moduleId]) {
      setModuleLoading(prev => ({ ...prev, [moduleId]: true }))
      try {
        const lessons = await getLessonsByModule(moduleId)
        setModuleLessons(prev => ({ ...prev, [moduleId]: lessons }))
        
        if (userId && lessons.length > 0) {
          const lessonIds = lessons.map(l => l.id)
          const progressMap = await getUserLessonsProgressBulk(userId, lessonIds)
          setLessonProgress(prev => ({ ...prev, ...progressMap }))
        }
      } catch (error) {
        console.error('Error cargando lecciones del módulo:', error)
      } finally {
        setModuleLoading(prev => ({ ...prev, [moduleId]: false }))
      }
    }

    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  // Cargar datos del curso
  useEffect(() => {
    async function loadData() {
      try {
        const session = await getSession()
        
        if (!session?.user) {
          router.push('/cursos')
          return
        }

        const uid = session.user.id
        setUserId(uid)

        const courseData = await getCourseBySlug(cursoId)
        if (!courseData) {
          setCurso(null)
          setLoading(false)
          return
        }
        setCurso(courseData)

        // Verificar si tiene módulos
        const hasModulesResult = await courseHasModules(courseData.id)
        setHasModules(hasModulesResult)

        if (hasModulesResult) {
          // Cargar módulos con estadísticas
          const modulesData = await getCourseModulesWithStats(courseData.id, uid)
          setModules(modulesData)
          
          // Cargar estado de tests de todos los módulos
          if (modulesData.length > 0) {
            const moduleIds = modulesData.map(m => m.id)
            const testStatus = await getModulesTestStatus(moduleIds, uid)
            setModulesTestStatus(testStatus)
          }

          // Expandir y cargar primer módulo
          if (modulesData.length > 0) {
            const firstModule = modulesData[0]
            setExpandedModules({ [firstModule.id]: true })
            
            const firstModuleLessons = await getLessonsByModule(firstModule.id)
            setModuleLessons({ [firstModule.id]: firstModuleLessons })
            setLecciones(firstModuleLessons)
            
            if (firstModuleLessons.length > 0) {
              setLeccionActual(firstModuleLessons[0])
              const resourcesData = await getLessonResources(firstModuleLessons[0].id)
              setRecursos(resourcesData)
              
              // Cargar progreso
              const lessonIds = firstModuleLessons.map(l => l.id)
              const progressMap = await getUserLessonsProgressBulk(uid, lessonIds)
              setLessonProgress(progressMap)
            }
          }
        } else {
          // Sin módulos - cargar todas las lecciones
          const lessonsData = await getCourseLessons(courseData.id)
          setLecciones(lessonsData)
          
          if (lessonsData.length > 0) {
            setLeccionActual(lessonsData[0])
            const resourcesData = await getLessonResources(lessonsData[0].id)
            setRecursos(resourcesData)
            
            const lessonIds = lessonsData.map(l => l.id)
            const progressMap = await getUserLessonsProgressBulk(uid, lessonIds)
            setLessonProgress(progressMap)
          }
        }

        // Cargar progreso general del curso
        try {
          const progressData = await getUserCourseProgress(uid, courseData.id)
          setProgreso(progressData)
        } catch (error) {
          console.warn('No se pudo cargar el progreso del curso:', error)
        }

      } catch (error) {
        console.error('Error cargando datos del curso:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [cursoId, router])

  // Seleccionar lección (SIN bloqueos)
  const handleSelectLesson = async (lesson: Lesson) => {
    setLeccionActual(lesson)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    if (lesson.video_url) {
      setActiveTab('video')
    } else if (lesson.audio_url) {
      setActiveTab('audio')
    } else {
      setActiveTab('content')
    }

    const resourcesData = await getLessonResources(lesson.id)
    setRecursos(resourcesData)
  }

  // Iniciar test de un módulo
  const handleStartTest = async (moduleId: string, moduleName: string) => {
    const test = await getModuleTest(moduleId)
    if (test) {
      setCurrentTest(test)
      setCurrentTestModuleName(moduleName)
      setShowingTest(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      alert('Este módulo aún no tiene test disponible.')
    }
  }

  // Cuando se completa el test
  const handleTestComplete = async (passed: boolean, score: number) => {
    setShowingTest(false)
    setCurrentTest(null)
    
    if (passed && userId && curso) {
      // Actualizar estado local de tests
      const moduleId = currentTest?.module_id
      if (moduleId) {
        setModulesTestStatus(prev => ({
          ...prev,
          [moduleId]: {
            ...prev[moduleId],
            user_passed: true,
            best_score: Math.max(prev[moduleId]?.best_score || 0, score)
          }
        }))
        
        // Marcar todas las lecciones del módulo como completadas en el estado local
        const lessons = moduleLessons[moduleId] || []
        const newProgress: Record<string, boolean> = {}
        lessons.forEach(l => {
          newProgress[l.id] = true
        })
        setLessonProgress(prev => ({ ...prev, ...newProgress }))
      }
      
      // Recargar progreso del curso
      try {
        const progressData = await getUserCourseProgress(userId, curso.id)
        setProgreso(progressData)
      } catch (error) {
        console.error('Error recargando progreso:', error)
      }
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

  if (lecciones.length === 0 && modules.length === 0) {
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
              Las lecciones de este curso están siendo preparadas.
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

  // Si está mostrando un test
  if (showingTest && currentTest && userId) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => {
              setShowingTest(false)
              setCurrentTest(null)
            }}
            className="mb-6 flex items-center text-gray-600 hover:text-forest transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al contenido
          </button>
          
          <ModuleTestComponent
            test={currentTest}
            userId={userId}
            moduleName={currentTestModuleName}
            onComplete={handleTestComplete}
            onCancel={() => {
              setShowingTest(false)
              setCurrentTest(null)
            }}
          />
        </div>
      </div>
    )
  }

  if (!leccionActual) {
    return null
  }

  const colorGradient = getDifficultyColor(curso.difficulty)
  const completedCount = Object.values(lessonProgress).filter(Boolean).length
  const progressPercentage = progreso ? Math.round(progreso.progress_percentage) : 0

  // Determinar qué pestañas mostrar
  const availableTabs = []
  if (leccionActual.video_url) availableTabs.push('video')
  if (leccionActual.audio_url) availableTabs.push('audio')
  if (leccionActual.content) availableTabs.push('content')
  if (recursos.length > 0) availableTabs.push('resources')

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colorGradient} text-white py-4 sm:py-6 md:py-8`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            <Link
              href="/cursos/mi-escuela"
              className="inline-flex items-center text-white/80 hover:text-white transition mb-3 sm:mb-4 text-xs sm:text-sm md:text-base"
            >
              <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
              Volver a Mi Escuela
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="mb-2 sm:mb-3 md:mb-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{curso.title}</h1>
                  <div 
                    className="text-white/90 text-xs sm:text-sm md:text-base"
                    dangerouslySetInnerHTML={{ __html: curso.short_description || curso.description || '' }}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-6 text-xs sm:text-sm">
                  <span className="flex items-center">
                    <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    {curso.duration_minutes} min
                  </span>
                  <span>{getDifficultyLabel(curso.difficulty)}</span>
                  <span>{completedCount} lecciones completadas</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 sm:mt-4 md:mt-6">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1 sm:mb-2">
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

      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 py-2 sm:py-3 md:py-4">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            <div className="flex flex-col gap-1 sm:gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <BookOpen className="w-3 sm:w-4 h-3 sm:h-4 text-forest" />
                  <span className="font-semibold text-gray-900 truncate">{curso.title}</span>
                </div>
              </div>
              
              {hasModules && leccionActual && (() => {
                const currentModule = modules.find(module => {
                  const lessons = moduleLessons[module.id] || []
                  return lessons.some(l => l.id === leccionActual.id)
                })
                return currentModule ? (
                  <>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-px h-4 bg-gray-300"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="w-4 h-px bg-gray-300"></div>
                      <div className="flex items-center gap-2 text-sm bg-forest/5 px-3 py-1 rounded-md">
                        <FolderOpen className="w-4 h-4 text-forest" />
                        <span className="font-medium text-forest">{currentModule.title}</span>
                      </div>
                    </div>
                  </>
                ) : null
              })()}
              
              <div className="flex items-center gap-2 ml-2">
                <div className="w-px h-4 bg-gray-300"></div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 ml-2">
                <div className="w-3 sm:w-4 h-px bg-gray-300"></div>
                <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm bg-gradient-to-r from-forest to-sage px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-white shadow-sm">
                  <FileText className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="font-medium truncate max-w-[150px] sm:max-w-none">{leccionActual?.title || 'Cargando...'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación rápida */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {(() => {
                if (hasModules) {
                  const currentModuleIndex = modules.findIndex(module => {
                    const lessons = moduleLessons[module.id] || []
                    return lessons.some(l => l.id === leccionActual.id)
                  })
                  
                  if (currentModuleIndex === -1) return <div></div>
                  
                  const currentModule = modules[currentModuleIndex]
                  const currentModuleLessons = moduleLessons[currentModule.id] || []
                  const currentLessonIndex = currentModuleLessons.findIndex(l => l.id === leccionActual.id)
                  
                  const hasPreviousInModule = currentLessonIndex > 0
                  const hasPreviousModule = currentModuleIndex > 0
                  const canGoPrevious = hasPreviousInModule || hasPreviousModule
                  
                  if (!canGoPrevious) {
                    return <div></div>
                  }
                  
                  return (
                    <button
                      onClick={goToPreviousLesson}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-forest hover:bg-gray-50 rounded-lg transition-all group"
                    >
                      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Anterior</span>
                    </button>
                  )
                } else {
                  const hasPrevious = lecciones.findIndex(l => l.id === leccionActual.id) > 0
                  
                  if (!hasPrevious) {
                    return <div></div>
                  }
                  
                  return (
                    <button
                      onClick={goToPreviousLesson}
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-forest hover:bg-gray-50 rounded-lg transition-all group"
                    >
                      <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm font-medium">Anterior</span>
                    </button>
                  )
                }
              })()}
              
              {(() => {
                if (hasModules) {
                  const currentModuleIndex = modules.findIndex(module => {
                    const lessons = moduleLessons[module.id] || []
                    return lessons.some(l => l.id === leccionActual.id)
                  })
                  
                  if (currentModuleIndex === -1) return <div></div>
                  
                  const currentModule = modules[currentModuleIndex]
                  const currentModuleLessons = moduleLessons[currentModule.id] || []
                  const currentLessonIndex = currentModuleLessons.findIndex(l => l.id === leccionActual.id)
                  
                  const hasNextInModule = currentLessonIndex < currentModuleLessons.length - 1
                  const hasNextModule = currentModuleIndex < modules.length - 1
                  const isLastOverall = !hasNextInModule && !hasNextModule
                  
                  if (isLastOverall) {
                    return <div></div>
                  }
                  
                  return (
                    <button
                      onClick={goToNextLesson}
                      className="flex items-center gap-2 px-4 py-2 text-forest hover:bg-forest/5 rounded-lg transition-all group"
                    >
                      <span className="text-sm font-medium">Siguiente</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )
                } else {
                  const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
                  const isLastLesson = currentIndex >= lecciones.length - 1
                  
                  if (isLastLesson) {
                    return <div></div>
                  }
                  
                  return (
                    <button
                      onClick={goToNextLesson}
                      className="flex items-center gap-2 px-4 py-2 text-forest hover:bg-forest/5 rounded-lg transition-all group"
                    >
                      <span className="text-sm font-medium">Siguiente</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )
                }
              })()}
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
                {/* Video */}
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

                {/* Audio */}
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

                {/* Tabs */}
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
                    <>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                        {leccionActual.title}
                      </h2>
                      <div 
                        className="responsive-prose prose prose-sm sm:prose-base md:prose-lg max-w-none
                          prose-headings:font-black prose-headings:tracking-tight
                          prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:text-gray-900
                          prose-h3:text-lg sm:prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:text-gray-800
                          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 sm:prose-p:mb-6 prose-p:text-sm sm:prose-p:text-base
                          prose-a:text-forest prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-gray-900 prose-strong:font-bold
                          prose-ul:my-4 sm:prose-ul:my-6 prose-ul:space-y-2
                          prose-ol:my-4 sm:prose-ol:my-6 prose-ol:space-y-2
                          prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-sm sm:prose-li:text-base
                          prose-blockquote:border-l-4 prose-blockquote:border-forest prose-blockquote:bg-forest/5 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-sm sm:prose-blockquote:text-base
                          prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-6 sm:prose-img:my-8
                          prose-code:text-forest prose-code:bg-gray-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm
                          prose-pre:bg-gray-900 prose-pre:rounded-xl sm:prose-pre:rounded-2xl prose-pre:shadow-lg prose-pre:text-xs sm:prose-pre:text-sm"
                        dangerouslySetInnerHTML={{ __html: leccionActual.content }}
                      />
                    </>
                  )}

                  {activeTab === 'resources' && recursos.length > 0 && (
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Recursos Descargables</h2>
                      <div className="space-y-3 sm:space-y-4">
                        {recursos.map((recurso) => (
                          <div 
                            key={recurso.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition gap-3"
                          >
                            <div className="flex items-start sm:items-center w-full sm:w-auto">
                              <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-forest mr-3 sm:mr-4 flex-shrink-0" />
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{recurso.title}</h3>
                                {recurso.description && (
                                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{recurso.description}</p>
                                )}
                              </div>
                            </div>
                            <a
                              href={recurso.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto bg-gradient-to-r from-forest to-sage text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center justify-center text-sm whitespace-nowrap"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Descargar
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Indicador de lección completada (si aplica) */}
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
                        if (hasModules) {
                          const currentModuleIndex = modules.findIndex(module => {
                            const lessons = moduleLessons[module.id] || []
                            return lessons.some(l => l.id === leccionActual.id)
                          })
                          
                          if (currentModuleIndex === -1) return null
                          
                          const currentModule = modules[currentModuleIndex]
                          const currentModuleLessons = moduleLessons[currentModule.id] || []
                          const currentLessonIndex = currentModuleLessons.findIndex(l => l.id === leccionActual.id)
                          
                          let previousLesson = null
                          if (currentLessonIndex > 0) {
                            previousLesson = currentModuleLessons[currentLessonIndex - 1]
                          } else if (currentModuleIndex > 0) {
                            const previousModule = modules[currentModuleIndex - 1]
                            const previousModuleLessons = moduleLessons[previousModule.id] || []
                            if (previousModuleLessons.length > 0) {
                              previousLesson = previousModuleLessons[previousModuleLessons.length - 1]
                            }
                          }
                          
                          let nextLesson = null
                          let nextLessonTitle = ''
                          const hasNextInModule = currentLessonIndex < currentModuleLessons.length - 1
                          const hasNextModule = currentModuleIndex < modules.length - 1
                          
                          if (hasNextInModule) {
                            nextLesson = currentModuleLessons[currentLessonIndex + 1]
                            nextLessonTitle = nextLesson.title
                          } else if (hasNextModule) {
                            const nextModule = modules[currentModuleIndex + 1]
                            nextLessonTitle = `Módulo: ${nextModule.title}`
                          }
                          
                          const isLastOverall = !hasNextInModule && !hasNextModule
                          
                          return (
                            <>
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

                              {!isLastOverall ? (
                                <button
                                  onClick={goToNextLesson}
                                  className="flex-1 flex items-center justify-end gap-2 px-4 py-3 bg-gradient-to-r from-forest to-sage text-white hover:opacity-90 rounded-lg transition-all group"
                                >
                                  <div className="text-right">
                                    <p className="text-xs text-white/80 font-medium">Siguiente</p>
                                    <p className="text-sm font-semibold line-clamp-1">{nextLessonTitle}</p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                        } else {
                          const currentIndex = lecciones.findIndex(l => l.id === leccionActual.id)
                          const previousLesson = currentIndex > 0 ? lecciones[currentIndex - 1] : null
                          const nextLesson = currentIndex < lecciones.length - 1 ? lecciones[currentIndex + 1] : null
                          
                          return (
                            <>
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

                              {nextLesson ? (
                                <button
                                  onClick={goToNextLesson}
                                  className="flex-1 flex items-center justify-end gap-2 px-4 py-3 bg-gradient-to-r from-forest to-sage text-white hover:opacity-90 rounded-lg transition-all group"
                                >
                                  <div className="text-right">
                                    <p className="text-xs text-white/80 font-medium">Siguiente</p>
                                    <p className="text-sm font-semibold line-clamp-1">{nextLesson.title}</p>
                                  </div>
                                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                        }
                      })()}
                    </div>
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

            {/* Sidebar */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6 lg:sticky lg:top-24">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="w-full flex items-center justify-between mb-4 sm:mb-6 lg:cursor-default"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Contenido del Curso
                  </h3>
                  <div className="lg:hidden">
                    {isSidebarCollapsed ? (
                      <ChevronDown className="w-6 h-6 text-forest" />
                    ) : (
                      <ChevronUp className="w-6 h-6 text-forest" />
                    )}
                  </div>
                </button>

                {isSidebarCollapsed && progreso && (
                  <div className="lg:hidden mb-4 p-3 bg-forest/5 rounded-lg">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-700">Tu Progreso</span>
                      <span className="text-forest font-bold">
                        {Math.round(progreso.progress_percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-forest to-sage h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progreso.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className={`${isSidebarCollapsed ? 'hidden lg:block' : 'block'}`}>
                
                {hasModules ? (
                  /* VISTA CON MÓDULOS */
                  <div className="space-y-3">
                    {modules.map((module) => {
                      const isExpanded = expandedModules[module.id]
                      const lessons = moduleLessons[module.id] || []
                      const isLoading = moduleLoading[module.id]
                      const testStatus = modulesTestStatus[module.id]
                      const moduleCompleted = testStatus?.user_passed || false
                      const completionPercentage = module.total_lessons > 0 
                        ? Math.round((module.completed_lessons / module.total_lessons) * 100) 
                        : 0

                      return (
                        <div key={module.id} className="border rounded-lg overflow-hidden border-gray-200">
                          {/* Header del Módulo */}
                          <button
                            onClick={() => toggleModule(module.id)}
                            className="w-full p-4 transition flex items-center justify-between group bg-gray-50 hover:bg-gray-100"
                          >
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase text-forest">
                                  Módulo {module.order_index}
                                </span>
                                {moduleCompleted && (
                                  <Trophy className="w-4 h-4 text-amber-500" />
                                )}
                              </div>
                              <h4 className="font-bold text-sm sm:text-base transition text-gray-900 group-hover:text-forest">
                                {module.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span>{module.total_lessons} lecciones</span>
                                <span>•</span>
                                <span>{module.duration_minutes} min</span>
                                {testStatus?.has_test && (
                                  <>
                                    <span>•</span>
                                    {moduleCompleted ? (
                                      <span className="text-green-600 font-semibold flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Test aprobado ({testStatus.best_score}%)
                                      </span>
                                    ) : (
                                      <span className="text-amber-600 font-medium">Test pendiente</span>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-forest" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-forest transition" />
                              )}
                            </div>
                          </button>

                          {/* Lecciones del Módulo */}
                          {isExpanded && (
                            <div className="border-t border-gray-200 bg-white">
                              {isLoading ? (
                                <div className="p-6 text-center">
                                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-forest" />
                                  <p className="text-sm text-gray-500 mt-2">Cargando lecciones...</p>
                                </div>
                              ) : (
                                <>
                                  <div className="p-2 space-y-2">
                                    {lessons.map((leccion, index) => {
                                      const isCompleted = lessonProgress[leccion.id]
                                      const isActive = leccionActual?.id === leccion.id
                                      
                                      return (
                                        <div key={leccion.id} className="relative group">
                                          <motion.button
                                            onClick={() => handleSelectLesson(leccion)}
                                            className={`w-full text-left p-3 rounded-lg transition-all ${
                                              isActive
                                                ? 'bg-forest/10 border-2 border-forest'
                                                : 'bg-gray-50 hover:bg-gray-100'
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                          >
                                            <div className="flex items-start">
                                              <div className="mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                                                {isCompleted ? (
                                                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                                                ) : (
                                                  <Play className="w-4 sm:w-5 h-4 sm:h-5 text-forest" />
                                                )}
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                  <span className="text-xs font-semibold text-gray-500">
                                                    Lección {index + 1}
                                                  </span>
                                                  <span className="text-xs whitespace-nowrap ml-2 text-gray-500">
                                                    {leccion.duration_minutes} min
                                                  </span>
                                                </div>
                                                <p className={`text-sm font-semibold ${
                                                  isActive ? 'text-forest' : 'text-gray-900'
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
                                  
                                  {/* Botón de Test del Módulo */}
                                  {testStatus?.has_test && testStatus.is_published && (
                                    <div className="p-3 border-t border-gray-100">
                                      {moduleCompleted ? (
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                          <div className="flex items-center gap-2">
                                            <Trophy className="w-5 h-5 text-amber-500" />
                                            <span className="font-semibold text-green-700">
                                              Test Aprobado
                                            </span>
                                          </div>
                                          <span className="text-green-600 font-bold">
                                            {testStatus.best_score}%
                                          </span>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleStartTest(module.id, module.title)}
                                          className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                        >
                                          <ClipboardCheck className="w-5 h-5" />
                                          Realizar Test del Módulo
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* VISTA SIN MÓDULOS */
                  <div className="space-y-2">
                    {lecciones.map((leccion, index) => {
                      const isCompleted = lessonProgress[leccion.id]
                      const isActive = leccionActual?.id === leccion.id
                      
                      return (
                        <div key={leccion.id} className="relative group">
                          <motion.button
                            onClick={() => handleSelectLesson(leccion)}
                            className={`w-full text-left p-3 sm:p-4 rounded-lg transition-all ${
                              isActive
                                ? 'bg-forest/10 border-2 border-forest'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start">
                              <div className="mr-2 sm:mr-3 mt-0.5 flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                                ) : (
                                  <Play className="w-4 sm:w-5 h-4 sm:h-5 text-forest" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-gray-500">
                                    Lección {index + 1}
                                  </span>
                                  <span className="text-xs whitespace-nowrap ml-2 text-gray-500">
                                    {leccion.duration_minutes} min
                                  </span>
                                </div>
                                <p className={`text-sm sm:text-base font-semibold truncate ${
                                  isActive ? 'text-forest' : 'text-gray-900'
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
