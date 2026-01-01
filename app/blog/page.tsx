'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, User, ArrowRight, Tag } from 'lucide-react'

// En producción, esto vendría de una base de datos o archivos MDX
const blogPosts = [
  {
    slug: '5-ejercicios-basicos-cachorro',
    title: '5 Ejercicios Básicos para Empezar con tu Cachorro',
    excerpt: 'Descubre los ejercicios fundamentales que todo cachorro debe aprender en sus primeros meses de vida.',
    category: 'Educación',
    author: 'Alfredo García',
    date: '2024-12-15',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=400&fit=crop',
    featured: true
  },
  {
    slug: 'alimentacion-saludable-perro',
    title: 'Guía Completa de Alimentación Saludable para Perros',
    excerpt: 'Todo lo que necesitas saber sobre nutrición canina: desde cachorros hasta perros senior.',
    category: 'Salud',
    author: 'Alfredo García',
    date: '2024-12-10',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
    featured: true
  },
  {
    slug: 'socializacion-perro-adulto',
    title: 'Cómo Socializar un Perro Adulto: Guía Paso a Paso',
    excerpt: 'Nunca es tarde para socializar a tu perro. Aprende técnicas efectivas para perros adultos.',
    category: 'Comportamiento',
    author: 'Alfredo García',
    date: '2024-12-05',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&h=400&fit=crop',
    featured: false
  },
  {
    slug: 'ansiedad-separacion-soluciones',
    title: 'Ansiedad por Separación: Causas y Soluciones',
    excerpt: 'Identifica los síntomas y aprende a tratar la ansiedad por separación en tu perro.',
    category: 'Comportamiento',
    author: 'Alfredo García',
    date: '2024-11-28',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=800&h=400&fit=crop',
    featured: false
  },
  {
    slug: 'ejercicios-mentales-perros',
    title: 'Juegos Mentales: Por Qué tu Perro los Necesita',
    excerpt: 'El ejercicio mental es tan importante como el físico. Descubre los mejores juegos.',
    category: 'Entrenamiento',
    author: 'Alfredo García',
    date: '2024-11-20',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=400&fit=crop',
    featured: false
  },
  {
    slug: 'paseo-perfecto-tips',
    title: 'El Paseo Perfecto: 10 Tips de un Educador Profesional',
    excerpt: 'Convierte el paseo diario en una experiencia positiva y educativa para tu perro.',
    category: 'Educación',
    author: 'Alfredo García',
    date: '2024-11-15',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&h=400&fit=crop',
    featured: false
  }
]

const categories = ['Todas', 'Educación', 'Salud', 'Comportamiento', 'Entrenamiento']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todas')

  // Filtrar posts según categoría seleccionada
  const filteredPosts = selectedCategory === 'Todas' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-gradient-to-br from-forest-dark via-forest to-sage text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Blog de Hakadogs</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Consejos, guías y recursos sobre educación canina profesional
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Categories Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                cat === selectedCategory
                  ? 'bg-forest-dark text-white shadow-lg scale-105'
                  : 'bg-white text-forest-dark hover:bg-forest-dark hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Contador de resultados */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Mostrando <span className="font-bold text-forest-dark">{filteredPosts.length}</span> artículo{filteredPosts.length !== 1 ? 's' : ''}
            {selectedCategory !== 'Todas' && (
              <span> en <span className="font-bold text-forest-dark">{selectedCategory}</span></span>
            )}
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-forest-dark mb-8">Destacados</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <span className="px-3 py-1 bg-gold/20 text-gold rounded-full font-semibold">
                        {post.category}
                      </span>
                      <span className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(post.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-forest-dark mb-3 group-hover:text-forest transition">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <span className="text-forest-dark font-semibold group-hover:text-forest flex items-center">
                        Leer más <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-forest-dark mb-8">
              {featuredPosts.length > 0 ? 'Últimos Artículos' : 'Artículos'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
                      <span className="px-3 py-1 bg-forest-dark/10 text-forest-dark rounded-full font-semibold text-xs">
                        {post.category}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-forest-dark mb-2 group-hover:text-forest transition line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No results message */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <Tag size={64} className="mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              No hay artículos en esta categoría
            </h3>
            <p className="text-gray-500 mb-8">
              Prueba con otra categoría o selecciona &quot;Todas&quot;
            </p>
            <button
              onClick={() => setSelectedCategory('Todas')}
              className="btn-primary"
            >
              Ver Todos los Artículos
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-br from-forest-dark to-forest text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Quieres recibir nuestros artículos?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestra newsletter y recibe los mejores consejos sobre educación canina directamente en tu email
          </p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:ring-2 focus:ring-gold"
            />
            <button className="px-8 py-4 bg-gold hover:bg-gold/90 text-forest-dark font-bold rounded-lg transition">
              Suscribirse
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
