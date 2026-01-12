'use client'

import { motion } from 'framer-motion'
import BadgeCard from './BadgeCard'

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

interface BadgeGridProps {
  badges: Badge[]
  title?: string
  emptyMessage?: string
  columns?: 3 | 4 | 5 | 6
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
}

const categoryNames: { [key: string]: { name: string; icon: string } } = {
  progress: { name: 'Progreso', icon: '🎯' },
  courses: { name: 'Cursos', icon: '📚' },
  knowledge: { name: 'Conocimiento', icon: '💡' },
  time: { name: 'Tiempo', icon: '⏱️' },
  special: { name: 'Especiales', icon: '✨' },
  social: { name: 'Sociales', icon: '👥' }
}

export default function BadgeGrid({ 
  badges, 
  title,
  emptyMessage = 'No hay badges disponibles',
  columns = 4,
  size = 'md',
  showProgress = false
}: BadgeGridProps) {
  
  // Agrupar badges por categoría
  const badgesByCategory = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = []
    }
    acc[badge.category].push(badge)
    return acc
  }, {} as { [key: string]: Badge[] })

  // Ordenar categorías
  const sortedCategories = Object.keys(badgesByCategory).sort()

  // Clase de grid según número de columnas
  const gridCols = {
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
  }

  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏆</div>
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {title && (
        <motion.h2 
          className="text-3xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title}
        </motion.h2>
      )}

      {/* Badges agrupados por categoría */}
      {sortedCategories.map((category, categoryIndex) => {
        const categoryInfo = categoryNames[category] || { name: category, icon: '🏅' }
        const categoryBadges = badgesByCategory[category]

        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
            className="space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">{categoryInfo.icon}</span>
              <h3 className="text-xl font-bold text-gray-800 capitalize">
                {categoryInfo.name}
              </h3>
              <span className="text-sm text-gray-500">
                ({categoryBadges.filter(b => b.is_unlocked).length}/{categoryBadges.length})
              </span>
            </div>

            {/* Badges Grid */}
            <div className={`grid ${gridCols[columns]} gap-4 md:gap-6`}>
              {categoryBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: categoryIndex * 0.1 + index * 0.05,
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                >
                  <BadgeCard 
                    badge={badge} 
                    size={size}
                    showProgress={showProgress}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )
      })}

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-forest/10 to-sage/10 rounded-xl p-6 mt-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-forest">
              {badges.filter(b => b.is_unlocked).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Desbloqueados</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-400">
              {badges.filter(b => !b.is_unlocked).length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Bloqueados</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gold">
              {badges.filter(b => b.is_unlocked && b.rarity === 'legendary').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Legendarios</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round((badges.filter(b => b.is_unlocked).length / badges.length) * 100)}%
            </p>
            <p className="text-sm text-gray-600 mt-1">Completado</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
