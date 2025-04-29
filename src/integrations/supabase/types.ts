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
      app_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      appointment_checklists: {
        Row: {
          appointment_id: string | null
          checklist_id: string | null
          completed_at: string | null
          completed_by: string | null
          completed_items: Json | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          checklist_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completed_items?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          checklist_id?: string | null
          completed_at?: string | null
          completed_by?: string | null
          completed_items?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_checklists_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointment_checklists_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "care_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          care_protocol_id: string | null
          care_type: string
          caregiver_id: string | null
          completed_at: string | null
          created_at: string | null
          date: string
          duration: number | null
          id: string
          is_recurring: boolean | null
          location: string | null
          notes: string | null
          patient_id: string | null
          recurrence_pattern: Json | null
          status: string | null
          time: string
          updated_at: string | null
        }
        Insert: {
          care_protocol_id?: string | null
          care_type: string
          caregiver_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          date: string
          duration?: number | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          recurrence_pattern?: Json | null
          status?: string | null
          time: string
          updated_at?: string | null
        }
        Update: {
          care_protocol_id?: string | null
          care_type?: string
          caregiver_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          date?: string
          duration?: number | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          notes?: string | null
          patient_id?: string | null
          recurrence_pattern?: Json | null
          status?: string | null
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_care_protocol_id_fkey"
            columns: ["care_protocol_id"]
            isOneToOne: false
            referencedRelation: "care_protocols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_records: {
        Row: {
          appointment_id: string | null
          base_amount: number | null
          care_code: string
          created_at: string | null
          created_by: string | null
          id: string
          majorations: Json | null
          patient_id: string | null
          payment_date: string | null
          payment_status: string | null
          quantity: number | null
          total_amount: number | null
          transmission_id: string | null
          transmission_status: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          base_amount?: number | null
          care_code: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          majorations?: Json | null
          patient_id?: string | null
          payment_date?: string | null
          payment_status?: string | null
          quantity?: number | null
          total_amount?: number | null
          transmission_id?: string | null
          transmission_status?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          base_amount?: number | null
          care_code?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          majorations?: Json | null
          patient_id?: string | null
          payment_date?: string | null
          payment_status?: string | null
          quantity?: number | null
          total_amount?: number | null
          transmission_id?: string | null
          transmission_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_records_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      care_checklists: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_template: boolean | null
          items: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_template?: boolean | null
          items?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_template?: boolean | null
          items?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      care_documents: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          description: string | null
          document_type: string
          file_path: string | null
          id: string
          is_signed: boolean | null
          patient_id: string | null
          storage_path: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          document_type: string
          file_path?: string | null
          id?: string
          is_signed?: boolean | null
          patient_id?: string | null
          storage_path?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          description?: string | null
          document_type?: string
          file_path?: string | null
          id?: string
          is_signed?: boolean | null
          patient_id?: string | null
          storage_path?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_documents_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_documents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      care_photos: {
        Row: {
          body_location: string | null
          category: string
          created_at: string | null
          document_id: string | null
          id: string
          notes: string | null
          patient_id: string | null
        }
        Insert: {
          body_location?: string | null
          category: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
        }
        Update: {
          body_location?: string | null
          category?: string
          created_at?: string | null
          document_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_photos_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "care_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_photos_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      care_protocols: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          steps: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          steps?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          steps?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string | null
          current_quantity: number | null
          expiry_date: string | null
          id: string
          min_quantity: number | null
          name: string
          notes: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          current_quantity?: number | null
          expiry_date?: string | null
          id?: string
          min_quantity?: number | null
          name: string
          notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          current_quantity?: number | null
          expiry_date?: string | null
          id?: string
          min_quantity?: number | null
          name?: string
          notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          appointment_id: string | null
          batch_number: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          item_id: string | null
          patient_id: string | null
          quantity: number
          reason: string | null
          recorded_by: string | null
          transaction_type: string
        }
        Insert: {
          appointment_id?: string | null
          batch_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          item_id?: string | null
          patient_id?: string | null
          quantity: number
          reason?: string | null
          recorded_by?: string | null
          transaction_type: string
        }
        Update: {
          appointment_id?: string | null
          batch_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          item_id?: string | null
          patient_id?: string | null
          quantity?: number
          reason?: string | null
          recorded_by?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      majorations: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          description: string
          id: string
          rate: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          description: string
          id?: string
          rate: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          description?: string
          id?: string
          rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      nursing_acts: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          description: string
          id: string
          rate: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          description: string
          id?: string
          rate: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          description?: string
          id?: string
          rate?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      patient_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_from_patient: boolean | null
          patient_id: string | null
          read_at: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_from_patient?: boolean | null
          patient_id?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_from_patient?: boolean | null
          patient_id?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_messages_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          doctor: string | null
          email: string | null
          first_name: string
          id: string
          insurance: string | null
          last_name: string
          medical_notes: string | null
          phone: string | null
          postal_code: string | null
          social_security_number: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          doctor?: string | null
          email?: string | null
          first_name: string
          id?: string
          insurance?: string | null
          last_name: string
          medical_notes?: string | null
          phone?: string | null
          postal_code?: string | null
          social_security_number?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          doctor?: string | null
          email?: string | null
          first_name?: string
          id?: string
          insurance?: string | null
          last_name?: string
          medical_notes?: string | null
          phone?: string | null
          postal_code?: string | null
          social_security_number?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      round_stops: {
        Row: {
          appointment_id: string | null
          created_at: string | null
          estimated_time: string | null
          id: string
          notes: string | null
          round_id: string | null
          stop_order: number
          updated_at: string | null
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string | null
          estimated_time?: string | null
          id?: string
          notes?: string | null
          round_id?: string | null
          stop_order: number
          updated_at?: string | null
        }
        Update: {
          appointment_id?: string | null
          created_at?: string | null
          estimated_time?: string | null
          id?: string
          notes?: string | null
          round_id?: string | null
          stop_order?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "round_stops_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_stops_round_id_fkey"
            columns: ["round_id"]
            isOneToOne: false
            referencedRelation: "rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      rounds: {
        Row: {
          caregiver_id: string | null
          created_at: string | null
          date: string
          id: string
          name: string
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          caregiver_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          name: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          caregiver_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_availability: {
        Row: {
          availability_type: string
          created_at: string | null
          end_time: string
          id: string
          notes: string | null
          recurrence_rule: string | null
          recurring: boolean | null
          start_time: string
          until_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability_type: string
          created_at?: string | null
          end_time: string
          id?: string
          notes?: string | null
          recurrence_rule?: string | null
          recurring?: boolean | null
          start_time: string
          until_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability_type?: string
          created_at?: string | null
          end_time?: string
          id?: string
          notes?: string | null
          recurrence_rule?: string | null
          recurring?: boolean | null
          start_time?: string
          until_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      vital_sign_alerts: {
        Row: {
          created_at: string | null
          id: string
          max_value: number | null
          min_value: number | null
          patient_id: string | null
          updated_at: string | null
          vital_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          patient_id?: string | null
          updated_at?: string | null
          vital_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value?: number | null
          patient_id?: string | null
          updated_at?: string | null
          vital_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "vital_sign_alerts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          blood_pressure: string | null
          blood_sugar: number | null
          created_at: string | null
          heart_rate: number | null
          id: string
          notes: string | null
          oxygen_saturation: number | null
          pain_level: number | null
          patient_id: string | null
          recorded_at: string | null
          recorded_by: string | null
          temperature: number | null
        }
        Insert: {
          blood_pressure?: string | null
          blood_sugar?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_level?: number | null
          patient_id?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          temperature?: number | null
        }
        Update: {
          blood_pressure?: string | null
          blood_sugar?: number | null
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          notes?: string | null
          oxygen_saturation?: number | null
          pain_level?: number | null
          patient_id?: string | null
          recorded_at?: string | null
          recorded_by?: string | null
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile: {
        Args: { user_id: string }
        Returns: Json
      }
      update_user_profile: {
        Args: { user_id: string; profile_data: Json }
        Returns: undefined
      }
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
