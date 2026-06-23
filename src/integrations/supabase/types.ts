export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      about_sections: {
        Row: {
          content: string
          key: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          key: string
          title?: string
          updated_at?: string
        }
        Update: {
          content?: string
          key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          created_at: string
          date: string
          excerpt: string
          id: string
          slug: string
          tag: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date?: string
          excerpt: string
          id?: string
          slug: string
          tag?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          excerpt?: string
          id?: string
          slug?: string
          tag?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          admin_notes: string | null
          barriers: string[] | null
          birthdate: string | null
          city: string | null
          consent_age: string | null
          created_at: string
          email: string
          english_level: string | null
          follow_ig: boolean | null
          follow_wa: boolean | null
          full_name: string
          id: string
          motivation: string
          ngo_experience: string | null
          passport_expiry: string | null
          passport_type: string | null
          phone: string | null
          previous_projects: number | null
          project_slug: string
          project_title: string
          status: string
        }
        Insert: {
          admin_notes?: string | null
          barriers?: string[] | null
          birthdate?: string | null
          city?: string | null
          consent_age?: string | null
          created_at?: string
          email: string
          english_level?: string | null
          follow_ig?: boolean | null
          follow_wa?: boolean | null
          full_name: string
          id?: string
          motivation: string
          ngo_experience?: string | null
          passport_expiry?: string | null
          passport_type?: string | null
          phone?: string | null
          previous_projects?: number | null
          project_slug: string
          project_title: string
          status?: string
        }
        Update: {
          admin_notes?: string | null
          barriers?: string[] | null
          birthdate?: string | null
          city?: string | null
          consent_age?: string | null
          created_at?: string
          email?: string
          english_level?: string | null
          follow_ig?: boolean | null
          follow_wa?: boolean | null
          full_name?: string
          id?: string
          motivation?: string
          ngo_experience?: string | null
          passport_expiry?: string | null
          passport_type?: string | null
          phone?: string | null
          previous_projects?: number | null
          project_slug?: string
          project_title?: string
          status?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          alt: string
          created_at: string
          id: string
          sort_order: number
          span: string
          src: string
        }
        Insert: {
          alt?: string
          created_at?: string
          id?: string
          sort_order?: number
          span?: string
          src: string
        }
        Update: {
          alt?: string
          created_at?: string
          id?: string
          sort_order?: number
          span?: string
          src?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          country: string
          created_at: string
          dates: string
          deadline: string
          id: string
          participants: number
          slug: string
          sort_order: number
          status: string
          summary: string
          title: string
          topics: string[]
          type: string
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          dates: string
          deadline?: string
          id?: string
          participants?: number
          slug: string
          sort_order?: number
          status?: string
          summary: string
          title: string
          topics?: string[]
          type: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          dates?: string
          deadline?: string
          id?: string
          participants?: number
          slug?: string
          sort_order?: number
          status?: string
          summary?: string
          title?: string
          topics?: string[]
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
