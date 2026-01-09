'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, LogOut } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Verificar si hay sesión
    const session = localStorage.getItem('hakadogs_cursos_session')
    if (session) {
      const data = JSON.parse(session)
      setIsLoggedIn(data.loggedIn)
      setUserName(data.name)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('hakadogs_cursos_session')
    setIsLoggedIn(false)
    setUserName('')
    window.location.href = '/cursos'
  }

  const navLinks = [
    { href: '/servicios', label: 'Servicios' },
    { href: '/apps', label: 'Apps' },
    { href: '/cursos', label: 'Cursos' },
    { href: '/metodologia', label: 'Metodología' },
    { href: '/blog', label: 'Blog' },
    { href: '/sobre-nosotros', label: 'Sobre Nosotros' },
    { href: '/contacto', label: 'Contacto' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            {/* Logo completo en desktop */}
            <div className="hidden sm:block relative h-20 w-64 group-hover:scale-105 transition-transform">
              <Image
                src="/images/hakadogs-02.png"
                alt="Hakadogs - Educación Canina"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {/* Logo en móvil - hakadogs-04.png */}
            <div className="sm:hidden relative h-16 w-48 group-hover:scale-105 transition-transform">
              <Image
                src="/images/hakadogs-04.png"
                alt="Hakadogs - Educación Canina"
                fill
                className="object-contain object-left"
                priority
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
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/cursos/mi-escuela"
                  className="flex items-center space-x-2 text-gray-700 hover:text-forest font-medium transition-colors"
                >
                  <User size={20} />
                  <span>{userName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  <LogOut size={20} />
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
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/cursos/mi-escuela"
                    className="flex items-center space-x-2 py-2 text-gray-700 hover:text-forest font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} />
                    <span>{userName}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="flex items-center space-x-2 w-full py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    <LogOut size={20} />
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
