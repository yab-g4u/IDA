"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react"
import type { Pharmacy } from "@/types/pharmacy"
import LoadingSpinner from "@/components/loading-spinner"
import { useLanguage } from "@/contexts/language-context"

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
    }
  }, [initialLocation, isMapReady])

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

    if (!HERE_API_KEY) {
      console.error("HERE API key is missing")
      setError("Map configuration error. Please contact support.")
      return
    }

    try {
      platformRef.current = new window.H.service.Platform({
        apikey: HERE_API_KEY,
      })

      const defaultLayers = platformRef.current.createDefaultLayers()

      // Create map instance
      mapRef.current = new window.H.Map(mapContainerRef.current, defaultLayers.vector.normal.map, {
        zoom: 10,
        center: { lat: 0, lng: 0 },
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

      const mockPharmacies: Pharmacy[] = [
        {
          name: "City Pharmacy",
          address: "123 Main St, Anytown, USA",
          phone: "(555) 123-4567",
          hours: "Mon-Fri: 9AM-9PM, Sat-Sun: 10AM-6PM",
          distance: 0.8,
          lat: userLocation?.lat ? userLocation.lat + 0.002 : 40.7128,
          lng: userLocation?.lng ? userLocation.lng + 0.002 : -74.006,
          website: "https://example.com/citypharmacy",
        },
        {
          name: "Health Plus Pharmacy",
          address: "456 Oak Ave, Anytown, USA",
          phone: "(555) 987-6543",
          hours: "Open 24 hours",
          distance: 1.2,
          lat: userLocation?.lat ? userLocation.lat - 0.002 : 40.7148,
          lng: userLocation?.lng ? userLocation.lng - 0.002 : -74.009,
          website: "https://example.com/healthplus",
        },
      ]

      setPharmacies(mockPharmacies)

      // Update map with pharmacy locations
      updateMap(mockPharmacies)
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
            <Input
              type="text"
              placeholder={t("enterYourLocation")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isUsingCurrentLocation && userLocation !== null}
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
          <Button onClick={() => handleSearch()} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : <MapPin className="h-4 w-4 mr-2" />}
            {t("findPharmacies")}
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

