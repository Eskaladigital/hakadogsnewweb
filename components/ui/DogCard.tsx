'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, Users } from 'lucide-react'

interface DogCardProps {
  dog: {
    id: string
    name: string
    breed?: string
    photo_url?: string
    birthdate?: string
    size?: string
    bio?: string
    location_city?: string
    show_location?: boolean
    personality_tags?: string[]
    looking_for?: string
  }
  href?: string
  showActions?: boolean
  onLike?: () => void
}

export default function DogCard({ dog, href, showActions, onLike }: DogCardProps) {
  const calculateAge = (birthdate: string) => {
    const today = new Date()
    const birth = new Date(birthdate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const CardContent = () => (
    <>
      <div className="aspect-[4/3] bg-gradient-to-br from-green-200 to-emerald-200 flex items-center justify-center relative overflow-hidden">
        {dog.photo_url ? (
          <Image 
            src={dog.photo_url} 
            alt={dog.name} 
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className="text-6xl">🐕</span>
        )}
        {dog.looking_for && (
          <div className="absolute top-4 right-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-green-600">
              {dog.looking_for === 'friends' ? '🐾 Buscando amigos' :
               dog.looking_for === 'partner' ? '💚 Busca pareja' :
               dog.looking_for === 'exploring' ? '🔍 Explorando' : '✅ Disponible'}
            </span>
          </div>
        )}
        {showActions && onLike && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onLike()
            }}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition"
          >
            <Heart size={20} className="text-red-500" />
          </button>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-forest-dark mb-2 group-hover:text-green-600 transition">
          {dog.name}
        </h3>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>{dog.breed || 'Raza mixta'}</p>
          {dog.birthdate && (
            <p>{calculateAge(dog.birthdate)} años</p>
          )}
          {dog.size && (
            <p className="capitalize">{dog.size}</p>
          )}
          {dog.location_city && dog.show_location && (
            <p className="flex items-center">
              <MapPin size={14} className="mr-1" />
              {dog.location_city}
            </p>
          )}
        </div>
        {dog.bio && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-4">
            {dog.bio}
          </p>
        )}
        {dog.personality_tags && dog.personality_tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dog.personality_tags.slice(0, 3).map((tag: string) => (
              <span key={tag} className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all group block">
        <CardContent />
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <CardContent />
    </div>
  )
}
