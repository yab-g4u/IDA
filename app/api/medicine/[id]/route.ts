import { type NextRequest, NextResponse } from "next/server"
import { medicines } from "@/lib/medicine-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const medicineId = params.id

    // Find the medicine by ID or name
    const medicine = medicines.find((m) => m.id === medicineId || m.name.toLowerCase() === medicineId.toLowerCase())

    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
    }

    return NextResponse.json(medicine)
  } catch (error) {
    console.error("Error fetching medicine by ID:", error)
    return NextResponse.json({ error: "Failed to fetch medicine information" }, { status: 500 })
  }
}
