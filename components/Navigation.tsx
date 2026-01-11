'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'
import { getSession, signOut } from '@/lib/supabase/auth'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Verificar si hay sesión de Supabase
    const checkSession = async () => {
      const { data } = await getSession()
      if (data.session) {
        setIsLoggedIn(true)
        setUserName(data.session.user.user_metadata.name || data.session.user.email.split('@')[0])
      }
    }
    checkSession()
  }, [])

  const handleLogout = async () => {
    await signOut()
    setIsLoggedIn(false)
    setUserName('')
    window.location.href = '/cursos'
  }

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { href: '/metodologia', label: 'Metodología' },
    { href: '/servicios', label: 'Servicios' },
    { href: '/apps', label: 'Apps' },
    { href: '/cursos', label: 'Cursos' },
    { href: '/blog', label: 'Blog' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {/* Logo completo en desktop */}
            <div className="hidden sm:block relative h-20 w-56 py-3 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo_definitivo_hakadogs.webp"
                alt="Hakadogs - Educación Canina"
                width={280}
                height={79}
                className="object-contain object-left"
                priority
                fetchPriority="high"
                quality={95}
              />
            </div>
            {/* Logo en móvil */}
            <div className="sm:hidden relative h-16 w-40 py-2 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo_definitivo_hakadogs.webp"
                alt="Hakadogs - Educación Canina"
                width={210}
                height={59}
                className="object-contain object-left"
                priority
                fetchPriority="high"
                quality={95}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-forest font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/cursos/mi-escuela"
                  className="flex items-center space-x-2 bg-forest/10 text-forest hover:bg-forest/20 font-semibold px-5 py-2 rounded-lg transition-all"
                >
                  <User size={18} />
                  <span>{userName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-5 py-2 rounded-lg transition-all"
                >
                  <LogOut size={18} />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/cursos/auth/login"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg transition-all"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/cursos/auth/registro"
                  className="bg-gradient-to-r from-forest to-sage text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label={isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-forest font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Auth Buttons Mobile */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/cursos/mi-escuela"
                    className="flex items-center space-x-2 w-full bg-forest/10 text-forest hover:bg-forest/20 font-semibold px-5 py-3 rounded-lg transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={18} />
                    <span>{userName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="flex items-center space-x-2 w-full bg-red-50 text-red-600 hover:bg-red-100 font-semibold px-5 py-3 rounded-lg transition-all"
                  >
                    <LogOut size={18} />
                    <span>Salir</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/cursos/auth/login"
                    className="block w-full bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold px-6 py-2 rounded-lg transition-all text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/cursos/auth/registro"
                    className="block w-full bg-gradient-to-r from-forest to-sage text-white font-semibold px-6 py-2 rounded-lg hover:opacity-90 transition-all text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
