'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, Loader2 } from 'lucide-react'
import { upsertReview, getUserReview } from '@/lib/supabase/reviews'
import type { CourseReview } from '@/lib/supabase/reviews'

interface CourseReviewModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  courseId: string
  courseTitle: string
  onReviewSubmitted?: () => void
}

export default function CourseReviewModal({
  isOpen,
  onClose,
  userId,
  courseId,
  courseTitle,
  onReviewSubmitted
}: CourseReviewModalProps) {
  const [loading, setLoading] = useState(false)
  const [existingReview, setExistingReview] = useState<CourseReview | null>(null)
  
  const [ratings, setRatings] = useState({
    difficulty: 0,
    comprehension: 0,
    duration: 0,
    test_difficulty: 0
  })
  
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState<{ category: string; value: number } | null>(null)

  useEffect(() => {
    if (isOpen) {
      loadExistingReview()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId, courseId])

  const loadExistingReview = async () => {
    try {
      const review = await getUserReview(userId, courseId)
      if (review) {
        setExistingReview(review)
        setRatings({
          difficulty: review.rating_difficulty,
          comprehension: review.rating_comprehension,
          duration: review.rating_duration,
          test_difficulty: review.rating_test_difficulty
        })
        setComment(review.comment || '')
      }
    } catch (error) {
      console.error('Error loading review:', error)
    }
  }

  const handleSubmit = async () => {
    // Validar que todas las categorías tengan valoración
    if (Object.values(ratings).some(r => r === 0)) {
      alert('Por favor, valora todas las categorías')
      return
    }

    setLoading(true)
    try {
      await upsertReview({
        user_id: userId,
        course_id: courseId,
        rating_difficulty: ratings.difficulty,
        rating_comprehension: ratings.comprehension,
        rating_duration: ratings.duration,
        rating_test_difficulty: ratings.test_difficulty,
        comment: comment.trim() || undefined
      })

      onReviewSubmitted?.()
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error al enviar la valoración. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const categories = [
    { key: 'difficulty', label: 'Dificultad del Contenido', description: '¿Te resultó fácil o difícil?' },
    { key: 'comprehension', label: 'Comprensión', description: '¿Se explica de forma clara?' },
    { key: 'duration', label: 'Duración', description: '¿El curso tiene una duración adecuada?' },
    { key: 'test_difficulty', label: 'Dificultad de los Tests', description: '¿Los tests están bien equilibrados?' }
  ]

  const overallRating = Object.values(ratings).reduce((sum, r) => sum + r, 0) / 4

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-forest to-sage p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {existingReview ? 'Actualizar valoración' : 'Valora este curso'}
                </h2>
                <p className="text-white/80">{courseTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Overall Rating Display */}
            {overallRating > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <div className="text-4xl font-bold">
                  {overallRating.toFixed(1)}
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= Math.round(overallRating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Categorías */}
            {categories.map((category) => (
              <div key={category.key} className="space-y-2">
                <div>
                  <h3 className="font-semibold text-gray-800">{category.label}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isSelected = star <= ratings[category.key as keyof typeof ratings]
                    const isHovered =
                      hoveredRating?.category === category.key && star <= hoveredRating.value

                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setRatings((prev) => ({ ...prev, [category.key]: star }))
                        }
                        onMouseEnter={() =>
                          setHoveredRating({ category: category.key, value: star })
                        }
                        onMouseLeave={() => setHoveredRating(null)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            isSelected || isHovered
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    )
                  })}
                  {ratings[category.key as keyof typeof ratings] > 0 && (
                    <span className="ml-2 text-gray-600 self-center">
                      {ratings[category.key as keyof typeof ratings]}/5
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Comentario opcional */}
            <div className="space-y-2">
              <label className="block font-semibold text-gray-800">
                Comentario (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con este curso..."
                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-forest focus:ring-2 focus:ring-forest/20 transition-colors resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-sm text-gray-400 text-right">{comment.length}/500</p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || Object.values(ratings).some((r) => r === 0)}
                className="flex-1 px-6 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {existingReview ? 'Actualizar valoración' : 'Enviar valoración'}
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
