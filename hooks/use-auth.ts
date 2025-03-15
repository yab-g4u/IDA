"use client"

import { useEffect, useState } from "react"
import { supabase, getCurrentUser, loginUser, signUpUser, logoutUser } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true)
        const currentUser = await getCurrentUser()
        setUser(currentUser)

        if (currentUser) {
          // Store user info in localStorage for persistence
          localStorage.setItem("userId", currentUser.id)
          localStorage.setItem("isLoggedIn", "true")
        } else {
          // Clear localStorage if no user
          localStorage.removeItem("userId")
          localStorage.removeItem("isLoggedIn")
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user || null
      setUser(user)

      if (user) {
        localStorage.setItem("userId", user.id)
        localStorage.setItem("isLoggedIn", "true")
      } else {
        localStorage.removeItem("userId")
        localStorage.removeItem("isLoggedIn")
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  const login = async (email: string, password: string) => {
    try {
      const { user } = await loginUser(email, password)
      return user
    } catch (error) {
      throw error
    }
  }

  const signup = async (email: string, password: string) => {
    try {
      const { user } = await signUpUser(email, password)
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return { user, loading, login, signup, logout }
}

