"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase-client"
import { useWallet } from "@/hooks/use-wallet"
import { useRouter } from "next/navigation"
import { User, Wallet, History, Settings, LogOut } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const { walletAddress, walletBalance, connectWallet, disconnectWallet } = useWallet()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)
        } else {
          // Redirect to auth page if not logged in
          router.push("/auth")
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-medium text-xs truncate">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">{new Date(user.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            {walletAddress ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-medium text-xs truncate">{walletAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IDT Balance</p>
                  <p className="font-medium">{walletBalance} IDT</p>
                </div>
                <Button variant="outline" onClick={disconnectWallet} className="w-full">
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">No wallet connected</p>
                <Button onClick={() => connectWallet()} className="w-full">
                  Connect Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/my-orders")}>
                <History className="mr-2 h-4 w-4" />
                Transaction History
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/marketplace")}>
                <Wallet className="mr-2 h-4 w-4" />
                Marketplace
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
