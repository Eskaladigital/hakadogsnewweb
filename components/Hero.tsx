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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-sage/10">
      {/* Decorative elements - Simplificado */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sage/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-forest/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <div className="inline-block px-4 py-2 bg-forest/10 rounded-full mb-6">
              <span className="text-forest font-semibold text-sm">{badge}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-forest-dark mb-6 leading-tight">
              {typeof title === 'string' ? (
                <>
                  Educación Canina
                  <span className="block text-forest">Profesional</span>
                </>
              ) : title}
            </h1>
            
            {subtitle && (
              <h2 className="text-2xl md:text-3xl font-bold text-forest mb-4">{subtitle}</h2>
            )}
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={primaryCTA.href} className="btn-primary inline-flex items-center justify-center group">
                {primaryCTA.text}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              {secondaryCTA && (
                <Link href={secondaryCTA.href} className="btn-secondary inline-flex items-center justify-center">
                  {secondaryCTA.text}
                </Link>
              )}
            </div>

            {/* Stats - Simplificado */}
            {stats && stats.length > 0 && (
              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-sage/20">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-forest">{stat.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className="relative animate-fade-in-scale">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
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
            
            {/* Floating badge */}
            {floatingBadge && (
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-2xl">{floatingBadge.emoji}</span>
                  </div>
                  <div>
                    <div className="font-bold text-forest-dark">{floatingBadge.title}</div>
                    <div className="text-sm text-gray-600">{floatingBadge.subtitle}</div>
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
