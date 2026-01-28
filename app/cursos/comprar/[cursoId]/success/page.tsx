'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { getCourseBySlug } from '@/lib/supabase/courses'
import type { Course } from '@/lib/supabase/courses'

export default function PurchaseSuccessPage({ params }: { params: { cursoId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cursoId } = params
  const [loading, setLoading] = useState(true)
  const [curso, setCurso] = useState<Course | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function verifyPurchase() {
      try {
        const sessionId = searchParams.get('session_id')
        
        if (!sessionId) {
          setError('No se encontró información de la sesión')
          setLoading(false)
          return
        }

        // Cargar información del curso
        const courseData = await getCourseBySlug(cursoId)
        
        if (!courseData) {
          setError('Curso no encontrado')
          setLoading(false)
          return
        }

        setCurso(courseData)
        setLoading(false)

      } catch (err) {
        console.error('Error verificando compra:', err)
        setError('Error al verificar la compra')
        setLoading(false)
      }
    }

    verifyPurchase()
  }, [cursoId, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Verificando tu compra...</p>
        </div>
      </div>
    )
  }

  if (error || !curso) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Error'}
          </h1>
          <Link
            href="/cursos"
            className="inline-block bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
          >
            Volver a Cursos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Compra Realizada con Éxito!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Ya tienes acceso al curso
            </p>
            <p className="text-2xl font-bold text-forest mb-8">
              &quot;{curso.title}&quot;
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <p className="text-green-800 text-sm">
                Recibirás un email de confirmación con los detalles de tu compra y el recibo.
              </p>
            </div>

            <div className="space-y-4">
              <Link
                href={`/cursos/mi-escuela/${curso.slug}`}
                className="block w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition-all"
              >
                Comenzar Curso Ahora
              </Link>
              <Link
                href="/cursos/mi-escuela"
                className="block w-full bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-lg hover:bg-gray-200 transition-all"
              >
                Ir a Mi Escuela
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
