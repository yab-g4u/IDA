import { streamText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  try {
    const { messages, medicineName } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return new Response("API key not configured", { status: 500 })
    }

    const systemPrompt = `You are a helpful medical AI assistant specializing in medicine information. 
    The user is asking about the medicine: ${medicineName}
    
    Please provide accurate, helpful, and concise medical information. 
    Keep responses under 200 tokens and focus on the specific question asked.
    Always remind users to consult healthcare professionals for medical advice.
    
    If you're not certain about specific medical information, say so clearly.`

    const result = await streamText({
      model: google("gemini-2.0-flash-exp", {
        apiKey: apiKey,
      }),
      system: systemPrompt,
      messages,
      maxTokens: 200,
      temperature: 0.3,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
