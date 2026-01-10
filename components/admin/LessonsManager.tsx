'use client'

import { useState } from 'react'
import { Plus, GripVertical, Trash2, Video, Headphones, FileText, ChevronDown, ChevronUp } from 'lucide-react'
import dynamic from 'next/dynamic'

const TinyMCEEditor = dynamic(() => import('@/components/admin/TinyMCEEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-100 rounded-lg animate-pulse" />
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
  resources: Resource[]
  isExpanded: boolean
}

interface Resource {
  id: string
  title: string
  fileType: string
  fileUrl: string
  fileSize: number
}

interface LessonsManagerProps {
  lessons: Lesson[]
  onChange: (lessons: Lesson[]) => void
}

export default function LessonsManager({ lessons, onChange }: LessonsManagerProps) {
  const addLesson = () => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: `Lección ${lessons.length + 1}`,
      content: '',
      duration: 5,
      videoUrl: '',
      videoProvider: '',
      audioUrl: '',
      audioProvider: '',
      isFreePreview: false,
      resources: [],
      isExpanded: true
    }
    
    onChange([...lessons, newLesson])
  }

  const updateLesson = (index: number, field: keyof Lesson, value: any) => {
    const updated = [...lessons]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const deleteLesson = (index: number) => {
    if (confirm('¿Estás seguro de eliminar esta lección?')) {
      onChange(lessons.filter((_, i) => i !== index))
    }
  }

  const toggleExpand = (index: number) => {
    const updated = [...lessons]
    updated[index].isExpanded = !updated[index].isExpanded
    onChange(updated)
  }

  const moveLesson = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= lessons.length) return

    const updated = [...lessons]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    onChange(updated)
  }

  const addResource = (lessonIndex: number) => {
    const newResource: Resource = {
      id: `resource-${Date.now()}`,
      title: 'Nuevo recurso',
      fileType: 'pdf',
      fileUrl: '',
      fileSize: 0
    }
    
    const updated = [...lessons]
    updated[lessonIndex].resources = [...updated[lessonIndex].resources, newResource]
    onChange(updated)
  }

  const updateResource = (lessonIndex: number, resourceIndex: number, field: keyof Resource, value: any) => {
    const updated = [...lessons]
    updated[lessonIndex].resources[resourceIndex] = {
      ...updated[lessonIndex].resources[resourceIndex],
      [field]: value
    }
    onChange(updated)
  }

  const deleteResource = (lessonIndex: number, resourceIndex: number) => {
    const updated = [...lessons]
    updated[lessonIndex].resources = updated[lessonIndex].resources.filter((_, i) => i !== resourceIndex)
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Lecciones del Curso ({lessons.length})
        </h3>
        <button
          type="button"
          onClick={addLesson}
          className="bg-gradient-to-r from-forest to-sage text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-all flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Añadir Lección
        </button>
      </div>

      {lessons.length === 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No hay lecciones creadas aún</p>
          <button
            type="button"
            onClick={addLesson}
            className="text-forest font-semibold hover:text-forest-dark"
          >
            Crear primera lección →
          </button>
        </div>
      )}

      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Lesson Header */}
            <div className="bg-gray-50 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200">
              <div className="flex items-center flex-1 min-w-0">
                <GripVertical className="w-5 h-5 text-gray-400 mr-2 sm:mr-3 cursor-move flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={lesson.title}
                    onChange={(e) => updateLesson(index, 'title', e.target.value)}
                    className="w-full text-sm sm:text-base font-semibold text-gray-900 bg-white border border-gray-200 rounded px-2 sm:px-3 py-1.5 focus:ring-2 focus:ring-forest focus:border-transparent"
                    placeholder="Título de la lección"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{lesson.duration} min</span>
                {lesson.isFreePreview && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap">
                    Vista previa
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => moveLesson(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                  title="Subir"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveLesson(index, 'down')}
                  disabled={index === lessons.length - 1}
                  className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                  title="Bajar"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => toggleExpand(index)}
                  className="p-1 text-gray-600 hover:text-gray-900"
                  title={lesson.isExpanded ? 'Contraer' : 'Expandir'}
                >
                  {lesson.isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => deleteLesson(index)}
                  className="p-1 text-red-600 hover:text-red-700"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lesson Content (expandible) */}
            {lesson.isExpanded && (
              <div className="p-4 sm:p-6 space-y-6">
                {/* Configuración básica */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duración (minutos)
                    </label>
                    <input
                      type="number"
                      value={lesson.duration}
                      onChange={(e) => updateLesson(index, 'duration', parseInt(e.target.value))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2 mt-6 sm:mt-8">
                      <input
                        type="checkbox"
                        checked={lesson.isFreePreview}
                        onChange={(e) => updateLesson(index, 'isFreePreview', e.target.checked)}
                        className="w-4 h-4 text-forest border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">Vista previa gratuita</span>
                    </label>
                  </div>
                </div>

                {/* Video */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Video className="w-4 h-4 mr-2" />
                    Video de la lección (opcional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <select
                      value={lesson.videoProvider || ''}
                      onChange={(e) => updateLesson(index, 'videoProvider', e.target.value)}
                      className="px-3 py-2.5 border border-gray-300 rounded-lg text-base"
                    >
                      <option value="">Sin video</option>
                      <option value="youtube">YouTube</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="self-hosted">Self-hosted</option>
                    </select>
                    <input
                      type="text"
                      value={lesson.videoUrl}
                      onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                      placeholder="URL del video"
                      disabled={!lesson.videoProvider}
                      className="sm:col-span-3 px-3 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                    />
                  </div>
                </div>

                {/* Audio */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Headphones className="w-4 h-4 mr-2" />
                    Audio de la lección (opcional)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <select
                      value={lesson.audioProvider || ''}
                      onChange={(e) => updateLesson(index, 'audioProvider', e.target.value)}
                      className="px-3 py-2.5 border border-gray-300 rounded-lg text-base"
                    >
                      <option value="">Sin audio</option>
                      <option value="self-hosted">Self-hosted</option>
                      <option value="soundcloud">Soundcloud</option>
                      <option value="spotify">Spotify</option>
                    </select>
                    <input
                      type="text"
                      value={lesson.audioUrl || ''}
                      onChange={(e) => updateLesson(index, 'audioUrl', e.target.value)}
                      placeholder="URL del audio"
                      disabled={!lesson.audioProvider}
                      className="sm:col-span-3 px-3 py-2.5 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed text-base"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Self-hosted: MP3, WAV, OGG. Soundcloud/Spotify: URL del embed.
                  </p>
                </div>

                {/* Contenido */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contenido de la lección
                  </label>
                  <TinyMCEEditor
                    value={lesson.content}
                    onChange={(content) => updateLesson(index, 'content', content)}
                    height={300}
                  />
                </div>

                {/* Recursos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Recursos descargables
                    </label>
                    <button
                      type="button"
                      onClick={() => addResource(index)}
                      className="text-sm text-forest hover:text-forest-dark font-semibold flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Añadir recurso
                    </button>
                  </div>
                  
                  {lesson.resources.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No hay recursos añadidos</p>
                  ) : (
                    <div className="space-y-2">
                      {lesson.resources.map((resource, rIndex) => (
                        <div key={resource.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-gray-50 p-3 rounded-lg">
                          <select
                            value={resource.fileType}
                            onChange={(e) => updateResource(index, rIndex, 'fileType', e.target.value)}
                            className="w-full sm:w-auto px-2 py-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="pdf">PDF</option>
                            <option value="doc">DOC</option>
                            <option value="image">Imagen</option>
                            <option value="zip">ZIP</option>
                          </select>
                          <input
                            type="text"
                            value={resource.title}
                            onChange={(e) => updateResource(index, rIndex, 'title', e.target.value)}
                            placeholder="Nombre del recurso"
                            className="flex-1 w-full px-2 py-2 border border-gray-300 rounded text-sm"
                          />
                          <input
                            type="text"
                            value={resource.fileUrl}
                            onChange={(e) => updateResource(index, rIndex, 'fileUrl', e.target.value)}
                            placeholder="URL del archivo"
                            className="flex-1 w-full px-2 py-2 border border-gray-300 rounded text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => deleteResource(index, rIndex)}
                            className="p-2 text-red-600 hover:text-red-700 self-end sm:self-auto"
                            title="Eliminar recurso"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
