import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Modificación de Conducta Canina',
  description: 'Modificación conducta canina Murcia ✓ Agresividad ✓ Ansiedad separación ✓ Miedos ✓ Ladridos. Especialistas en problemas conducta. Evaluación gratuita Archena.',
  keywords: ['modificación conducta perros', 'perro agresivo murcia', 'ansiedad separación perros'],
  alternates: {
    canonical: 'https://www.hakadogs.com/servicios/modificacion-conducta',
  },
  openGraph: {
    title: 'Modificación de Conducta Canina | Hakadogs',
    description: 'Soluciones profesionales para agresividad, ansiedad, miedos y conductas no deseadas. Especialistas en Murcia.',
    url: 'https://www.hakadogs.com/servicios/modificacion-conducta',
    images: [
      {
        url: 'https://www.hakadogs.com/images/logo_facebook_1200_630.jpg',
        width: 1200,
        height: 630,
        alt: 'Hakadogs - Modificación de Conducta Canina',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Modificación de Conducta Canina | Hakadogs',
    description: 'Soluciones para agresividad, ansiedad y miedos. Especialistas en Murcia.',
    images: ['https://www.hakadogs.com/images/logo_facebook_1200_630.jpg'],
  },
}

export default function ModificacionConductaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-cream via-white to-terracotta/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-terracotta/10 rounded-full px-6 py-3 mb-6">
              <Heart className="text-terracotta" size={24} />
              <span className="text-terracotta font-semibold">Servicio Especializado</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-forest-dark mb-6">
              Modificación de Conducta
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Soluciones profesionales y efectivas para problemas de comportamiento. 
              Recupera la tranquilidad y el bienestar de tu perro y tu familia.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <Clock className="text-terracotta" size={20} />
                <span className="font-semibold">12-15 sesiones</span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-lg px-6 py-3 shadow-sm">
                <span className="text-2xl font-bold text-terracotta">Desde 270€</span>
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
                src="/images/images_Foto 26-3-21 17 03 23.jpg"
                alt="Modificación de Conducta - Trabajo profesional"
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-terracotta/80 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Soluciones Efectivas</h3>
                <p className="text-lg">Cada problema tiene solución con el enfoque correcto</p>
              </div>
            </div>
          </div>

          <div className="responsive-prose mx-auto prose max-w-none">
            <div className="bg-terracotta/10 border-l-4 border-terracotta rounded-lg p-6 mb-12">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-terracotta flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-forest-dark mb-2">¿Tu perro tiene problemas de conducta?</h3>
                  <p className="text-gray-700 mb-0">
                    No estás solo. Muchos problemas de comportamiento tienen solución con el 
                    enfoque correcto, paciencia y técnicas profesionales.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              Problemas que Tratamos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose mb-12">
              {[
                {
                  title: 'Agresividad',
                  desc: 'Hacia personas, otros perros o animales'
                },
                {
                  title: 'Ansiedad por Separación',
                  desc: 'Destrozos, ladridos excesivos cuando está solo'
                },
                {
                  title: 'Ladridos Excesivos',
                  desc: 'A desconocidos, ruidos, cuando se queda solo'
                },
                {
                  title: 'Miedos y Fobias',
                  desc: 'A ruidos, personas, objetos o situaciones'
                },
                {
                  title: 'Destructividad',
                  desc: 'Muebles, puertas, objetos personales'
                },
                {
                  title: 'Problemas de Socialización',
                  desc: 'Reactividad con otros perros'
                },
                {
                  title: 'Hiperactividad',
                  desc: 'Incapacidad para calmarse o estar quieto'
                },
                {
                  title: 'Problemas en Casa',
                  desc: 'Pipí/caca, saltar a visitas, robar comida'
                }
              ].map((item) => (
                <div key={item.title} className="bg-cream rounded-lg p-4">
                  <h4 className="font-bold text-forest-dark mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              Nuestro Enfoque
            </h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-terracotta">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-forest-dark mb-2">Evaluación Exhaustiva</h4>
                  <p className="text-gray-700">
                    Analizamos el historial completo, desencadenantes, patrones de comportamiento 
                    y el entorno del perro para identificar la raíz del problema.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-terracotta">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-forest-dark mb-2">Plan Personalizado</h4>
                  <p className="text-gray-700">
                    Cada perro es único. Diseñamos un protocolo específico basado en técnicas 
                    de modificación de conducta probadas científicamente.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-terracotta">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-forest-dark mb-2">Trabajo Progresivo</h4>
                  <p className="text-gray-700">
                    Avanzamos paso a paso, respetando los tiempos del perro. Desensibilización 
                    sistemática y contracondicionamiento cuando es necesario.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-terracotta">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-forest-dark mb-2">Seguimiento Intensivo</h4>
                  <p className="text-gray-700">
                    Apoyo continuo vía WhatsApp, ajustes del plan según evolución y disponibilidad 
                    para emergencias durante el proceso.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              ¿Qué Incluye?
            </h2>
            
            <ul className="space-y-3 mb-12">
              {[
                'Evaluación inicial exhaustiva (2 horas)',
                '12-15 sesiones personalizadas',
                'Plan de modificación específico',
                'Técnicas de desensibilización y contracondicionamiento',
                'Manejo de crisis y situaciones difíciles',
                'Material de apoyo y ejercicios específicos',
                'Seguimiento intensivo por WhatsApp',
                'Soporte 24/7 para emergencias',
                'Revisiones gratuitas post-programa',
                'Acceso completo a las 3 apps de Hakadogs'
              ].map((item) => (
                <li key={item} className="flex items-start space-x-3">
                  <CheckCircle className="text-terracotta flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-3xl font-bold text-forest-dark mb-6">
              Casos de Éxito
            </h2>
            
            <div className="bg-cream rounded-xl p-6 mb-8">
              <p className="text-gray-700 italic mb-4">
                &quot;Max era agresivo con otros perros desde cachorro. No podíamos pasear tranquilos. 
                Después de 3 meses de trabajo con Alfredo, Max puede cruzarse con perros sin reaccionar. 
                Ha cambiado completamente nuestra vida.&quot;
              </p>
              <p className="font-bold text-forest-dark">— Carlos M., Max (Pastor Alemán)</p>
            </div>

            {/* Galería */}
            <div className="grid md:grid-cols-2 gap-6 mb-12 not-prose">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/d2nomd8-0c6985e4-6016-47e3-a07a-92b7826da4ca.jpg"
                  alt="Trabajo de socialización"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/7c96a9_0fb8981c949d418fb3191508ae90a7c5_mv2_d_1402_1600_s_2.jpg"
                  alt="Sesión de modificación de conducta"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-terracotta to-red-600 text-white rounded-2xl p-8 md:p-12 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Da el Primer Paso
              </h3>
              <p className="text-xl text-gray-100 mb-8">
                Cada problema tiene solución. Hablemos de tu caso específico.
              </p>
              <Link 
                href="/contacto"
                className="inline-flex items-center bg-white text-terracotta px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 whitespace-nowrap"
              >
                Consulta Gratuita
                <ArrowRight className="ml-2 flex-shrink-0" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
