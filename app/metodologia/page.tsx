import { Metadata } from 'next'
import Link from 'next/link'
import { Users, Gamepad2, TrendingUp, Brain, Heart, Target, CheckCircle, ArrowRight, Zap, Pause, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Metodología BE HAKA - Educación Canina | Hakadogs',
  description: 'Conoce nuestra metodología basada en el binomio perro-guía, juego estructurado y bienestar emocional. Métodos probados con más de 500 perros. Principio de Premack, KPIs medibles.',
  openGraph: {
    title: 'Metodología BE HAKA - Educación Canina | Hakadogs',
    description: 'Metodología basada en el binomio perro-guía, juego estructurado y bienestar emocional. Principio de Premack, KPIs medibles, resultados comprobados.',
    url: 'https://www.hakadogs.com/metodologia',
    images: [
      {
        url: '/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Metodología BE HAKA',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metodología BE HAKA | Hakadogs',
    description: 'Binomio perro-guía, juego estructurado y resultados medibles. +500 perros educados.',
    images: ['/images/logo_facebook_1200_630.jpg'],
  },
}

export default function MetodologiaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-cream via-white to-sage/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-2 bg-forest/10 rounded-full mb-6">
            <span className="text-forest font-semibold text-sm">Nuestra Metodología</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-forest-dark mb-6">
            BE HAKA
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Metodología basada en el <strong className="text-forest">binomio perro-guía</strong>, donde trabajamos con el sistema completo: 
            tú, tu perro y vuestro entorno. Entrenamiento claro, simple y sostenible, con resultados medibles y respeto absoluto.
          </p>
        </div>
      </section>

      {/* Principios Fundamentales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-4">
            Nuestros Pilares Fundamentales
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            No entrenamos perros, entrenamos <strong className="text-forest">equipos</strong>. 
            Tú y tu perro sois una unidad, y nuestro trabajo es fortalecerla.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                title: 'Binomio Perro-Guía',
                description: 'No entrenamos al perro solo. Trabajamos contigo como sistema: tú organizas recursos, defines señales y formas parte del refuerzo.'
              },
              {
                icon: Gamepad2,
                title: 'Juego Estructurado',
                description: 'El juego es nuestra herramienta técnica. Construimos estados emocionales, conexión y habilidades transferibles de forma divertida.'
              },
              {
                icon: Heart,
                title: 'Bienestar Emocional',
                description: 'El éxito no es solo obediencia. Es que tu perro responda bien, se sienta bien y pueda recuperar la calma rápidamente.'
              },
              {
                icon: BarChart3,
                title: 'Datos, No Sensaciones',
                description: 'Medimos recuperación, latencia de respuesta y tasa de éxito. Ajustamos según datos reales, no intuiciones.'
              }
            ].map((pilar) => (
              <div key={pilar.title} className="bg-cream rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <pilar.icon className="text-forest" size={32} />
                </div>
                <h3 className="text-xl font-bold text-forest-dark mb-3 text-center">{pilar.title}</h3>
                <p className="text-gray-700 text-sm text-center">{pilar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-4">
            Cómo Trabajamos: Simple, Claro, Efectivo
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Nuestro método se basa en estructuras claras, progresión medida y repetición inteligente.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: Target,
                title: 'Un Criterio a la Vez',
                description: 'No pedimos 5 cosas a la vez. En cada ejercicio, un objetivo claro y medible. Cuando lo domina, escalamos.',
                color: 'forest'
              },
              {
                icon: TrendingUp,
                title: 'Escalamos Una Variable',
                description: 'Aumentamos duración, distancia, distracción o precisión. Pero solo una cada vez. Así el progreso es sólido.',
                color: 'sage'
              },
              {
                icon: Zap,
                title: 'Entorno como Reforzador',
                description: 'Tu perro quiere oler, jugar, explorar. Le enseñamos que el acceso a esas cosas se gana con buen comportamiento (Principio de Premack).',
                color: 'gold'
              }
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
                <div className={`w-14 h-14 bg-${item.color}/10 rounded-xl flex items-center justify-center mb-4`}>
                  <item.icon className={`text-${item.color === 'forest' ? 'forest' : item.color === 'gold' ? 'gold' : 'sage'}`} size={28} />
                </div>
                <h3 className="text-xl font-bold text-forest-dark mb-3">{item.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Juego y Pausa */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-forest/10 to-sage/10 rounded-2xl p-8 border-2 border-forest/20">
              <div className="flex items-center gap-3 mb-4">
                <Gamepad2 className="text-forest" size={32} />
                <h3 className="text-2xl font-bold text-forest-dark">Juego Estructurado</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Cada episodio de juego tiene <strong>inicio, cuerpo, pausa, reenganche y cierre</strong>. 
                No es &quot;jugar sin control&quot;. Es entrenar activación funcional (energía con foco) y pasividad funcional (calma sin apagarse).
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-forest flex-shrink-0 mt-0.5" size={18} />
                  <span>Construye conexión y cooperación</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-forest flex-shrink-0 mt-0.5" size={18} />
                  <span>Crea reforzadores portables y potentes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-forest flex-shrink-0 mt-0.5" size={18} />
                  <span>Entrena control emocional real</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-sage/10 to-cream rounded-2xl p-8 border-2 border-sage/30">
              <div className="flex items-center gap-3 mb-4">
                <Pause className="text-sage" size={32} />
                <h3 className="text-2xl font-bold text-forest-dark">Pausas y Recuperación</h3>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                La pausa <strong>no es un castigo</strong>, es parte del rendimiento. 
                Medimos cuánto tarda tu perro en volver a la calma (recuperación). Si no hay buena recuperación, el diseño falla.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-sage flex-shrink-0 mt-0.5" size={18} />
                  <span>Enseña autorregulación emocional</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-sage flex-shrink-0 mt-0.5" size={18} />
                  <span>Facilita el reenganche con el guía</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-sage flex-shrink-0 mt-0.5" size={18} />
                  <span>KPI clave: recuperación en segundos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Proceso Paso a Paso */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-4">
            Nuestro Proceso de Trabajo
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Estructura clara desde el día 1. Sin improvisación, sin sensaciones: solo progreso medible.
          </p>
          
          <div className="space-y-6">
            {[
              {
                number: '01',
                title: 'Evaluación del Binomio',
                description: 'Conocemos a tu perro, tu entorno, tu comunicación actual y vuestro vínculo. Identificamos qué funciona y qué hay que construir.',
                highlight: 'Estado emocional + contexto + relación'
              },
              {
                number: '02',
                title: 'Diseño del Plan Personalizado',
                description: 'Creamos secuencias de trabajo (banor) con criterios claros, una variable de progresión y KPIs específicos para tu caso.',
                highlight: 'Un criterio por ejercicio, escalado progresivo'
              },
              {
                number: '03',
                title: 'Sesiones de Entrenamiento',
                description: 'Trabajamos con juego estructurado, bucles Premack (conducta → acceso → reenganche) y pausas planificadas. Todo tiene inicio, trabajo, pausa y cierre.',
                highlight: 'Estructura protege el aprendizaje'
              },
              {
                number: '04',
                title: 'Construcción de Hábitos',
                description: 'Lo que se repite se fortalece. Diseñamos disparadores, conductas y consecuencias claras para tu día a día: paseos, manejo, espera, llamada.',
                highlight: 'Consistencia > Intensidad'
              },
              {
                number: '05',
                title: 'Medición y Ajuste',
                description: 'Evaluamos recuperación, latencia de respuesta, tasa de éxito. Si los datos empeoran, retrocedemos dificultad. Sin ego, solo eficacia.',
                highlight: 'Datos reales, ajuste continuo'
              },
              {
                number: '06',
                title: 'Transferencia a Contextos Reales',
                description: 'Escalamos a entornos más complejos: parques, calles, con otros perros. Tu perro aprende que las reglas funcionan en todas partes.',
                highlight: 'Generalización desde el inicio'
              }
            ].map((paso) => (
              <div key={paso.number} className="flex items-start gap-6 bg-cream rounded-2xl p-6 md:p-8 hover:shadow-lg transition-shadow">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-forest rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{paso.number}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-forest-dark mb-2">{paso.title}</h3>
                  <p className="text-gray-700 mb-3 leading-relaxed">{paso.description}</p>
                  <div className="inline-block bg-forest/10 px-3 py-1 rounded-full">
                    <span className="text-forest text-sm font-semibold">🎯 {paso.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Triangulación: Guía - Perro - Entorno */}
      <section className="py-20 bg-gradient-to-br from-sage/10 to-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-4">
            Triangulación: Tú, Tu Perro y el Entorno
          </h2>
          <p className="text-center text-gray-600 mb-12">
            El entorno no es el enemigo. Es un <strong className="text-forest">reforzador gestionado</strong>. 
            Más libertad se gana con mejor reenganche.
          </p>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-forest" size={36} />
                </div>
                <h3 className="font-bold text-forest-dark text-lg mb-2">1. Orientación al Guía</h3>
                <p className="text-sm text-gray-600">Tu perro te mira, te consulta</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="text-gold" size={36} />
                </div>
                <h3 className="font-bold text-forest-dark text-lg mb-2">2. Ejecución del Criterio</h3>
                <p className="text-sm text-gray-600">Hace lo pedido: sentarse, venir, esperar...</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="text-sage" size={36} />
                </div>
                <h3 className="font-bold text-forest-dark text-lg mb-2">3. Acceso al Entorno</h3>
                <p className="text-sm text-gray-600">Consigue oler, jugar, explorar...</p>
              </div>
            </div>

            <div className="text-center bg-forest/5 rounded-2xl p-6 border-2 border-forest/20">
              <h4 className="font-bold text-forest text-lg mb-2">4. Reenganche al Guía</h4>
              <p className="text-gray-700 leading-relaxed">
                Después de disfrutar el entorno, vuelve a ti por iniciativa propia. 
                <strong className="text-forest"> Sin reenganche, no hay triangulación</strong>. 
                Es el indicador de que el sistema funciona.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lo que NO hacemos */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            Lo que NO Encontrarás en Hakadogs
          </h2>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                'Castigos físicos o collares aversivos',
                'Métodos basados en "dominancia" o "ser alfa"',
                'Gritos, tirones o intimidación',
                'Soluciones rápidas que no duran',
                'Improvisación sin plan claro',
                'Ignorar el bienestar emocional',
                'Entrenar sin medir resultados',
                'Pedir demasiado sin construir base'
              ].map((item) => (
                <li key={item} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 font-bold text-sm">✕</span>
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Lo que SÍ hacemos */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            Lo que SÍ Encontrarás en Hakadogs
          </h2>
          
          <div className="bg-forest/5 border-2 border-forest/20 rounded-2xl p-8">
            <ul className="grid md:grid-cols-2 gap-4">
              {[
                'Entrenamiento del binomio completo',
                'Juego estructurado como herramienta técnica',
                'Medición de recuperación y progreso',
                'Principio de Premack (entorno como refuerzo)',
                'Un criterio claro por ejercicio',
                'Escalado progresivo y sostenible',
                'Construcción de hábitos funcionales',
                'Pausas como parte del rendimiento',
                'Simplicidad operativa y repetibilidad',
                'Bienestar emocional como prioridad',
                'Ajuste continuo basado en datos',
                'Apoyo y seguimiento personalizado'
              ].map((item) => (
                <li key={item} className="flex items-start space-x-3">
                  <CheckCircle className="text-forest flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-gray-700 font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Por qué funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-4">
            ¿Por Qué Funciona Nuestra Metodología?
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Porque está <strong className="text-forest">basada en ciencia</strong>, probada con más de 500 perros, 
            y diseñada para ser <strong className="text-forest">simple, clara y sostenible</strong>.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-cream rounded-2xl p-6 border-2 border-forest/10">
              <h3 className="font-bold text-forest-dark text-lg mb-3 flex items-center gap-2">
                <Brain className="text-forest" size={24} />
                Base Científica Sólida
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Etología, ciencias del comportamiento y neurociencia aplicada. Sabemos <strong>por qué</strong> funciona 
                cada técnica, no solo que funciona.
              </p>
            </div>
            
            <div className="bg-cream rounded-2xl p-6 border-2 border-forest/10">
              <h3 className="font-bold text-forest-dark text-lg mb-3 flex items-center gap-2">
                <Target className="text-forest" size={24} />
                Medimos el Progreso
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Recuperación, latencia, tasa de éxito, reenganche. No trabajamos con sensaciones. 
                Los datos nos dicen si vamos por buen camino.
              </p>
            </div>
            
            <div className="bg-cream rounded-2xl p-6 border-2 border-forest/10">
              <h3 className="font-bold text-forest-dark text-lg mb-3 flex items-center gap-2">
                <Heart className="text-forest" size={24} />
                Bienestar Sin Sacrificio
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Los resultados no valen si el perro está estresado, asustado o forzado. 
                Buscamos ejecución funcional <strong>con</strong> estabilidad emocional.
              </p>
            </div>
            
            <div className="bg-cream rounded-2xl p-6 border-2 border-forest/10">
              <h3 className="font-bold text-forest-dark text-lg mb-3 flex items-center gap-2">
                <TrendingUp className="text-forest" size={24} />
                Resultados Duraderos
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Construimos hábitos, no trucos. Lo que se repite correctamente se fortalece. 
                Y lo aprendido con estructura se mantiene a largo plazo.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-forest/5 to-sage/5 rounded-2xl p-8 border-2 border-forest/20">
            <h3 className="text-2xl font-bold text-forest-dark mb-4 text-center">
              La Estructura Protege el Aprendizaje
            </h3>
            <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
              Menos ejercicios, mejor ejecutados, con más calidad emocional. 
              Ese es nuestro lema. No se trata de hacer 50 cosas mal, sino 5 cosas perfectas. 
              <strong className="text-forest"> Si no hay recuperación, el diseño falla</strong>. Y lo ajustamos sin ego.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            ¿Listo para BE HAKA?
          </h2>
          <p className="text-xl text-white/90 mb-2">
            Experimenta una educación basada en respeto, ciencia y resultados medibles
          </p>
          <p className="text-lg text-white/80 mb-8">
            Más de 8 años de experiencia · +500 perros educados · 100% método positivo
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center bg-gold text-forest-dark px-8 py-4 rounded-xl font-bold hover:bg-gold/90 transition-all hover:scale-105 whitespace-nowrap shadow-xl"
            >
              Solicitar Consulta Gratuita
              <ArrowRight className="ml-2 flex-shrink-0" size={20} />
            </Link>
            <Link
              href="/cursos"
              className="inline-flex items-center bg-white/10 border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all whitespace-nowrap backdrop-blur-sm"
            >
              Ver Cursos Online
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
