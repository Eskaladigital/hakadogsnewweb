'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X, Settings, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Siempre true, no se puede desactivar
    analytics: false,
    marketing: false,
  })

  // Función global para abrir el panel de configuración
  const openCookieSettings = () => {
    // Cargar preferencias actuales si existen
    const consent = localStorage.getItem('hakadogs_cookie_consent')
    if (consent) {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
    }
    setShowBanner(true)
    setShowSettings(true)
  }

  useEffect(() => {
    // Exponer función global para que el Footer pueda abrirla
    if (typeof window !== 'undefined') {
      (window as any).openCookieSettings = openCookieSettings
    }

    // Verificar si el usuario ya ha dado su consentimiento
    const consent = localStorage.getItem('hakadogs_cookie_consent')
    if (!consent) {
      // Mostrar el banner después de un pequeño delay para mejor UX
      setTimeout(() => setShowBanner(true), 1000)
    } else {
      // Cargar preferencias guardadas
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
      
      // Si se aceptaron analytics, cargar Google Analytics
      if (savedPreferences.analytics) {
        loadGoogleAnalytics()
      }
    }

    // Cleanup: eliminar función global al desmontar
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).openCookieSettings
      }
    }
  }, [])

  const loadGoogleAnalytics = () => {
    // Habilitar Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('hakadogs_cookie_consent', JSON.stringify(prefs))
    localStorage.setItem('hakadogs_cookie_consent_date', new Date().toISOString())
    
    // Si se aceptaron analytics, cargar Google Analytics
    if (prefs.analytics) {
      loadGoogleAnalytics()
    }
    
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    }
    setPreferences(allAccepted)
    savePreferences(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
    }
    setPreferences(necessaryOnly)
    savePreferences(necessaryOnly)
  }

  const acceptSelected = () => {
    savePreferences(preferences)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // No se puede desactivar
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setShowBanner(false)}
          />

          {/* Banner de cookies */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
          >
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border-2 border-forest/10 overflow-hidden">
              {!showSettings ? (
                // Vista principal del banner
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Cookie className="w-6 h-6 text-forest" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-forest-dark mb-2">
                        🍪 Utilizamos cookies
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación, 
                        analizar el tráfico del sitio y personalizar el contenido. Puedes aceptar todas las 
                        cookies, rechazarlas o personalizar tus preferencias.
                      </p>
                      <Link 
                        href="/legal/cookies" 
                        className="text-forest hover:text-forest-dark underline text-sm mt-2 inline-block"
                      >
                        Leer más sobre nuestra política de cookies
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={acceptAll}
                      className="flex-1 bg-forest hover:bg-forest-dark text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Aceptar todas
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      Solo necesarias
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className="flex-1 border-2 border-forest text-forest hover:bg-forest/5 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Settings className="w-5 h-5" />
                      Personalizar
                    </button>
                  </div>
                </div>
              ) : (
                // Vista de configuración detallada
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center">
                        <Settings className="w-6 h-6 text-forest" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-forest-dark">
                        Preferencias de cookies
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Cookies necesarias */}
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-forest-dark mb-1">
                            🔒 Cookies necesarias
                          </h4>
                          <p className="text-sm text-gray-600">
                            Esenciales para el funcionamiento del sitio web. No se pueden desactivar.
                          </p>
                        </div>
                        <div className="ml-4">
                          <div className="w-12 h-6 bg-forest rounded-full flex items-center px-1">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Incluye: sesión de usuario, preferencias de idioma, seguridad
                      </p>
                    </div>

                    {/* Cookies analíticas */}
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-forest-dark mb-1">
                            📊 Cookies analíticas
                          </h4>
                          <p className="text-sm text-gray-600">
                            Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web.
                          </p>
                        </div>
                        <button
                          onClick={() => togglePreference('analytics')}
                          className="ml-4"
                        >
                          <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.analytics ? 'bg-forest' : 'bg-gray-300'
                          }`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              preferences.analytics ? 'ml-auto' : ''
                            }`}></div>
                          </div>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Incluye: Google Analytics (G-NXPT2KNYGJ)
                      </p>
                    </div>

                    {/* Cookies de marketing */}
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-forest-dark mb-1">
                            🎯 Cookies de marketing
                          </h4>
                          <p className="text-sm text-gray-600">
                            Utilizadas para mostrar anuncios relevantes según tus intereses.
                          </p>
                        </div>
                        <button
                          onClick={() => togglePreference('marketing')}
                          className="ml-4"
                        >
                          <div className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.marketing ? 'bg-forest' : 'bg-gray-300'
                          }`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                              preferences.marketing ? 'ml-auto' : ''
                            }`}></div>
                          </div>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Incluye: Facebook Pixel, Google Ads (próximamente)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={acceptSelected}
                      className="flex-1 bg-forest hover:bg-forest-dark text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
                    >
                      Guardar preferencias
                    </button>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      Volver
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
