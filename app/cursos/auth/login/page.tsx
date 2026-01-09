'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { signIn } from '@/lib/supabase/auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: loginError } = await signIn(email, password)
      
      if (loginError || !data) {
        setError(loginError?.message || 'Error al iniciar sesión')
        setLoading(false)
        return
      }

      // Obtener la URL de redirección o usar default
      const redirectUrl = searchParams?.get('redirect') || '/cursos/mi-escuela'
      
      // Si intenta acceder a /administrator pero no es admin, redirigir a mi-escuela
      if (redirectUrl.includes('/administrator') && data.user.user_metadata.role !== 'admin') {
        router.push('/cursos/mi-escuela')
        setLoading(false)
        return
      }
      
      // Redirigir a la URL solicitada
      router.push(redirectUrl)
    } catch (err) {
      console.error('Error en login:', err)
      setError('Error al iniciar sesión. Verifica tus credenciales.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-forest to-sage rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h1>
              <p className="text-gray-600">Accede a tus cursos de educación canina</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
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
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                {!loading && <ArrowRight className="ml-2 flex-shrink-0" size={20} />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link href="/cursos/auth/registro" className="text-forest font-semibold hover:text-forest-dark">
                  Regístrate gratis
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
  )
}

export default function CursosLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-forest to-sage rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
