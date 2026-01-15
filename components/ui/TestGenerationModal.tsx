'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export interface GenerationStep {
  id: string
  label: string
  status: 'pending' | 'loading' | 'success' | 'error' | 'warning'
  message?: string
  details?: string
}

interface TestGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  steps: GenerationStep[]
  currentStep: number
  canClose: boolean
}

export default function TestGenerationModal({
  isOpen,
  onClose,
  steps,
  currentStep,
  canClose
}: TestGenerationModalProps) {
  const getStepIcon = (step: GenerationStep) => {
    switch (step.status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />
      default:
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        )
    }
  }

  const getStepColor = (step: GenerationStep) => {
    switch (step.status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-amber-200 bg-amber-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const hasError = steps.some(s => s.status === 'error')
  const isComplete = steps.every(s => s.status === 'success' || s.status === 'warning')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={canClose ? onClose : undefined}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {hasError ? (
                  <XCircle className="w-6 h-6 text-red-500" />
                ) : isComplete ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {hasError
                    ? 'Error al generar el test'
                    : isComplete
                    ? 'Test generado exitosamente'
                    : 'Generando test con IA...'}
                </h2>
              </div>
              {canClose && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Steps */}
            <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all ${getStepColor(step)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getStepIcon(step)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{step.label}</p>
                        {step.message && (
                          <p className="text-sm text-gray-600 mt-1">{step.message}</p>
                        )}
                        {step.details && (
                          <p className="text-xs text-gray-500 mt-2 font-mono bg-white/50 p-2 rounded border border-gray-200">
                            {step.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              {!hasError && !isComplete && (
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progreso</span>
                    <span>{currentStep} de {steps.length} pasos</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              {hasError && (
                <p className="text-sm text-red-600 flex-1">
                  Por favor, revisa los errores y vuelve a intentarlo.
                </p>
              )}
              {isComplete && (
                <p className="text-sm text-green-600 flex-1">
                  El test se ha generado correctamente. Puedes revisarlo y publicarlo cuando estés listo.
                </p>
              )}
              {canClose && (
                <button
                  onClick={onClose}
                  className={`px-6 py-2.5 rounded-lg font-medium transition ${
                    hasError
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : isComplete
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {hasError ? 'Cerrar' : isComplete ? 'Entendido' : 'Cancelar'}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
