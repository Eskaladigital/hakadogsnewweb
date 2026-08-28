'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Shield, BarChart3, Settings, Megaphone } from 'lucide-react'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

const ALL_ON: CookiePreferences = { necessary: true, analytics: true, functional: true, marketing: true }
const ONLY_NECESSARY: CookiePreferences = { necessary: true, analytics: false, functional: false, marketing: false }

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(ALL_ON)

  const openCookieSettings = () => {
    const consent = localStorage.getItem('hakadogs_cookie_consent')
    if (consent) {
      try {
        const saved = JSON.parse(consent) as Partial<CookiePreferences>
        setPreferences({
          necessary: true,
          analytics: Boolean(saved.analytics),
          functional: Boolean(saved.functional),
          marketing: Boolean(saved.marketing),
        })
      } catch {
        /* JSON roto */
      }
    }
    setShowBanner(false)
    setShowSettings(true)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).openCookieSettings = openCookieSettings
    }

    const consent = localStorage.getItem('hakadogs_cookie_consent')
    if (!consent) {
      setShowBanner(true)
    } else {
      try {
        const saved = JSON.parse(consent) as Partial<CookiePreferences>
        const prefs: CookiePreferences = {
          necessary: true,
          analytics: Boolean(saved.analytics),
          functional: Boolean(saved.functional),
          marketing: Boolean(saved.marketing),
        }
        setPreferences(prefs)
        applyConsent(prefs)
      } catch {
        setShowBanner(true)
      }
    }

    window.addEventListener('openCookieSettings', openCookieSettings)
    return () => {
      window.removeEventListener('openCookieSettings', openCookieSettings)
      if (typeof window !== 'undefined') {
        delete (window as any).openCookieSettings
      }
    }
  }, [])

  const applyConsent = (prefs: CookiePreferences) => {
    if (typeof window === 'undefined' || !(window as any).gtag) return
    const analytics = prefs.analytics ? 'granted' : 'denied'
    const ads = prefs.marketing ? 'granted' : 'denied'
    ;(window as any).gtag('consent', 'update', {
      analytics_storage: analytics,
      ad_storage: ads,
      ad_user_data: ads,
      ad_personalization: ads,
    })
  }

  const persist = (prefs: CookiePreferences) => {
    localStorage.setItem('hakadogs_cookie_consent', JSON.stringify(prefs))
    localStorage.setItem('hakadogs_cookie_consent_date', new Date().toISOString())
    applyConsent(prefs)
    setPreferences(prefs)
    setShowBanner(false)
    setShowSettings(false)
  }

  if (!showBanner && !showSettings) return null

  if (showSettings) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Cookie className="h-8 w-8 text-forest" aria-hidden="true" />
              <h2 id="cookie-settings-title" className="text-xl font-bold text-forest-dark">Configuración de cookies</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowSettings(false)
                if (!localStorage.getItem('hakadogs_cookie_consent')) setShowBanner(true)
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-gray-600 mb-6">
              Elige qué tipos de cookies deseas aceptar. Las cookies necesarias no se pueden desactivar ya que son imprescindibles para el funcionamiento del sitio.
            </p>
            <div className="space-y-4">
              <HakaCategory icon={Shield} title="Cookies necesarias" description="Estas cookies son esenciales para el funcionamiento del sitio web. Sin ellas, el sitio no funcionaría correctamente." enabled required />
              <HakaCategory icon={BarChart3} title="Cookies analíticas" description="Nos permiten contar las visitas y analizar cómo los usuarios navegan por el sitio para mejorarlo." enabled={preferences.analytics} onChange={(v) => setPreferences((p) => ({ ...p, analytics: v }))} />
              <HakaCategory icon={Settings} title="Cookies funcionales" description="Permiten recordar tus preferencias para una experiencia más personalizada." enabled={preferences.functional} onChange={(v) => setPreferences((p) => ({ ...p, functional: v }))} />
              <HakaCategory icon={Megaphone} title="Cookies de marketing" description="Se utilizan para mostrarte anuncios relevantes y medir la efectividad de las campañas publicitarias." enabled={preferences.marketing} onChange={(v) => setPreferences((p) => ({ ...p, marketing: v }))} />
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Para más información sobre cómo utilizamos las cookies, consulta nuestra{' '}
              <Link href="/legal/cookies" className="text-forest hover:underline" onClick={() => { setShowSettings(false); setShowBanner(false) }}>
                Política de Cookies
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button type="button" onClick={() => persist(ONLY_NECESSARY)} className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-white">Rechazar todas</button>
            <button type="button" onClick={() => persist(preferences)} className="flex-1 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Guardar preferencias</button>
            <button type="button" onClick={() => persist(ALL_ON)} className="flex-1 px-4 py-2.5 bg-forest hover:bg-forest-dark text-white rounded-lg font-medium">Aceptar todas</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] p-4 bg-white border-t border-gray-200 shadow-lg md:p-6" role="region" aria-label="Banner de consentimiento de cookies">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1 flex items-start gap-3">
            <Cookie className="h-8 w-8 text-forest flex-shrink-0 mt-1" aria-hidden="true" />
            <div>
              <h3 className="text-lg font-bold text-forest-dark mb-1">Utilizamos cookies</h3>
              <p className="text-gray-600 text-sm">
                Usamos cookies propias y de terceros para mejorar tu experiencia, analizar el tráfico y mostrarte contenido personalizado. Puedes aceptar todas o configurar tus preferencias.{' '}
                <Link href="/legal/cookies" className="text-forest hover:underline">Política de cookies</Link>
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
            <button type="button" onClick={() => { setShowBanner(false); setShowSettings(true) }} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 text-sm">
              Configurar
            </button>
            <button type="button" onClick={() => persist(ALL_ON)} className="px-4 py-2 bg-forest hover:bg-forest-dark text-white rounded-lg font-medium text-sm">
              Aceptar todas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HakaCategory({
  icon: Icon,
  title,
  description,
  enabled,
  required,
  onChange,
}: {
  icon: typeof Shield
  title: string
  description: string
  enabled: boolean
  required?: boolean
  onChange?: (v: boolean) => void
}) {
  return (
    <div className={`p-4 rounded-xl border-2 ${enabled ? 'border-forest bg-forest/5' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-forest text-white' : 'bg-gray-200 text-gray-500'}`} aria-hidden="true">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h3 className="font-semibold text-forest-dark">{title}</h3>
            {required ? (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">Siempre activas</span>
            ) : (
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => onChange?.(e.target.checked)} aria-label={title} />
                <span className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-forest transition-colors" />
                <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full border border-gray-300 shadow transition-transform peer-checked:translate-x-5" />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
