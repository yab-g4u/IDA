"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, Phone, Clock, ExternalLink, AlertCircle } from "lucide-react"
import type { Pharmacy } from "@/types/pharmacy"
import LoadingSpinner from "@/components/loading-spinner"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

declare global {
  interface Window {
    H: any
  }
}

const HERE_API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY || "CmipMwC90yrGtbd51o_sxn6jtlS7JcoOQEym_aX04sI"

const hereMapScripts = [
  "https://js.api.here.com/v3/3.1/mapsjs-core.js",
  "https://js.api.here.com/v3/3.1/mapsjs-service.js",
  "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
  "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
  "https://js.api.here.com/v3/3.1/mapsjs-clustering.js",
]

// Ethiopian cities for auto-suggestion
const ethiopianCities = [
  "Addis Ababa",
  "Hawassa",
  "Bahir Dar",
  "Gondar",
  "Mekelle",
  "Dire Dawa",
  "Jimma",
  "Adama",
  "Dessie",
  "Bishoftu",
  "Sodo",
  "Jijiga",
  "Shashemene",
  "Arba Minch",
  "Hosaena",
  "Harar",
  "Dilla",
]

// Mock pharmacy data for Ethiopian cities
const mockPharmacyData = {
  "Addis Ababa": [
    {
      name: "Gishen Pharmacy",
      address: "Bole Road, Addis Ababa, Ethiopia",
      phone: "+251 11 551 7272",
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
      distance: 0.8,
      lat: 9.0222 + 0.002,
      lng: 38.7468 + 0.002,
      website: "https://example.com/gishen",
    },
    {
      name: "Kenema Pharmacy",
      address: "Churchill Avenue, Addis Ababa, Ethiopia",
      phone: "+251 11 551 8383",
      hours: "Open 24 hours",
      distance: 1.2,
      lat: 9.0222 - 0.002,
      lng: 38.7468 - 0.002,
      website: "https://example.com/kenema",
    },
    {
      name: "Teklehaimanot Pharmacy",
      address: "Teklehaimanot Square, Addis Ababa, Ethiopia",
      phone: "+251 11 551 9494",
      hours: "Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-7PM",
      distance: 1.5,
      lat: 9.0222 + 0.003,
      lng: 38.7468 + 0.003,
      website: null,
    },
    {
      name: "Zewditu Pharmacy",
      address: "Zewditu Road, Addis Ababa, Ethiopia",
      phone: "+251 11 551 6161",
      hours: "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
      distance: 1.7,
      lat: 9.0222 - 0.003,
      lng: 38.7468 + 0.002,
      website: "https://example.com/zewditu",
    },
    {
      name: "Bole Pharmacy",
      address: "Bole Medhanialem, Addis Ababa, Ethiopia",
      phone: "+251 11 551 5252",
      hours: "Mon-Fri: 8:30AM-8:30PM, Sat-Sun: 9AM-6PM",
      distance: 2.1,
      lat: 9.0222 + 0.004,
      lng: 38.7468 - 0.003,
      website: null,
    },
  ],
  Hawassa: [
    {
      name: "Hawassa Central Pharmacy",
      address: "Main Street, Hawassa, Ethiopia",
      phone: "+251 11 551 1234",
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
      distance: 0.5,
      lat: 7.0622 + 0.001,
      lng: 38.4777 + 0.001,
      website: "https://example.com/hawassa-central",
    },
    {
      name: "Lake View Pharmacy",
      address: "Lake Road, Hawassa, Ethiopia",
      phone: "+251 11 551 5678",
      hours: "Mon-Sat: 9AM-7PM",
      distance: 0.9,
      lat: 7.0622 - 0.001,
      lng: 38.4777 - 0.001,
      website: null,
    },
    {
      name: "Hawassa University Pharmacy",
      address: "University Road, Hawassa, Ethiopia",
      phone: "+251 11 551 9090",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-1PM",
      distance: 1.3,
      lat: 7.0622 + 0.002,
      lng: 38.4777 + 0.002,
      website: "https://example.com/hawassa-university",
    },
    {
      name: "Tabor Pharmacy",
      address: "Tabor Hill, Hawassa, Ethiopia",
      phone: "+251 11 551 4455",
      hours: "Mon-Sat: 8AM-9PM, Sun: 9AM-6PM",
      distance: 1.8,
      lat: 7.0622 - 0.002,
      lng: 38.4777 + 0.002,
      website: null,
    },
  ],
  "Bahir Dar": [
    {
      name: "Blue Nile Pharmacy",
      address: "Nile Street, Bahir Dar, Ethiopia",
      phone: "+251 11 551 9876",
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM  Bahir Dar, Ethiopia",
      phone: "+251 11 551 9876",
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
      distance: 0.7,
      lat: 11.5742 + 0.002,
      lng: 37.3614 + 0.002,
      website: "https://example.com/blue-nile",
    },
    {
      name: "Tana Pharmacy",
      address: "Lake Tana Road, Bahir Dar, Ethiopia",
      phone: "+251 11 551 4321",
      hours: "Open 24 hours",
      distance: 1.1,
      lat: 11.5742 - 0.002,
      lng: 37.3614 - 0.002,
      website: null,
    },
    {
      name: "Bahir Dar University Pharmacy",
      address: "University Campus, Bahir Dar, Ethiopia",
      phone: "+251 11 551 7788",
      hours: "Mon-Fri: 8AM-5PM",
      distance: 1.4,
      lat: 11.5742 + 0.003,
      lng: 37.3614 - 0.001,
      website: "https://example.com/bdu-pharmacy",
    },
    {
      name: "Abay Pharmacy",
      address: "Abay Road, Bahir Dar, Ethiopia",
      phone: "+251 11 551 3344",
      hours: "Mon-Sat: 8AM-9PM, Sun: 10AM-6PM",
      distance: 1.9,
      lat: 11.5742 - 0.003,
      lng: 37.3614 + 0.002,
      website: null,
    },
  ],
  Gondar: [
    {
      name: "Gondar Central Pharmacy",
      address: "Main Square, Gondar, Ethiopia",
      phone: "+251 11 551 2233",
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
      distance: 0.6,
      lat: 12.603 + 0.001,
      lng: 37.4521 + 0.001,
      website: "https://example.com/gondar-central",
    },
    {
      name: "Castle Pharmacy",
      address: "Castle Road, Gondar, Ethiopia",
      phone: "+251 11 551 4455",
      hours: "Mon-Sat: 9AM-7PM",
      distance: 1.0,
      lat: 12.603 - 0.001,
      lng: 37.4521 - 0.001,
      website: null,
    },
    {
      name: "University of Gondar Pharmacy",
      address: "University Campus, Gondar, Ethiopia",
      phone: "+251 11 551 6677",
      hours: "Mon-Fri: 8AM-5PM",
      distance: 1.5,
      lat: 12.603 + 0.002,
      lng: 37.4521 - 0.002,
      website: "https://example.com/uog-pharmacy",
    },
  ],
  Mekelle: [
    {
      name: "Mekelle Central Pharmacy",
      address: "Downtown, Mekelle, Ethiopia",
      phone: "+251 11 551 8899",
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
      distance: 0.5,
      lat: 13.4967 + 0.001,
      lng: 39.4697 + 0.001,
      website: "https://example.com/mekelle-central",
    },
    {
      name: "Ayder Pharmacy",
      address: "Ayder Road, Mekelle, Ethiopia",
      phone: "+251 11 551 7766",
      hours: "Open 24 hours",
      distance: 0.9,
      lat: 13.4967 - 0.001,
      lng: 39.4697 - 0.001,
      website: null,
    },
    {
      name: "Mekelle University Pharmacy",
      address: "University Campus, Mekelle, Ethiopia",
      phone: "+251 11 551 5544",
      hours: "Mon-Fri: 8AM-5PM",
      distance: 1.3,
      lat: 13.4967 + 0.002,
      lng: 39.4697 - 0.002,
      website: "https://example.com/mu-pharmacy",
    },
  ],
  "Dire Dawa": [
    {
      name: "Dire Dawa Central Pharmacy",
      address: "Main Street, Dire Dawa, Ethiopia",
      phone: "+251 11 551 3322",
      hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
      distance: 0.6,
      lat: 9.5911 + 0.001,
      lng: 41.8661 + 0.001,
      website: "https://example.com/diredawa-central",
    },
    {
      name: "Railway Pharmacy",
      address: "Railway Station Road, Dire Dawa, Ethiopia",
      phone: "+251 11 551 4433",
      hours: "Mon-Sat: 9AM-7PM",
      distance: 1.1,
      lat: 9.5911 - 0.001,
      lng: 41.8661 - 0.001,
      website: null,
    },
    {
      name: "Dire Dawa University Pharmacy",
      address: "University Campus, Dire Dawa, Ethiopia",
      phone: "+251 11 551 5566",
      hours: "Mon-Fri: 8AM-5PM",
      distance: 1.6,
      lat: 9.5911 + 0.002,
      lng: 41.8661 - 0.002,
      website: "https://example.com/ddu-pharmacy",
    },
  ],
}

// Default coordinates for Ethiopian cities
const cityCoordinates = {
  "Addis Ababa": { lat: 9.0222, lng: 38.7468 },
  Hawassa: { lat: 7.0622, lng: 38.4777 },
  "Bahir Dar": { lat: 11.5742, lng: 37.3614 },
  Gondar: { lat: 12.603, lng: 37.4521 },
  Mekelle: { lat: 13.4967, lng: 39.4697 },
  "Dire Dawa": { lat: 9.5911, lng: 41.8661 },
  Jimma: { lat: 7.678, lng: 36.8344 },
  Adama: { lat: 8.54, lng: 39.27 },
  Dessie: { lat: 11.1333, lng: 39.6333 },
  Bishoftu: { lat: 8.75, lng: 38.9833 },
  Sodo: { lat: 6.85, lng: 37.75 },
  Jijiga: { lat: 9.35, lng: 42.8 },
  Shashemene: { lat: 7.2, lng: 38.6 },
  "Arba Minch": { lat: 6.0333, lng: 37.55 },
  Hosaena: { lat: 7.55, lng: 37.85 },
  Harar: { lat: 9.3167, lng: 42.1167 },
  Dilla: { lat: 6.4167, lng: 38.3167 },
}

export default function PharmacyFinderContent() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const medicineName = searchParams.get("medicine")
  const initialLocation = searchParams.get("location")

  const [city, setCity] = useState(initialLocation || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchStartTime, setSearchStartTime] = useState<number | null>(null)
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [citySuggestions, setCitySuggestions] = useState<string[]>([])
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const platformRef = useRef<any>(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [cityName, setCityName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

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
    if (city.trim() === "") {
      setCitySuggestions([])
      return
    }

    const filteredCities = ethiopianCities.filter((c) => c.toLowerCase().includes(city.toLowerCase())).slice(0, 5)

    setCitySuggestions(filteredCities)
  }, [city])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
        apikey: HERE_API_KEY,
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

  // Get city name from coordinates using HERE Reverse Geocoding API
  const getCityFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${lat},${lng}&apiKey=${HERE_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.items && data.items.length > 0) {
        const address = data.items[0].address
        return address.city || address.county || address.state || "Unknown Location"
      }

      return "Unknown Location"
    } catch (error) {
      console.error("Error getting city name:", error)
      return "Unknown Location"
    }
  }

  const getCurrentLocation = () => {
    setIsUsingCurrentLocation(true)
    setError(null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })

          // Get city name from coordinates
          try {
            const city = await getCityFromCoordinates(latitude, longitude)
            setCityName(city)
            setCity(`Current Location (${city})`)
          } catch (error) {
            console.error("Error getting city name:", error)
            setCity("Current Location")
          }

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
          setError("Unable to retrieve your location. Please enter your city manually.")
          setIsUsingCurrentLocation(false)

          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Unable to access your location. Please check your browser permissions.",
            icon: <AlertCircle className="h-5 w-5" />,
          })
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      setError("Geolocation is not supported by your browser. Please enter your city manually.")
      setIsUsingCurrentLocation(false)

      toast({
        variant: "destructive",
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation. Please enter your city manually.",
        icon: <AlertCircle className="h-5 w-5" />,
      })
    }
  }

  const handleSearch = async (useCurrentLocation = false) => {
    if (!useCurrentLocation && !city.trim()) {
      setError("Please enter a city or use your current location")
      return
    }

    setIsLoading(true)
    setIsSearching(true)
    setSearchStartTime(Date.now())
    setError(null)

    try {
      // Determine the location to use for the search
      let searchLocation: string
      let coordinates: { lat: number; lng: number }

      if (useCurrentLocation && userLocation) {
        // Use the city name if available, otherwise use coordinates
        searchLocation = cityName || "Current Location"
        coordinates = userLocation
      } else {
        searchLocation = city

        // Improved city matching logic
        // First try exact match (case insensitive)
        let cityKey = Object.keys(cityCoordinates).find((c) => c.toLowerCase() === city.toLowerCase())

        // If no exact match, try partial match
        if (!cityKey) {
          cityKey = Object.keys(cityCoordinates).find(
            (c) => c.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(c.toLowerCase()),
          )
        }

        // If still no match, try matching individual words
        if (!cityKey && city.includes(" ")) {
          const cityWords = city.toLowerCase().split(/\s+/)
          for (const word of cityWords) {
            if (word.length < 3) continue // Skip very short words

            const matchedCity = Object.keys(cityCoordinates).find((c) => c.toLowerCase().includes(word))

            if (matchedCity) {
              cityKey = matchedCity
              break
            }
          }
        }

        if (cityKey) {
          coordinates = cityCoordinates[cityKey]
          // If the user entered something different than our exact city name,
          // update the input field to show the matched city for clarity
          if (city.toLowerCase() !== cityKey.toLowerCase()) {
            setCity(cityKey)
          }
        } else {
          // Default to Addis Ababa if location not recognized, but don't show error toast
          coordinates = cityCoordinates["Addis Ababa"]
          setCity("Addis Ababa")
        }
      }

      console.log("Searching for pharmacies near:", searchLocation, coordinates)

      // Get mock data for the location
      let mockPharmacies: Pharmacy[] = []

      // Improved city matching for pharmacy data
      // First try exact match
      let cityKey = Object.keys(mockPharmacyData).find((c) => c.toLowerCase() === searchLocation.toLowerCase())

      // Then try partial match
      if (!cityKey) {
        cityKey = Object.keys(mockPharmacyData).find(
          (c) =>
            c.toLowerCase().includes(searchLocation.toLowerCase()) ||
            searchLocation.toLowerCase().includes(c.toLowerCase()),
        )
      }

      if (cityKey) {
        mockPharmacies = mockPharmacyData[cityKey]
      } else if (useCurrentLocation && userLocation) {
        // Generate mock data around user's location
        mockPharmacies = [
          {
            name: "Nearby Pharmacy 1",
            address: `Near ${searchLocation}`,
            phone: "+251 11 551 1111",
            hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
            distance: 0.6,
            lat: coordinates.lat + 0.002,
            lng: coordinates.lng + 0.002,
            website: null,
          },
          {
            name: "Nearby Pharmacy 2",
            address: `Near ${searchLocation}`,
            phone: "+251 11 551 2222",
            hours: "Open 24 hours",
            distance: 1.0,
            lat: coordinates.lat - 0.002,
            lng: coordinates.lng - 0.002,
            website: null,
          },
          {
            name: "Nearby Pharmacy 3",
            address: `Near ${searchLocation}`,
            phone: "+251 11 551 3333",
            hours: "Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-7PM",
            distance: 1.3,
            lat: coordinates.lat + 0.003,
            lng: coordinates.lng - 0.001,
            website: null,
          },
        ]
      } else {
        // Default to Addis Ababa pharmacies without showing an error
        mockPharmacies = mockPharmacyData["Addis Ababa"]
      }

      // Ensure search animation shows for at least 1.5 seconds for better UX
      const currentTime = Date.now()
      const elapsedTime = currentTime - (searchStartTime || currentTime)

      // If search was too fast, add a small delay for better UX
      if (elapsedTime < 1500) {
        await new Promise((resolve) => setTimeout(resolve, 1500 - elapsedTime))
      }

      setPharmacies(mockPharmacies)

      // Update map with pharmacy locations
      updateMap(mockPharmacies, coordinates)

      // Save search to history if user is logged in and medicine name is provided
      if (isAuthenticated && userId && medicineName && !useCurrentLocation) {
        saveSearchToHistory(`${medicineName} at ${city}`)
      }
    } catch (error) {
      console.error("Failed to find pharmacies:", error instanceof Error ? error.message : String(error))
      setError("Failed to find pharmacies. Please try again.")

      // Fallback to Addis Ababa pharmacies on error
      const mockPharmacies = mockPharmacyData["Addis Ababa"]
      setPharmacies(mockPharmacies)

      // Update map with pharmacy locations
      updateMap(mockPharmacies, cityCoordinates["Addis Ababa"])

      toast({
        variant: "destructive",
        title: "Error Finding Pharmacies",
        description: "Using fallback data instead. Please try again later.",
        icon: <AlertCircle className="h-5 w-5" />,
      })
    } finally {
      setIsLoading(false)
      setIsSearching(false)
    }
  }

  const updateMap = (pharmacies: Pharmacy[], center?: { lat: number; lng: number }) => {
    if (!mapRef.current || !platformRef.current) {
      console.error("Map not initialized")
      return
    }

    try {
      // Clear previous objects
      mapRef.current.removeObjects(mapRef.current.getObjects())

      const group = new window.H.map.Group()

      // If center is provided, center the map there
      if (center) {
        mapRef.current.setCenter(center)
        mapRef.current.setZoom(13)
      }

      pharmacies.forEach((pharmacy, index) => {
        // Create a marker for each pharmacy
        const marker = new window.H.map.Marker({ lat: pharmacy.lat, lng: pharmacy.lng })

        // Add bubble with pharmacy info when marker is tapped/clicked
        marker.addEventListener("tap", (evt) => {
          const bubble = new window.H.ui.InfoBubble(evt.target.getGeometry(), {
            content: `<div style="padding:10px;max-width:200px;">
              <b>${pharmacy.name}</b><br/>
              ${pharmacy.address}<br/>
              ${pharmacy.phone}<br/>
              <span style="color:#666;">${pharmacy.distance.toFixed(1)} miles away</span>
            </div>`,
          })

          // Get the UI component from the map
          const ui = mapRef.current.getUI()
          ui.addBubble(bubble)
        })

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
    return `https://www.google.com/maps/dir/${encodeURIComponent(city)}/${encodeURIComponent(pharmacy.address)}`
  }

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity)
    setShowSuggestions(false)

    // For better UX, update the map immediately if possible
    if (isMapReady && cityCoordinates[selectedCity]) {
      const coordinates = cityCoordinates[selectedCity]
      if (mapRef.current) {
        mapRef.current.setCenter(coordinates)
        mapRef.current.setZoom(13)
      }
    }

    // Auto-search when a city is selected
    setTimeout(() => {
      handleSearch()
    }, 100)
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl font-bold">{t("pharmacyFinder")}</h1>
          <p className="mt-3 text-muted-foreground">
            {medicineName ? `${t("findPharmaciesFor")} ${medicineName}` : t("findNearbyPharmacies")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-slideIn">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                  setShowSuggestions(false)
                }
              }}
              className="w-full"
            />

            {showSuggestions && citySuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {citySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-muted cursor-pointer"
                    onClick={() => handleCitySelect(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => handleSearch()}
              disabled={isLoading || isSearching}
              className="flex-grow md:flex-grow-0"
            >
              {isSearching ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">{t("searching")}</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  {t("findPharmacies")}
                </>
              )}
            </Button>

            <Button
              onClick={getCurrentLocation}
              variant="outline"
              disabled={isUsingCurrentLocation && userLocation === null}
              className="flex-grow md:flex-grow-0"
            >
              {isUsingCurrentLocation && userLocation === null ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              {t("useMyLocation")}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md mb-6 animate-fadeIn">
            <p>{typeof error === "string" ? error : "An error occurred"}</p>
          </div>
        )}

        {!scriptsLoaded ? (
          <div className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fadeIn flex items-center justify-center bg-muted">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">{t("loading")}</span>
          </div>
        ) : error && !isMapReady ? (
          <div className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fadeIn flex items-center justify-center bg-muted">
            <p className="text-destructive">{typeof error === "string" ? error : "An error occurred"}</p>
          </div>
        ) : (
          <div
            id="mapContainer"
            ref={mapContainerRef}
            className="w-full h-96 mb-8 rounded-lg overflow-hidden animate-fadeIn"
          ></div>
        )}

        {isSearching ? (
          <div className="flex justify-center items-center py-20 animate-fadeIn">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">{t("searching")}</span>
          </div>
        ) : pharmacies.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 animate-fadeIn">
            {pharmacies.map((pharmacy, index) => (
              <Card key={index} className="feature-card">
                <CardHeader className="pb-4 md:pb-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                      <CardTitle className="text-xl">{pharmacy.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span>{pharmacy.address}</span>
                      </CardDescription>
                    </div>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium self-start">
                      {pharmacy.distance.toFixed(1)} {t("milesAway")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <a href={`tel:${pharmacy.phone}`} className="hover:text-primary truncate">
                        {pharmacy.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{pharmacy.hours}</span>
                    </div>
                    <div className="md:col-span-2 flex flex-wrap gap-2 mt-2">
                      <Button asChild variant="outline" size="sm" className="flex-grow md:flex-grow-0">
                        <a href={getDirectionsUrl(pharmacy)} target="_blank" rel="noopener noreferrer">
                          <Navigation className="h-4 w-4 mr-2" />
                          {t("getDirections")}
                        </a>
                      </Button>
                      {pharmacy.website && (
                        <Button asChild variant="outline" size="sm" className="flex-grow md:flex-grow-0">
                          <a href={pharmacy.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            {t("visitWebsite")}
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
          <div className="text-center py-16 bg-muted/30 rounded-lg animate-fadeIn">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">{t("noPharmacies")}</h3>
            <p className="text-muted-foreground">{t("enterLocationToFind")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
