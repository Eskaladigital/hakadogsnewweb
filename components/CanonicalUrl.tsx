'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Componente que inyecta automáticamente la URL canónica
 * basándose en la ruta actual. Se coloca en el layout principal.
 * 
 * Esto asegura que TODAS las páginas tengan:
 * <link rel="canonical" href="https://www.hakadogs.com/ruta-actual">
 * 
 * Usa useEffect para inyectar el canonical en el head después de la hidratación,
 * asegurando que siempre esté presente para SEO.
 */
export default function CanonicalUrl() {
  const pathname = usePathname()
  
  useEffect(() => {
    // URL base del sitio (siempre www)
    const baseUrl = 'https://www.hakadogs.com'
    
    // Construir la URL canónica
    // - Homepage: https://www.hakadogs.com (sin trailing slash)
    // - Otras páginas: https://www.hakadogs.com/ruta
    const canonicalUrl = pathname === '/' 
      ? baseUrl 
      : `${baseUrl}${pathname}`
    
    // Buscar si ya existe un canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    
    // Si no existe, crearlo
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    
    // Actualizar el href
    canonicalLink.setAttribute('href', canonicalUrl)
    
    // Cleanup: no es necesario eliminar el link al desmontar
    // porque queremos que persista para SEO
  }, [pathname])
  
  // No retornamos nada porque inyectamos directamente en el DOM
  return null
}
