"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { testWallet } from "@/lib/marketplacetest"

interface WalletContextType {
  walletAddress: string | null
  connectWallet: (address?: string) => Promise<void>
  disconnectWallet: () => void
  idtBalance: number
  updateBalance: (newBalance: number) => void
  addToBalance: (amount: number) => void
  isConnecting: boolean
  isTestWallet: boolean
  connectTestWallet: () => Promise<void>
  walletBalance: number // Added for compatibility
}

// Export the context so it can be imported in use-wallet.ts
export const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  idtBalance: 0,
  updateBalance: () => {},
  addToBalance: () => {},
  isConnecting: false,
  isTestWallet: false,
  connectTestWallet: async () => {},
  walletBalance: 0,
})

export const useWallet = () => useContext(WalletContext)

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [idtBalance, setIdtBalance] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isTestWallet, setIsTestWallet] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const { toast } = useToast()

  // Check for existing wallet connection on load
  useEffect(() => {
    const loadWalletFromStorage = () => {
      try {
        const storedWallet = localStorage.getItem("ida_wallet_address")
        const storedBalance = localStorage.getItem("ida_wallet_balance")
        const storedIsTest = localStorage.getItem("ida_is_test_wallet")

        if (storedWallet) {
          setWalletAddress(storedWallet)
          setIdtBalance(storedBalance ? Number.parseInt(storedBalance, 10) : 0)
          setIsTestWallet(storedIsTest === "true")
        }
      } catch (error) {
        console.error("Error loading wallet from storage:", error)
      }
    }

    loadWalletFromStorage()
  }, [])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUserId(session?.user?.id || null)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Save wallet state to storage when it changes
  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem("ida_wallet_address", walletAddress)
      localStorage.setItem("ida_wallet_balance", idtBalance.toString())
      localStorage.setItem("ida_is_test_wallet", isTestWallet.toString())
    } else {
      localStorage.removeItem("ida_wallet_address")
      localStorage.removeItem("ida_wallet_balance")
      localStorage.removeItem("ida_is_test_wallet")
    }
  }, [walletAddress, idtBalance, isTestWallet])

  const connectWallet = async (address?: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in before connecting your wallet",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // If address is provided, use it directly
      if (address) {
        // Don't show toast if already connected with this address
        if (walletAddress !== address) {
          setWalletAddress(address)
          setIsTestWallet(false)

          // Save wallet connection to database
          await supabase.from("user_wallets").upsert([
            {
              user_id: userId,
              wallet_address: address,
              is_test: false,
              last_connected: new Date().toISOString(),
            },
          ])

          toast({
            title: "Wallet Connected",
            description: `Wallet connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
          })
        }
      } else {
        // Simulate connecting to a real wallet
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate a random address
        const newAddress = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

        setWalletAddress(newAddress)
        setIsTestWallet(false)
        setIdtBalance(50) // Start with 50 IDT

        // Save wallet connection to database
        if (userId) {
          await supabase.from("user_wallets").upsert([
            {
              user_id: userId,
              wallet_address: newAddress,
              is_test: false,
              last_connected: new Date().toISOString(),
            },
          ])
        }

        toast({
          title: "Wallet Connected",
          description: `Wallet connected: ${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`,
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const connectTestWallet = async () => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in before connecting a test wallet",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Generate a test wallet address
      const testAddress = testWallet.generateAddress()

      // Don't show toast if already connected with a test wallet
      if (walletAddress !== testAddress) {
        setWalletAddress(testAddress)
        setIsTestWallet(true)
        setIdtBalance(100) // Start with 100 IDT for test wallets

        // Save wallet connection to database
        await supabase.from("user_wallets").upsert([
          {
            user_id: userId,
            wallet_address: testAddress,
            is_test: true,
            last_connected: new Date().toISOString(),
          },
        ])

        toast({
          title: "Test Wallet Connected",
          description: `Test wallet connected: ${testAddress.slice(0, 6)}...${testAddress.slice(-4)}`,
        })
      }
    } catch (error) {
      console.error("Error connecting test wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect test wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setIdtBalance(0)
    setIsTestWallet(false)

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  const updateBalance = (newBalance: number) => {
    setIdtBalance(newBalance)
  }

  const addToBalance = (amount: number) => {
    setIdtBalance((prev) => prev + amount)
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connectWallet,
        disconnectWallet,
        idtBalance,
        updateBalance,
        addToBalance,
        isConnecting,
        isTestWallet,
        connectTestWallet,
        walletBalance: idtBalance, // Add walletBalance as an alias for idtBalance
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
