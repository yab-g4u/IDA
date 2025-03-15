import Moralis from "moralis"

// Initialize Moralis
export const initMoralis = async () => {
  try {
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    })
    console.log("Moralis initialized successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize Moralis:", error)
    return false
  }
}

// Smart contract details
const MEDICINE_MARKETPLACE_ADDRESS = "0x123456789abcdef123456789abcdef123456789" // Replace with actual contract address
const MEDICINE_MARKETPLACE_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "uint256", name: "_price", type: "uint256" },
    ],
    name: "listMedicine",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
    name: "buyMedicine",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMedicines",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "address", name: "seller", type: "address" },
          { internalType: "bool", name: "sold", type: "bool" },
        ],
        internalType: "struct MedicineMarketplace.Medicine[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
]

// Connect to wallet - Fixed to handle MetaMask directly without ethers
export const connectWallet = async (): Promise<string | null> => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // Request account access directly from MetaMask
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      return accounts[0] || null
    } catch (error) {
      console.error("Error connecting to wallet:", error)
      return null
    }
  } else {
    console.error("MetaMask not installed")
    return null
  }
}

// Get contract instance - For demo purposes, we'll mock this
export const getContract = async () => {
  // In a real implementation, we would use ethers.js to create a contract instance
  // For the hackathon demo, we'll return a mock contract with the necessary methods
  return {
    listMedicine: async (name: string, price: number) => {
      console.log(`Listing medicine: ${name} for ${price} ETB`)
      return { wait: async () => true }
    },
    buyMedicine: async (id: number, options: { value: any }) => {
      console.log(`Buying medicine with ID: ${id} for ${options.value} ETB`)
      return { wait: async () => true }
    },
  }
}

// List medicine on the blockchain
export const listMedicine = async (name: string, price: number): Promise<boolean> => {
  try {
    const contract = await getContract()
    if (!contract) return false

    const tx = await contract.listMedicine(name, price)
    await tx.wait()
    return true
  } catch (error) {
    console.error("Error listing medicine:", error)
    return false
  }
}

// Buy medicine from the blockchain
export const buyMedicine = async (id: number, price: number): Promise<boolean> => {
  try {
    const contract = await getContract()
    if (!contract) return false

    // For demo purposes, we're not actually converting to Wei
    const tx = await contract.buyMedicine(id, { value: price })
    await tx.wait()
    return true
  } catch (error) {
    console.error("Error buying medicine:", error)
    return false
  }
}

// Get token balance - Mocked for demo
export const getTokenBalance = async (address: string): Promise<number> => {
  try {
    // For demo purposes, return a random balance between 100 and 500
    return Math.floor(Math.random() * 400) + 100
  } catch (error) {
    console.error("Error getting token balance:", error)
    return 0
  }
}

// Get transaction history - Mocked for demo
export const getTransactionHistory = async (address: string) => {
  try {
    // For demo purposes, return an empty array
    return []
  } catch (error) {
    console.error("Error getting transaction history:", error)
    return []
  }
}

