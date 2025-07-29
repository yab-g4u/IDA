import { type NextRequest, NextResponse } from "next/server"

// This would be where you'd use the MORALIS_API_KEY securely on the server
// For now, we'll return mock data

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action")

  try {
    switch (action) {
      case "balance":
        return NextResponse.json({
          idt: Math.floor(Math.random() * 1000) + 100,
          eth: Math.random() * 10,
          btc: Math.random() * 0.1,
        })

      case "transactions":
        return NextResponse.json([
          {
            id: "1",
            type: "buy",
            amount: 50,
            currency: "IDT",
            timestamp: new Date(Date.now() - 86400000),
            status: "completed",
            description: "Purchased Paracetamol",
          },
          {
            id: "2",
            type: "transfer",
            amount: 25,
            currency: "IDT",
            timestamp: new Date(Date.now() - 172800000),
            status: "completed",
            description: "Received tokens",
          },
        ])

      case "medicines":
        return NextResponse.json([
          {
            id: "1",
            name: "Paracetamol 500mg",
            price: 25,
            seller: "0x123...abc",
            image: "/placeholder.svg?height=100&width=100",
            description: "Pain relief medication",
            inStock: true,
          },
        ])

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Blockchain API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, ...data } = await req.json()

    switch (action) {
      case "buy":
        // Simulate purchase transaction
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return NextResponse.json({
          id: Date.now().toString(),
          type: "buy",
          amount: data.amount,
          currency: "IDT",
          timestamp: new Date(),
          status: "completed",
          description: `Purchased medicine #${data.medicineId}`,
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Blockchain API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
