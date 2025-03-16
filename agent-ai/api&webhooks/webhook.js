import { NextResponse } from "next/server";

export async function queryAgentAI(userInput, query, type) {
  try {
    console.log(`Sending request to Agent.AI for ${type} query: ${query}`);

    // Use environment variables 
    const AGENT_WEBHOOK_URL = process.env.AGENT_WEBHOOK_URL;
    const AGENT_API_KEY = process.env.AGENT_API_KEY;
    const AGENT_ID = process.env.AGENT_ID;

    const apiUrl = AGENT_WEBHOOK_URL || "https://api-lr.agent.ai/v1/agent/0ruhcwrru3ngh3qr/webhook/332e7bcc";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

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
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Agent.AI response received successfully");

    return NextResponse.json({
      success: true,
      query,
      type,
      response: data,
    });
  } catch (error) {
    console.error("Error with Agent.AI:", error);
    throw error;
  }
}
