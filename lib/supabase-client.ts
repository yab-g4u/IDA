import { createClient } from "@supabase/supabase-js"

// Use the provided credentials
const supabaseUrl = "https://fbdxzqfgzsnuwuqwixqm.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZHh6cWZnenNudXd1cXdpeHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTA3NDMsImV4cCI6MjA1NDc2Njc0M30.z1as2kdf4fOt_lpfsebP-KSTOMeHTtnNDmNswvPzYJw"

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Authentication functions
export const signUpUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Signup Error:", error.message)
    throw error
  }

  // Create a user profile record if needed
  if (data.user) {
    try {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email,
        created_at: new Date().toISOString(),
      })
    } catch (profileError) {
      console.error("Error creating profile:", profileError)
      // Continue even if profile creation fails
    }
  }

  return data
}

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error("Login Error:", error.message)
    throw error
  }
  return data
}

export const getCurrentUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Search history functions
export const saveSearchHistory = async (
  userId: string,
  medicineName: string,
  searchType: "medicine" | "pharmacy" = "medicine",
) => {
  const { data, error } = await supabase.from("search_history").insert([
    {
      user_id: userId,
      query: medicineName,
      type: searchType,
      searched_at: new Date().toISOString(),
    },
  ])

  if (error) {
    console.error("Error saving search history:", error.message)
    throw error
  }
  return data
}

export const getSearchHistory = async (userId: string, searchType: "medicine" | "pharmacy" = "medicine", limit = 5) => {
  const { data, error } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", userId)
    .eq("type", searchType)
    .order("searched_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error retrieving search history:", error.message)
    throw error
  }
  return data
}

