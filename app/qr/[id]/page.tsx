'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, AlertCircle, Heart } from 'lucide-react'
import { calculateAge } from '@/lib/utils'

// Mock data para perro (ejemplo)
const mockDog = {
  id: '1',
  name: 'Max',
  breed: 'Labrador Retriever',
  birthdate: '2020-05-15',
  gender: 'male',
  microchip: 'ES123456789012',
  photo_url: null,
  profile_public: true,
  special_characteristics: 'Muy amigable con niños',
  allergies: ['Polen', 'Algunos medicamentos'],
  profiles: {
    full_name: 'Propietario',
    phone: '600000000',
    email: 'propietario@example.com'
  }
}

export default function DogQRPage() {
  const params = useParams()
  const [dog, setDog] = useState(mockDog)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de datos
    // En producción real, esto vendría de una API o base de datos
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-dark via-forest to-sage">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Cargando información del perro...</p>
        </div>
      </div>
    )
  }

  if (!dog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-dark via-forest to-sage">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Perro no encontrado</h1>
          <p className="text-white/80">El código QR no corresponde a ningún perro registrado.</p>
        </div>
      </div>
    )
  }

  const isPublic = dog.profile_public

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-dark via-forest to-sage">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🐕</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isPublic ? `Perfil de ${dog.name}` : '¡Perro Encontrado!'}
          </h1>
          <p className="text-white/80">
            {isPublic ? 'Información del perro' : 'Por favor, contacta con el dueño'}
          </p>
        </div>

        {/* Foto del Perro */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl mb-6">
          <div className="aspect-square bg-gradient-to-br from-forest-dark/10 to-sage/10 flex items-center justify-center relative">
            {dog.photo_url ? (
              <Image src={dog.photo_url} alt={dog.name} fill className="object-cover" />
            ) : (
              <span className="text-9xl">🐕</span>
            )}
          </div>
        </div>

        {/* Información Principal */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl mb-6">
          <h2 className="text-3xl font-bold text-forest-dark mb-6 text-center">{dog.name}</h2>

          {isPublic && (
            <div className="space-y-4 mb-6">
              {dog.breed && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Raza</span>
                  <span className="font-semibold text-forest-dark">{dog.breed}</span>
                </div>
              )}
              {dog.birthdate && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Edad</span>
                  <span className="font-semibold text-forest-dark">
                    {calculateAge(dog.birthdate)} años
                  </span>
                </div>
              )}
              {dog.gender && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Género</span>
                  <span className="font-semibold text-forest-dark capitalize">
                    {dog.gender === 'male' ? 'Macho' : 'Hembra'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Microchip */}
          {dog.microchip && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-blue-900 mb-1">Microchip</p>
              <p className="font-mono text-blue-700">{dog.microchip}</p>
            </div>
          )}

          {/* Contacto del Dueño */}
          <div className="border-t-2 border-gray-200 pt-6">
            <h3 className="font-bold text-forest-dark mb-4 text-lg">Información de Contacto</h3>
            
            <div className="space-y-4">
              {dog.profiles?.full_name && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dueño</p>
                  <p className="font-semibold text-forest-dark text-lg">
                    {dog.profiles.full_name}
                  </p>
                </div>
              )}

              {dog.profiles?.phone && (
                <a
                  href={`tel:${dog.profiles.phone}`}
                  className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 border-2 border-green-300 rounded-lg transition"
                >
                  <Phone className="text-green-600" size={24} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Llamar</p>
                    <p className="font-semibold text-forest-dark">{dog.profiles.phone}</p>
                  </div>
                </a>
              )}

              {dog.profiles?.email && (
                <a
                  href={`mailto:${dog.profiles.email}`}
                  className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-300 rounded-lg transition"
                >
                  <Mail className="text-blue-600" size={24} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-forest-dark">{dog.profiles.email}</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Notas de Emergencia */}
          {dog.special_characteristics && (
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-yellow-900 mb-1">Información Importante</p>
                  <p className="text-sm text-yellow-800">{dog.special_characteristics}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alergias */}
          {dog.allergies && dog.allergies.length > 0 && (
            <div className="mt-6 bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-red-900 mb-2">⚠️ Alergias</p>
                  <div className="flex flex-wrap gap-2">
                    {dog.allergies.map((allergy: string) => (
                      <span key={allergy} className="px-3 py-1 bg-red-200 text-red-900 rounded-full text-sm font-medium">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ver Perfil Completo */}
        {isPublic && (
          <div className="text-center">
            <Link
              href={`/apps/hakacommunity`}
              className="inline-flex items-center px-8 py-4 bg-white text-forest-dark hover:bg-gray-100 rounded-xl font-bold text-lg shadow-lg transition"
            >
              <Heart size={24} className="mr-2" />
              Ver Perfil Completo
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-white/80 hover:text-white transition">
            <span className="text-2xl mb-2 block">🐕</span>
            <span className="font-semibold">Hakadogs</span>
          </Link>
          <p className="text-white/60 text-sm mt-2">
            Educación canina profesional
          </p>
        </div>
      </div>
    </div>
  )
}
