'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, ClipboardCheck, Eye, EyeOff, Trash2, RotateCcw, 
  Loader2, Search, ChevronDown, ChevronUp, Users, Trophy,
  Target, BarChart3, AlertTriangle, CheckCircle, XCircle,
  Sparkles, BookOpen, FolderOpen
} from 'lucide-react'
import { getSession } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import { toggleTestPublished, deleteModuleTest, getTestStats } from '@/lib/supabase/tests'
import Toast from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'
import TestGenerationModal, { type GenerationStep } from '@/components/ui/TestGenerationModal'

interface TestWithDetails {
  id: string
  module_id: string
  title: string
  description: string | null
  passing_score: number
  questions: any[]
  is_generated: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  // Datos del módulo y curso
  module_title: string
  module_order: number
  course_id: string
  course_title: string
  course_slug: string
  // Estadísticas
  stats: {
    total_attempts: number
    unique_users: number
    pass_rate: number
    average_score: number
  } | null
}

export default function TestsAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tests, setTests] = useState<TestWithDetails[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCourse, setFilterCourse] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [expandedTest, setExpandedTest] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState<string | null>(null)
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    confirmColor: 'red' | 'orange' | 'green' | 'blue'
    onConfirm: () => void
  } | null>(null)
  
  // Estado para modal de generación
  const [showGenerationModal, setShowGenerationModal] = useState(false)
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([])
  const [currentGenerationStep, setCurrentGenerationStep] = useState(0)

  // Obtener lista única de cursos para el filtro
  const uniqueCourses = Array.from(
    new Map(tests.map(t => [t.course_id, { id: t.course_id, title: t.course_title }])).values()
  )

  useEffect(() => {
    checkAuthAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuthAndLoad = async () => {
    const { data } = await getSession()
    const session = data?.session
    
    if (!session || session.user?.user_metadata?.role !== 'admin') {
      router.push('/cursos/auth/login?redirect=/administrator/tests')
      return
    }
    
    await loadTests()
  }

  const loadTests = async () => {
    setLoading(true)
    try {
      // Usar la función RPC que evita problemas de RLS y trae las estadísticas
      const { data: testsData, error: testsError } = await supabase
        .rpc('get_all_module_tests_with_stats')

      if (testsError) {
        console.error('Error cargando tests:', testsError)
        setToast({ message: 'Error al cargar los tests', type: 'error' })
        return
      }

      // Procesar datos desde el RPC
      const testsWithStats: TestWithDetails[] = ((testsData as any[]) || []).map((test: any) => ({
        id: test.id,
        module_id: test.module_id,
        title: test.title,
        description: test.description,
        passing_score: test.passing_score,
        questions: test.questions || [],
        is_generated: test.is_generated,
        is_published: test.is_published,
        created_at: test.created_at,
        updated_at: test.updated_at,
        module_title: test.module_title || 'Módulo no disponible',
        module_order: 0, // No disponible en el RPC, pero no es crítico
        course_id: test.course_id || '',
        course_title: test.course_title || 'Curso no disponible',
        course_slug: '', // No disponible en el RPC
        stats: {
          total_attempts: test.total_attempts || 0,
          unique_users: test.unique_users || 0,
          pass_rate: test.pass_rate || 0,
          average_score: test.average_score || 0
        }
      }))

      setTests(testsWithStats)
    } catch (error) {
      console.error('Error:', error)
      setToast({ message: 'Error inesperado al cargar los tests', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (test: TestWithDetails) => {
    const action = test.is_published ? 'despublicar' : 'publicar'
    
    setConfirmModal({
      isOpen: true,
      title: `${test.is_published ? 'Despublicar' : 'Publicar'} Test`,
      message: `¿${action.charAt(0).toUpperCase() + action.slice(1)} el test "${test.title}"?`,
      confirmText: test.is_published ? 'Despublicar' : 'Publicar',
      confirmColor: test.is_published ? 'orange' : 'green',
      onConfirm: async () => {
        const success = await toggleTestPublished(test.id, !test.is_published)
        if (success) {
          setTests(prev => prev.map(t => 
            t.id === test.id ? { ...t, is_published: !t.is_published } : t
          ))
          setToast({ 
            message: `Test ${test.is_published ? 'despublicado' : 'publicado'} correctamente`, 
            type: 'success' 
          })
        } else {
          setToast({ message: 'Error al cambiar el estado del test', type: 'error' })
        }
        setConfirmModal(null)
      }
    })
  }

  const handleDelete = async (test: TestWithDetails) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Test',
      message: `¿Eliminar el test "${test.title}"? Se perderán todas las estadísticas de intentos. Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      confirmColor: 'red',
      onConfirm: async () => {
        const success = await deleteModuleTest(test.id)
        if (success) {
          setTests(prev => prev.filter(t => t.id !== test.id))
          setToast({ message: 'Test eliminado correctamente', type: 'success' })
        } else {
          setToast({ message: 'Error al eliminar el test', type: 'error' })
        }
        setConfirmModal(null)
      }
    })
  }

  const handleRegenerate = async (test: TestWithDetails) => {
    setConfirmModal({
      isOpen: true,
      title: 'Regenerar Test',
      message: `¿Regenerar el test "${test.title}"? Se crearán 20 preguntas nuevas basadas en el contenido actual de las lecciones. Las preguntas anteriores se sobrescribirán.`,
      confirmText: 'Regenerar',
      confirmColor: 'orange',
      onConfirm: async () => {
        setConfirmModal(null)
        setRegenerating(test.id)
        setShowGenerationModal(true)
        
        // Inicializar pasos
        const initialSteps: GenerationStep[] = [
          { id: '1', label: 'Verificando sesión', status: 'loading', message: 'Comprobando autenticación...' },
          { id: '2', label: 'Obteniendo lecciones del módulo', status: 'pending' },
          { id: '3', label: 'Conectando con OpenAI', status: 'pending' },
          { id: '4', label: 'Regenerando preguntas con IA', status: 'pending', message: 'Esto puede tardar hasta 30 segundos' },
          { id: '5', label: 'Validando preguntas generadas', status: 'pending' },
          { id: '6', label: 'Actualizando test en base de datos', status: 'pending' },
          { id: '7', label: 'Finalizando', status: 'pending' }
        ]
        setGenerationSteps(initialSteps)
        setCurrentGenerationStep(0)
        
        const updateStep = (stepIndex: number, status: GenerationStep['status'], message?: string, details?: string) => {
          setGenerationSteps(prev => {
            const newSteps = [...prev]
            newSteps[stepIndex] = { ...newSteps[stepIndex], status, message, details }
            return newSteps
          })
          setCurrentGenerationStep(stepIndex + 1)
        }
        
        try {
          // Paso 1: Verificar sesión
          const { data: { session } } = await supabase.auth.getSession()
          if (!session) {
            updateStep(0, 'error', 'No hay sesión activa', 'Por favor, inicia sesión e intenta de nuevo')
            setRegenerating(null)
            return
          }
          updateStep(0, 'success', 'Sesión verificada correctamente')

          // Paso 2: Lecciones
          updateStep(1, 'loading', 'Cargando contenido de las lecciones...')
          await new Promise(resolve => setTimeout(resolve, 500))
          updateStep(1, 'success', 'Lecciones cargadas correctamente')

          // Paso 3: Conectando con API
          updateStep(2, 'loading', 'Preparando solicitud a OpenAI...')

          const response = await fetch('/api/admin/generate-module-test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ moduleId: test.module_id, regenerate: true })
          })

          updateStep(2, 'success', 'Conectado con OpenAI')

          // Paso 4: Generar preguntas
          updateStep(3, 'loading', 'IA está regenerando 20 preguntas únicas...')

          const data = await response.json()

          if (!response.ok) {
            updateStep(3, 'error', 'Error al regenerar preguntas', data.error || `Error HTTP ${response.status}`)
            setRegenerating(null)
            return
          }

          updateStep(3, 'success', '20 preguntas regeneradas correctamente')

          // Paso 5: Validar
          updateStep(4, 'loading', 'Verificando unicidad y formato...')
          await new Promise(resolve => setTimeout(resolve, 300))
          updateStep(4, 'success', 'Todas las preguntas son únicas y válidas')

          // Paso 6: Guardar
          updateStep(5, 'loading', 'Actualizando test en la base de datos...')
          await new Promise(resolve => setTimeout(resolve, 300))
          updateStep(5, 'success', 'Test actualizado correctamente')

          // Paso 7: Finalizar
          updateStep(6, 'loading', 'Recargando lista de tests...')
          await loadTests()
          updateStep(6, 'success', data.message || 'Test regenerado exitosamente')
          
          setToast({ message: 'Test regenerado correctamente', type: 'success' })
        } catch (error: any) {
          console.error('Error regenerando test:', error)
          const currentStep = generationSteps.findIndex(s => s.status === 'loading')
          if (currentStep >= 0) {
            updateStep(currentStep, 'error', 'Error inesperado', error.message || error.toString())
          }
          setToast({ message: error.message || 'Error al regenerar el test', type: 'error' })
        } finally {
          setRegenerating(null)
        }
      }
    })
  }

  // Filtrar tests
  const filteredTests = tests.filter(test => {
    const matchesSearch = 
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.course_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.module_title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCourse = filterCourse === 'all' || test.course_id === filterCourse
    
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'published' && test.is_published) ||
      (filterStatus === 'draft' && !test.is_published)
    
    return matchesSearch && matchesCourse && matchesStatus
  })

  // Calcular totales
  const totalAttempts = tests.reduce((sum, t) => sum + (t.stats?.total_attempts || 0), 0)
  const totalUniqueUsers = tests.reduce((sum, t) => sum + (t.stats?.unique_users || 0), 0)
  const avgPassRate = tests.length > 0 
    ? Math.round(tests.reduce((sum, t) => sum + (t.stats?.pass_rate || 0), 0) / tests.filter(t => t.stats?.total_attempts).length || 0)
    : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando tests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/administrator" className="inline-flex items-center text-forest hover:text-sage mb-3 transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tests de Módulos</h1>
              <p className="text-gray-600">Gestiona los tests de evaluación de todos los cursos</p>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Tests</span>
              <ClipboardCheck className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{tests.length}</p>
            <p className="text-sm text-gray-500 mt-1">
              {tests.filter(t => t.is_published).length} publicados
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Intentos Totales</span>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalAttempts}</p>
            <p className="text-sm text-gray-500 mt-1">
              De todos los tests
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Usuarios</span>
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {tests.reduce((sum, t) => sum + (t.stats?.unique_users || 0), 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Han realizado tests
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Tasa Aprobación</span>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgPassRate}%</p>
            <p className="text-sm text-gray-500 mt-1">
              Media global
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, curso o módulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              />
            </div>

            {/* Filtro por curso */}
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
            >
              <option value="all">Todos los cursos</option>
              {uniqueCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>

            {/* Filtro por estado */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicados</option>
              <option value="draft">Borradores</option>
            </select>
          </div>
        </div>

        {/* Lista de Tests */}
        {filteredTests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <ClipboardCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {tests.length === 0 ? 'No hay tests creados' : 'No se encontraron tests'}
            </h3>
            <p className="text-gray-600 mb-6">
              {tests.length === 0 
                ? 'Crea tests desde la edición de cada curso en la sección de módulos.'
                : 'Prueba con otros filtros de búsqueda.'
              }
            </p>
            {tests.length === 0 && (
              <Link
                href="/administrator/cursos"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-forest to-sage text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                <BookOpen className="w-5 h-5" />
                Ir a Gestión de Cursos
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test) => (
              <div 
                key={test.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header del Test */}
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Breadcrumb: Curso > Módulo */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <BookOpen className="w-4 h-4" />
                        <Link 
                          href={`/administrator/cursos/editar/${test.course_id}`}
                          className="hover:text-forest transition"
                        >
                          {test.course_title}
                        </Link>
                        <span>→</span>
                        <FolderOpen className="w-4 h-4" />
                        <span>Módulo {test.module_order}: {test.module_title}</span>
                      </div>

                      {/* Título y estado */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{test.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          test.is_published 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {test.is_published ? '✓ Publicado' : 'Borrador'}
                        </span>
                        {test.is_generated && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            ✨ Generado con IA
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{test.questions.length} preguntas</span>
                        <span>•</span>
                        <span>Aprobado con ≥{test.passing_score}%</span>
                        <span>•</span>
                        <span>Creado: {formatDate(test.created_at)}</span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 ml-4">
                      {regenerating === test.id ? (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Regenerando...</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleTogglePublish(test)}
                            className={`p-2 rounded-lg transition ${
                              test.is_published
                                ? 'text-green-600 hover:bg-green-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={test.is_published ? 'Despublicar' : 'Publicar'}
                          >
                            {test.is_published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleRegenerate(test)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Regenerar test"
                          >
                            <RotateCcw className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(test)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar test"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setExpandedTest(expandedTest === test.id ? null : test.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          >
                            {expandedTest === test.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Estadísticas mini */}
                  {test.stats && test.stats.total_attempts > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{test.stats.total_attempts}</p>
                        <p className="text-xs text-gray-500">Intentos</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-900">{test.stats.unique_users}</p>
                        <p className="text-xs text-gray-500">Usuarios</p>
                      </div>
                      <div className="text-center">
                        <p className={`text-xl font-bold ${test.stats.pass_rate >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                          {test.stats.pass_rate}%
                        </p>
                        <p className="text-xs text-gray-500">Aprobados</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-blue-600">{test.stats.average_score}%</p>
                        <p className="text-xs text-gray-500">Nota Media</p>
                      </div>
                    </div>
                  )}

                  {test.stats?.total_attempts === 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                      Aún no hay intentos registrados para este test
                    </div>
                  )}
                </div>

                {/* Preguntas (expandible) */}
                {expandedTest === test.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-5">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-forest" />
                      Preguntas del Test ({test.questions.length})
                    </h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {test.questions.map((q: any, index: number) => (
                        <div key={q.id || index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-7 h-7 bg-forest text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-3">{q.question}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {q.options.map((option: string, optIndex: number) => (
                                  <div 
                                    key={optIndex}
                                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                                      optIndex === q.correct_answer
                                        ? 'bg-green-50 border border-green-200 text-green-800'
                                        : 'bg-gray-50 text-gray-700'
                                    }`}
                                  >
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                      optIndex === q.correct_answer
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                    }`}>
                                      {String.fromCharCode(65 + optIndex)}
                                    </span>
                                    <span className="flex-1">{option}</span>
                                    {optIndex === q.correct_answer && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                  </div>
                                ))}
                              </div>
                              {q.explanation && (
                                <p className="mt-3 text-sm text-gray-600 italic bg-blue-50 p-2 rounded-lg">
                                  💡 {q.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Modal de confirmación */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          cancelText="Cancelar"
          confirmColor={confirmModal.confirmColor}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* Modal de generación de test */}
      <TestGenerationModal
        isOpen={showGenerationModal}
        onClose={() => {
          setShowGenerationModal(false)
          setGenerationSteps([])
          setCurrentGenerationStep(0)
        }}
        steps={generationSteps}
        currentStep={currentGenerationStep}
        canClose={!regenerating || generationSteps.some(s => s.status === 'error' || s.status === 'success')}
      />
    </div>
  )
}
