'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Eye, Search, Tag, Filter, Loader2, ArrowRight, TrendingUp, Star } from 'lucide-react'
import { getPublishedBlogPosts, getAllBlogCategories, getFeaturedBlogPosts, searchBlogPosts } from '@/lib/supabase/blog'
import type { BlogPostWithCategory, BlogCategory } from '@/lib/supabase/blog'

export default function BlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<BlogPostWithCategory[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<BlogPostWithCategory[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [allPosts, featured, cats] = await Promise.all([
        getPublishedBlogPosts(),
        getFeaturedBlogPosts(3),
        getAllBlogCategories()
      ])
      
      setPosts(allPosts)
      setFeaturedPosts(featured)
      setCategories(cats)
    } catch (error) {
      console.error('Error cargando blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadData()
      return
    }

    try {
      setSearching(true)
      const results = await searchBlogPosts(searchQuery, selectedCategory || undefined, 20)
      setPosts(results)
    } catch (error) {
      console.error('Error buscando:', error)
    } finally {
      setSearching(false)
    }
  }

  const filterByCategory = async (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (!categoryId) {
      loadData()
      return
    }

    const filtered = posts.filter(post => post.category_id === categoryId)
    setPosts(filtered.length > 0 ? filtered : await getPublishedBlogPosts())
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Calcular posts por categoría
  const getCategoryPostCount = (categoryId: string) => {
    return posts.filter(post => post.category_id === categoryId).length
  }

  // Obtener posts populares (ordenados por vistas)
  const popularPosts = [...posts].sort((a, b) => b.views_count - a.views_count).slice(0, 5)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-forest" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Más compacto */}
      <section className="bg-gradient-to-r from-forest to-sage text-white pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog de Educación Canina</h1>
            <p className="text-lg text-white/90">
              Consejos profesionales, guías y recursos para educar a tu perro
            </p>
          </div>
        </div>
      </section>

      {/* Artículo Destacado Principal */}
      {featuredPosts.length > 0 && !searchQuery && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8">
          <Link
            href={`/blog/${featuredPosts[0].slug}`}
            className="group block bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {featuredPosts[0].featured_image_url && (
                <div className="aspect-video md:aspect-auto bg-gray-200 overflow-hidden">
                  <img
                    src={featuredPosts[0].featured_image_url}
                    alt={featuredPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">
                    Artículo Destacado
                  </span>
                </div>
                {featuredPosts[0].category && (
                  <span
                    className="inline-block px-4 py-1.5 rounded-full text-xs font-bold text-white mb-4 w-fit"
                    style={{ backgroundColor: featuredPosts[0].category.color }}
                  >
                    {featuredPosts[0].category.name}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-forest transition">
                  {featuredPosts[0].title}
                </h2>
                <p className="text-gray-600 mb-6 line-clamp-3 text-lg">
                  {featuredPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(featuredPosts[0].published_at || featuredPosts[0].created_at)}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {featuredPosts[0].reading_time_minutes} min
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    {featuredPosts[0].views_count} vistas
                  </span>
                </div>
                <div className="mt-6 flex items-center text-forest font-semibold">
                  Leer artículo completo
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Layout Principal: 2 Columnas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* COLUMNA PRINCIPAL - Artículos */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Título de sección */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? 'Resultados de búsqueda' : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Últimos Artículos'}
              </h2>
              {!searchQuery && !selectedCategory && (
                <span className="text-sm text-gray-500">{posts.length} artículos</span>
              )}
            </div>

            {/* Lista de artículos */}
            {posts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No se encontraron artículos</p>
                <p className="text-gray-400 mb-6">Intenta con otra búsqueda o categoría</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('')
                    loadData()
                  }}
                  className="text-forest hover:underline font-medium"
                >
                  Ver todos los artículos
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  // Saltar el primer post si es featured y no hay búsqueda
                  (!searchQuery && index === 0 && featuredPosts.length > 0 && post.id === featuredPosts[0].id) ? null : (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex flex-col sm:flex-row gap-6 p-6">
                        {post.featured_image_url && (
                          <div className="sm:w-64 h-48 sm:h-auto bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-center">
                          {post.category && (
                            <span
                              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3 w-fit"
                              style={{ backgroundColor: post.category.color }}
                            >
                              {post.category.name}
                            </span>
                          )}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-forest transition line-clamp-2">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1.5" />
                              {formatDate(post.published_at || post.created_at)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1.5" />
                              {post.reading_time_minutes} min
                            </span>
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1.5" />
                              {post.views_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR DERECHA */}
          <div className="space-y-6">
            
            {/* Widget: Búsqueda */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2 text-forest" />
                Buscar Artículos
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="¿Qué buscas?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent transition text-gray-900"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching}
                  className="w-full bg-gradient-to-r from-forest to-sage text-white px-4 py-3 rounded-lg hover:opacity-90 transition font-semibold disabled:opacity-50 flex items-center justify-center"
                >
                  {searching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Buscar
                    </>
                  )}
                </button>
                {(searchQuery || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('')
                      loadData()
                    }}
                    className="w-full text-sm text-gray-600 hover:text-forest transition"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            </div>

            {/* Widget: Categorías */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2 text-forest" />
                Categorías
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => filterByCategory('')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition text-left ${
                    !selectedCategory
                      ? 'bg-forest text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">Todas las categorías</span>
                  <span className={`text-sm px-2 py-0.5 rounded-full ${
                    !selectedCategory ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {posts.length}
                  </span>
                </button>
                {categories.map(category => {
                  const count = getCategoryPostCount(category.id)
                  return (
                    <button
                      key={category.id}
                      onClick={() => filterByCategory(category.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition text-left ${
                        selectedCategory === category.id
                          ? 'text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.id ? category.color : undefined
                      }}
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        selectedCategory === category.id ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Widget: Artículos Populares */}
            {popularPosts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-forest" />
                  Más Populares
                </h3>
                <div className="space-y-4">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center">
                        <span className="text-forest font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-forest transition line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="w-3 h-3" />
                          {post.views_count} vistas
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Widget: CTA */}
            <div className="bg-gradient-to-br from-forest to-sage text-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-3">¿Quieres aprender más?</h3>
              <p className="text-white/90 mb-6 text-sm">
                Descubre nuestros cursos profesionales de educación canina
              </p>
              <Link
                href="/cursos"
                className="block w-full bg-white text-forest px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-center"
              >
                Ver Cursos
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
