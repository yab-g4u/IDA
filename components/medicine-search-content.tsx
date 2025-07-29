"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Search, MapPin, X, MessageCircle, RotateCcw } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import AutoSuggestion from "./auto-suggestion"
import LoadingSpinner from "./loading-spinner"
import MedicineChatbot from "./medicine-chatbot"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

// Default translations in case the context fails
const defaultTranslations = {
  medicineSearchTitle: "Medicine Information Search",
  medicineSearchDescription: "Search for detailed information about medicines, their uses, side effects, and more.",
  searchMedicinePlaceholder: "Enter medicine name",
  search: "Search",
  errorOccurred: "An Error Occurred",
  description: "Description",
  usageInstructions: "Usage Instructions",
  sideEffects: "Side Effects",
  warnings: "Warnings",
  interactions: "Interactions",
  storageInstructions: "Storage Instructions",
  dosageInfo: "Dosage Information",
  ageGroup: "Age Group",
  dosage: "Dosage",
  frequency: "Frequency",
  showLess: "Show Less",
  showMore: "Show More",
  askAboutMedicine: "Ask About This Medicine",
  askAboutMedicineDescription: "Have a question about this medicine? Ask our AI assistant.",
  yourQuestion: "Your Question",
  questionPlaceholder: "e.g., Can I take this medicine with food?",
  submit: "Submit",
  findPharmacies: "Find Pharmacies",
  noMedicineInfo: "No medicine information found",
  enterMedicineName: "Enter a medicine name to search",
  searching: "Searching...",
  translating: "Translating to Amharic...",
  searchAnother: "Search Another Medicine",
}

interface MedicineInfo {
  name: string
  information: string
  success: boolean
}

export default function MedicineSearchContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null)
  const [medicine, setMedicine] = useState<MedicineInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [isTranslated, setIsTranslated] = useState(false)
  const [originalContent, setOriginalContent] = useState<MedicineInfo | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const languageContext = useLanguage()
  const { toast } = useToast()
  const { user } = useAuth()
  const resultRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showClearButton, setShowClearButton] = useState(false)
  const [initialQueryProcessed, setInitialQueryProcessed] = useState(false)

  // Safe translation function that falls back to defaults
  const t = (key: string) => {
    if (languageContext && typeof languageContext.t === "function") {
      const translated = languageContext.t(key)
      // If translation returns the key itself, use default
      return translated === key ? defaultTranslations[key as keyof typeof defaultTranslations] || key : translated
    }
    return defaultTranslations[key as keyof typeof defaultTranslations] || key
  }

  // Safe language and setLanguage
  const language = languageContext?.language || "en"
  const setLanguage = languageContext?.setLanguage || (() => {})

  // Handle initial query from URL
  useEffect(() => {
    const query = searchParams.get("q")
    if (query && !initialQueryProcessed) {
      setSearchTerm(query)
      setShowClearButton(true)
      setInitialQueryProcessed(true)

      // Perform the search
      handleSearch(query)
    }
  }, [searchParams, initialQueryProcessed])

  const clearSearch = () => {
    setSearchTerm("")
    setMedicine(null)
    setError(null)
    setIsTranslated(false)
    setShowClearButton(false)
    setShowChatbot(false)
    setShowDetails(false)
    // Clear the URL query parameter
    router.push("/medicine-search")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const startNewSearch = () => {
    setMedicine(null)
    setError(null)
    setIsTranslated(false)
    setShowChatbot(false)
    setShowDetails(false)
    setSearchTerm("")
    setShowClearButton(false)
    router.push("/medicine-search")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Function to fetch medicine information from server-side API
  const fetchMedicineInfo = async (medicineName: string): Promise<MedicineInfo> => {
    const response = await fetch("/api/medicine-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ medicineName }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to fetch medicine information")
    }

    const data = await response.json()
    return {
      name: medicineName,
      information: data.information,
      success: data.success,
    }
  }

  const handleSearch = async (term: string = searchTerm) => {
    if (!term.trim()) {
      setError("Please enter a medicine name")
      return
    }

    setIsLoading(true)
    setIsSearching(true)
    setSearchStartTime(Date.now())
    setError(null)
    setIsTranslated(false)

    try {
      // Add a pulse animation to the search input
      if (inputRef.current) {
        inputRef.current.classList.add("animate-pulse")
      }

      const data = await fetchMedicineInfo(term)
      const currentTime = Date.now()
      const elapsedTime = currentTime - (searchStartTime || currentTime)

      // If search was too fast, add a small delay for better UX
      if (elapsedTime < 1500) {
        await new Promise((resolve) => setTimeout(resolve, 1500 - elapsedTime))
      }

      // Remove animation from search input
      if (inputRef.current) {
        inputRef.current.classList.remove("animate-pulse")
      }

      if (data.success) {
        setMedicine(data)
        setOriginalContent(data) // Store original content for translation

        // Scroll to results
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)
      } else {
        setError(`Medicine "${term}" not found. Please check the spelling or try a different medicine name.`)
        setMedicine(null)
      }
    } catch (error) {
      console.error("Error fetching medicine info:", error)
      setError("Failed to fetch medicine information. Please check your internet connection and try again.")
      setMedicine(null)
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setShowClearButton(!!value.trim())
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (searchTerm.trim()) {
        router.push(`/medicine-search?q=${encodeURIComponent(searchTerm)}`)
      } else {
        setError("Please enter a medicine name")
      }
    }
  }

  const formatMedicineInfo = (info: string) => {
    const sections = info.split("\n\n")
    return sections.map((section, index) => {
      if (section.includes(":")) {
        const [title, ...content] = section.split(":")
        return (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-lg mb-2">{title.trim()}</h3>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{t("medicineSearchTitle")}</h1>
        <p className="mt-4 text-muted-foreground">{t("medicineSearchDescription")}</p>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (searchTerm.trim()) {
              router.push(`/medicine-search?q=${encodeURIComponent(searchTerm)}`)
              setShowClearButton(true)
            } else {
              setError("Please enter a medicine name")
            }
          }}
          className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0"
        >
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("searchMedicinePlaceholder")}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="pr-10"
              autoComplete="off"
            />
            {showClearButton && searchTerm.trim() !== "" && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-10 top-0 h-full"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
            {searchTerm.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full z-10 mt-1">
                <AutoSuggestion
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onSelect={(term) => {
                    router.push(`/medicine-search?q=${encodeURIComponent(term)}`)
                    setShowClearButton(true)
                  }}
                />
              </div>
            )}
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("searching")}
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                {t("search")}
              </>
            )}
          </Button>
        </form>
      </div>

      {isSearching && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg animate-pulse">{t("searching")}</p>
        </div>
      )}

      {error && !isSearching && (
        <Card className="mx-auto mt-12 max-w-3xl border-destructive/50 bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-center text-destructive">{t("errorOccurred")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={startNewSearch} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Another Search
            </Button>
          </CardFooter>
        </Card>
      )}

      {medicine && !isSearching && (
        <div ref={resultRef} className="mt-12 animate-fadeIn">
          {/* Search Another Medicine Button */}
          <div className="mx-auto max-w-4xl mb-6">
            <Button onClick={startNewSearch} variant="outline" className="w-full sm:w-auto bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t("searchAnother")}
            </Button>
          </div>

          <Card className="mx-auto max-w-4xl">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{medicine.name}</CardTitle>
                <CardDescription className="mt-2">Medicine Information</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowChatbot(!showChatbot)}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {showChatbot ? "Hide Chat" : "Ask Questions"}
                </Button>
                <Link href={`/pharmacy-finder?medicine=${encodeURIComponent(medicine.name)}`}>
                  <Button variant="outline" size="sm">
                    <MapPin className="mr-2 h-4 w-4" />
                    {t("findPharmacies")}
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none dark:prose-invert">{formatMedicineInfo(medicine.information)}</div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-4">
              <Button variant="outline" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? t("showLess") : t("showMore")}
              </Button>
            </CardFooter>
          </Card>

          {/* Chatbot Section */}
          {showChatbot && (
            <div className="mx-auto mt-8 max-w-4xl">
              <MedicineChatbot medicineName={medicine.name} />
            </div>
          )}
        </div>
      )}

      {!medicine && !error && !isLoading && !isSearching && (
        <div className="text-center py-16 bg-muted/30 rounded-lg max-w-4xl mx-auto mt-12">
          <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">{t("noMedicineInfo")}</h3>
          <p className="text-muted-foreground">{t("enterMedicineName")}</p>
        </div>
      )}
    </div>
  )
}
