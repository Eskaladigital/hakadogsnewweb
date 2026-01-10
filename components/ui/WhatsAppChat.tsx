'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const phoneNumber = '34685648241' // Número de WhatsApp (sin +)
  const defaultMessage = 'Hola, me gustaría obtener más información sobre sus servicios de educación canina.'

  const handleSend = () => {
    const text = message.trim() || defaultMessage
    const encodedMessage = encodeURIComponent(text)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    setMessage('')
    setIsOpen(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Abrir chat de WhatsApp"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="text-[#25D366]" size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Hakadogs</h3>
                <p className="text-xs text-white/90">En línea</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-white/80 transition"
              aria-label="Cerrar chat de WhatsApp"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mensaje inicial */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <p className="text-sm text-gray-700">
              👋 ¡Hola! ¿En qué puedo ayudarte? Escribe tu mensaje y te redirigiremos a WhatsApp.
            </p>
          </div>

          {/* Área de mensaje */}
          <div className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25D366] focus:border-transparent resize-none text-sm"
              rows={4}
            />
            <button
              onClick={handleSend}
              className="w-full mt-3 bg-[#25D366] hover:bg-[#20BA5A] text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Send size={18} />
              <span>Enviar a WhatsApp</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              O simplemente haz clic para usar el mensaje predeterminado
            </p>
          </div>
        </div>
      )}
    </>
  )
}

