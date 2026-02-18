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
      badges: {
        Row: {
          criteria: string
          description: string
          icon: string
          id: number
          name: string
        }
        Insert: {
          criteria?: string
          description?: string
          icon?: string
          id?: number
          name: string
        }
        Update: {
          criteria?: string
          description?: string
          icon?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      daily_chores: {
        Row: {
          active: boolean
          id: number
          reward_label: string
          reward_xp: number
          task: string
        }
        Insert: {
          active?: boolean
          id?: number
          reward_label?: string
          reward_xp?: number
          task: string
        }
        Update: {
          active?: boolean
          id?: number
          reward_label?: string
          reward_xp?: number
          task?: string
        }
        Relationships: []
      }
      hangman_words: {
        Row: {
          created_at: string
          difficulty: string | null
          hint: string
          id: number
          milestone_id: number | null
          word: string
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          hint: string
          id?: number
          milestone_id?: number | null
          word: string
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          hint?: string
          id?: number
          milestone_id?: number | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "hangman_words_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      horses: {
        Row: {
          breed: string
          created_at: string
          description: string | null
          icon: string
          id: number
          milestone_id: number | null
          name: string
        }
        Insert: {
          breed: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: number
          milestone_id?: number | null
          name: string
        }
        Update: {
          breed?: string
          created_at?: string
          description?: string | null
          icon?: string
          id?: number
          milestone_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "horses_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          created_at: string
          icon: string
          id: number
          map_x: number
          map_y: number
          sort_order: number
          title: string
          topic: string
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: number
          map_x?: number
          map_y?: number
          sort_order?: number
          title: string
          topic: string
        }
        Update: {
          created_at?: string
          icon?: string
          id?: number
          map_x?: number
          map_y?: number
          sort_order?: number
          title?: string
          topic?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          hay_coins: number
          id: string
          last_activity_date: string | null
          level: number
          name: string
          next_level_xp: number
          stable_name: string
          streak: number
          updated_at: string
          xp: number
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          hay_coins?: number
          id: string
          last_activity_date?: string | null
          level?: number
          name?: string
          next_level_xp?: number
          stable_name?: string
          streak?: number
          updated_at?: string
          xp?: number
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          hay_coins?: number
          id?: string
          last_activity_date?: string | null
          level?: number
          name?: string
          next_level_xp?: number
          stable_name?: string
          streak?: number
          updated_at?: string
          xp?: number
        }
        Relationships: []
      }
      project_submissions: {
        Row: {
          created_at: string
          description: string | null
          file_urls: Json
          id: string
          milestone_id: number
          self_assessment: Json | null
          status: string
          submitted_at: string | null
          title: string
          updated_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_urls?: Json
          id?: string
          milestone_id: number
          self_assessment?: Json | null
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          file_urls?: Json
          id?: string
          milestone_id?: number
          self_assessment?: Json | null
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_submissions_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_index: number
          created_at: string
          difficulty: string | null
          explanation: string
          id: number
          milestone_id: number | null
          options: Json
          question: string
          topic: string
        }
        Insert: {
          correct_index: number
          created_at?: string
          difficulty?: string | null
          explanation?: string
          id?: number
          milestone_id?: number | null
          options?: Json
          question: string
          topic: string
        }
        Update: {
          correct_index?: number
          created_at?: string
          difficulty?: string | null
          explanation?: string
          id?: number
          milestone_id?: number | null
          options?: Json
          question?: string
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          id: string
          milestone_id: number | null
          passed: boolean
          score: number
          topic: string
          total_questions: number
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          id?: string
          milestone_id?: number | null
          passed?: boolean
          score: number
          topic: string
          total_questions: number
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          id?: string
          milestone_id?: number | null
          passed?: boolean
          score?: number
          topic?: string
          total_questions?: number
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: number
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: number
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: number
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_chores: {
        Row: {
          chore_id: number
          completed_at: string
          id: string
          user_id: string
        }
        Insert: {
          chore_id: number
          completed_at?: string
          id?: string
          user_id: string
        }
        Update: {
          chore_id?: number
          completed_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_chores_chore_id_fkey"
            columns: ["chore_id"]
            isOneToOne: false
            referencedRelation: "daily_chores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_horses: {
        Row: {
          custom_name: string | null
          horse_id: number
          id: string
          level: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          custom_name?: string | null
          horse_id: number
          id?: string
          level?: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          custom_name?: string | null
          horse_id?: number
          id?: string
          level?: number
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_horses_horse_id_fkey"
            columns: ["horse_id"]
            isOneToOne: false
            referencedRelation: "horses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_horses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_horses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_milestones: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          milestone_id: number
          progress: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_id: number
          progress?: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          milestone_id?: number
          progress?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "leaderboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          id: string | null
          level: number | null
          name: string | null
          rank: number | null
          xp: number | null
        }
        Relationships: []
      }
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
