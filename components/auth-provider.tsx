"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

type AuthContextType = {
  user: any | null
  isLoading: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
  redirectToProtectedPage: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signOut: async () => {},
  redirectToProtectedPage: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Function to redirect to protected page
  const redirectToProtectedPage = () => {
    console.log("Redirecting to protected page")
    // Use replace instead of push for a cleaner navigation experience
    router.replace("/medicine-search")
  }

  // Check authentication on initial load
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        setIsLoading(true)

        // First check localStorage for a quick check
        if (typeof window !== "undefined") {
          const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true"
          const storedUserId = localStorage.getItem("userId")

          if (storedIsLoggedIn && storedUserId) {
            console.log("User is logged in according to localStorage")
            setUser({ id: storedUserId })
            setIsAuthenticated(true)
            setIsLoading(false)
            return
          }
        }

        // Check for session in Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("Session found:", session.user.id)
          setUser(session.user)
          setIsAuthenticated(true)

          // Store in localStorage for quicker access next time
          if (typeof window !== "undefined") {
            localStorage.setItem("isLoggedIn", "true")
            localStorage.setItem("userId", session.user.id)
          }
        } else {
          // Clear localStorage if no session exists
          if (typeof window !== "undefined") {
            localStorage.removeItem("isLoggedIn")
            localStorage.removeItem("userId")
          }
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error checking auth state:", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (session) {
        setUser(session.user)
        setIsAuthenticated(true)

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userId", session.user.id)
        }

        // If user just signed in or up, redirect to protected page
        if (event === "SIGNED_IN" || event === "SIGNED_UP") {
          // Use a small timeout to ensure state is updated before redirect
          setTimeout(() => {
            redirectToProtectedPage()
          }, 100)
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("isLoggedIn")
          localStorage.removeItem("userId")
        }

        // If user just signed out, redirect to home
        if (event === "SIGNED_OUT") {
          router.push("/")
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userId")
      }

      setUser(null)
      setIsAuthenticated(false)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, signOut, redirectToProtectedPage }}>
      {children}
    </AuthContext.Provider>
  )
}

