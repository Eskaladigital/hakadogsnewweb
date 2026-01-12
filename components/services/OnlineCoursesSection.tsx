import Link from 'next/link'
import { GraduationCap, Globe, Video, CheckCircle, ArrowRight } from 'lucide-react'

export default function OnlineCoursesSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-forest/5 via-sage/10 to-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-forest/10 rounded-2xl mb-4">
            <Globe className="w-8 h-8 text-forest" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-forest-dark mb-4">
            ¿No estás en nuestra zona geográfica?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No te preocupes, puedes acceder a la <strong>misma calidad de formación</strong> desde 
            cualquier lugar del mundo con nuestros <strong>cursos online</strong>
          </p>
        </div>

        {/* Contenido principal */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-forest/10">
          <div className="grid md:grid-cols-2 gap-0">
            
            {/* Lado izquierdo - Información */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-forest font-semibold mb-4">
                <GraduationCap className="w-5 h-5" />
                <span>Formación Online</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-forest-dark mb-6">
                Cursos de Educación Canina 100% Online
              </h3>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Nuestros cursos online ofrecen el mismo contenido de calidad que nuestras sesiones 
                presenciales. Aprende a tu ritmo, desde casa, con lecciones completas, contenido descargable 
                y seguimiento personalizado.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-forest flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-forest-dark">Mismo método profesional</p>
                    <p className="text-sm text-gray-600">Técnicas probadas en más de 500 perros</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-forest flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-forest-dark">Aprende a tu ritmo</p>
                    <p className="text-sm text-gray-600">Acceso 24/7 desde cualquier dispositivo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-forest flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-forest-dark">Contenido completo</p>
                    <p className="text-sm text-gray-600">Videos, guías descargables y recursos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-forest flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-forest-dark">Certificado al finalizar</p>
                    <p className="text-sm text-gray-600">Acredita tu formación canina</p>
                  </div>
                </div>
              </div>

              <Link 
                href="/cursos"
                className="inline-flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Ver Cursos Online
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Lado derecho - Visual/Stats */}
            <div className="bg-gradient-to-br from-forest to-forest-dark p-8 md:p-12 flex flex-col justify-center text-white">
              <div className="mb-8">
                <Video className="w-16 h-16 text-gold mb-4" />
                <h4 className="text-2xl font-bold mb-2">Formación de calidad</h4>
                <p className="text-white/80 text-lg">
                  Accede a contenido profesional desde cualquier parte del mundo
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-4xl font-bold text-gold mb-2">11+</p>
                  <p className="text-white/90 text-sm">Cursos disponibles</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-4xl font-bold text-gold mb-2">24/7</p>
                  <p className="text-white/90 text-sm">Acceso ilimitado</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-4xl font-bold text-gold mb-2">🎓</p>
                  <p className="text-white/90 text-sm">Contenido profesional</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <p className="text-4xl font-bold text-gold mb-2">100%</p>
                  <p className="text-white/90 text-sm">Online y flexible</p>
                </div>
              </div>

              <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-white/90 text-sm mb-3">
                  🎁 <strong>Primer curso gratuito</strong>
                </p>
                <p className="text-white/70 text-xs">
                  Comienza tu formación sin compromiso con nuestro curso introductorio completamente gratis
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nota adicional */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            💚 <strong>La misma metodología &quot;BE HAKA&quot;</strong> que utilizamos en sesiones presenciales, 
            ahora disponible online para todo el mundo
          </p>
        </div>
      </div>
    </section>
  )
}
