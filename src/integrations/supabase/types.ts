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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      products: {
        Row: {
          created_at: string | null
          current_price: number | null
          id: string
          image_url: string | null
          listed_date: string | null
          product_id: string | null
          sales_30d: number | null
          task_id: string | null
          title: string
          total_sales: number | null
        }
        Insert: {
          created_at?: string | null
          current_price?: number | null
          id?: string
          image_url?: string | null
          listed_date?: string | null
          product_id?: string | null
          sales_30d?: number | null
          task_id?: string | null
          title: string
          total_sales?: number | null
        }
        Update: {
          created_at?: string | null
          current_price?: number | null
          id?: string
          image_url?: string | null
          listed_date?: string | null
          product_id?: string | null
          sales_30d?: number | null
          task_id?: string | null
          title?: string
          total_sales?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "scraping_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      scraper_sessions: {
        Row: {
          cookies: Json | null
          created_at: string | null
          expires_at: string | null
          id: string
          provider: string
          session_token: string | null
          updated_at: string | null
        }
        Insert: {
          cookies?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider: string
          session_token?: string | null
          updated_at?: string | null
        }
        Update: {
          cookies?: Json | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          provider?: string
          session_token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      scraping_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          scraped_products: number | null
          shop_url: string
          status: string
          total_products: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          scraped_products?: number | null
          shop_url: string
          status?: string
          total_products?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          scraped_products?: number | null
          shop_url?: string
          status?: string
          total_products?: number | null
        }
        Relationships: []
      }
      tiktok_accounts: {
        Row: {
          account_name: string | null
          cookies: Json | null
          countries: string[]
          created_at: string | null
          description: string | null
          email: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          password_encrypted: string
          session_token: string | null
          updated_at: string | null
        }
        Insert: {
          account_name?: string | null
          cookies?: Json | null
          countries?: string[]
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          password_encrypted: string
          session_token?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string | null
          cookies?: Json | null
          countries?: string[]
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          password_encrypted?: string
          session_token?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tiktok_api_configs: {
        Row: {
          api_key: string
          auth_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          password_encrypted: string | null
          provider: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          api_key: string
          auth_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          password_encrypted?: string | null
          provider: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          api_key?: string
          auth_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          password_encrypted?: string | null
          provider?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      tiktok_collection_tasks: {
        Row: {
          categories: string[] | null
          completed_at: string | null
          countries: string[] | null
          created_at: string | null
          error_message: string | null
          id: string
          items_collected: number | null
          items_total: number | null
          progress: number | null
          provider: string
          started_at: string | null
          status: string
          task_type: string
          updated_at: string | null
        }
        Insert: {
          categories?: string[] | null
          completed_at?: string | null
          countries?: string[] | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_collected?: number | null
          items_total?: number | null
          progress?: number | null
          provider: string
          started_at?: string | null
          status?: string
          task_type: string
          updated_at?: string | null
        }
        Update: {
          categories?: string[] | null
          completed_at?: string | null
          countries?: string[] | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          items_collected?: number | null
          items_total?: number | null
          progress?: number | null
          provider?: string
          started_at?: string | null
          status?: string
          task_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tiktok_keywords: {
        Row: {
          competition_score: number | null
          country: string
          created_at: string | null
          data_date: string | null
          growth_rate: number | null
          id: string
          keyword: string
          related_keywords: string[] | null
          search_volume: number | null
          suggested_products: string[] | null
        }
        Insert: {
          competition_score?: number | null
          country: string
          created_at?: string | null
          data_date?: string | null
          growth_rate?: number | null
          id?: string
          keyword: string
          related_keywords?: string[] | null
          search_volume?: number | null
          suggested_products?: string[] | null
        }
        Update: {
          competition_score?: number | null
          country?: string
          created_at?: string | null
          data_date?: string | null
          growth_rate?: number | null
          id?: string
          keyword?: string
          related_keywords?: string[] | null
          search_volume?: number | null
          suggested_products?: string[] | null
        }
        Relationships: []
      }
      tiktok_market_data: {
        Row: {
          average_order_value: number | null
          climate: Json | null
          country_code: string
          country_name: string
          created_at: string | null
          cultural_notes: Json | null
          data_source: string
          ecommerce_growth: number | null
          id: string
          internet_penetration: number | null
          popular_payments: string[] | null
          population: number | null
          top_categories: Json | null
          updated_at: string | null
        }
        Insert: {
          average_order_value?: number | null
          climate?: Json | null
          country_code: string
          country_name: string
          created_at?: string | null
          cultural_notes?: Json | null
          data_source: string
          ecommerce_growth?: number | null
          id?: string
          internet_penetration?: number | null
          popular_payments?: string[] | null
          population?: number | null
          top_categories?: Json | null
          updated_at?: string | null
        }
        Update: {
          average_order_value?: number | null
          climate?: Json | null
          country_code?: string
          country_name?: string
          created_at?: string | null
          cultural_notes?: Json | null
          data_source?: string
          ecommerce_growth?: number | null
          id?: string
          internet_penetration?: number | null
          popular_payments?: string[] | null
          population?: number | null
          top_categories?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tiktok_opportunities: {
        Row: {
          category: string
          competition_level: string | null
          countries: string[] | null
          created_at: string | null
          data_source: string | null
          estimated_sales: number | null
          growth_rate: number | null
          id: string
          insights: string[] | null
          opportunity_id: string
          recommended_price_range: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          competition_level?: string | null
          countries?: string[] | null
          created_at?: string | null
          data_source?: string | null
          estimated_sales?: number | null
          growth_rate?: number | null
          id?: string
          insights?: string[] | null
          opportunity_id: string
          recommended_price_range?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          competition_level?: string | null
          countries?: string[] | null
          created_at?: string | null
          data_source?: string | null
          estimated_sales?: number | null
          growth_rate?: number | null
          id?: string
          insights?: string[] | null
          opportunity_id?: string
          recommended_price_range?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tiktok_products: {
        Row: {
          category: Json
          competition: Json
          countries: string[]
          created_at: string | null
          data_source: string
          description: string | null
          growth: Json
          id: string
          images: Json | null
          logistics: Json | null
          name: string
          name_en: string | null
          price: Json
          product_id: string
          profit_margin: number | null
          sales: Json
          supplier: Json | null
          tiktok_data: Json | null
          updated_at: string | null
        }
        Insert: {
          category: Json
          competition: Json
          countries: string[]
          created_at?: string | null
          data_source: string
          description?: string | null
          growth: Json
          id?: string
          images?: Json | null
          logistics?: Json | null
          name: string
          name_en?: string | null
          price: Json
          product_id: string
          profit_margin?: number | null
          sales: Json
          supplier?: Json | null
          tiktok_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          category?: Json
          competition?: Json
          countries?: string[]
          created_at?: string | null
          data_source?: string
          description?: string | null
          growth?: Json
          id?: string
          images?: Json | null
          logistics?: Json | null
          name?: string
          name_en?: string | null
          price?: Json
          product_id?: string
          profit_margin?: number | null
          sales?: Json
          supplier?: Json | null
          tiktok_data?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tiktok_rankings: {
        Row: {
          category: string | null
          country: string
          created_at: string | null
          data_date: string | null
          growth_rate: number | null
          id: string
          image_url: string | null
          price: number | null
          product_id: string
          product_name: string
          rank: number
          ranking_type: string
          sales_volume: number | null
          shop_name: string | null
        }
        Insert: {
          category?: string | null
          country: string
          created_at?: string | null
          data_date?: string | null
          growth_rate?: number | null
          id?: string
          image_url?: string | null
          price?: number | null
          product_id: string
          product_name: string
          rank: number
          ranking_type: string
          sales_volume?: number | null
          shop_name?: string | null
        }
        Update: {
          category?: string | null
          country?: string
          created_at?: string | null
          data_date?: string | null
          growth_rate?: number | null
          id?: string
          image_url?: string | null
          price?: number | null
          product_id?: string
          product_name?: string
          rank?: number
          ranking_type?: string
          sales_volume?: number | null
          shop_name?: string | null
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
    Enums: {},
  },
} as const
