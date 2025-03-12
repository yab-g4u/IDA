import { supabase, getCurrentUser } from "./supabase"

// Check if user is authenticated
export async function checkAuth() {
  try {
    // First check localStorage for quick access
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    const userId = localStorage.getItem("userId")

    if (isLoggedIn && userId) {
      // Verify with Supabase that session is still valid
      const user = await getCurrentUser()
      if (user) {
        return { isAuthenticated: true, userId: user.id }
      }
    }

    // If localStorage check fails, try to get session from Supabase
    const user = await getCurrentUser()
    if (user) {
      // Update localStorage
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userId", user.id)
      return { isAuthenticated: true, userId: user.id }
    }

    // No valid session found
    return { isAuthenticated: false, userId: null }
  } catch (error) {
    console.error("Auth check error:", error)
    return { isAuthenticated: false, userId: null }
  }
}

// Handle logout
export async function handleLogout() {
  try {
    await supabase.auth.signOut()
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userId")
    return true
  } catch (error) {
    console.error("Logout error:", error)
    return false
  }
}

// Set up auth state change listener
export function setupAuthListener(callback: (isAuthenticated: boolean) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userId", session.user.id)
      callback(true)
    } else if (event === "SIGNED_OUT") {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userId")
      callback(false)
    }
  })
}

