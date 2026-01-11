'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, Folder, Tag, FileText, 
  Loader2, Search, Filter, ChevronDown, ChevronUp, Star, Copy, 
  Calendar, User, TrendingUp, CheckSquare, Square, MoreVertical,
  ExternalLink, Grid, List, Download, Upload
} from 'lucide-react'
import Link from 'next/link'
import { getSession } from '@/lib/supabase/auth'
import { 
  getAllBlogCategories, 
  getAllBlogPosts, 
  deleteBlogPost,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  generateSlug,
  updateBlogPost
} from '@/lib/supabase/blog'
import type { BlogCategory, BlogPostWithCategory } from '@/lib/supabase/blog'

type SortField = 'title' | 'created_at' | 'views_count' | 'status' | 'category'
type SortOrder = 'asc' | 'desc'
type ViewMode = 'table' | 'grid'

export default function AdminBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts')
  const [posts, setPosts] = useState<BlogPostWithCategory[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  
  // Búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all')
  
  // Ordenación
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  
  // Vista
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  
  // Selección múltiple
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  
  // Modal de categoría
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
  const [actionLoading, setActionLoading] = useState<string | null>(null)

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

  // ===== ACCIONES DE POSTS =====

  const handleDeletePost = async (postId: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return
    
    try {
      setActionLoading(postId)
      await deleteBlogPost(postId)
      await loadData()
    } catch (error) {
      console.error('Error eliminando post:', error)
      alert('Error al eliminar el artículo')
    } finally {
      setActionLoading(null)
    }
  }

  const handleTogglePublish = async (post: BlogPostWithCategory) => {
    try {
      setActionLoading(post.id)
      const newStatus = post.status === 'published' ? 'draft' : 'published'
      await updateBlogPost(post.id, { status: newStatus })
      await loadData()
    } catch (error) {
      console.error('Error cambiando estado:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleFeatured = async (post: BlogPostWithCategory) => {
    try {
      setActionLoading(post.id)
      await updateBlogPost(post.id, { is_featured: !post.is_featured })
      await loadData()
    } catch (error) {
      console.error('Error cambiando destacado:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDuplicatePost = async (post: BlogPostWithCategory) => {
    if (!confirm(`¿Duplicar el artículo "${post.title}"?`)) return
    
    try {
      setActionLoading(post.id)
      // La duplicación se implementaría en lib/supabase/blog.ts
      alert('Funcionalidad de duplicado pendiente de implementar')
      await loadData()
    } catch (error) {
      console.error('Error duplicando:', error)
    } finally {
      setActionLoading(null)
    }
  }

  // ===== ACCIONES EN LOTE =====

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id))
    }
  }

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleBulkPublish = async () => {
    if (selectedPosts.length === 0) return
    if (!confirm(`¿Publicar ${selectedPosts.length} artículos?`)) return
    
    try {
      setSaving(true)
      await Promise.all(
        selectedPosts.map(id => updateBlogPost(id, { status: 'published' }))
      )
      setSelectedPosts([])
      await loadData()
    } catch (error) {
      console.error('Error publicando artículos:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPosts.length === 0) return
    if (!confirm(`¿ELIMINAR ${selectedPosts.length} artículos? Esta acción no se puede deshacer.`)) return
    
    try {
      setSaving(true)
      await Promise.all(
        selectedPosts.map(id => deleteBlogPost(id))
      )
      setSelectedPosts([])
      await loadData()
    } catch (error) {
      console.error('Error eliminando artículos:', error)
    } finally {
      setSaving(false)
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

  // ===== ORDENACIÓN =====

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
    setCurrentPage(1)
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-4 h-4 text-gray-400" />
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-forest" /> : 
      <ChevronDown className="w-4 h-4 text-forest" />
  }

  // ===== FILTROS Y PAGINACIÓN =====

  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || post.status === filterStatus
      const matchesCategory = filterCategory === 'all' || post.category_id === filterCategory
      const matchesFeatured = filterFeatured === 'all' || 
                             (filterFeatured === 'featured' && post.is_featured) ||
                             (filterFeatured === 'regular' && !post.is_featured)
      return matchesSearch && matchesStatus && matchesCategory && matchesFeatured
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'views_count':
          comparison = a.views_count - b.views_count
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'category':
          comparison = (a.category?.name || '').localeCompare(b.category?.name || '')
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // ===== ESTADÍSTICAS =====

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    featured: posts.filter(p => p.is_featured).length,
    totalViews: posts.reduce((sum, p) => sum + p.views_count, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando gestor de blog...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/administrator" className="inline-flex items-center text-forest hover:text-sage mb-3 transition text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Blog</h1>
              <p className="text-gray-600 mt-1 text-sm">Sistema profesional de administración de contenidos</p>
            </div>
            {activeTab === 'posts' && (
              <Link
                href="/administrator/blog/nuevo"
                className="bg-gradient-to-r from-forest to-sage text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Artículo
              </Link>
            )}
          </div>
        </div>

        {/* Estadísticas rápidas */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Artículos</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
              <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
              <div className="text-sm text-gray-600">Publicados</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-yellow-500">
              <div className="text-2xl font-bold text-gray-900">{stats.draft}</div>
              <div className="text-sm text-gray-600">Borradores</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
              <div className="text-2xl font-bold text-gray-900">{stats.featured}</div>
              <div className="text-sm text-gray-600">Destacados</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
              <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Vistas</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-4 font-semibold border-b-2 transition flex items-center ${
                  activeTab === 'posts'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-5 h-5 mr-2" />
                Artículos ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-4 font-semibold border-b-2 transition flex items-center ${
                  activeTab === 'categories'
                    ? 'border-forest text-forest'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Folder className="w-5 h-5 mr-2" />
                Categorías ({categories.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de POSTS */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Barra de herramientas */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              {/* Primera fila: Búsqueda y acciones */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar por título, contenido, excerpt..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
                    title={viewMode === 'table' ? 'Vista grid' : 'Vista tabla'}
                  >
                    {viewMode === 'table' ? <Grid className="w-5 h-5" /> : <List className="w-5 h-5" />}
                  </button>
                  
                  <button
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center"
                    title="Exportar"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Segunda fila: Filtros */}
              <div className="flex flex-wrap gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest text-sm"
                >
                  <option value="all">📋 Todos los estados ({posts.length})</option>
                  <option value="published">✅ Publicados ({stats.published})</option>
                  <option value="draft">📝 Borradores ({stats.draft})</option>
                  <option value="archived">📦 Archivados</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest text-sm"
                >
                  <option value="all">📂 Todas las categorías</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({posts.filter(p => p.category_id === cat.id).length})
                    </option>
                  ))}
                </select>

                <select
                  value={filterFeatured}
                  onChange={(e) => {
                    setFilterFeatured(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest text-sm"
                >
                  <option value="all">⭐ Todos</option>
                  <option value="featured">⭐ Solo destacados ({stats.featured})</option>
                  <option value="regular">📄 No destacados</option>
                </select>

                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest text-sm"
                >
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </select>

                {filteredPosts.length !== posts.length && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setFilterStatus('all')
                      setFilterCategory('all')
                      setFilterFeatured('all')
                      setCurrentPage(1)
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              {/* Acciones en lote */}
              {selectedPosts.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-blue-900">
                      {selectedPosts.length} artículo{selectedPosts.length > 1 ? 's' : ''} seleccionado{selectedPosts.length > 1 ? 's' : ''}
                    </span>
                    <button
                      onClick={handleBulkPublish}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                    >
                      Publicar
                    </button>
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                    >
                      Eliminar
                    </button>
                  </div>
                  <button
                    onClick={() => setSelectedPosts([])}
                    className="text-blue-900 hover:text-blue-700 text-sm font-semibold"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Resultados */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Mostrando {paginatedPosts.length} de {filteredPosts.length} artículos
                  {filteredPosts.length !== posts.length && ` (${posts.length} total)`}
                </p>
              </div>

              {/* VISTA TABLA */}
              {viewMode === 'table' && paginatedPosts.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left">
                          <input
                            type="checkbox"
                            checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 text-forest border-gray-300 rounded"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Imagen
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-forest transition"
                          onClick={() => handleSort('title')}
                        >
                          <div className="flex items-center gap-2">
                            Título
                            <SortIcon field="title" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-forest transition"
                          onClick={() => handleSort('category')}
                        >
                          <div className="flex items-center gap-2">
                            Categoría
                            <SortIcon field="category" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-forest transition"
                          onClick={() => handleSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            Estado
                            <SortIcon field="status" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-forest transition"
                          onClick={() => handleSort('views_count')}
                        >
                          <div className="flex items-center gap-2">
                            Vistas
                            <SortIcon field="views_count" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase cursor-pointer hover:text-forest transition"
                          onClick={() => handleSort('created_at')}
                        >
                          <div className="flex items-center gap-2">
                            Fecha
                            <SortIcon field="created_at" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedPosts.map(post => (
                        <tr key={post.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={selectedPosts.includes(post.id)}
                              onChange={() => handleSelectPost(post.id)}
                              className="w-4 h-4 text-forest border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                              {post.featured_image_url ? (
                                <Image
                                  src={post.featured_image_url}
                                  alt={post.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                                  {post.is_featured && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            {post.category && (
                              <span 
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ 
                                  backgroundColor: post.category.color + '20',
                                  color: post.category.color
                                }}
                              >
                                <Folder className="w-3 h-3 mr-1" />
                                {post.category.name}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              post.status === 'published' ? 'bg-green-100 text-green-800' :
                              post.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {post.status === 'published' ? '✅ Publicado' :
                               post.status === 'draft' ? '📝 Borrador' : '📦 Archivado'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Eye className="w-4 h-4" />
                              {post.views_count.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-600">
                              {new Date(post.created_at).toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                title="Ver artículo"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleToggleFeatured(post)}
                                disabled={actionLoading === post.id}
                                className={`p-2 rounded-lg transition ${
                                  post.is_featured 
                                    ? 'text-yellow-500 hover:bg-yellow-50' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                                title={post.is_featured ? 'Quitar destacado' : 'Destacar'}
                              >
                                <Star className={`w-4 h-4 ${post.is_featured ? 'fill-yellow-500' : ''}`} />
                              </button>
                              <button
                                onClick={() => handleTogglePublish(post)}
                                disabled={actionLoading === post.id}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                title={post.status === 'published' ? 'Despublicar' : 'Publicar'}
                              >
                                {post.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <Link
                                href={`/administrator/blog/editar/${post.id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                disabled={actionLoading === post.id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Eliminar"
                              >
                                {actionLoading === post.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* VISTA GRID */}
              {viewMode === 'grid' && paginatedPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPosts.map(post => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition group">
                      <div className="relative h-48 bg-gray-100">
                        {post.featured_image_url ? (
                          <Image
                            src={post.featured_image_url}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          {post.is_featured && (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
                              Destacado
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            post.status === 'published' ? 'bg-green-500 text-white' :
                            post.status === 'draft' ? 'bg-yellow-500 text-white' :
                            'bg-gray-500 text-white'
                          }`}>
                            {post.status === 'published' ? 'Publicado' :
                             post.status === 'draft' ? 'Borrador' : 'Archivado'}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          {post.category && (
                            <span className="flex items-center">
                              <Folder className="w-3 h-3 mr-1" style={{ color: post.category.color }} />
                              {post.category.name}
                            </span>
                          )}
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {post.views_count}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/administrator/blog/editar/${post.id}`}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold text-center"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            disabled={actionLoading === post.id}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                          >
                            {actionLoading === post.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Sin resultados */}
              {paginatedPosts.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No se encontraron artículos</p>
                  <p className="text-gray-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
                </div>
              )}

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                      Primera
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                      Anterior
                    </button>
                    
                    {/* Números de página */}
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 border rounded-lg transition text-sm ${
                            currentPage === pageNum
                              ? 'bg-forest text-white border-forest'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                      Siguiente
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                      Última
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido de CATEGORÍAS (sin cambios) */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleCreateCategory}
                className="bg-gradient-to-r from-forest to-sage text-white px-6 py-3 rounded-lg hover:opacity-90 transition flex items-center font-semibold shadow-lg"
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
                        <p className="text-xs text-gray-500 mt-1">
                          {posts.filter(p => p.category_id === category.id).length} artículos
                        </p>
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

      {/* Modal de categoría (sin cambios) */}
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
