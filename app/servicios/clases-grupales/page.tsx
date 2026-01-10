import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Users, CheckCircle, Calendar, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Clases Grupales para Perros - Socialización | Hakadogs',
  description: 'Clases de socialización y obediencia en grupo. Aprende mientras tu perro socializa con otros perros. Métodos positivos en Archena y Murcia.',
  alternates: {
    canonical: 'https://www.hakadogs.com/servicios/clases-grupales',
  },
  openGraph: {
    title: 'Clases Grupales para Perros - Socialización | Hakadogs',
    description: 'Clases de socialización y obediencia en grupo. Aprende mientras tu perro socializa con otros perros en Murcia.',
    url: 'https://www.hakadogs.com/servicios/clases-grupales',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Clases Grupales Caninas',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clases Grupales para Perros | Hakadogs',
    description: 'Clases de socialización y obediencia en grupo en Murcia.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function ClasesGrupalesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-cream via-white to-sage/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-sage/10 rounded-full px-6 py-3 mb-6">
              <Users className="text-sage" size={24} />
              <span className="text-sage font-semibold">Clases Grupales</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-forest-dark mb-6">
              Clases Grupales
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Socialización controlada y aprendizaje en grupo. Perfecto para perros que 
              ya tienen educación básica y necesitan practicar con distracciones.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <Calendar className="text-sage" size={20} />
                <span className="font-semibold">Sábados 10:00h</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <span className="text-2xl font-bold text-sage">15€/sesión</span>
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
                src="/images/d60234abc4831dfd6d07b333f8a73110.jpg"
                alt="Clases Grupales - Socialización"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sage/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Aprende en Comunidad</h3>
                <p className="text-lg">Socialización y obediencia en grupo</p>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-forest-dark mb-8">
              ¿Qué Trabajamos en las Clases?
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {[
                'Obediencia con distracciones',
                'Socialización con otros perros',
                'Control en entorno grupal',
                'Juegos educativos',
                'Ejercicios de concentración',
                'Recalls grupales'
              ].map((item) => (
                <div key={item} className="flex items-start space-x-3 bg-cream rounded-lg p-4">
                  <CheckCircle className="text-sage flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-sage/10 rounded-xl p-6 mb-8">
              <h3 className="font-bold text-forest-dark mb-3">Requisitos:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Perro con educación básica previa</li>
                <li>• Vacunas al día</li>
                <li>• Sin agresividad hacia personas o perros</li>
                <li>• Mayores de 6 meses</li>
              </ul>
            </div>
          </div>

          {/* Galería */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/images_Foto 26-3-21 17 03 23.jpg"
                alt="Clase grupal en exterior"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/7c96a9_0fb8981c949d418fb3191508ae90a7c5_mv2_d_1402_1600_s_2.jpg"
                alt="Socialización de perros"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/d2nomd8-0c6985e4-6016-47e3-a07a-92b7826da4ca.jpg"
                alt="Trabajo en grupo"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-sage to-green-600 text-white rounded-2xl p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Únete a Nuestra Comunidad
              </h3>
              <p className="text-xl mb-8">
                Bonos mensuales disponibles (4 sesiones: 50€)
              </p>
              <Link 
                href="/contacto"
                className="inline-flex items-center bg-white text-sage px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all whitespace-nowrap"
              >
                Más Información
                <ArrowRight className="ml-2 flex-shrink-0" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
