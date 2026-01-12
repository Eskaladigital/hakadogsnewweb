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
      // ============================================
      // SISTEMA DE GAMIFICACIÓN
      // ============================================
      badges: {
        Row: {
          id: string
          code: string
          name: string
          description: string
          icon: string
          category: string
          tier: string
          points: number
          rarity: string
          unlock_criteria: any | null
          color: string
          is_secret: boolean
          is_active: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          name: string
          description: string
          icon: string
          category?: string
          tier?: string
          points?: number
          rarity?: string
          unlock_criteria?: any | null
          color?: string
          is_secret?: boolean
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          name?: string
          description?: string
          icon?: string
          category?: string
          tier?: string
          points?: number
          rarity?: string
          unlock_criteria?: any | null
          color?: string
          is_secret?: boolean
          is_active?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
          progress: number
          is_unlocked: boolean
          is_featured: boolean
          notification_sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
          progress?: number
          is_unlocked?: boolean
          is_featured?: boolean
          notification_sent?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
          progress?: number
          is_unlocked?: boolean
          is_featured?: boolean
          notification_sent?: boolean
          created_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          total_points: number
          level: number
          experience_points: number
          experience_to_next_level: number
          courses_started: number
          courses_completed: number
          lessons_completed: number
          total_study_time_minutes: number
          total_badges: number
          common_badges: number
          rare_badges: number
          epic_badges: number
          legendary_badges: number
          current_streak_days: number
          longest_streak_days: number
          last_activity_date: string | null
          comments_posted: number
          helpful_ratings: number
          global_rank: number | null
          percentile: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_points?: number
          level?: number
          experience_points?: number
          experience_to_next_level?: number
          courses_started?: number
          courses_completed?: number
          lessons_completed?: number
          total_study_time_minutes?: number
          total_badges?: number
          common_badges?: number
          rare_badges?: number
          epic_badges?: number
          legendary_badges?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_activity_date?: string | null
          comments_posted?: number
          helpful_ratings?: number
          global_rank?: number | null
          percentile?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_points?: number
          level?: number
          experience_points?: number
          experience_to_next_level?: number
          courses_started?: number
          courses_completed?: number
          lessons_completed?: number
          total_study_time_minutes?: number
          total_badges?: number
          common_badges?: number
          rare_badges?: number
          epic_badges?: number
          legendary_badges?: number
          current_streak_days?: number
          longest_streak_days?: number
          last_activity_date?: string | null
          comments_posted?: number
          helpful_ratings?: number
          global_rank?: number | null
          percentile?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      badge_progress: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          current_value: number
          target_value: number
          progress_percentage: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          current_value?: number
          target_value: number
          progress_percentage?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          current_value?: number
          target_value?: number
          progress_percentage?: number
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          achievement_data: any | null
          points_earned: number
          achieved_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          achievement_data?: any | null
          points_earned?: number
          achieved_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          achievement_data?: any | null
          points_earned?: number
          achieved_at?: string
          created_at?: string
        }
      }
      // Más tablas se añadirán según necesidad
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_badge: {
        Args: {
          p_user_id: string
          p_badge_code: string
        }
        Returns: boolean
      }
      calculate_user_level: {
        Args: {
          p_user_id: string
        }
        Returns: void
      }
      get_leaderboard: {
        Args: {
          p_limit?: number
          p_period?: string
        }
        Returns: {
          user_id: string
          full_name: string
          avatar_url: string
          total_points: number
          level: number
          total_badges: number
          courses_completed: number
          rank: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
