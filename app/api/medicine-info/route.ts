import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { medicineName } = await request.json()

    if (!medicineName) {
      return NextResponse.json({ error: "Medicine name is required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const prompt = `
    Please provide detailed medical information about the medicine "${medicineName}" in a clear, structured format. 
    Make sure the information is accurate and suitable for patients in Ethiopia. 
    If the medicine doesn't exist or you're not sure, please indicate that clearly.

    Please include:
    - What this medicine is and what it treats
    - How to use this medicine
    - Common side effects
    - Important warnings and precautions
    - Drug interactions
    - Storage instructions
    - Dosage information for different age groups

    Format the response in a clear, readable way with proper sections.
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      throw new Error("No response from Gemini API")
    }

    // Check if the medicine was found
    if (
      responseText.toLowerCase().includes("not recognized") ||
      responseText.toLowerCase().includes("does not exist") ||
      responseText.toLowerCase().includes("i don't have information")
    ) {
      return NextResponse.json({
        success: false,
        error: `Medicine "${medicineName}" not found. Please check the spelling or try a different medicine name.`,
      })
    }

    return NextResponse.json({
      success: true,
      information: responseText,
    })
  } catch (error) {
    console.error("Error fetching medicine info:", error)
    return NextResponse.json({ error: "Failed to fetch medicine information. Please try again." }, { status: 500 })
  }
}
