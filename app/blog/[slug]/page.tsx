import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import type { Metadata } from 'next'

// En producción, esto vendría de archivos MDX o base de datos
const blogPosts: Record<string, any> = {
  '5-ejercicios-basicos-cachorro': {
    title: '5 Ejercicios Básicos para Empezar con tu Cachorro',
    excerpt: 'Descubre los ejercicios fundamentales que todo cachorro debe aprender en sus primeros meses de vida.',
    category: 'Educación',
    author: 'Alfredo García',
    date: '2024-12-15',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=600&fit=crop',
    content: `
Los primeros meses de vida de tu cachorro son cruciales para establecer las bases de un comportamiento equilibrado. En este artículo, te presento los 5 ejercicios básicos que debes empezar a practicar desde el primer día.

## 1. Sentado (Sit)

El comando "sentado" es probablemente el más fundamental y útil que puedes enseñarle a tu cachorro. No solo es la base para muchos otros comandos, sino que también ayuda a tu cachorro a desarrollar autocontrol.

**Cómo enseñarlo:**
- Ten un premio en tu mano
- Muévelo desde la nariz del cachorro hacia arriba
- Cuando su trasero toque el suelo, di "sentado" y dale el premio
- Practica 5 veces al día durante 2 minutos

## 2. Quieto (Stay)

Una vez que tu cachorro domina "sentado", es momento de añadir duración con "quieto".

**Cómo enseñarlo:**
- Pide a tu cachorro que se siente
- Pon tu mano frente a él como señal de stop
- Di "quieto" y espera 2 segundos
- Si no se mueve, recompénsalo
- Aumenta gradualmente el tiempo

## 3. Aquí (Come/Recall)

El comando de llamada es vital para la seguridad de tu perro. Un recall sólido puede salvar su vida.

**Cómo enseñarlo:**
- Empieza en casa sin distracciones
- Di su nombre seguido de "aquí" con voz alegre
- Cuando venga, dale un premio SÚPER especial
- Nunca lo llames para regañarlo
- Practica en diferentes lugares gradualmente

## 4. Caminar con Correa

Enseñar a tu cachorro a caminar sin tirar de la correa desde pequeño ahorrará años de frustración.

**Cómo enseñarlo:**
- Usa una correa corta al principio
- Cuando tire, detente inmediatamente
- Solo avanza cuando la correa esté floja
- Recompensa cuando camine a tu lado
- Sé consistente SIEMPRE

## 5. Dejarlo (Leave it)

"Dejarlo" enseña autocontrol y puede prevenir que tu cachorro coma algo peligroso.

**Cómo enseñarlo:**
- Muestra un premio en tu mano cerrada
- Cuando deje de intentar cogerlo, di "dejarlo"
- Abre la mano
- Si no lo coge, dale un premio MEJOR de tu otra mano
- Practica con diferentes objetos

## Consejos Importantes

- **Sesiones Cortas**: Los cachorros tienen poca capacidad de atención. 5 minutos es suficiente.
- **Consistencia**: Usa siempre las mismas palabras y gestos.
- **Refuerzo Positivo**: Siempre recompensa, nunca castigues.
- **Paciencia**: Cada cachorro aprende a su ritmo.
- **Diversión**: Si no es divertido para ambos, algo estás haciendo mal.

## Errores Comunes a Evitar

1. **Entrenar cuando está cansado**: Elige momentos en que esté despierto pero tranquilo
2. **Ser impaciente**: Los cachorros son bebés, necesitan tiempo
3. **Usar el nombre para regañar**: Su nombre siempre debe asociarse con cosas positivas
4. **Entrenar con hambre extremo**: No debe estar desesperado por comida
5. **No generalizar**: Practica en diferentes lugares y situaciones

## Conclusión

Estos 5 ejercicios son los cimientos de un perro bien educado. Dedica 10-15 minutos al día a practicarlos y verás resultados sorprendentes en pocas semanas.

Recuerda: la educación de un cachorro es una inversión que pagará dividendos durante toda su vida. ¡Empieza hoy mismo!

¿Necesitas ayuda personalizada? En Hakadogs ofrecemos sesiones individuales para cachorros. [Contacta con nosotros](/contacto) para más información.
    `
  },
  'alimentacion-saludable-perro': {
    title: 'Guía Completa de Alimentación Saludable para Perros',
    category: 'Salud',
    author: 'Alfredo García',
    date: '2024-12-10',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=600&fit=crop',
    content: `
La alimentación es uno de los pilares fundamentales de la salud de tu perro. Una dieta balanceada no solo aumenta su esperanza de vida, sino que mejora su calidad de vida diaria.

## Fundamentos de la Nutrición Canina

Los perros son omnívoros con tendencia carnívora. Necesitan un balance de proteínas, grasas, carbohidratos, vitaminas y minerales.

### Proteínas (25-30%)
Las proteínas de calidad son esenciales para el desarrollo muscular, el sistema inmune y la salud general.

**Mejores fuentes:**
- Pollo
- Ternera
- Pescado
- Huevos
- Cordero

### Grasas (10-15%)
Las grasas saludables son necesarias para la energía, la piel y el pelaje brillante.

### Carbohidratos
Aunque no son esenciales, proporcionan energía y fibra.

## Tipos de Alimentación

### Pienso Seco (Croquetas)
**Ventajas:**
- Conveniente
- Económico
- Bueno para dientes
- Larga duración

**Desventajas:**
- Procesado
- Menos palatabilidad
- Menor humedad

### Comida Húmeda
**Ventajas:**
- Mayor palatabilidad
- Más hidratación
- Mejor olor

**Desventajas:**
- Más cara
- Se conserva menos
- Peor para dientes

### Dieta BARF (Raw)
**Ventajas:**
- Natural
- Alta calidad
- Control total

**Desventajas:**
- Cara
- Requiere planificación
- Riesgo bacteriano si no se hace bien

### Dieta Casera Cocinada
**Ventajas:**
- Control de ingredientes
- Adaptable
- Fresca

**Desventajas:**
- Requiere conocimiento nutricional
- Tiempo de preparación

## Cantidades Según Edad y Tamaño

### Cachorros (0-12 meses)
- 3-4 comidas al día
- Pienso específico para cachorros
- Rico en proteínas y calorías

### Adultos (1-7 años)
- 1-2 comidas al día
- Mantenimiento estándar
- Ajustar según actividad

### Seniors (7+ años)
- 2 comidas al día
- Menos calorías
- Más fibra
- Suplementos articulares

## Alimentos Prohibidos

❌ **NUNCA dar:**
- Chocolate
- Uvas y pasas
- Cebolla y ajo
- Aguacate
- Alcohol
- Café
- Nueces de macadamia
- Xilitol (edulcorante)

## Señales de Buena Nutrición

✅ Pelaje brillante
✅ Energía constante
✅ Peso ideal
✅ Heces firmes
✅ Buen olor
✅ Dientes limpios

## Consejos Prácticos

1. **Transiciones Graduales**: Cambia de alimento en 7-10 días mezclando progresivamente
2. **Horarios Fijos**: Alimenta siempre a las mismas horas
3. **Agua Fresca**: Siempre disponible
4. **Control de Peso**: Pesa mensualmente
5. **Consulta al Veterinario**: Antes de cambios drásticos

¿Dudas sobre la alimentación de tu perro? Consúltanos en nuestras sesiones personalizadas.
    `
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]
  
  if (!post) {
    return {
      title: 'Hakadogs - Artículo no encontrado',
    }
  }

  return {
    title: `Hakadogs - ${post.title}`,
    description: post.excerpt || post.content.substring(0, 160),
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Image */}
      <div className="relative h-[60vh] bg-gradient-to-br from-forest-dark to-sage">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <Link href="/blog" className="inline-flex items-center text-white/90 hover:text-white mb-6">
              <ArrowLeft size={20} className="mr-2" />
              Volver al Blog
            </Link>
            <div className="flex items-center space-x-4 mb-4">
              <span className="px-4 py-2 bg-gold text-forest-dark rounded-full font-bold text-sm">
                {post.category}
              </span>
              <span className="text-white/90 flex items-center">
                <Clock size={16} className="mr-2" />
                {post.readTime}
              </span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">{post.title}</h1>
            <div className="flex items-center space-x-6 text-white/90">
              <div className="flex items-center space-x-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={18} />
                <span>
                  {new Date(post.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
          <div className="prose prose-lg max-w-none">
            {post.content.split('\n').map((paragraph: string, index: number) => {
              if (!paragraph.trim()) return null
              
              // Headings
              if (paragraph.startsWith('## ')) {
                return <h2 key={index} className="text-3xl font-bold text-forest-dark mt-12 mb-6">{paragraph.replace('## ', '')}</h2>
              }
              if (paragraph.startsWith('### ')) {
                return <h3 key={index} className="text-2xl font-bold text-forest-dark mt-8 mb-4">{paragraph.replace('### ', '')}</h3>
              }
              
              // Lists
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={index} className="text-gray-700 leading-relaxed mb-2">
                    {paragraph.replace('- ', '')}
                  </li>
                )
              }
              
              // Bold items
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return <p key={index} className="font-bold text-forest-dark mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</p>
              }
              
              // Symbols
              if (paragraph.startsWith('✅') || paragraph.startsWith('❌')) {
                return <p key={index} className="text-gray-700 leading-relaxed my-2">{paragraph}</p>
              }
              
              // Regular paragraphs
              return (
                <p key={index} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              )
            })}
          </div>

          {/* Share Buttons */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-semibold flex items-center">
                <Share2 size={20} className="mr-2" />
                Compartir este artículo:
              </p>
              <div className="flex items-center space-x-3">
                <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition">
                  <Facebook size={20} />
                </button>
                <button className="w-10 h-10 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center transition">
                  <Twitter size={20} />
                </button>
                <button className="w-10 h-10 bg-blue-700 hover:bg-blue-800 text-white rounded-full flex items-center justify-center transition">
                  <Linkedin size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Author Box */}
        <div className="mt-12 bg-gradient-to-br from-forest-dark to-forest text-white rounded-2xl p-8">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <User size={40} className="text-forest-dark" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Sobre {post.author}</h3>
              <p className="text-white/90 mb-4">
                Educador canino profesional con más de 15 años de experiencia. 
                Especializado en modificación de conducta y entrenamiento positivo.
              </p>
              <Link href="/sobre-nosotros" className="text-gold hover:text-gold/80 font-semibold">
                Conoce más sobre nuestro equipo →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-white rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-2xl font-bold text-forest-dark mb-4">
            ¿Necesitas ayuda personalizada?
          </h3>
          <p className="text-gray-600 mb-6">
            Reserva una sesión individual y trabaja directamente con nuestro equipo de profesionales
          </p>
          <Link href="/contacto" className="btn-primary inline-block">
            Contacta con Nosotros
          </Link>
        </div>
      </article>
    </div>
  )
}
