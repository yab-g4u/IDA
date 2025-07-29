"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface WalletConnectProps {
  onWalletConnect?: (connected: boolean, balance: number) => void
}

const WalletConnect = ({ onWalletConnect }: WalletConnectProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState(100)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if wallet is already connected from localStorage
    const walletStatus = localStorage.getItem("walletConnected")
    if (walletStatus === "true") {
      setIsConnected(true)
      const storedBalance = localStorage.getItem("walletBalance")
      setBalance(storedBalance ? Number.parseFloat(storedBalance) : 100)

      // Notify parent component if needed
      if (onWalletConnect) {
        onWalletConnect(true, storedBalance ? Number.parseFloat(storedBalance) : 100)
      }
    }
  }, [onWalletConnect])

  const connectWallet = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in before connecting your wallet.",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    if (isConnected) {
      // Disconnect wallet
      setIsConnected(false)
      localStorage.removeItem("walletConnected")
      localStorage.removeItem("walletBalance")
      localStorage.removeItem("walletConnectedToast") // Clear toast flag

      if (onWalletConnect) {
        onWalletConnect(false, 0)
      }

      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully.",
      })
      return
    }

    // Simulate connecting to wallet
    setIsConnecting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsConnected(true)
      localStorage.setItem("walletConnected", "true")
      localStorage.setItem("walletBalance", balance.toString())

      if (onWalletConnect) {
        onWalletConnect(true, balance)
      }

      // Only show toast once when connecting
      if (!localStorage.getItem("walletConnectedToast")) {
        toast({
          title: "Wallet Connected",
          description: `Your wallet has been connected successfully. You have ${balance} IDT tokens.`,
        })
        localStorage.setItem("walletConnectedToast", "true")
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      onClick={connectWallet}
      disabled={isConnecting}
      className="flex items-center"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : isConnected ? "Wallet Connected" : "Connect Wallet"}
    </Button>
  )
}

export default WalletConnect
