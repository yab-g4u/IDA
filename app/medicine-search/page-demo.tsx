"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import AuthModal from "@/components/auth-modal"
import { useLanguage } from "@/contexts/language-context"

// This is a simplified version just to demonstrate the auth modal
export default function MedicineSearchDemo() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    // Always show auth modal for demo purposes
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    alert("Authentication successful! You would now see medicine information.")
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{t("medicineInformation")}</h1>
          <p className="mt-3 text-muted-foreground">{t("searchForMedicine")}</p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto mb-8 gap-2">
          <Input
            type="text"
            placeholder={t("enterMedicineName")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            {t("search")}
          </Button>
        </form>

        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">{t("noMedicineInfo")}</h3>
          <p className="text-muted-foreground">{t("searchForMedicine")}</p>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}
