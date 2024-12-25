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
      user_profiles: {
        Row: {
          user_id: string
          email: string
          subscription_tier: 'free' | 'premium'
          blog_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          email: string
          subscription_tier?: 'free' | 'premium'
          blog_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          email?: string
          subscription_tier?: 'free' | 'premium'
          blog_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      blogs: {
        Row: {
          blog_id: string
          user_id: string
          title: string
          content: string
          featured_image?: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          blog_id?: string
          user_id: string
          title: string
          content: string
          featured_image?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          blog_id?: string
          user_id?: string
          title?: string
          content?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}