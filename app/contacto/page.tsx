'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dogName: '',
    service: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simular envío (aquí irá la lógica real)
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Form submitted:', formData)
      setSubmitSuccess(true)
      
      // Reset form después de 3 segundos
      setTimeout(() => {
        setSubmitSuccess(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          dogName: '',
          service: '',
          message: ''
        })
      }, 3000)
    } catch (error) {
      console.error('Error:', error)
      alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-br from-cream via-white to-sage/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-forest/10 rounded-full mb-4 sm:mb-6">
            <span className="text-forest font-semibold text-xs sm:text-sm">Contacto</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-forest-dark mb-4 sm:mb-6">
            Hablemos de tu Perro
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
            Primera consulta gratuita sin compromiso. Respuesta en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Información de Contacto */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-forest-dark mb-6 sm:mb-8">
                Información de Contacto
              </h2>
              
              <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="text-forest" size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-dark mb-1 text-sm sm:text-base">Teléfono</h3>
                    <a href="tel:+34685648241" className="text-sm sm:text-base text-gray-700 hover:text-forest transition">
                      685 64 82 41
                    </a>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Lun-Sab: 9:00 - 20:00</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="text-forest" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-dark mb-1">Email</h3>
                    <a href="mailto:info@hakadogs.com" className="text-gray-700 hover:text-forest transition">
                      info@hakadogs.com
                    </a>
                    <p className="text-sm text-gray-500 mt-1">Respuesta en 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-forest" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-dark mb-1">Ubicación</h3>
                    <p className="text-gray-700">Archena, Región de Murcia</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Nos desplazamos a:{' '}
                      <Link href="/adiestramiento-canino/archena" className="text-forest hover:underline">Archena</Link>,{' '}
                      <Link href="/adiestramiento-canino/molina-de-segura" className="text-forest hover:underline">Molina de Segura</Link>,{' '}
                      <Link href="/adiestramiento-canino/murcia" className="text-forest hover:underline">Murcia</Link>,{' '}
                      <Link href="/adiestramiento-canino/alguazas" className="text-forest hover:underline">Alguazas</Link>,{' '}
                      <Link href="/adiestramiento-canino/ceuti" className="text-forest hover:underline">Ceutí</Link>,{' '}
                      <Link href="/adiestramiento-canino/lorqui" className="text-forest hover:underline">Lorquí</Link> y alrededores
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-forest" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-forest-dark mb-1">Horario</h3>
                    <div className="text-gray-700 space-y-1">
                      <p>Lunes - Viernes: 9:00 - 20:00</p>
                      <p>Sábados: 9:00 - 14:00</p>
                      <p>Domingos: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="bg-cream rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <h3 className="font-bold text-forest-dark mb-3 sm:mb-4 text-sm sm:text-base">Síguenos en Redes</h3>
                <div className="flex space-x-4">
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-forest hover:text-white transition"
                  >
                    <span className="text-2xl">📘</span>
                  </a>
                  <a 
                    href="#" 
                    className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-forest hover:text-white transition"
                  >
                    <span className="text-2xl">📷</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Formulario de Contacto */}
            <div>
              <div className="bg-cream rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-forest-dark mb-4 sm:mb-6">
                  Solicita tu Consulta Gratuita
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Tu Nombre <span className="text-forest" aria-label="requerido">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      aria-required="true"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-transparent transition"
                      placeholder="Juan García"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-forest" aria-label="requerido">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      aria-required="true"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-transparent transition"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono <span className="text-forest" aria-label="requerido">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      aria-required="true"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-transparent transition"
                      placeholder="600 123 456"
                    />
                  </div>

                  <div>
                    <label htmlFor="dogName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de tu Perro
                    </label>
                    <input
                      type="text"
                      id="dogName"
                      name="dogName"
                      value={formData.dogName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-transparent transition"
                      placeholder="Max"
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Servicio que te Interesa
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-transparent transition"
                    >
                      <option value="">Selecciona un servicio</option>
                      <option value="educacion-basica">Educación Básica</option>
                      <option value="modificacion-conducta">Modificación de Conducta</option>
                      <option value="cachorros">Educación de Cachorros</option>
                      <option value="clases-grupales">Clases Grupales</option>
                      <option value="consulta">Solo Consulta</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Cuéntanos sobre tu Perro <span className="text-forest" aria-label="requerido">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      aria-required="true"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-forest focus:border-transparent transition resize-none"
                      placeholder="Edad, raza, qué necesitas trabajar, cualquier información que nos ayude..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="w-full btn-primary flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={20} />
                        Enviando...
                      </>
                    ) : submitSuccess ? (
                      <>
                        <CheckCircle className="mr-2" size={20} />
                        ¡Mensaje Enviado!
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={20} />
                        Enviar Mensaje
                      </>
                    )}
                  </button>

                  <p className="text-sm text-gray-600 text-center" role="status" aria-live="polite">
                    {submitSuccess ? '¡Gracias! Te responderemos pronto.' : 'Te responderemos en menos de 24 horas'}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Rápidas */}
      <section className="py-12 sm:py-16 md:py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-dark text-center mb-8 sm:mb-12">
            Preguntas Frecuentes
          </h2>
          
          <div className="space-y-3 sm:space-y-4">
            {[
              {
                q: '¿Cuánto cuesta la primera consulta?',
                a: 'La primera consulta es totalmente gratuita y sin compromiso. Es una oportunidad para conocernos, evaluar a tu perro y explicarte cómo podemos ayudaros.'
              },
              {
                q: '¿Te desplazas a domicilio?',
                a: 'Sí, trabajo principalmente a domicilio o en exteriores (parques, calles). Me desplazo a Archena, Molina de Segura, Murcia, Alguazas, Ceutí, Lorquí y alrededores.'
              },
              {
                q: '¿Cuánto dura el programa completo?',
                a: 'Depende del servicio: Educación Básica (8-10 sesiones, 2-3 meses), Modificación de Conducta (12-15 sesiones, 3-4 meses), Cachorros (6-8 sesiones, 1.5-2 meses).'
              },
              {
                q: '¿Qué edad debe tener mi perro?',
                a: 'Trabajamos con perros de todas las edades, desde cachorros de 2 meses hasta perros senior. Nunca es tarde para educar o modificar conductas.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-forest-dark mb-2 text-sm sm:text-base">{faq.q}</h3>
                <p className="text-sm sm:text-base text-gray-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
