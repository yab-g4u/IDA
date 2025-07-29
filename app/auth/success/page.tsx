"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/components/loading-spinner"
import { supabase } from "@/lib/supabase-client"

export default function AuthSuccessPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const [message, setMessage] = useState("Authentication successful! Redirecting...")

  useEffect(() => {
    const handleAuthRedirect = async () => {
      try {
        setMessage("Verifying your authentication...")

        // Get the URL hash for OAuth response
        const hash = window.location.hash

        if (hash) {
          // Handle OAuth response
          setMessage("Processing OAuth response...")
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Auth error:", error)
            setError("Authentication failed. Please try again.")
            setIsProcessing(false)
            return
          }

          if (data.session) {
            // Store authentication data in localStorage
            if (typeof window !== "undefined") {
              localStorage.setItem("isLoggedIn", "true")
              localStorage.setItem("userId", data.session.user.id)
              setMessage("Authentication successful! Redirecting to medicine search...")
            }

            // Redirect after a short delay
            setTimeout(() => {
              router.push("/medicine-search")
            }, 1000)
          } else {
            setError("No session found. Please try logging in again.")
            setIsProcessing(false)
          }
        } else {
          // Check if we have a code in the URL (for OAuth)
          const urlParams = new URLSearchParams(window.location.search)
          const code = urlParams.get("code")

          if (code) {
            // Exchange the code for a session
            setMessage("Processing authentication code...")
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code)

              if (error) {
                console.error("Error exchanging code for session:", error)
                setError("Authentication failed. Please try again.")
                setIsProcessing(false)
                return
              }

              if (data.session) {
                // Store authentication data in localStorage
                if (typeof window !== "undefined") {
                  localStorage.setItem("isLoggedIn", "true")
                  localStorage.setItem("userId", data.session.user.id)
                  setMessage("Authentication successful! Redirecting to medicine search...")
                }

                // Redirect after a short delay
                setTimeout(() => {
                  router.push("/medicine-search")
                }, 1000)
              } else {
                setError("No session found. Please try logging in again.")
                setIsProcessing(false)
              }
            } catch (exchangeError) {
              console.error("Error in code exchange:", exchangeError)
              setError("Failed to complete authentication. Please try again.")
              setIsProcessing(false)
            }
          } else {
            setError("Authentication parameters not found. Please try logging in again.")
            setIsProcessing(false)
          }
        }
      } catch (error) {
        console.error("Error handling auth redirect:", error)
        setError("Failed to complete authentication. Please try again.")
        setIsProcessing(false)
      }
    }

    // Add a small delay to ensure the page has fully loaded
    setTimeout(() => {
      handleAuthRedirect()
    }, 500)
  }, [router])

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <div className="bg-destructive/10 text-destructive px-6 py-4 rounded-md mb-4">
          <p>{error}</p>
        </div>
        <button onClick={() => router.push("/auth")} className="px-4 py-2 bg-primary text-white rounded-md">
          Return to Login
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-lg">{message}</p>
    </div>
  )
}
