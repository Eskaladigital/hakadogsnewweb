import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Award, Heart, TrendingUp, Users, Target, BookOpen, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakadogs - Sobre Nosotros',
  description: 'Conoce a Alfredo, educador canino profesional con +8 años de experiencia y +500 perros educados en Archena y Región de Murcia.',
}

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-cream via-white to-sage/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-forest/10 rounded-full mb-6">
                <span className="text-forest font-semibold text-sm">Sobre Nosotros</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-forest-dark mb-6">
                Alfredo, tu Educador Canino
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Con más de 8 años de experiencia y más de 500 perros educados, Alfredo ha 
                desarrollado un método único basado en el respeto, la comunicación y el refuerzo positivo.
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-bold text-forest">+8</div>
                  <div className="text-sm text-gray-600">Años</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-forest">+500</div>
                  <div className="text-sm text-gray-600">Perros</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-forest">100%</div>
                  <div className="text-sm text-gray-600">Satisfacción</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-3xl shadow-2xl overflow-hidden">
                <Image
                  src="/images/hakadogs_logo_fondo_color_2.jpg"
                  alt="Hakadogs - Educación Canina Profesional"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            Nuestros Valores
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: 'Respeto',
                description: 'Métodos positivos basados en el respeto mutuo entre perro y propietario. Sin castigos físicos ni herramientas aversivas.'
              },
              {
                icon: Target,
                title: 'Personalización',
                description: 'Cada perro es único. Adaptamos nuestros métodos a la personalidad, edad y necesidades específicas de tu perro.'
              },
              {
                icon: TrendingUp,
                title: 'Resultados',
                description: 'Nos comprometemos con el éxito. Si algo no funciona, ajustamos el enfoque hasta encontrar la solución.'
              }
            ].map((value) => (
              <div key={value.title} className="bg-cream rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="text-forest" size={32} />
                </div>
                <h3 className="text-xl font-bold text-forest-dark mb-3">{value.title}</h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filosofía BE HAKA */}
      <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Filosofía BE HAKA
          </h2>
          
          <p className="text-xl text-gray-200 mb-12 leading-relaxed">
            HAKA es más que un nombre. Es una filosofía de vida que promueve el equilibrio, 
            el respeto y la conexión auténtica entre perros y personas.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <h3 className="font-bold text-xl mb-3">Comunicación Clara</h3>
              <p className="text-gray-300">
                Enseñamos a perros y propietarios a comunicarse de forma efectiva y comprensible.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <h3 className="font-bold text-xl mb-3">Vínculo Fuerte</h3>
              <p className="text-gray-300">
                La obediencia sin conexión emocional es vacía. Fortalecemos el vínculo.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <h3 className="font-bold text-xl mb-3">Educación, no Adiestramiento</h3>
              <p className="text-gray-300">
                No creamos robots. Educamos perros equilibrados que piensan y toman buenas decisiones.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
              <h3 className="font-bold text-xl mb-3">Comprensión Profunda</h3>
              <p className="text-gray-300">
                Entendemos el por qué del comportamiento antes de trabajar en el cómo modificarlo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-forest-dark text-center mb-12">
            ¿Por Qué Elegir Hakadogs?
          </h2>
          
          <div className="space-y-6">
            {[
              {
                icon: Award,
                title: 'Experiencia Comprobada',
                description: '+8 años y +500 casos de éxito hablan por sí solos'
              },
              {
                icon: Users,
                title: 'Atención Personalizada',
                description: 'No somos una franquicia. Conocerás siempre al mismo educador: Alfredo'
              },
              {
                icon: BookOpen,
                title: 'Formación Continua',
                description: 'Actualización constante en las últimas técnicas y avances científicos'
              },
              {
                icon: Heart,
                title: 'Pasión Genuina',
                description: 'Esto no es solo un trabajo, es nuestra vocación y estilo de vida'
              }
            ].map((reason) => (
              <div key={reason.title} className="flex items-start space-x-4 bg-white rounded-xl p-6">
                <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <reason.icon className="text-forest" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-forest-dark text-lg mb-2">{reason.title}</h3>
                  <p className="text-gray-700">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-forest-dark mb-4">
            ¿Hablamos?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Cuéntanos sobre tu perro y cómo podemos ayudaros
          </p>
          <Link 
            href="/contacto"
            className="inline-flex items-center btn-primary whitespace-nowrap"
          >
            Contactar
            <ArrowRight className="ml-2 flex-shrink-0" size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
