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
      appointment_reminders: {
        Row: {
          appointment_id: string
          created_at: string | null
          id: string
          sent: boolean
          time_before: string
          type: string
          user_id: string
        }
        Insert: {
          appointment_id: string
          created_at?: string | null
          id?: string
          sent?: boolean
          time_before: string
          type: string
          user_id: string
        }
        Update: {
          appointment_id?: string
          created_at?: string | null
          id?: string
          sent?: boolean
          time_before?: string
          type?: string
          user_id?: string
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
      Assisted_Living_Home: {
        Row: {
          altcs: string | null
          azdhs: string | null
          capacity: number | null
          City: string | null
          contact_us: string | null
          Country: string | null
          description: string | null
          email: string | null
          extra: string | null
          extra2: string | null
          extra3: string | null
          facebook: string | null
          features: string | null
          features2: string | null
          friday: string | null
          image_url: string | null
          instagram: string | null
          lat: number | null
          license: string
          lng: number | null
          monday: string | null
          name: string | null
          "Overall Star Rating": string | null
          phone: string | null
          "Quality Rating": string | null
          reviews: string | null
          saturday: string | null
          schedule_tour: string | null
          specials: string | null
          "Staffing Rating": string | null
          State: string | null
          "Street Address": string | null
          sunday: string | null
          "Survey Rating": string | null
          tags: string | null
          thursday: string | null
          tiktok: string | null
          tuesday: string | null
          twitter: string | null
          type: string | null
          virtual_tour: string | null
          visit_website: string | null
          website: string | null
          wednesday: string | null
          youtube: string | null
          "ZIP Code": number | null
        }
        Insert: {
          altcs?: string | null
          azdhs?: string | null
          capacity?: number | null
          City?: string | null
          contact_us?: string | null
          Country?: string | null
          description?: string | null
          email?: string | null
          extra?: string | null
          extra2?: string | null
          extra3?: string | null
          facebook?: string | null
          features?: string | null
          features2?: string | null
          friday?: string | null
          image_url?: string | null
          instagram?: string | null
          lat?: number | null
          license: string
          lng?: number | null
          monday?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          reviews?: string | null
          saturday?: string | null
          schedule_tour?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          State?: string | null
          "Street Address"?: string | null
          sunday?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          thursday?: string | null
          tiktok?: string | null
          tuesday?: string | null
          twitter?: string | null
          type?: string | null
          virtual_tour?: string | null
          visit_website?: string | null
          website?: string | null
          wednesday?: string | null
          youtube?: string | null
          "ZIP Code"?: number | null
        }
        Update: {
          altcs?: string | null
          azdhs?: string | null
          capacity?: number | null
          City?: string | null
          contact_us?: string | null
          Country?: string | null
          description?: string | null
          email?: string | null
          extra?: string | null
          extra2?: string | null
          extra3?: string | null
          facebook?: string | null
          features?: string | null
          features2?: string | null
          friday?: string | null
          image_url?: string | null
          instagram?: string | null
          lat?: number | null
          license?: string
          lng?: number | null
          monday?: string | null
          name?: string | null
          "Overall Star Rating"?: string | null
          phone?: string | null
          "Quality Rating"?: string | null
          reviews?: string | null
          saturday?: string | null
          schedule_tour?: string | null
          specials?: string | null
          "Staffing Rating"?: string | null
          State?: string | null
          "Street Address"?: string | null
          sunday?: string | null
          "Survey Rating"?: string | null
          tags?: string | null
          thursday?: string | null
          tiktok?: string | null
          tuesday?: string | null
          twitter?: string | null
          type?: string | null
          virtual_tour?: string | null
          visit_website?: string | null
          website?: string | null
          wednesday?: string | null
          youtube?: string | null
          "ZIP Code"?: number | null
        }
        Relationships: []
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
      calendar_connections: {
        Row: {
          calendar_id: string | null
          connected: boolean
          created_at: string | null
          id: string
          last_synced: string | null
          provider: string
          user_id: string
        }
        Insert: {
          calendar_id?: string | null
          connected?: boolean
          created_at?: string | null
          id?: string
          last_synced?: string | null
          provider: string
          user_id: string
        }
        Update: {
          calendar_id?: string | null
          connected?: boolean
          created_at?: string | null
          id?: string
          last_synced?: string | null
          provider?: string
          user_id?: string
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
      facility_info: {
        Row: {
          amenities: string[]
          created_at: string | null
          id: string
          location: string
          phone_number: string
          type_of_facility: string
          url_googlemaps: string
          website: string
        }
        Insert: {
          amenities: string[]
          created_at?: string | null
          id?: string
          location: string
          phone_number: string
          type_of_facility: string
          url_googlemaps: string
          website: string
        }
        Update: {
          amenities?: string[]
          created_at?: string | null
          id?: string
          location?: string
          phone_number?: string
          type_of_facility?: string
          url_googlemaps?: string
          website?: string
        }
        Relationships: []
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
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          feature_key: string
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feature_key: string
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feature_key?: string
          id?: string
          name?: string
          updated_at?: string | null
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
      locations: {
        Row: {
          address: string | null
          azdhs: string | null
          capacity: string | null
          contact_us: string | null
          description: string | null
          email: string | null
          extra: string | null
          facebook: string | null
          featured_: string | null
          features: string | null
          features_: string | null
          friday: string | null
          id: string
          image_url: string | null
          instagram: string | null
          lat: number | null
          license: string
          lng: number | null
          ltc: string | null
          monday: string | null
          name: string | null
          overall_star_rating: string | null
          phone: string | null
          quality_rating: string | null
          reviews: string | null
          saturday: string | null
          save_to_favorites: string | null
          schedule_tour: string | null
          specials: string | null
          staffing_rating: string | null
          sunday: string | null
          survey_rating: string | null
          tags: string | null
          thursday: string | null
          tiktok: string | null
          tuesday: string | null
          twitter: string | null
          virtual_tour_available: string | null
          visit_website: string | null
          website: string | null
          wednesday: string | null
          youtube: string | null
        }
        Insert: {
          address?: string | null
          azdhs?: string | null
          capacity?: string | null
          contact_us?: string | null
          description?: string | null
          email?: string | null
          extra?: string | null
          facebook?: string | null
          featured_?: string | null
          features?: string | null
          features_?: string | null
          friday?: string | null
          id: string
          image_url?: string | null
          instagram?: string | null
          lat?: number | null
          license: string
          lng?: number | null
          ltc?: string | null
          monday?: string | null
          name?: string | null
          overall_star_rating?: string | null
          phone?: string | null
          quality_rating?: string | null
          reviews?: string | null
          saturday?: string | null
          save_to_favorites?: string | null
          schedule_tour?: string | null
          specials?: string | null
          staffing_rating?: string | null
          sunday?: string | null
          survey_rating?: string | null
          tags?: string | null
          thursday?: string | null
          tiktok?: string | null
          tuesday?: string | null
          twitter?: string | null
          virtual_tour_available?: string | null
          visit_website?: string | null
          website?: string | null
          wednesday?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          azdhs?: string | null
          capacity?: string | null
          contact_us?: string | null
          description?: string | null
          email?: string | null
          extra?: string | null
          facebook?: string | null
          featured_?: string | null
          features?: string | null
          features_?: string | null
          friday?: string | null
          id?: string
          image_url?: string | null
          instagram?: string | null
          lat?: number | null
          license?: string
          lng?: number | null
          ltc?: string | null
          monday?: string | null
          name?: string | null
          overall_star_rating?: string | null
          phone?: string | null
          quality_rating?: string | null
          reviews?: string | null
          saturday?: string | null
          save_to_favorites?: string | null
          schedule_tour?: string | null
          specials?: string | null
          staffing_rating?: string | null
          sunday?: string | null
          survey_rating?: string | null
          tags?: string | null
          thursday?: string | null
          tiktok?: string | null
          tuesday?: string | null
          twitter?: string | null
          virtual_tour_available?: string | null
          visit_website?: string | null
          website?: string | null
          wednesday?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      Medicare_NH_Providers: {
        Row: {
          "Abuse Icon": string | null
          "Adjusted LPN Staffing Hours per Resident per Day": string | null
          "Adjusted Nurse Aide Staffing Hours per Resident per Day":
            | string
            | null
          "Adjusted RN Staffing Hours per Resident per Day": string | null
          "Adjusted Total Nurse Staffing Hours per Resident per Day":
            | string
            | null
          "Adjusted Weekend Total Nurse Staffing Hours per Resident per Da":
            | string
            | null
          "Administrator turnover footnote": string | null
          "Affiliated Entity ID": string | null
          "Affiliated Entity Name": string | null
          "Automatic Sprinkler Systems in All Required Areas": string | null
          "Average Number of Residents per Day": number | null
          "Average Number of Residents per Day Footnote": string | null
          "Case-Mix LPN Staffing Hours per Resident per Day": string | null
          "Case-Mix Nurse Aide Staffing Hours per Resident per Day":
            | string
            | null
          "Case-Mix RN Staffing Hours per Resident per Day": string | null
          "Case-Mix Total Nurse Staffing Hours per Resident per Day":
            | string
            | null
          "Case-Mix Weekend Total Nurse Staffing Hours per Resident per Da":
            | string
            | null
          "City/Town": string | null
          "CMS Certification Number (CCN)": string | null
          "Continuing Care Retirement Community": string | null
          "County/Parish": string | null
          "Date First Approved to Provide Medicare and Medicaid Services":
            | string
            | null
          "Geocoding Footnote": string | null
          "Health Inspection Rating": string | null
          "Health Inspection Rating Footnote": string | null
          id: string | null
          Latitude: number | null
          "Legal Business Name": string | null
          Location: string | null
          "Long-Stay QM Rating": string | null
          "Long-Stay QM Rating Footnote": string | null
          Longitude: number | null
          "Most Recent Health Inspection More Than 2 Years Ago": string | null
          "Number of administrators who have left the nursing home":
            | string
            | null
          "Number of Certified Beds": number | null
          "Number of Citations from Infection Control Inspections":
            | string
            | null
          "Number of Facility Reported Incidents": string | null
          "Number of Fines": string | null
          "Number of Payment Denials": string | null
          "Number of Substantiated Complaints": string | null
          "Nursing Case-Mix Index": string | null
          "Nursing Case-Mix Index Ratio": string | null
          "Overall Rating": string | null
          "Overall Rating Footnote": string | null
          "Ownership Type": string | null
          "Physical Therapist Staffing Footnote": string | null
          "Processing Date": string | null
          "Provider Address": string | null
          "Provider Changed Ownership in Last 12 Months": string | null
          "Provider Name": string | null
          "Provider Resides in Hospital": string | null
          "Provider SSA County Code": string | null
          "Provider Type": string | null
          "QM Rating": string | null
          "QM Rating Footnote": string | null
          "Rating Cycle 1 Health Deficiency Score": string | null
          "Rating Cycle 1 Health Revisit Score": string | null
          "Rating Cycle 1 Number of Complaint Health Deficiencies":
            | string
            | null
          "Rating Cycle 1 Number of Health Revisits": string | null
          "Rating Cycle 1 Number of Standard Health Deficiencies": string | null
          "Rating Cycle 1 Standard Survey Health Date": string | null
          "Rating Cycle 1 Total Health Score": string | null
          "Rating Cycle 1 Total Number of Health Deficiencies": string | null
          "Rating Cycle 2 Health Deficiency Score": string | null
          "Rating Cycle 2 Health Revisit Score": string | null
          "Rating Cycle 2 Number of Complaint Health Deficiencies":
            | string
            | null
          "Rating Cycle 2 Number of Health Revisits": string | null
          "Rating Cycle 2 Number of Standard Health Deficiencies": string | null
          "Rating Cycle 2 Standard Health Survey Date": string | null
          "Rating Cycle 2 Total Health Score": string | null
          "Rating Cycle 2 Total Number of Health Deficiencies": string | null
          "Rating Cycle 3 Health Deficiency Score": string | null
          "Rating Cycle 3 Health Revisit Score": string | null
          "Rating Cycle 3 Number of Complaint Health Deficiencies":
            | string
            | null
          "Rating Cycle 3 Number of Health Revisits": string | null
          "Rating Cycle 3 Number of Standard Health Deficiencies": string | null
          "Rating Cycle 3 Standard Health Survey Date": string | null
          "Rating Cycle 3 Total Health Score": string | null
          "Rating Cycle 3 Total Number of Health Deficiencies": string | null
          "Registered Nurse hours per resident per day on the weekend":
            | string
            | null
          "Registered Nurse turnover": string | null
          "Registered Nurse turnover footnote": string | null
          "Reported Licensed Staffing Hours per Resident per Day": string | null
          "Reported LPN Staffing Hours per Resident per Day": string | null
          "Reported Nurse Aide Staffing Hours per Resident per Day":
            | string
            | null
          "Reported Physical Therapist Staffing Hours per Resident Per Day":
            | string
            | null
          "Reported RN Staffing Hours per Resident per Day": string | null
          "Reported Staffing Footnote": string | null
          "Reported Total Nurse Staffing Hours per Resident per Day":
            | string
            | null
          "Short-Stay QM Rating": string | null
          "Short-Stay QM Rating Footnote": string | null
          "Special Focus Status": string | null
          "Staffing Rating": string | null
          "Staffing Rating Footnote": string | null
          State: string | null
          "Telephone Number": number | null
          "Total Amount of Fines in Dollars": string | null
          "Total number of nurse staff hours per resident per day on the w":
            | string
            | null
          "Total Number of Penalties": string | null
          "Total nursing staff turnover": string | null
          "Total nursing staff turnover footnote": string | null
          "Total Weighted Health Survey Score": number | null
          "With a Resident and Family Council": string | null
          "ZIP Code": number | null
        }
        Insert: {
          "Abuse Icon"?: string | null
          "Adjusted LPN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted RN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "Administrator turnover footnote"?: string | null
          "Affiliated Entity ID"?: string | null
          "Affiliated Entity Name"?: string | null
          "Automatic Sprinkler Systems in All Required Areas"?: string | null
          "Average Number of Residents per Day"?: number | null
          "Average Number of Residents per Day Footnote"?: string | null
          "Case-Mix LPN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix RN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "City/Town"?: string | null
          "CMS Certification Number (CCN)"?: string | null
          "Continuing Care Retirement Community"?: string | null
          "County/Parish"?: string | null
          "Date First Approved to Provide Medicare and Medicaid Services"?:
            | string
            | null
          "Geocoding Footnote"?: string | null
          "Health Inspection Rating"?: string | null
          "Health Inspection Rating Footnote"?: string | null
          id?: string | null
          Latitude?: number | null
          "Legal Business Name"?: string | null
          Location?: string | null
          "Long-Stay QM Rating"?: string | null
          "Long-Stay QM Rating Footnote"?: string | null
          Longitude?: number | null
          "Most Recent Health Inspection More Than 2 Years Ago"?: string | null
          "Number of administrators who have left the nursing home"?:
            | string
            | null
          "Number of Certified Beds"?: number | null
          "Number of Citations from Infection Control Inspections"?:
            | string
            | null
          "Number of Facility Reported Incidents"?: string | null
          "Number of Fines"?: string | null
          "Number of Payment Denials"?: string | null
          "Number of Substantiated Complaints"?: string | null
          "Nursing Case-Mix Index"?: string | null
          "Nursing Case-Mix Index Ratio"?: string | null
          "Overall Rating"?: string | null
          "Overall Rating Footnote"?: string | null
          "Ownership Type"?: string | null
          "Physical Therapist Staffing Footnote"?: string | null
          "Processing Date"?: string | null
          "Provider Address"?: string | null
          "Provider Changed Ownership in Last 12 Months"?: string | null
          "Provider Name"?: string | null
          "Provider Resides in Hospital"?: string | null
          "Provider SSA County Code"?: string | null
          "Provider Type"?: string | null
          "QM Rating"?: string | null
          "QM Rating Footnote"?: string | null
          "Rating Cycle 1 Health Deficiency Score"?: string | null
          "Rating Cycle 1 Health Revisit Score"?: string | null
          "Rating Cycle 1 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Number of Health Revisits"?: string | null
          "Rating Cycle 1 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Standard Survey Health Date"?: string | null
          "Rating Cycle 1 Total Health Score"?: string | null
          "Rating Cycle 1 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 2 Health Deficiency Score"?: string | null
          "Rating Cycle 2 Health Revisit Score"?: string | null
          "Rating Cycle 2 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Number of Health Revisits"?: string | null
          "Rating Cycle 2 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Standard Health Survey Date"?: string | null
          "Rating Cycle 2 Total Health Score"?: string | null
          "Rating Cycle 2 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 3 Health Deficiency Score"?: string | null
          "Rating Cycle 3 Health Revisit Score"?: string | null
          "Rating Cycle 3 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Number of Health Revisits"?: string | null
          "Rating Cycle 3 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Standard Health Survey Date"?: string | null
          "Rating Cycle 3 Total Health Score"?: string | null
          "Rating Cycle 3 Total Number of Health Deficiencies"?: string | null
          "Registered Nurse hours per resident per day on the weekend"?:
            | string
            | null
          "Registered Nurse turnover"?: string | null
          "Registered Nurse turnover footnote"?: string | null
          "Reported Licensed Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported LPN Staffing Hours per Resident per Day"?: string | null
          "Reported Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported Physical Therapist Staffing Hours per Resident Per Day"?:
            | string
            | null
          "Reported RN Staffing Hours per Resident per Day"?: string | null
          "Reported Staffing Footnote"?: string | null
          "Reported Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Short-Stay QM Rating"?: string | null
          "Short-Stay QM Rating Footnote"?: string | null
          "Special Focus Status"?: string | null
          "Staffing Rating"?: string | null
          "Staffing Rating Footnote"?: string | null
          State?: string | null
          "Telephone Number"?: number | null
          "Total Amount of Fines in Dollars"?: string | null
          "Total number of nurse staff hours per resident per day on the w"?:
            | string
            | null
          "Total Number of Penalties"?: string | null
          "Total nursing staff turnover"?: string | null
          "Total nursing staff turnover footnote"?: string | null
          "Total Weighted Health Survey Score"?: number | null
          "With a Resident and Family Council"?: string | null
          "ZIP Code"?: number | null
        }
        Update: {
          "Abuse Icon"?: string | null
          "Adjusted LPN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted RN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "Administrator turnover footnote"?: string | null
          "Affiliated Entity ID"?: string | null
          "Affiliated Entity Name"?: string | null
          "Automatic Sprinkler Systems in All Required Areas"?: string | null
          "Average Number of Residents per Day"?: number | null
          "Average Number of Residents per Day Footnote"?: string | null
          "Case-Mix LPN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix RN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "City/Town"?: string | null
          "CMS Certification Number (CCN)"?: string | null
          "Continuing Care Retirement Community"?: string | null
          "County/Parish"?: string | null
          "Date First Approved to Provide Medicare and Medicaid Services"?:
            | string
            | null
          "Geocoding Footnote"?: string | null
          "Health Inspection Rating"?: string | null
          "Health Inspection Rating Footnote"?: string | null
          id?: string | null
          Latitude?: number | null
          "Legal Business Name"?: string | null
          Location?: string | null
          "Long-Stay QM Rating"?: string | null
          "Long-Stay QM Rating Footnote"?: string | null
          Longitude?: number | null
          "Most Recent Health Inspection More Than 2 Years Ago"?: string | null
          "Number of administrators who have left the nursing home"?:
            | string
            | null
          "Number of Certified Beds"?: number | null
          "Number of Citations from Infection Control Inspections"?:
            | string
            | null
          "Number of Facility Reported Incidents"?: string | null
          "Number of Fines"?: string | null
          "Number of Payment Denials"?: string | null
          "Number of Substantiated Complaints"?: string | null
          "Nursing Case-Mix Index"?: string | null
          "Nursing Case-Mix Index Ratio"?: string | null
          "Overall Rating"?: string | null
          "Overall Rating Footnote"?: string | null
          "Ownership Type"?: string | null
          "Physical Therapist Staffing Footnote"?: string | null
          "Processing Date"?: string | null
          "Provider Address"?: string | null
          "Provider Changed Ownership in Last 12 Months"?: string | null
          "Provider Name"?: string | null
          "Provider Resides in Hospital"?: string | null
          "Provider SSA County Code"?: string | null
          "Provider Type"?: string | null
          "QM Rating"?: string | null
          "QM Rating Footnote"?: string | null
          "Rating Cycle 1 Health Deficiency Score"?: string | null
          "Rating Cycle 1 Health Revisit Score"?: string | null
          "Rating Cycle 1 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Number of Health Revisits"?: string | null
          "Rating Cycle 1 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Standard Survey Health Date"?: string | null
          "Rating Cycle 1 Total Health Score"?: string | null
          "Rating Cycle 1 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 2 Health Deficiency Score"?: string | null
          "Rating Cycle 2 Health Revisit Score"?: string | null
          "Rating Cycle 2 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Number of Health Revisits"?: string | null
          "Rating Cycle 2 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Standard Health Survey Date"?: string | null
          "Rating Cycle 2 Total Health Score"?: string | null
          "Rating Cycle 2 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 3 Health Deficiency Score"?: string | null
          "Rating Cycle 3 Health Revisit Score"?: string | null
          "Rating Cycle 3 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Number of Health Revisits"?: string | null
          "Rating Cycle 3 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Standard Health Survey Date"?: string | null
          "Rating Cycle 3 Total Health Score"?: string | null
          "Rating Cycle 3 Total Number of Health Deficiencies"?: string | null
          "Registered Nurse hours per resident per day on the weekend"?:
            | string
            | null
          "Registered Nurse turnover"?: string | null
          "Registered Nurse turnover footnote"?: string | null
          "Reported Licensed Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported LPN Staffing Hours per Resident per Day"?: string | null
          "Reported Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported Physical Therapist Staffing Hours per Resident Per Day"?:
            | string
            | null
          "Reported RN Staffing Hours per Resident per Day"?: string | null
          "Reported Staffing Footnote"?: string | null
          "Reported Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Short-Stay QM Rating"?: string | null
          "Short-Stay QM Rating Footnote"?: string | null
          "Special Focus Status"?: string | null
          "Staffing Rating"?: string | null
          "Staffing Rating Footnote"?: string | null
          State?: string | null
          "Telephone Number"?: number | null
          "Total Amount of Fines in Dollars"?: string | null
          "Total number of nurse staff hours per resident per day on the w"?:
            | string
            | null
          "Total Number of Penalties"?: string | null
          "Total nursing staff turnover"?: string | null
          "Total nursing staff turnover footnote"?: string | null
          "Total Weighted Health Survey Score"?: number | null
          "With a Resident and Family Council"?: string | null
          "ZIP Code"?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          related_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      nursing_homes_medicare: {
        Row: {
          "Abuse Icon": string | null
          "Adjusted LPN Staffing Hours per Resident per Day": string | null
          "Adjusted Nurse Aide Staffing Hours per Resident per Day":
            | string
            | null
          "Adjusted RN Staffing Hours per Resident per Day": string | null
          "Adjusted Total Nurse Staffing Hours per Resident per Day":
            | string
            | null
          "Adjusted Weekend Total Nurse Staffing Hours per Resident per Da":
            | string
            | null
          "Administrator turnover footnote": string | null
          "Affiliated Entity ID": string | null
          "Affiliated Entity Name": string | null
          "Automatic Sprinkler Systems in All Required Areas": string | null
          "Average Number of Residents per Day": number | null
          "Average Number of Residents per Day Footnote": string | null
          "Case-Mix LPN Staffing Hours per Resident per Day": string | null
          "Case-Mix Nurse Aide Staffing Hours per Resident per Day":
            | string
            | null
          "Case-Mix RN Staffing Hours per Resident per Day": string | null
          "Case-Mix Total Nurse Staffing Hours per Resident per Day":
            | string
            | null
          "Case-Mix Weekend Total Nurse Staffing Hours per Resident per Da":
            | string
            | null
          "City/Town": string | null
          "CMS Certification Number (CCN)": string
          "Continuing Care Retirement Community": string | null
          "County/Parish": string | null
          "Date First Approved to Provide Medicare and Medicaid Services":
            | string
            | null
          "Geocoding Footnote": string | null
          "Health Inspection Rating": number | null
          "Health Inspection Rating Footnote": string | null
          Latitude: number | null
          "Legal Business Name": string | null
          Location: string | null
          "Long-Stay QM Rating": string | null
          "Long-Stay QM Rating Footnote": string | null
          Longitude: number | null
          "Most Recent Health Inspection More Than 2 Years Ago": string | null
          "Number of administrators who have left the nursing home":
            | string
            | null
          "Number of Certified Beds": number | null
          "Number of Citations from Infection Control Inspections":
            | string
            | null
          "Number of Facility Reported Incidents": string | null
          "Number of Fines": string | null
          "Number of Payment Denials": string | null
          "Number of Substantiated Complaints": string | null
          "Nursing Case-Mix Index": string | null
          "Nursing Case-Mix Index Ratio": string | null
          "Overall Rating": number | null
          "Overall Rating Footnote": string | null
          "Ownership Type": string | null
          "Physical Therapist Staffing Footnote": string | null
          "Processing Date": string | null
          "Provider Address": string | null
          "Provider Changed Ownership in Last 12 Months": string | null
          "Provider Name": string | null
          "Provider Resides in Hospital": string | null
          "Provider SSA County Code": number | null
          "Provider Type": string | null
          "QM Rating": string | null
          "QM Rating Footnote": string | null
          "Rating Cycle 1 Health Deficiency Score": string | null
          "Rating Cycle 1 Health Revisit Score": string | null
          "Rating Cycle 1 Number of Complaint Health Deficiencies":
            | string
            | null
          "Rating Cycle 1 Number of Health Revisits": string | null
          "Rating Cycle 1 Number of Standard Health Deficiencies": string | null
          "Rating Cycle 1 Standard Survey Health Date": string | null
          "Rating Cycle 1 Total Health Score": string | null
          "Rating Cycle 1 Total Number of Health Deficiencies": string | null
          "Rating Cycle 2 Health Deficiency Score": string | null
          "Rating Cycle 2 Health Revisit Score": string | null
          "Rating Cycle 2 Number of Complaint Health Deficiencies":
            | string
            | null
          "Rating Cycle 2 Number of Health Revisits": string | null
          "Rating Cycle 2 Number of Standard Health Deficiencies": string | null
          "Rating Cycle 2 Standard Health Survey Date": string | null
          "Rating Cycle 2 Total Health Score": string | null
          "Rating Cycle 2 Total Number of Health Deficiencies": string | null
          "Rating Cycle 3 Health Deficiency Score": string | null
          "Rating Cycle 3 Health Revisit Score": string | null
          "Rating Cycle 3 Number of Complaint Health Deficiencies":
            | string
            | null
          "Rating Cycle 3 Number of Health Revisits": string | null
          "Rating Cycle 3 Number of Standard Health Deficiencies": string | null
          "Rating Cycle 3 Standard Health Survey Date": string | null
          "Rating Cycle 3 Total Health Score": string | null
          "Rating Cycle 3 Total Number of Health Deficiencies": string | null
          "Registered Nurse hours per resident per day on the weekend":
            | string
            | null
          "Registered Nurse turnover": string | null
          "Registered Nurse turnover footnote": string | null
          "Reported Licensed Staffing Hours per Resident per Day": string | null
          "Reported LPN Staffing Hours per Resident per Day": string | null
          "Reported Nurse Aide Staffing Hours per Resident per Day":
            | string
            | null
          "Reported Physical Therapist Staffing Hours per Resident Per Day":
            | string
            | null
          "Reported RN Staffing Hours per Resident per Day": string | null
          "Reported Staffing Footnote": string | null
          "Reported Total Nurse Staffing Hours per Resident per Day":
            | string
            | null
          "Short-Stay QM Rating": string | null
          "Short-Stay QM Rating Footnote": string | null
          "Special Focus Status": string | null
          "Staffing Rating": string | null
          "Staffing Rating Footnote": string | null
          State: string | null
          "Telephone Number": number | null
          "Total Amount of Fines in Dollars": string | null
          "Total number of nurse staff hours per resident per day on the w":
            | string
            | null
          "Total Number of Penalties": string | null
          "Total nursing staff turnover": string | null
          "Total nursing staff turnover footnote": string | null
          "Total Weighted Health Survey Score": number | null
          "With a Resident and Family Council": string | null
          "ZIP Code": number | null
        }
        Insert: {
          "Abuse Icon"?: string | null
          "Adjusted LPN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted RN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "Administrator turnover footnote"?: string | null
          "Affiliated Entity ID"?: string | null
          "Affiliated Entity Name"?: string | null
          "Automatic Sprinkler Systems in All Required Areas"?: string | null
          "Average Number of Residents per Day"?: number | null
          "Average Number of Residents per Day Footnote"?: string | null
          "Case-Mix LPN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix RN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "City/Town"?: string | null
          "CMS Certification Number (CCN)": string
          "Continuing Care Retirement Community"?: string | null
          "County/Parish"?: string | null
          "Date First Approved to Provide Medicare and Medicaid Services"?:
            | string
            | null
          "Geocoding Footnote"?: string | null
          "Health Inspection Rating"?: number | null
          "Health Inspection Rating Footnote"?: string | null
          Latitude?: number | null
          "Legal Business Name"?: string | null
          Location?: string | null
          "Long-Stay QM Rating"?: string | null
          "Long-Stay QM Rating Footnote"?: string | null
          Longitude?: number | null
          "Most Recent Health Inspection More Than 2 Years Ago"?: string | null
          "Number of administrators who have left the nursing home"?:
            | string
            | null
          "Number of Certified Beds"?: number | null
          "Number of Citations from Infection Control Inspections"?:
            | string
            | null
          "Number of Facility Reported Incidents"?: string | null
          "Number of Fines"?: string | null
          "Number of Payment Denials"?: string | null
          "Number of Substantiated Complaints"?: string | null
          "Nursing Case-Mix Index"?: string | null
          "Nursing Case-Mix Index Ratio"?: string | null
          "Overall Rating"?: number | null
          "Overall Rating Footnote"?: string | null
          "Ownership Type"?: string | null
          "Physical Therapist Staffing Footnote"?: string | null
          "Processing Date"?: string | null
          "Provider Address"?: string | null
          "Provider Changed Ownership in Last 12 Months"?: string | null
          "Provider Name"?: string | null
          "Provider Resides in Hospital"?: string | null
          "Provider SSA County Code"?: number | null
          "Provider Type"?: string | null
          "QM Rating"?: string | null
          "QM Rating Footnote"?: string | null
          "Rating Cycle 1 Health Deficiency Score"?: string | null
          "Rating Cycle 1 Health Revisit Score"?: string | null
          "Rating Cycle 1 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Number of Health Revisits"?: string | null
          "Rating Cycle 1 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Standard Survey Health Date"?: string | null
          "Rating Cycle 1 Total Health Score"?: string | null
          "Rating Cycle 1 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 2 Health Deficiency Score"?: string | null
          "Rating Cycle 2 Health Revisit Score"?: string | null
          "Rating Cycle 2 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Number of Health Revisits"?: string | null
          "Rating Cycle 2 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Standard Health Survey Date"?: string | null
          "Rating Cycle 2 Total Health Score"?: string | null
          "Rating Cycle 2 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 3 Health Deficiency Score"?: string | null
          "Rating Cycle 3 Health Revisit Score"?: string | null
          "Rating Cycle 3 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Number of Health Revisits"?: string | null
          "Rating Cycle 3 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Standard Health Survey Date"?: string | null
          "Rating Cycle 3 Total Health Score"?: string | null
          "Rating Cycle 3 Total Number of Health Deficiencies"?: string | null
          "Registered Nurse hours per resident per day on the weekend"?:
            | string
            | null
          "Registered Nurse turnover"?: string | null
          "Registered Nurse turnover footnote"?: string | null
          "Reported Licensed Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported LPN Staffing Hours per Resident per Day"?: string | null
          "Reported Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported Physical Therapist Staffing Hours per Resident Per Day"?:
            | string
            | null
          "Reported RN Staffing Hours per Resident per Day"?: string | null
          "Reported Staffing Footnote"?: string | null
          "Reported Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Short-Stay QM Rating"?: string | null
          "Short-Stay QM Rating Footnote"?: string | null
          "Special Focus Status"?: string | null
          "Staffing Rating"?: string | null
          "Staffing Rating Footnote"?: string | null
          State?: string | null
          "Telephone Number"?: number | null
          "Total Amount of Fines in Dollars"?: string | null
          "Total number of nurse staff hours per resident per day on the w"?:
            | string
            | null
          "Total Number of Penalties"?: string | null
          "Total nursing staff turnover"?: string | null
          "Total nursing staff turnover footnote"?: string | null
          "Total Weighted Health Survey Score"?: number | null
          "With a Resident and Family Council"?: string | null
          "ZIP Code"?: number | null
        }
        Update: {
          "Abuse Icon"?: string | null
          "Adjusted LPN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted RN Staffing Hours per Resident per Day"?: string | null
          "Adjusted Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Adjusted Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "Administrator turnover footnote"?: string | null
          "Affiliated Entity ID"?: string | null
          "Affiliated Entity Name"?: string | null
          "Automatic Sprinkler Systems in All Required Areas"?: string | null
          "Average Number of Residents per Day"?: number | null
          "Average Number of Residents per Day Footnote"?: string | null
          "Case-Mix LPN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix RN Staffing Hours per Resident per Day"?: string | null
          "Case-Mix Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Case-Mix Weekend Total Nurse Staffing Hours per Resident per Da"?:
            | string
            | null
          "City/Town"?: string | null
          "CMS Certification Number (CCN)"?: string
          "Continuing Care Retirement Community"?: string | null
          "County/Parish"?: string | null
          "Date First Approved to Provide Medicare and Medicaid Services"?:
            | string
            | null
          "Geocoding Footnote"?: string | null
          "Health Inspection Rating"?: number | null
          "Health Inspection Rating Footnote"?: string | null
          Latitude?: number | null
          "Legal Business Name"?: string | null
          Location?: string | null
          "Long-Stay QM Rating"?: string | null
          "Long-Stay QM Rating Footnote"?: string | null
          Longitude?: number | null
          "Most Recent Health Inspection More Than 2 Years Ago"?: string | null
          "Number of administrators who have left the nursing home"?:
            | string
            | null
          "Number of Certified Beds"?: number | null
          "Number of Citations from Infection Control Inspections"?:
            | string
            | null
          "Number of Facility Reported Incidents"?: string | null
          "Number of Fines"?: string | null
          "Number of Payment Denials"?: string | null
          "Number of Substantiated Complaints"?: string | null
          "Nursing Case-Mix Index"?: string | null
          "Nursing Case-Mix Index Ratio"?: string | null
          "Overall Rating"?: number | null
          "Overall Rating Footnote"?: string | null
          "Ownership Type"?: string | null
          "Physical Therapist Staffing Footnote"?: string | null
          "Processing Date"?: string | null
          "Provider Address"?: string | null
          "Provider Changed Ownership in Last 12 Months"?: string | null
          "Provider Name"?: string | null
          "Provider Resides in Hospital"?: string | null
          "Provider SSA County Code"?: number | null
          "Provider Type"?: string | null
          "QM Rating"?: string | null
          "QM Rating Footnote"?: string | null
          "Rating Cycle 1 Health Deficiency Score"?: string | null
          "Rating Cycle 1 Health Revisit Score"?: string | null
          "Rating Cycle 1 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Number of Health Revisits"?: string | null
          "Rating Cycle 1 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 1 Standard Survey Health Date"?: string | null
          "Rating Cycle 1 Total Health Score"?: string | null
          "Rating Cycle 1 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 2 Health Deficiency Score"?: string | null
          "Rating Cycle 2 Health Revisit Score"?: string | null
          "Rating Cycle 2 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Number of Health Revisits"?: string | null
          "Rating Cycle 2 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 2 Standard Health Survey Date"?: string | null
          "Rating Cycle 2 Total Health Score"?: string | null
          "Rating Cycle 2 Total Number of Health Deficiencies"?: string | null
          "Rating Cycle 3 Health Deficiency Score"?: string | null
          "Rating Cycle 3 Health Revisit Score"?: string | null
          "Rating Cycle 3 Number of Complaint Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Number of Health Revisits"?: string | null
          "Rating Cycle 3 Number of Standard Health Deficiencies"?:
            | string
            | null
          "Rating Cycle 3 Standard Health Survey Date"?: string | null
          "Rating Cycle 3 Total Health Score"?: string | null
          "Rating Cycle 3 Total Number of Health Deficiencies"?: string | null
          "Registered Nurse hours per resident per day on the weekend"?:
            | string
            | null
          "Registered Nurse turnover"?: string | null
          "Registered Nurse turnover footnote"?: string | null
          "Reported Licensed Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported LPN Staffing Hours per Resident per Day"?: string | null
          "Reported Nurse Aide Staffing Hours per Resident per Day"?:
            | string
            | null
          "Reported Physical Therapist Staffing Hours per Resident Per Day"?:
            | string
            | null
          "Reported RN Staffing Hours per Resident per Day"?: string | null
          "Reported Staffing Footnote"?: string | null
          "Reported Total Nurse Staffing Hours per Resident per Day"?:
            | string
            | null
          "Short-Stay QM Rating"?: string | null
          "Short-Stay QM Rating Footnote"?: string | null
          "Special Focus Status"?: string | null
          "Staffing Rating"?: string | null
          "Staffing Rating Footnote"?: string | null
          State?: string | null
          "Telephone Number"?: number | null
          "Total Amount of Fines in Dollars"?: string | null
          "Total number of nurse staff hours per resident per day on the w"?:
            | string
            | null
          "Total Number of Penalties"?: string | null
          "Total nursing staff turnover"?: string | null
          "Total nursing staff turnover footnote"?: string | null
          "Total Weighted Health Survey Score"?: number | null
          "With a Resident and Family Council"?: string | null
          "ZIP Code"?: number | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          "Amount Refunded": string | null
          "Billing Address1": string | null
          "Billing Address2": string | null
          "Billing City": string | null
          "Billing Country": string | null
          "Billing Name": string | null
          "Billing Phone": string | null
          "Billing Province": string | null
          "Billing Zip": number | null
          "Cancelled at": string | null
          "Channel Name": string | null
          "Channel Order Number": number | null
          "Channel Type": string | null
          "Created at": string | null
          Currency: string | null
          "Discount Amount": string | null
          "Discount Code": string | null
          Email: string | null
          "Financial Status": string | null
          "Fulfilled at": string | null
          "Fulfillment Status": string | null
          "Lineitem fulfillment status": string | null
          "Lineitem name": string | null
          "Lineitem price": number | null
          "Lineitem quantity": number | null
          "Lineitem requires shipping": boolean | null
          "Lineitem sku": string | null
          "Lineitem taxable": boolean | null
          "Lineitem variant": string | null
          "Order ID": number
          "Paid at": string | null
          "Payment Method": string | null
          "Payment Reference": string | null
          "Private Notes": string | null
          Shipping: string | null
          "Shipping Address1": string | null
          "Shipping Address2": string | null
          "Shipping City": string | null
          "Shipping Country": string | null
          "Shipping Method": string | null
          "Shipping Name": string | null
          "Shipping Phone": string | null
          "Shipping Province": string | null
          "Shipping Zip": string | null
          Subtotal: number | null
          Taxes: string | null
          Total: number | null
        }
        Insert: {
          "Amount Refunded"?: string | null
          "Billing Address1"?: string | null
          "Billing Address2"?: string | null
          "Billing City"?: string | null
          "Billing Country"?: string | null
          "Billing Name"?: string | null
          "Billing Phone"?: string | null
          "Billing Province"?: string | null
          "Billing Zip"?: number | null
          "Cancelled at"?: string | null
          "Channel Name"?: string | null
          "Channel Order Number"?: number | null
          "Channel Type"?: string | null
          "Created at"?: string | null
          Currency?: string | null
          "Discount Amount"?: string | null
          "Discount Code"?: string | null
          Email?: string | null
          "Financial Status"?: string | null
          "Fulfilled at"?: string | null
          "Fulfillment Status"?: string | null
          "Lineitem fulfillment status"?: string | null
          "Lineitem name"?: string | null
          "Lineitem price"?: number | null
          "Lineitem quantity"?: number | null
          "Lineitem requires shipping"?: boolean | null
          "Lineitem sku"?: string | null
          "Lineitem taxable"?: boolean | null
          "Lineitem variant"?: string | null
          "Order ID": number
          "Paid at"?: string | null
          "Payment Method"?: string | null
          "Payment Reference"?: string | null
          "Private Notes"?: string | null
          Shipping?: string | null
          "Shipping Address1"?: string | null
          "Shipping Address2"?: string | null
          "Shipping City"?: string | null
          "Shipping Country"?: string | null
          "Shipping Method"?: string | null
          "Shipping Name"?: string | null
          "Shipping Phone"?: string | null
          "Shipping Province"?: string | null
          "Shipping Zip"?: string | null
          Subtotal?: number | null
          Taxes?: string | null
          Total?: number | null
        }
        Update: {
          "Amount Refunded"?: string | null
          "Billing Address1"?: string | null
          "Billing Address2"?: string | null
          "Billing City"?: string | null
          "Billing Country"?: string | null
          "Billing Name"?: string | null
          "Billing Phone"?: string | null
          "Billing Province"?: string | null
          "Billing Zip"?: number | null
          "Cancelled at"?: string | null
          "Channel Name"?: string | null
          "Channel Order Number"?: number | null
          "Channel Type"?: string | null
          "Created at"?: string | null
          Currency?: string | null
          "Discount Amount"?: string | null
          "Discount Code"?: string | null
          Email?: string | null
          "Financial Status"?: string | null
          "Fulfilled at"?: string | null
          "Fulfillment Status"?: string | null
          "Lineitem fulfillment status"?: string | null
          "Lineitem name"?: string | null
          "Lineitem price"?: number | null
          "Lineitem quantity"?: number | null
          "Lineitem requires shipping"?: boolean | null
          "Lineitem sku"?: string | null
          "Lineitem taxable"?: boolean | null
          "Lineitem variant"?: string | null
          "Order ID"?: number
          "Paid at"?: string | null
          "Payment Method"?: string | null
          "Payment Reference"?: string | null
          "Private Notes"?: string | null
          Shipping?: string | null
          "Shipping Address1"?: string | null
          "Shipping Address2"?: string | null
          "Shipping City"?: string | null
          "Shipping Country"?: string | null
          "Shipping Method"?: string | null
          "Shipping Name"?: string | null
          "Shipping Phone"?: string | null
          "Shipping Province"?: string | null
          "Shipping Zip"?: string | null
          Subtotal?: number | null
          Taxes?: string | null
          Total?: number | null
        }
        Relationships: []
      }
      project_map: {
        Row: {
          id: number
          map: Json | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          map?: Json | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          map?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      search_results: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          facility_type: string | null
          id: string
          location: string | null
          query: string
          results: Json
          user_id: string | null
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          facility_type?: string | null
          id?: string
          location?: string | null
          query: string
          results: Json
          user_id?: string | null
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          facility_type?: string | null
          id?: string
          location?: string | null
          query?: string
          results?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      subscription_features: {
        Row: {
          created_at: string | null
          feature_id: string | null
          id: string
          tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Insert: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Update: {
          created_at?: string | null
          feature_id?: string | null
          id?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
        }
        Relationships: [
          {
            foreignKeyName: "subscription_features_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_flags"
            referencedColumns: ["id"]
          },
        ]
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
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          communication_preferences: Json | null
          company: string | null
          created_at: string | null
          default_location: string | null
          id: string
          job_title: string | null
          notification_preferences: Json | null
          preferred_contact_method: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          communication_preferences?: Json | null
          company?: string | null
          created_at?: string | null
          default_location?: string | null
          id: string
          job_title?: string | null
          notification_preferences?: Json | null
          preferred_contact_method?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          communication_preferences?: Json | null
          company?: string | null
          created_at?: string | null
          default_location?: string | null
          id?: string
          job_title?: string | null
          notification_preferences?: Json | null
          preferred_contact_method?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_locations_by_tags: {
        Args: { input_tags: string[] }
        Returns: {
          id: number
          name: string
          address: string
          tags: string[]
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_feature_enabled: {
        Args: {
          feature_key: string
          tier: Database["public"]["Enums"]["subscription_tier"]
        }
        Returns: boolean
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      app_role: "user" | "admin"
      subscription_tier: "free" | "basic" | "premium"
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
    Enums: {
      app_role: ["user", "admin"],
      subscription_tier: ["free", "basic", "premium"],
    },
  },
} as const
