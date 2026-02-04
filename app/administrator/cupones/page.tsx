'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, Edit, Trash2, Tag, TrendingUp, Users, DollarSign, Check, X, Calendar, ToggleLeft, ToggleRight } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  getAllCoupons,
  getCouponStats,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  type Coupon,
  type CouponStats
} from '@/lib/supabase/coupons'

export default function CuponesAdminPage() {
  const [loading, setLoading] = useState(true)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [stats, setStats] = useState<CouponStats[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Estado del formulario
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    partner_name: '',
    description: '',
    usage_limit: '',
    valid_from: '',
    valid_until: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [couponsData, statsData] = await Promise.all([
        getAllCoupons(),
        getCouponStats()
      ])
      setCoupons(couponsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando cupones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData({
        code: coupon.code,
        discount_percentage: coupon.discount_percentage.toString(),
        partner_name: coupon.partner_name || '',
        description: coupon.description || '',
        usage_limit: coupon.usage_limit?.toString() || '',
        valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : '',
        valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : '',
      })
    } else {
      setEditingCoupon(null)
      setFormData({
        code: '',
        discount_percentage: '',
        partner_name: '',
        description: '',
        usage_limit: '',
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: '',
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCoupon(null)
    setFormData({
      code: '',
      discount_percentage: '',
      partner_name: '',
      description: '',
      usage_limit: '',
      valid_from: '',
      valid_until: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const couponData = {
        code: formData.code.trim().toUpperCase(),
        discount_percentage: parseFloat(formData.discount_percentage),
        partner_name: formData.partner_name.trim() || undefined,
        description: formData.description.trim() || undefined,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
        valid_from: formData.valid_from || undefined,
        valid_until: formData.valid_until || undefined,
      }

      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, couponData)
      } else {
        await createCoupon(couponData)
      }

      handleCloseModal()
      loadData()
    } catch (error) {
      console.error('Error guardando cupón:', error)
      alert('Error al guardar el cupón')
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleCouponStatus(id, !currentStatus)
      loadData()
    } catch (error) {
      console.error('Error cambiando estado del cupón:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este cupón?')) return

    try {
      setDeleting(id)
      await deleteCoupon(id)
      loadData()
    } catch (error) {
      console.error('Error eliminando cupón:', error)
      alert('Error al eliminar el cupón')
    } finally {
      setDeleting(null)
    }
  }

  const getStatsForCoupon = (couponId: string) => {
    return stats.find(s => s.id === couponId)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin límite'
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-forest" />
      </div>
    )
  }

  // Calcular estadísticas totales
  const totalStats = stats.reduce((acc, stat) => ({
    totalUses: acc.totalUses + stat.actual_uses,
    totalDiscount: acc.totalDiscount + stat.total_discount_given,
    totalRevenue: acc.totalRevenue + stat.total_revenue_with_coupon
  }), { totalUses: 0, totalDiscount: 0, totalRevenue: 0 })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cupones</h1>
          <p className="text-gray-600 mt-2">
            Administra cupones de descuento para colaboraciones y promociones
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-forest to-sage text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />
          Crear Cupón
        </button>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Cupones</p>
              <p className="text-3xl font-bold text-gray-900">{coupons.length}</p>
              <p className="text-sm text-gray-500 mt-1">
                {coupons.filter(c => c.is_active).length} activos
              </p>
            </div>
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Usos Totales</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalUses}</p>
              <p className="text-sm text-gray-500 mt-1">
                {totalStats.totalDiscount.toFixed(2)}€ en descuentos
              </p>
            </div>
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Ingresos con Cupón</p>
              <p className="text-3xl font-bold text-gray-900">{totalStats.totalRevenue.toFixed(2)}€</p>
              <p className="text-sm text-gray-500 mt-1">Ventas con descuento</p>
            </div>
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Cupones */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-4">
                  Código
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-4">
                  Descuento
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-4">
                  Colaborador
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-4">
                  Usos
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-4">
                  Validez
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-4">
                  Estado
                </th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider p-4">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No hay cupones creados. Crea tu primer cupón.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const couponStats = getStatsForCoupon(coupon.id)
                  return (
                    <tr key={coupon.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-forest" />
                          <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                        </div>
                        {coupon.description && (
                          <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                          {coupon.discount_percentage}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-900">
                          {coupon.partner_name || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {couponStats?.actual_uses || 0}
                            {coupon.usage_limit && ` / ${coupon.usage_limit}`}
                          </p>
                          {couponStats && couponStats.total_discount_given > 0 && (
                            <p className="text-xs text-gray-500">
                              {couponStats.total_discount_given.toFixed(2)}€ descuento
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(coupon.valid_from)}
                          </div>
                          {coupon.valid_until && (
                            <div className="flex items-center gap-1 mt-1 text-red-600">
                              <Calendar className="w-3 h-3" />
                              {formatDate(coupon.valid_until)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(coupon.id, coupon.is_active)}
                          className="flex items-center gap-1"
                        >
                          {coupon.is_active ? (
                            <>
                              <ToggleRight className="w-5 h-5 text-green-600" />
                              <span className="text-xs font-semibold text-green-600">Activo</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5 text-gray-400" />
                              <span className="text-xs font-semibold text-gray-500">Inactivo</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(coupon)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(coupon.id)}
                            disabled={deleting === coupon.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                            title="Eliminar"
                          >
                            {deleting === coupon.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Crear/Editar Cupón */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCoupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Código */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Código del Cupón *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="JACA26"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                  required
                  maxLength={50}
                  pattern="[A-Z0-9]+"
                  title="Solo letras mayúsculas y números"
                />
                <p className="text-xs text-gray-500 mt-1">Solo letras mayúsculas y números</p>
              </div>

              {/* Descuento */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Porcentaje de Descuento (%) *
                </label>
                <input
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  placeholder="15"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                  required
                />
              </div>

              {/* Colaborador */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Colaborador
                </label>
                <input
                  type="text"
                  value={formData.partner_name}
                  onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
                  placeholder="Clínica Veterinaria Jaca"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                  maxLength={255}
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción Interna
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notas sobre este cupón..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                />
              </div>

              {/* Límite de usos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Límite de Usos
                </label>
                <input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  placeholder="Dejar vacío para ilimitado"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                />
                <p className="text-xs text-gray-500 mt-1">Dejar vacío para usos ilimitados</p>
              </div>

              {/* Fechas de validez */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Válido Desde
                  </label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Válido Hasta
                  </label>
                  <input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                  <p className="text-xs text-gray-500 mt-1">Dejar vacío para sin fecha de expiración</p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-forest to-sage text-white rounded-lg font-semibold hover:opacity-90 transition"
                >
                  {editingCoupon ? 'Actualizar Cupón' : 'Crear Cupón'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
