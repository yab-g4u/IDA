"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import AuthModal from "@/components/auth-modal"
import { supabase } from "@/lib/supabase-client"
import LoadingSpinner from "@/components/loading-spinner"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for error in URL
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(
        errorParam === "session_exchange"
          ? "Failed to complete authentication. Please try again."
          : "Authentication error. Please try again.",
      )
    }

    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("User already logged in, redirecting to medicine search")
          // User is already logged in, redirect to medicine search
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userId", session.user.id)

          // Use replace instead of push for a cleaner navigation experience
          router.replace("/medicine-search")
        } else {
          console.log("No active session, showing login modal")
          // No session, show login modal
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, searchParams])

  const handleAuthSuccess = () => {
    console.log("Auth success, redirecting to medicine search")
    router.replace("/medicine-search")
  }

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      {error && (
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-md mb-4 absolute top-20">
          <p>{error}</p>
        </div>
      )}
      <AuthModal isOpen={true} onClose={() => router.push("/")} onSuccess={handleAuthSuccess} />
    </div>
  )
}
