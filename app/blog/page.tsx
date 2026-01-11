'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Eye, Search, Tag, Filter, Loader2, ArrowRight } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-forest" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-forest to-sage text-white pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Blog de HAKADOGS</h1>
            <p className="text-xl text-white/90 mb-8">
              Consejos, guías y recursos para la educación canina
            </p>
            
            {/* Barra de búsqueda */}
            <div className="bg-white rounded-xl shadow-lg p-2 flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Buscar artículos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none rounded-lg"
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="bg-gradient-to-r from-forest to-sage text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center disabled:opacity-50"
              >
                {searching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Buscar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => filterByCategory('')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                !selectedCategory
                  ? 'bg-forest text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => filterByCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : undefined
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Artículos Destacados */}
      {featuredPosts.length > 0 && !searchQuery && (
        <section className="container mx-auto px-4 sm:px-6 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Artículos Destacados</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                {post.featured_image_url && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-forest transition">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.reading_time_minutes} min
                      </span>
                    </div>
                    <span className="flex items-center text-forest font-semibold">
                      Leer más
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Todos los Artículos */}
      <section className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {searchQuery ? `Resultados de búsqueda` : selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Todos los Artículos'}
          </h2>
          <p className="text-gray-600">{posts.length} artículos</p>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No se encontraron artículos</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
                loadData()
              }}
              className="mt-4 text-forest hover:underline"
            >
              Ver todos los artículos
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition"
              >
                {post.featured_image_url && (
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img
                      src={post.featured_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
                      style={{ backgroundColor: post.category.color }}
                    >
                      {post.category.name}
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-forest transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.reading_time_minutes} min
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {post.views_count}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Quieres aprender más?</h2>
          <p className="text-xl text-white/90 mb-8">
            Explora nuestros cursos profesionales de educación canina
          </p>
          <Link
            href="/cursos"
            className="inline-block bg-white text-forest px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition"
          >
            Ver Cursos
          </Link>
        </div>
      </section>
    </div>
  )
}
