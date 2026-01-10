'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-1">
            {/* Logo */}
            <div className="flex flex-col items-center md:items-start mb-6">
              <div className="relative h-16 w-16 mb-4">
                <Image
                  src="/images/hakadogs_logo_cara_transparente_vf.webp"
                  alt="Hakadogs"
                  width={64}
                  height={64}
                  className="object-contain brightness-0 invert"
                  quality={85}
                />
              </div>
              <div className="text-lg font-bold text-sage">BE HAKA!</div>
            </div>
            
            <p className="text-sm text-gray-300 mb-4 text-center md:text-left">
              Educación canina profesional con más de 15 años de experiencia.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-bold text-lg mb-4">Navegación</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-gold transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-300 hover:text-gold transition">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/metodologia" className="text-gray-300 hover:text-gold transition">
                  Metodología
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-300 hover:text-gold transition">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/apps" className="text-gray-300 hover:text-gold transition">
                  Apps
                </Link>
              </li>
              <li>
                <Link href="/cursos" className="text-gray-300 hover:text-gold transition">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-gold transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Apps */}
          <div>
            <h3 className="font-bold text-lg mb-4">Nuestras Apps</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">HakaHealth</span>
                <span className="text-gray-500 text-xs ml-2">🚧 Próximamente</span>
              </li>
              <li>
                <span className="text-gray-400">HakaTrainer</span>
                <span className="text-gray-500 text-xs ml-2">🚧 Próximamente</span>
              </li>
              <li>
                <span className="text-gray-400">HakaCommunity</span>
                <span className="text-gray-500 text-xs ml-2">🚧 Próximamente</span>
              </li>
            </ul>

            <h3 className="font-bold text-lg mb-4 mt-8">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/privacidad" className="text-gray-300 hover:text-gold transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos" className="text-gray-300 hover:text-gold transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-gray-300 hover:text-gold transition">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    // Llamar a la función global para abrir el panel
                    if (typeof window !== 'undefined' && (window as any).openCookieSettings) {
                      (window as any).openCookieSettings()
                    }
                  }}
                  className="text-gray-300 hover:text-gold transition text-left"
                >
                  ⚙️ Configurar Cookies
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 flex-shrink-0 mt-1 text-sage" />
                <span className="text-sm text-gray-300">
                  Murcia, España
                </span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="mr-2 flex-shrink-0 mt-1 text-sage" />
                <a href="tel:+34685648241" className="text-sm text-gray-300 hover:text-gold transition">
                  685 64 82 41
                </a>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-2 flex-shrink-0 mt-1 text-sage" />
                <a href="mailto:info@hakadogs.com" className="text-sm text-gray-300 hover:text-gold transition">
                  info@hakadogs.com
                </a>
              </li>
            </ul>

            {/* Redes sociales */}
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">Síguenos</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/hakadogs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-gold transition"
                  aria-label="Visitar página de Facebook de Hakadogs"
                >
                  <Facebook size={24} />
                </a>
                <a 
                  href="https://instagram.com/hakadogs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-gold transition"
                  aria-label="Visitar perfil de Instagram de Hakadogs"
                >
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Hakadogs. Todos los derechos reservados.
            </p>

            {/* Enlaces legales */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/legal/privacidad" className="text-gray-400 hover:text-gold transition">
                Política de Privacidad
              </Link>
              <Link href="/legal/terminos" className="text-gray-400 hover:text-gold transition">
                Términos y Condiciones
              </Link>
              <Link href="/legal/cookies" className="text-gray-400 hover:text-gold transition">
                Política de Cookies
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-gold transition">
                Mapa del Sitio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
