'use client'

import { useState, useEffect } from 'react'
import { 
  getAllContacts, 
  getContactsByStatus, 
  updateContact, 
  markContactAsResponded,
  deleteContact,
  type ContactWithDetails 
} from '@/lib/supabase/contacts'
import { getSession } from '@/lib/supabase/auth'
import { Mail, Search, Eye, Trash2, Clock, CheckCircle, AlertCircle, MessageSquare, Phone, Calendar, X } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function ContactosPage() {
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState<ContactWithDetails[]>([])
  const [filteredContacts, setFilteredContacts] = useState<ContactWithDetails[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedContact, setSelectedContact] = useState<ContactWithDetails | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [confirmModal, setConfirmModal] = useState<any>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')

  useEffect(() => {
    loadContacts()
    loadCurrentUser()
  }, [])

  useEffect(() => {
    filterContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts, searchTerm, statusFilter])

  const loadCurrentUser = async () => {
    const { data } = await getSession()
    if (data?.session) {
      setCurrentUserId(data.session.user.id)
    }
  }

  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await getAllContacts()
      setContacts(data)
    } catch (error) {
      console.error('Error cargando contactos:', error)
      setToast({ message: 'Error al cargar contactos', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = contacts

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(contact => contact.status === statusFilter)
    }

    setFilteredContacts(filtered)
  }

  const handleUpdateStatus = async (contactId: string, newStatus: string) => {
    try {
      await updateContact(contactId, { status: newStatus as any })
      setToast({ message: 'Estado actualizado', type: 'success' })
      loadContacts()
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus as any })
      }
    } catch (error) {
      console.error('Error actualizando estado:', error)
      setToast({ message: 'Error al actualizar estado', type: 'error' })
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedContact) return

    try {
      await updateContact(selectedContact.id, { admin_notes: adminNotes })
      setToast({ message: 'Notas guardadas', type: 'success' })
      loadContacts()
    } catch (error) {
      console.error('Error guardando notas:', error)
      setToast({ message: 'Error al guardar notas', type: 'error' })
    }
  }

  const handleMarkAsResponded = async (contactId: string) => {
    try {
      await markContactAsResponded(contactId, currentUserId)
      setToast({ message: 'Marcado como respondido', type: 'success' })
      loadContacts()
    } catch (error) {
      console.error('Error marcando como respondido:', error)
      setToast({ message: 'Error al marcar como respondido', type: 'error' })
    }
  }

  const handleDelete = async (contactId: string) => {
    try {
      await deleteContact(contactId)
      setToast({ message: 'Contacto eliminado', type: 'success' })
      setSelectedContact(null)
      loadContacts()
    } catch (error) {
      console.error('Error eliminando contacto:', error)
      setToast({ message: 'Error al eliminar contacto', type: 'error' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-700'
      case 'in_progress': return 'bg-amber-100 text-amber-700'
      case 'responded': return 'bg-green-100 text-green-700'
      case 'closed': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'in_progress': return 'En Progreso'
      case 'responded': return 'Respondido'
      case 'closed': return 'Cerrado'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'responded': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  const stats = {
    total: contacts.length,
    pending: contacts.filter(c => c.status === 'pending').length,
    in_progress: contacts.filter(c => c.status === 'in_progress').length,
    responded: contacts.filter(c => c.status === 'responded').length,
    closed: contacts.filter(c => c.status === 'closed').length,
  }

  return (
    <div className="space-y-6">
      {/* Header con Estadísticas */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Contactos</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Progreso</p>
                <p className="text-2xl font-bold text-amber-600">{stats.in_progress}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Respondidos</p>
                <p className="text-2xl font-bold text-green-600">{stats.responded}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cerrados</p>
                <p className="text-2xl font-bold text-gray-600">{stats.closed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o asunto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
            />
          </div>

          {/* Filtro por Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="in_progress">En Progreso</option>
            <option value="responded">Respondidos</option>
            <option value="closed">Cerrados</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Mostrando {filteredContacts.length} de {contacts.length} contactos
        </p>
      </div>

      {/* Tabla de Contactos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Asunto
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No se encontraron contactos</p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        {contact.phone && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {contact.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 truncate max-w-xs">
                        {contact.subject || 'Sin asunto'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                        {getStatusIcon(contact.status)}
                        {getStatusLabel(contact.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatDate(contact.created_at)}
                        {contact.hours_since_created < 24 && (
                          <p className="text-xs text-amber-600 font-semibold mt-1">
                            Hace {Math.round(contact.hours_since_created)}h
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedContact(contact)
                          setAdminNotes(contact.admin_notes || '')
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-forest/10 hover:bg-forest/20 text-forest rounded-lg text-sm font-semibold transition"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles del Contacto */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Detalles del Contacto
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(selectedContact.created_at)}
                </p>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info del Contacto */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Nombre:</p>
                <p className="text-gray-900">{selectedContact.name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Email:</p>
                <p className="text-gray-900">{selectedContact.email}</p>
              </div>
              {selectedContact.phone && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Teléfono:</p>
                  <p className="text-gray-900">{selectedContact.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Estado:</p>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedContact.status)}`}>
                  {getStatusIcon(selectedContact.status)}
                  {getStatusLabel(selectedContact.status)}
                </span>
              </div>
            </div>

            {/* Asunto y Mensaje */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-2">Asunto:</p>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {selectedContact.subject || 'Sin asunto'}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-2">Mensaje:</p>
              <div className="text-gray-900 bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>

            {/* Notas Admin */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Notas Internas:
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
                placeholder="Agrega notas internas sobre este contacto..."
              />
              <button
                onClick={handleSaveNotes}
                className="mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition"
              >
                Guardar Notas
              </button>
            </div>

            {/* Cambiar Estado */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-600 mb-3">Cambiar Estado:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedContact.id, 'pending')}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition"
                >
                  Pendiente
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedContact.id, 'in_progress')}
                  className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg font-semibold transition"
                >
                  En Progreso
                </button>
                <button
                  onClick={() => handleMarkAsResponded(selectedContact.id)}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-semibold transition"
                >
                  Marcar Respondido
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedContact.id, 'closed')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
                >
                  Cerrar
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedContact(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setConfirmModal({
                    isOpen: true,
                    title: 'Eliminar Contacto',
                    message: '¿Estás seguro de que quieres eliminar este contacto? Esta acción no se puede deshacer.',
                    confirmText: 'Eliminar',
                    confirmColor: 'red' as const,
                    onConfirm: () => {
                      handleDelete(selectedContact.id)
                      setConfirmModal(null)
                    }
                  })
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          confirmColor={confirmModal.confirmColor}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  )
}
