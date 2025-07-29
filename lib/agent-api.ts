import type { Pharmacy } from "@/types/pharmacy"

// Agent.AI webhook URL
const AGENT_WEBHOOK_URL = "https://api-lr.agent.ai/v1/agent/f7fc2inbnqcb6pri/webhook/605d3e8c"
const AGENT_RUN_ID = "3423bdc24bd741b49bcdff19f00fd30d"

// Function to call the Agent.AI webhook
export async function callAgentAPI(location: string, medicine?: string) {
  try {
    const response = await fetch(AGENT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_location: location,
        run_id: AGENT_RUN_ID,
        medicine: medicine || undefined,
      }),
    })

    if (!response.ok) {
      throw new Error(`Agent.AI webhook error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calling Agent.AI webhook:", error)
    throw error
  }
}

// Function to parse Agent.AI response for pharmacies
export function parseAgentPharmacyResponse(response: any): Pharmacy[] {
  try {
    if (!response || !response.response) {
      return []
    }

    const text = response.response
    console.log("Agent.AI response:", text)

    // Simple parsing - extract pharmacy blocks
    const pharmacyBlocks = text.split(/Pharmacy \d+:|Pharmacy:/i).filter(Boolean)

    if (pharmacyBlocks.length === 0) {
      // Try alternative parsing if no pharmacy blocks found
      const lines = text.split("\n")
      const pharmacies: Pharmacy[] = []
      let currentPharmacy: Partial<Pharmacy> = {}

      for (const line of lines) {
        const trimmedLine = line.trim()
        if (!trimmedLine) continue

        if (trimmedLine.match(/^[A-Z][\w\s]+Pharmacy/i) || trimmedLine.match(/^[A-Z][\w\s]+Drug Store/i)) {
          // New pharmacy found
          if (Object.keys(currentPharmacy).length > 0 && currentPharmacy.name) {
            // Add previous pharmacy to list
            pharmacies.push({
              name: currentPharmacy.name || "Unknown Pharmacy",
              address: currentPharmacy.address || "Address not available",
              phone: currentPharmacy.phone || "Phone not available",
              hours: currentPharmacy.hours || "Hours not available",
              distance: currentPharmacy.distance || 0,
              lat: currentPharmacy.lat || 9.0222,
              lng: currentPharmacy.lng || 38.7468,
              website: currentPharmacy.website || null,
            })
          }

          // Start new pharmacy
          currentPharmacy = { name: trimmedLine }
        } else if (trimmedLine.match(/address|location/i)) {
          currentPharmacy.address = trimmedLine.replace(/address:|location:/i, "").trim()
        } else if (trimmedLine.match(/phone|contact|tel/i)) {
          currentPharmacy.phone = trimmedLine.replace(/phone:|contact:|tel:/i, "").trim()
        } else if (trimmedLine.match(/hours|time|open/i)) {
          currentPharmacy.hours = trimmedLine.replace(/hours:|time:|open:/i, "").trim()
        } else if (trimmedLine.match(/distance|km|meters/i)) {
          const distanceMatch = trimmedLine.match(/(\d+\.?\d*)\s*(km|m)/i)
          if (distanceMatch) {
            const value = Number.parseFloat(distanceMatch[1])
            const unit = distanceMatch[2].toLowerCase()
            currentPharmacy.distance = unit === "km" ? value : value / 1000
          }
        } else if (currentPharmacy.address === undefined) {
          // If no specific field identified and address is not set, assume it's the address
          currentPharmacy.address = trimmedLine
        }
      }

      // Add the last pharmacy if exists
      if (Object.keys(currentPharmacy).length > 0 && currentPharmacy.name) {
        pharmacies.push({
          name: currentPharmacy.name || "Unknown Pharmacy",
          address: currentPharmacy.address || "Address not available",
          phone: currentPharmacy.phone || "Phone not available",
          hours: currentPharmacy.hours || "Hours not available",
          distance: currentPharmacy.distance || 0,
          lat: currentPharmacy.lat || 9.0222,
          lng: currentPharmacy.lng || 38.7468,
          website: currentPharmacy.website || null,
        })
      }

      return pharmacies
    }

    return pharmacyBlocks.map((block: string, index: number) => {
      const lines = block.trim().split("\n").filter(Boolean)

      // Extract what we can from the text
      const name = lines[0]?.trim() || "Unknown Pharmacy"

      // Extract address
      const addressLine = lines.find((l) => l.includes("Address:") || l.includes("Location:"))
      const address = addressLine ? addressLine.replace(/Address:|Location:/i, "").trim() : "Address not available"

      // Extract phone
      const phoneLine = lines.find((l) => l.includes("Phone:") || l.includes("Contact:"))
      const phone = phoneLine ? phoneLine.replace(/Phone:|Contact:/i, "").trim() : "Phone not available"

      // Extract hours
      const hoursLine = lines.find((l) => l.includes("Hours:") || l.includes("Operating hours:"))
      const hours = hoursLine ? hoursLine.replace(/Hours:|Operating hours:/i, "").trim() : "Hours not available"

      // Extract distance
      const distanceLine = lines.find((l) => l.includes("Distance:") || l.includes("km") || l.includes("meters"))
      let distance = 0
      if (distanceLine) {
        const distanceMatch = distanceLine.match(/(\d+\.?\d*)\s*(km|m)/i)
        if (distanceMatch) {
          const value = Number.parseFloat(distanceMatch[1])
          const unit = distanceMatch[2].toLowerCase()
          distance = unit === "km" ? value : value / 1000
        }
      }

      // Generate coordinates based on distance (for map display)
      // This is a simplification - in a real app, you'd get actual coordinates
      const latOffset = (Math.random() - 0.5) * 0.01 * (distance || 1)
      const lngOffset = (Math.random() - 0.5) * 0.01 * (distance || 1)

      return {
        name,
        address,
        phone,
        hours,
        distance: distance || index * 0.5 + 0.5, // Fallback distance if not found
        lat: 9.0222 + latOffset, // Default to Addis Ababa with offset
        lng: 38.7468 + lngOffset,
        website: null,
      }
    })
  } catch (error) {
    console.error("Error parsing Agent.AI pharmacy response:", error)
    return []
  }
}
