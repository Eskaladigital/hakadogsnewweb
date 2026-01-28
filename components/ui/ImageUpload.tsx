'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { validateImageFile, compressImage } from '@/lib/storage'

interface ImageUploadProps {
  onUpload: (file: File) => Promise<void>
  onRemove?: () => void  // Nueva prop para manejar la eliminación
  currentImage?: string
  label?: string
  maxSize?: number
  compress?: boolean
}

export default function ImageUpload({ 
  onUpload,
  onRemove,
  currentImage, 
  label = 'Subir imagen',
  maxSize = 5,
  compress = true
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    // Validate
    const validation = validateImageFile(file)
    if (!validation.valid) {
      setError(validation.error || 'Archivo inválido')
      return
    }

    try {
      setUploading(true)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Compress if needed
      let fileToUpload = file
      if (compress) {
        fileToUpload = await compressImage(file)
      }

      // Upload
      await onUpload(fileToUpload)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    // Llamar al callback de eliminación si existe
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-forest hover:bg-gray-50 transition"
        >
          {uploading ? (
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-forest rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Subiendo...</p>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Click para seleccionar imagen</p>
              <p className="text-sm text-gray-500">
                JPG, PNG o WEBP (máx. {maxSize}MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
