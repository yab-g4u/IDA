import { type NextRequest, NextResponse } from "next/server"

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
}

// Default coordinates for Ethiopian cities
const cityCoordinates = {
  "Addis Ababa": { lat: 9.0222, lng: 38.7468 },
  Hawassa: { lat: 7.0622, lng: 38.4777 },
  "Bahir Dar": { lat: 11.5742, lng: 37.3614 },
  Gondar: { lat: 12.603, lng: 37.4521 },
  Mekelle: { lat: 13.4967, lng: 39.4697 },
  "Dire Dawa": { lat: 9.5911, lng: 41.8661 },
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const medicine = searchParams.get("medicine")

  try {
    // Determine which city to use
    let cityName = "Addis Ababa" // Default

    if (location) {
      // Improved city matching logic
      // First try exact match (case insensitive)
      let matchedCity = Object.keys(mockPharmacyData).find((city) => city.toLowerCase() === location.toLowerCase())

      // If no exact match, try partial match
      if (!matchedCity) {
        matchedCity = Object.keys(mockPharmacyData).find(
          (city) =>
            city.toLowerCase().includes(location.toLowerCase()) || location.toLowerCase().includes(city.toLowerCase()),
        )
      }

      // If still no match, try matching individual words
      if (!matchedCity && location.includes(" ")) {
        const locationWords = location.toLowerCase().split(/\s+/)
        for (const word of locationWords) {
          if (word.length < 3) continue // Skip very short words

          const wordMatchedCity = Object.keys(mockPharmacyData).find((city) => city.toLowerCase().includes(word))

          if (wordMatchedCity) {
            matchedCity = wordMatchedCity
            break
          }
        }
      }

      if (matchedCity) {
        cityName = matchedCity
      }
    } else if (lat && lng) {
      // Find the closest city to the provided coordinates
      const userCoords = {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      }

      let closestCity = "Addis Ababa"
      let minDistance = Number.MAX_VALUE

      Object.entries(cityCoordinates).forEach(([city, coords]) => {
        const distance = Math.sqrt(Math.pow(userCoords.lat - coords.lat, 2) + Math.pow(userCoords.lng - coords.lng, 2))

        if (distance < minDistance) {
          minDistance = distance
          closestCity = city
        }
      })

      cityName = closestCity
    }

    // Get pharmacies for the determined city
    let pharmacies = mockPharmacyData[cityName] || mockPharmacyData["Addis Ababa"]

    // If coordinates were provided, adjust distances based on actual distance
    if (lat && lng) {
      const userCoords = {
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lng),
      }

      pharmacies = pharmacies.map((pharmacy) => {
        const distance =
          Math.sqrt(Math.pow(userCoords.lat - pharmacy.lat, 2) + Math.pow(userCoords.lng - pharmacy.lng, 2)) * 111 // Rough conversion to km (1 degree ≈ 111 km)

        return {
          ...pharmacy,
          distance: Number.parseFloat((distance * 0.621371).toFixed(1)), // Convert km to miles
        }
      })

      // Sort by distance
      pharmacies.sort((a, b) => a.distance - b.distance)
    }

    // For hackathon demo, always return some pharmacies
    if (!pharmacies || pharmacies.length === 0) {
      pharmacies = mockPharmacyData["Addis Ababa"]
    }

    return NextResponse.json(pharmacies)
  } catch (error) {
    console.error("Error in pharmacies API route:", error)
    // Even in case of error, return default pharmacies for the demo
    return NextResponse.json(mockPharmacyData["Addis Ababa"])
  }
}
