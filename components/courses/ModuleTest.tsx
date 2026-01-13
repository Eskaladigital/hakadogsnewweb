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
  const answeredCount = answers.filter(a => a !== null).length

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSelectOption = (optionIndex: number) => {
    setSelectedOption(optionIndex)
  }

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return

    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = selectedOption
    setAnswers(newAnswers)

    // Avanzar a la siguiente pregunta o mostrar resumen
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
    }
  }

  const handleGoToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setSelectedOption(answers[index])
  }

  const handleSubmitTest = async () => {
    // Verificar que todas las preguntas estén respondidas
    const unanswered = answers.findIndex(a => a === null)
    if (unanswered !== -1) {
      setCurrentQuestionIndex(unanswered)
      return
    }

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
          <span>{answeredCount} respondidas</span>
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
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedOption === index
                      ? 'border-forest bg-forest/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                      selectedOption === index
                        ? 'bg-forest text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {selectedOption === index && (
                      <CheckCircle className="w-5 h-5 text-forest" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navegación entre preguntas */}
        <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
          {shuffledQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => handleGoToQuestion(index)}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                index === currentQuestionIndex
                  ? 'bg-forest text-white'
                  : answers[index] !== null
                    ? 'bg-forest/20 text-forest'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(prev => prev - 1)
                setSelectedOption(answers[currentQuestionIndex - 1])
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800"
          >
            ← Anterior
          </button>

          <div className="flex gap-3">
            {currentQuestionIndex < shuffledQuestions.length - 1 ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={selectedOption === null}
                className="px-6 py-3 bg-forest text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-forest/90 transition-colors flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (selectedOption !== null) {
                    const newAnswers = [...answers]
                    newAnswers[currentQuestionIndex] = selectedOption
                    setAnswers(newAnswers)
                  }
                  handleSubmitTest()
                }}
                disabled={submitting || answeredCount < shuffledQuestions.length - 1}
                className="px-6 py-3 bg-gradient-to-r from-forest to-sage text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Finalizar Test
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Aviso de preguntas sin responder */}
        {answeredCount < shuffledQuestions.length && (
          <div className="mt-4 flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>
              {shuffledQuestions.length - answeredCount} pregunta(s) sin responder
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
