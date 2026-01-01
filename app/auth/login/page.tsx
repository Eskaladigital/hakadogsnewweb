'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authenticateLocal } from '@/lib/auth/mockAuth'
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = authenticateLocal(email, password)

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Redirigir según el rol
      const userRole = data?.user?.user_metadata?.role
      if (userRole === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/apps')
      }
      router.refresh()
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream via-white to-sage/10 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">H</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-forest-dark mt-4">
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 mt-2">
            Accede a tu cuenta de Hakadogs
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Credenciales de Prueba */}
          <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-blue-900 mb-2">🔑 Usuarios de Prueba:</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <div>
                <p className="font-medium">👨‍💼 ADMIN:</p>
                <p>Email: <code className="bg-white px-2 py-0.5 rounded">narciso.pardo@outlook.com</code></p>
                <p>Password: <code className="bg-white px-2 py-0.5 rounded">Hacka2016@</code></p>
              </div>
              <div className="pt-2 border-t border-blue-200">
                <p className="font-medium">👤 USER:</p>
                <p>Email: <code className="bg-white px-2 py-0.5 rounded">user@hakadogs.com</code></p>
                <p>Password: <code className="bg-white px-2 py-0.5 rounded">Hacka2016@</code></p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-forest focus:border-transparent transition"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-forest focus:border-transparent transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-forest focus:ring-forest" />
                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
              </label>
              <Link href="/auth/recuperar" className="text-sm text-forest hover:text-forest-dark">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              {!loading && <ArrowRight className="ml-2 flex-shrink-0" size={20} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/auth/registro" className="text-forest font-semibold hover:text-forest-dark">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          ¿Problemas para acceder?{' '}
          <Link href="/contacto" className="text-forest hover:text-forest-dark">
            Contáctanos
          </Link>
        </p>
      </div>
    </div>
  )
}
