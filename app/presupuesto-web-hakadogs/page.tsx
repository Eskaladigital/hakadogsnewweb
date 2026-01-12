import { Metadata } from 'next';
import { CheckCircle, TrendingUp, Shield, Zap, Target, Award, BarChart3, Globe, Lock, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Presupuesto Profesional - Hakadogs Platform',
  robots: 'noindex, nofollow', // Importante: no indexar en Google
};

export default function PresupuestoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-cream">
      {/* Header Premium */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-forest-dark text-white py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            PRESUPUESTO PROFESIONAL
          </h1>
          <p className="text-2xl mb-2 text-sage">Plataforma Digital Hakadogs.com</p>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">3.0.1</div>
              <div className="text-sage">Versión</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">40h</div>
              <div className="text-sage">Desarrollo con IA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">5 días</div>
              <div className="text-sage">Tiempo entrega</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">95/100</div>
              <div className="text-sage">Performance</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">100/100</div>
              <div className="text-sage">SEO</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border-2 border-forest/10">
          <h2 className="text-4xl font-bold text-forest-dark mb-6 text-center">
            ✅ RESUMEN EJECUTIVO
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Hakadogs es una <strong>plataforma digital completa y profesional</strong> que permite:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>VENDER</strong> cursos online de educación canina 24/7</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>GESTIONAR</strong> alumnos, contenidos y ventas desde panel admin</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>POSICIONARSE</strong> en Google en 54 ciudades españolas</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>GENERAR</strong> ingresos pasivos automáticos</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>OFRECER</strong> experiencia premium a los clientes</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
              <span><strong>COMPETIR</strong> con las academias online más grandes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Nueva sección: Revolución IA */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-2xl shadow-xl p-8 md:p-12 border-2 border-blue-200">
          <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🤖 REVOLUCIÓN DEL DESARROLLO CON IA
          </h2>
          
          <div className="bg-white/80 rounded-xl p-6 mb-6">
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Este presupuesto refleja la <strong>REALIDAD del desarrollo en 2026</strong>. 
              Gracias a herramientas de IA como Claude y Cursor AI, puedo entregar 
              el mismo producto de calidad en una <strong>fracción del tiempo</strong>.
            </p>
            <p className="text-base text-gray-600 italic">
              ⚠️ Importante: La IA no reduce el VALOR del producto, reduce el TIEMPO de desarrollo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Método Tradicional */}
            <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-6 border-2 border-red-300">
              <h3 className="text-2xl font-bold text-red-700 mb-4">❌ Método Tradicional (2020-2023)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">⏱️</span>
                  <span><strong>Tiempo:</strong> 4-6 meses de desarrollo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">⏳</span>
                  <span><strong>Horas:</strong> 740 horas de trabajo manual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">👥</span>
                  <span><strong>Equipo:</strong> 2-3 personas necesarias</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">💰</span>
                  <span><strong>Coste:</strong> 59,200€ - 95,000€</span>
                </li>
              </ul>
            </div>

            {/* Método con IA */}
            <div className="bg-gradient-to-br from-green-100 to-emerald-50 rounded-xl p-6 border-2 border-green-400">
              <h3 className="text-2xl font-bold text-green-700 mb-4">✅ Método con IA (2026)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">⚡</span>
                  <span><strong>Tiempo:</strong> 5 días de desarrollo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✨</span>
                  <span><strong>Horas:</strong> 40 horas efectivas con IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">👤</span>
                  <span><strong>Equipo:</strong> 1 desarrollador + IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">💎</span>
                  <span><strong>Coste ajustado:</strong> 12,000€</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-gold/20 to-yellow-100 rounded-xl p-6 border-2 border-gold">
            <h4 className="text-xl font-bold text-gray-800 mb-3 text-center">🎯 DIFERENCIACIÓN CLAVE</h4>
            <p className="text-center text-gray-700 text-lg">
              El cliente paga por <strong className="text-gold">RESULTADOS</strong>, no por horas sentado.<br/>
              <span className="text-base">Eficiencia: <strong className="text-green-700">18.5x más rápido</strong> • Ahorro: <strong className="text-green-700">83%</strong></span>
            </p>
          </div>
        </div>
      </section>

      {/* Componentes con iconos */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-forest-dark mb-12 text-center">
          ¿QUÉ INCLUYE ESTA PLATAFORMA?
        </h2>

        {/* Módulo 1: Academia Online */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-forest/10">
          <div className="bg-gradient-to-r from-forest-dark to-forest text-white p-6">
            <div className="flex items-center gap-4">
              <Award className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">1. ACADEMIA ONLINE COMPLETA</h3>
                <p className="text-sage text-lg">Sistema de Venta de Cursos</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-gold">25,000€</div>
                <div className="text-sm text-sage">Valor de mercado</div>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  📚 Gestión Ilimitada de Cursos
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• Crear y publicar cursos ilimitados</li>
                  <li>• Organizar lecciones en módulos temáticos</li>
                  <li>• Videos + Audios + Texto enriquecido</li>
                  <li>• Recursos descargables para alumnos</li>
                  <li>• Sistema de precios flexible</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  🎓 Área Personal del Alumno
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• Dashboard personalizado</li>
                  <li>• Ver todos sus cursos comprados</li>
                  <li>• Seguimiento de progreso automático</li>
                  <li>• Desbloqueo secuencial de lecciones</li>
                  <li>• Acceso 24/7 desde cualquier dispositivo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  💰 Sistema de Compra Integrado
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• Carrito de compra profesional</li>
                  <li>• Proceso de pago claro y rápido</li>
                  <li>• Registro automático de usuarios</li>
                  <li>• Control total desde el panel</li>
                  <li>• Listo para pasarela de pago real</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  🎮 Gamificación Automática
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• <strong>15 medallas desbloqueables</strong></li>
                  <li>• Ranking de estudiantes en tiempo real</li>
                  <li>• Contador de racha de días</li>
                  <li>• Sistema de puntos y niveles</li>
                  <li>• <strong>¡+40% retención de alumnos!</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo 2: Panel Admin */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-forest/10">
          <div className="bg-gradient-to-r from-forest to-sage text-white p-6">
            <div className="flex items-center gap-4">
              <BarChart3 className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">2. PANEL DE ADMINISTRACIÓN PROFESIONAL</h3>
                <p className="text-cream text-lg">Tu Centro de Control Total</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-gold">18,000€</div>
                <div className="text-sm text-cream">Valor de mercado</div>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  📊 Dashboard con Estadísticas
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• Ver ventas e ingresos al instante</li>
                  <li>• Gráficas de rendimiento</li>
                  <li>• Actividad reciente</li>
                  <li>• KPIs de tu negocio en un vistazo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  👥 Gestión de Usuarios
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• Ver todos tus alumnos</li>
                  <li>• Buscar y filtrar rápidamente</li>
                  <li>• Cambiar roles y permisos</li>
                  <li>• Controlar accesos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  📚 Gestión Avanzada de Cursos
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• Crear cursos desde cero</li>
                  <li>• Editor profesional (como Word)</li>
                  <li>• <strong>Generador IA de descripciones</strong></li>
                  <li>• Publicar/despublicar con un clic</li>
                  <li>• Reordenar lecciones fácilmente</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  📰 Gestión del Blog
                </h4>
                <ul className="space-y-2 text-gray-700 ml-7">
                  <li>• Crear artículos ilimitados</li>
                  <li>• Galería de imágenes integrada</li>
                  <li>• Categorías personalizables</li>
                  <li>• SEO optimizado automáticamente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo 3: Web Marketing */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-forest/10">
          <div className="bg-gradient-to-r from-sage to-forest text-white p-6">
            <div className="flex items-center gap-4">
              <Target className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">3. WEB DE MARKETING PROFESIONAL</h3>
                <p className="text-cream text-lg">Tu Escaparate Digital 24/7</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-gold">8,000€</div>
                <div className="text-sm text-cream">Valor de mercado</div>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold text-forest mb-2">🏠 Página Principal</h4>
                <p className="text-gray-700 text-sm">Diseño moderno optimizado para conversión</p>
              </div>
              <div>
                <h4 className="font-bold text-forest mb-2">📄 Páginas de Servicios</h4>
                <p className="text-gray-700 text-sm">4 servicios detallados con precios</p>
              </div>
              <div>
                <h4 className="font-bold text-forest mb-2">🎯 Metodología BE HAKA</h4>
                <p className="text-gray-700 text-sm">Diferenciación y autoridad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo 4: Blog */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-forest/10">
          <div className="bg-gradient-to-r from-forest-dark to-sage text-white p-6">
            <div className="flex items-center gap-4">
              <FileText className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">4. BLOG PROFESIONAL</h3>
                <p className="text-cream text-lg">Motor de Contenidos y SEO</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-gold">6,500€</div>
                <div className="text-sm text-cream">Valor de mercado</div>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-forest mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  📰 Diseño Profesional Tipo Revista
                </h4>
                <p className="text-gray-700 ml-7">Layout de 2 columnas, sidebar con contenido relacionado, búsqueda en tiempo real, categorías con colores</p>
              </div>
              <div>
                <h4 className="font-bold text-forest mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  🎯 Generación de Tráfico Orgánico
                </h4>
                <p className="text-gray-700 ml-7">Cada artículo atrae visitantes de Google. Incluye calendario editorial de 48 artículos planificado.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo 5: SEO Local */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-forest/10">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
            <div className="flex items-center gap-4">
              <Globe className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">5. POSICIONAMIENTO SEO EN 54 CIUDADES</h3>
                <p className="text-green-100 text-lg">Estrategia Única con IA</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-yellow-300">12,000€</div>
                <div className="text-sm text-green-100">Valor de mercado</div>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg text-forest mb-3">🗺️ 54 Páginas de Localidades</h4>
                <p className="text-gray-700">
                  Una página por cada ciudad importante: Cartagena, Murcia, Alicante, Valencia, Madrid, Barcelona...
                  Contenido único para cada ciudad. Apareces en Google Maps y búsquedas locales.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3">🤖 Contenido con IA</h4>
                <p className="text-gray-700">
                  Información real de cada ciudad (pipicanes, playas, normativas). 20 ciudades procesadas con calidad perfecta.
                  Sistema de caché para no repetir costos.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3">📍 Estrategia Dual Inteligente</h4>
                <p className="text-gray-700">
                  Ciudades cercanas (&lt;40km): priorizan servicios presenciales.<br />
                  Ciudades lejanas (&gt;40km): priorizan cursos online.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3">🎯 Resultados SEO Garantizados</h4>
                <p className="text-gray-700">
                  <strong>Puntuación SEO: 100/100</strong> en Google.<br />
                  Sitemap automático, Schema.org implementado, Robots.txt optimizado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo 6: Performance */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-forest/10">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
            <div className="flex items-center gap-4">
              <Zap className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">6. OPTIMIZACIÓN DE PERFORMANCE</h3>
                <p className="text-orange-100 text-lg">Resultados Medibles Excepcionales</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-yellow-300">9,500€</div>
                <div className="text-sm text-orange-100">Valor de mercado</div>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-lg text-forest mb-3">⚡ Velocidad Excepcional</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Google PageSpeed: 95-97/100</strong> (¡EXCELENTE!)</li>
                  <li>• Carga en menos de 2.3 segundos</li>
                  <li>• Optimización imágenes <strong>-73%</strong></li>
                  <li>• Logo optimizado <strong>-94%</strong></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3">📱 Experiencia Móvil Perfecta</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• 100% responsive</li>
                  <li>• Gestos táctiles (swipe) en cursos</li>
                  <li>• Navegación fluida</li>
                  <li>• Botones y textos adaptados</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg text-forest mb-3">♿ Accesibilidad Premium</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Puntuación: 96/100</strong></li>
                  <li>• Cumple normativas WCAG 2.1 AA</li>
                  <li>• Accesible para discapacitados</li>
                  <li>• Navegación por teclado</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                <h4 className="font-bold text-lg text-green-700 mb-3">🎯 Impacto en Negocio</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ 1 segundo más rápido = <strong>+7% conversiones</strong></li>
                  <li>✓ Mejor posicionamiento en Google</li>
                  <li>✓ Menos rebote de visitantes</li>
                  <li>✓ <strong>Más ventas y leads</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo 7: Seguridad */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-forest/10">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
            <div className="flex items-center gap-4">
              <Shield className="w-12 h-12" />
              <div>
                <h3 className="text-2xl font-bold">7. SEGURIDAD Y PROTECCIÓN DE DATOS</h3>
                <p className="text-blue-100 text-lg">Tranquilidad Total</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-3xl font-bold text-yellow-300">5,500€</div>
                <div className="text-sm text-blue-100">Valor de mercado</div>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-bold text-forest mb-2">🔐 Autenticación Segura</h4>
                <p className="text-gray-700 text-sm">Registro, login, encriptación, control de accesos</p>
              </div>
              <div>
                <h4 className="font-bold text-forest mb-2">🛡️ Seguridad OWASP</h4>
                <p className="text-gray-700 text-sm">Protección contra hackeos, SSL/HTTPS activo</p>
              </div>
              <div>
                <h4 className="font-bold text-forest mb-2">📋 Cumplimiento GDPR</h4>
                <p className="text-gray-700 text-sm">Banner cookies, política privacidad, legal completo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Módulos 8-10 Resumidos */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-forest/10">
            <h3 className="text-xl font-bold text-forest mb-2">8. Infraestructura Premium</h3>
            <div className="text-3xl font-bold text-gold mb-3">4,500€</div>
            <p className="text-gray-700 text-sm">Dominio propio, hosting Vercel, base de datos Supabase, deploy automático</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-forest/10">
            <h3 className="text-xl font-bold text-forest mb-2">9. Analítica y Seguimiento</h3>
            <div className="text-3xl font-bold text-gold mb-3">2,500€</div>
            <p className="text-gray-700 text-sm">Google Analytics integrado, dashboard administrativo con KPIs</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-forest/10">
            <h3 className="text-xl font-bold text-forest mb-2">10. Documentación Técnica</h3>
            <div className="text-3xl font-bold text-gold mb-3">3,500€</div>
            <p className="text-gray-700 text-sm">38 documentos técnicos, formación incluida, manuales completos</p>
          </div>
        </div>
      </section>

      {/* Resumen de Valor */}
      <section className="bg-gradient-to-r from-forest-dark via-forest to-forest-dark text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">🤖 DESARROLLO CON IA: NUEVA ERA</h2>
          
          {/* Comparativa Método Tradicional vs IA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Sin IA */}
              <div className="border-2 border-red-400 rounded-xl p-6 bg-red-900/20">
                <h3 className="text-2xl font-bold mb-4 text-red-300">❌ MÉTODO TRADICIONAL (2023)</h3>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Tiempo desarrollo:</span>
                    <span className="font-bold">4.5 meses</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Horas invertidas:</span>
                    <span className="font-bold">740 horas</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Equipo necesario:</span>
                    <span className="font-bold">2-3 personas</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Coste por hora:</span>
                    <span className="font-bold">80€/h</span>
                  </div>
                  <div className="flex justify-between py-3 pt-4 border-t-2 border-red-400 text-xl">
                    <span className="font-bold">Coste total:</span>
                    <span className="font-bold text-red-300">59,200€</span>
                  </div>
                  <div className="text-sm text-red-200 pt-2">
                    (Valor de mercado completo: 95,000€)
                  </div>
                </div>
              </div>

              {/* Con IA */}
              <div className="border-2 border-green-400 rounded-xl p-6 bg-green-900/20">
                <h3 className="text-2xl font-bold mb-4 text-green-300">✅ CON IA (2026)</h3>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Tiempo desarrollo:</span>
                    <span className="font-bold">5 días</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Horas efectivas:</span>
                    <span className="font-bold">40 horas</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Equipo necesario:</span>
                    <span className="font-bold">1 persona + IA</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/20">
                    <span>Eficiencia:</span>
                    <span className="font-bold text-green-300">18.5x más rápido</span>
                  </div>
                  <div className="flex justify-between py-3 pt-4 border-t-2 border-green-400 text-xl">
                    <span className="font-bold">Precio ajustado:</span>
                    <span className="font-bold text-green-300">12,000€</span>
                  </div>
                  <div className="text-sm text-green-200 pt-2">
                    (Mismo producto, menos tiempo)
                  </div>
                </div>
              </div>
            </div>

            {/* Nota importante */}
            <div className="mt-6 pt-6 border-t-2 border-white/40 bg-gold/20 rounded-lg p-6">
              <p className="text-lg text-center mb-3">
                <strong className="text-gold text-xl">🎯 IMPORTANTE:</strong>
              </p>
              <p className="text-base text-center">
                La IA no reduce el <strong>VALOR</strong> del producto, reduce el <strong>TIEMPO</strong> de desarrollo.<br />
                El cliente paga por <strong>RESULTADOS</strong>, no por horas sentado.
              </p>
            </div>
          </div>

          {/* Estadísticas finales */}
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-sm text-sage mb-2">Ahorro de Tiempo</div>
              <div className="text-4xl font-bold text-gold">700 horas</div>
              <div className="text-sm text-sage mt-2">135 días laborables ahorrados</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-sm text-sage mb-2">Ahorro para el Cliente</div>
              <div className="text-4xl font-bold text-gold">83%</div>
              <div className="text-sm text-sage mt-2">vs método tradicional (59,200€)</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-sm text-sage mb-2">Calidad del Producto</div>
              <div className="text-4xl font-bold text-gold">IGUAL</div>
              <div className="text-sm text-sage mt-2">Performance 95/100, SEO 100/100</div>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados Medibles */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-forest-dark mb-12 text-center">
          RESULTADOS MEDIBLES ALCANZADOS
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-green-200">
            <div className="text-5xl font-bold text-green-600 mb-2">95/100</div>
            <div className="text-sm text-gray-600 mb-1">Google PageSpeed</div>
            <div className="text-xs text-gray-500">(Promedio sector: 60-70)</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-blue-200">
            <div className="text-5xl font-bold text-blue-600 mb-2">100/100</div>
            <div className="text-sm text-gray-600 mb-1">Puntuación SEO</div>
            <div className="text-xs text-gray-500">54 ciudades posicionadas</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-purple-200">
            <div className="text-5xl font-bold text-purple-600 mb-2">96/100</div>
            <div className="text-sm text-gray-600 mb-1">Accesibilidad</div>
            <div className="text-xs text-gray-500">WCAG 2.1 AA compliant</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border-2 border-orange-200">
            <div className="text-5xl font-bold text-orange-600 mb-2">100%</div>
            <div className="text-sm text-gray-600 mb-1">Mobile Responsive</div>
            <div className="text-xs text-gray-500">Todos los dispositivos</div>
          </div>
        </div>
      </section>

      {/* ¿Qué significa para tu negocio? */}
      <section className="bg-gradient-to-b from-sage/10 to-cream py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-forest-dark mb-12 text-center">
            ¿QUÉ SIGNIFICA ESTO PARA TU NEGOCIO?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <h3 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                💰 MONETIZACIÓN
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Vender cursos online 24/7 sin límite</li>
                <li>✓ Ingresos pasivos automáticos</li>
                <li>✓ Escalable sin aumentar costes</li>
                <li>✓ No dependes de tu tiempo físico</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                📈 CRECIMIENTO
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Aparecer en Google en 54 ciudades</li>
                <li>✓ Blog generando tráfico orgánico</li>
                <li>✓ Sistema de leads con formularios</li>
                <li>✓ Base de datos de clientes potenciales</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center gap-2">
                <Award className="w-6 h-6" />
                🎯 AUTORIDAD
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Web profesional que transmite confianza</li>
                <li>✓ Metodología BE HAKA como diferenciación</li>
                <li>✓ Blog posicionándote como experto</li>
                <li>✓ Competir con las grandes academias</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
              <h3 className="text-2xl font-bold text-orange-700 mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                ⚙️ AUTOMATIZACIÓN
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>✓ Sistema funcionando 24/7 sin intervención</li>
                <li>✓ Alumnos se registran y acceden solos</li>
                <li>✓ Progreso calculado automáticamente</li>
                <li>✓ Estadísticas en tiempo real</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">🌍 ALCANCE NACIONAL</h3>
            <p className="text-xl mb-2">No limitado a Archena/Murcia • Vender en toda España</p>
            <p className="text-lg text-green-100">Estrategia dual (presencial + online) • Adaptado a cada mercado</p>
          </div>
        </div>
      </section>

      {/* Comparativa Competencia */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-forest-dark mb-12 text-center">
          COMPARATIVA CON COMPETENCIA
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-forest-dark to-forest text-white">
              <tr>
                <th className="px-6 py-4 text-left">CARACTERÍSTICA</th>
                <th className="px-6 py-4 text-center">EDUCANINE</th>
                <th className="px-6 py-4 text-center">SENDA CANINA</th>
                <th className="px-6 py-4 text-center bg-gold text-forest-dark">HAKADOGS ⭐</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 font-medium">Performance</td>
                <td className="px-6 py-4 text-center">65</td>
                <td className="px-6 py-4 text-center">72</td>
                <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-700">95 ✅</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">SEO Score</td>
                <td className="px-6 py-4 text-center">78</td>
                <td className="px-6 py-4 text-center">85</td>
                <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-700">100 ✅</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Mobile Responsive</td>
                <td className="px-6 py-4 text-center">⚠️</td>
                <td className="px-6 py-4 text-center">✅</td>
                <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-700">✅</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Sistema Gamificación</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-700">✅ 🎮</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">IA Integrada</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-700">✅ 🤖</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">SEO Local 54 ciudades</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center">❌</td>
                <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-700">✅ 🗺️</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-center mt-6 text-lg text-gray-700">
          🏆 <strong>HAKADOGS tiene ventajas técnicas únicas frente a competidores</strong>
        </p>
      </section>

      {/* Precio Final - CTA Principal */}
      <section className="bg-gradient-to-br from-gold/20 via-cream to-gold/20 py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-forest-dark mb-8 text-center">
            INVERSIÓN Y FACTURACIÓN
          </h2>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-4 border-gold mb-8">
            <div className="text-center mb-8">
              <div className="text-sm text-gray-600 mb-2">VALOR TRADICIONAL DE MERCADO</div>
              <div className="text-4xl font-bold text-gray-400 line-through mb-2">95,000€</div>
              <div className="text-sm text-gray-600 mb-2">Coste desarrollo tradicional: 59,200€</div>
              <div className="text-sm text-green-600 font-semibold mb-6">Con IA: 40 horas en 5 días (18.5x más rápido)</div>
              
              <div className="border-t-2 border-gold pt-6">
                <div className="text-2xl font-bold text-forest-dark mb-3">PRECIO RECOMENDADO ⭐</div>
                <div className="text-7xl font-bold text-gold mb-2">12,000€</div>
                <div className="text-2xl text-gray-600">+ IVA (21%)</div>
                <div className="text-4xl font-bold text-forest-dark mt-4">14,520€ TOTAL</div>
              </div>

              <div className="mt-6 bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <p className="text-lg text-gray-700">
                  💰 <strong>Ahorro de 47,200€ (83%)</strong> vs desarrollo tradicional<br/>
                  ⚡ <strong>Entrega en 5 días</strong> vs 4.5 meses tradicional
                </p>
              </div>
            </div>
          </div>

          {/* Opciones de Precio */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Opción A */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-300">
              <h3 className="text-xl font-bold text-forest-dark mb-2">OPCIÓN A</h3>
              <p className="text-sm text-gray-600 mb-4">Competitivo</p>
              <div className="text-4xl font-bold text-forest mb-2">10,000€</div>
              <div className="text-sm text-gray-600 mb-4">+ IVA = 12,100€ TOTAL</div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Todo lo desarrollado</li>
                <li>✓ Transferencia completa</li>
                <li>✓ Documentación 38 archivos</li>
                <li>✓ 1 mes de soporte</li>
              </ul>
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                2,000€/día • Muy competitivo
              </div>
            </div>

            {/* Opción B - RECOMENDADA */}
            <div className="bg-gradient-to-b from-gold/20 to-gold/30 rounded-xl shadow-2xl p-6 border-4 border-gold relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gold text-white px-6 py-2 rounded-full text-sm font-bold">
                ⭐ RECOMENDADO
              </div>
              <h3 className="text-xl font-bold text-forest-dark mb-2 mt-2">OPCIÓN B</h3>
              <p className="text-sm text-gray-600 mb-4">Valor/Calidad</p>
              <div className="text-5xl font-bold text-gold mb-2">12,000€</div>
              <div className="text-sm text-gray-600 mb-4">+ IVA = <strong>14,520€ TOTAL</strong></div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Todo lo desarrollado</li>
                <li>✓ Transferencia completa</li>
                <li>✓ Documentación 38 archivos</li>
                <li>✓ <strong>3 meses de soporte</strong></li>
                <li>✓ <strong>Formación 4 horas</strong></li>
              </ul>
              <div className="mt-4 text-xs text-gray-700 bg-gold/10 p-3 rounded font-semibold">
                2,400€/día • Equilibrio perfecto
              </div>
            </div>

            {/* Opción C */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-300">
              <h3 className="text-xl font-bold text-forest-dark mb-2">OPCIÓN C</h3>
              <p className="text-sm text-gray-600 mb-4">Premium</p>
              <div className="text-4xl font-bold text-forest mb-2">15,000€</div>
              <div className="text-sm text-gray-600 mb-4">+ IVA = 18,150€ TOTAL</div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✓ Todo incluido</li>
                <li>✓ <strong>6 meses de soporte</strong></li>
                <li>✓ <strong>Formación 8 horas</strong></li>
                <li>✓ Auditorías trimestrales</li>
                <li>✓ Consultoría marketing</li>
              </ul>
              <div className="mt-4 text-xs text-gray-500 bg-gray-50 p-3 rounded">
                3,000€/día • Máximo justificable
              </div>
            </div>
          </div>

          {/* Desglose Facturación */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-forest-dark mb-6 text-center">
              DESGLOSE DE FACTURACIÓN (Opción B)
            </h3>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between py-2 border-b">
                <span>Desarrollo plataforma completa Hakadogs.com</span>
                <span className="font-bold">12,000.00€</span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm text-gray-600">
                <span className="italic">• Metodología con IA (40 horas en 5 días)</span>
                <span></span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm text-gray-600">
                <span className="italic">• Academia online + gamificación única</span>
                <span></span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm text-gray-600">
                <span className="italic">• Panel administrativo + Blog + SEO 54 ciudades</span>
                <span></span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm text-gray-600">
                <span className="italic">• Performance 95/100 + SEO 100/100</span>
                <span></span>
              </div>
              <div className="flex justify-between py-2 border-b text-sm text-gray-600">
                <span className="italic">• Documentación completa + 3 meses soporte</span>
                <span></span>
              </div>
              <div className="flex justify-between py-2 border-b mt-4">
                <span>IVA (21%)</span>
                <span className="font-bold">2,520.00€</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gold text-2xl font-bold text-gold">
                <span>TOTAL A FACTURAR</span>
                <span>14,520.00€</span>
              </div>
            </div>

            <div className="mt-8 bg-sage/10 rounded-lg p-6">
              <h4 className="font-bold text-forest-dark mb-4">FORMA DE PAGO SUGERIDA:</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>• 50% al inicio del proyecto:</span>
                  <span className="font-bold">7,260.00€</span>
                </div>
                <div className="flex justify-between">
                  <span>• 50% al finalizar y entregar:</span>
                  <span className="font-bold">7,260.00€</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-forest/20 font-bold text-lg">
                  <span>TOTAL:</span>
                  <span className="text-gold">14,520.00€</span>
                </div>
              </div>
            </div>
          </div>

          {/* ROI */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">💰 RETORNO DE INVERSIÓN</h3>
            <p className="text-xl mb-6">La inversión de 12,000€ se amortiza con:</p>
            <div className="grid md:grid-cols-3 gap-4 text-lg">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">60</div>
                <div>ventas de curso de 200€</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">48</div>
                <div>ventas de curso de 250€</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-3xl font-bold mb-2">O</div>
                <div>Combinación ventas + servicios presenciales</div>
              </div>
            </div>
            <div className="mt-6 text-2xl font-bold text-yellow-300">
              ROI ESTIMADO: 6-12 meses
            </div>
            <div className="mt-4 text-sm bg-white/10 rounded-lg p-4">
              <p className="mb-2">🎯 <strong>Comparativa con competencia:</strong></p>
              <p>• SaaS como Kajabi/Teachable: 1,788€ - 3,588€/año (5-8 años para igualar)</p>
              <p>• Desarrollo tradicional: 59,200€ - 95,000€ (ahorro inmediato de 47,200€)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Costes Recurrentes */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-forest-dark mb-12 text-center">
          COSTES RECURRENTES MENSUALES
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">0€/mes</div>
              <div className="text-sm text-gray-600 mb-4">&lt; 1,000 visitas/mes</div>
              <ul className="text-sm text-gray-700 text-left">
                <li>✓ Vercel: Gratis</li>
                <li>✓ Supabase: Gratis</li>
                <li>✓ SSL: Gratis</li>
              </ul>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-4xl font-bold text-blue-600 mb-2">0-20€/mes</div>
              <div className="text-sm text-gray-600 mb-4">1,000-5,000 visitas/mes</div>
              <ul className="text-sm text-gray-700 text-left">
                <li>✓ Vercel: 0-20€</li>
                <li>✓ Supabase: Gratis</li>
                <li>✓ SSL: Gratis</li>
              </ul>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
              <div className="text-4xl font-bold text-orange-600 mb-2">45€/mes</div>
              <div className="text-sm text-gray-600 mb-4">&gt; 5,000 visitas/mes</div>
              <ul className="text-sm text-gray-700 text-left">
                <li>✓ Vercel Pro: 20€</li>
                <li>✓ Supabase Pro: 25€</li>
                <li>✓ SSL: Gratis</li>
              </ul>
            </div>
          </div>
          <div className="bg-gold/10 border-2 border-gold rounded-lg p-6 text-center">
            <p className="text-lg text-gray-700">
              💡 <strong>NOTA:</strong> Los costes mensuales son bajísimos comparados con otras plataformas
            </p>
            <p className="text-sm text-gray-600 mt-2">
              (Kajabi: 149$/mes, Teachable: 119$/mes, Thinkific: 149$/mes)
            </p>
          </div>
        </div>
      </section>

      {/* Garantías */}
      <section className="bg-gradient-to-b from-forest-dark to-forest text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">GARANTÍAS OFRECIDAS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4 text-gold">Calidad Técnica</h3>
              <ul className="space-y-2">
                <li>✅ Código limpio y documentado</li>
                <li>✅ Performance superior a 90/100</li>
                <li>✅ SEO score 100/100</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4 text-gold">Compatibilidad</h3>
              <ul className="space-y-2">
                <li>✅ Todos los navegadores modernos</li>
                <li>✅ Responsive en todos los dispositivos</li>
                <li>✅ Accesibilidad WCAG 2.1 AA</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-bold text-xl mb-4 text-gold">Seguridad y Legal</h3>
              <ul className="space-y-2">
                <li>✅ Cumplimiento GDPR y LOPD</li>
                <li>✅ Seguridad OWASP implementada</li>
                <li>✅ Backups automáticos configurados</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Próximos Pasos */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-forest-dark mb-12 text-center">
          PRÓXIMOS PASOS
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4 border-l-4 border-forest">
            <div className="text-3xl font-bold text-forest-dark bg-sage rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">1</div>
            <div>
              <h3 className="font-bold text-lg text-forest-dark">Revisión y Aprobación</h3>
              <p className="text-gray-600">Revisar este presupuesto y confirmar la opción elegida</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4 border-l-4 border-forest">
            <div className="text-3xl font-bold text-forest-dark bg-sage rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">2</div>
            <div>
              <h3 className="font-bold text-lg text-forest-dark">Firma del Contrato</h3>
              <p className="text-gray-600">Contrato de servicios profesionales</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4 border-l-4 border-forest">
            <div className="text-3xl font-bold text-forest-dark bg-sage rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">3</div>
            <div>
              <h3 className="font-bold text-lg text-forest-dark">Facturación Inicial</h3>
              <p className="text-gray-600">50% inicial (7,260€) para comenzar el traspaso</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4 border-l-4 border-forest">
            <div className="text-3xl font-bold text-forest-dark bg-sage rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">4</div>
            <div>
              <h3 className="font-bold text-lg text-forest-dark">Transferencia Completa</h3>
              <p className="text-gray-600">Código completo, accesos y documentación</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4 border-l-4 border-forest">
            <div className="text-3xl font-bold text-forest-dark bg-sage rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">5</div>
            <div>
              <h3 className="font-bold text-lg text-forest-dark">Formación Personalizada</h3>
              <p className="text-gray-600">4 horas de formación en panel administrativo</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center gap-4 border-l-4 border-forest">
            <div className="text-3xl font-bold text-forest-dark bg-sage rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">6</div>
            <div>
              <h3 className="font-bold text-lg text-forest-dark">Inicio del Soporte</h3>
              <p className="text-gray-600">3 meses de soporte técnico incluido</p>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusión Final */}
      <section className="bg-gradient-to-r from-gold/20 via-cream to-gold/20 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-forest-dark mb-8">CONCLUSIÓN EJECUTIVA</h2>
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-gold">
            <p className="text-2xl text-gray-700 mb-6 leading-relaxed">
              <strong>Hakadogs.com no es solo una web,</strong><br />
              es una <span className="text-gold font-bold">PLATAFORMA DE NEGOCIO COMPLETA</span>
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Generar ingresos pasivos 24/7</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Competir con academias grandes</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Posicionarte en 54 ciudades</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Automatizar gestión de alumnos</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Escalar sin aumentar costes</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <span>Diferenciarte con gamificación única</span>
              </div>
            </div>
            <div className="border-t-2 border-gold pt-6">
              <p className="text-xl text-gray-700 italic mb-4">
                &ldquo;Tu inversión en educación canina,<br />
                nuestra inversión en excelencia técnica&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer de presupuesto */}
      <footer className="bg-forest-dark text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6">
            <p className="text-lg font-bold text-gold mb-2">PRESUPUESTO VÁLIDO HASTA: 28 de Febrero de 2026</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div>
              <h3 className="font-bold text-sage mb-2">DESARROLLADO POR:</h3>
              <p>Narciso Pardo Buendía</p>
              <p className="text-sm text-sage">Desarrollador Full Stack</p>
              <p className="text-sm text-sage mt-2">Email: [tu email]</p>
              <p className="text-sm text-sage">Teléfono: [tu teléfono]</p>
            </div>
            <div>
              <h3 className="font-bold text-sage mb-2">PARA:</h3>
              <p>Hakadogs - Alfredo García</p>
              <p className="text-sm text-sage">Email: contacto@hakadogs.com</p>
              <p className="text-sm text-sage">Web: www.hakadogs.com</p>
              <p className="text-sm text-sage mt-2">Enero 2026 • Versión 3.0.1</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
