export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      backup_appointments: {
        Row: {
          created_at: string | null
          customer_id: string
          end_time: string
          id: string
          notes: string | null
          provider_id: string
          service_id: string
          start_time: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          end_time: string
          id?: string
          notes?: string | null
          provider_id: string
          service_id: string
          start_time: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          provider_id?: string
          service_id?: string
          start_time?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      backup_inventory_metadata: {
        Row: {
          business_id: string | null
          created_at: string | null
          custom_fields: Json
          field_mappings: Json
          id: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          custom_fields?: Json
          field_mappings?: Json
          id?: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          custom_fields?: Json
          field_mappings?: Json
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      backup_provider_compensation: {
        Row: {
          base_rate: number | null
          commission_percentage: number | null
          compensation_id: string
          compensation_type: string
          created_at: string | null
          effective_date: string | null
          enable_greater_of: boolean | null
          include_time_blocks: boolean | null
          metadata: Json | null
          service_id: string | null
          sliding_scale: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base_rate?: number | null
          commission_percentage?: number | null
          compensation_id?: string
          compensation_type: string
          created_at?: string | null
          effective_date?: string | null
          enable_greater_of?: boolean | null
          include_time_blocks?: boolean | null
          metadata?: Json | null
          service_id?: string | null
          sliding_scale?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base_rate?: number | null
          commission_percentage?: number | null
          compensation_id?: string
          compensation_type?: string
          created_at?: string | null
          effective_date?: string | null
          enable_greater_of?: boolean | null
          include_time_blocks?: boolean | null
          metadata?: Json | null
          service_id?: string | null
          sliding_scale?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_compensation_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookable_services"
            referencedColumns: ["service_id"]
          },
          {
            foreignKeyName: "provider_compensation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      backup_provider_compensation_history: {
        Row: {
          change_timestamp: string | null
          changed_by: string
          compensation_id: string | null
          history_id: string
          new_values: Json | null
          old_values: Json | null
          provider_id: string
        }
        Insert: {
          change_timestamp?: string | null
          changed_by: string
          compensation_id?: string | null
          history_id?: string
          new_values?: Json | null
          old_values?: Json | null
          provider_id: string
        }
        Update: {
          change_timestamp?: string | null
          changed_by?: string
          compensation_id?: string | null
          history_id?: string
          new_values?: Json | null
          old_values?: Json | null
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_compensation_history_compensation_id_fkey"
            columns: ["compensation_id"]
            isOneToOne: false
            referencedRelation: "backup_provider_compensation"
            referencedColumns: ["compensation_id"]
          },
        ]
      }
      backup_provider_compensation_history_1: {
        Row: {
          change_type: string | null
          changed_at: string | null
          compensation_id: string
          history_id: string
          new_values: Json
          old_values: Json
          user_id: string
        }
        Insert: {
          change_type?: string | null
          changed_at?: string | null
          compensation_id: string
          history_id?: string
          new_values: Json
          old_values: Json
          user_id: string
        }
        Update: {
          change_type?: string | null
          changed_at?: string | null
          compensation_id?: string
          history_id?: string
          new_values?: Json
          old_values?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_compensation_history_compensation_id_fkey1"
            columns: ["compensation_id"]
            isOneToOne: false
            referencedRelation: "provider_compensation"
            referencedColumns: ["compensation_id"]
          },
          {
            foreignKeyName: "provider_compensation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bookable_services: {
        Row: {
          "base price": number | null
          bpm_id: string | null
          category: string | null
          created_at: string | null
          custom_fields: Json | null
          default_duration: number
          module_instance_id: string
          pricing_metadata: Json | null
          service_id: string
          service_name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          "base price"?: number | null
          bpm_id?: string | null
          category?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          default_duration: number
          module_instance_id: string
          pricing_metadata?: Json | null
          service_id?: string
          service_name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          "base price"?: number | null
          bpm_id?: string | null
          category?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          default_duration?: number
          module_instance_id?: string
          pricing_metadata?: Json | null
          service_id?: string
          service_name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookable_services_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "bookable_services_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      bookable_services_history: {
        Row: {
          change_timestamp: string | null
          changed_by: string | null
          history_id: string
          module_instance_id: string | null
          new_values: Json | null
          old_values: Json | null
          service_id: string | null
        }
        Insert: {
          change_timestamp?: string | null
          changed_by?: string | null
          history_id?: string
          module_instance_id?: string | null
          new_values?: Json | null
          old_values?: Json | null
          service_id?: string | null
        }
        Update: {
          change_timestamp?: string | null
          changed_by?: string | null
          history_id?: string
          module_instance_id?: string | null
          new_values?: Json | null
          old_values?: Json | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookable_services_history_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookable_services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      bpm_instances: {
        Row: {
          bpm_id: string
          bpm_name: string
          created_at: string | null
          subdomain: string
        }
        Insert: {
          bpm_id?: string
          bpm_name: string
          created_at?: string | null
          subdomain: string
        }
        Update: {
          bpm_id?: string
          bpm_name?: string
          created_at?: string | null
          subdomain?: string
        }
        Relationships: []
      }
      bpm_metadata: {
        Row: {
          bpm_id: string
          created_at: string | null
          metadata: Json
          metadata_id: string
          module_instance_id: string
        }
        Insert: {
          bpm_id: string
          created_at?: string | null
          metadata?: Json
          metadata_id?: string
          module_instance_id: string
        }
        Update: {
          bpm_id?: string
          created_at?: string | null
          metadata?: Json
          metadata_id?: string
          module_instance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bpm_metadata_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
        ]
      }
      bpm_module_instances: {
        Row: {
          bpm_id: string
          created_at: string | null
          embedded_modules: string[] | null
          instance_name: string
          linkable_entities: Json | null
          linked_module_instances: Json[] | null
          masks: Json | null
          metadata_core_fields: Json | null
          metadata_custom_fields: Json | null
          module_id: string
          module_instance_id: string
          pricing_metadata: Json | null
          settings_metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          bpm_id: string
          created_at?: string | null
          embedded_modules?: string[] | null
          instance_name: string
          linkable_entities?: Json | null
          linked_module_instances?: Json[] | null
          masks?: Json | null
          metadata_core_fields?: Json | null
          metadata_custom_fields?: Json | null
          module_id: string
          module_instance_id?: string
          pricing_metadata?: Json | null
          settings_metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          bpm_id?: string
          created_at?: string | null
          embedded_modules?: string[] | null
          instance_name?: string
          linkable_entities?: Json | null
          linked_module_instances?: Json[] | null
          masks?: Json | null
          metadata_core_fields?: Json | null
          metadata_custom_fields?: Json | null
          module_id?: string
          module_instance_id?: string
          pricing_metadata?: Json | null
          settings_metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bpm_module_instances_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "bpm_module_instances_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "bpm_modules"
            referencedColumns: ["module_id"]
          },
        ]
      }
      bpm_modules: {
        Row: {
          associated_tables: Json | null
          created_at: string | null
          description: string | null
          embed_usage_context_ids: string[] | null
          icon: string | null
          is_embeddable_only: boolean | null
          "Metadata Structure": Json | null
          module_id: string
          module_name: string
        }
        Insert: {
          associated_tables?: Json | null
          created_at?: string | null
          description?: string | null
          embed_usage_context_ids?: string[] | null
          icon?: string | null
          is_embeddable_only?: boolean | null
          "Metadata Structure"?: Json | null
          module_id?: string
          module_name: string
        }
        Update: {
          associated_tables?: Json | null
          created_at?: string | null
          description?: string | null
          embed_usage_context_ids?: string[] | null
          icon?: string | null
          is_embeddable_only?: boolean | null
          "Metadata Structure"?: Json | null
          module_id?: string
          module_name?: string
        }
        Relationships: []
      }
      bpm_navigation_links: {
        Row: {
          bpm_id: string
          display_name: string
          icon: string | null
          module_instance_id: string
          order_index: number | null
          parent_group: string | null
          parent_module_id: string | null
        }
        Insert: {
          bpm_id: string
          display_name: string
          icon?: string | null
          module_instance_id: string
          order_index?: number | null
          parent_group?: string | null
          parent_module_id?: string | null
        }
        Update: {
          bpm_id?: string
          display_name?: string
          icon?: string | null
          module_instance_id?: string
          order_index?: number | null
          parent_group?: string | null
          parent_module_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bpm_navigation_links_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "bpm_navigation_links_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      bpm_roles: {
        Row: {
          bpm_id: string
          created_at: string | null
          created_by: string | null
          description: string | null
          is_system_role: boolean | null
          name: string
          role_id: string
        }
        Insert: {
          bpm_id: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          is_system_role?: boolean | null
          name: string
          role_id?: string
        }
        Update: {
          bpm_id?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          is_system_role?: boolean | null
          name?: string
          role_id?: string
        }
        Relationships: []
      }
      bpm_theme_settings: {
        Row: {
          bpm_id: string
          created_at: string | null
          theme: Json
          updated_at: string | null
        }
        Insert: {
          bpm_id: string
          created_at?: string | null
          theme: Json
          updated_at?: string | null
        }
        Update: {
          bpm_id?: string
          created_at?: string | null
          theme?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bpm_theme_settings_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: true
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
        ]
      }
      bpm_theme_settings_history: {
        Row: {
          bpm_id: string | null
          change_type: string | null
          changed_at: string | null
          history_id: string
          new_values: Json
          old_values: Json
        }
        Insert: {
          bpm_id?: string | null
          change_type?: string | null
          changed_at?: string | null
          history_id?: string
          new_values?: Json
          old_values?: Json
        }
        Update: {
          bpm_id?: string | null
          change_type?: string | null
          changed_at?: string | null
          history_id?: string
          new_values?: Json
          old_values?: Json
        }
        Relationships: [
          {
            foreignKeyName: "bpm_theme_settings_history_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
        ]
      }
      bpm_users: {
        Row: {
          bpm_id: string
          user_id: string
        }
        Insert: {
          bpm_id: string
          user_id: string
        }
        Update: {
          bpm_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bpm_users_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_time: string
          entity_id: string
          entity_type: string | null
          event_id: string | null
          event_type: string | null
          id: string
          metadata: Json | null
          module_instance_id: string
          start_time: string
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_time: string
          entity_id: string
          entity_type?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          module_instance_id: string
          start_time: string
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_time?: string
          entity_id?: string
          entity_type?: string | null
          event_id?: string | null
          event_type?: string | null
          id?: string
          metadata?: Json | null
          module_instance_id?: string
          start_time?: string
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      calendar_history: {
        Row: {
          calendar_event_id: string | null
          event_id: string | null
          id: string
          metadata: Json | null
          modification_type: string | null
          modified_at: string | null
          modified_by: string | null
          module_instance_id: string
          new_end_time: string | null
          new_start_time: string | null
          new_status: string | null
          old_end_time: string | null
          old_start_time: string | null
          old_status: string | null
        }
        Insert: {
          calendar_event_id?: string | null
          event_id?: string | null
          id?: string
          metadata?: Json | null
          modification_type?: string | null
          modified_at?: string | null
          modified_by?: string | null
          module_instance_id: string
          new_end_time?: string | null
          new_start_time?: string | null
          new_status?: string | null
          old_end_time?: string | null
          old_start_time?: string | null
          old_status?: string | null
        }
        Update: {
          calendar_event_id?: string | null
          event_id?: string | null
          id?: string
          metadata?: Json | null
          modification_type?: string | null
          modified_at?: string | null
          modified_by?: string | null
          module_instance_id?: string
          new_end_time?: string | null
          new_start_time?: string | null
          new_status?: string | null
          old_end_time?: string | null
          old_start_time?: string | null
          old_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_history_calendar_event_id_fkey"
            columns: ["calendar_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_history_modified_by_fkey"
            columns: ["modified_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "calendar_history_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      checklist_item_audit_log: {
        Row: {
          action: string
          checklist_item_id: string | null
          field_changes: Json | null
          id: string
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          checklist_item_id?: string | null
          field_changes?: Json | null
          id?: string
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          checklist_item_id?: string | null
          field_changes?: Json | null
          id?: string
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      checklist_item_completions: {
        Row: {
          checklist_item_id: string | null
          completed: boolean | null
          completed_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_completions_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_item_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      checklist_item_snapshot_updates: {
        Row: {
          checklist_item_id: string | null
          id: string
          new_snapshot: Json | null
          old_snapshot: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          checklist_item_id?: string | null
          id?: string
          new_snapshot?: Json | null
          old_snapshot?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          checklist_item_id?: string | null
          id?: string
          new_snapshot?: Json | null
          old_snapshot?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_item_snapshot_updates_checklist_item_id_fkey"
            columns: ["checklist_item_id"]
            isOneToOne: false
            referencedRelation: "checklist_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_item_snapshot_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      checklist_items: {
        Row: {
          checklist_id: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          item_type: string
          linked_id: string | null
          linked_table: string | null
          position: number | null
          snapshot: Json
        }
        Insert: {
          checklist_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          item_type: string
          linked_id?: string | null
          linked_table?: string | null
          position?: number | null
          snapshot: Json
        }
        Update: {
          checklist_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          item_type?: string
          linked_id?: string | null
          linked_table?: string | null
          position?: number | null
          snapshot?: Json
        }
        Relationships: [
          {
            foreignKeyName: "checklist_items_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          created_at: string | null
          created_by: string | null
          created_from: string | null
          id: string
          linked_to_id: string
          linked_to_table: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          created_from?: string | null
          id?: string
          linked_to_id: string
          linked_to_table: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          created_from?: string | null
          id?: string
          linked_to_id?: string
          linked_to_table?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      client_history: {
        Row: {
          action: string
          changes: Json | null
          client_id: string | null
          created_at: string | null
          id: string
          module_instance_id: string
          new_values: Json | null
          old_values: Json | null
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          module_instance_id: string
          new_values?: Json | null
          old_values?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          client_id?: string | null
          created_at?: string | null
          id?: string
          module_instance_id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_history_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      client_services: {
        Row: {
          client_id: string
          created_at: string | null
          eligible_from: string | null
          eligible_to: string | null
          id: string
          notes: string | null
          service_id: string
          updated_by_user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          eligible_from?: string | null
          eligible_to?: string | null
          id?: string
          notes?: string | null
          service_id: string
          updated_by_user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          eligible_from?: string | null
          eligible_to?: string | null
          id?: string
          notes?: string | null
          service_id?: string
          updated_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookable_services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      client_services_history: {
        Row: {
          action: string
          changes: Json | null
          client_service_id: string | null
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          client_service_id?: string | null
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          client_service_id?: string | null
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_services_history_client_service_id_fkey"
            columns: ["client_service_id"]
            isOneToOne: false
            referencedRelation: "client_services"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          billing_address: Json | null
          bpm_id: string | null
          client_id: string
          client_name: string
          company_id: string | null
          contact_email: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          invoicing_metadata: Json | null
          module_instance_id: string
          phone_number: string | null
          quoting_metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          billing_address?: Json | null
          bpm_id?: string | null
          client_id?: string
          client_name: string
          company_id?: string | null
          contact_email?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          invoicing_metadata?: Json | null
          module_instance_id: string
          phone_number?: string | null
          quoting_metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json | null
          bpm_id?: string | null
          client_id?: string
          client_name?: string
          company_id?: string | null
          contact_email?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          invoicing_metadata?: Json | null
          module_instance_id?: string
          phone_number?: string | null
          quoting_metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "fk_clients_module_instance"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      companies: {
        Row: {
          bpm_id: string | null
          company_id: string
          company_name: string
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          invoicing_metadata: Json | null
          module_instance_id: string
          primary_contact_id: string | null
          primary_contact_role: string | null
          quoting_metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          bpm_id?: string | null
          company_id?: string
          company_name: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          invoicing_metadata?: Json | null
          module_instance_id: string
          primary_contact_id?: string | null
          primary_contact_role?: string | null
          quoting_metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          bpm_id?: string | null
          company_id?: string
          company_name?: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          invoicing_metadata?: Json | null
          module_instance_id?: string
          primary_contact_id?: string | null
          primary_contact_role?: string | null
          quoting_metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "companies_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "fk_created_by_user"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_primary_contact"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      content_edits: {
        Row: {
          content: string
          created_at: string
          id: string
          page_identifier: string | null
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id: string
          page_identifier?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          page_identifier?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      demo_bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          email: string
          google_event_id: string | null
          id: string
          message: string | null
          name: string
          phone: string | null
          status: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          email: string
          google_event_id?: string | null
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          email?: string
          google_event_id?: string | null
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          elements: Json
          id: string
          last_updated: string | null
          module_instance_id: string | null
          name: string
          subject: string
        }
        Insert: {
          elements: Json
          id: string
          last_updated?: string | null
          module_instance_id?: string | null
          name: string
          subject: string
        }
        Update: {
          elements?: Json
          id?: string
          last_updated?: string | null
          module_instance_id?: string | null
          name?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      entity_links: {
        Row: {
          bpm_id: string | null
          context: Json | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          id: string
          relationship_type: string
          source_column: string
          source_id: string
          source_module_instance_id: string | null
          source_type: string
          target_column: string
          target_id: string
          target_module_instance_id: string | null
          target_type: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bpm_id?: string | null
          context?: Json | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          relationship_type: string
          source_column: string
          source_id: string
          source_module_instance_id?: string | null
          source_type: string
          target_column: string
          target_id: string
          target_module_instance_id?: string | null
          target_type: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bpm_id?: string | null
          context?: Json | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          id?: string
          relationship_type?: string
          source_column?: string
          source_id?: string
          source_module_instance_id?: string | null
          source_type?: string
          target_column?: string
          target_id?: string
          target_module_instance_id?: string | null
          target_type?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_links_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "entity_links_source_module_instance_id_fkey"
            columns: ["source_module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "entity_links_target_module_instance_id_fkey"
            columns: ["target_module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      field_configuration_history: {
        Row: {
          field_name: string
          id: string
          modified_at: string | null
          modified_by: string | null
          module_instance_id: string
          new_config: Json | null
          old_config: Json | null
        }
        Insert: {
          field_name: string
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          module_instance_id: string
          new_config?: Json | null
          old_config?: Json | null
        }
        Update: {
          field_name?: string
          id?: string
          modified_at?: string | null
          modified_by?: string | null
          module_instance_id?: string
          new_config?: Json | null
          old_config?: Json | null
        }
        Relationships: []
      }
      franchise_locations: {
        Row: {
          bpm_id: string | null
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          location_address: string
          location_id: string
          location_name: string
          module_instance_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bpm_id?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          location_address: string
          location_id?: string
          location_name: string
          module_instance_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bpm_id?: string | null
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          location_address?: string
          location_id?: string
          location_name?: string
          module_instance_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          access_token_encrypted: string | null
          bpm_id: string
          created_at: string
          created_by: string | null
          id: string
          integration_type: string
          last_sync_at: string | null
          metadata: Json | null
          module_instance_id: string | null
          site_id: string | null
          site_name: string | null
          staff_username: string | null
          status: string
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token_encrypted?: string | null
          bpm_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          integration_type: string
          last_sync_at?: string | null
          metadata?: Json | null
          module_instance_id?: string | null
          site_id?: string | null
          site_name?: string | null
          staff_username?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token_encrypted?: string | null
          bpm_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          integration_type?: string
          last_sync_at?: string | null
          metadata?: Json | null
          module_instance_id?: string | null
          site_id?: string | null
          site_name?: string | null
          staff_username?: string | null
          status?: string
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_history: {
        Row: {
          action: string
          bpm_id: string | null
          changes: Json
          created_at: string | null
          id: string
          item_id: string | null
          new_values: Json | null
          old_values: Json | null
          user_id: string
        }
        Insert: {
          action: string
          bpm_id?: string | null
          changes: Json
          created_at?: string | null
          id?: string
          item_id?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          bpm_id?: string | null
          changes?: Json
          created_at?: string | null
          id?: string
          item_id?: string | null
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_history_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "inventory_history_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          bpm_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          quantity: number
          status: string
          updated_at: string | null
        }
        Insert: {
          bpm_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          quantity?: number
          status?: string
          updated_at?: string | null
        }
        Update: {
          bpm_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          quantity?: number
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_id: string | null
          created_at: string | null
          due_date: string | null
          invoice_date: string | null
          invoice_id: string
          invoice_metadata: Json | null
          paid: boolean | null
          provider_id: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          invoice_date?: string | null
          invoice_id?: string
          invoice_metadata?: Json | null
          paid?: boolean | null
          provider_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          invoice_date?: string | null
          invoice_id?: string
          invoice_metadata?: Json | null
          paid?: boolean | null
          provider_id?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      landing_page_settings: {
        Row: {
          created_at: string | null
          element_visibility: Json
          id: number
          page_identifier: string | null
          section_order: Json
          section_visibility: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          element_visibility?: Json
          id?: number
          page_identifier?: string | null
          section_order?: Json
          section_visibility?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          element_visibility?: Json
          id?: number
          page_identifier?: string | null
          section_order?: Json
          section_visibility?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      module_permissions: {
        Row: {
          action: string
          allowed: boolean
          bpm_id: string | null
          conditions: Json | null
          created_at: string | null
          expression_preview: string | null
          module_instance_id: string
          permission_id: string
          role: string
        }
        Insert: {
          action: string
          allowed?: boolean
          bpm_id?: string | null
          conditions?: Json | null
          created_at?: string | null
          expression_preview?: string | null
          module_instance_id: string
          permission_id?: string
          role: string
        }
        Update: {
          action?: string
          allowed?: boolean
          bpm_id?: string | null
          conditions?: Json | null
          created_at?: string | null
          expression_preview?: string | null
          module_instance_id?: string
          permission_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_module_permissions_bpm"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "fk_module_permissions_module"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "module_permissions_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "module_permissions_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      oauth_sessions: {
        Row: {
          bpm_id: string
          created_at: string
          expires_at: string
          id: string
          integration_type: string
          state_token: string
          user_id: string
        }
        Insert: {
          bpm_id: string
          created_at?: string
          expires_at: string
          id?: string
          integration_type: string
          state_token: string
          user_id: string
        }
        Update: {
          bpm_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          integration_type?: string
          state_token?: string
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          actual_close_date: string | null
          amount: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          custom_fields: Json | null
          expected_close_date: string | null
          manual_probability: number | null
          module_instance_id: string
          mrr: number | null
          opportunity_id: string
          opportunity_name: string
          owner_id: string | null
          stage_id: string | null
          updated_at: string | null
        }
        Insert: {
          actual_close_date?: string | null
          amount?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_fields?: Json | null
          expected_close_date?: string | null
          manual_probability?: number | null
          module_instance_id: string
          mrr?: number | null
          opportunity_id?: string
          opportunity_name: string
          owner_id?: string | null
          stage_id?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_close_date?: string | null
          amount?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_fields?: Json | null
          expected_close_date?: string | null
          manual_probability?: number | null
          module_instance_id?: string
          mrr?: number | null
          opportunity_id?: string
          opportunity_name?: string
          owner_id?: string | null
          stage_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "opportunities_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "opportunities_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "opportunities_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "opportunity_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_stages: {
        Row: {
          allow_backwards_progression: boolean | null
          allow_skipping: boolean | null
          bpm_id: string
          color: string | null
          custom_fields: Json | null
          id: string
          is_terminal: boolean | null
          key: string | null
          likelihood_to_close: number | null
          module_instance_id: string | null
          name: string | null
          ordinal: number | null
        }
        Insert: {
          allow_backwards_progression?: boolean | null
          allow_skipping?: boolean | null
          bpm_id: string
          color?: string | null
          custom_fields?: Json | null
          id?: string
          is_terminal?: boolean | null
          key?: string | null
          likelihood_to_close?: number | null
          module_instance_id?: string | null
          name?: string | null
          ordinal?: number | null
        }
        Update: {
          allow_backwards_progression?: boolean | null
          allow_skipping?: boolean | null
          bpm_id?: string
          color?: string | null
          custom_fields?: Json | null
          id?: string
          is_terminal?: boolean | null
          key?: string | null
          likelihood_to_close?: number | null
          module_instance_id?: string | null
          name?: string | null
          ordinal?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_stages_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "opportunity_stages_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      option_set_values: {
        Row: {
          bpm_id: string
          category_list_id: string
          category_value: string
          created_at: string | null
          created_by: string | null
          custom_fields_metadata: Json | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          module_instance_id: string | null
          pricing_rules_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bpm_id: string
          category_list_id: string
          category_value: string
          created_at?: string | null
          created_by?: string | null
          custom_fields_metadata?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          module_instance_id?: string | null
          pricing_rules_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bpm_id?: string
          category_list_id?: string
          category_value?: string
          created_at?: string | null
          created_by?: string | null
          custom_fields_metadata?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          module_instance_id?: string | null
          pricing_rules_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorical_list_values_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "option_set_values_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      option_set_values_history: {
        Row: {
          archived_at: string | null
          archived_by: string | null
          bpm_id: string
          categorical_list_id: string
          category_value: string
          created_at: string | null
          created_by: string | null
          custom_fields_metadata: Json | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          original_id: string | null
          pricing_rules_metadata: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          archived_at?: string | null
          archived_by?: string | null
          bpm_id: string
          categorical_list_id: string
          category_value: string
          created_at?: string | null
          created_by?: string | null
          custom_fields_metadata?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          original_id?: string | null
          pricing_rules_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          archived_at?: string | null
          archived_by?: string | null
          bpm_id?: string
          categorical_list_id?: string
          category_value?: string
          created_at?: string | null
          created_by?: string | null
          custom_fields_metadata?: Json | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          original_id?: string | null
          pricing_rules_metadata?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categorical_list_values_history_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "categorical_list_values_history_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "option_set_values"
            referencedColumns: ["id"]
          },
        ]
      }
      privacy_policy: {
        Row: {
          content: string
          id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      provider_assignment_history: {
        Row: {
          assignment_id: string | null
          change_timestamp: string | null
          changed_by: string
          history_id: string
          module_instance_id: string
          new_values: Json | null
          old_values: Json | null
        }
        Insert: {
          assignment_id?: string | null
          change_timestamp?: string | null
          changed_by: string
          history_id?: string
          module_instance_id: string
          new_values?: Json | null
          old_values?: Json | null
        }
        Update: {
          assignment_id?: string | null
          change_timestamp?: string | null
          changed_by?: string
          history_id?: string
          module_instance_id?: string
          new_values?: Json | null
          old_values?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_assignment_history_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "provider_assignments"
            referencedColumns: ["assignment_id"]
          },
        ]
      }
      provider_assignments: {
        Row: {
          assignment_id: string
          availability: Json | null
          created_at: string | null
          module_instance_id: string | null
          provider_id: string
          service_id: string | null
          updated_at: string | null
        }
        Insert: {
          assignment_id?: string
          availability?: Json | null
          created_at?: string | null
          module_instance_id?: string | null
          provider_id: string
          service_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assignment_id?: string
          availability?: Json | null
          created_at?: string | null
          module_instance_id?: string | null
          provider_id?: string
          service_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_assignments_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "provider_assignments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookable_services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      provider_availability: {
        Row: {
          availability_id: string
          bpm_id: string | null
          created_at: string | null
          custom_fields: Json | null
          end_time: string
          module_instance_id: string | null
          provider_id: string
          recurrence_rule: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          availability_id?: string
          bpm_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          end_time: string
          module_instance_id?: string | null
          provider_id: string
          recurrence_rule?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          availability_id?: string
          bpm_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          end_time?: string
          module_instance_id?: string | null
          provider_id?: string
          recurrence_rule?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_availability_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "provider_availability_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "provider_availability_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["provider_id"]
          },
        ]
      }
      provider_compensation: {
        Row: {
          compensation_id: string
          compensation_types: string[] | null
          created_at: string | null
          effective_date: string
          metadata: Json | null
          module_instance_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          compensation_id?: string
          compensation_types?: string[] | null
          created_at?: string | null
          effective_date: string
          metadata?: Json | null
          module_instance_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          compensation_id?: string
          compensation_types?: string[] | null
          created_at?: string | null
          effective_date?: string
          metadata?: Json | null
          module_instance_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_compensation_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "provider_compensation_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      provider_compensation_history: {
        Row: {
          change_type: string | null
          changed_at: string | null
          compensation_id: string | null
          module_instance_id: string
          new_values: Json
          old_values: Json
          provider_compensation_history_id: string
          user_id: string
        }
        Insert: {
          change_type?: string | null
          changed_at?: string | null
          compensation_id?: string | null
          module_instance_id: string
          new_values: Json
          old_values: Json
          provider_compensation_history_id?: string
          user_id: string
        }
        Update: {
          change_type?: string | null
          changed_at?: string | null
          compensation_id?: string | null
          module_instance_id?: string
          new_values?: Json
          old_values?: Json
          provider_compensation_history_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_compensation_history_compensation_id_fkey"
            columns: ["compensation_id"]
            isOneToOne: false
            referencedRelation: "provider_compensation"
            referencedColumns: ["compensation_id"]
          },
          {
            foreignKeyName: "provider_compensation_history_compensation_id_fkey2"
            columns: ["compensation_id"]
            isOneToOne: false
            referencedRelation: "provider_compensation"
            referencedColumns: ["compensation_id"]
          },
          {
            foreignKeyName: "provider_compensation_history_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      provider_credentials: {
        Row: {
          bpm_id: string | null
          created_at: string
          credential_number: string | null
          credential_type_id: string
          custom_fields: Json | null
          document_url: string | null
          expiration_date: string | null
          id: string
          issue_date: string | null
          module_instance_id: string | null
          provider_id: string
          state: string | null
          status: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          bpm_id?: string | null
          created_at?: string
          credential_number?: string | null
          credential_type_id: string
          custom_fields?: Json | null
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          module_instance_id?: string | null
          provider_id: string
          state?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          bpm_id?: string | null
          created_at?: string
          credential_number?: string | null
          credential_type_id?: string
          custom_fields?: Json | null
          document_url?: string | null
          expiration_date?: string | null
          id?: string
          issue_date?: string | null
          module_instance_id?: string | null
          provider_id?: string
          state?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "provider_credentials_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "provider_credentials_credential_type_id_fkey"
            columns: ["credential_type_id"]
            isOneToOne: false
            referencedRelation: "option_set_values"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_credentials_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "provider_credentials_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["provider_id"]
          },
          {
            foreignKeyName: "provider_credentials_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      provider_services: {
        Row: {
          id: string
          provider_id: string
          service_id: string
        }
        Insert: {
          id?: string
          provider_id: string
          service_id: string
        }
        Update: {
          id?: string
          provider_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      providers: {
        Row: {
          bpm_id: string
          created_at: string | null
          created_by: string | null
          custom_fields: Json | null
          email: string | null
          module_instance_id: string
          name: string
          phone: string | null
          provider_id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bpm_id: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          email?: string | null
          module_instance_id: string
          name: string
          phone?: string | null
          provider_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bpm_id?: string
          created_at?: string | null
          created_by?: string | null
          custom_fields?: Json | null
          email?: string | null
          module_instance_id?: string
          name?: string
          phone?: string | null
          provider_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "providers_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "providers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quote_collaboration: {
        Row: {
          action: string | null
          comment: string | null
          created_at: string | null
          id: string
          quote_id: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          quote_id?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          comment?: string | null
          created_at?: string | null
          id?: string
          quote_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_collaboration_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["quote_id"]
          },
          {
            foreignKeyName: "quote_collaboration_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quote_items: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          item_id: string
          item_metadata: Json | null
          quantity: number
          quote_id: string | null
          service_id: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          item_id?: string
          item_metadata?: Json | null
          quantity?: number
          quote_id?: string | null
          service_id?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          item_id?: string
          item_metadata?: Json | null
          quantity?: number
          quote_id?: string | null
          service_id?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["quote_id"]
          },
          {
            foreignKeyName: "quote_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookable_services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string | null
          created_at: string | null
          expiry_date: string | null
          provider_id: string | null
          quote_date: string | null
          quote_id: string
          quote_metadata: Json | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          expiry_date?: string | null
          provider_id?: string | null
          quote_date?: string | null
          quote_id?: string
          quote_metadata?: Json | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          expiry_date?: string | null
          provider_id?: string | null
          quote_date?: string | null
          quote_id?: string
          quote_metadata?: Json | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
        ]
      }
      resource_availability: {
        Row: {
          availability_id: string
          created_at: string | null
          end_time: string
          entity_id: string
          entity_type: string | null
          metadata: Json | null
          module_instance_id: string | null
          recurring_rule: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          availability_id?: string
          created_at?: string | null
          end_time: string
          entity_id: string
          entity_type?: string | null
          metadata?: Json | null
          module_instance_id?: string | null
          recurring_rule?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          availability_id?: string
          created_at?: string | null
          end_time?: string
          entity_id?: string
          entity_type?: string | null
          metadata?: Json | null
          module_instance_id?: string | null
          recurring_rule?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_availability_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      resource_availability_history: {
        Row: {
          availability_id: string | null
          change_timestamp: string | null
          changed_by: string | null
          history_id: string
          module_instance_id: string | null
          new_values: Json | null
          old_values: Json | null
        }
        Insert: {
          availability_id?: string | null
          change_timestamp?: string | null
          changed_by?: string | null
          history_id?: string
          module_instance_id?: string | null
          new_values?: Json | null
          old_values?: Json | null
        }
        Update: {
          availability_id?: string | null
          change_timestamp?: string | null
          changed_by?: string | null
          history_id?: string
          module_instance_id?: string | null
          new_values?: Json | null
          old_values?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_availability_history_availability_id_fkey"
            columns: ["availability_id"]
            isOneToOne: false
            referencedRelation: "resource_availability"
            referencedColumns: ["availability_id"]
          },
        ]
      }
      segments: {
        Row: {
          bpm_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          bpm_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          bpm_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "segments_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
        ]
      }
      service_instances: {
        Row: {
          bpm_id: string | null
          client_id: string | null
          completed_at: string | null
          corporate_client_id: string | null
          created_at: string | null
          custom_fields: Json | null
          inventory_used: Json | null
          invoice_id: string | null
          is_completed: boolean | null
          is_paid: boolean | null
          module_instance_id: string
          notes: string | null
          pricing_metadata: Json | null
          provider_id: string | null
          quote_id: string | null
          scheduled_at: string | null
          service_id: string
          service_instance_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bpm_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          corporate_client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          inventory_used?: Json | null
          invoice_id?: string | null
          is_completed?: boolean | null
          is_paid?: boolean | null
          module_instance_id: string
          notes?: string | null
          pricing_metadata?: Json | null
          provider_id?: string | null
          quote_id?: string | null
          scheduled_at?: string | null
          service_id: string
          service_instance_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bpm_id?: string | null
          client_id?: string | null
          completed_at?: string | null
          corporate_client_id?: string | null
          created_at?: string | null
          custom_fields?: Json | null
          inventory_used?: Json | null
          invoice_id?: string | null
          is_completed?: boolean | null
          is_paid?: boolean | null
          module_instance_id?: string
          notes?: string | null
          pricing_metadata?: Json | null
          provider_id?: string | null
          quote_id?: string | null
          scheduled_at?: string | null
          service_id?: string
          service_instance_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_instances_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "service_instances_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "service_instances_Corporate Client ID_fkey"
            columns: ["corporate_client_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "service_instances_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "service_instances_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "service_instances_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["provider_id"]
          },
          {
            foreignKeyName: "service_instances_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["quote_id"]
          },
          {
            foreignKeyName: "service_instances_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "bookable_services"
            referencedColumns: ["service_id"]
          },
        ]
      }
      service_instances_history: {
        Row: {
          action: string
          changes: Json | null
          created_at: string | null
          id: string
          new_values: Json | null
          old_values: Json | null
          service_instance_id: string | null
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          service_instance_id?: string | null
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string | null
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          service_instance_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_instances_history_service_instance_id_fkey"
            columns: ["service_instance_id"]
            isOneToOne: false
            referencedRelation: "service_instances"
            referencedColumns: ["service_instance_id"]
          },
        ]
      }
      task_list: {
        Row: {
          bpm_id: string | null
          created_at: string | null
          created_by: string | null
          estimated_impact: string | null
          franchise_location_id: string | null
          id: string
          is_completed: boolean
          module_instance_id: string
          parent_task: string | null
          task_detail: string | null
          task_detail_json: Json | null
          task_title: string
          task_type: string
          updated_at: string | null
          updated_by: string | null
          urgency: string | null
        }
        Insert: {
          bpm_id?: string | null
          created_at?: string | null
          created_by?: string | null
          estimated_impact?: string | null
          franchise_location_id?: string | null
          id?: string
          is_completed: boolean
          module_instance_id: string
          parent_task?: string | null
          task_detail?: string | null
          task_detail_json?: Json | null
          task_title: string
          task_type: string
          updated_at?: string | null
          updated_by?: string | null
          urgency?: string | null
        }
        Update: {
          bpm_id?: string | null
          created_at?: string | null
          created_by?: string | null
          estimated_impact?: string | null
          franchise_location_id?: string | null
          id?: string
          is_completed?: boolean
          module_instance_id?: string
          parent_task?: string | null
          task_detail?: string | null
          task_detail_json?: Json | null
          task_title?: string
          task_type?: string
          updated_at?: string | null
          updated_by?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_list_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "task_list_franchise_location_id_fkey"
            columns: ["franchise_location_id"]
            isOneToOne: false
            referencedRelation: "franchise_locations"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "task_list_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
          {
            foreignKeyName: "task_list_parent_task_fkey"
            columns: ["parent_task"]
            isOneToOne: false
            referencedRelation: "task_list"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_of_service: {
        Row: {
          content: string
          created_at: string
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      user_permission_overrides: {
        Row: {
          action: string
          bpm_id: string
          created_at: string | null
          created_by: string | null
          granted: boolean
          module_instance_id: string
          override_id: string
          user_id: string
        }
        Insert: {
          action: string
          bpm_id: string
          created_at?: string | null
          created_by?: string | null
          granted?: boolean
          module_instance_id: string
          override_id?: string
          user_id: string
        }
        Update: {
          action?: string
          bpm_id?: string
          created_at?: string | null
          created_by?: string | null
          granted?: boolean
          module_instance_id?: string
          override_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permission_overrides_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "user_permission_overrides_module_instance_id_fkey"
            columns: ["module_instance_id"]
            isOneToOne: false
            referencedRelation: "bpm_module_instances"
            referencedColumns: ["module_instance_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          bpm_id: string | null
          created_at: string | null
          role: string
          user_id: string
          user_role_id: string
        }
        Insert: {
          bpm_id?: string | null
          created_at?: string | null
          role: string
          user_id: string
          user_role_id?: string
        }
        Update: {
          bpm_id?: string | null
          created_at?: string | null
          role?: string
          user_id?: string
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_bpm_id_fkey"
            columns: ["bpm_id"]
            isOneToOne: false
            referencedRelation: "bpm_instances"
            referencedColumns: ["bpm_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_segments: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_admin: boolean
          segment_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_admin?: boolean
          segment_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_admin?: boolean
          segment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_segments_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          is_active: boolean | null
          is_super_admin: boolean | null
          last_login: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          is_active?: boolean | null
          is_super_admin?: boolean | null
          last_login?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          is_active?: boolean | null
          is_super_admin?: boolean | null
          last_login?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_bpm: {
        Args: { _bpm: string }
        Returns: boolean
      }
      can_user_read: {
        Args: { p_table: string; p_id: string }
        Returns: boolean
      }
      check_module_permission: {
        Args: {
          _user_id: string
          _bpm_id: string
          _module_instance_id: string
          _action: string
        }
        Returns: boolean
      }
      check_module_permission_with_conditions: {
        Args: {
          _user_id: string
          _bpm_id: string
          _module_instance_id: string
          _action: string
          _entity_data?: Json
        }
        Returns: boolean
      }
      check_module_permission_with_segment: {
        Args: {
          _user_id: string
          _bpm_id: string
          _module_instance_id: string
          _action: string
          _segment_id?: string
        }
        Returns: boolean
      }
      decrypt_access_token: {
        Args: { encrypted_token: string }
        Returns: string
      }
      encrypt_access_token: {
        Args: { token: string }
        Returns: string
      }
      evaluate_permission_conditions: {
        Args: {
          p_conditions: Json
          p_row: Record<string, unknown>
          p_entity_data?: Json
        }
        Returns: boolean
      }
      get_primary_key_column: {
        Args: { table_name: string }
        Returns: string
      }
      get_terms_of_service: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_segment_access: {
        Args: { segment_id: string }
        Returns: boolean
      }
      read_permission: {
        Args: { module_name: string }
        Returns: boolean
      }
      set_carmen_roles: {
        Args: { p_bpm_override?: string }
        Returns: undefined
      }
      update_permission: {
        Args: { module_name: string }
        Returns: boolean
      }
      update_terms_of_service: {
        Args: { new_content: string; terms_id: string }
        Returns: undefined
      }
      user_has_segment_access: {
        Args: { _user_id: string; _segment_id: string }
        Returns: boolean
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
