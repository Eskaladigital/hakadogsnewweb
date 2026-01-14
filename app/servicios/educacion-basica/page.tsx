import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, CheckCircle, Clock, Users as UsersIcon, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Educación Básica para Perros',
  description: 'Educación canina básica en Murcia ✓ Comandos esenciales ✓ Obediencia ✓ Paseo sin tirones. Métodos positivos 100%. Archena, Murcia y alrededores. ¡Primera sesión gratis!',
  keywords: ['educación canina básica', 'adiestramiento perros murcia', 'comandos básicos perros'],
  alternates: {
    canonical: 'https://www.hakadogs.com/servicios/educacion-basica',
  },
  openGraph: {
    title: 'Educación Básica para Perros | Hakadogs',
    description: 'Programa completo de educación canina básica. Comandos esenciales, obediencia y control con métodos positivos.',
    url: 'https://www.hakadogs.com/servicios/educacion-basica',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Educación Básica Canina',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educación Básica para Perros | Hakadogs',
    description: 'Programa completo de educación canina básica en Murcia.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function EducacionBasicaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-cream via-white to-sage/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-forest/10 rounded-full px-6 py-3 mb-6">
              <GraduationCap className="text-forest" size={24} />
              <span className="text-forest font-semibold">Servicio Principal</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-forest-dark mb-6">
              Educación Básica para Perros
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              El programa fundamental para establecer las bases de una convivencia perfecta. 
              Comandos esenciales, obediencia y control en cualquier situación.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <Clock className="text-forest" size={20} />
                <span className="font-semibold">8-10 sesiones</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <UsersIcon className="text-forest" size={20} />
                <span className="font-semibold">Todas las edades</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <span className="text-2xl font-bold text-forest">250€</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Imagen destacada */}
          <div className="mb-16">
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/hakadogs/IMG_2775.jpeg"
                alt="Educación Básica - Sesión de trabajo"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Sesiones Personalizadas</h3>
                <p className="text-lg">Trabajo individual adaptado a tu perro</p>
              </div>
            </div>
          </div>

          <div className="responsive-prose mx-auto prose max-w-none">
            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              ¿Qué Incluye el Programa?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose mb-12">
              {[
                'Sentado (Sit)',
                'Quieto (Stay)',
                'Aquí / Ven (Come)',
                'Tumba (Down)',
                'Junto (Heel)',
                'Espera (Wait)',
                'Suelta (Drop it)',
                'Déjalo (Leave it)',
                'Paseo sin tirones',
                'Llamada efectiva',
                'Control en distracciones',
                'Socialización controlada'
              ].map((item) => (
                <div key={item} className="flex items-start space-x-3 bg-cream rounded-lg p-4">
                  <CheckCircle className="text-forest flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              ¿Para Quién es Este Programa?
            </h2>
            
            <p className="text-gray-700 mb-6">
              La <strong>Educación Básica</strong> es perfecta para:
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start space-x-2">
                <span className="text-forest mt-1">•</span>
                <span><strong>Perros jóvenes y adultos</strong> sin problemas graves de conducta</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-forest mt-1">•</span>
                <span><strong>Propietarios primerizos</strong> que quieren empezar con buen pie</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-forest mt-1">•</span>
                <span><strong>Perros adoptados</strong> que necesitan aprender las normas del hogar</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-forest mt-1">•</span>
                <span><strong>Familias</strong> que buscan mejorar la convivencia diaria</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              Metodología
            </h2>
            
            <p className="text-gray-700 mb-4">
              Utilizamos <strong>métodos de refuerzo positivo</strong>, sin castigos físicos ni 
              herramientas aversivas. Cada perro aprende a su ritmo en un ambiente de confianza y respeto.
            </p>
            
            <p className="text-gray-700 mb-8">
              Las sesiones combinan trabajo en casa (eliminando distracciones inicialmente) con 
              práctica en exteriores (parques, calles, entornos reales) para garantizar que tu 
              perro obedezca en cualquier situación.
            </p>

            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              ¿Qué Lograrás?
            </h2>
            
            <ul className="space-y-4 mb-12">
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-forest flex-shrink-0 mt-1" size={24} />
                <div>
                  <strong className="text-forest-dark">Paseos relajados</strong>
                  <p className="text-gray-600">Sin tirones, disfrutando del tiempo juntos</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-forest flex-shrink-0 mt-1" size={24} />
                <div>
                  <strong className="text-forest-dark">Control total</strong>
                  <p className="text-gray-600">Tu perro responderá incluso con distracciones</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-forest flex-shrink-0 mt-1" size={24} />
                <div>
                  <strong className="text-forest-dark">Seguridad</strong>
                  <p className="text-gray-600">Llamada efectiva que puede salvar su vida</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle className="text-forest flex-shrink-0 mt-1" size={24} />
                <div>
                  <strong className="text-forest-dark">Convivencia perfecta</strong>
                  <p className="text-gray-600">En casa, en el coche, con visitas</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Galería de imágenes */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/hakadogs/IMG_5942.jpeg"
                alt="Trabajo de obediencia"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/hakadogs/6694D2C8-51F8-42C0-867C-D48893A11691.jpeg"
                alt="Entrenamiento en exterior"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-forest to-forest-dark text-white rounded-2xl p-8 md:p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">
                ¿Listo para Empezar?
              </h3>
              <p className="text-xl text-gray-200 mb-8">
                Primera consulta gratuita sin compromiso
              </p>
              <Link 
                href="/contacto"
                className="inline-flex items-center bg-gold text-forest-dark px-8 py-4 rounded-xl font-bold hover:bg-gold/90 transition-all hover:scale-105 whitespace-nowrap"
              >
                Solicitar Consulta Gratuita
                <ArrowRight className="ml-2 flex-shrink-0" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Otros servicios */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-forest-dark text-center mb-12">
            Otros Servicios
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/servicios/modificacion-conducta" className="bg-white rounded-xl p-6 hover:shadow-lg transition-all">
              <h3 className="font-bold text-lg text-forest-dark mb-2">Modificación de Conducta</h3>
              <p className="text-gray-600 text-sm">Para problemas específicos de comportamiento</p>
            </Link>
            <Link href="/servicios/cachorros" className="bg-white rounded-xl p-6 hover:shadow-lg transition-all">
              <h3 className="font-bold text-lg text-forest-dark mb-2">Educación de Cachorros</h3>
              <p className="text-gray-600 text-sm">Bases sólidas desde el principio</p>
            </Link>
            <Link href="/servicios/clases-grupales" className="bg-white rounded-xl p-6 hover:shadow-lg transition-all">
              <h3 className="font-bold text-lg text-forest-dark mb-2">Clases Grupales</h3>
              <p className="text-gray-600 text-sm">Socialización y aprendizaje en grupo</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
