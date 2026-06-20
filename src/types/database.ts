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
      action_impact_reports: {
        Row: {
          action_id: string | null
          author_id: string | null
          body: string
          created_at: string | null
          deleted_at: string | null
          id: string
          photo_url: string | null
          reported_at: string
          updated_at: string | null
        }
        Insert: {
          action_id?: string | null
          author_id?: string | null
          body: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          photo_url?: string | null
          reported_at: string
          updated_at?: string | null
        }
        Update: {
          action_id?: string | null
          author_id?: string | null
          body?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          photo_url?: string | null
          reported_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_impact_reports_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_impact_reports_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      action_participants: {
        Row: {
          action_id: string | null
          created_at: string | null
          id: string
          joined_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_id?: string | null
          created_at?: string | null
          id?: string
          joined_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_id?: string | null
          created_at?: string | null
          id?: string
          joined_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_participants_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      action_updates: {
        Row: {
          action_id: string | null
          author_id: string | null
          body: string
          created_at: string | null
          deleted_at: string | null
          id: string
          image_url: string | null
          updated_at: string | null
        }
        Insert: {
          action_id?: string | null
          author_id?: string | null
          body: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          action_id?: string | null
          author_id?: string | null
          body?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          image_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "action_updates_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      actions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category: string
          cover_image_url: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string
          end_time: string | null
          event_date: string
          id: string
          impact_level: string | null
          latitude: number
          location_name: string
          longitude: number
          review_notes: string | null
          start_time: string
          status: string | null
          submitted_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description: string
          end_time?: string | null
          event_date: string
          id?: string
          impact_level?: string | null
          latitude: number
          location_name: string
          longitude: number
          review_notes?: string | null
          start_time: string
          status?: string | null
          submitted_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          end_time?: string | null
          event_date?: string
          id?: string
          impact_level?: string | null
          latitude?: number
          location_name?: string
          longitude?: number
          review_notes?: string | null
          start_time?: string
          status?: string | null
          submitted_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          inquiry_type: string
          message: string
          resolved_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          inquiry_type: string
          message: string
          resolved_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          inquiry_type?: string
          message?: string
          resolved_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_flags: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          reason: string
          reply_id: string | null
          reporter_id: string | null
          status: string | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          reason: string
          reply_id?: string | null
          reporter_id?: string | null
          status?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          reason?: string
          reply_id?: string | null
          reporter_id?: string | null
          status?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_flags_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_flags_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_flags_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string
          external_url: string | null
          file_formats: string[] | null
          file_url: string | null
          id: string
          published_at: string | null
          title: string
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description: string
          external_url?: string | null
          file_formats?: string[] | null
          file_url?: string | null
          id?: string
          published_at?: string | null
          title: string
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          external_url?: string | null
          file_formats?: string[] | null
          file_url?: string | null
          id?: string
          published_at?: string | null
          title?: string
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "datasets_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          event_name: string
          id: string
          properties: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_name: string
          id?: string
          properties?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_name?: string
          id?: string
          properties?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_attachments: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          reply_id: string | null
          thread_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_attachments_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_attachments_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_categories: {
        Row: {
          color: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_likes: {
        Row: {
          created_at: string | null
          id: string
          reply_id: string | null
          thread_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reply_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_replies: {
        Row: {
          author_id: string | null
          body: string
          created_at: string | null
          deleted_at: string | null
          id: string
          parent_id: string | null
          thread_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          parent_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "forum_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          author_id: string | null
          body: string
          category_id: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body: string
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          subscribed_at: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          link: string | null
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          link?: string | null
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      originality_claims: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          status: string | null
          thread_id: string | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          status?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          status?: string | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "originality_claims_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "originality_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "originality_claims_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      partnership_inquiries: {
        Row: {
          collaboration_goal: string
          contact_email: string
          created_at: string | null
          id: string
          org_name: string
          org_type: string
          reviewed_at: string | null
          updated_at: string | null
        }
        Insert: {
          collaboration_goal: string
          contact_email: string
          created_at?: string | null
          id?: string
          org_name: string
          org_type: string
          reviewed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          collaboration_goal?: string
          contact_email?: string
          created_at?: string | null
          id?: string
          org_name?: string
          org_type?: string
          reviewed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string | null
          featured_project_id: string | null
          hectares_protected: string | null
          hero_home_url: string | null
          hero_opendata_url: string | null
          hero_partnerships_url: string | null
          hero_policy_url: string | null
          id: string
          purity_rating: string | null
          trust_score: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          featured_project_id?: string | null
          hectares_protected?: string | null
          hero_home_url?: string | null
          hero_opendata_url?: string | null
          hero_partnerships_url?: string | null
          hero_policy_url?: string | null
          id?: string
          purity_rating?: string | null
          trust_score?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          featured_project_id?: string | null
          hectares_protected?: string | null
          hero_home_url?: string | null
          hero_opendata_url?: string | null
          hero_partnerships_url?: string | null
          hero_policy_url?: string | null
          id?: string
          purity_rating?: string | null
          trust_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_featured_project_id_fkey"
            columns: ["featured_project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_endorsements: {
        Row: {
          created_at: string | null
          id: string
          policy_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          policy_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          policy_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policy_endorsements_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policy_updates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_endorsements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          generated_at: string | null
          id: string
          pdf_url: string | null
          period: string
          policy_snapshot: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          generated_at?: string | null
          id?: string
          pdf_url?: string | null
          period: string
          policy_snapshot?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          generated_at?: string | null
          id?: string
          pdf_url?: string | null
          period?: string
          policy_snapshot?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policy_reports_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_updates: {
        Row: {
          body: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          endorsement_threshold: number | null
          full_text_pdf_url: string | null
          id: string
          map_center_lat: number | null
          map_center_lng: number | null
          map_zoom_level: number | null
          official_source_url: string | null
          press_release_url: string | null
          published_at: string | null
          region_geojson: string | null
          scope: string | null
          status: string | null
          threshold_notified: boolean | null
          threshold_reached_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          endorsement_threshold?: number | null
          full_text_pdf_url?: string | null
          id?: string
          map_center_lat?: number | null
          map_center_lng?: number | null
          map_zoom_level?: number | null
          official_source_url?: string | null
          press_release_url?: string | null
          published_at?: string | null
          region_geojson?: string | null
          scope?: string | null
          status?: string | null
          threshold_notified?: boolean | null
          threshold_reached_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          endorsement_threshold?: number | null
          full_text_pdf_url?: string | null
          id?: string
          map_center_lat?: number | null
          map_center_lng?: number | null
          map_zoom_level?: number | null
          official_source_url?: string | null
          press_release_url?: string | null
          published_at?: string | null
          region_geojson?: string | null
          scope?: string | null
          status?: string | null
          threshold_notified?: boolean | null
          threshold_reached_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "policy_updates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category_id: string | null
          created_at: string | null
          deleted_at: string | null
          description: string
          id: string
          recommended_at: string | null
          recommended_by: string | null
          review_notes: string | null
          status: string | null
          submitted_at: string | null
          submitted_by: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description: string
          id?: string
          recommended_at?: string | null
          recommended_by?: string | null
          review_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category_id?: string | null
          created_at?: string | null
          deleted_at?: string | null
          description?: string
          id?: string
          recommended_at?: string | null
          recommended_by?: string | null
          review_notes?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "research_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_recommended_by_fkey"
            columns: ["recommended_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      research_attachments: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id: string
          research_project_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          file_url: string
          id?: string
          research_project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          research_project_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_attachments_research_project_id_fkey"
            columns: ["research_project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      research_categories: {
        Row: {
          color: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      research_participants: {
        Row: {
          created_at: string | null
          id: string
          joined_at: string | null
          research_project_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          research_project_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          research_project_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_participants_research_project_id_fkey"
            columns: ["research_project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      research_projects: {
        Row: {
          category_id: string | null
          cover_image_url: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string
          id: string
          join_mode: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description: string
          id?: string
          join_mode?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string
          id?: string
          join_mode?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_projects_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "research_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      research_updates: {
        Row: {
          author_id: string | null
          body: string
          created_at: string | null
          deleted_at: string | null
          id: string
          research_project_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          research_project_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          research_project_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_updates_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_updates_research_project_id_fkey"
            columns: ["research_project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          country: string | null
          cover_image_url: string | null
          created_at: string | null
          deleted_at: string | null
          display_name: string
          display_title: string | null
          email: string
          id: string
          impact_score: number | null
          location: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name: string
          display_title?: string | null
          email: string
          id?: string
          impact_score?: number | null
          location?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string
          display_title?: string | null
          email?: string
          id?: string
          impact_score?: number | null
          location?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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
