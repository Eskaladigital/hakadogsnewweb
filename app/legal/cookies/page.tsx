'use client'

import Link from 'next/link'
import { Cookie, Shield, ChevronRight } from 'lucide-react'

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-dark to-forest text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-4 mb-4">
            <Cookie size={48} />
            <h1 className="text-4xl md:text-5xl font-bold">Política de Cookies</h1>
          </div>
          <p className="text-xl text-white/90">
            Información sobre el uso de cookies en nuestro sitio web
          </p>
          <p className="text-sm text-white/70 mt-4">
            Última actualización: 6 de Enero de 2026
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Botón para modificar preferencias */}
        <div className="bg-forest/5 border-2 border-forest/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-forest" />
            <div className="flex-1">
              <h3 className="font-bold text-forest-dark text-lg mb-1">
                Gestiona tus preferencias de cookies
              </h3>
              <p className="text-gray-600 text-sm">
                Puedes modificar tus preferencias en cualquier momento
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('hakadogs_cookie_consent')
                window.location.reload()
              }}
              className="bg-forest hover:bg-forest-dark text-white px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap"
            >
              Modificar cookies
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Qué son las cookies */}
          <section>
            <h2 className="text-2xl font-bold text-forest-dark mb-4 flex items-center gap-2">
              <ChevronRight className="text-forest" />
              ¿Qué son las cookies?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo 
              mientras navegas. Se utilizan ampliamente para hacer que los sitios web funcionen de 
              manera más eficiente, así como para proporcionar información a los propietarios del sitio.
            </p>
            <p className="text-gray-700 leading-relaxed">
              En Hakadogs utilizamos cookies para mejorar tu experiencia de navegación, analizar el 
              tráfico del sitio y personalizar el contenido según tus preferencias.
            </p>
          </section>

          {/* Tipos de cookies que utilizamos */}
          <section>
            <h2 className="text-2xl font-bold text-forest-dark mb-4 flex items-center gap-2">
              <ChevronRight className="text-forest" />
              Tipos de cookies que utilizamos
            </h2>

            <div className="space-y-6">
              {/* Cookies necesarias */}
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-xl font-bold text-forest-dark mb-2">
                  🔒 Cookies necesarias (Obligatorias)
                </h3>
                <p className="text-gray-700 mb-3">
                  Estas cookies son esenciales para que el sitio web funcione correctamente. 
                  No se pueden desactivar en nuestros sistemas.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-sm text-gray-700 mb-2">Ejemplos:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Sesión de usuario:</strong> Mantiene tu sesión activa mientras navegas</li>
                    <li>• <strong>Preferencias de cookies:</strong> Recuerda tus preferencias de cookies</li>
                    <li>• <strong>Seguridad:</strong> Protege contra ataques maliciosos</li>
                    <li>• <strong>Duración:</strong> Sesión o hasta 1 año</li>
                  </ul>
                </div>
              </div>

              {/* Cookies analíticas */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-xl font-bold text-forest-dark mb-2">
                  📊 Cookies analíticas (Opcionales)
                </h3>
                <p className="text-gray-700 mb-3">
                  Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, 
                  recopilando y reportando información de manera anónima.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-sm text-gray-700 mb-2">Servicios utilizados:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Google Analytics (G-NXPT2KNYGJ):</strong> Análisis de tráfico web</li>
                    <li>• <strong>Información recopilada:</strong> Páginas visitadas, tiempo en el sitio, dispositivo usado</li>
                    <li>• <strong>Finalidad:</strong> Mejorar la experiencia del usuario</li>
                    <li>• <strong>Duración:</strong> Hasta 2 años</li>
                  </ul>
                </div>
              </div>

              {/* Cookies de marketing */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-xl font-bold text-forest-dark mb-2">
                  🎯 Cookies de marketing (Opcionales)
                </h3>
                <p className="text-gray-700 mb-3">
                  Estas cookies se utilizan para mostrar anuncios que son relevantes para ti y 
                  tus intereses. También se usan para limitar el número de veces que ves un anuncio.
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-sm text-gray-700 mb-2">Servicios (futuros):</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Facebook Pixel:</strong> Publicidad dirigida en redes sociales</li>
                    <li>• <strong>Google Ads:</strong> Remarketing y medición de conversiones</li>
                    <li>• <strong>Duración:</strong> Hasta 2 años</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Base legal */}
          <section>
            <h2 className="text-2xl font-bold text-forest-dark mb-4 flex items-center gap-2">
              <ChevronRight className="text-forest" />
              Base legal
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              El uso de cookies en nuestro sitio web se basa en tu consentimiento explícito, excepto 
              para las cookies estrictamente necesarias que son esenciales para el funcionamiento del sitio.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Cumplimos con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea 
              y la Ley de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE) española.
            </p>
          </section>

          {/* Cómo gestionar cookies */}
          <section>
            <h2 className="text-2xl font-bold text-forest-dark mb-4 flex items-center gap-2">
              <ChevronRight className="text-forest" />
              Cómo gestionar las cookies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Puedes controlar y/o eliminar las cookies como desees. Puedes eliminar todas las cookies 
              que ya están en tu dispositivo y puedes configurar la mayoría de los navegadores para 
              evitar que se coloquen.
            </p>
            
            <div className="bg-forest/5 rounded-lg p-6 mb-4">
              <h3 className="font-bold text-forest-dark mb-3">Opciones disponibles:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <ChevronRight className="text-forest mt-1 flex-shrink-0" size={16} />
                  <span><strong>En este sitio:</strong> Usa el botón &quot;Modificar cookies&quot; en la parte superior para cambiar tus preferencias</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="text-forest mt-1 flex-shrink-0" size={16} />
                  <span><strong>En tu navegador:</strong> Configura las opciones de privacidad de tu navegador</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="text-forest mt-1 flex-shrink-0" size={16} />
                  <span><strong>Borrar cookies:</strong> Elimina todas las cookies almacenadas en tu dispositivo</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-sm text-gray-700">
                <strong>⚠️ Importante:</strong> Si decides bloquear o eliminar las cookies, 
                es posible que no puedas utilizar todas las funcionalidades de nuestro sitio web.
              </p>
            </div>
          </section>

          {/* Enlaces a configuración de navegadores */}
          <section>
            <h2 className="text-2xl font-bold text-forest-dark mb-4 flex items-center gap-2">
              <ChevronRight className="text-forest" />
              Configuración por navegador
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="https://support.google.com/chrome/answer/95647" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
              >
                <p className="font-semibold text-forest-dark mb-1">Google Chrome</p>
                <p className="text-sm text-gray-600">Gestionar cookies en Chrome →</p>
              </a>
              <a 
                href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
              >
                <p className="font-semibold text-forest-dark mb-1">Mozilla Firefox</p>
                <p className="text-sm text-gray-600">Gestionar cookies en Firefox →</p>
              </a>
              <a 
                href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
              >
                <p className="font-semibold text-forest-dark mb-1">Safari</p>
                <p className="text-sm text-gray-600">Gestionar cookies en Safari →</p>
              </a>
              <a 
                href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition-colors border border-gray-200"
              >
                <p className="font-semibold text-forest-dark mb-1">Microsoft Edge</p>
                <p className="text-sm text-gray-600">Gestionar cookies en Edge →</p>
              </a>
            </div>
          </section>

          {/* Actualización de la política */}
          <section>
            <h2 className="text-2xl font-bold text-forest-dark mb-4 flex items-center gap-2">
              <ChevronRight className="text-forest" />
              Actualizaciones de esta política
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Podemos actualizar nuestra política de cookies ocasionalmente. Te notificaremos cualquier 
              cambio publicando la nueva política en esta página y actualizando la fecha de &quot;última actualización&quot;.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Te recomendamos revisar esta política periódicamente para estar informado sobre cómo 
              protegemos tu información.
            </p>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-2xl font-bold text-forest-dark mb-4 flex items-center gap-2">
              <ChevronRight className="text-forest" />
              ¿Tienes preguntas?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Si tienes alguna pregunta sobre nuestra política de cookies, puedes contactarnos:
            </p>
            <div className="bg-forest/5 rounded-lg p-6">
              <ul className="space-y-2 text-gray-700">
                <li>📧 <strong>Email:</strong> info@hakadogs.com</li>
                <li>📱 <strong>Teléfono:</strong> +34 685 64 82 41</li>
                <li>🌐 <strong>Web:</strong> <Link href="/contacto" className="text-forest hover:underline">Formulario de contacto</Link></li>
              </ul>
            </div>
          </section>

          {/* Enlaces relacionados */}
          <section className="pt-8 border-t-2 border-gray-100">
            <h3 className="font-bold text-forest-dark mb-4">Documentos relacionados:</h3>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/legal/privacidad" 
                className="text-forest hover:text-forest-dark underline"
              >
                Política de Privacidad
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/legal/terminos" 
                className="text-forest hover:text-forest-dark underline"
              >
                Términos y Condiciones
              </Link>
              <span className="text-gray-300">•</span>
              <Link 
                href="/contacto" 
                className="text-forest hover:text-forest-dark underline"
              >
                Contacto
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
