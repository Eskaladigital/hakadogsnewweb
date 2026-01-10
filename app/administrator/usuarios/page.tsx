'use client'

import { useState, useEffect } from 'react'
import { getAllUsers, updateUserRole, searchUsers, type User } from '@/lib/supabase/users'
import { Users as UsersIcon, Search, Edit, Crown, User as UserIcon, BookOpen, TrendingUp, DollarSign, Loader2 } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function UsuariosPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState<'admin' | 'user' | 'instructor'>('user')

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      setToast({ message: 'Error al cargar usuarios', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filtrar por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  const handleUpdateRole = async () => {
    if (!editingUser) return

    try {
      await updateUserRole(editingUser.id, newRole)
      setToast({ message: 'Rol actualizado correctamente', type: 'success' })
      setEditingUser(null)
      loadUsers()
    } catch (error) {
      console.error('Error actualizando rol:', error)
      setToast({ message: 'Error al actualizar el rol', type: 'error' })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700'
      case 'instructor': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4" />
      case 'instructor': return <BookOpen className="w-4 h-4" />
      default: return <UserIcon className="w-4 h-4" />
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
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    instructors: users.filter(u => u.role === 'instructor').length,
    users: users.filter(u => u.role === 'user').length,
  }

  return (
    <div className="space-y-6">
      {/* Header con Estadísticas */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Usuarios</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <UsersIcon className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
              </div>
              <Crown className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Instructores</p>
                <p className="text-2xl font-bold text-blue-600">{stats.instructors}</p>
              </div>
              <BookOpen className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Usuarios Regulares</p>
                <p className="text-2xl font-bold text-gray-600">{stats.users}</p>
              </div>
              <UserIcon className="w-10 h-10 text-gray-500" />
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
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
            />
          </div>

          {/* Filtro por Rol */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="instructor">Instructores</option>
            <option value="user">Usuarios</option>
          </select>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </p>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rol
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No se encontraron usuarios</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name || 'Sin nombre'}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.last_sign_in ? formatDate(user.last_sign_in) : 'Nunca'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setEditingUser(user)
                          setNewRole(user.role as any)
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-forest/10 hover:bg-forest/20 text-forest rounded-lg text-sm font-semibold transition"
                      >
                        <Edit className="w-4 h-4" />
                        Cambiar Rol
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición de Rol */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Cambiar Rol de Usuario
            </h3>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Usuario:</p>
              <p className="font-semibold text-gray-900">{editingUser.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nuevo Rol:
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-forest"
              >
                <option value="user">Usuario</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Administrador</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                ⚠️ Los administradores tienen acceso total al sistema
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-4 py-2 bg-forest text-white rounded-lg hover:bg-forest-dark font-semibold transition"
              >
                Guardar
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
    </div>
  )
}
