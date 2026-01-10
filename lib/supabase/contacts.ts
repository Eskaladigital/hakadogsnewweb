import { supabase } from './client'
import type { Database } from '@/types/database.types'

type ContactInsert = Database['public']['Tables']['contacts']['Insert']

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
  const { data, error } = await supabase
    .from('contacts_admin_view')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error getting contacts:', error)
    throw error
  }
  
  return data as ContactWithDetails[]
}

/**
 * Obtiene un contacto por ID
 */
export async function getContactById(id: string): Promise<ContactWithDetails | null> {
  const { data, error } = await supabase
    .from('contacts_admin_view')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error getting contact:', error)
    throw error
  }
  
  return data as ContactWithDetails
}

/**
 * Obtiene contactos por estado
 */
export async function getContactsByStatus(status: string): Promise<ContactWithDetails[]> {
  const { data, error } = await supabase
    .from('contacts_admin_view')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error getting contacts by status:', error)
    throw error
  }
  
  return data as ContactWithDetails[]
}

/**
 * Crea un nuevo contacto (formulario público)
 */
export async function createContact(contactData: CreateContactData): Promise<Contact> {
  const insertData: ContactInsert = {
    name: contactData.name,
    email: contactData.email,
    phone: contactData.phone || null,
    subject: contactData.subject || null,
    message: contactData.message,
    source: contactData.source || 'web_form',
    user_agent: contactData.user_agent || null,
    ip_address: contactData.ip_address || null,
  }
  
  const { data, error } = await supabase
    .from('contacts')
    .insert([insertData])
    .select()
    .single()
  
  if (error) {
    console.error('Error creating contact:', error)
    throw error
  }
  
  return data as Contact
}

/**
 * Actualiza un contacto (solo admin)
 */
export async function updateContact(
  id: string,
  updates: UpdateContactData
): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating contact:', error)
    throw error
  }
  
  return data as Contact
}

/**
 * Marca un contacto como respondido
 */
export async function markContactAsResponded(
  contactId: string,
  adminUserId: string
): Promise<void> {
  const { error } = await supabase.rpc('mark_contact_responded', {
    contact_id: contactId,
    admin_user_id: adminUserId
  })
  
  if (error) {
    console.error('Error marking contact as responded:', error)
    throw error
  }
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
  const { data, error } = await supabase.rpc('get_contacts_stats')
  
  if (error) {
    console.error('Error getting contacts stats:', error)
    throw error
  }
  
  return data as ContactStats
}

/**
 * Busca contactos por email o nombre
 */
export async function searchContacts(query: string): Promise<ContactWithDetails[]> {
  const { data, error } = await supabase
    .from('contacts_admin_view')
    .select('*')
    .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error searching contacts:', error)
    throw error
  }
  
  return data as ContactWithDetails[]
}
