'use client'

import { getLocalSession } from '@/lib/auth/mockAuth'
import { useEffect, useState } from 'react'

export default function DebugSessionPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    // Verificar localStorage directamente
    const sessionStr = localStorage.getItem('hakadogs_session')
    
    const info: any = {
      hasLocalStorage: !!sessionStr,
      localStorageRaw: sessionStr,
    }

    if (sessionStr) {
      try {
        info.localStorageParsed = JSON.parse(sessionStr)
      } catch (e) {
        info.parseError = String(e)
      }
    }

    // Verificar con getLocalSession
    const { data, error } = getLocalSession()
    info.getLocalSessionData = data
    info.getLocalSessionError = error

    setSessionInfo(info)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Debug de Sesión</h1>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Estado de la Sesión</h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-gray-700">¿Existe en localStorage?</p>
              <p className={`text-lg ${sessionInfo?.hasLocalStorage ? 'text-green-600' : 'text-red-600'}`}>
                {sessionInfo?.hasLocalStorage ? '✅ SÍ' : '❌ NO'}
              </p>
            </div>

            {sessionInfo?.hasLocalStorage && (
              <>
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Contenido de localStorage:</p>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                    {sessionInfo?.localStorageRaw}
                  </pre>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2">Sesión parseada:</p>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                    {JSON.stringify(sessionInfo?.localStorageParsed, null, 2)}
                  </pre>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2">Resultado de getLocalSession():</p>
                  <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto">
                    {JSON.stringify(sessionInfo?.getLocalSessionData, null, 2)}
                  </pre>
                </div>
              </>
            )}

            {!sessionInfo?.hasLocalStorage && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold">⚠️ No hay sesión guardada</p>
                <p className="text-red-700 text-sm mt-2">
                  Esto significa que el login no está guardando la sesión en localStorage.
                  Necesitas iniciar sesión primero.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-2">💡 Instrucciones</h3>
          <ol className="text-blue-800 space-y-2 text-sm">
            <li>1. Si NO hay sesión, ve a <a href="/auth/login" className="underline font-semibold">/auth/login</a> e inicia sesión</li>
            <li>2. Después de iniciar sesión, vuelve a esta página</li>
            <li>3. Si hay sesión pero no funciona &quot;Mi Perfil&quot;, comparte toda esta información</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

