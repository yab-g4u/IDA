"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react"
import type { Pharmacy } from "@/types/pharmacy"
import LoadingSpinner from "@/components/loading-spinner"
import { useLanguage } from "@/contexts/language-context"
import AutoSuggestion from "./auto-suggestion"
import { ethiopianLocations, filterSuggestions } from "@/lib/ethiopia-data"
import { supabase } from "@/lib/supabase-client"

declare global {
  interface Window {
    H: any
  }
}

const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY

const hereMapScripts = [
  "https://js.api.here.com/v3/3.1/mapsjs-core.js",
  "https://js.api.here.com/v3/3.1/mapsjs-service.js",
  "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
  "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
  "https://js.api.here.com/v3/3.1/mapsjs-clustering.js",
]

// Function to parse Agent.AI response for pharmacies
const parseAgentPharmacyResponse = (response: any, location: string) => {
  try {
    if (!response || !response.response) {
      return []
    }

    const text = response.response

    // Simple parsing - in a real app, you'd want more sophisticated parsing
    // or have Agent.AI return structured data
    const pharmacyBlocks = text.split(/Pharmacy \d+:|Pharmacy:/i).filter(Boolean)

    return pharmacyBlocks.map((block: string, index: number) => {
      const lines = block.trim().split("\n").filter(Boolean)

      // Extract what we can from the text
      const name = lines[0]?.trim() || `Pharmacy near ${location}`
      const addressLine = lines.find((l) => l.includes("Address:") || l.includes("Location:"))
      const address = addressLine ? addressLine.replace(/Address:|Location:/i, "").trim() : location
      const phoneLine = lines.find((l) => l.includes("Phone:") || l.includes("Contact:"))
      const phone = phoneLine ? phoneLine.replace(/Phone:|Contact:/i, "").trim() : "Not available"
      const hoursLine = lines.find((l) => l.includes("Hours:") || l.includes("Operating hours:"))
      const hours = hoursLine ? hoursLine.replace(/Hours:|Operating hours:/i, "").trim() : "Not available"

      return {
        id: `pharmacy-${index}`,
        name,
        address,
        location: address,
        phone,
        hours,
        distance: "Nearby",
        hasDelivery: Math.random() > 0.5, // Random for demo
      }
    })
  } catch (error) {
    console.error("Error parsing Agent.AI pharmacy response:", error)
    return []
  }
}

export default function PharmacyFinderContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const medicineName = searchParams.get("medicine")
  const initialLocation = searchParams.get("location")

  const [location, setLocation] = useState(initialLocation || "")
  const [isLoading, setIsLoading] = useState(false)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false)
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const platformRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

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
      } else {
        setUserId(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Update suggestions when input changes
  useEffect(() => {
    setLocationSuggestions(filterSuggestions(location, ethiopianLocations))
  }, [location])

  // Load HERE Maps scripts
  useEffect(() => {
    let scriptIndex = 0
    let scriptsLoadedSuccessfully = true

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        // Check if script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => {
          console.error(`Failed to load script: ${src}`)
          scriptsLoadedSuccessfully = false
          reject(new Error(`Failed to load script: ${src}`))
        }
        document.head.appendChild(script)
      })
    }

    const loadNextScript = async () => {
      if (scriptIndex < hereMapScripts.length) {
        try {
          await loadScript(hereMapScripts[scriptIndex])
          scriptIndex++
          loadNextScript()
        } catch (error) {
          console.error("Error loading HERE Maps script:", error instanceof Error ? error.message : String(error))
          setError("Failed to load map. Please refresh the page and try again.")
        }
      } else if (scriptsLoadedSuccessfully) {
        setScriptsLoaded(true)
      }
    }

    loadNextScript()
  }, [])

  // Initialize map after scripts are loaded
  useEffect(() => {
    if (scriptsLoaded && mapContainerRef.current) {
      initializeMap()
    }
  }, [scriptsLoaded])

  // Search automatically if location is provided in URL
  useEffect(() => {
    if (initialLocation && isMapReady) {
      handleSearch()

      // Save search to history if user is logged in and medicine name is provided
      if (isAuthenticated && userId && medicineName) {
        saveSearchToHistory(`${medicineName} at ${initialLocation}`)
      }
    }
  }, [initialLocation, isMapReady, isAuthenticated, userId, medicineName])

  const saveSearchToHistory = async (searchQuery: string) => {
    if (!isAuthenticated || !userId) return

    try {
      const { error } = await supabase.from("search_history").insert({
        user_id: userId,
        query: searchQuery,
        type: "pharmacy",
        searched_at: new Date().toISOString(),
      })

      if (error) throw error
    } catch (err) {
      console.error("Error saving search history:", err)
    }
  }

  const initializeMap = () => {
    if (!mapContainerRef.current) {
      console.error("Map container element not found")
      setError("Map container not found. Please refresh the page.")
      return
    }

    if (typeof window === "undefined" || !window.H) {
      console.error("HERE Maps API not available")
      setError("Map API not available. Please check your internet connection and try again.")
      return
    }

    try {
      platformRef.current = new window.H.service.Platform({
        apikey: HERE_API_KEY || "default-key", // Provide a fallback to prevent errors
      })

      const defaultLayers = platformRef.current.createDefaultLayers()

      // Create map instance
      mapRef.current = new window.H.Map(mapContainerRef.current, defaultLayers.vector.normal.map, {
        zoom: 10,
        center: { lat: 9.0222, lng: 38.7468 }, // Default to Addis Ababa
        pixelRatio: window.devicePixelRatio || 1,
      })

      // Add map interaction and UI components
      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(mapRef.current))
      window.H.ui.UI.createDefault(mapRef.current, defaultLayers)

      // Handle window resize
      const resizeHandler = () => {
        if (mapRef.current) {
          mapRef.current.getViewPort().resize()
        }
      }
      window.addEventListener("resize", resizeHandler)

      setIsMapReady(true)

      // If medicine name is provided in URL, pre-fill it
      if (medicineName) {
        handleSearch()
      }

      // Cleanup resize handler
      return () => {
        window.removeEventListener("resize", resizeHandler)
      }
    } catch (error) {
      console.error("Error initializing map:", error instanceof Error ? error.message : String(error))
      setError("Failed to initialize map. Please try refreshing the page.")
    }
  }

  const getCurrentLocation = () => {
    setIsUsingCurrentLocation(true)
    setError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLocation("Using your current location")

          // Center map on user location
          if (mapRef.current) {
            mapRef.current.setCenter({ lat: latitude, lng: longitude })
            mapRef.current.setZoom(14)
          }

          handleSearch(true)

          // Save search to history if user is logged in and medicine name is provided
          if (isAuthenticated && userId && medicineName) {
            saveSearchToHistory(`${medicineName} at Current Location`)
          }
        },
        (err) => {
          console.error("Geolocation error:", err instanceof Error ? err.message : String(err))
          setError("Unable to retrieve your location. Please enter it manually.")
          setIsUsingCurrentLocation(false)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setError("Geolocation is not supported by your browser. Please enter your location manually.")
      setIsUsingCurrentLocation(false)
    }
  }

  const handleSearch = async (useCurrentLocation = false) => {
    if (!useCurrentLocation && !location.trim()) {
      setError("Please enter a location or use your current location")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call to find pharmacies
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Ethiopian pharmacy data (mock data)
      const mockPharmacies: Pharmacy[] = [
        {
          name: "Gishen Pharmacy",
          address: "Bole Road, Addis Ababa, Ethiopia",
          phone: "+251 11 551 7272",
          hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
          distance: 0.8,
          lat: userLocation?.lat ? userLocation.lat + 0.002 : 9.0222,
          lng: userLocation?.lng ? userLocation.lng + 0.002 : 38.7468,
          website: "https://example.com/gishen",
        },
        {
          name: "Kenema Pharmacy",
          address: "Churchill Avenue, Addis Ababa, Ethiopia",
          phone: "+251 11 551 8383",
          hours: "Open 24 hours",
          distance: 1.2,
          lat: userLocation?.lat ? userLocation.lat - 0.002 : 9.0242,
          lng: userLocation?.lng ? userLocation.lng - 0.002 : 38.7528,
          website: "https://example.com/kenema",
        },
        {
          name: "Teklehaimanot Pharmacy",
          address: "Teklehaimanot Square, Addis Ababa, Ethiopia",
          phone: "+251 11 551 9494",
          hours: "Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-7PM",
          distance: 1.5,
          lat: userLocation?.lat ? userLocation.lat + 0.003 : 9.0262,
          lng: userLocation?.lng ? userLocation.lng + 0.003 : 38.7388,
          website: null,
        },
      ]

      setPharmacies(mockPharmacies)

      // Update map with pharmacy locations
      updateMap(mockPharmacies)

      // Save search to history if user is logged in and medicine name is provided
      if (isAuthenticated && userId && medicineName && !useCurrentLocation) {
        saveSearchToHistory(`${medicineName} at ${location}`)
      }
    } catch (error) {
      console.error("Failed to find pharmacies:", error instanceof Error ? error.message : String(error))
      setError("Failed to find pharmacies. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateMap = (pharmacies: Pharmacy[]) => {
    if (!mapRef.current || !platformRef.current) {
      console.error("Map not initialized")
      return
    }

    try {
      // Clear previous objects
      mapRef.current.removeObjects(mapRef.current.getObjects())

      const group = new window.H.map.Group()

      pharmacies.forEach((pharmacy, index) => {
        const marker = new window.H.map.Marker({ lat: pharmacy.lat, lng: pharmacy.lng })
        group.addObject(marker)
      })

      mapRef.current.addObject(group)

      // Set viewport to show all markers
      if (group.getObjects().length > 0) {
        mapRef.current.getViewModel().setLookAtData({
          bounds: group.getBoundingBox(),
          padding: { top: 50, right: 50, bottom: 50, left: 50 },
        })
      }
    } catch (error) {
      console.error("Error updating map:", error instanceof Error ? error.message : String(error))
      setError("Failed to update map with pharmacy locations.")
    }
  }

  const getDirectionsUrl = (pharmacy: Pharmacy) => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${pharmacy.lat},${pharmacy.lng}`
    }
    return `https://www.google.com/maps/dir/${encodeURIComponent(location)}/${encodeURIComponent(pharmacy.address)}`
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold">{t("pharmacyFinder")}</h1>
          <p className="mt-3 text-muted-foreground">
            {medicineName ? `Find pharmacies that have ${medicineName} near you` : t("findNearbyPharmacies")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-slide-up">
          <div className="flex-1">
            <AutoSuggestion
              placeholder={t("enterYourLocation")}
              suggestions={locationSuggestions}
              value={location}
              onChange={setLocation}
              onSubmit={() => handleSearch()}
              isLoading={isLoading}
              icon={<MapPin className="h-4 w-4 mr-2" />}
              buttonText={t("findPharmacies")}
            />
          </div>
          <Button
            onClick={getCurrentLocation}
            variant="outline"
            disabled={isUsingCurrentLocation && userLocation === null}
          >
            {isUsingCurrentLocation && userLocation === null ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Navigation className="h-4 w-4 mr-2" />
            )}
            {t("useMyLocation")}
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6 animate-fade-in">
            <p>{typeof error === "string" ? error : "An error occurred"}</p>
          </div>
        )}

        {!scriptsLoaded ? (
          <div className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fade-in flex items-center justify-center bg-muted">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">{t("loading")}</span>
          </div>
        ) : error && !isMapReady ? (
          <div className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fade-in flex items-center justify-center bg-muted">
            <p className="text-destructive">{typeof error === "string" ? error : "An error occurred"}</p>
          </div>
        ) : (
          <div
            id="mapContainer"
            ref={mapContainerRef}
            className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fade-in"
          ></div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20 animate-fade-in">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">{t("loading")}</span>
          </div>
        ) : pharmacies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {pharmacies.map((pharmacy, index) => (
              <Card key={index} className="feature-card">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{pharmacy.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {pharmacy.address}
                      </CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {pharmacy.distance} miles away
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <a href={`tel:${pharmacy.phone}`} className="hover:text-primary">
                        {pharmacy.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{pharmacy.hours}</span>
                    </div>
                    <div className="md:col-span-2 flex gap-2 mt-2">
                      <Button asChild variant="outline" size="sm">
                        <a href={getDirectionsUrl(pharmacy)} target="_blank" rel="noopener noreferrer">
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </a>
                      </Button>
                      {pharmacy.website && (
                        <Button asChild variant="outline" size="sm">
                          <a href={pharmacy.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-lg animate-fade-in">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No pharmacies found</h3>
            <p className="text-muted-foreground">
              Enter your location or use your current location to find pharmacies near you
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

