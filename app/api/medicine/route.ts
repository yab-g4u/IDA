import { NextResponse } from "next/server"
import type { MedicineInfo } from "@/types/medicine"

const AGENT_WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL
const AGENT_API_KEY = "T8VglzcO4J4Lqh8r2bS0h66rS7i1302f6lS4oCloW4crxbsIu9No51X5yyrTOork"
const AGENT_ID = "0541764d16d748f694ef5e29b5a27f74"

if (!AGENT_WEBHOOK_URL) {
  console.warn("AGENT_WEBHOOK_URL is not defined in the environment variables, using direct API call")
}

export async function POST(request: Request) {
  try {
    const { medicineName }: { medicineName: string } = await request.json()

    if (!medicineName) {
      return NextResponse.json({ error: "Medicine name is required" }, { status: 400 })
    }

    // Try to use the webhook URL if available, otherwise use direct API call
    const apiUrl = AGENT_WEBHOOK_URL || "https://api-iz.agent.ai/v1/action/invoke_agent"

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AGENT_API_KEY}`,
      },
      body: JSON.stringify({
        id: AGENT_ID,
        user_input: `Tell me detailed information about the medicine: ${medicineName}. Include uses, side effects, benefits, monitoring precautions, medical history considerations, inhibitor testing requirements, and dosage information for different age groups.`,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Ensure data.response exists and handle it appropriately
    const responseText = data?.response || ""

    // Process the Agent.AI response to extract structured medicine information
    const medicineInfo: MedicineInfo = {
      name: medicineName,
      category: extractField(responseText, "category") || "Medication",
      description: responseText || "No description available",
      usage: extractField(responseText, "uses") || "Take as directed by your physician.",
      sideEffects: extractSideEffects(responseText) || ["No side effects information available"],
      precautions: extractPrecautions(responseText) || ["Consult your doctor before use"],
      benefits: extractField(responseText, "benefits") || "Helps manage symptoms and improve quality of life.",
      monitoring: extractField(responseText, "monitoring") || "Regular monitoring may be required.",
      medicalHistory:
        extractField(responseText, "medical history") || "Inform your doctor about any pre-existing conditions.",
      inhibitorTesting:
        extractField(responseText, "inhibitor testing") || "May be required before starting treatment.",
      agesDosage: extractField(responseText, "dosage") || "Adults: Standard dose. Children: Consult pediatrician.",
    }

    return NextResponse.json(medicineInfo)
  } catch (error) {
    console.error("Error fetching medicine info from Agent.AI:", error)
    return NextResponse.json({ error: "Failed to fetch medicine information" }, { status: 500 })
  }
}

// Helper functions to extract information from the AI response
function extractField(text: string, fieldName: string): string | null {
  const regex = new RegExp(`${fieldName}[:\\s]+(.*?)(?=\\n\\n|\\n[A-Z]|$)`, "i")
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function extractSideEffects(text: string): string[] | null {
  const sideEffectsSection = extractField(text, "side effects")
  if (!sideEffectsSection) return null

  return sideEffectsSection
    .split(/(?:\r?\n|\s*[•\-*]\s*)/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function extractPrecautions(text: string): string[] | null {
  const precautionsSection = extractField(text, "precautions")
  if (!precautionsSection) return null

  return precautionsSection
    .split(/(?:\r?\n|\s*[•\-*]\s*)/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}
