import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { medicineName } = await request.json()

    if (!medicineName) {
      return NextResponse.json({ error: "Medicine name is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `Provide detailed information about the medicine "${medicineName}". Include:
    1. Generic name and brand names
    2. What it's used for (indications)
    3. How it works (mechanism of action)
    4. Common dosage forms and strengths
    5. Typical dosing instructions
    6. Common side effects
    7. Important warnings or contraindications
    8. Storage instructions

    Please provide accurate, medical information in a clear, organized format. If this is not a recognized medicine, please state that clearly.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      information: text,
      medicineName,
    })
  } catch (error) {
    console.error("Error fetching medicine information:", error)
    return NextResponse.json({ error: "Failed to fetch medicine information" }, { status: 500 })
  }
}
