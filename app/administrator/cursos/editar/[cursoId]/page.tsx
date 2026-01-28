'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft, Save, Loader2, Sparkles, Plus, X } from 'lucide-react'
import { getCourseById, updateCourse, getCourseLessons, getLessonResources, updateLesson, deleteLesson, createLesson, createResource, bulkCreateResources, bulkCreateLessons, getCourseModules, createModule, updateModule, deleteModule, assignLessonToModule } from '@/lib/supabase/courses'
import type { Course, Lesson, Resource, CourseModule } from '@/lib/supabase/courses'
import Toast from '@/components/ui/Toast'
import ImageUpload from '@/components/ui/ImageUpload'
import { uploadCourseCoverImage } from '@/lib/storage'

const LessonsManager = dynamic(() => import('@/components/admin/LessonsManager'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-500">Cargando gestor de lecciones...</p>
  </div>
})

const ModulesManager = dynamic(() => import('@/components/admin/ModulesManager'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-500">Cargando gestor de módulos...</p>
  </div>
})

const TinyMCEEditor = dynamic(() => import('@/components/admin/TinyMCEEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-32 bg-gray-100 rounded-lg animate-pulse" />
})

interface LessonWithResources extends Lesson {
  resources: Resource[]
  isExpanded: boolean
  videoUrl?: string
  videoProvider?: string
  audioUrl?: string
  audioProvider?: string
  isFreePreview?: boolean
}

export default function EditarCursoPage() {
  const router = useRouter()
  const params = useParams()
  const cursoId = params.cursoId as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'lessons' | 'modules'>('info')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    icon: '',
    price: '0',
    difficulty: 'basico',
    isFree: false,
    isPublished: false,
    thumbnailUrl: '',
    coverImageUrl: '',
    whatYouLearn: ['', '', '', '']
  })

  const [lessons, setLessons] = useState<LessonWithResources[]>([])
  const [modules, setModules] = useState<CourseModule[]>([])

  useEffect(() => {
    loadCourseData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursoId])

  const loadCourseData = async () => {
    try {
      // Cargar curso
      const course = await getCourseById(cursoId)
      if (!course) {
        setToast({ message: 'Curso no encontrado', type: 'error' })
        router.push('/administrator')
        return
      }

      setFormData({
        title: course.title,
        slug: course.slug,
        shortDescription: course.short_description || '',
        description: course.description || '',
        icon: course.icon || '',
        price: course.price.toString(),
        difficulty: course.difficulty,
        isFree: course.is_free,
        isPublished: course.is_published,
        thumbnailUrl: course.thumbnail_url || '',
        coverImageUrl: course.cover_image_url || '',
        whatYouLearn: course.what_you_learn || ['', '', '', '']
      })

      // Cargar lecciones con recursos
      const courseLessons = await getCourseLessons(cursoId)
      console.log('🔍 DEBUG - Lecciones cargadas desde BD:', courseLessons)
      console.log('🔍 DEBUG - Primera lección module_id:', courseLessons[0]?.module_id)
      
      const lessonsWithResources = await Promise.all(
        courseLessons.map(async (lesson) => {
          const resources = await getLessonResources(lesson.id)
          return {
            ...lesson,
            resources,
            isExpanded: false,
            videoUrl: lesson.video_url || '',
            videoProvider: lesson.video_provider || '',
            audioUrl: lesson.audio_url || '',
            audioProvider: lesson.audio_provider || '',
            isFreePreview: lesson.is_free_preview || false
          } as LessonWithResources
        })
      )

      console.log('🔍 DEBUG - Lecciones procesadas:', lessonsWithResources)
      console.log('🔍 DEBUG - Primera lección procesada module_id:', lessonsWithResources[0]?.module_id)
      
      setLessons(lessonsWithResources)

      // Cargar módulos
      const courseModules = await getCourseModules(cursoId)
      setModules(courseModules)
    } catch (error) {
      console.error('Error cargando curso:', error)
      setToast({ message: 'Error al cargar el curso', type: 'error' })
      router.push('/administrator')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleWhatYouLearnChange = (index: number, value: string) => {
    const newArray = [...formData.whatYouLearn]
    newArray[index] = value
    setFormData(prev => ({ ...prev, whatYouLearn: newArray }))
  }

  const addWhatYouLearnPoint = () => {
    setFormData(prev => ({
      ...prev,
      whatYouLearn: [...prev.whatYouLearn, '']
    }))
  }

  const removeWhatYouLearnPoint = (index: number) => {
    if (formData.whatYouLearn.length <= 1) {
      setToast({ message: 'Debe haber al menos un punto en "Qué aprenderás"', type: 'error' })
      return
    }
    const newArray = formData.whatYouLearn.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, whatYouLearn: newArray }))
  }

  const handleCoverImageUpload = async (file: File) => {
    try {
      setToast({ message: 'Subiendo imagen...', type: 'info' })
      
      const { url, error } = await uploadCourseCoverImage(file, cursoId)
      
      if (error || !url) {
        throw error || new Error('Error al subir la imagen')
      }
      
      setFormData(prev => ({ ...prev, coverImageUrl: url }))
      setToast({ message: 'Imagen de portada subida exitosamente', type: 'success' })
    } catch (error) {
      console.error('Error subiendo imagen de portada:', error)
      setToast({ message: 'Error al subir la imagen. Inténtalo de nuevo.', type: 'error' })
      throw error
    }
  }

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      setToast({ message: 'Por favor, introduce primero el título del curso', type: 'error' })
      return
    }

    setGeneratingDescription(true)
    try {
      // Obtener el token de sesión para autenticación
      const supabase = (await import('@/lib/supabase/client')).supabase
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setToast({ message: 'Sesión expirada. Por favor, inicia sesión de nuevo.', type: 'error' })
        return
      }

      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title: formData.title,
          whatYouLearn: formData.whatYouLearn.filter(item => item.trim() !== '')
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al generar la descripción')
      }

      const data = await response.json()
      if (data.description) {
        // Convertir saltos de línea en párrafos HTML
        const htmlDescription = data.description
          .split('\n\n')
          .filter((p: string) => p.trim())
          .map((p: string) => `<p>${p.trim()}</p>`)
          .join('\n')
        
        handleInputChange('shortDescription', htmlDescription)
        setToast({ message: 'Descripción generada exitosamente', type: 'success' })
      }
    } catch (error) {
      console.error('Error generando descripción:', error)
      setToast({ message: error instanceof Error ? error.message : 'Error al generar la descripción. Por favor, inténtalo de nuevo.', type: 'error' })
    } finally {
      setGeneratingDescription(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (lessons.length === 0) {
      setToast({ message: 'Debes tener al menos una lección en el curso', type: 'error' })
      return
    }

    // Advertencia si hay lecciones sin asignar cuando existen módulos
    const unassignedCount = modules.length > 0 ? lessons.filter(l => !l.module_id).length : 0
    if (unassignedCount > 0) {
      const confirmSave = window.confirm(
        `⚠️ ADVERTENCIA:\n\nHay ${unassignedCount} ${unassignedCount === 1 ? 'lección sin asignar' : 'lecciones sin asignar'} a ningún módulo.\n\nEstas lecciones NO se mostrarán en el curso hasta que las asignes a un módulo.\n\n¿Deseas guardar de todas formas?`
      )
      if (!confirmSave) {
        setActiveTab('lessons') // Cambiar a la pestaña de lecciones para que las revise
        return
      }
    }

    setSaving(true)

    try {
      // 1. Actualizar el curso
      const courseData = {
        title: formData.title,
        slug: formData.slug,
        short_description: formData.shortDescription,
        description: formData.description,
        icon: formData.icon,
        price: parseFloat(formData.price),
        difficulty: formData.difficulty as 'basico' | 'intermedio' | 'avanzado',
        what_you_learn: formData.whatYouLearn.filter(item => item.trim() !== '') || [],
        is_free: formData.isFree,
        is_published: formData.isPublished,
        thumbnail_url: formData.thumbnailUrl || null,
        cover_image_url: formData.coverImageUrl || null,
      }

      await updateCourse(cursoId, courseData)

      // 2. Actualizar/crear/eliminar lecciones
      const existingLessonIds = lessons.filter(l => l.id && !l.id.startsWith('lesson-')).map(l => l.id)
      const newLessons = lessons.filter(l => l.id.startsWith('lesson-'))
      const updatedLessons = lessons.filter(l => l.id && !l.id.startsWith('lesson-'))

      // Actualizar lecciones existentes
      for (let i = 0; i < updatedLessons.length; i++) {
        const lesson = updatedLessons[i]
        const lessonIndexInOriginalArray = lessons.findIndex(l => l.id === lesson.id)
        
        await updateLesson(lesson.id, {
          title: lesson.title,
          slug: lesson.title
            .toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
          content: lesson.content,
          order_index: lessonIndexInOriginalArray,
          duration_minutes: lesson.duration_minutes,
          module_id: lesson.module_id || null,
          video_url: lesson.videoUrl || null,
          video_provider: lesson.videoUrl ? (lesson.videoProvider as any) : null,
          audio_url: lesson.audioUrl || null,
          audio_provider: lesson.audioUrl ? (lesson.audioProvider as any) : null,
          is_free_preview: lesson.isFreePreview,
        })

        // Gestionar recursos de la lección
        const existingResourceIds = lesson.resources.filter(r => r.id && !r.id.startsWith('resource-')).map(r => r.id)
        const newResources = lesson.resources.filter(r => r.id.startsWith('resource-'))
        const updatedResources = lesson.resources.filter(r => r.id && !r.id.startsWith('resource-'))

        // Eliminar recursos que ya no existen
        const allCurrentResourceIds = lesson.resources.map(r => r.id)
        // TODO: Implementar eliminación de recursos si es necesario

        // Crear nuevos recursos
        if (newResources.length > 0) {
          const resourcesToCreate = newResources.map((resource, index) => ({
            lesson_id: lesson.id,
            title: resource.title,
            description: null,
            file_type: resource.file_type,
            file_url: resource.file_url,
            file_size: resource.file_size || null,
            order_index: updatedResources.length + index,
          }))
          await bulkCreateResources(resourcesToCreate)
        }
      }

      // Crear nuevas lecciones
      if (newLessons.length > 0) {
        const lessonsToCreate = newLessons.map((lesson, index) => ({
          course_id: cursoId,
          title: lesson.title,
          slug: lesson.title
            .toLowerCase()
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
          content: lesson.content,
          order_index: updatedLessons.length + index,
          duration_minutes: lesson.duration_minutes,
          module_id: lesson.module_id || null,
          video_url: lesson.videoUrl || null,
          video_provider: lesson.videoUrl ? (lesson.videoProvider as any) : null,
          audio_url: lesson.audioUrl || null,
          audio_provider: lesson.audioUrl ? (lesson.audioProvider as any) : null,
          is_free_preview: lesson.isFreePreview,
        }))

        const createdLessons = await bulkCreateLessons(lessonsToCreate)

        // Crear recursos para las nuevas lecciones
        const allNewResources = newLessons.flatMap((lesson, lessonIndex) => 
          lesson.resources.map((resource, resourceIndex) => ({
            lesson_id: createdLessons[lessonIndex].id,
            title: resource.title,
            description: null,
            file_type: resource.file_type,
            file_url: resource.file_url,
            file_size: resource.file_size || null,
            order_index: resourceIndex,
          }))
        )

        if (allNewResources.length > 0) {
          await bulkCreateResources(allNewResources)
        }
      }

      setToast({ message: 'Curso actualizado exitosamente!', type: 'success' })
      setTimeout(() => router.push('/administrator'), 1500)

    } catch (error) {
      console.error('Error al guardar curso:', error)
      setToast({ message: 'Error al guardar el curso. Verifica la consola para más detalles.', type: 'error' })
      setSaving(false)
    }
  }

  const difficultyOptions = [
    { value: 'basico', label: 'Básico' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' }
  ]

  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration_minutes, 0)
  const unassignedLessons = modules.length > 0 
    ? lessons.filter(l => !l.module_id).length 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando curso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link
              href="/administrator"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Contenido Principal */}
              <div className="lg:col-span-3 space-y-6">
                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="flex border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveTab('info')}
                      className={`flex-1 py-4 px-6 font-semibold transition ${
                        activeTab === 'info'
                          ? 'bg-forest/10 text-forest border-b-2 border-forest'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      1. Información del Curso
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('modules')}
                      className={`flex-1 py-4 px-6 font-semibold transition ${
                        activeTab === 'modules'
                          ? 'bg-forest/10 text-forest border-b-2 border-forest'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      2. Módulos ({modules.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('lessons')}
                      className={`flex-1 py-4 px-6 font-semibold transition ${
                        activeTab === 'lessons'
                          ? 'bg-forest/10 text-forest border-b-2 border-forest'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      3. Lecciones ({lessons.length})
                    </button>
                  </div>

                  <div className="p-8">
                    {activeTab === 'info' && (
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Imagen de Portada
                          </label>
                          <ImageUpload
                            onUpload={handleCoverImageUpload}
                            currentImage={formData.coverImageUrl}
                            label="Imagen de portada del curso"
                            maxSize={5}
                            compress={true}
                          />
                          <p className="mt-2 text-xs text-gray-500">
                            Esta imagen se mostrará como portada del curso en la lista de cursos. Recomendado: 1200x675px (16:9)
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Título del Curso *
                          </label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="Ej: Cómo Enseñar a tu Perro a Sentarse"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Slug (URL)
                          </label>
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => handleInputChange('slug', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                            required
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-semibold text-gray-700">
                              Descripción Corta *
                            </label>
                            <button
                              type="button"
                              onClick={handleGenerateDescription}
                              disabled={generatingDescription || !formData.title.trim()}
                              className="text-xs bg-gradient-to-r from-forest to-sage text-white font-semibold py-1.5 px-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              <Sparkles className="w-3 h-3 mr-1.5" />
                              {generatingDescription ? 'Generando...' : 'Generar con IA'}
                            </button>
                          </div>
                          <TinyMCEEditor
                            value={formData.shortDescription}
                            onChange={(content) => handleInputChange('shortDescription', content)}
                            height={200}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700">
                              Qué aprenderás ({formData.whatYouLearn.length} {formData.whatYouLearn.length === 1 ? 'punto' : 'puntos'})
                            </label>
                            <button
                              type="button"
                              onClick={addWhatYouLearnPoint}
                              className="text-sm bg-forest/10 text-forest font-semibold px-3 py-1.5 rounded-lg hover:bg-forest/20 transition flex items-center"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Añadir punto
                            </button>
                          </div>
                          <div className="space-y-3">
                            {formData.whatYouLearn.map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleWhatYouLearnChange(index, e.target.value)}
                                  placeholder={`Punto ${index + 1}`}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => removeWhatYouLearnPoint(index)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                  title="Eliminar punto"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                          <button
                            type="button"
                            onClick={() => setActiveTab('modules')}
                            className="bg-gradient-to-r from-forest to-sage text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
                          >
                            Continuar a Módulos →
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'lessons' && (
                      <LessonsManager 
                        lessons={lessons.map(l => {
                          const mappedLesson = {
                            id: l.id,
                            title: l.title,
                            content: l.content || '',
                            duration: l.duration_minutes,
                            videoUrl: l.videoUrl || '',
                            videoProvider: l.videoProvider || '',
                            audioUrl: l.audioUrl || '',
                            audioProvider: l.audioProvider || '',
                            isFreePreview: l.isFreePreview || false,
                            module_id: l.module_id || null,
                            resources: l.resources.map(r => ({
                              id: r.id,
                              title: r.title,
                              fileType: r.file_type,
                              fileUrl: r.file_url,
                              fileSize: r.file_size || 0
                            })),
                            isExpanded: l.isExpanded || false
                          }
                          console.log('🎯 DEBUG - Lección mapeada para LessonsManager:', l.title, 'module_id:', l.module_id, 'mapeado:', mappedLesson.module_id)
                          return mappedLesson
                        })}
                        modules={modules}
                        onChange={(updatedLessons) => {
                          setLessons(updatedLessons.map((ul, index) => {
                            const existingLesson = lessons.find(el => el.id === ul.id) || lessons[index]
                            return {
                              id: existingLesson?.id || ul.id,
                              course_id: existingLesson?.course_id || cursoId,
                              module_id: ul.module_id || null,
                              title: ul.title,
                              slug: existingLesson?.slug || '',
                              content: ul.content,
                              order_index: index,
                              duration_minutes: ul.duration,
                              video_url: ul.videoUrl || null,
                              video_provider: ul.videoUrl ? (ul.videoProvider as any) : null,
                              audio_url: ul.audioUrl || null,
                              audio_provider: ul.audioUrl ? (ul.audioProvider as any) : null,
                              is_free_preview: ul.isFreePreview,
                              created_at: existingLesson?.created_at || new Date().toISOString(),
                              updated_at: new Date().toISOString(),
                              resources: ul.resources.map((r, rIndex) => {
                                const existingResource = existingLesson?.resources.find(er => er.id === r.id)
                                return {
                                  id: existingResource?.id || r.id,
                                  lesson_id: existingLesson?.id || '',
                                  title: r.title,
                                  description: existingResource?.description || null,
                                  file_type: r.fileType,
                                  file_url: r.fileUrl,
                                  file_size: r.fileSize || null,
                                  order_index: rIndex,
                                  created_at: existingResource?.created_at || new Date().toISOString()
                                } as Resource
                              }),
                              isExpanded: ul.isExpanded,
                              videoUrl: ul.videoUrl,
                              videoProvider: ul.videoProvider,
                              isFreePreview: ul.isFreePreview
                            } as LessonWithResources
                          }))
                        }} 
                      />
                    )}

                    {activeTab === 'modules' && (
                      <ModulesManager
                        courseId={cursoId}
                        modules={modules}
                        lessons={lessons}
                        onModulesChange={setModules}
                        onLessonsChange={(updatedLessons) => {
                          // Convertir Lesson[] a LessonWithResources[] manteniendo propiedades extra
                          const updated = updatedLessons.map(lesson => {
                            const existing = lessons.find(l => l.id === lesson.id)
                            return {
                              ...lesson,
                              resources: existing?.resources || [],
                              isExpanded: existing?.isExpanded || false,
                              videoUrl: lesson.video_url || '',
                              videoProvider: lesson.video_provider || '',
                              audioUrl: lesson.audio_url || '',
                              audioProvider: lesson.audio_provider || '',
                              isFreePreview: lesson.is_free_preview || false
                            } as LessonWithResources
                          })
                          setLessons(updated)
                        }}
                        onCreateModule={async (title, description) => {
                          const newModule = await createModule({
                            course_id: cursoId,
                            title,
                            description,
                            order_index: modules.length + 1
                          })
                          if (newModule) {
                            setModules([...modules, newModule])
                            setToast({ message: 'Módulo creado exitosamente', type: 'success' })
                          } else {
                            setToast({ message: 'Error al crear módulo', type: 'error' })
                          }
                        }}
                        onUpdateModule={async (moduleId, title, description) => {
                          const success = await updateModule(moduleId, { title, description })
                          if (success) {
                            setModules(modules.map(m => 
                              m.id === moduleId ? { ...m, title, description } : m
                            ))
                            setToast({ message: 'Módulo actualizado exitosamente', type: 'success' })
                          } else {
                            setToast({ message: 'Error al actualizar módulo', type: 'error' })
                          }
                        }}
                        onDeleteModule={async (moduleId) => {
                          const success = await deleteModule(moduleId)
                          if (success) {
                            setModules(modules.filter(m => m.id !== moduleId))
                            // Recargar lecciones para actualizar el module_id = null
                            await loadCourseData()
                            setToast({ message: 'Módulo eliminado exitosamente', type: 'success' })
                          } else {
                            setToast({ message: 'Error al eliminar módulo', type: 'error' })
                          }
                        }}
                        onAssignLesson={async (lessonId, moduleId) => {
                          const success = await assignLessonToModule(lessonId, moduleId)
                          if (success) {
                            setLessons(lessons.map(l =>
                              l.id === lessonId ? { ...l, module_id: moduleId } : l
                            ))
                            setToast({ message: 'Lección asignada exitosamente', type: 'success' })
                          } else {
                            setToast({ message: 'Error al asignar lección', type: 'error' })
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Configuración</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Precio (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.isFree ? '0' : formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          disabled={formData.isFree}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                            formData.isFree ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                          }`}
                        />
                        {formData.isFree && (
                          <p className="text-xs text-gray-500 mt-1">
                            El curso gratuito no tiene precio
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Dificultad
                        </label>
                        <select
                          value={formData.difficulty}
                          onChange={(e) => handleInputChange('difficulty', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          {difficultyOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isFree}
                            onChange={(e) => handleInputChange('isFree', e.target.checked)}
                            className="w-4 h-4 text-forest border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Gratuito</span>
                        </label>

                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isPublished}
                            onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                            className="w-4 h-4 text-forest border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Publicar</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">Resumen</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lecciones:</span>
                        <span className="font-semibold">{lessons.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duración total:</span>
                        <span className="font-semibold">{totalDuration} min</span>
                      </div>
                      {unassignedLessons > 0 && (
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-amber-600 font-medium">⚠️ Sin módulo:</span>
                          <span className="font-semibold text-amber-600">{unassignedLessons}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving || lessons.length === 0}
                    className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>

                  {lessons.length === 0 && (
                    <p className="text-xs text-red-600 text-center">
                      Añade al menos una lección
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
