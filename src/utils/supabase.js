import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  (import.meta.env.VITE_SUPABASE_URL = 'https://qfioodapwzjdgphbgwkz.supabase.co'),
  (import.meta.env.VITE_SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmaW9vZGFwd3pqZGdwaGJnd2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3Nzk3MzYsImV4cCI6MjA1ODM1NTczNn0.OW1agtY2gRHNtGWUhnedXL7yRpykYG59p0bVB5kzAgk'),
)

//Form Action Utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: '',
}
