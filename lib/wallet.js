// Wallet functionality for the marketplace
// This is a simplified implementation for the hackathon

import { ethers } from "ethers"

// Check if MetaMask is installed
export const checkIfWalletIsInstalled = () => {
  return typeof window !== "undefined" && window.ethereum !== undefined
}

// Connect to wallet
export const connectWallet = async () => {
  if (!checkIfWalletIsInstalled()) {
    throw new Error("MetaMask is not installed")
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
    return accounts[0]
  } catch (error) {
    console.error("Error connecting to wallet:", error)
    throw error
  }
}

// Get wallet balance
export const getWalletBalance = async (address) => {
  if (!checkIfWalletIsInstalled()) {
    throw new Error("MetaMask is not installed")
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(address)
    return ethers.utils.formatEther(balance)
  } catch (error) {
    console.error("Error getting wallet balance:", error)
    throw error
  }
}

// Send transaction
export const sendTransaction = async (to, amount) => {
  if (!checkIfWalletIsInstalled()) {
    throw new Error("MetaMask is not installed")
  }

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    // Convert amount to wei
    const amountWei = ethers.utils.parseEther(amount.toString())

    // Send transaction
    const tx = await signer.sendTransaction({
      to,
      value: amountWei,
    })

    return tx
  } catch (error) {
    console.error("Error sending transaction:", error)
    throw error
  }
}

// For hackathon demo - simulate wallet functionality
export const simulateWallet = {
  connect: () => {
    return `0x${Math.random().toString(16).substring(2, 42)}`
  },

  getBalance: () => {
    return Math.floor(Math.random() * 10) + 1
  },

  sendTransaction: (to, amount) => {
    return {
      hash: `0x${Math.random().toString(16).substring(2, 66)}`,
      confirmations: 1,
      from: `0x${Math.random().toString(16).substring(2, 42)}`,
      to: to,
      value: ethers.utils.parseEther(amount.toString()),
      success: true,
    }
  },
}
