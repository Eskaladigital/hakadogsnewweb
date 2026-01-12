'use client'

/**
 * Loading Skeleton para componentes lazy-loaded
 * Previene layout shifts mientras se cargan componentes
 */

interface LoadingSkeletonProps {
  variant?: 'section' | 'hero' | 'card' | 'list'
  count?: number
  className?: string
}

export default function LoadingSkeleton({ 
  variant = 'section', 
  count = 1,
  className = '' 
}: LoadingSkeletonProps) {
  
  if (variant === 'section') {
    return (
      <div className={`py-12 sm:py-16 md:py-20 animate-pulse ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded-lg w-2/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
          </div>
          
          {/* Content */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-64"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (variant === 'hero') {
    return (
      <div className={`min-h-screen flex items-center justify-center animate-pulse ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Text content */}
            <div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-5/6 mb-8"></div>
              <div className="flex gap-4">
                <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
                <div className="h-12 bg-gray-200 rounded-lg w-32"></div>
              </div>
            </div>
            
            {/* Image */}
            <div className="aspect-[4/5] bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    )
  }
  
  if (variant === 'card') {
    return (
      <div className={`animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg mb-4">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    )
  }
  
  if (variant === 'list') {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return null
}

/**
 * Skeleton específico para secciones con diferentes layouts
 */
export function ServicesSkeleton() {
  return (
    <div className="py-12 sm:py-16 md:py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded-lg w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-16 h-16 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSkeleton() {
  return (
    <div className="py-12 sm:py-16 md:py-20 bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded-lg w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-2/3 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GallerySkeleton() {
  return (
    <div className="py-12 sm:py-16 md:py-20 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
