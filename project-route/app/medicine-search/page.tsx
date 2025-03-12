"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MedicineSearchContent from "@/components/medicine-search-content"
import { checkAuth } from "@/lib/auth-utils"
import LoadingSpinner from "@/components/loading-spinner"

export default function MedicineSearchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const { isAuthenticated } = await checkAuth()
        if (!isAuthenticated) {
          router.push("/auth")
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Authentication check failed:", error instanceof Error ? error.message : String(error))
        router.push("/auth")
      }
    }

    verifyAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    )
  }

  return <MedicineSearchContent />
}

