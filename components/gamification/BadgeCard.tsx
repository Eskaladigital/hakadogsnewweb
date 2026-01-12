'use client'

import { motion } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'

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

export default function BadgeCard({ 
  badge, 
  size = 'md',
  showProgress = false,
  progress = 0
}: BadgeCardProps) {
  const isLocked = badge.is_unlocked === false
  const isSecret = badge.is_secret && isLocked

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: isLocked ? 1 : 1.05 }}
      className={`${sizeClasses[size]} relative`}
    >
      {/* Card Container */}
      <div
        className={`
          relative w-full h-full rounded-xl p-4
          flex flex-col items-center justify-center
          transition-all duration-300 group
          ${isLocked 
            ? 'bg-gray-100 border-2 border-gray-300 opacity-60' 
            : `bg-gradient-to-br ${rarityColors[badge.rarity]} border-2 ${rarityBorderColors[badge.rarity]}`
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

      {/* Tooltip on Hover */}
      {!isSecret && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none z-20 group-hover:opacity-100">
          <div className="bg-gray-900 text-white text-xs rounded-lg py-3 px-4 max-w-xs whitespace-normal shadow-xl border border-gray-700">
            {/* Nombre y rareza */}
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-sm">{badge.name}</p>
              <span className={`text-xs px-2 py-0.5 rounded ${
                badge.rarity === 'legendary' ? 'bg-purple-500' :
                badge.rarity === 'epic' ? 'bg-orange-500' :
                badge.rarity === 'rare' ? 'bg-blue-500' : 'bg-gray-500'
              }`}>
                {badge.rarity === 'legendary' ? 'Legendario' :
                 badge.rarity === 'epic' ? 'Épico' :
                 badge.rarity === 'rare' ? 'Raro' : 'Común'}
              </span>
            </div>
            
            {/* Descripción (cómo conseguirlo) */}
            <div className="mb-2 pb-2 border-b border-gray-700">
              <p className="text-xs text-gray-300 font-semibold mb-1">📋 Cómo conseguirlo:</p>
              <p className="text-gray-300 leading-relaxed">{badge.description}</p>
            </div>
            
            {/* Puntos */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-400 font-semibold">⭐ +{badge.points} puntos</span>
              {isLocked ? (
                <span className="text-red-400 font-semibold">🔒 Bloqueado</span>
              ) : (
                <span className="text-green-400 font-semibold">✅ Desbloqueado</span>
              )}
            </div>
            
            {/* Fecha de desbloqueo */}
            {!isLocked && badge.earned_at && (
              <p className="text-green-400 mt-2 pt-2 border-t border-gray-700 text-xs">
                Conseguido: {new Date(badge.earned_at).toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
