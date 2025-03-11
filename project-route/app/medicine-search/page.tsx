"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Pill, AlertCircle, Clock } from "lucide-react"
import type { MedicineInfo } from "@/types/medicine"
import LoadingSpinner from "@/components/loading-spinner"
import { useScript } from "@/hooks/use-script"

declare global {
  interface Window {
    AgentAI: any
  }
}

export default function MedicineSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [agent, setAgent] = useState<any>(null)

  const agentAiStatus = useScript("https://cdn.agentai.com/sdk/v1/agentai.min.js")

  useEffect(() => {
    if (agentAiStatus === "ready" && typeof window !== "undefined" && window.AgentAI) {
      const newAgent = new window.AgentAI("YOUR_AGENT_ID")
      setAgent(newAgent)
    }
  }, [agentAiStatus])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !agent) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await agent.query({
        messages: [
          { role: "system", content: "You are a helpful assistant that provides information about medicines." },
          { role: "user", content: `Provide detailed information about the medicine: ${searchQuery}` },
        ],
      })

      // Parse the result and create a MedicineInfo object
      const medicineData: MedicineInfo = {
        name: searchQuery,
        category: "Medication", // You might want to extract this from the result
        description: result.content,
        usage: "", // Extract from result
        sideEffects: [], // Extract from result
        precautions: [], // Extract from result
      }

      setMedicineInfo(medicineData)

      // Add to search history if not already present
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory((prev) => [searchQuery, ...prev].slice(0, 5))
      }
    } catch (err) {
      setError("Failed to fetch medicine information. Please try again.")
      setMedicineInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistoryItemClick = (query: string) => {
    setSearchQuery(query)
    handleSearch(new Event("submit") as any)
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">Medicine Information</h1>
          <p className="mt-3 text-muted-foreground">Search for any medicine to get detailed information about it</p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full max-w-2xl mx-auto mb-8 gap-2 animate-slide-up">
          <Input
            type="text"
            placeholder="Enter medicine name (e.g., Aspirin, Paracetamol)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : <Search className="h-4 w-4 mr-2" />}
            Search
          </Button>
        </form>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-center mb-6 animate-fade-in">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        )}

        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="history">Search History</TabsTrigger>
          </TabsList>

          <TabsContent value="results">
            {isLoading ? (
              <div className="flex justify-center items-center py-20 animate-fade-in">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-lg">Searching for medicine information...</span>
              </div>
            ) : medicineInfo ? (
              <Card className="animate-fade-in">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{medicineInfo.name}</CardTitle>
                      <CardDescription>{medicineInfo.category}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-muted-foreground">{medicineInfo.description}</p>
                  </div>

                  {medicineInfo.usage && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Usage</h3>
                      <p className="text-muted-foreground">{medicineInfo.usage}</p>
                    </div>
                  )}

                  {medicineInfo.sideEffects.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Side Effects</h3>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {medicineInfo.sideEffects.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {medicineInfo.precautions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Precautions</h3>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {medicineInfo.precautions.map((precaution, index) => (
                          <li key={index}>{precaution}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <a href={`/pharmacy-finder?medicine=${encodeURIComponent(medicineInfo.name)}`}>
                      Find pharmacies with this medicine
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-lg animate-fade-in">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No medicine information yet</h3>
                <p className="text-muted-foreground">Search for a medicine to see detailed information</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle>Recent Searches</CardTitle>
                <CardDescription>Your recent medicine searches</CardDescription>
              </CardHeader>
              <CardContent>
                {searchHistory.length > 0 ? (
                  <ul className="space-y-2">
                    {searchHistory.map((query, index) => (
                      <li key={index}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left"
                          onClick={() => handleHistoryItemClick(query)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          {query}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No search history yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

