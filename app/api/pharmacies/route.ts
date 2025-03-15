import { type NextRequest, NextResponse } from "next/server"
import type { Pharmacy } from "@/types/pharmacy"

const AGENT_WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL
const AGENT_API_KEY = "T8VglzcO4J4Lqh8r2bS0h66rS7i1302f6lS4oCloW4crxbsIu9No51X5yyrTOork"
const AGENT_ID = "0541764d16d748f694ef5e29b5a27f74"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location")
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const medicine = searchParams.get("medicine")

  if (!location && (!lat || !lng)) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 })
  }

  try {
    // Generate mock pharmacy data based on location
    const mockPharmacies = getMockPharmacies(
      location || `coordinates ${lat},${lng}`,
      {
        lat: Number.parseFloat(lat || "9.0222"),
        lng: Number.parseFloat(lng || "38.7468"),
      },
      medicine,
    )

    try {
      // Try to use the webhook URL if available, otherwise use direct API call
      const apiUrl = AGENT_WEBHOOK_URL || "https://api-iz.agent.ai/v1/action/invoke_agent"

      const userInput = medicine
        ? `Find pharmacies near ${location || `coordinates ${lat},${lng}`} that have ${medicine} in stock.`
        : `Find pharmacies near ${location || `coordinates ${lat},${lng}`}.`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AGENT_API_KEY}`,
        },
        body: JSON.stringify({
          id: AGENT_ID,
          user_input: userInput,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Process the Agent.AI response to extract pharmacy information
      const pharmacies = extractPharmaciesFromResponse(data.response, {
        lat: Number.parseFloat(lat || "9.0222"),
        lng: Number.parseFloat(lng || "38.7468"),
      })

      return NextResponse.json(pharmacies.length > 0 ? pharmacies : mockPharmacies)
    } catch (error) {
      console.error("Error fetching pharmacies from Agent.AI:", error)
      // Return mock data if API call fails
      return NextResponse.json(mockPharmacies)
    }
  } catch (error) {
    console.error("Error in pharmacies API route:", error)
    return NextResponse.json({ error: "Failed to fetch pharmacies" }, { status: 500 })
  }
}

// Helper function to extract pharmacy information from AI response
function extractPharmaciesFromResponse(text: string, defaultLocation: { lat: number; lng: number }): Pharmacy[] {
  // This is a simplified extraction - you'll need more sophisticated parsing
  // based on how your Agent.AI formats the response
  try {
    // For now, return mock data as a fallback
    return []
  } catch (error) {
    console.error("Error extracting pharmacies from response:", error)
    return []
  }
}

// Generate mock pharmacy data based on location
function getMockPharmacies(
  locationName: string,
  coordinates: { lat: number; lng: number },
  medicine?: string | null,
): Pharmacy[] {
  const pharmacyNames = [
    "Gishen Pharmacy",
    "Kenema Pharmacy",
    "Teklehaimanot Pharmacy",
    "Zewditu Pharmacy",
    "Bole Pharmacy",
  ]

  const addresses = [
    "Bole Road, Addis Ababa, Ethiopia",
    "Churchill Avenue, Addis Ababa, Ethiopia",
    "Teklehaimanot Square, Addis Ababa, Ethiopia",
    "Zewditu Road, Addis Ababa, Ethiopia",
    "Bole Medhanialem, Addis Ababa, Ethiopia",
  ]

  const phones = ["+251 11 551 7272", "+251 11 551 8383", "+251 11 551 9494", "+251 11 551 6161", "+251 11 551 5252"]

  const hours = [
    "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
    "Open 24 hours",
    "Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-7PM",
    "Mon-Sat: 9AM-7PM, Sun: 10AM-5PM",
    "Mon-Fri: 8:30AM-8:30PM, Sat-Sun: 9AM-6PM",
  ]

  // Generate 3-5 pharmacies
  const count = Math.floor(Math.random() * 3) + 3
  const pharmacies: Pharmacy[] = []

  for (let i = 0; i < count; i++) {
    // Generate a random offset for lat/lng to simulate different locations
    const latOffset = (Math.random() - 0.5) * 0.01
    const lngOffset = (Math.random() - 0.5) * 0.01

    pharmacies.push({
      name: pharmacyNames[i % pharmacyNames.length],
      address: addresses[i % addresses.length],
      phone: phones[i % phones.length],
      hours: hours[i % hours.length],
      distance: Number.parseFloat((Math.random() * 2 + 0.5).toFixed(1)),
      lat: coordinates.lat + latOffset,
      lng: coordinates.lng + lngOffset,
      website:
        i % 3 === 0
          ? null
          : `https://example.com/${pharmacyNames[i % pharmacyNames.length].toLowerCase().replace(/\s+/g, "")}`,
    })
  }

  // Sort by distance
  return pharmacies.sort((a, b) => a.distance - b.distance)
}

