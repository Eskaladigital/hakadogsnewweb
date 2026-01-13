'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/supabase/auth'
import { Loader2, LayoutDashboard, Users, BookOpen, Mail, LogOut, FileText, Trophy, ClipboardCheck, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getSession()
        const session = data?.session
        
        if (!session) {
          router.push(`/cursos/auth/login?redirect=${encodeURIComponent(pathname)}`)
          return
        }

        setUserEmail(session.user.email || '')
        const role = session.user?.user_metadata?.role
        console.log('🔍 Verificando rol admin:', { role, email: session.user?.email })
        
        if (role !== 'admin') {
          console.log('❌ Usuario no es admin, redirigiendo...')
          router.push(`/cursos/auth/login?redirect=${encodeURIComponent(pathname)}`)
          return
        }

        console.log('✅ Usuario autorizado como admin')
        setIsAuthorized(true)
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        router.push(`/cursos/auth/login?redirect=${encodeURIComponent(pathname)}`)
      } finally {
        setIsChecking(false)
      }
    }
    
    checkAuth()
  }, [router, pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, href: '/administrator' },
    { id: 'users', name: 'Usuarios', icon: Users, href: '/administrator/usuarios' },
    { id: 'courses', name: 'Cursos', icon: BookOpen, href: '/administrator/cursos' },
    { id: 'tests', name: 'Tests', icon: ClipboardCheck, href: '/administrator/tests' },
    { id: 'valoraciones', name: 'Valoraciones', icon: Star, href: '/administrator/valoraciones' },
    { id: 'blog', name: 'Blog', icon: FileText, href: '/administrator/blog' },
    { id: 'badges', name: 'Badges', icon: Trophy, href: '/administrator/badges' },
    { id: 'contacts', name: 'Contactos', icon: Mail, href: '/administrator/contactos' },
  ]

  const isActive = (href: string) => {
    if (href === '/administrator') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header del Admin Panel */}
      <div className="bg-gradient-to-r from-forest to-sage text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Panel de Administración</h1>
              <p className="text-white/80">Gestión completa de Hakadogs</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white/60">Administrador</p>
                <p className="font-semibold">{userEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const active = isActive(tab.href)
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-semibold border-b-2 transition whitespace-nowrap
                    ${active 
                      ? 'border-forest text-forest bg-forest/5' 
                      : 'border-transparent text-gray-600 hover:text-forest hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
