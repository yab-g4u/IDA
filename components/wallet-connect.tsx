"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle } from "lucide-react"
import { connectWallet } from "@/lib/blockchain-service"
import { useToast } from "@/components/ui/use-toast"

interface WalletConnectProps {
  onConnect?: (address: string) => void
}

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0])
            if (onConnect) onConnect(accounts[0])
          }
        })
        .catch(console.error)

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || null)
        if (accounts[0] && onConnect) onConnect(accounts[0])
      })
    }
  }, [onConnect])

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const address = await connectWallet()
      if (address) {
        setWalletAddress(address)
        if (onConnect) onConnect(address)
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Connection Failed",
          description: "Could not connect to wallet",
          icon: <AlertCircle className="h-5 w-5" />,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        icon: <AlertCircle className="h-5 w-5" />,
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting || !!walletAddress}
      variant={walletAddress ? "outline" : "default"}
      className="flex items-center gap-2"
    >
      <Wallet className="h-4 w-4" />
      {walletAddress
        ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
        : isConnecting
          ? "Connecting..."
          : "Connect Wallet"}
    </Button>
  )
}

