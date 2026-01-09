'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Download, ShoppingCart, CheckCircle, Mail, Clock, Star, PlayCircle, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface Curso {
  id: string
  title: string
  description: string
  price: number
  duration: string
  whatYouLearn: string[]
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado'
  icon: string
  color: string
}

export default function CursosPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const cursos: Curso[] = [
    {
      id: 'sentarse',
      title: 'Cómo Enseñar a tu Perro a Sentarse',
      description: 'Aprende el comando más básico y fundamental de la educación canina. Perfecto para empezar.',
      price: 9.99,
      duration: '30 min',
      difficulty: 'Básico',
      whatYouLearn: [
        'Técnica paso a paso para enseñar &quot;Sentado&quot;',
        'Cómo reforzar el comportamiento correctamente',
        'Errores comunes y cómo evitarlos',
        'Ejercicios prácticos con videos'
      ],
      icon: '🎯',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'venir',
      title: 'Cómo Enseñar a tu Perro a Venir cuando le Llamas',
      description: 'La llamada más importante. Aprende a conseguir que tu perro venga siempre, incluso con distracciones.',
      price: 14.99,
      duration: '45 min',
      difficulty: 'Básico',
      whatYouLearn: [
        'Técnicas de llamada efectiva',
        'Cómo trabajar con distracciones',
        'Refuerzo positivo avanzado',
        'Solución a problemas comunes'
      ],
      icon: '📢',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'no-tirar',
      title: 'Cómo Enseñar a tu Perro a Caminar sin Tirar de la Correa',
      description: 'Paseos relajados y disfrutables. Deja de luchar con tu perro en cada paseo.',
      price: 19.99,
      duration: '1 hora',
      difficulty: 'Intermedio',
      whatYouLearn: [
        'Técnicas de paseo sin tirar',
        'Cómo usar la correa correctamente',
        'Ejercicios progresivos de dificultad',
        'Solución para perros que tiran mucho'
      ],
      icon: '🚶',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'morder',
      title: 'Cómo Solucionar que tu Perro Muerda',
      description: 'Detén el comportamiento de mordida de forma efectiva y segura. Para cachorros y adultos.',
      price: 24.99,
      duration: '1.5 horas',
      difficulty: 'Intermedio',
      whatYouLearn: [
        'Por qué los perros muerden',
        'Diferencias entre cachorros y adultos',
        'Técnicas de redirección',
        'Cómo prevenir mordidas futuras'
      ],
      icon: '🦷',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'no-saltar',
      title: 'Cómo Enseñar a tu Perro a No Saltar sobre las Personas',
      description: 'Evita situaciones incómodas cuando recibes visitas. Enseña a tu perro a saludar correctamente.',
      price: 12.99,
      duration: '40 min',
      difficulty: 'Básico',
      whatYouLearn: [
        'Por qué los perros saltan',
        'Técnica de ignorar y recompensar',
        'Cómo enseñar saludo correcto',
        'Mantener el comportamiento a largo plazo'
      ],
      icon: '🦘',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'hacer-necesidades',
      title: 'Cómo Enseñar a tu Perro a Hacer sus Necesidades Fuera',
      description: 'El problema más común con cachorros. Aprende el método más efectivo paso a paso.',
      price: 19.99,
      duration: '1 hora',
      difficulty: 'Básico',
      whatYouLearn: [
        'Rutina de salidas efectiva',
        'Señales que indican que necesita salir',
        'Qué hacer cuando hay accidentes',
        'Cómo acelerar el proceso'
      ],
      icon: '🚽',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'quieto',
      title: 'Cómo Enseñar a tu Perro a Quedarse Quieto',
      description: 'El comando &quot;Quieto&quot; es esencial para seguridad y control. Domínalo con este curso.',
      price: 14.99,
      duration: '50 min',
      difficulty: 'Intermedio',
      whatYouLearn: [
        'Técnica de &quot;Quieto&quot; paso a paso',
        'Aumentar distancia y duración gradualmente',
        'Trabajar con distracciones',
        'Aplicaciones prácticas del comando'
      ],
      icon: '✋',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'ladrar',
      title: 'Cómo Solucionar que tu Perro Ladre en Exceso',
      description: 'Reduce los ladridos molestos de forma efectiva. Entiende por qué ladra y cómo solucionarlo.',
      price: 24.99,
      duration: '1.5 horas',
      difficulty: 'Intermedio',
      whatYouLearn: [
        'Tipos de ladridos y sus causas',
        'Técnicas de desensibilización',
        'Cómo redirigir la atención',
        'Solución para ladridos por ansiedad'
      ],
      icon: '🔊',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'mendigar',
      title: 'Cómo Enseñar a tu Perro a No Mendigar Comida',
      description: 'Disfruta de tus comidas en paz. Enseña a tu perro a respetar tus momentos de comida.',
      price: 9.99,
      duration: '25 min',
      difficulty: 'Básico',
      whatYouLearn: [
        'Por qué los perros mendigan',
        'Técnica de ignorar efectiva',
        'Cómo enseñar &quot;A tu cama&quot;',
        'Mantener el comportamiento'
      ],
      icon: '🍽️',
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'socializar',
      title: 'Cómo Socializar a tu Perro con Otros Perros',
      description: 'Aprende a presentar a tu perro correctamente y fomenta interacciones positivas.',
      price: 29.99,
      duration: '2 horas',
      difficulty: 'Avanzado',
      whatYouLearn: [
        'Señales de lenguaje corporal canino',
        'Cómo hacer presentaciones correctas',
        'Gestionar situaciones de conflicto',
        'Socialización para perros tímidos o reactivos'
      ],
      icon: '🐕',
      color: 'from-cyan-500 to-cyan-600'
    }
  ]

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simular envío (aquí iría la integración real con tu servicio de newsletter)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setLoading(false)
    setEmail('')
    
    // Reset después de 5 segundos
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleBuyCourse = (cursoId: string) => {
    // Aquí iría la integración con el sistema de pago
    alert(`Redirigiendo a compra del curso: ${cursoId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cursos de Educación Canina
          </h1>
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto opacity-95">
            Soluciones específicas para problemas concretos
          </p>
          <p className="text-lg max-w-2xl mx-auto opacity-90">
            Cursos cortos y prácticos. Cada uno resuelve un problema específico de tu perro.
          </p>
        </div>
      </section>

      {/* Curso Gratuito Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gold to-yellow-400 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="bg-white/10 backdrop-blur-sm p-8 md:p-12 text-white">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Download className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Curso Gratuito</h2>
                    <p className="text-white/90">Introducción a la Educación Canina</p>
                  </div>
                </div>

                <p className="text-lg mb-6 text-white/95">
                  Descarga nuestro curso gratuito en PDF y aprende los fundamentos de la educación canina positiva. 
                  Perfecto para empezar tu camino con tu perro.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Conceptos Básicos</h3>
                      <p className="text-sm text-white/90">Comunicación canina y lenguaje corporal</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Primeros Pasos</h3>
                      <p className="text-sm text-white/90">Cómo establecer rutinas y límites</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Ejercicios Prácticos</h3>
                      <p className="text-sm text-white/90">Ejercicios paso a paso con imágenes</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">PDF Descargable</h3>
                      <p className="text-sm text-white/90">Acceso inmediato tras suscripción</p>
                    </div>
                  </div>
                </div>

                {/* Newsletter Form */}
                <form onSubmit={handleNewsletterSubmit} className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Tu email"
                          required
                          className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || submitted}
                      className="bg-white text-forest-dark font-bold px-8 py-3 rounded-lg hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {loading ? 'Enviando...' : submitted ? '✓ Enviado' : 'Descargar Gratis'}
                    </button>
                  </div>
                  {submitted && (
                    <p className="mt-4 text-sm text-white/90 text-center">
                      ✓ ¡Gracias! Revisa tu email para acceder al curso gratuito.
                    </p>
                  )}
                  <p className="mt-4 text-xs text-white/80 text-center">
                    Al suscribirte, aceptas recibir emails con contenido educativo. Puedes darte de baja en cualquier momento.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cursos de Pago Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cursos Específicos por Problema
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada curso resuelve un problema concreto. Elige el que necesitas y aprende a tu ritmo.
            </p>
          </div>

          {/* Grid de Cursos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {cursos.map((curso, index) => (
              <motion.div
                key={curso.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all flex flex-col"
              >
                {/* Header con icono y dificultad */}
                <div className={`bg-gradient-to-r ${curso.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{curso.icon}</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                      {curso.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{curso.title}</h3>
                  <p className="text-white/90 text-sm">{curso.description}</p>
                </div>

                {/* Contenido */}
                <div className="p-6 flex-grow">
                  {/* Duración */}
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">{curso.duration}</span>
                  </div>

                  {/* Qué aprenderás */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Qué aprenderás:</h4>
                    <ul className="space-y-2">
                      {curso.whatYouLearn.map((item, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-forest mr-2 flex-shrink-0 mt-0.5" />
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer con precio y botón */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-gray-900">{curso.price}€</span>
                      <span className="text-gray-600 text-sm ml-1">/único pago</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyCourse(curso.id)}
                    className={`w-full bg-gradient-to-r ${curso.color} text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center whitespace-nowrap`}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Comprar Curso
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿Cómo accedo al curso gratuito?</h3>
                <p className="text-gray-600">
                  Simplemente suscríbete con tu email arriba y recibirás el enlace de descarga del PDF en tu bandeja de entrada.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿Los cursos de pago son para siempre?</h3>
                <p className="text-gray-600">
                  Sí, una vez comprado un curso, tendrás acceso de por vida a todo el contenido y futuras actualizaciones.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿Puedo comprar varios cursos?</h3>
                <p className="text-gray-600">
                  Sí, puedes comprar todos los cursos que necesites. Cada uno es independiente y se enfoca en un problema específico.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">¿Hay garantía de devolución?</h3>
                <p className="text-gray-600">
                  Sí, ofrecemos garantía de 30 días. Si no estás satisfecho con un curso, te devolvemos el 100% de tu dinero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
