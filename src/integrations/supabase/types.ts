export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          calendar_event_id: string | null
          contact_id: string
          created_at: string | null
          description: string | null
          end_time: string
          facility_id: string | null
          id: string
          start_time: string
          status: string
          title: string
          updated_at: string | null
          video_room_id: string | null
        }
        Insert: {
          calendar_event_id?: string | null
          contact_id: string
          created_at?: string | null
          description?: string | null
          end_time: string
          facility_id?: string | null
          id?: string
          start_time: string
          status: string
          title: string
          updated_at?: string | null
          video_room_id?: string | null
        }
        Update: {
          calendar_event_id?: string | null
          contact_id?: string
          created_at?: string | null
          description?: string | null
          end_time?: string
          facility_id?: string | null
          id?: string
          start_time?: string
          status?: string
          title?: string
          updated_at?: string | null
          video_room_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_cache: {
        Row: {
          audio_url: string
          created_at: string | null
          id: number
          text: string
          voice_settings: Json
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          id?: number
          text: string
          voice_settings: Json
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          id?: number
          text?: string
          voice_settings?: Json
        }
        Relationships: []
      }
      contacts: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          source: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      facilities: {
        Row: {
          address: string
          city: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          phone: string | null
          price_max: number | null
          price_min: number | null
          rating: number | null
          state: string
          type: string
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          state: string
          type: string
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          phone?: string | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          state?: string
          type?: string
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      "facility tags": {
        Row: {
          address: string | null
          altcs: string | null
          azdhs: string | null
          capacity: string | null
          contact_us: string | null
          email: string | null
          facebook: string | null
          image_url: string | null
          instagram: string | null
          lat: string | null
          license: string | null
          lng: string | null
          name: string | null
          "Overall Star Rating": string | null
          phone: string | null
          "Quality Rating": string | null
          reviews: string | null
          schedule_tour: string | null
          specials: string | null
          "Staffing Rating": string | null
          "Survey Rating": string | null
          tags: string | null
          tiktok: string | null
          twitter: string | null
          type: string | null
          virtual_tour: string | null
          visit_website: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          address?: string | null
          altcs?: string | null
          azdhs?: string | null
          capacity?: string | null
          contact_us?: string | null
          email?: string | null
          facebook?: string | null
          image_url?: string | null
          instagram?: string | null
          lat?: string | null
          license?: string | null
          lng?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          reviews?: string | null
          schedule_tour?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          tiktok?: string | null
          twitter?: string | null
          type?: string | null
          virtual_tour?: string | null
          visit_website?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          altcs?: string | null
          azdhs?: string | null
          capacity?: string | null
          contact_us?: string | null
          email?: string | null
          facebook?: string | null
          image_url?: string | null
          instagram?: string | null
          lat?: string | null
          license?: string | null
          lng?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          reviews?: string | null
          schedule_tour?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          tiktok?: string | null
          twitter?: string | null
          type?: string | null
          virtual_tour?: string | null
          visit_website?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      facility_amenities: {
        Row: {
          amenity_id: string
          facility_id: string
        }
        Insert: {
          amenity_id: string
          facility_id: string
        }
        Update: {
          amenity_id?: string
          facility_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_amenities_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_tags: {
        Row: {
          address: string | null
          altcs: string | null
          azdhs: string | null
          capacity: string | null
          contact_us: string | null
          email: string | null
          facebook: string | null
          image_url: string | null
          instagram: string | null
          lat: string | null
          license: string | null
          lng: string | null
          name: string | null
          "Overall Star Rating": string | null
          phone: string | null
          "Quality Rating": string | null
          reviews: string | null
          schedule_tour: string | null
          specials: string | null
          "Staffing Rating": string | null
          "Survey Rating": string | null
          tags: string | null
          tiktok: string | null
          twitter: string | null
          type: string | null
          virtual_tour: string | null
          visit_website: string | null
          website: string | null
          youtube: string | null
        }
        Insert: {
          address?: string | null
          altcs?: string | null
          azdhs?: string | null
          capacity?: string | null
          contact_us?: string | null
          email?: string | null
          facebook?: string | null
          image_url?: string | null
          instagram?: string | null
          lat?: string | null
          license?: string | null
          lng?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          reviews?: string | null
          schedule_tour?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          tiktok?: string | null
          twitter?: string | null
          type?: string | null
          virtual_tour?: string | null
          visit_website?: string | null
          website?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          altcs?: string | null
          azdhs?: string | null
          capacity?: string | null
          contact_us?: string | null
          email?: string | null
          facebook?: string | null
          image_url?: string | null
          instagram?: string | null
          lat?: string | null
          license?: string | null
          lng?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          reviews?: string | null
          schedule_tour?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          tiktok?: string | null
          twitter?: string | null
          type?: string | null
          virtual_tour?: string | null
          visit_website?: string | null
          website?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      interactions: {
        Row: {
          contact_id: string
          created_at: string | null
          created_by: string | null
          details: Json | null
          id: string
          summary: string
          type: string
        }
        Insert: {
          contact_id: string
          created_at?: string | null
          created_by?: string | null
          details?: Json | null
          id?: string
          summary: string
          type: string
        }
        Update: {
          contact_id?: string
          created_at?: string | null
          created_by?: string | null
          details?: Json | null
          id?: string
          summary?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          role: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          role?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          role?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assigned_to: string | null
          contact_id: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          contact_id: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          contact_id?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          last_login: string | null
          last_name: string | null
          mfa_enabled: boolean | null
          password_hash: string | null
          phone: string | null
          profile_image_url: string | null
          updated_at: string | null
          veteran_status: boolean | null
        }
        Insert: {
          created_at: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          mfa_enabled?: boolean | null
          password_hash?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          veteran_status?: boolean | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          last_login?: string | null
          last_name?: string | null
          mfa_enabled?: boolean | null
          password_hash?: string | null
          phone?: string | null
          profile_image_url?: string | null
          updated_at?: string | null
          veteran_status?: boolean | null
        }
        Relationships: []
      }
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
