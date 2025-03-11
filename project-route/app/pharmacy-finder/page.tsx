"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react"
import type { Pharmacy } from "@/types/pharmacy"
import LoadingSpinner from "@/components/loading-spinner"

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

export default function PharmacyFinder() {
  const searchParams = useSearchParams()
  const medicineName = searchParams.get("medicine")

  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false)
  const mapRef = useRef<any>(null)
  const platformRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)

  useEffect(() => {
    let scriptIndex = 0

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script")
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
        document.head.appendChild(script)
      })
    }

    const loadNextScript = () => {
      if (scriptIndex < hereMapScripts.length) {
        loadScript(hereMapScripts[scriptIndex])
          .then(() => {
            scriptIndex++
            loadNextScript()
          })
          .catch((error) => {
            console.error("Error loading HERE Maps script:", error)
            setError("Failed to load map. Please refresh the page and try again.")
          })
      } else {
        initializeMap()
      }
    }

    loadNextScript()
  }, [])

  const initializeMap = () => {
    if (typeof window !== "undefined" && window.H && HERE_API_KEY) {
      try {
        platformRef.current = new window.H.service.Platform({
          apikey: HERE_API_KEY,
        })

        const defaultLayers = platformRef.current.createDefaultLayers()

        const map = new window.H.Map(document.getElementById("mapContainer"), defaultLayers.vector.normal.map, {
          zoom: 10,
          center: { lat: 0, lng: 0 },
        })

        const behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map))
        const ui = window.H.ui.UI.createDefault(map, defaultLayers)

        mapRef.current = map
        setIsMapReady(true)

        // If medicine name is provided in URL, pre-fill it
        if (medicineName) {
          handleSearch()
        }
      } catch (error) {
        console.error("Error initializing map:", error)
        setError("Failed to initialize map. Please try refreshing the page.")
      }
    } else {
      console.error("HERE Maps API not available")
      setError("Map API not available. Please check your internet connection and try again.")
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
          handleSearch(true)
        },
        (err) => {
          setError("Unable to retrieve your location. Please enter it manually.")
          setIsUsingCurrentLocation(false)
        },
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
          lat: 40.7128,
          lng: -74.006,
          website: "https://example.com/citypharmacy",
        },
        {
          name: "Health Plus Pharmacy",
          address: "456 Oak Ave, Anytown, USA",
          phone: "(555) 987-6543",
          hours: "Open 24 hours",
          distance: 1.2,
          lat: 40.7148,
          lng: -74.009,
          website: "https://example.com/healthplus",
        },
        // Add more mock pharmacies as needed
      ]

      setPharmacies(mockPharmacies)

      // Update map with pharmacy locations
      updateMap(mockPharmacies)
    } catch (err) {
      setError("Failed to find pharmacies. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const updateMap = (pharmacies: Pharmacy[]) => {
    if (mapRef.current && platformRef.current) {
      const group = new window.H.map.Group()

      pharmacies.forEach((pharmacy, index) => {
        const marker = new window.H.map.Marker({ lat: pharmacy.lat, lng: pharmacy.lng })
        group.addObject(marker)
      })

      mapRef.current.addObject(group)
      mapRef.current.getViewModel().setLookAtData({
        bounds: group.getBoundingBox(),
      })
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
          <h1 className="text-3xl md:text-4xl font-bold">Pharmacy Finder</h1>
          <p className="mt-3 text-muted-foreground">
            {medicineName ? `Find pharmacies that have ${medicineName} near you` : "Find pharmacies near your location"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-slide-up">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter your location (e.g., city, zip code)"
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
            Use My Location
          </Button>
          <Button onClick={() => handleSearch()} disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : <MapPin className="h-4 w-4 mr-2" />}
            Find Pharmacies
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6 animate-fade-in">
            <p>{error}</p>
          </div>
        )}

        {!isMapReady ? (
          <div className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fade-in flex items-center justify-center bg-muted">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">Loading map...</span>
          </div>
        ) : error ? (
          <div className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fade-in flex items-center justify-center bg-muted">
            <p className="text-destructive">{error}</p>
          </div>
        ) : (
          <div id="mapContainer" className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fade-in"></div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20 animate-fade-in">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">Searching for pharmacies...</span>
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

