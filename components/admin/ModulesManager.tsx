'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, GripVertical, ChevronDown, ChevronUp, Save, X } from 'lucide-react'
import type { CourseModule, Lesson } from '@/lib/supabase/courses'

interface ModulesManagerProps {
  courseId: string
  modules: CourseModule[]
  lessons: Lesson[]
  onModulesChange: (modules: CourseModule[]) => void
  onLessonsChange: (lessons: Lesson[]) => void
  onCreateModule: (title: string, description: string) => Promise<void>
  onUpdateModule: (moduleId: string, title: string, description: string) => Promise<void>
  onDeleteModule: (moduleId: string) => Promise<void>
  onAssignLesson: (lessonId: string, moduleId: string | null) => Promise<void>
}

export default function ModulesManager({
  courseId,
  modules,
  lessons,
  onModulesChange,
  onLessonsChange,
  onCreateModule,
  onUpdateModule,
  onDeleteModule,
  onAssignLesson
}: ModulesManagerProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', description: '' })
  const [isCreating, setIsCreating] = useState(false)
  const [newModuleForm, setNewModuleForm] = useState({ title: '', description: '' })

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }))
  }

  const startEdit = (module: CourseModule) => {
    setEditingModule(module.id)
    setEditForm({
      title: module.title,
      description: module.description || ''
    })
  }

  const cancelEdit = () => {
    setEditingModule(null)
    setEditForm({ title: '', description: '' })
  }

  const saveEdit = async (moduleId: string) => {
    await onUpdateModule(moduleId, editForm.title, editForm.description)
    setEditingModule(null)
  }

  const handleDelete = async (moduleId: string) => {
    if (confirm('¿Eliminar este módulo? Las lecciones NO se eliminarán, solo quedarán sin módulo.')) {
      await onDeleteModule(moduleId)
    }
  }

  const handleCreateModule = async () => {
    if (newModuleForm.title.trim()) {
      await onCreateModule(newModuleForm.title, newModuleForm.description)
      setNewModuleForm({ title: '', description: '' })
      setIsCreating(false)
    }
  }

  const handleAssignLesson = async (lessonId: string, moduleId: string | null) => {
    await onAssignLesson(lessonId, moduleId)
  }

  const getLessonsForModule = (moduleId: string) => {
    return lessons.filter(l => l.module_id === moduleId)
  }

  const getUnassignedLessons = () => {
    return lessons.filter(l => !l.module_id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Módulos del Curso</h3>
          <p className="text-sm text-gray-600 mt-1">
            Organiza las lecciones en módulos temáticos
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest/90 transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo Módulo
          </button>
        )}
      </div>

      {/* Crear Nuevo Módulo */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-br from-forest/5 to-sage/5 border-2 border-forest/20 rounded-xl p-6"
          >
            <h4 className="font-bold text-gray-900 mb-4">Crear Nuevo Módulo</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título del Módulo *
                </label>
                <input
                  type="text"
                  value={newModuleForm.title}
                  onChange={(e) => setNewModuleForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ej: Introducción al Entrenamiento"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newModuleForm.description}
                  onChange={(e) => setNewModuleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descripción breve del módulo"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateModule}
                  disabled={!newModuleForm.title.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Crear Módulo
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false)
                    setNewModuleForm({ title: '', description: '' })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Módulos */}
      {modules.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-600 font-semibold mb-2">Sin módulos configurados</p>
          <p className="text-sm text-gray-500">
            Este curso usa la estructura simple (lecciones sin módulos)
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {modules.map((module, index) => {
            const isExpanded = expandedModules[module.id]
            const isEditing = editingModule === module.id
            const moduleLessons = getLessonsForModule(module.id)

            return (
              <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header del Módulo */}
                <div className="bg-gray-50 p-4">
                  {isEditing ? (
                    /* Modo Edición */
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción del módulo"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(module.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-forest text-white rounded-lg hover:bg-forest/90 transition text-sm"
                        >
                          <Save className="w-4 h-4" />
                          Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Modo Vista */
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-forest uppercase">
                                Módulo {module.order_index}
                              </span>
                              <span className="text-xs text-gray-500">
                                {moduleLessons.length} lecciones
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900">{module.title}</h4>
                            {module.description && (
                              <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(module)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                          title="Editar módulo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(module.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar módulo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Lecciones del Módulo */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t border-gray-200 bg-white overflow-hidden"
                    >
                      {moduleLessons.length === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          Sin lecciones asignadas a este módulo
                        </div>
                      ) : (
                        <div className="p-4 space-y-2">
                          {moduleLessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <span className="text-xs font-semibold text-gray-500">
                                {lessonIndex + 1}
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {lesson.duration_minutes} min
                                </p>
                              </div>
                              <button
                                onClick={() => handleAssignLesson(lesson.id, null)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                Quitar del módulo
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      )}

      {/* Lecciones Sin Asignar */}
      {getUnassignedLessons().length > 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-amber-50/50">
          <h4 className="font-bold text-gray-900 mb-4">
            Lecciones Sin Módulo ({getUnassignedLessons().length})
          </h4>
          <div className="space-y-2">
            {getUnassignedLessons().map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200"
              >
                <span className="text-xs font-semibold text-gray-500">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">
                    {lesson.title}
                  </p>
                </div>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAssignLesson(lesson.id, e.target.value)
                    }
                  }}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
                  defaultValue=""
                >
                  <option value="">Asignar a módulo...</option>
                  {modules.map(module => (
                    <option key={module.id} value={module.id}>
                      Módulo {module.order_index}: {module.title}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Los módulos ayudan a organizar cursos con muchas lecciones. 
          Si tu curso tiene pocas lecciones (&lt; 10), no necesitas usar módulos.
        </p>
      </div>
    </div>
  )
}
