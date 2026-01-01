import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Home, Briefcase, Smartphone, BookOpen, Users, Info, Mail, Scale, Shield, MapPin } from 'lucide-react'
import { cities } from '@/lib/cities'

export const metadata: Metadata = {
  title: 'Hakadogs - Mapa del Sitio',
  description: 'Navegación completa del sitio web de Hakadogs - Educación Canina Profesional',
}

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-dark to-forest text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-4 mb-4">
            <FileText size={48} />
            <h1 className="text-5xl font-bold">Mapa del Sitio</h1>
          </div>
          <p className="text-xl text-white/90">Navegación completa de Hakadogs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Páginas Principales */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center">
                <Home size={24} className="text-forest" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark">Principal</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Servicios
                </Link>
              </li>
              <li>
                <Link href="/apps" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Apps
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Blog
                </Link>
              </li>
              <li>
                <Link href="/metodologia" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Metodología
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase size={24} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark">Servicios</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/servicios/educacion-basica" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Educación Básica
                </Link>
              </li>
              <li>
                <Link href="/servicios/modificacion-conducta" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Modificación de Conducta
                </Link>
              </li>
              <li>
                <Link href="/servicios/cachorros" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Educación de Cachorros
                </Link>
              </li>
              <li>
                <Link href="/servicios/clases-grupales" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Clases Grupales
                </Link>
              </li>
            </ul>
          </div>

          {/* Apps */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Smartphone size={24} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark">Apps</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/apps#hakahealth" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> HakaHealth
                </Link>
              </li>
              <li>
                <Link href="/apps#hakatrainer" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> HakaTrainer
                </Link>
              </li>
              <li>
                <Link href="/apps#hakacommunity" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> HakaCommunity
                </Link>
              </li>
            </ul>
          </div>

          {/* Blog */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen size={24} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark">Blog</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/blog" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Todos los Artículos
                </Link>
              </li>
              <li>
                <Link href="/blog/5-ejercicios-basicos-cachorro" className="text-gray-700 hover:text-forest transition flex items-center text-sm">
                  <span className="mr-2">→</span> 5 Ejercicios Básicos para Cachorro
                </Link>
              </li>
              <li>
                <Link href="/blog/alimentacion-saludable-perro" className="text-gray-700 hover:text-forest transition flex items-center text-sm">
                  <span className="mr-2">→</span> Alimentación Saludable
                </Link>
              </li>
            </ul>
          </div>

          {/* Autenticación */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark">Usuario</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/login" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link href="/auth/registro" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Registrarse
                </Link>
              </li>
              <li>
                <Link href="/cliente/dashboard" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Panel de Cliente
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Scale size={24} className="text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-forest-dark">Legal</h2>
            </div>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/privacidad" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos" className="text-gray-700 hover:text-forest transition flex items-center">
                  <span className="mr-2">→</span> Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Localidades */}
        <div className="mt-12">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                <MapPin size={24} className="text-gold" />
              </div>
              <h2 className="text-3xl font-bold text-forest-dark">Localidades</h2>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-forest-dark mb-4">Región de Murcia</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cities.filter(city => city.region === 'Región de Murcia').map(city => (
                  <Link 
                    key={city.slug} 
                    href={`/localidades/${city.slug}`}
                    className="text-gray-700 hover:text-forest transition flex items-center p-3 rounded-lg hover:bg-forest/5"
                  >
                    <span className="mr-2">→</span> {city.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-forest-dark mb-4">Comunidad Valenciana</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cities.filter(city => city.region === 'Comunidad Valenciana').map(city => (
                  <Link 
                    key={city.slug} 
                    href={`/localidades/${city.slug}`}
                    className="text-gray-700 hover:text-forest transition flex items-center p-3 rounded-lg hover:bg-forest/5"
                  >
                    <span className="mr-2">→</span> {city.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-forest-dark mb-4">Otras Regiones</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cities.filter(city => 
                  city.region !== 'Región de Murcia' && 
                  city.region !== 'Comunidad Valenciana'
                ).map(city => (
                  <Link 
                    key={city.slug} 
                    href={`/localidades/${city.slug}`}
                    className="text-gray-700 hover:text-forest transition flex items-center p-3 rounded-lg hover:bg-forest/5"
                  >
                    <span className="mr-2">→</span> {city.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-forest/5 rounded-lg p-6 mt-8">
              <p className="text-forest-dark font-semibold mb-2">
                <strong>Total de localidades:</strong> {cities.length}
              </p>
              <p className="text-gray-600 text-sm">
                Servicio profesional de educación canina en todas estas ciudades y alrededores
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-forest-dark to-forest text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">¿No encuentras lo que buscas?</h2>
          <p className="text-xl text-white/90 mb-6">Contáctanos y te ayudaremos</p>
          <Link href="/contacto" className="btn-primary bg-gold hover:bg-gold/90 text-forest-dark inline-block">
            Contactar
          </Link>
        </div>
      </div>
    </div>
  )
}
