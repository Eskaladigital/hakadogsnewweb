'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, CheckCircle, Lock, Download, FileText, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface Leccion {
  id: string
  title: string
  duration: string
  isCompleted: boolean
  isLocked: boolean
}

export default function CursoDetailPage({ params }: { params: { cursoId: string } }) {
  const { cursoId } = params

  // Mock data - esto vendrá de Supabase
  const curso = {
    id: cursoId,
    title: 'Cómo Enseñar a tu Perro a Sentarse',
    description: 'Aprende el comando más básico y fundamental de la educación canina. Perfecto para empezar.',
    icon: '🎯',
    color: 'from-blue-500 to-blue-600',
    duration: '30 min',
    difficulty: 'Básico',
    progress: 50,
    lecciones: [
      { id: '1', title: 'Introducción: Por qué enseñar a sentarse', duration: '5 min', isCompleted: true, isLocked: false },
      { id: '2', title: 'Preparación: Materiales necesarios', duration: '3 min', isCompleted: true, isLocked: false },
      { id: '3', title: 'Técnica paso a paso', duration: '10 min', isCompleted: false, isLocked: false },
      { id: '4', title: 'Errores comunes y cómo evitarlos', duration: '7 min', isCompleted: false, isLocked: true },
      { id: '5', title: 'Práctica y refuerzo', duration: '5 min', isCompleted: false, isLocked: true }
    ]
  }

  const [leccionActual, setLeccionActual] = useState(curso.lecciones[2])
  const [showContent, setShowContent] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className={`bg-gradient-to-r ${curso.color} text-white py-8`}>
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/cursos/mi-escuela"
              className="inline-flex items-center text-white/80 hover:text-white transition mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Mi Escuela
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{curso.title}</h1>
                  <p className="text-white/90">{curso.description}</p>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {curso.duration}
                  </span>
                  <span>{curso.difficulty}</span>
                  <span>{curso.lecciones.filter(l => l.isCompleted).length}/{curso.lecciones.length} lecciones completadas</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Progreso del curso</span>
                <span className="font-bold">{curso.progress}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-500"
                  style={{ width: `${curso.progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Video/Content Area */}
                <div className="bg-gray-900 aspect-video flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-20 h-20 mx-auto mb-4 opacity-80" />
                    <p className="text-xl font-semibold mb-2">{leccionActual.title}</p>
                    <p className="text-white/60">Duración: {leccionActual.duration}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setShowContent(true)}
                      className={`flex-1 py-4 px-6 font-semibold transition ${
                        showContent 
                          ? 'border-b-2 border-blue-500 text-blue-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FileText className="w-5 h-5 inline mr-2" />
                      Contenido
                    </button>
                    <button
                      onClick={() => setShowContent(false)}
                      className={`flex-1 py-4 px-6 font-semibold transition ${
                        !showContent 
                          ? 'border-b-2 border-blue-500 text-blue-600' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Download className="w-5 h-5 inline mr-2" />
                      Recursos
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8">
                  {showContent ? (
                    <div className="prose max-w-none">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {leccionActual.title}
                      </h2>
                      <p className="text-gray-700 mb-6">
                        En esta lección aprenderás la técnica completa paso a paso para enseñar a tu perro el comando &quot;Sentado&quot;. 
                        Este es uno de los comandos más importantes y será la base para muchos otros comportamientos.
                      </p>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">Lo que aprenderás:</h3>
                      <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                        <li>La posición correcta para enseñar el comando</li>
                        <li>Cómo usar el premio de forma efectiva</li>
                        <li>Señales verbales y gestuales</li>
                        <li>Timing correcto del refuerzo</li>
                        <li>Cómo aumentar la dificultad progresivamente</li>
                      </ul>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">Paso a paso:</h3>
                      <div className="space-y-4 mb-6">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                          <h4 className="font-bold text-gray-900 mb-2">Paso 1: Preparación</h4>
                          <p className="text-gray-700">
                            Prepara premios pequeños y muy apetecibles. Busca un lugar tranquilo sin distracciones.
                          </p>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                          <h4 className="font-bold text-gray-900 mb-2">Paso 2: Captar la atención</h4>
                          <p className="text-gray-700">
                            Sostén el premio cerca de la nariz de tu perro para asegurarte de que lo ve y huele.
                          </p>
                        </div>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                          <h4 className="font-bold text-gray-900 mb-2">Paso 3: Guiar el movimiento</h4>
                          <p className="text-gray-700">
                            Mueve lentamente tu mano hacia arriba y ligeramente hacia atrás sobre la cabeza del perro.
                          </p>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                          <span className="text-2xl mr-2">💡</span>
                          Consejo profesional
                        </h4>
                        <p className="text-gray-700">
                          El timing es crucial. Debes dar el premio JUSTO cuando el trasero toca el suelo, 
                          no antes ni después. Esto ayuda al perro a asociar correctamente el comportamiento con la recompensa.
                        </p>
                      </div>

                      <button className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Marcar como Completada
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recursos Descargables</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                          <div className="flex items-center">
                            <FileText className="w-8 h-8 text-blue-600 mr-4" />
                            <div>
                              <h3 className="font-semibold text-gray-900">Guía PDF - Sentado</h3>
                              <p className="text-sm text-gray-600">Resumen completo de la técnica</p>
                            </div>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                          <div className="flex items-center">
                            <FileText className="w-8 h-8 text-blue-600 mr-4" />
                            <div>
                              <h3 className="font-semibold text-gray-900">Checklist de Progreso</h3>
                              <p className="text-sm text-gray-600">Marca tu avance día a día</p>
                            </div>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Lecciones */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contenido del Curso</h3>
                <div className="space-y-2">
                  {curso.lecciones.map((leccion, index) => (
                    <motion.button
                      key={leccion.id}
                      onClick={() => !leccion.isLocked && setLeccionActual(leccion)}
                      disabled={leccion.isLocked}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        leccionActual.id === leccion.id
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : leccion.isLocked
                          ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      whileHover={!leccion.isLocked ? { scale: 1.02 } : {}}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 mt-0.5">
                          {leccion.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : leccion.isLocked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Play className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-500">Lección {index + 1}</span>
                            <span className="text-xs text-gray-500">{leccion.duration}</span>
                          </div>
                          <p className={`font-semibold ${
                            leccionActual.id === leccion.id ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {leccion.title}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
