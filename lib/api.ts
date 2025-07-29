import type { MedicineInfo } from "@/types/medicine"
import type { Pharmacy } from "@/types/pharmacy"
import { medicineDatabase } from "@/lib/medicine-data"
import type { Medicine } from "@/types/medicine"

// This is where you'll integrate with your agent.ai webhook
const API_ENDPOINT = "/api/agent"

// Define the Medicine type to match what's expected in the component
// interface Medicine {
//   name: string
//   category: string
//   description: string
//   usageInstructions: string
//   sideEffects: string[]
//   warnings: string[]
//   interactions: string[]
//   storageInstructions: string
//   dosageInfo: Array<{
//     ageGroup: string
//     dosage: string
//     frequency: string
//   }>
// }

// Function to fetch medicine information by name or ID
export async function fetchMedicineInfo(nameOrId: string): Promise<Medicine> {
  // Normalize the search term (convert to lowercase for case-insensitive search)
  const searchTerm = nameOrId.toLowerCase()

  // First, try to find an exact match by name (case-insensitive)
  const exactMatch = Object.entries(medicineDatabase).find(([key]) => key.toLowerCase() === searchTerm)

  if (exactMatch) {
    return exactMatch[1]
  }

  // If no exact match, try to find a medicine that contains the search term
  const partialMatch = Object.entries(medicineDatabase).find(([key]) => key.toLowerCase().includes(searchTerm))

  if (partialMatch) {
    return partialMatch[1]
  }

  // If no match found, throw an error
  throw new Error(`Medicine "${nameOrId}" not found`)
}

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
