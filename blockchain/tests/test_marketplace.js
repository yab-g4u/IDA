// Test utilities for marketplace functionality
// This is for hackathon demo purposes only

// Generate mock transaction data
export const testTransaction = {
  createTransaction: (cartItems, userId) => {
    const totalAmount = cartItems.reduce((total, item) => total + item.price, 0) + 60 // Including fees
    const totalRewards = cartItems.reduce((total, item) => total + item.tokenRewards, 0)
    const txHash = `0x${Math.random().toString(16).substring(2, 10)}...`

    return {
      id: `tx${Date.now()}`,
      date: new Date().toLocaleString(),
      medicineName: cartItems.map((item) => item.medicineName).join(", "),
      pharmacy: cartItems[0].pharmacy,
      amount: totalAmount,
      status: "completed",
      tokenReward: totalRewards,
      txHash: txHash,
    }
  },
}

// Test wallet functionality
export const testWallet = {
  generateAddress: () => {
    // Generate a random Ethereum-like address for testing
    const chars = "0123456789abcdef"
    let address = "0x"
    for (let i = 0; i < 40; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address
  },

  getBalance: () => {
    // Return a random balance for testing
    return Math.floor(Math.random() * 500) + 100
  },

  simulateTransaction: (amount) => {
    // Simulate a blockchain transaction
    return {
      success: Math.random() > 0.1, // 90% success rate
      hash: `0x${Math.random().toString(16).substring(2, 30)}`,
      confirmations: Math.floor(Math.random() * 12) + 1,
    }
  },
}


