'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import UserMenu from '@/components/ui/UserMenu'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/servicios', label: 'Servicios' },
    { href: '/apps', label: 'Apps' },
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
            <div className="hidden sm:block relative h-14 w-48 group-hover:scale-105 transition-transform">
              <Image
                src="/images/hakadogs-02.png"
                alt="Hakadogs - Educación Canina"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            {/* Logo en móvil - hakadogs-04.png */}
            <div className="sm:hidden relative h-10 w-32 group-hover:scale-105 transition-transform">
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

          {/* User Menu / Auth Buttons */}
          <div className="hidden lg:block">
            <UserMenu />
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
            <div className="pt-4 border-t border-gray-200">
              <UserMenu />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
