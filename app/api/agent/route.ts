import { NextResponse } from "next/server"
import { getMedicineInfo } from "@/utils/gemini"

export async function POST(request: Request) {
  try {
    const { query, type = "medicine" } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Construct the appropriate prompt based on the type
    let userInput = ""
    if (type === "medicine") {
      userInput = `Tell me about the medicine ${query}. Include details about its uses, side effects, benefits, monitoring precautions, medical history considerations, inhibitor testing, and appropriate ages and dosages.`
    } else if (type === "pharmacy") {
      userInput = `Find pharmacies near ${query} that sell medicines. Include details about each pharmacy's name, address, phone number, operating hours, and available services.`
    } else {
      return NextResponse.json({ error: "Invalid query type" }, { status: 400 })
    }

    console.log(`Sending request to Agent.AI for ${type} query: ${query}`)

    try {
      // Try to use the webhook URL if available, otherwise use direct API call
      const AGENT_WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL
      const AGENT_API_KEY = NEXT.env.AGENT_API_KEY
      const AGENT_ID = NEXT.env.AGENT_ID
      const apiUrl = AGENT_WEBHOOK_URL || NEXT.env.AGENT_WEBHOOK_URL

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AGENT_API_KEY}`,
        },
        body: JSON.stringify({
          id: AGENT_ID,
          user_input: userInput,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Agent.AI response received successfully")

      return NextResponse.json({
        success: true,
        query,
        type,
        response: data,
      })
    } catch (agentError) {
      console.error("Error with Agent.AI, falling back to Gemini:", agentError)

    



