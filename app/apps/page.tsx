import Link from 'next/link'
import { Heart, Target, Users, ArrowRight, CheckCircle, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Hakadogs - Apps de Educación Canina',
  description: 'Herramientas digitales para seguimiento de salud, adiestramiento y comunidad canina.',
}

export default function AppsPage() {
  const apps = [
    {
      id: 'hakahealth',
      name: 'HakaHealth',
      tagline: 'Tu perro necesita chequeos. Tú necesitas organización.',
      description: 'Gestiona el historial médico de tu perro, vacunas, medicamentos y evolución de peso en un solo lugar.',
      icon: Heart,
      color: 'green',
      features: [
        'Calendario de vacunación y recordatorios',
        'Historial médico completo',
        'Seguimiento de medicamentos',
        'Evolución del peso',
        'Citas veterinarias organizadas',
      ],
      href: '/apps/hakahealth',
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-white',
    },
    {
      id: 'hakatrainer',
      name: 'HakaTrainer',
      tagline: 'Tu perro necesita rutina. Tú necesitas seguimiento.',
      description: 'Sigue el plan de adiestramiento personalizado, registra progresos y mantén la motivación con el sistema de rachas.',
      icon: Target,
      color: 'orange',
      features: [
        'Plan de adiestramiento personalizado',
        'Seguimiento de ejercicios diarios',
        'Sistema de rachas y logros',
        'Progreso visual por habilidad',
        'Comunicación directa con el educador',
      ],
      href: '/apps/hakatrainer',
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-white',
    },
    {
      id: 'hakacommunity',
      name: 'HakaCommunity',
      tagline: 'Tu perro necesita amigos. Tú también.',
      description: 'Conecta con otros propietarios, busca amigos para tu perro, participa en eventos y accede a recursos locales.',
      icon: Users,
      color: 'blue',
      features: [
        'Buscar amigos caninos cerca de ti',
        'Foro de la comunidad con respuestas del educador',
        'Eventos y quedadas (oficiales y de la comunidad)',
        'Mapa de recursos (parques, veterinarios, tiendas)',
        'Chat y mensajería',
      ],
      href: '/apps/hakacommunity',
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-white',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Apps de Educación Canina
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto opacity-95">
            Herramientas digitales para mejorar la vida de tu perro
          </p>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Acceso exclusivo para clientes de Hakadogs. Gestiona salud, adiestramiento y socialización desde un solo lugar.
          </p>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12 max-w-6xl mx-auto">
            {apps.map((app, index) => {
              const Icon = app.icon
              const isReversed = index % 2 !== 0

              return (
                <div
                  key={app.id}
                  className={`bg-gradient-to-br ${app.bgGradient} rounded-2xl shadow-xl overflow-hidden`}
                >
                  <div className={`grid md:grid-cols-2 gap-8 items-center ${isReversed ? 'md:grid-flow-dense' : ''}`}>
                    {/* Content */}
                    <div className={`p-8 md:p-12 ${isReversed ? 'md:col-start-2' : ''}`}>
                      {/* Icon & Badge */}
                      <div className="flex items-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${app.gradient} rounded-2xl flex items-center justify-center mr-4 shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900">{app.name}</h2>
                          <p className="text-sm text-gray-600 mt-1">{app.tagline}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-lg mb-6">
                        {app.description}
                      </p>

                      {/* Features */}
                      <div className="space-y-3 mb-8">
                        {app.features.map((feature, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className={`w-5 h-5 text-${app.color}-600 mr-3 mt-0.5 flex-shrink-0`} />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Link href={app.href}>
                        <button className={`group w-full bg-gradient-to-r ${app.gradient} text-white font-semibold py-4 px-8 rounded-xl hover:shadow-xl transition-all flex items-center justify-center`}>
                          <span>Acceder a {app.name}</span>
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>

                    {/* Visual/Image */}
                    <div className={`${isReversed ? 'md:col-start-1' : ''} p-8 md:p-12`}>
                      <div className={`bg-gradient-to-br ${app.gradient} rounded-2xl p-8 text-white shadow-2xl`}>
                        <Icon className="w-24 h-24 mx-auto mb-6 opacity-90" />
                        <h3 className="text-2xl font-bold text-center mb-4">{app.name}</h3>
                        <p className="text-center text-white/90 text-lg">
                          {app.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué usar nuestras apps?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Diseñadas específicamente para clientes de Hakadogs
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Todo en un Lugar</h3>
                <p className="text-gray-600">
                  Salud, adiestramiento y comunidad sincronizados con tu plan de educación canina
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Seguimiento Real</h3>
                <p className="text-gray-600">
                  Tu educador actualiza directamente tu plan y puede ver tu progreso
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad Activa</h3>
                <p className="text-gray-600">
                  Conecta con otros clientes que están en tu misma etapa de adiestramiento
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Aún no eres cliente?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-95">
            Estas apps están disponibles exclusivamente para clientes de Hakadogs. Comienza tu plan de educación canina hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-block bg-white text-orange-600 font-semibold px-8 py-4 rounded-full hover:bg-orange-50 transition-colors shadow-lg"
            >
              Solicitar Información
            </Link>
            <Link
              href="/servicios"
              className="inline-block bg-transparent border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
