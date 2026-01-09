'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSession } from '@/lib/supabase/auth'
import { Loader2 } from 'lucide-react'

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await getSession()
        const session = data?.session
        
        if (!session) {
          router.push(`/cursos/auth/login?redirect=${encodeURIComponent(pathname)}`)
          return
        }

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

  return <>{children}</>
}
