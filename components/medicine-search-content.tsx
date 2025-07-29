"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Pill, AlertTriangle, Info, Clock, Shield, X, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { MedicineChatbot } from "./medicine-chatbot"
import { AutoSuggestion } from "./auto-suggestion"
import { useAuth } from "@/hooks/use-auth"
import { saveSearchHistory } from "@/lib/supabase-client"

interface MedicineInfo {
  name: string
  information: string
  success: boolean
}

export function MedicineSearchContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showChatbot, setShowChatbot] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const { language, translations } = useLanguage()
  const { user } = useAuth()

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    setIsSearching(true)
    setError(null)
    setMedicineInfo(null)
    setShowChatbot(false)

    try {
      // Save search history if user is logged in
      if (user) {
        try {
          await saveSearchHistory(user.id, searchTerm, "medicine")
        } catch (historyError) {
          console.error("Failed to save search history:", historyError)
        }
      }

      const response = await fetch("/api/medicine-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicineName: searchTerm }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch medicine information")
      }

      const data = await response.json()

      if (data.success) {
        setMedicineInfo({
          name: searchTerm,
          information: data.information,
          success: true,
        })
      } else {
        setError(data.error || "Failed to get medicine information")
      }
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to search for medicine information. Please try again.")
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setMedicineInfo(null)
    setError(null)
    setShowChatbot(false)
  }

  const searchAnother = () => {
    setSearchTerm("")
    setMedicineInfo(null)
    setError(null)
    setShowChatbot(false)
  }

  const formatMedicineInfo = (info: string) => {
    const sections = info.split("\n\n")
    return sections.map((section, index) => {
      if (section.includes(":")) {
        const [title, ...content] = section.split(":")
        return (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              {getIconForSection(title.trim())}
              {title.trim()}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{content.join(":").trim()}</p>
          </div>
        )
      }
      return (
        <p key={index} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          {section}
        </p>
      )
    })
  }

  const getIconForSection = (title: string) => {
    const lowerTitle = title.toLowerCase()
    if (lowerTitle.includes("dosage") || lowerTitle.includes("dose")) return <Pill className="w-5 h-5 text-blue-500" />
    if (lowerTitle.includes("side effects") || lowerTitle.includes("adverse"))
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    if (lowerTitle.includes("warning") || lowerTitle.includes("contraindication"))
      return <Shield className="w-5 h-5 text-red-500" />
    if (lowerTitle.includes("storage") || lowerTitle.includes("store"))
      return <Clock className="w-5 h-5 text-green-500" />
    return <Info className="w-5 h-5 text-gray-500" />
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {translations.medicineSearch}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">{translations.medicineSearchDescription}</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder={translations.enterMedicineName}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className={`w-full pl-12 pr-12 py-4 text-lg rounded-xl border-2 transition-all duration-300 ${
                isSearching
                  ? "border-blue-400 shadow-lg animate-pulse"
                  : "border-gray-300 hover:border-blue-400 focus:border-blue-500"
              }`}
              disabled={isLoading}
            />
            <Search
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isSearching ? "text-blue-500 animate-pulse" : "text-gray-400"
              }`}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <AutoSuggestion searchTerm={searchTerm} onSuggestionClick={setSearchTerm} className="mt-2" />

          <div className="flex gap-4 mt-4 justify-center">
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchTerm.trim()}
              className="px-8 py-3 text-lg rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {translations.searching}
                </>
              ) : (
                <>
                  <Search className="mr-2 h-5 w-5" />
                  {translations.search}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {medicineInfo && (
        <div className="space-y-6">
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Pill className="w-8 h-8 text-blue-600" />
                    {medicineInfo.name}
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">{translations.medicineInformation}</CardDescription>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  {translations.verified}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose max-w-none dark:prose-invert">{formatMedicineInfo(medicineInfo.information)}</div>

              <div className="flex gap-4 mt-8 pt-6 border-t">
                <Button onClick={() => setShowChatbot(!showChatbot)} variant="outline" className="flex-1">
                  {showChatbot ? "Hide Chat" : "Ask Questions"}
                </Button>
                <Button
                  onClick={searchAnother}
                  variant="default"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Search Another Medicine
                </Button>
              </div>
            </CardContent>
          </Card>

          {showChatbot && (
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-6 h-6 text-purple-600" />
                  Ask Questions About {medicineInfo.name}
                </CardTitle>
                <CardDescription>Get more specific information about this medicine</CardDescription>
              </CardHeader>
              <CardContent>
                <MedicineChatbot medicineName={medicineInfo.name} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
