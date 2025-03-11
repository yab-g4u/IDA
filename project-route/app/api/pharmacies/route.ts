import { type NextRequest, NextResponse } from "next/server"
import type { Pharmacy } from "@/types/pharmacy"

const AGENT_WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL

if (!AGENT_WEBHOOK_URL) {
  throw new Error("AGENT_WEBHOOK_URL is not defined in the environment variables")
}

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
    const response = await fetch(AGENT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: location || { lat, lng },
        medicine,
        type: "pharmacy_finder",
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Assuming the agent returns an array of pharmacies in the correct format
    // You might need to transform the data if the format differs
    const pharmacies: Pharmacy[] = data.map((pharmacy: any) => ({
      name: pharmacy.name,
      address: pharmacy.address,
      phone: pharmacy.phone,
      hours: pharmacy.hours,
      distance: pharmacy.distance,
      lat: pharmacy.lat,
      lng: pharmacy.lng,
      website: pharmacy.website,
    }))

    return NextResponse.json(pharmacies)
  } catch (error) {
    console.error("Error fetching pharmacies:", error)
    return NextResponse.json({ error: "Failed to fetch pharmacies" }, { status: 500 })
  }
}

