'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSession } from '@/lib/supabase/auth'
import { Metadata } from 'next'

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await getSession()
      const session = data?.session
      
      if (!session || session.user?.user_metadata?.role !== 'admin') {
        router.push(`/cursos/auth/login?redirect=${encodeURIComponent(pathname)}`)
      }
    }
    
    checkAuth()
  }, [router, pathname])

  return <>{children}</>
}
