export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'client' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'client' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'client' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      dogs: {
        Row: {
          id: string
          owner_id: string
          name: string
          breed: string | null
          birthdate: string | null
          weight: number | null
          gender: 'male' | 'female' | null
          size: 'small' | 'medium' | 'large' | 'giant' | null
          neutered: boolean
          photo_url: string | null
          gallery_urls: string[] | null
          microchip: string | null
          insurance_info: string | null
          bio: string | null
          personality_tags: string[] | null
          interests: string[] | null
          energy_level: number | null
          socialization_level: number | null
          compatible_small_dogs: boolean
          compatible_large_dogs: boolean
          compatible_puppies: boolean
          compatible_same_gender: boolean
          compatible_cats: boolean
          compatible_kids: boolean
          location_city: string | null
          location_neighborhood: string | null
          location_lat: number | null
          location_lng: number | null
          show_location: boolean
          looking_for: 'friends' | 'partner' | 'exploring' | 'available' | null
          profile_public: boolean
          allow_messages_from: 'all' | 'friends' | 'none'
          behavior_notes: string | null
          health_notes: string | null
          special_characteristics: string | null
          allergies: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          breed?: string | null
          birthdate?: string | null
          weight?: number | null
          gender?: 'male' | 'female' | null
          size?: 'small' | 'medium' | 'large' | 'giant' | null
          neutered?: boolean
          photo_url?: string | null
          gallery_urls?: string[] | null
          microchip?: string | null
          insurance_info?: string | null
          bio?: string | null
          personality_tags?: string[] | null
          interests?: string[] | null
          energy_level?: number | null
          socialization_level?: number | null
          compatible_small_dogs?: boolean
          compatible_large_dogs?: boolean
          compatible_puppies?: boolean
          compatible_same_gender?: boolean
          compatible_cats?: boolean
          compatible_kids?: boolean
          location_city?: string | null
          location_neighborhood?: string | null
          location_lat?: number | null
          location_lng?: number | null
          show_location?: boolean
          looking_for?: 'friends' | 'partner' | 'exploring' | 'available' | null
          profile_public?: boolean
          allow_messages_from?: 'all' | 'friends' | 'none'
          behavior_notes?: string | null
          health_notes?: string | null
          special_characteristics?: string | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          breed?: string | null
          birthdate?: string | null
          weight?: number | null
          gender?: 'male' | 'female' | null
          size?: 'small' | 'medium' | 'large' | 'giant' | null
          neutered?: boolean
          photo_url?: string | null
          gallery_urls?: string[] | null
          microchip?: string | null
          insurance_info?: string | null
          bio?: string | null
          personality_tags?: string[] | null
          interests?: string[] | null
          energy_level?: number | null
          socialization_level?: number | null
          compatible_small_dogs?: boolean
          compatible_large_dogs?: boolean
          compatible_puppies?: boolean
          compatible_same_gender?: boolean
          compatible_cats?: boolean
          compatible_kids?: boolean
          location_city?: string | null
          location_neighborhood?: string | null
          location_lat?: number | null
          location_lng?: number | null
          show_location?: boolean
          looking_for?: 'friends' | 'partner' | 'exploring' | 'available' | null
          profile_public?: boolean
          allow_messages_from?: 'all' | 'friends' | 'none'
          behavior_notes?: string | null
          health_notes?: string | null
          special_characteristics?: string | null
          allergies?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: 'pending' | 'in_progress' | 'responded' | 'closed'
          admin_notes?: string | null
          responded_by?: string | null
          responded_at?: string | null
          source?: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: 'pending' | 'in_progress' | 'responded' | 'closed'
          admin_notes?: string | null
          responded_by?: string | null
          responded_at?: string | null
          source?: string
          user_agent?: string | null
          ip_address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'user' | 'instructor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: 'admin' | 'user' | 'instructor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'user' | 'instructor'
          created_at?: string
          updated_at?: string
        }
      }
      // Más tablas se añadirán según necesidad
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
