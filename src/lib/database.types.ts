
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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
          last_login: string | null
          demo_tier: string | null 
          subscription: string | null
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          demo_tier?: string | null
          subscription?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          last_login?: string | null
          demo_tier?: string | null
          subscription?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          company: string | null
          job_title: string | null
          bio: string | null
          avatar_url: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          preferred_contact_method: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company?: string | null
          job_title?: string | null
          bio?: string | null
          avatar_url?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          preferred_contact_method?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string | null
          job_title?: string | null
          bio?: string | null
          avatar_url?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          preferred_contact_method?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      senior_clients: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          gender: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          care_needs: string | null
          medical_conditions: string[] | null
          mobility_status: string | null
          cognitive_status: string | null
          budget_range: string | null
          insurance_info: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name: string
          date_of_birth?: string | null
          gender?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          care_needs?: string | null
          medical_conditions?: string[] | null
          mobility_status?: string | null
          cognitive_status?: string | null
          budget_range?: string | null
          insurance_info?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          gender?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          care_needs?: string | null
          medical_conditions?: string[] | null
          mobility_status?: string | null
          cognitive_status?: string | null
          budget_range?: string | null
          insurance_info?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      facilities: {
        Row: {
          id: string
          place_id: string | null
          name: string
          facility_type: string[] | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          phone: string | null
          email: string | null
          website: string | null
          latitude: number | null
          longitude: number | null
          rating: number | null
          price_range: string | null
          amenities: string[] | null
          description: string | null
          accepting_new_residents: boolean | null
          verified: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          place_id?: string | null
          name: string
          facility_type?: string[] | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude?: number | null
          longitude?: number | null
          rating?: number | null
          price_range?: string | null
          amenities?: string[] | null
          description?: string | null
          accepting_new_residents?: boolean | null
          verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          place_id?: string | null
          name?: string
          facility_type?: string[] | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          latitude?: number | null
          longitude?: number | null
          rating?: number | null
          price_range?: string | null
          amenities?: string[] | null
          description?: string | null
          accepting_new_residents?: boolean | null
          verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          user_id: string
          client_id: string
          facility_id: string
          status: string
          referral_date: string
          follow_up_date: string | null
          notes: string | null
          commission_amount: number | null
          commission_status: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          client_id: string
          facility_id: string
          status: string
          referral_date?: string
          follow_up_date?: string | null
          notes?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          client_id?: string
          facility_id?: string
          status?: string
          referral_date?: string
          follow_up_date?: string | null
          notes?: string | null
          commission_amount?: number | null
          commission_status?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          content: string
          related_id: string | null
          read: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          content: string
          related_id?: string | null
          read?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          content?: string
          related_id?: string | null
          read?: boolean | null
          created_at?: string
        }
      }
      // Add types for other tables as needed
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
