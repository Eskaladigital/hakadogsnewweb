'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Sparkles, X, Award, Calendar, Star } from 'lucide-react'

interface Badge {
  id: string
  code: string
  name: string
  description: string
  icon: string
  category: string
  tier: string
  points: number
  rarity: string
  color: string
  is_secret: boolean
  earned_at?: string
  is_unlocked?: boolean
}

interface BadgeCardProps {
  badge: Badge
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  progress?: number
}

const rarityColors: { [key: string]: string } = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-orange-400 to-orange-600',
  legendary: 'from-purple-400 to-purple-600'
}

const rarityBorderColors: { [key: string]: string } = {
  common: 'border-gray-400',
  rare: 'border-blue-500',
  epic: 'border-orange-500',
  legendary: 'border-purple-500'
}

const tierEmojis: { [key: string]: string } = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  diamond: '💠'
}

const categoryNames: { [key: string]: string } = {
  progress: 'Progreso',
  courses: 'Cursos',
  knowledge: 'Conocimiento',
  time: 'Tiempo',
  special: 'Especiales',
  social: 'Sociales'
}

export default function BadgeCard({ 
  badge, 
  size = 'md',
  showProgress = false,
  progress = 0
}: BadgeCardProps) {
  const isLocked = badge.is_unlocked === false
  const isSecret = badge.is_secret && isLocked
  const [showModal, setShowModal] = useState(false)

  // Tamaños responsivos
  const sizeClasses = {
    sm: 'w-24 h-32',
    md: 'w-32 h-44',
    lg: 'w-40 h-56'
  }

  const iconSizes = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl'
  }

  const handleCardClick = () => {
    if (!isSecret) {
      setShowModal(true)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: isSecret ? 1 : 1.08, y: -4 }}
        whileTap={{ scale: isSecret ? 1 : 0.95 }}
        className="relative cursor-pointer"
        onClick={handleCardClick}
        style={{ cursor: isSecret ? 'default' : 'pointer' }}
      >
        {/* Card Container */}
        <div
          className={`
            ${sizeClasses[size]} relative w-full rounded-xl p-4
            flex flex-col items-center justify-center
            transition-all duration-300 group
            ${isLocked 
              ? 'bg-gray-100 border-2 border-gray-300 opacity-60 hover:opacity-75' 
              : `bg-gradient-to-br ${rarityColors[badge.rarity]} border-2 ${rarityBorderColors[badge.rarity]} hover:shadow-2xl`
            }
          `}
        >
        {/* Shine Effect (solo si está desbloqueado) */}
        {!isLocked && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-xl pointer-events-none" />
        )}

        {/* Lock Icon (si está bloqueado) */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {/* Badge Content */}
        <div className={`relative z-10 text-center ${isLocked ? 'opacity-30' : ''}`}>
          {/* Icon */}
          <div className={`${iconSizes[size]} mb-2`}>
            {isSecret ? '❓' : badge.icon}
          </div>

          {/* Tier Badge */}
          {!isSecret && (
            <div className="text-xs mb-1">
              {tierEmojis[badge.tier]}
            </div>
          )}

          {/* Name */}
          <h4 className={`font-bold text-white text-shadow-sm ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'} line-clamp-2`}>
            {isSecret ? '???' : badge.name}
          </h4>

          {/* Points */}
          {!isSecret && (
            <p className={`text-white/90 font-semibold mt-1 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
              +{badge.points} pts
            </p>
          )}
        </div>

        {/* Botón "Saber más" - Siempre visible */}
        {!isSecret && (
          <motion.div
            className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <div className={`bg-white/90 backdrop-blur-sm text-gray-900 font-semibold rounded-lg shadow-lg text-center py-1.5 px-2 ${
              size === 'sm' ? 'text-xs' : 'text-xs'
            }`}>
              👁️ Ver detalles
            </div>
          </motion.div>
        )}

        {/* Indicador visual permanente de clickeable */}
        {!isSecret && (
          <div className="absolute bottom-1 right-1 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
            <span className="text-xs">👁️</span>
          </div>
        )}

        {/* Sparkles for legendary */}
        {!isLocked && badge.rarity === 'legendary' && (
          <motion.div
            className="absolute -top-1 -right-1"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </motion.div>
        )}

        {/* New Badge Indicator */}
        {!isLocked && badge.earned_at && (
          <motion.div
            className="absolute -top-2 -left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            ¡Nuevo!
          </motion.div>
        )}

        {/* Progress Bar (opcional) */}
        {showProgress && isLocked && progress > 0 && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="w-full bg-gray-300 rounded-full h-1.5">
              <div 
                className="bg-forest rounded-full h-1.5 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 text-center mt-1">{progress}%</p>
          </div>
        )}
      </div>
    </motion.div>

    {/* Modal Emergente con Información Detallada */}
    <AnimatePresence>
      {showModal && !isSecret && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header del Modal */}
              <div className={`relative p-6 bg-gradient-to-br ${rarityColors[badge.rarity]} text-white`}>
                {/* Botón cerrar */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badge grande */}
                <div className="flex items-start space-x-4">
                  <div className="text-7xl">{badge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{tierEmojis[badge.tier]}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        badge.rarity === 'legendary' ? 'bg-purple-900/50' :
                        badge.rarity === 'epic' ? 'bg-orange-900/50' :
                        badge.rarity === 'rare' ? 'bg-blue-900/50' : 'bg-gray-900/50'
                      }`}>
                        {badge.rarity === 'legendary' ? '⭐ Legendario' :
                         badge.rarity === 'epic' ? '🔥 Épico' :
                         badge.rarity === 'rare' ? '💎 Raro' : '🎖️ Común'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{badge.name}</h2>
                    <p className="text-white/80 text-sm">{categoryNames[badge.category] || badge.category}</p>
                  </div>
                </div>

                {/* Sparkles para legendarios */}
                {badge.rarity === 'legendary' && (
                  <motion.div
                    className="absolute top-4 left-4"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </motion.div>
                )}
              </div>

              {/* Contenido del Modal */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* Estado del Badge */}
                <div className={`rounded-xl p-4 border-2 ${
                  isLocked 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isLocked ? (
                        <>
                          <Lock className="w-6 h-6 text-red-600" />
                          <div>
                            <p className="font-bold text-red-900">Bloqueado</p>
                            <p className="text-sm text-red-700">Completa los requisitos para desbloquearlo</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Award className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-bold text-green-900">¡Desbloqueado!</p>
                            <p className="text-sm text-green-700">Has conseguido este badge</p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">+{badge.points}</p>
                      <p className="text-xs text-gray-600">puntos</p>
                    </div>
                  </div>
                </div>

                {/* Fecha de desbloqueo */}
                {!isLocked && badge.earned_at && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Conseguido el {new Date(badge.earned_at).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                )}

                {/* Descripción - Cómo conseguirlo */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-forest" />
                    Cómo conseguir este badge
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{badge.description}</p>
                  </div>
                </div>

                {/* Barra de progreso (si está bloqueado y tiene progreso) */}
                {isLocked && showProgress && progress > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Tu progreso</span>
                      <span className="text-sm font-bold text-forest">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div 
                        className="bg-gradient-to-r from-forest to-sage rounded-full h-3"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                )}

                {/* Información adicional */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Categoría</p>
                    <p className="font-semibold text-gray-900">{categoryNames[badge.category] || badge.category}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Nivel</p>
                    <p className="font-semibold text-gray-900">{tierEmojis[badge.tier]} {badge.tier}</p>
                  </div>
                </div>
              </div>

              {/* Footer con botón de acción */}
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                {isLocked ? (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    ¡Vamos a conseguirlo! 🚀
                  </button>
                ) : (
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                  >
                    ¡Sigue aprendiendo! 🎉
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
  )
}
