'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

/**
 * Componente optimizado para imágenes LCP (Largest Contentful Paint)
 * 
 * Características de optimización:
 * - priority: Precarga la imagen inmediatamente
 * - fetchPriority="high": Máxima prioridad de descarga
 * - Sin lazy loading (loading="eager")
 * - Placeholder blur opcional para mejor UX
 * - Optimizado para formatos WebP/AVIF automáticamente por Next.js
 * 
 * USO: Usar SOLO para la imagen hero/principal visible en viewport inicial
 * NO usar para imágenes below-the-fold
 */

interface LCPImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  quality?: number
  blurDataURL?: string
  sizes?: string
  onLoadComplete?: () => void
}

export default function LCPImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  objectFit = 'cover',
  quality = 85,
  blurDataURL,
  sizes = '100vw',
  onLoadComplete,
}: LCPImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Precargar la imagen manualmente para browsers que no soportan fetchPriority
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.imageSrcset = sizes
    document.head.appendChild(link)

    return () => {
      // Cleanup
      if (document.head.contains(link)) {
        document.head.removeChild(link)
      }
    }
  }, [src, sizes])

  const handleLoadComplete = () => {
    setIsLoaded(true)
    onLoadComplete?.()
  }

  const commonProps = {
    quality,
    priority: true, // CRÍTICO: Precarga inmediata
    loading: 'eager' as const, // Sin lazy loading
    placeholder: blurDataURL ? ('blur' as const) : undefined,
    blurDataURL,
    className: `${className} ${isLoaded ? 'animate-fade-in-scale' : 'opacity-0'}`,
    onLoad: handleLoadComplete,
    sizes,
  }

  if (fill) {
    return (
      <Image
        {...commonProps}
        src={src}
        alt={alt}
        fill
        style={{ objectFit }}
      />
    )
  }

  if (!width || !height) {
    console.warn('LCPImage: width y height son requeridos cuando fill=false')
    return null
  }

  return (
    <Image
      {...commonProps}
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{ objectFit }}
    />
  )
}

/**
 * Hook para generar placeholder blur (opcional)
 * Útil para mejorar UX mientras carga la imagen LCP
 */
export function useBlurDataURL(src: string): string | undefined {
  const [blurDataURL, setBlurDataURL] = useState<string>()

  useEffect(() => {
    // Genera un placeholder blur simple base64
    // En producción, considera generar estos placeholders en build time
    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.fillStyle = '#e5e7eb' // Color gris claro
      ctx.fillRect(0, 0, 10, 10)
      setBlurDataURL(canvas.toDataURL())
    }
  }, [src])

  return blurDataURL
}

/**
 * Componente Head para precarga manual (usar en layout o página específica)
 * 
 * Ejemplo de uso en una página:
 * 
 * export default function HomePage() {
 *   return (
 *     <>
 *       <PreloadLCPImage src="/hero-image.jpg" />
 *       <LCPImage src="/hero-image.jpg" alt="Hero" fill />
 *     </>
 *   )
 * }
 */
export function PreloadLCPImage({ 
  src, 
  imageSrcSet, 
  imageSizes = '100vw' 
}: { 
  src: string
  imageSrcSet?: string
  imageSizes?: string 
}) {
  return (
    <>
      {/* Preload para imagen LCP - máxima prioridad */}
      <link 
        rel="preload" 
        as="image" 
        href={src}
        imageSrcSet={imageSrcSet}
        imageSizes={imageSizes}
        // @ts-ignore
        fetchPriority="high"
      />
    </>
  )
}
