import { type NextRequest, NextResponse } from "next/server"
import type { MedicineInfo } from "@/types/medicine"

const AGENT_WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL

if (!AGENT_WEBHOOK_URL) {
  throw new Error("AGENT_WEBHOOK_URL is not defined in the environment variables")
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Medicine query is required" }, { status: 400 })
  }

  try {
    const response = await fetch(AGENT_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        type: "medicine_info",
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Assuming the agent returns data in the correct MedicineInfo format
    // You might need to transform the data if the format differs
    const medicineInfo: MedicineInfo = {
      name: data.name,
      category: data.category,
      description: data.description,
      usage: data.usage,
      sideEffects: data.sideEffects,
      precautions: data.precautions,
    }

    return NextResponse.json(medicineInfo)
  } catch (error) {
    console.error("Error fetching medicine info:", error)
    return NextResponse.json({ error: "Failed to fetch medicine information" }, { status: 500 })
  }
}

