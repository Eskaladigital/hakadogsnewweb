import { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ExternalLink, Lock } from 'lucide-react'
import { cities } from '@/lib/cities'

export const metadata: Metadata = {
  title: 'Sitemap HTML - Todas las URLs',
  description: 'Lista completa de todas las URLs del sitio web',
  robots: {
    index: false,
    follow: false,
  }
}

export default function SitemapHTMLPage() {
  const baseUrl = 'https://www.hakadogs.com'

  // Páginas principales
  const mainPages = [
    { url: '/', title: 'Inicio', priority: '1.0' },
    { url: '/sobre-nosotros', title: 'Sobre Nosotros', priority: '0.8' },
    { url: '/metodologia', title: 'Metodología', priority: '0.7' },
    { url: '/servicios', title: 'Servicios', priority: '0.9' },
    { url: '/apps', title: 'Apps', priority: '0.7' },
    { url: '/cursos', title: 'Cursos', priority: '0.9' },
    { url: '/contacto', title: 'Contacto', priority: '0.9' },
    { url: '/blog', title: 'Blog', priority: '0.7' },
  ]

  // Servicios
  const servicePages = [
    { url: '/servicios/educacion-basica', title: 'Educación Básica', priority: '0.8' },
    { url: '/servicios/modificacion-conducta', title: 'Modificación de Conducta', priority: '0.8' },
    { url: '/servicios/cachorros', title: 'Educación de Cachorros', priority: '0.8' },
    { url: '/servicios/clases-grupales', title: 'Clases Grupales', priority: '0.8' },
  ]

  // Cursos
  const coursePages = [
    { url: '/cursos/auth/login', title: 'Login', priority: '0.3' },
    { url: '/cursos/auth/registro', title: 'Registro', priority: '0.3' },
    { url: '/cursos/mi-escuela', title: 'Mi Escuela', priority: '0.5' },
  ]

  // Legal
  const legalPages = [
    { url: '/legal/privacidad', title: 'Política de Privacidad', priority: '0.2' },
    { url: '/legal/terminos', title: 'Términos y Condiciones', priority: '0.2' },
    { url: '/legal/cookies', title: 'Política de Cookies', priority: '0.2' },
  ]

  // Otras
  const otherPages = [
    { url: '/sitemap', title: 'Mapa del Sitio (Público)', priority: '0.3' },
    { url: '/sitemap.xml', title: 'Sitemap XML', priority: '0.3', external: true },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header con advertencia */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Lock className="w-8 h-8 text-yellow-600" />
            <h1 className="text-2xl font-bold text-yellow-900">
              🔒 Página Administrativa - Sitemap HTML
            </h1>
          </div>
          <p className="text-yellow-800 text-sm">
            Esta página es solo para uso interno del administrador. No está indexada por buscadores 
            y no aparece en la navegación pública del sitio.
          </p>
          <p className="text-yellow-700 text-xs mt-2">
            <strong>Total de URLs:</strong> {
              mainPages.length + 
              servicePages.length + 
              coursePages.length + 
              legalPages.length + 
              otherPages.length + 
              cities.length
            } páginas
          </p>
        </div>

        {/* Páginas Principales */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-forest" />
            <h2 className="text-2xl font-bold text-forest-dark">
              Páginas Principales ({mainPages.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Título</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prioridad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {mainPages.map((page) => (
                  <tr key={page.url} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">{page.url}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{page.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{page.priority}</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={page.url}
                        target="_blank"
                        className="text-forest hover:text-forest-dark text-sm inline-flex items-center gap-1"
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Servicios */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-forest-dark">
              Servicios ({servicePages.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Título</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prioridad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {servicePages.map((page) => (
                  <tr key={page.url} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">{page.url}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{page.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{page.priority}</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={page.url}
                        target="_blank"
                        className="text-forest hover:text-forest-dark text-sm inline-flex items-center gap-1"
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cursos */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-gold" />
            <h2 className="text-2xl font-bold text-forest-dark">
              Cursos y Autenticación ({coursePages.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Título</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prioridad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {coursePages.map((page) => (
                  <tr key={page.url} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">{page.url}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{page.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{page.priority}</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={page.url}
                        target="_blank"
                        className="text-forest hover:text-forest-dark text-sm inline-flex items-center gap-1"
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Localidades */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-forest-dark">
              Localidades - SEO Local ({cities.length})
            </h2>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-purple-800">
              <strong>📍 Importante para SEO:</strong> Estas {cities.length} páginas están optimizadas 
              para búsquedas locales en toda la Región de Murcia y alrededores.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ciudad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Región</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prioridad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.slug} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">/adiestramiento-canino/{city.slug}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{city.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{city.region}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">0.85</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={`/adiestramiento-canino/${city.slug}`}
                        target="_blank"
                        className="text-forest hover:text-forest-dark text-sm inline-flex items-center gap-1"
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-forest-dark">
              Páginas Legales ({legalPages.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Título</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prioridad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {legalPages.map((page) => (
                  <tr key={page.url} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">{page.url}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{page.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{page.priority}</td>
                    <td className="py-3 px-4">
                      <Link 
                        href={page.url}
                        target="_blank"
                        className="text-forest hover:text-forest-dark text-sm inline-flex items-center gap-1"
                      >
                        Ver <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Otras páginas */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-forest-dark">
              Otras Páginas ({otherPages.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">URL</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Título</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Prioridad</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Acción</th>
                </tr>
              </thead>
              <tbody>
                {otherPages.map((page) => (
                  <tr key={page.url} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">{page.url}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{page.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{page.priority}</td>
                    <td className="py-3 px-4">
                      {page.external ? (
                        <a 
                          href={`${baseUrl}${page.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-forest hover:text-forest-dark text-sm inline-flex items-center gap-1"
                        >
                          Ver <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link 
                          href={page.url}
                          target="_blank"
                          className="text-forest hover:text-forest-dark text-sm inline-flex items-center gap-1"
                        >
                          Ver <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen final */}
        <div className="bg-gradient-to-r from-forest to-forest-dark text-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">📊 Resumen del Sitemap</h3>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-gold mb-1">
                {mainPages.length + servicePages.length + coursePages.length + legalPages.length + otherPages.length + cities.length}
              </p>
              <p className="text-sm text-white/80">Total de URLs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-gold mb-1">{cities.length}</p>
              <p className="text-sm text-white/80">Páginas SEO Local</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-gold mb-1">{servicePages.length}</p>
              <p className="text-sm text-white/80">Servicios</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-3xl font-bold text-gold mb-1">{legalPages.length}</p>
              <p className="text-sm text-white/80">Páginas Legales</p>
            </div>
          </div>
          <p className="text-white/70 text-sm mt-6">
            Esta página no está indexada por buscadores (noindex, nofollow)
          </p>
        </div>
      </div>
    </div>
  )
}
