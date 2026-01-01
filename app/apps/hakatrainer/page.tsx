'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import AuthModal from '@/components/AuthModal'
import { Target, CheckCircle, Clock, TrendingUp, Star, Award, Calendar, ChevronRight, Play } from 'lucide-react'
import Link from 'next/link'

export default function HakaTrainerPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  if (!isLoading && !isAuthenticated) {
    if (!showAuthModal) {
      setShowAuthModal(true)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  return (
    <>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false)
          window.location.href = '/apps'
        }}
        appName="HakaTrainer"
      />

      {isAuthenticated && (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 -mt-20">
            <div className="container mx-auto px-4 pt-20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center mb-2">
                    <Target className="w-8 h-8 mr-3" />
                    <h1 className="text-4xl font-bold">HakaTrainer</h1>
                  </div>
                  <p className="text-orange-100 text-lg">Seguimiento de tu plan de adiestramiento</p>
                </div>
                <Link 
                  href="/apps"
                  className="text-white hover:text-orange-100 transition-colors text-sm font-medium"
                >
                  ← Volver a Apps
                </Link>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            {/* Progress Overview */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Completado</span>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">8/12</p>
                <p className="text-xs text-gray-500 mt-1">Ejercicios esta semana</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Racha Actual</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">12 días</p>
                <p className="text-xs text-green-600 mt-1">¡Récord personal!</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Habilidades</span>
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">15</p>
                <p className="text-xs text-gray-500 mt-1">Dominadas</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-sm">Próxima Sesión</span>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">Hoy</p>
                <p className="text-xs text-gray-500 mt-1">17:00 - Parque</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Plan Actual */}
              <div className="md:col-span-2 space-y-6">
                {/* Ejercicios de Hoy */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-orange-600 text-white px-6 py-4">
                    <h2 className="text-xl font-bold flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Ejercicios de Hoy
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Sentado - Nivel 3</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">5 repeticiones con distracción media</p>
                          <p className="text-xs text-green-600 font-medium mt-2">✓ Completado a las 09:30</p>
                        </div>
                        <button className="text-green-600 hover:text-green-700">
                          <Play className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Quieto - Nivel 2</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Mantener posición 30 segundos</p>
                          <p className="text-xs text-green-600 font-medium mt-2">✓ Completado a las 10:15</p>
                        </div>
                        <button className="text-green-600 hover:text-green-700">
                          <Play className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-orange-600 mr-2" />
                            <h3 className="font-semibold text-gray-900">Llamada - Nivel 4</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Llamada con distracción alta (otros perros)</p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-orange-600 font-medium">Pendiente - 17:00 en el parque</p>
                            <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors">
                              Iniciar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-l-4 border-gray-300 bg-gray-50 p-4 rounded-r-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-gray-400 mr-2" />
                            <h3 className="font-semibold text-gray-900">Paseo con correa - Nivel 3</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">15 minutos sin tirones</p>
                          <p className="text-xs text-gray-500 mt-2">Planificado para después de la llamada</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progreso Semanal */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-blue-600 text-white px-6 py-4">
                    <h2 className="text-xl font-bold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Progreso esta Semana
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, i) => (
                        <div key={i} className="text-center">
                          <p className="text-xs text-gray-500 mb-2">{day}</p>
                          <div className={`h-20 rounded-lg ${
                            i < 4 ? 'bg-green-500' : i === 4 ? 'bg-orange-500' : 'bg-gray-200'
                          } flex items-end justify-center pb-2`}>
                            {i < 5 && (
                              <span className="text-white text-xs font-bold">
                                {i < 4 ? '100%' : '67%'}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      <span className="font-semibold text-green-600">8 de 12</span> ejercicios completados esta semana
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Habilidades Dominadas */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-purple-600 text-white px-6 py-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Habilidades
                    </h2>
                  </div>
                  <div className="p-6 space-y-3">
                    {[
                      { name: 'Sentado', level: 5, mastered: true },
                      { name: 'Tumbado', level: 5, mastered: true },
                      { name: 'Quieto', level: 4, mastered: false },
                      { name: 'Llamada', level: 4, mastered: false },
                      { name: 'Junto', level: 3, mastered: false },
                    ].map((skill, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          {skill.mastered && <Star className="w-4 h-4 text-yellow-500 mr-2" />}
                          <span className="text-sm font-medium text-gray-900">{skill.name}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex space-x-1">
                            {[...Array(5)].map((_, j) => (
                              <div
                                key={j}
                                className={`w-2 h-2 rounded-full ${
                                  j < skill.level ? 'bg-purple-600' : 'bg-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logros */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-yellow-600 text-white px-6 py-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Logros Recientes
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                        🏆
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Racha de 12 días</p>
                        <p className="text-xs text-gray-600">¡Nuevo récord!</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        ⭐
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Sentado Maestro</p>
                        <p className="text-xs text-gray-600">Nivel 5 dominado</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        🎯
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">50 Ejercicios</p>
                        <p className="text-xs text-gray-600">Completados este mes</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Próxima Meta */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-green-600 text-white px-6 py-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Próxima Meta
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 mb-2">85%</p>
                      <p className="text-sm text-gray-600 mb-4">para dominar &quot;Llamada Nivel 5&quot;</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500">3 ejercicios más</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
