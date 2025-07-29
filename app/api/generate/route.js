import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyAIKeHH3kRnp3RU4C5Blcgo62vkHnSyNg0")

export async function POST(request) {
  try {
    // Get the request data
    const data = await request.json()
    const { medicineName } = data

    if (!medicineName) {
      return NextResponse.json({ error: "Medicine name is required" }, { status: 400 })
    }

    // Create a prompt for medicine information
    const prompt = `
      Provide detailed information about the medicine: ${medicineName}. 
      Include information about its uses, side effects, benefits, precautions, medical history considerations, 
      inhibitor testing requirements, and dosage information for different age groups. 
      Format the response with clear section headers: Uses, Side Effects, Benefits, Precautions, Medical History, Inhibitor Testing, and Ages & Dosage.
    `

    // Get the model - using gemini-pro instead of gemini-1.0-pro
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Generate content using Gemini
    const result = await model.generateContent({
      contents: [{ parts: [{ text: prompt }] }],
    })

    // Extract the response text
    const response = result.response
    const output = response.text()

    // Return the generated content
    return NextResponse.json({
      success: true,
      medicineName,
      output,
    })
  } catch (error) {
    console.error("Error generating medicine information:", error)

    // Return a more detailed error message
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate medicine information: " + error.message,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
