'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Folder, Tag, FileText, Loader2, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/supabase/auth'
import { 
  getAllBlogCategories, 
  getAllBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  generateSlug,
  calculateReadingTime
} from '@/lib/supabase/blog'
import type { BlogCategory, BlogPost, BlogPostWithCategory } from '@/lib/supabase/blog'

// Importar TinyMCE dinámicamente
const TinyMCEEditor = dynamic(() => import('@/components/admin/TinyMCEEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
})

export default function AdminBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts')
  const [posts, setPosts] = useState<BlogPostWithCategory[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  
  // Estados para modal de categoría
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#10b981',
    icon: 'Folder'
  })
  
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      const { data: sessionData } = await getSession()
      if (!sessionData?.session) {
        router.push('/cursos/auth/login')
        return
      }

      const [postsData, categoriesData] = await Promise.all([
        getAllBlogPosts(),
        getAllBlogCategories(true)
      ])

      setPosts(postsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  // ===== GESTIÓN DE POSTS =====

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return
    
    try {
      await deleteBlogPost(postId)
      await loadData()
    } catch (error) {
      console.error('Error eliminando post:', error)
    }
  }

  // ===== GESTIÓN DE CATEGORÍAS =====

  const handleCreateCategory = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      color: '#10b981',
      icon: 'Folder'
    })
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category: BlogCategory) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      color: category.color,
      icon: category.icon || 'Folder'
    })
    setShowCategoryModal(true)
  }

  const handleSaveCategory = async () => {
    try {
      setSaving(true)

      if (editingCategory) {
        await updateBlogCategory(editingCategory.id, categoryForm)
      } else {
        await createBlogCategory(categoryForm)
      }

      await loadData()
      setShowCategoryModal(false)
    } catch (error) {
      console.error('Error guardando categoría:', error)
      alert('Error al guardar la categoría')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return
    
    try {
      await deleteBlogCategory(id)
      await loadData()
    } catch (error) {
      console.error('Error eliminando categoría:', error)
      alert('Error al eliminar la categoría')
    }
  }

  // ===== FILTROS =====

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-forest" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/administrator" className="inline-flex items-center text-forest hover:text-sage mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Blog</h1>
          <p className="text-gray-600 mt-2">Administra artículos y categorías del blog</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'posts'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Artículos ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'categories'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Folder className="w-5 h-5 inline mr-2" />
                Categorías ({categories.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido según tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Barra de búsqueda y filtros */}
            <div className="bg-white rounded-lg shadow-sm p-4 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borradores</option>
                <option value="published">Publicados</option>
                <option value="archived">Archivados</option>
              </select>
              <Link
                href="/administrator/blog/nuevo"
                className="bg-gradient-to-r from-forest to-sage text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Artículo
              </Link>
            </div>

            {/* Lista de posts */}
            <div className="grid gap-4">
              {filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          post.status === 'published' ? 'bg-green-100 text-green-800' :
                          post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {post.status === 'published' ? 'Publicado' :
                           post.status === 'draft' ? 'Borrador' : 'Archivado'}
                        </span>
                        {post.is_featured && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            Destacado
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-3">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {post.category && (
                          <span className="flex items-center">
                            <Folder className="w-4 h-4 mr-1" style={{ color: post.category.color }} />
                            {post.category.name}
                          </span>
                        )}
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views_count} vistas
                        </span>
                        <span>{post.reading_time_minutes} min lectura</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/administrator/blog/editar/${post.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPosts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay artículos que coincidan con tu búsqueda</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleCreateCategory}
                className="bg-gradient-to-r from-forest to-sage text-white px-6 py-2 rounded-lg hover:opacity-90 transition flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Categoría
              </button>
            </div>

            <div className="grid gap-4">
              {categories.map(category => (
                <div key={category.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        <Folder className="w-6 h-6" style={{ color: category.color }} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <p className="text-xs text-gray-400 mt-1">Slug: /{category.slug}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => {
                    setCategoryForm({
                      ...categoryForm,
                      name: e.target.value,
                      slug: generateSlug(e.target.value)
                    })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest"
                  placeholder="Nombre de la categoría"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: generateSlug(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest"
                  placeholder="slug-de-la-categoria"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest"
                  rows={3}
                  placeholder="Descripción de la categoría..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Color
                </label>
                <input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                  className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-4">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={saving || !categoryForm.name || !categoryForm.slug}
                className="px-6 py-2 bg-gradient-to-r from-forest to-sage text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Categoría'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
