import type { MedicineInfo } from "@/types/medicine"
import type { Pharmacy } from "@/types/pharmacy"

// This is where you'll integrate with your agent.ai webhook
const API_ENDPOINT = "/api/agent"

export async function searchMedicine(query: string): Promise<MedicineInfo> {
  try {
    const response = await fetch(`/api/medicine?query=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error("Failed to fetch medicine information")
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching medicine:", error)
    throw error
  }
}

export async function findPharmacies(params: {
  location: any
  medicine?: string
}): Promise<Pharmacy[]> {
  try {
    const queryParams = new URLSearchParams()

    if (typeof params.location === "string") {
      queryParams.append("location", params.location)
    } else if (params.location) {
      queryParams.append("lat", params.location.lat.toString())
      queryParams.append("lng", params.location.lng.toString())
    }

    if (params.medicine) {
      queryParams.append("medicine", params.medicine)
    }

    const response = await fetch(`/api/pharmacies?${queryParams.toString()}`)

    if (!response.ok) {
      throw new Error("Failed to fetch pharmacies")
    }

    return await response.json()
  } catch (error) {
    console.error("Error finding pharmacies:", error)
    throw error
  }
}

