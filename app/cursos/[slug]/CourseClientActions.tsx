'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Props {
  courseTitle: string
  courseSlug: string
  actionType: 'share' | 'share-button' | 'buy' | 'buy-cta'
  price?: number
}

export default function CourseClientActions({ courseTitle, courseSlug, actionType, price }: Props) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://www.hakadogs.com/cursos/${courseSlug}`
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: courseTitle,
          text: `Mira este curso de educación canina: ${courseTitle}`,
          url: url
        })
      } catch (err) {
        // El usuario canceló el share
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Error copiando URL:', err)
      }
    }
  }

  const handleBuyCourse = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      router.push(`/cursos/comprar/${courseSlug}`)
    } else {
      router.push('/cursos/auth/registro')
    }
  }

  // Botón compartir en header
  if (actionType === 'share') {
    return (
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-forest transition-colors"
      >
        <Share2 className="w-5 h-5" />
        <span className="hidden sm:inline">{copied ? '¡Copiado!' : 'Compartir'}</span>
      </button>
    )
  }

  // Botón compartir en sidebar
  if (actionType === 'share-button') {
    return (
      <button
        onClick={handleShare}
        className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center"
      >
        <Share2 className="w-5 h-5 mr-2" />
        {copied ? '¡URL Copiada!' : 'Compartir este curso'}
      </button>
    )
  }

  // Botón comprar en sidebar
  if (actionType === 'buy') {
    return (
      <button
        onClick={handleBuyCourse}
        className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center shadow-lg hover:shadow-xl"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Comprar Ahora
      </button>
    )
  }

  // Botón comprar en CTA final
  if (actionType === 'buy-cta') {
    return (
      <button
        onClick={handleBuyCourse}
        className="bg-white text-forest font-bold py-4 px-8 rounded-xl hover:bg-white/90 transition-all inline-flex items-center shadow-lg"
      >
        <ShoppingCart className="w-5 h-5 mr-2" />
        Comprar Curso por {price?.toFixed(2)}€
      </button>
    )
  }

  return null
}
