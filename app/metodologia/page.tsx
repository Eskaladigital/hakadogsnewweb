import { Metadata } from 'next'
import Link from 'next/link'
import { Brain, Heart, Target, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakadogs - Metodología de Educación Canina',
  description: 'Conoce nuestra metodología basada en refuerzo positivo, respeto y ciencia. Métodos probados y efectivos.',
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
            Cómo Trabajamos
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            Metodología basada en ciencia, respeto y resultados comprobados. 
            Sin castigos, sin miedo, solo comunicación efectiva.
          </p>
        </div>
      </section>

      {/* Principios Fundamentales */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            Nuestros 4 Pilares Fundamentales
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Refuerzo Positivo',
                description: 'Premiamos los comportamientos correctos. Los perros aprenden más rápido y con más ganas cuando la educación es positiva.'
              },
              {
                icon: Brain,
                title: 'Base Científica',
                description: 'Nuestros métodos están respaldados por la etología y las ciencias del comportamiento animal.'
              },
              {
                icon: Target,
                title: 'Objetivos Claros',
                description: 'Definimos metas específicas y medibles. Sabes exactamente qué esperar y cómo medimos el progreso.'
              },
              {
                icon: TrendingUp,
                title: 'Evolución Continua',
                description: 'Evaluamos constantemente y ajustamos el plan según las necesidades específicas de cada perro.'
              }
            ].map((pilar) => (
              <div key={pilar.title} className="bg-cream rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <pilar.icon className="text-forest" size={32} />
                </div>
                <h3 className="text-xl font-bold text-forest-dark mb-3">{pilar.title}</h3>
                <p className="text-gray-700 text-sm">{pilar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proceso Paso a Paso */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            Nuestro Proceso de Trabajo
          </h2>
          
          <div className="space-y-8">
            {[
              {
                number: '01',
                title: 'Evaluación Inicial',
                description: 'Primera sesión de 1-2 horas donde conocemos a tu perro, evaluamos su comportamiento actual, historial y entorno. Identificamos objetivos específicos.',
                duration: '1-2 horas'
              },
              {
                number: '02',
                title: 'Diseño del Plan',
                description: 'Creamos un programa personalizado con ejercicios específicos, cronograma realista y hitos medibles. Te explicamos cada paso del proceso.',
                duration: 'Incluido'
              },
              {
                number: '03',
                title: 'Sesiones de Trabajo',
                description: 'Sesiones prácticas donde trabajamos comandos, situaciones específicas y problemas identificados. Combinamos teoría con práctica intensiva.',
                duration: '1 hora/sesión'
              },
              {
                number: '04',
                title: 'Práctica en Casa',
                description: 'Te enseñamos exactamente qué practicar entre sesiones. Ejercicios claros con videos de apoyo en la app HakaTrainer.',
                duration: 'Diario 15-30 min'
              },
              {
                number: '05',
                title: 'Seguimiento',
                description: 'Soporte continuo por WhatsApp para resolver dudas. Ajustamos el plan según la evolución. Celebramos cada logro.',
                duration: 'Todo el programa'
              },
              {
                number: '06',
                title: 'Generalización',
                description: 'Practicamos en diferentes entornos (parques, calles, con distracciones) para que tu perro obedezca en cualquier situación.',
                duration: 'Últimas sesiones'
              }
            ].map((paso) => (
              <div key={paso.number} className="flex items-start space-x-6 bg-white rounded-2xl p-8">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{paso.number}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-forest-dark">{paso.title}</h3>
                    <span className="text-sm text-sage font-semibold">{paso.duration}</span>
                  </div>
                  <p className="text-gray-700">{paso.description}</p>
                </div>
              </div>
            ))}
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
            <ul className="space-y-4">
              {[
                'Collares de púas o eléctricos',
                'Castigos físicos de ningún tipo',
                'Métodos basados en dominancia o "alfa"',
                'Gritos o intimidación',
                'Técnicas que generan miedo o estrés',
                'Soluciones rápidas que no duran',
                'Enfoque único para todos los perros'
              ].map((item) => (
                <li key={item} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold">✕</span>
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
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
            <ul className="space-y-4">
              {[
                'Métodos 100% positivos y respetuosos',
                'Premios, juegos y refuerzo de conductas deseadas',
                'Comunicación clara y efectiva',
                'Paciencia y empatía con perro y propietario',
                'Educación basada en el entendimiento mutuo',
                'Resultados duraderos y sostenibles',
                'Plan personalizado para cada caso',
                'Apoyo continuo durante todo el proceso'
              ].map((item) => (
                <li key={item} className="flex items-center space-x-3">
                  <CheckCircle className="text-forest flex-shrink-0" size={24} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Por qué funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            ¿Por Qué Funciona Nuestra Metodología?
          </h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              La ciencia del comportamiento animal ha demostrado repetidamente que los métodos 
              basados en <strong className="text-forest">refuerzo positivo</strong> son más efectivos, 
              más rápidos y crean vínculos más fuertes que los métodos punitivos.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
              <div className="bg-cream rounded-xl p-6">
                <h3 className="font-bold text-forest-dark mb-3">Aprendizaje Más Rápido</h3>
                <p className="text-gray-700 text-sm">
                  Los perros aprenden más rápido cuando asocian comportamientos con experiencias 
                  positivas. No pierden tiempo evitando castigos.
                </p>
              </div>
              
              <div className="bg-cream rounded-xl p-6">
                <h3 className="font-bold text-forest-dark mb-3">Mayor Retención</h3>
                <p className="text-gray-700 text-sm">
                  Lo aprendido con motivación positiva se retiene mejor a largo plazo que lo 
                  aprendido por miedo.
                </p>
              </div>
              
              <div className="bg-cream rounded-xl p-6">
                <h3 className="font-bold text-forest-dark mb-3">Sin Efectos Secundarios</h3>
                <p className="text-gray-700 text-sm">
                  Los métodos aversivos pueden generar ansiedad, miedo y agresividad. 
                  El refuerzo positivo no tiene estos riesgos.
                </p>
              </div>
              
              <div className="bg-cream rounded-xl p-6">
                <h3 className="font-bold text-forest-dark mb-3">Vínculo Fortalecido</h3>
                <p className="text-gray-700 text-sm">
                  Tu perro te verá como fuente de cosas buenas, no como amenaza. 
                  Esto fortalece la relación naturalmente.
                </p>
              </div>
            </div>
            
            <p className="text-gray-700">
              Además, trabajamos la <strong className="text-forest">generalización</strong> desde el inicio. 
              No basta con que tu perro obedezca en casa o en el parque conocido. Debe responder 
              en cualquier situación, con cualquier distracción. Por eso practicamos en múltiples 
              entornos progresivamente.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para Empezar?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Experimenta la diferencia de una educación basada en respeto y ciencia
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center bg-gold text-forest-dark px-8 py-4 rounded-xl font-bold hover:bg-gold/90 transition-all hover:scale-105 whitespace-nowrap"
          >
            Solicitar Consulta Gratuita
            <ArrowRight className="ml-2 flex-shrink-0" size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
