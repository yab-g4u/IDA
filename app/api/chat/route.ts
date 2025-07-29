import { streamText } from "ai"
import { google } from "@ai-sdk/google"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: google("models/gemini-1.5-flash-latest", {
        apiKey: process.env.GEMINI_API_KEY,
      }),
      messages,
      maxTokens: 200,
      system: `You are a helpful medical assistant. Provide concise, accurate information about medicines and health topics. 
      Keep responses under 200 tokens. Focus on essential information only. 
      Always recommend consulting healthcare professionals for medical advice.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
