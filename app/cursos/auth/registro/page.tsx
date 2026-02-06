'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react'
import { signUp } from '@/lib/supabase/auth'
import Script from 'next/script'

// Declarar tipo global para grecaptcha
declare global {
  interface Window {
    grecaptcha: any
  }
}

export default function CursosRegistroPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  
  // 🍯 Honeypot field - campo trampa para bots
  const [honeypot, setHoneypot] = useState('')

  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfW9WIsAAAAAA2Zcmg8uFiNXvrO_2-56d6mLmYr'

  // Verificar reCAPTCHA con el backend
  const verifyRecaptcha = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/verify-recaptcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()
      
      if (!response.ok || !data.success) {
        console.error('❌ Verificación de reCAPTCHA fallida:', data.error)
        setError(data.error || 'Verificación de seguridad fallida. Por favor, intenta de nuevo.')
        return false
      }

      console.log('✅ reCAPTCHA verificado (score:', data.score, ')')
      return true
    } catch (err) {
      console.error('❌ Error verificando reCAPTCHA:', err)
      setError('Error en la verificación de seguridad. Por favor, intenta de nuevo.')
      return false
    }
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // 🍯 Verificación Honeypot - Si el campo oculto tiene valor, es un bot
    if (honeypot) {
      console.warn('🤖 Bot detectado: honeypot field llenado')
      setError('Registro no permitido.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      // 1. Verificar reCAPTCHA primero
      if (!recaptchaLoaded || !window.grecaptcha) {
        setError('Sistema de seguridad no disponible. Por favor, recarga la página.')
        setLoading(false)
        return
      }

      console.log('🔐 Ejecutando reCAPTCHA...')
      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'registro' })
      
      console.log('🔐 Token obtenido, verificando en servidor...')
      const isVerified = await verifyRecaptcha(recaptchaToken)

      if (!isVerified) {
        setLoading(false)
        return
      }

      // 2. Si la verificación es exitosa, proceder con el registro
      console.log('✅ Verificación exitosa, procediendo con registro...')
      const { data, error: signUpError } = await signUp(email, password, name)

      if (signUpError) {
        // Si el mensaje indica verificación de email, mostrar como éxito
        if (signUpError.message.includes('verifica tu email')) {
          setSuccess(signUpError.message)
          setLoading(false)
          return
        }
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Si hay data, el usuario se registró y autenticó automáticamente
      if (data) {
        // Hacer hard refresh para actualizar la navegación y mostrar el usuario logueado
        window.location.href = '/cursos/mi-escuela'
      }
    } catch (err) {
      console.error('Error en registro:', err)
      setError('Error al crear la cuenta. Inténtalo de nuevo.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Cargar el script de reCAPTCHA v3 */}
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
        onLoad={() => {
          console.log('✅ reCAPTCHA script cargado')
          setRecaptchaLoaded(true)
        }}
        onError={() => {
          console.error('❌ Error cargando reCAPTCHA')
          setError('Error cargando el sistema de seguridad. Por favor, recarga la página.')
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-forest to-sage rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
                <p className="text-gray-600">Comienza tu aprendizaje hoy mismo</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">{success}</p>
                </div>
              )}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Al registrarte obtienes:
                </h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✓ Acceso al curso gratuito inmediatamente</li>
                  <li>✓ Progreso guardado automáticamente</li>
                  <li>✓ Certificados al completar cursos</li>
                </ul>
              </div>

              <form onSubmit={handleRegistro} className="space-y-6">
                {/* 🍯 HONEYPOT FIELD - Campo trampa oculto para bots */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">No llenar este campo (anti-spam)</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repite tu contraseña"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !recaptchaLoaded}
                  className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin flex-shrink-0" size={20} />
                      Creando cuenta...
                    </>
                  ) : !recaptchaLoaded ? (
                    <>
                      <Loader2 className="mr-2 animate-spin flex-shrink-0" size={20} />
                      Cargando seguridad...
                    </>
                  ) : (
                    <>
                      Crear Cuenta
                      <ArrowRight className="ml-2 flex-shrink-0" size={20} />
                    </>
                  )}
                </button>

                {/* Indicador de protección reCAPTCHA */}
                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Shield className="w-3 h-3 mr-1" />
                  <span>Protegido por Google reCAPTCHA</span>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/cursos/auth/login" className="text-forest font-semibold hover:text-forest-dark">
                    Inicia sesión
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <Link href="/cursos" className="text-sm text-gray-600 hover:text-gray-900">
                  ← Volver a Cursos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
