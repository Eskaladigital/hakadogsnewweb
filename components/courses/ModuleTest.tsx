'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Trophy,
  RotateCcw,
  BookOpen,
  Loader2
} from 'lucide-react'
import type { ModuleTest, TestQuestion } from '@/lib/supabase/tests'
import { submitTestAttempt } from '@/lib/supabase/tests'

interface ModuleTestProps {
  test: ModuleTest
  userId: string
  moduleName: string
  onComplete: (passed: boolean, score: number) => void
  onCancel: () => void
}

export default function ModuleTestComponent({ 
  test, 
  userId, 
  moduleName,
  onComplete, 
  onCancel 
}: ModuleTestProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(test.questions.length).fill(null)
  )
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false) // Mostrar feedback inmediato
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState<TestQuestion[]>([])

  // Mezclar preguntas al inicio
  useEffect(() => {
    const shuffled = [...test.questions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [test.questions])

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const currentQuestion = shuffledQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100
  const isCorrect = selectedOption === currentQuestion?.correct_answer
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (optionIndex: number) => {
    if (!showFeedback) { // Solo permitir seleccionar si aún no ha confirmado
      setSelectedOption(optionIndex)
    }
  }

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return

    // Guardar respuesta
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = selectedOption
    setAnswers(newAnswers)

    // Mostrar feedback inmediato
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Si es la última pregunta, enviar el test
      handleSubmitTest()
    } else {
      // Avanzar a la siguiente pregunta
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
      setShowFeedback(false)
    }
  }

  const handleSubmitTest = async () => {
    setSubmitting(true)

    try {
      // Reordenar respuestas según el orden original de las preguntas
      const originalOrderAnswers = test.questions.map(originalQ => {
        const shuffledIndex = shuffledQuestions.findIndex(sq => sq.id === originalQ.id)
        return answers[shuffledIndex] as number
      })

      const response = await submitTestAttempt(
        userId,
        test.id,
        originalOrderAnswers,
        timeElapsed
      )

      if (response.success) {
        setResult({ score: response.score, passed: response.passed })
        setShowResults(true)
      } else {
        alert('Error al enviar el test: ' + response.error)
      }
    } catch (error) {
      console.error('Error enviando test:', error)
      alert('Error inesperado al enviar el test')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinish = () => {
    if (result) {
      onComplete(result.passed, result.score)
    }
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    )
  }

  // Pantalla de resultados
  if (showResults && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
      >
        <div className="text-center">
          {result.passed ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-forest to-sage rounded-full flex items-center justify-center"
              >
                <Trophy className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-forest mb-2">
                ¡Felicidades! 🎉
              </h2>
              <p className="text-gray-600 mb-6">
                Has aprobado el test del módulo <strong>{moduleName}</strong>
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center"
              >
                <RotateCcw className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                ¡Casi lo consigues!
              </h2>
              <p className="text-gray-600 mb-6">
                Necesitas un {test.passing_score}% para aprobar. ¡Repasa el contenido y vuelve a intentarlo!
              </p>
            </>
          )}

          {/* Puntuación */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-5xl font-bold mb-2" style={{ 
              color: result.passed ? '#2d5a27' : '#d97706' 
            }}>
              {result.score}%
            </div>
            <p className="text-gray-500 text-sm">
              {answers.filter((a, i) => a === shuffledQuestions[i].correct_answer).length} de {shuffledQuestions.length} correctas
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Tiempo: {formatTime(timeElapsed)}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-center">
            {!result.passed && (
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Volver al contenido
              </button>
            )}
            <button
              onClick={handleFinish}
              className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                result.passed
                  ? 'bg-forest text-white hover:bg-forest/90'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              {result.passed ? 'Continuar' : 'Intentar de nuevo'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest to-sage p-6 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{test.title}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeElapsed)}</span>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-white/80">
          <span>Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}</span>
          <span>Puntuación mínima: {test.passing_score}%</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Pregunta */}
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h3>

            {/* Opciones */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedOption === index
                const isCorrectAnswer = index === currentQuestion.correct_answer
                const showAsCorrect = showFeedback && isCorrectAnswer
                const showAsIncorrect = showFeedback && isSelected && !isCorrect

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(index)}
                    disabled={showFeedback}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      showAsCorrect
                        ? 'border-green-500 bg-green-50'
                        : showAsIncorrect
                          ? 'border-red-500 bg-red-50'
                          : isSelected
                            ? 'border-forest bg-forest/5'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                        showAsCorrect
                          ? 'bg-green-500 text-white'
                          : showAsIncorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                              ? 'bg-forest text-white'
                              : 'bg-gray-100 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showAsCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showAsIncorrect && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feedback inmediato */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl mb-6 ${
                  isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                    </h4>
                    {!isCorrect && (
                      <p className="text-red-700 mb-2">
                        La respuesta correcta es: <span className="font-semibold">
                          {String.fromCharCode(65 + currentQuestion.correct_answer)}. {currentQuestion.options[currentQuestion.correct_answer]}
                        </span>
                      </p>
                    )}
                    {currentQuestion.explanation && (
                      <div className="mt-2 pt-2 border-t border-green-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Explicación:</span> {currentQuestion.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Botones de acción */}
        <div className="flex justify-end">
          {!showFeedback ? (
            <button
              onClick={handleConfirmAnswer}
              disabled={selectedOption === null}
              className="px-6 py-3 bg-forest text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-forest/90 transition-colors flex items-center gap-2"
            >
              Confirmar respuesta
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="px-6 py-3 bg-forest text-white rounded-xl font-medium hover:bg-forest/90 transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : isLastQuestion ? (
                <>
                  Finalizar test
                  <Trophy className="w-5 h-5" />
                </>
              ) : (
                <>
                  Siguiente pregunta
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
