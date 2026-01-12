'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TrendingUp, Award, Star, Zap, Info, X } from 'lucide-react'
import { useState } from 'react'

interface UserStats {
  total_points: number
  level: number
  experience_points: number
  experience_to_next_level: number
  courses_completed: number
  lessons_completed: number
  total_badges: number
  current_streak_days: number
  global_rank?: number | null
}

interface UserStatsCardProps {
  stats: UserStats
  userName?: string
  compact?: boolean
}

export default function UserStatsCard({ stats, userName, compact = false }: UserStatsCardProps) {
  const [showPointsInfo, setShowPointsInfo] = useState(false)
  // Calcular porcentaje hacia siguiente nivel
  const levelProgress = stats.experience_to_next_level > 0
    ? Math.round(((stats.experience_points % (stats.level * stats.level * 100)) / (stats.level * stats.level * 100)) * 100)
    : 100

  const expCurrentLevel = stats.level > 1 ? (stats.level - 1) * (stats.level - 1) * 100 : 0
  const expNextLevel = stats.level * stats.level * 100
  const expInCurrentLevel = stats.experience_points - expCurrentLevel
  const expNeededForLevel = expNextLevel - expCurrentLevel
  const progressPercentage = Math.min(100, Math.round((expInCurrentLevel / expNeededForLevel) * 100))

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-forest to-sage text-white rounded-xl p-4 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Nivel</p>
              <p className="text-2xl font-bold">{stats.level}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Puntos</p>
            <p className="text-xl font-bold">{stats.total_points.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="opacity-90">Progreso al nivel {stats.level + 1}</span>
            <span className="font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs opacity-75">
            {expInCurrentLevel.toLocaleString()} / {expNeededForLevel.toLocaleString()} XP
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      {/* Header con gradiente */}
      <div className="bg-gradient-to-br from-forest to-sage text-white p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              {userName && (
                <p className="text-lg opacity-90 mb-1">Hola, {userName}</p>
              )}
              <p className="text-3xl font-bold">Nivel {stats.level}</p>
            </div>
          </div>
          {stats.global_rank && (
            <div className="text-right">
              <p className="text-sm opacity-90">Ranking</p>
              <p className="text-2xl font-bold">#{stats.global_rank}</p>
            </div>
          )}
        </div>

        {/* Progress Bar hacia siguiente nivel */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="opacity-90">Progreso al Nivel {stats.level + 1}</span>
            <span className="font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <motion.div
              className="bg-white rounded-full h-3 shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs opacity-80">
            {expInCurrentLevel.toLocaleString()} / {expNeededForLevel.toLocaleString()} XP para subir de nivel
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Puntos Totales - Con Info */}
          <motion.div
            className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center relative cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setShowPointsInfo(true)}
          >
            <Star className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-900">{stats.total_points.toLocaleString()}</p>
            <p className="text-xs text-amber-700 mt-1">Puntos Totales</p>
            
            {/* Botón "Saber más" - Más visible */}
            <div className="mt-2 flex items-center justify-center space-x-1 text-amber-700 hover:text-amber-900 transition">
              <Info className="w-3 h-3" />
              <span className="text-xs font-semibold">Saber más</span>
            </div>
          </motion.div>

          {/* Badges */}
          <motion.div
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{stats.total_badges}</p>
            <p className="text-xs text-purple-700 mt-1">Badges</p>
          </motion.div>

          {/* Cursos Completados */}
          <motion.div
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">{stats.courses_completed}</p>
            <p className="text-xs text-green-700 mt-1">Cursos</p>
          </motion.div>

          {/* Racha */}
          <motion.div
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Zap className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-900">{stats.current_streak_days}</p>
            <p className="text-xs text-red-700 mt-1">Días de Racha 🔥</p>
          </motion.div>
        </div>

        {/* Detalles adicionales */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.lessons_completed}</p>
              <p className="text-sm text-gray-600">Lecciones Completadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.experience_points.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Experiencia Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer motivacional */}
      <div className="bg-gradient-to-r from-forest/5 to-sage/5 px-6 py-4">
        <p className="text-sm text-center text-gray-600">
          {progressPercentage < 30 
            ? '¡Sigue así! Cada lección te acerca a tu próximo nivel 🚀'
            : progressPercentage < 70
            ? '¡Vas por buen camino! Ya casi llegas al siguiente nivel 💪'
            : '¡Estás a punto de subir de nivel! ¡Un último esfuerzo! 🎯'
          }
        </p>
      </div>

      {/* Modal de información de puntos */}
      <AnimatePresence>
        {showPointsInfo && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPointsInfo(false)}
            >
              {/* Modal */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Botón cerrar */}
                <button
                  onClick={() => setShowPointsInfo(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>

                {/* Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">¿Cómo ganar puntos?</h3>
                    <p className="text-sm text-gray-500">Sistema de recompensas</p>
                  </div>
                </div>

                {/* Contenido */}
                <div className="space-y-4">
                  {/* Completar lecciones */}
                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">📖</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Completar Lecciones</p>
                      <p className="text-sm text-gray-600">+20 puntos por lección</p>
                      <p className="text-xs text-gray-500 mt-1">¡La forma principal de ganar puntos!</p>
                    </div>
                  </div>

                  {/* Completar cursos */}
                  <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">🎓</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Completar Cursos</p>
                      <p className="text-sm text-gray-600">+50 a +200 puntos</p>
                      <p className="text-xs text-gray-500 mt-1">Según dificultad del curso</p>
                    </div>
                  </div>

                  {/* Ganar badges */}
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">🏆</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Desbloquear Badges</p>
                      <p className="text-sm text-gray-600">+10 a +1000 puntos</p>
                      <p className="text-xs text-gray-500 mt-1">Los badges legendarios dan más puntos</p>
                    </div>
                  </div>

                  {/* Racha */}
                  <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">🔥</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Mantener Racha</p>
                      <p className="text-sm text-gray-600">Bonus diario</p>
                      <p className="text-xs text-gray-500 mt-1">Estudia todos los días para mantener tu racha</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-center text-gray-600">
                    💡 <span className="font-semibold">Consejo:</span> Completa lecciones diariamente para maximizar tus puntos
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
