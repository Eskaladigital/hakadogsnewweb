'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft, Save, Sparkles, Plus, X } from 'lucide-react'
import Toast from '@/components/ui/Toast'

const LessonsManager = dynamic(() => import('@/components/admin/LessonsManager'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
    <p className="text-gray-500">Cargando gestor de lecciones...</p>
  </div>
})

interface Lesson {
  id: string
  title: string
  content: string
  duration: number
  videoUrl: string
  videoProvider: string
  audioUrl: string
  audioProvider: string
  isFreePreview: boolean
  resources: any[]
  isExpanded: boolean
}

export default function NuevoCursoPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'lessons'>('info')
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
    whatYouLearn: ['', '', '', '']
  })

  const [lessons, setLessons] = useState<Lesson[]>([])

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

  const handleGenerateDescription = async () => {
    if (!formData.title.trim()) {
      setToast({ message: 'Por favor, introduce primero el título del curso', type: 'error' })
      return
    }

    setGeneratingDescription(true)
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          whatYouLearn: formData.whatYouLearn.filter(item => item.trim() !== '')
        })
      })

      if (!response.ok) {
        throw new Error('Error al generar la descripción')
      }

      const data = await response.json()
      if (data.description) {
        handleInputChange('shortDescription', data.description)
      }
    } catch (error) {
      console.error('Error generando descripción:', error)
      setToast({ message: 'Error al generar la descripción. Por favor, inténtalo de nuevo.', type: 'error' })
    } finally {
      setGeneratingDescription(false)
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (lessons.length === 0) {
      setToast({ message: 'Debes añadir al menos una lección al curso', type: 'error' })
      return
    }

    setSaving(true)

    try {
      // 1. Crear el curso
      const { createCourse, bulkCreateLessons, bulkCreateResources } = await import('@/lib/supabase/courses')
      
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
      }

      const newCourse = await createCourse(courseData)

      // 2. Crear todas las lecciones
      const lessonsData = lessons.map((lesson, index) => ({
        course_id: newCourse.id,
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
        order_index: index,
        duration_minutes: lesson.duration,
        video_url: lesson.videoUrl || null,
        video_provider: lesson.videoUrl ? (lesson.videoProvider as any) : null,
        audio_url: lesson.audioUrl || null,
        audio_provider: lesson.audioUrl ? (lesson.audioProvider as any) : null,
        is_free_preview: lesson.isFreePreview,
      }))

      const createdLessons = await bulkCreateLessons(lessonsData)

      // 3. Crear todos los recursos
      const allResources = lessons.flatMap((lesson, lessonIndex) => 
        lesson.resources.map((resource, resourceIndex) => ({
          lesson_id: createdLessons[lessonIndex].id,
          title: resource.title,
          description: null,
          file_type: resource.fileType,
          file_url: resource.fileUrl,
          file_size: resource.fileSize || null,
          order_index: resourceIndex,
        }))
      )

      if (allResources.length > 0) {
        await bulkCreateResources(allResources)
      }

      setToast({ message: 'Curso creado exitosamente!', type: 'success' })
      setTimeout(() => router.push('/administrator'), 1500)
      
    } catch (error) {
      console.error('Error al guardar curso:', error)
      setToast({ message: 'Error al guardar el curso. Verifica la consola para más detalles.', type: 'error' })
      setSaving(false)
    }
  }

  const iconOptions = ['🎓', '🎯', '📢', '🚶', '🦷', '🦘', '🚽', '✋', '🔊', '🍽️', '🐕', '📚', '🏆', '💡']
  const difficultyOptions = [
    { value: 'basico', label: 'Básico' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' }
  ]

  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0)

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
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Curso</h1>
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
                      onClick={() => setActiveTab('lessons')}
                      className={`flex-1 py-4 px-6 font-semibold transition ${
                        activeTab === 'lessons'
                          ? 'bg-forest/10 text-forest border-b-2 border-forest'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      2. Lecciones ({lessons.length})
                    </button>
                  </div>

                  <div className="p-8">
                    {activeTab === 'info' ? (
                      <div className="space-y-6">
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
                          <textarea
                            value={formData.shortDescription}
                            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest"
                            required
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
                              className="text-xs bg-forest text-white font-semibold py-1.5 px-3 rounded-lg hover:opacity-90 transition-all flex items-center"
                            >
                              <Plus className="w-3 h-3 mr-1.5" />
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
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                  required
                                />
                                {formData.whatYouLearn.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeWhatYouLearnPoint(index)}
                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                    title="Eliminar punto"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t">
                          <button
                            type="button"
                            onClick={() => setActiveTab('lessons')}
                            className="bg-gradient-to-r from-forest to-sage text-white font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
                          >
                            Continuar a Lecciones →
                          </button>
                        </div>
                      </div>
                    ) : (
                      <LessonsManager lessons={lessons} onChange={setLessons} />
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
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving || lessons.length === 0}
                    className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? 'Guardando...' : 'Guardar Curso'}
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
