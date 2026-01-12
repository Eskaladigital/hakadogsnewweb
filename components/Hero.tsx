'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  badge?: string
  title: string | React.ReactNode
  subtitle?: string
  description: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
  stats?: Array<{
    value: string
    label: string
  }>
  image?: string
  floatingBadge?: {
    emoji: string
    title: string
    subtitle: string
  }
}

export default function Hero({
  badge = '+8 años de experiencia · +500 perros educados',
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  stats = [
    { value: '+500', label: 'Perros Educados' },
    { value: '+8', label: 'Años Experiencia' },
    { value: '100%', label: 'Satisfacción' }
  ],
  image = '/images/hakadogs_educacion_canina_home_2.png',
  floatingBadge = {
    emoji: '🏆',
    title: 'BE HAKA!',
    subtitle: 'Educación Respetuosa'
  }
}: HeroProps) {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] sm:min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-sage/10">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-forest/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-24 md:pt-40 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content - Eliminado framer-motion para mejorar rendimiento */}
          <div className="animate-fade-in-up">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-forest/10 rounded-full mb-4 sm:mb-6">
              <span className="text-forest font-semibold text-xs sm:text-sm">{badge}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-forest-dark mb-4 sm:mb-6 leading-tight">
              {typeof title === 'string' ? (
                <>
                  Educación Canina
                  <span className="block text-forest">Profesional</span>
                </>
              ) : title}
            </h1>
            
            {subtitle && (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-forest mb-3 sm:mb-4">{subtitle}</h2>
            )}
            
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={primaryCTA.href} className="btn-primary inline-flex items-center justify-center group whitespace-nowrap">
                {primaryCTA.text}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform flex-shrink-0" size={20} />
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} className="btn-secondary inline-flex items-center justify-center">
                  {secondaryCTA.text}
                </Link>
              )}
            </div>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-sage/20">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-2xl sm:text-3xl font-bold text-forest">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image - Optimizada con placeholder y sin framer-motion */}
          <div className="relative animate-fade-in-scale">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/5] relative">
                <Image
                  src={image}
                  alt="Educación Canina Hakadogs"
                  fill
                  className="object-cover"
                  priority
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                />
              </div>
            </div>
            
            {/* Floating badge */}
            {floatingBadge && (
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-w-xs">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl">{floatingBadge.emoji}</span>
                  </div>
                  <div>
                    <div className="font-bold text-forest-dark text-sm sm:text-base">{floatingBadge.title}</div>
                    <div className="text-xs sm:text-sm text-gray-600">{floatingBadge.subtitle}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
