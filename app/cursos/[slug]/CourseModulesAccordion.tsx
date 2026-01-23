'use client'

import { useState } from 'react'
import { ChevronRight, Clock } from 'lucide-react'
import type { CourseModule, Lesson } from '@/lib/supabase/courses'

interface Props {
  modules: CourseModule[]
  moduleLessons: Record<string, Lesson[]>
}

export default function CourseModulesAccordion({ modules, moduleLessons }: Props) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  return (
    <>
      {modules.map((courseModule, moduleIdx) => {
        const isExpanded = expandedModules.has(courseModule.id)
        const lessons = moduleLessons[courseModule.id] || []
        const totalDuration = lessons.reduce((sum, l) => sum + l.duration_minutes, 0)
        
        return (
          <div key={courseModule.id} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleModule(courseModule.id)}
              className="w-full bg-gradient-to-r from-forest/5 to-sage/5 hover:from-forest/10 hover:to-sage/10 p-4 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-forest text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {moduleIdx + 1}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900">{courseModule.title}</h3>
                  <p className="text-sm text-gray-600">
                    {lessons.length} lección{lessons.length !== 1 ? 'es' : ''}
                    {totalDuration > 0 && ` • ${totalDuration} min`}
                  </p>
                </div>
              </div>
              <ChevronRight 
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>

            {isExpanded && (
              <div className="bg-white divide-y divide-gray-100">
                {lessons.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No hay lecciones en este módulo
                  </div>
                ) : (
                  lessons.map((lesson, lessonIdx) => (
                    <div
                      key={lesson.id}
                      className="flex items-start p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-semibold text-gray-600">{lessonIdx + 1}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                        {lesson.duration_minutes > 0 && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
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
        )
      })}
    </>
  )
}
