"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthModal from "@/components/auth-modal"

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // If user is already logged in, redirect to medicine search
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      router.push("/medicine-search")
    }
  }, [router])

  const handleAuthSuccess = () => {
    router.push("/medicine-search")
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <AuthModal isOpen={true} onClose={() => router.push("/")} onSuccess={handleAuthSuccess} />
    </div>
  )
}

