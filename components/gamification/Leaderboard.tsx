'use client'

import { motion } from 'framer-motion'
import { Trophy, Medal, Award, Crown, TrendingUp, User } from 'lucide-react'

interface LeaderboardEntry {
  user_id: string
  full_name: string
  avatar_url: string | null
  total_points: number
  level: number
  total_badges: number
  courses_completed: number
  rank: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  currentUserId?: string
  title?: string
  showTop?: number
}

export default function Leaderboard({ 
  entries, 
  currentUserId,
  title = 'Clasificación',
  showTop = 10
}: LeaderboardProps) {
  
  const displayedEntries = entries.slice(0, showTop)
  const currentUserEntry = entries.find(e => e.user_id === currentUserId)
  const isCurrentUserInTop = currentUserEntry && currentUserEntry.rank <= showTop

  // Iconos y colores por posición
  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: <Crown className="w-6 h-6" />, color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-200' }
      case 2:
        return { icon: <Medal className="w-6 h-6" />, color: 'text-gray-400', bg: 'bg-gray-50 border-gray-200' }
      case 3:
        return { icon: <Medal className="w-6 h-6" />, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' }
      default:
        return { icon: <span className="text-lg font-bold">#{rank}</span>, color: 'text-gray-600', bg: 'bg-white border-gray-200' }
    }
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay datos de clasificación aún</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-forest" />
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-sm text-gray-600">
          Top {showTop} usuarios
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {/* 2nd Place */}
          {displayedEntries[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="order-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border-2 border-gray-300"
            >
              <div className="text-center">
                <Medal className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  {displayedEntries[1].avatar_url ? (
                    <img src={displayedEntries[1].avatar_url} alt={displayedEntries[1].full_name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-gray-600" />
                  )}
                </div>
                <p className="font-bold text-gray-900 text-sm truncate">{displayedEntries[1].full_name}</p>
                <p className="text-xs text-gray-600">Nivel {displayedEntries[1].level}</p>
                <p className="text-lg font-bold text-gray-700 mt-2">{displayedEntries[1].total_points.toLocaleString()}</p>
                <p className="text-xs text-gray-500">puntos</p>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {displayedEntries[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="order-2 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-400 relative -mt-4"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Crown className="w-10 h-10 text-yellow-500" />
              </div>
              <div className="text-center mt-2">
                <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center ring-4 ring-yellow-200">
                  {displayedEntries[0].avatar_url ? (
                    <img src={displayedEntries[0].avatar_url} alt={displayedEntries[0].full_name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-10 h-10 text-yellow-800" />
                  )}
                </div>
                <p className="font-bold text-gray-900 truncate">{displayedEntries[0].full_name}</p>
                <p className="text-sm text-gray-600">Nivel {displayedEntries[0].level}</p>
                <p className="text-2xl font-bold text-yellow-700 mt-2">{displayedEntries[0].total_points.toLocaleString()}</p>
                <p className="text-xs text-gray-600">puntos</p>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {displayedEntries[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="order-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border-2 border-amber-300"
            >
              <div className="text-center">
                <Medal className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                <div className="w-16 h-16 bg-amber-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  {displayedEntries[2].avatar_url ? (
                    <img src={displayedEntries[2].avatar_url} alt={displayedEntries[2].full_name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-8 h-8 text-amber-800" />
                  )}
                </div>
                <p className="font-bold text-gray-900 text-sm truncate">{displayedEntries[2].full_name}</p>
                <p className="text-xs text-gray-600">Nivel {displayedEntries[2].level}</p>
                <p className="text-lg font-bold text-amber-700 mt-2">{displayedEntries[2].total_points.toLocaleString()}</p>
                <p className="text-xs text-gray-500">puntos</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Lista del resto */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {displayedEntries.slice(entries.length >= 3 ? 3 : 0).map((entry, index) => {
          const rank = entries.length >= 3 ? index + 4 : index + 1
          const rankDisplay = getRankDisplay(rank)
          const isCurrentUser = entry.user_id === currentUserId

          return (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`
                flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0
                ${isCurrentUser ? 'bg-forest/5 border-l-4 border-l-forest' : 'hover:bg-gray-50'}
                transition-colors
              `}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* Rank */}
                <div className={`flex-shrink-0 w-12 h-12 ${rankDisplay.bg} border rounded-lg flex items-center justify-center ${rankDisplay.color}`}>
                  {rankDisplay.icon}
                </div>

                {/* Avatar */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {entry.avatar_url ? (
                    <img src={entry.avatar_url} alt={entry.full_name} className="w-full h-full rounded-full" />
                  ) : (
                    <User className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                {/* Name & Stats */}
                <div className="flex-1 min-w-0">
                  <p className={`font-bold truncate ${isCurrentUser ? 'text-forest' : 'text-gray-900'}`}>
                    {entry.full_name}
                    {isCurrentUser && <span className="ml-2 text-xs bg-forest text-white px-2 py-1 rounded-full">Tú</span>}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Nivel {entry.level}
                    </span>
                    <span className="flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      {entry.total_badges} badges
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-gray-900">{entry.total_points.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">puntos</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Current User Position (si no está en el top) */}
      {currentUserEntry && !isCurrentUserInTop && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-forest/10 to-sage/10 rounded-xl p-6 border-2 border-forest"
        >
          <p className="text-sm text-gray-600 mb-3 text-center">Tu posición actual</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-forest text-white rounded-lg flex items-center justify-center font-bold text-lg">
                #{currentUserEntry.rank}
              </div>
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {currentUserEntry.avatar_url ? (
                  <img src={currentUserEntry.avatar_url} alt={currentUserEntry.full_name} className="w-full h-full rounded-full" />
                ) : (
                  <User className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900">{currentUserEntry.full_name}</p>
                <p className="text-sm text-gray-600">Nivel {currentUserEntry.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-forest">{currentUserEntry.total_points.toLocaleString()}</p>
              <p className="text-xs text-gray-600">puntos</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
