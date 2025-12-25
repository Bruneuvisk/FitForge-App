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
      profiles: {
        Row: {
          id: string
          role: 'trainer' | 'client'
          full_name: string
          email: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'trainer' | 'client'
          full_name: string
          email: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'trainer' | 'client'
          full_name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          user_id: string | null
          trainer_id: string
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | null
          height: number
          current_weight: number
          goal_weight: number | null
          fitness_goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_endurance'
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
          medical_conditions: string | null
          dietary_restrictions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          trainer_id: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          height: number
          current_weight: number
          goal_weight?: number | null
          fitness_goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_endurance'
          activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
          medical_conditions?: string | null
          dietary_restrictions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          trainer_id?: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | null
          height?: number
          current_weight?: number
          goal_weight?: number | null
          fitness_goal?: 'lose_weight' | 'gain_muscle' | 'maintain' | 'improve_endurance'
          activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
          medical_conditions?: string | null
          dietary_restrictions?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      measurements: {
        Row: {
          id: string
          client_id: string
          weight: number
          body_fat_percentage: number | null
          chest: number | null
          waist: number | null
          hips: number | null
          arms: number | null
          thighs: number | null
          notes: string | null
          measured_at: string
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          weight: number
          body_fat_percentage?: number | null
          chest?: number | null
          waist?: number | null
          hips?: number | null
          arms?: number | null
          thighs?: number | null
          notes?: string | null
          measured_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          weight?: number
          body_fat_percentage?: number | null
          chest?: number | null
          waist?: number | null
          hips?: number | null
          arms?: number | null
          thighs?: number | null
          notes?: string | null
          measured_at?: string
          created_at?: string
        }
      }
      workouts: {
        Row: {
          id: string
          client_id: string
          trainer_id: string
          name: string
          description: string | null
          goal: string
          duration_weeks: number
          ai_generated: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          trainer_id: string
          name: string
          description?: string | null
          goal: string
          duration_weeks?: number
          ai_generated?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          trainer_id?: string
          name?: string
          description?: string | null
          goal?: string
          duration_weeks?: number
          ai_generated?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          workout_id: string
          day_of_week: number
          exercise_name: string
          sets: number
          reps: string
          rest_seconds: number
          notes: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          day_of_week: number
          exercise_name: string
          sets: number
          reps: string
          rest_seconds?: number
          notes?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          day_of_week?: number
          exercise_name?: string
          sets?: number
          reps?: string
          rest_seconds?: number
          notes?: string | null
          order_index?: number
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          client_id: string
          trainer_id: string
          name: string
          description: string | null
          daily_calories: number
          protein_grams: number
          carbs_grams: number
          fats_grams: number
          ai_generated: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          trainer_id: string
          name: string
          description?: string | null
          daily_calories: number
          protein_grams: number
          carbs_grams: number
          fats_grams: number
          ai_generated?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          trainer_id?: string
          name?: string
          description?: string | null
          daily_calories?: number
          protein_grams?: number
          carbs_grams?: number
          fats_grams?: number
          ai_generated?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      meals: {
        Row: {
          id: string
          meal_plan_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          name: string
          description: string | null
          calories: number
          protein_grams: number
          carbs_grams: number
          fats_grams: number
          ingredients: string
          instructions: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          name: string
          description?: string | null
          calories: number
          protein_grams: number
          carbs_grams: number
          fats_grams: number
          ingredients: string
          instructions?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          name?: string
          description?: string | null
          calories?: number
          protein_grams?: number
          carbs_grams?: number
          fats_grams?: number
          ingredients?: string
          instructions?: string | null
          order_index?: number
          created_at?: string
        }
      }
    }
  }
}
