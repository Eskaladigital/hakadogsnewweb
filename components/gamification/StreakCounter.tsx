'use client'

import { motion } from 'framer-motion'
import { Flame, Trophy, Target } from 'lucide-react'

interface StreakCounterProps {
  currentStreak: number
  longestStreak: number
  compact?: boolean
  showMotivation?: boolean
}

export default function StreakCounter({ 
  currentStreak, 
  longestStreak,
  compact = false,
  showMotivation = true
}: StreakCounterProps) {
  
  // Calcular próximo hito
  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 30 ? 30 : currentStreak < 100 ? 100 : 365
  const progressToMilestone = Math.round((currentStreak / nextMilestone) * 100)

  // Determinar intensidad del fuego
  const getFlameIntensity = (days: number) => {
    if (days === 0) return 'text-gray-400'
    if (days < 3) return 'text-orange-400'
    if (days < 7) return 'text-orange-500'
    if (days < 14) return 'text-orange-600'
    if (days < 30) return 'text-red-500'
    if (days < 100) return 'text-red-600'
    return 'text-red-700'
  }

  // Mensaje motivacional
  const getMotivationalMessage = (days: number) => {
    if (days === 0) return '¡Empieza tu racha hoy! 💪'
    if (days === 1) return '¡Buen inicio! Sigue mañana 🎯'
    if (days < 7) return `¡Vas genial! ${7 - days} días para la primera meta 🔥`
    if (days === 7) return '¡1 semana completa! ¡Increíble! 🎉'
    if (days < 30) return `¡Imparable! ${30 - days} días para el mes 🚀`
    if (days === 30) return '¡1 mes seguido! ¡Eres una leyenda! 🏆'
    if (days < 100) return `¡Dedicación extrema! ${100 - days} días para el centenario 💎`
    if (days === 100) return '¡100 DÍAS! ¡Eres un MAESTRO! 👑'
    return '¡Racha LEGENDARIA! ¡Sigue así! ⚡'
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4"
      >
        <motion.div
          animate={currentStreak > 0 ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          } : {}}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <Flame className={`w-8 h-8 ${getFlameIntensity(currentStreak)}`} />
        </motion.div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{currentStreak}</p>
          <p className="text-xs text-gray-600">días de racha</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
    >
      {/* Header con gradiente de fuego */}
      <div className="bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={currentStreak > 0 ? { 
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0]
              } : {}}
              transition={{ 
                duration: 0.8, 
                repeat: Infinity,
                repeatDelay: 1.5
              }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Flame className="w-10 h-10" />
            </motion.div>
            <div>
              <p className="text-sm opacity-90 mb-1">Racha Actual</p>
              <p className="text-5xl font-bold">{currentStreak}</p>
              <p className="text-sm opacity-90 mt-1">
                {currentStreak === 1 ? 'día' : 'días'} consecutivos
              </p>
            </div>
          </div>
          
          {/* Record Personal */}
          <div className="text-right">
            <Trophy className="w-6 h-6 mx-auto mb-1 opacity-90" />
            <p className="text-2xl font-bold">{longestStreak}</p>
            <p className="text-xs opacity-80">Récord</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        {/* Progreso al próximo hito */}
        {currentStreak < nextMilestone && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-700">
                  Próximo hito: {nextMilestone} días
                </p>
              </div>
              <span className="text-sm font-bold text-forest">
                {nextMilestone - currentStreak} días
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full h-3"
                initial={{ width: 0 }}
                animate={{ width: `${progressToMilestone}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Hitos */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-3">Hitos de Racha</p>
          
          {/* 7 días */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${currentStreak >= 7 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{currentStreak >= 7 ? '✅' : '🔒'}</span>
              <span className="text-sm font-medium">7 días - Una semana</span>
            </div>
            <span className="text-xs font-bold text-orange-600">+75 pts</span>
          </div>

          {/* 30 días */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${currentStreak >= 30 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{currentStreak >= 30 ? '✅' : '🔒'}</span>
              <span className="text-sm font-medium">30 días - Un mes</span>
            </div>
            <span className="text-xs font-bold text-orange-600">+250 pts</span>
          </div>

          {/* 100 días */}
          <div className={`flex items-center justify-between p-3 rounded-lg ${currentStreak >= 100 ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{currentStreak >= 100 ? '✅' : '🔒'}</span>
              <span className="text-sm font-medium">100 días - Imparable</span>
            </div>
            <span className="text-xs font-bold text-purple-600">+1000 pts</span>
          </div>
        </div>

        {/* Mensaje motivacional */}
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-forest/10 to-sage/10 rounded-xl p-4 text-center"
          >
            <p className="text-sm font-medium text-gray-700">
              {getMotivationalMessage(currentStreak)}
            </p>
          </motion.div>
        )}
      </div>

      {/* Advertencia si racha está en riesgo */}
      {currentStreak > 0 && (
        <div className="bg-amber-50 border-t border-amber-100 px-6 py-3">
          <p className="text-xs text-amber-800 text-center">
            ⚠️ ¡No pierdas tu racha! Completa una lección hoy para mantenerla
          </p>
        </div>
      )}
    </motion.div>
  )
}
