'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import Toast from '@/components/ui/Toast'
import MediaLibrary from '@/components/admin/MediaLibrary'

const TinyMCEEditor = dynamic(() => import('@/components/admin/TinyMCEEditor'), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 rounded-lg animate-pulse" />
})

interface Category {
  id: string
  name: string
  slug: string
  color: string
}

export default function NuevoArticuloPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImageUrl: '',
    categoryId: '',
    status: 'draft' as 'draft' | 'published',
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .eq('is_active', true)
        .order('order_index')

      if (error) throw error
      setCategories(data || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      setToast({ message: 'Error al cargar las categorías', type: 'error' })
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^a-z0-9\s-]/g, '') // Mantener solo letras, números, espacios y guiones
        .replace(/\s+/g, '-') // Espacios a guiones
        .replace(/-+/g, '-') // Múltiples guiones a uno
        .replace(/^-+|-+$/g, '') // Eliminar guiones inicio/fin
        .substring(0, 100) // Limitar longitud
      setFormData(prev => ({ 
        ...prev, 
        slug,
        seoTitle: value.substring(0, 60)
      }))
    }
  }

  const handleSelectImage = (url: string) => {
    handleInputChange('featuredImageUrl', url)
    setToast({ message: 'Imagen seleccionada', type: 'success' })
  }

  const calculateReadingTime = (content: string): number => {
    const text = content.replace(/<[^>]*>/g, '')
    const wordCount = text.trim().split(/\s+/).length
    return Math.max(1, Math.round(wordCount / 200))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content || !formData.categoryId) {
      setToast({ message: 'Por favor completa todos los campos obligatorios', type: 'error' })
      return
    }

    setSaving(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No hay sesión activa')

      const readingTime = calculateReadingTime(formData.content)

      const { data, error } = await supabase
        .from('blog_posts')
        // @ts-ignore - Supabase types issue
        .insert({
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          featured_image_url: formData.featuredImageUrl || null,
          category_id: formData.categoryId,
          author_id: session.user.id,
          status: formData.status,
          is_featured: formData.isFeatured,
          seo_title: formData.seoTitle || formData.title,
          seo_description: formData.seoDescription || formData.excerpt,
          seo_keywords: formData.seoKeywords || null,
          reading_time_minutes: readingTime,
          published_at: formData.status === 'published' ? new Date().toISOString() : null
        })
        .select()
        .single()

      if (error) throw error

      setToast({ message: 'Artículo creado exitosamente!', type: 'success' })
      setTimeout(() => router.push('/administrator/blog'), 1500)
      
    } catch (error) {
      console.error('Error al guardar artículo:', error)
      setToast({ message: 'Error al guardar el artículo', type: 'error' })
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/administrator/blog"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Blog
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Nuevo Artículo</h1>
        <p className="text-gray-600">Completa todos los campos para crear un artículo del blog</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Contenido Principal */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título del Artículo *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ej: 5 Ejercicios Básicos para Cachorros"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL: /blog/{formData.slug || 'slug-del-articulo'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Extracto / Resumen
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Breve resumen del artículo (aparecerá en listados y redes sociales)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contenido del Artículo *
                  </label>
                  <TinyMCEEditor
                    value={formData.content}
                    onChange={(content) => handleInputChange('content', content)}
                    height={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Imagen Destacada
                  </label>
                  {formData.featuredImageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.featuredImageUrl}
                        alt="Imagen destacada"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleInputChange('featuredImageUrl', '')}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMediaLibrary(true)}
                        className="absolute bottom-2 right-2 bg-forest text-white px-4 py-2 rounded-lg hover:bg-sage transition flex items-center"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Cambiar Imagen
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-forest transition flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100"
                    >
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                      <div className="text-center">
                        <p className="text-forest font-semibold mb-1">Seleccionar Imagen</p>
                        <p className="text-sm text-gray-500">
                          Haz clic para abrir la biblioteca de medios
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* SEO Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">SEO y Metadatos</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Título SEO (max 60 caracteres)
                  </label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                    maxLength={60}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoTitle.length}/60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción SEO (max 160 caracteres)
                  </label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                    maxLength={160}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.seoDescription.length}/160 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Palabras Clave (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.seoKeywords}
                    onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                    placeholder="educación canina, adiestramiento, cachorros"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Configuración</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                        className="w-4 h-4 text-forest border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Artículo Destacado</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Aparecerá en la parte superior del blog
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Vista Previa</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiempo lectura:</span>
                    <span className="font-semibold">
                      {calculateReadingTime(formData.content)} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-semibold ${
                      formData.status === 'published' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {formData.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Guardando...' : 'Publicar Artículo'}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <MediaLibrary
          onSelect={handleSelectImage}
          onClose={() => setShowMediaLibrary(false)}
          currentImage={formData.featuredImageUrl}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
