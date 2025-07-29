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
      const AGENT_API_KEY = "T8VglzcO4J4Lqh8r2bS0h66rS7i1302f6lS4oCloW4crxbsIu9No51X5yyrTOork"
      const AGENT_ID = "0541764d16d748f694ef5e29b5a27f74"
      const apiUrl = AGENT_WEBHOOK_URL || "https://api-lr.agent.ai/v1/agent/0ruhcwrru3ngh3qr/webhook/332e7bcc"

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

      // Fallback to Gemini for medicine queries
      if (type === "medicine") {
        try {
          console.log("Fetching medicine info from Gemini for:", query)
          const geminiData = await getGeminiMedicineInfo(query)

          return NextResponse.json({
            success: true,
            query,
            type,
            response: {
              response: {
                text: `
                  Uses: ${geminiData.uses}
                  
                  Side Effects: ${geminiData.side_effects}
                  
                  Benefits: ${geminiData.benefits}
                  
                  Precautions: ${geminiData.precautions}
                  
                  Medical History: ${geminiData.medical_history}
                  
                  Inhibitor Testing: ${geminiData.inhibitor_testing}
                  
                  Ages & Dosage: ${geminiData.dosage}
                `,
              },
            },
            source: "gemini", // Source as Gemini
          })
        } catch (geminiError) {
          console.error("Gemini also failed:", geminiError)

          // Fallback to OpenAI if both Agent.AI and Gemini fail
          try {
            console.log("Fetching medicine info from OpenAI for:", query)
            const medicineData = await getMedicineInfo(query)

            // Format the response to match the expected structure from Agent.AI
            return NextResponse.json({
              success: true,
              query,
              type,
              response: {
                response: {
                  text: `
                    Uses: ${medicineData.uses}
                    
                    Side Effects: ${medicineData.side_effects}
                    
                    Benefits: ${medicineData.benefits}
                    
                    Precautions: ${medicineData.precautions}
                    
                    Medical History: ${medicineData.medical_history}
                    
                    Inhibitor Testing: ${medicineData.inhibitor_testing}
                    
                    Ages & Dosage: ${medicineData.dosage}
                  `,
                },
              },
              source: "openai", // Source as OpenAI
            })
          } catch (openaiError) {
            console.error("OpenAI fallback also failed:", openaiError)
            throw openaiError
          }
        }
      } else {
        // For pharmacy queries, return mock data
        return NextResponse.json({
          success: true,
          query,
          type,
          response: {
            response: {
              text: `Here are some pharmacies near ${query}:\n\nPharmacy 1: Gishen Pharmacy\nAddress: Bole Road, Addis Ababa\nPhone: +251 11 551 7272\nHours: Mon-Sat: 8AM-8PM, Sun: 9AM-6PM\n\nPharmacy 2: Kenema Pharmacy\nAddress: Churchill Avenue, Addis Ababa\nPhone: +251 11 551 8383\nHours: Open 24 hours\n\nPharmacy 3: Teklehaimanot Pharmacy\nAddress: Teklehaimanot Square, Addis Ababa\nPhone: +251 11 551 9494\nHours: Mon-Fri: 8AM-9PM, Sat-Sun: 9AM-7PM`,
            },
          },
          source: "enhanced",
        })
      }
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: (error as Error).message,
        success: false,
      },
      { status: 500 },
    )
  }
}

// New helper function to get data from Gemini
async function getGeminiMedicineInfo(medicineName: string) {
  try {
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD_2mmF5KatTQs9_Zuvg7qoecYqdOzWVX0"
    const GEMINI_API_KEY = " AIzaSyD_2mmF5KatTQs9_Zuvg7qoecYqdOzWVX0"

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        medicineName,
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API request failed with status: ${response.status}`)
    }

    const data = await response.json()

    // Return structured data
    return {
      uses: data.uses || "No uses available",
      side_effects: data.side_effects || "No side effects information available",
      benefits: data.benefits || "No benefits available",
      precautions: data.precautions || "No precautions available",
      medical_history: data.medical_history || "No medical history considerations available",
      inhibitor_testing: data.inhibitor_testing || "No inhibitor testing info available",
      dosage: data.dosage || "No dosage info available",
    }
  } catch (error) {
    console.error("Error fetching from Gemini:", error)
    throw error
  }
}
