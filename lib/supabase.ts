import { createClient } from "@supabase/supabase-js"

// Use the provided credentials
const SUPABASE_URL = "https://fbdxzqfgzsnuwuqwixqm.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZHh6cWZnenNudXd1cXdpeHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTA3NDMsImV4cCI6MjA1NDc2Njc0M30.z1as2kdf4fOt_lpfsebP-KSTOMeHTtnNDmNswvPzYJw"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Authentication functions
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error("Sign up error:", error.message)
    throw error
  }

  if (!data.user) {
    throw new Error("No user returned after sign up")
  }

  // Create a user profile record if needed
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

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error.message)
    throw error
  }

  if (!data.user) {
    throw new Error("No user returned after sign in")
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

// Search history functions
export async function saveSearchHistory(userId: string, query: string, type: "medicine" | "pharmacy") {
  const { data, error } = await supabase.from("search_history").insert({
    user_id: userId,
    query,
    type,
    searched_at: new Date().toISOString(),
  })

  if (error) throw error
  return data
}

export async function getSearchHistory(userId: string, type: "medicine" | "pharmacy", limit = 5) {
  const { data, error } = await supabase
    .from("search_history")
    .select("*")
    .eq("user_id", userId)
    .eq("type", type)
    .order("searched_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

