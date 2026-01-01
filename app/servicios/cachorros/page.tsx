import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Baby, CheckCircle, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakadogs - Educación de Cachorros',
  description: 'Programa especializado para cachorros de 2 a 6 meses. Socialización temprana y bases sólidas desde el principio.',
}

export default function CachorrosPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-cream via-white to-gold/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gold/10 rounded-full px-6 py-3 mb-6">
              <Baby className="text-gold" size={24} />
              <span className="text-gold font-semibold">2-6 meses</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-forest-dark mb-6">
              Educación de Cachorros
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Los primeros meses son críticos. Establece las bases correctas desde el principio 
              y evita problemas futuros con nuestro programa especializado.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <Clock className="text-gold" size={20} />
                <span className="font-semibold">6-8 sesiones</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <span className="text-2xl font-bold text-gold">280€</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Imagen destacada */}
          <div className="mb-16">
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hakadogs_educacion_canina_home_1.png"
                alt="Educación de Cachorros"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gold/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Los Primeros Pasos</h3>
                <p className="text-lg">Establece las bases correctas desde el principio</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-forest-dark mb-8">
              ¿Por qué es tan importante la educación temprana?
            </h2>
            
            <p className="text-lg text-gray-700 mb-8">
              Las primeras 16 semanas de vida de un cachorro son el <strong>período de socialización crítico</strong>. 
              Lo que aprenda (o no aprenda) ahora determinará su comportamiento de adulto.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                'Socialización con personas y perros',
                'Control de mordida (inhibición)',
                'Educación en casa (pipí y caca)',
                'Primeros comandos básicos',
                'Prevención de ansiedad por separación',
                'Habituación a estímulos urbanos',
                'Manejo y manipulación',
                'Juego apropiado'
              ].map((item) => (
                <div key={item} className="flex items-start space-x-3 bg-cream rounded-lg p-4">
                  <CheckCircle className="text-gold flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Galería */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/57c5c9f809d29326008b53ad.jpg"
                alt="Cachorro en entrenamiento"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/d2nomd8-0c6985e4-6016-47e3-a07a-92b7826da4ca.jpg"
                alt="Socialización de cachorros"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/EwXEDf2XMAMGhqN.jpg"
                alt="Trabajo con cachorros"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-gradient-to-br from-gold to-yellow-600 text-white rounded-2xl p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">
              Empieza con Buen Pie
            </h3>
            <p className="text-xl mb-8">
              La inversión más importante que harás
            </p>
            <Link 
              href="/contacto"
              className="inline-flex items-center bg-white text-gold px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all whitespace-nowrap"
            >
              Consulta Gratuita
              <ArrowRight className="ml-2 flex-shrink-0" size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
