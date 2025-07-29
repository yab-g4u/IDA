// Mock blockchain service for demonstration purposes
// In a real application, this would connect to actual blockchain networks

export interface WalletBalance {
  idt: number
  eth: number
  btc: number
}

export interface Transaction {
  id: string
  type: "buy" | "sell" | "transfer"
  amount: number
  currency: string
  timestamp: Date
  status: "pending" | "completed" | "failed"
  description: string
}

export interface MedicineNFT {
  id: string
  name: string
  price: number
  seller: string
  image: string
  description: string
  inStock: boolean
}

class BlockchainService {
  private isConnected = false
  private walletAddress: string | null = null

  async connectWallet(): Promise<string> {
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1000))
    this.isConnected = true
    this.walletAddress = "0x" + Math.random().toString(16).substr(2, 40)
    return this.walletAddress
  }

  async disconnectWallet(): Promise<void> {
    this.isConnected = false
    this.walletAddress = null
  }

  async getBalance(): Promise<WalletBalance> {
    if (!this.isConnected) {
      throw new Error("Wallet not connected")
    }

    // Mock balance data
    return {
      idt: Math.floor(Math.random() * 1000) + 100,
      eth: Math.random() * 10,
      btc: Math.random() * 0.1,
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!this.isConnected) {
      throw new Error("Wallet not connected")
    }

    // Mock transaction data
    const mockTransactions: Transaction[] = [
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
    ]

    return mockTransactions
  }

  async listMedicine(): Promise<MedicineNFT[]> {
    // Mock medicine NFT data
    const mockMedicines: MedicineNFT[] = [
      {
        id: "1",
        name: "Paracetamol 500mg",
        price: 25,
        seller: "0x123...abc",
        image: "/placeholder.svg?height=100&width=100",
        description: "Pain relief medication",
        inStock: true,
      },
      {
        id: "2",
        name: "Amoxicillin 250mg",
        price: 45,
        seller: "0x456...def",
        image: "/placeholder.svg?height=100&width=100",
        description: "Antibiotic medication",
        inStock: true,
      },
    ]

    return mockMedicines
  }

  async buyMedicine(medicineId: string, amount: number): Promise<Transaction> {
    if (!this.isConnected) {
      throw new Error("Wallet not connected")
    }

    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: "buy",
      amount,
      currency: "IDT",
      timestamp: new Date(),
      status: "completed",
      description: `Purchased medicine #${medicineId}`,
    }

    return transaction
  }

  isWalletConnected(): boolean {
    return this.isConnected
  }

  getWalletAddress(): string | null {
    return this.walletAddress
  }
}

export const blockchainService = new BlockchainService()
