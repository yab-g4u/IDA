"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Pill, AlertCircle, Clock, History } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import LoadingSpinner from "@/components/loading-spinner"
import { ethiopianMedicines, filterSuggestions } from "@/lib/ethiopia-data"

export default function MedicineSearchContent() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [medicineData, setMedicineData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [medicineSuggestions, setMedicineSuggestions] = useState<string[]>([])

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        setIsAuthenticated(!!session)

        if (session?.user) {
          setUserId(session.user.id)
          fetchSearchHistory(session.user.id)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
      if (session?.user) {
        setUserId(session.user.id)
        fetchSearchHistory(session.user.id)
      } else {
        setUserId(null)
        setSearchHistory([])
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Update suggestions when input changes
  useEffect(() => {
    setMedicineSuggestions(filterSuggestions(query, ethiopianMedicines))
  }, [query])

  const fetchSearchHistory = async (userId: string) => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from("search_history")
        .select("query")
        .eq("user_id", userId)
        .eq("type", "medicine")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      if (data && Array.isArray(data)) {
        setSearchHistory(data.map((item) => item.query))
      } else {
        setSearchHistory([])
      }
    } catch (error) {
      console.error("Error fetching search history:", error)
      setSearchHistory([])
    }
  }

  const saveSearchToHistory = async (searchQuery: string) => {
    if (!isAuthenticated || !userId) return

    try {
      const { error } = await supabase.from("search_history").insert([{
        user_id: userId,
        query: searchQuery,
        type: "medicine",
        created_at: new Date().toISOString(),
      }])

      if (error) throw error

      // Update local history state
      setSearchHistory((prev) => [searchQuery, ...prev.filter((q) => q !== searchQuery)].slice(0, 10))
    } catch (error) {
      console.error("Error saving search history:", error)
    }
  }

  const clearSearchHistory = async () => {
    if (!isAuthenticated || !userId) return

    try {
      const { error } = await supabase.from("search_history").delete().eq("user_id", userId)

      if (error) throw error

      setSearchHistory([])
      toast({
        title: "Search history cleared",
        description: "Your search history has been successfully cleared.",
      })
    } catch (error) {
      console.error("Error clearing search history:", error)
      toast({
        title: "Error",
        description: "Failed to clear search history. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a medicine name")
      return
    }

    setIsLoading(true)
    setError(null)
    setMedicineData(null)

    try {
      // Save search to history if authenticated
      if (isAuthenticated && userId) {
        await saveSearchToHistory(query)
      }

      // Now use Gemini AI API for medicine details
      const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD_2mmF5KatTQs9_Zuvg7qoecYqdOzWVX0", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GEMINI_API_KEY}`, // Gemini API Key for Authentication
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: query }] }]
        })
        ,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const processedData = processAgentResponse(data)
        setMedicineData(processedData)
      } else {
        throw new Error(data.error || "Failed to get medicine information")
      }
    } catch (error) {
      console.error("Search error:", error)
      setError("Failed to fetch medicine information. Please try again.")
      toast({
        title: "Error",
        description: "Failed to fetch medicine information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Process the unstructured API response into structured data
  const processAgentResponse = (response: any) => {
    const responseText = response?.data?.description || ""
    return {
      name: query,
      uses: extractSection(responseText, "Uses", ["Side Effects", "Benefits"]) || "Information not available",
      side_effects:
        extractSection(responseText, "Side Effects", ["Benefits", "Precautions"]) || "Information not available",
      benefits:
        extractSection(responseText, "Benefits", ["Precautions", "Medical History"]) || "Information not available",
      precautions:
        extractSection(responseText, "Precautions", ["Medical History", "Inhibitor Testing"]) ||
        "Information not available",
      medical_history:
        extractSection(responseText, "Medical History", ["Inhibitor Testing", "Ages & Dosage"]) ||
        "Information not available",
      inhibitor_testing:
        extractSection(responseText, "Inhibitor Testing", ["Ages & Dosage", "Conclusion", "Note"]) ||
        "Information not available",
      dosage: extractSection(responseText, "Ages & Dosage", ["Conclusion", "Note"]) || "Information not available",
      full_response: responseText,
    }
  }

  const extractSection = (text: string, sectionName: string, nextSections: string[]) => {
    try {
      const sectionRegex = new RegExp(`${sectionName}[:\\s]+(.*?)(?:${nextSections.join("|")}|$)`, "is")
      const match = text.match(sectionRegex)
      return match ? match[1].trim() : null
    } catch (error) {
      console.error(`Error extracting section ${sectionName}:`, error)
      return null
    }
  }

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem)
    setShowHistory(false)
  }

  const handleFindPharmacy = () => {
    if (medicineData) {
      router.push(`/pharmacy-finder?medicine=${encodeURIComponent(medicineData.name)}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{t("searchMedicine")}</h1>
        <p className="text-muted-foreground">{t("enterMedicineName")}</p>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t("enterMedicineName")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />
                {isAuthenticated && searchHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="h-4 w-4" />
                    <span className="sr-only">Search History</span>
                  </Button>
                )}
              </div>
              {showHistory && searchHistory.length > 0 && (
                <Card className="absolute z-10 w-full mt-1">
                  <CardHeader className="py-2 px-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">{t("searchHistory")}</CardTitle>
                      <Button variant="ghost" size="sm" onClick={clearSearchHistory}>
                        {t("clearHistory")}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <ul className="space-y-1">
                      {searchHistory.map((item, index) => (
                        <li key={index}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left"
                            onClick={() => handleHistoryClick(item)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {item}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {medicineSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                  {medicineSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => {
                        setQuery(suggestion)
                        setMedicineSuggestions([])
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button onClick={handleSearch} disabled={isLoading} className="md:w-auto">
              {isLoading ? <LoadingSpinner size="sm" /> : <Search className="h-4 w-4 mr-2" />}
              {t("search")}
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 mt-4 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center my-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {medicineData && !isLoading && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center">
                    <Pill className="h-6 w-6 mr-2 text-primary" />
                    {medicineData.name}
                  </CardTitle>
                  <CardDescription>{t("medicineDetails")}</CardDescription>
                </div>
                <Button onClick={handleFindPharmacy}>{t("findPharmacy")}</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">{t("category")}</TableHead>
                    <TableHead>{t("information")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{t("uses")}</TableCell>
                    <TableCell>{medicineData.uses}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t("sideEffects")}</TableCell>
                    <TableCell>{medicineData.side_effects}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t("benefits")}</TableCell>
                    <TableCell>{medicineData.benefits}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t("precautions")}</TableCell>
                    <TableCell>{medicineData.precautions}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t("medicalHistory")}</TableCell>
                    <TableCell>{medicineData.medical_history}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t("inhibitorTesting")}</TableCell>
                    <TableCell>{medicineData.inhibitor_testing}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">{t("dosage")}</TableCell>
                    <TableCell>{medicineData.dosage}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

