import Link from 'next/link'
import { Home, Search, BookOpen, Briefcase, Phone, ArrowRight, DogIcon } from 'lucide-react'

export default function NotFound() {
  const quickLinks = [
    {
      icon: Home,
      title: 'Inicio',
      description: 'Volver a la página principal',
      href: '/',
      color: 'forest'
    },
    {
      icon: Briefcase,
      title: 'Servicios',
      description: 'Educación canina presencial',
      href: '/servicios',
      color: 'blue'
    },
    {
      icon: BookOpen,
      title: 'Cursos Online',
      description: 'Formación desde casa',
      href: '/cursos',
      color: 'gold'
    },
    {
      icon: Phone,
      title: 'Contacto',
      description: 'Ponte en contacto',
      href: '/contacto',
      color: 'sage'
    }
  ]

  const popularPages = [
    { title: 'Sobre Nosotros', href: '/sobre-nosotros' },
    { title: 'Metodología', href: '/metodologia' },
    { title: 'Apps', href: '/apps' },
    { title: 'Blog', href: '/blog' },
    { title: 'Educación Básica', href: '/servicios/educacion-basica' },
    { title: 'Modificación de Conducta', href: '/servicios/modificacion-conducta' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-sage/10 to-forest/5 flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        
        {/* Ilustración y mensaje principal */}
        <div className="text-center mb-12">
          {/* Icono de perro grande */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-forest/10 rounded-full mb-6 animate-bounce">
            <DogIcon className="w-16 h-16 text-forest" strokeWidth={1.5} />
          </div>
          
          {/* Código de error */}
          <div className="mb-6">
            <h1 className="text-8xl md:text-9xl font-bold text-forest/20 mb-2">404</h1>
            <div className="flex items-center justify-center gap-2 text-forest-dark">
              <Search className="w-6 h-6" />
              <p className="text-2xl md:text-3xl font-bold">¡Ups! Página no encontrada</p>
            </div>
          </div>

          {/* Mensaje descriptivo */}
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-lg text-gray-600 mb-3">
              Parece que esta página se ha ido a perseguir ardillas 🐿️
            </p>
            <p className="text-gray-600">
              La URL que buscas no existe o ha sido movida. Pero no te preocupes, 
              <strong className="text-forest"> tenemos muchas otras páginas interesantes para ti</strong>.
            </p>
          </div>

          {/* Botón principal */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-forest hover:bg-forest-dark text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Volver al Inicio
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Enlaces rápidos en cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link 
                key={link.href}
                href={link.href}
                className="bg-white hover:bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] border-2 border-transparent hover:border-forest/20"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-${link.color}/10 rounded-xl mb-3`}>
                  <Icon className={`w-6 h-6 text-${link.color === 'forest' ? 'forest' : link.color === 'gold' ? 'gold' : 'forest'}`} />
                </div>
                <h3 className="font-bold text-forest-dark mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            )
          })}
        </div>

        {/* Páginas populares */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-forest/10">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-6 h-6 text-forest" />
            <h2 className="text-xl font-bold text-forest-dark">Páginas más visitadas</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {popularPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="flex items-center gap-2 text-gray-700 hover:text-forest hover:bg-forest/5 px-4 py-3 rounded-lg transition-all group"
              >
                <ArrowRight className="w-4 h-4 text-forest group-hover:translate-x-1 transition-transform" />
                <span>{page.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Ayuda adicional */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-3">
            ¿Necesitas ayuda? Estamos aquí para ti
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/contacto" className="text-forest hover:text-forest-dark underline">
              Contactar por formulario
            </Link>
            <span className="text-gray-300">•</span>
            <a href="tel:+34685648241" className="text-forest hover:text-forest-dark underline">
              Llamar: 685 64 82 41
            </a>
            <span className="text-gray-300">•</span>
            <a href="mailto:info@hakadogs.com" className="text-forest hover:text-forest-dark underline">
              Email: info@hakadogs.com
            </a>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <div className="text-center mt-8 p-6 bg-forest/5 rounded-xl border border-forest/10">
          <p className="text-forest-dark font-semibold mb-1">
            💚 BE HAKA!
          </p>
          <p className="text-sm text-gray-600">
            Educación canina profesional con más de 8 años de experiencia y +500 perros educados
          </p>
        </div>
      </div>
    </div>
  )
}
