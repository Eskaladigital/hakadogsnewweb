import { supabase } from './client'
import type { Database } from '@/types/database.types'

// =====================================================
// TIPOS DE DATOS
// =====================================================

export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: 'pending' | 'in_progress' | 'responded' | 'closed'
  admin_notes: string | null
  responded_by: string | null
  responded_at: string | null
  source: string
  user_agent: string | null
  ip_address: string | null
  created_at: string
  updated_at: string
}

export interface ContactWithDetails extends Contact {
  responded_by_email: string | null
  responded_by_name: string | null
  hours_since_created: number
}

export interface ContactStats {
  total: number
  pending: number
  in_progress: number
  responded: number
  closed: number
  today: number
  this_week: number
  this_month: number
}

export interface CreateContactData {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  source?: string
  user_agent?: string
  ip_address?: string
}

export interface UpdateContactData {
  status?: 'pending' | 'in_progress' | 'responded' | 'closed'
  admin_notes?: string
}

// =====================================================
// FUNCIONES DE CONTACTOS
// =====================================================

/**
 * Obtiene todos los contactos con información detallada
 */
export async function getAllContacts(): Promise<ContactWithDetails[]> {
  // Intentar usar la vista primero, si no existe usar la tabla directamente
  let query = (supabase as any).from('contacts').select('*')
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.warn('⚠️ Error getting contacts:', error.message || error)
    return [] // Devolver array vacío en lugar de lanzar error
  }
  
  // Transformar los datos para incluir horas_since_created
  const contacts = (data || []).map((contact: any) => {
    const created = new Date(contact.created_at)
    const now = new Date()
    const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    
    return {
      ...contact,
      hours_since_created: hoursSinceCreated,
      responded_by_email: null,
      responded_by_name: null
    }
  })
  
  return contacts as ContactWithDetails[]
}

/**
 * Obtiene un contacto por ID
 */
export async function getContactById(id: string): Promise<ContactWithDetails | null> {
  const { data, error } = await (supabase as any)
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.warn('⚠️ Error getting contact:', error.message || error)
    return null
  }
  
  // Calcular hours_since_created
  const created = new Date(data.created_at)
  const now = new Date()
  const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
  
  return {
    ...data,
    hours_since_created: hoursSinceCreated,
    responded_by_email: null,
    responded_by_name: null
  } as ContactWithDetails
}

/**
 * Obtiene contactos por estado
 */
export async function getContactsByStatus(status: string): Promise<ContactWithDetails[]> {
  const { data, error } = await (supabase as any)
    .from('contacts')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.warn('⚠️ Error getting contacts by status:', error.message || error)
    return []
  }
  
  const contacts = (data || []).map((contact: any) => {
    const created = new Date(contact.created_at)
    const now = new Date()
    const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    
    return {
      ...contact,
      hours_since_created: hoursSinceCreated,
      responded_by_email: null,
      responded_by_name: null
    }
  })
  
  return contacts as ContactWithDetails[]
}

/**
 * Crea un nuevo contacto (formulario público)
 */
export async function createContact(contactData: CreateContactData): Promise<Contact | null> {
  const insertData = {
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone || null,
    subject: contactData.subject || null,
    message: contactData.message,
    source: contactData.source || 'web_form',
    user_agent: contactData.user_agent || null,
    ip_address: contactData.ip_address || null,
  }
  
  const { data, error } = await (supabase as any)
    .from('contacts')
    .insert([insertData])
    .select()
    .single()
  
  if (error) {
    console.warn('⚠️ Error creating contact:', error.message || error)
    return null
  }
  
  return data as Contact
}

/**
 * Actualiza un contacto (solo admin)
 */
export async function updateContact(
  id: string,
  updates: UpdateContactData
): Promise<Contact | null> {
  const updateData: any = {}
  if (updates.status) updateData.status = updates.status
  if (updates.admin_notes !== undefined) updateData.admin_notes = updates.admin_notes
  updateData.updated_at = new Date().toISOString()
  
  const { data, error } = await (supabase as any)
    .from('contacts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.warn('⚠️ Error updating contact:', error.message || error)
    return null
  }
  
  return data as Contact
}

/**
 * Marca un contacto como respondido
 */
export async function markContactAsResponded(
  contactId: string,
  adminUserId: string
): Promise<boolean> {
  const { error } = await (supabase as any).rpc('mark_contact_responded', {
    contact_id: contactId,
    admin_user_id: adminUserId
  })
  
  if (error) {
    console.warn('⚠️ Error marking contact as responded:', error.message || error)
    return false
  }
  
  return true
}

/**
 * Elimina un contacto (solo admin)
 */
export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting contact:', error)
    throw error
  }
}

/**
 * Obtiene estadísticas de contactos
 */
export async function getContactsStats(): Promise<ContactStats> {
  const { data, error } = await (supabase as any).rpc('get_contacts_stats')
  
  if (error) {
    console.warn('⚠️ Error getting contacts stats:', error.message || error)
    // Devolver estadísticas por defecto
    return {
      total: 0,
      pending: 0,
      in_progress: 0,
      responded: 0,
      closed: 0,
      today: 0,
      this_week: 0,
      this_month: 0
    }
  }
  
  return data as ContactStats
}

/**
 * Busca contactos por email o nombre
 */
export async function searchContacts(query: string): Promise<ContactWithDetails[]> {
  const { data, error } = await (supabase as any)
    .from('contacts')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.warn('⚠️ Error searching contacts:', error.message || error)
    return []
  }
  
  const contacts = (data || []).map((contact: any) => {
    const created = new Date(contact.created_at)
    const now = new Date()
    const hoursSinceCreated = (now.getTime() - created.getTime()) / (1000 * 60 * 60)
    
    return {
      ...contact,
      hours_since_created: hoursSinceCreated,
      responded_by_email: null,
      responded_by_name: null
    }
  })
  
  return contacts as ContactWithDetails[]
}
