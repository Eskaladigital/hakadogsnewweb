'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Image as ImageIcon, Trash2, Search, Grid, List } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface MediaFile {
  name: string
  url: string
  size: number
  created_at: string
  fullPath: string
}

interface MediaLibraryProps {
  onSelect: (url: string) => void
  onClose: () => void
  currentImage?: string
}

export default function MediaLibrary({ onSelect, onClose, currentImage }: MediaLibraryProps) {
  const [images, setImages] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedImage, setSelectedImage] = useState<string>(currentImage || '')

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.storage
        .from('blog-images')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (error) throw error

      const imageUrls: MediaFile[] = data
        .filter(file => file.name !== '.emptyFolderPlaceholder')
        .map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('blog-images')
            .getPublicUrl(file.name)
          
          return {
            name: file.name,
            url: publicUrl,
            size: file.metadata?.size || 0,
            created_at: file.created_at || '',
            fullPath: file.name
          }
        })

      setImages(imageUrls)
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validar tipo de archivo
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!validTypes.includes(file.type)) {
          throw new Error(`Tipo de archivo no válido: ${file.type}. Solo se permiten imágenes JPG, PNG, WEBP y GIF.`)
        }

        // Validar tamaño (máximo 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
          throw new Error(`El archivo ${file.name} es demasiado grande. Máximo: 10MB`)
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error, data } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          })

        if (error) {
          console.error('Supabase upload error:', error)
          throw new Error(error.message || 'Error al subir la imagen')
        }
        
        return fileName
      })

      await Promise.all(uploadPromises)
      await loadImages()
      alert('✅ Imágenes subidas correctamente')
      
    } catch (error: any) {
      console.error('Error uploading:', error)
      const errorMessage = error.message || 'Error desconocido al subir las imágenes'
      alert(`❌ Error al subir las imágenes:\n\n${errorMessage}\n\nVerifica que:\n1. El bucket 'blog-images' existe\n2. Tienes rol de administrador\n3. Las políticas RLS están configuradas`)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filePath: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return

    try {
      const { error } = await supabase.storage
        .from('blog-images')
        .remove([filePath])

      if (error) throw error

      setImages(images.filter(img => img.fullPath !== filePath))
      if (selectedImage === images.find(img => img.fullPath === filePath)?.url) {
        setSelectedImage('')
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error al eliminar la imagen')
    }
  }

  const handleSelectImage = () => {
    if (selectedImage) {
      onSelect(selectedImage)
      onClose()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Biblioteca de Medios</h2>
            <p className="text-sm text-gray-600 mt-1">
              {images.length} {images.length === 1 ? 'imagen' : 'imágenes'} en total
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar imágenes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-forest text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition ${
                viewMode === 'list' ? 'bg-forest text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <label className="bg-gradient-to-r from-forest to-sage text-white px-6 py-2 rounded-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center whitespace-nowrap">
            <Upload className="w-5 h-5 mr-2" />
            {uploading ? 'Subiendo...' : 'Subir Imágenes'}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {searchQuery ? 'No se encontraron imágenes' : 'No hay imágenes en la biblioteca'}
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Intenta con otro término de búsqueda' : 'Sube tu primera imagen para comenzar'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.fullPath}
                  className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                    selectedImage === image.url
                      ? 'border-forest ring-2 ring-forest'
                      : 'border-gray-200 hover:border-forest'
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(image.fullPath)
                      }}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  {selectedImage === image.url && (
                    <div className="absolute top-2 right-2 bg-forest text-white rounded-full p-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredImages.map((image) => (
                <div
                  key={image.fullPath}
                  className={`flex items-center gap-4 p-3 rounded-lg border-2 transition cursor-pointer ${
                    selectedImage === image.url
                      ? 'border-forest bg-forest/5'
                      : 'border-gray-200 hover:border-forest hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedImage(image.url)}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{image.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(image.size)} • {new Date(image.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(image.fullPath)
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedImage ? (
              <span className="text-forest font-semibold">✓ Imagen seleccionada</span>
            ) : (
              'Selecciona una imagen'
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSelectImage}
              disabled={!selectedImage}
              className="px-6 py-2 bg-gradient-to-r from-forest to-sage text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Usar esta imagen
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
