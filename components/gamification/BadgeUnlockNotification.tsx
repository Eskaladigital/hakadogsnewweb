'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'

interface BadgeUnlockNotificationProps {
  badge: {
    name: string
    description: string
    icon: string
    points: number
    rarity: string
    tier: string
  } | null
  onClose: () => void
}

export default function BadgeUnlockNotification({ badge, onClose }: BadgeUnlockNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (badge) {
      setShowConfetti(true)
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })

      // Auto-cerrar después de 8 segundos
      const timer = setTimeout(() => {
        onClose()
      }, 8000)

      return () => clearTimeout(timer)
    }
  }, [badge, onClose])

  const rarityColors: { [key: string]: string } = {
    common: 'from-gray-400 to-gray-500',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-orange-400 to-orange-600',
    legendary: 'from-purple-400 to-purple-600'
  }

  return (
    <AnimatePresence>
      {badge && (
        <>
          {/* Confetti */}
          {showConfetti && badge.rarity !== 'common' && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={badge.rarity === 'legendary' ? 500 : badge.rarity === 'epic' ? 300 : 150}
              gravity={0.3}
            />
          )}

          {/* Notification Modal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                duration: 0.5
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header con gradiente */}
              <div className={`bg-gradient-to-br ${rarityColors[badge.rarity]} text-white p-8 text-center relative`}>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Sparkles Animation */}
                {badge.rarity !== 'common' && (
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute top-4 left-4"
                  >
                    <Sparkles className="w-6 h-6" />
                  </motion.div>
                )}

                {/* Trophy Icon */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Trophy className="w-12 h-12 mx-auto mb-4" />
                </motion.div>

                {/* Badge Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 0.5,
                    type: "spring",
                    stiffness: 260,
                    damping: 10
                  }}
                  className="text-7xl mb-4"
                >
                  {badge.icon}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-3xl font-bold mb-2"
                >
                  ¡Badge Desbloqueado!
                </motion.h2>

                {/* Badge Name */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="text-lg font-semibold"
                >
                  {badge.name}
                </motion.p>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="p-6 space-y-4"
              >
                {/* Description */}
                <p className="text-gray-600 text-center">
                  {badge.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center space-x-6 py-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-forest">+{badge.points}</p>
                    <p className="text-xs text-gray-500">Puntos</p>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900 capitalize">{badge.rarity}</p>
                    <p className="text-xs text-gray-500">Rareza</p>
                  </div>
                </div>

                {/* Tier Badge */}
                <div className="flex justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${rarityColors[badge.rarity]} text-white`}>
                    {badge.tier === 'bronze' && '🥉 Bronce'}
                    {badge.tier === 'silver' && '🥈 Plata'}
                    {badge.tier === 'gold' && '🥇 Oro'}
                    {badge.tier === 'platinum' && '💎 Platino'}
                    {badge.tier === 'diamond' && '💠 Diamante'}
                  </span>
                </div>

                {/* CTA Button */}
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all"
                >
                  ¡Genial! Continuar
                </button>

                {/* View All Badges Link */}
                <p className="text-center text-sm text-gray-500">
                  <a href="/cursos/badges" className="text-forest hover:underline">
                    Ver todos mis badges →
                  </a>
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
