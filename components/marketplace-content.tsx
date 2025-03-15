"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ShoppingCart,
  Shield,
  Coins,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Truck,
  Star,
  Wallet,
  BarChart,
  Lock,
  FileText,
  ArrowRight,
  Loader2,
  Gift,
  Info,
  Calendar,
  Clock,
  MapPin,
  Percent,
  Award,
  CreditCard,
  History,
} from "lucide-react"
import AutoSuggestion from "./auto-suggestion"
import { ethiopianMedicines, filterSuggestions } from "@/lib/ethiopia-data"
import LoadingSpinner from "@/components/loading-spinner"
import Image from "next/image"
import WalletConnect from "./wallet-connect"
import { initMoralis, buyMedicine, getTokenBalance } from "@/lib/blockchain-service"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase-client"

// Types for marketplace
interface MedicineOffer {
  id: string
  medicineName: string
  pharmacy: string
  price: number
  rating: number
  verified: boolean
  inStock: boolean
  deliveryTime: string
  tokenRewards: number
  image: string
  blockchainId?: number // ID on the blockchain
}

interface Pharmacy {
  id: string
  name: string
  address: string
  rating: number
  verified: boolean
  tokenBalance: number
  transactionCount: number
}

interface Transaction {
  id: string
  date: string
  medicineName: string
  pharmacy: string
  amount: number
  status: "completed" | "pending" | "failed"
  tokenReward: number
  txHash: string
}

export default function MarketplaceContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [medicineSuggestions, setMedicineSuggestions] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("marketplace")
  const [medicineOffers, setMedicineOffers] = useState<MedicineOffer[]>([])
  const [topPharmacies, setTopPharmacies] = useState<Pharmacy[]>([])
  const [userTokens, setUserTokens] = useState(250)
  const [cart, setCart] = useState<MedicineOffer[]>([])
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isNewUser, setIsNewUser] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null)
  const [isPharmacyDialogOpen, setIsPharmacyDialogOpen] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineOffer | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isTransactionHistoryOpen, setIsTransactionHistoryOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Update suggestions when input changes
  useEffect(() => {
    setMedicineSuggestions(filterSuggestions(searchQuery, ethiopianMedicines))
  }, [searchQuery])

  // Initialize Moralis
  useEffect(() => {
    initMoralis().then((success) => {
      if (!success) {
        toast({
          variant: "destructive",
          title: "Blockchain Error",
          description: "Failed to initialize blockchain services",
          icon: <AlertCircle className="h-5 w-5" />,
        })
      }
    })
  }, [toast])

  // Update token balance when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      getTokenBalance(walletAddress).then((balance) => {
        if (isNewUser && balance === 0) {
          // Give new users 100 IDT for demo purposes
          setUserTokens(100)
          setIsNewUser(false)
          toast({
            title: t("welcomeGift"),
            description: t("welcomeGiftDescription"),
            icon: <Gift className="h-5 w-5 text-primary" />,
          })
        } else {
          setUserTokens(balance || 250) // Fallback to mock value if API fails
        }
      })
    } else {
      // Even without wallet connection, show 100 IDT for demo
      setUserTokens(100)
    }
  }, [walletAddress, isNewUser, toast, t])

  // Mock data for marketplace
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)

    // Mock medicine offers
    const mockMedicineOffers: MedicineOffer[] = [
      {
        id: "1",
        medicineName: "Amoxicillin",
        pharmacy: "Gishen Pharmacy",
        price: 120,
        rating: 4.8,
        verified: true,
        inStock: true,
        deliveryTime: "2-4 hours",
        tokenRewards: 12,
        image: "/placeholder.svg?height=100&width=100",
        blockchainId: 1,
      },
      {
        id: "2",
        medicineName: "Paracetamol",
        pharmacy: "Kenema Pharmacy",
        price: 45,
        rating: 4.5,
        verified: true,
        inStock: true,
        deliveryTime: "1-2 hours",
        tokenRewards: 5,
        image: "/placeholder.svg?height=100&width=100",
        blockchainId: 2,
      },
      {
        id: "3",
        medicineName: "Metformin",
        pharmacy: "Teklehaimanot Pharmacy",
        price: 85,
        rating: 4.2,
        verified: true,
        inStock: true,
        deliveryTime: "3-5 hours",
        tokenRewards: 9,
        image: "/placeholder.svg?height=100&width=100",
        blockchainId: 3,
      },
      {
        id: "4",
        medicineName: "Artemether/Lumefantrine",
        pharmacy: "Zewditu Pharmacy",
        price: 230,
        rating: 4.7,
        verified: true,
        inStock: true,
        deliveryTime: "4-6 hours",
        tokenRewards: 23,
        image: "/placeholder.svg?height=100&width=100",
        blockchainId: 4,
      },
      {
        id: "5",
        medicineName: "Omeprazole",
        pharmacy: "Bole Pharmacy",
        price: 75,
        rating: 4.4,
        verified: false,
        inStock: true,
        deliveryTime: "2-4 hours",
        tokenRewards: 8,
        image: "/placeholder.svg?height=100&width=100",
        blockchainId: 5,
      },
    ]

    // Mock top pharmacies
    const mockPharmacies: Pharmacy[] = [
      {
        id: "1",
        name: "Gishen Pharmacy",
        address: "Bole Road, Addis Ababa",
        rating: 4.8,
        verified: true,
        tokenBalance: 12500,
        transactionCount: 1250,
      },
      {
        id: "2",
        name: "Kenema Pharmacy",
        address: "Churchill Avenue, Addis Ababa",
        rating: 4.5,
        verified: true,
        tokenBalance: 8750,
        transactionCount: 980,
      },
      {
        id: "3",
        name: "Teklehaimanot Pharmacy",
        address: "Teklehaimanot Square, Addis Ababa",
        rating: 4.2,
        verified: true,
        tokenBalance: 6200,
        transactionCount: 720,
      },
    ]

    // Mock transaction history
    const mockTransactions: Transaction[] = [
      {
        id: "tx1",
        date: "2023-03-15 14:30",
        medicineName: "Amoxicillin",
        pharmacy: "Gishen Pharmacy",
        amount: 120,
        status: "completed",
        tokenReward: 12,
        txHash: "0x1a2b3c4d5e6f...",
      },
      {
        id: "tx2",
        date: "2023-03-10 09:15",
        medicineName: "Paracetamol",
        pharmacy: "Kenema Pharmacy",
        amount: 45,
        status: "completed",
        tokenReward: 5,
        txHash: "0x7a8b9c0d1e2f...",
      },
      {
        id: "tx3",
        date: "2023-03-05 16:45",
        medicineName: "Metformin",
        pharmacy: "Teklehaimanot Pharmacy",
        amount: 85,
        status: "completed",
        tokenReward: 9,
        txHash: "0x3a4b5c6d7e8f...",
      },
    ]

    // Set data after a short delay to simulate API call
    setTimeout(() => {
      setMedicineOffers(mockMedicineOffers)
      setTopPharmacies(mockPharmacies)
      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)

    // Filter medicine offers based on search query
    setTimeout(() => {
      const filteredOffers = medicineOffers.filter((offer) =>
        offer.medicineName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setMedicineOffers(filteredOffers.length > 0 ? filteredOffers : [])
      setIsLoading(false)
    }, 800)
  }

  const addToCart = (offer: MedicineOffer) => {
    // Check if already in cart
    if (cart.some((item) => item.id === offer.id)) {
      toast({
        title: t("addedToCart"),
        description: `${offer.medicineName} ${t("addedToCart").toLowerCase()}`,
        icon: <AlertCircle className="h-5 w-5" />,
      })
      return
    }

    // Add to cart with animation effect
    setCart([...cart, offer])

    // Show success toast with token reward info
    toast({
      title: t("addedToCart"),
      description: `${offer.medicineName} ${t("addedToCart").toLowerCase()}. ${t("earnedTokens").replace("{0}", offer.tokenRewards.toString())}`,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    })

    // Briefly show the cart tab to guide the user
    setTimeout(() => {
      setActiveTab("cart")
    }, 500)
  }

  const removeFromCart = (offerId: string) => {
    // Find the item to get its name
    const itemToRemove = cart.find((item) => item.id === offerId)

    // Remove from cart
    setCart(cart.filter((item) => item.id !== offerId))

    // Show toast
    if (itemToRemove) {
      toast({
        title: t("removeFromCart"),
        description: `${itemToRemove.medicineName} ${t("removeFromCart").toLowerCase()}`,
        icon: <Info className="h-5 w-5" />,
      })
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const getTotalRewards = () => {
    return cart.reduce((total, item) => total + item.tokenRewards, 0)
  }

  const handleCheckout = async () => {
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: t("walletNotConnected"),
        description: t("connectWalletToCheckout"),
        icon: <AlertCircle className="h-5 w-5" />,
      })
      return
    }

    setIsProcessingPayment(true)

    try {
      // Process each item in the cart
      for (const item of cart) {
        if (item.blockchainId) {
          // Call blockchain function to purchase the medicine
          const success = await buyMedicine(item.blockchainId, item.price)

          if (!success) {
            toast({
              variant: "destructive",
              title: t("transactionFailed"),
              description: `${t("transactionFailed")} ${item.medicineName}. ${t("trySearchingAgain")}`,
              icon: <AlertCircle className="h-5 w-5" />,
            })
            setIsProcessingPayment(false)
            return
          }
        }
      }

      // Add transaction to history
      const newTransaction: Transaction = {
        id: `tx${transactions.length + 1}`,
        date: new Date().toLocaleString(),
        medicineName: cart.map((item) => item.medicineName).join(", "),
        pharmacy: cart[0].pharmacy,
        amount: getTotalPrice() + 60, // Including fees
        status: "completed",
        tokenReward: getTotalRewards(),
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      }

      setTransactions([newTransaction, ...transactions])

      // If all transactions were successful
      setUserTokens(userTokens + getTotalRewards())
      setCart([])
      setIsProcessingPayment(false)
      setShowSuccessMessage(true)

      toast({
        title: t("purchaseSuccessful"),
        description: t("earnedTokens").replace("{0}", getTotalRewards().toString()),
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        variant: "destructive",
        title: t("checkoutFailed"),
        description: error instanceof Error ? error.message : t("checkoutFailed"),
        icon: <AlertCircle className="h-5 w-5" />,
      })
      setIsProcessingPayment(false)
    }
  }

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address)
    toast({
      title: t("walletConnected"),
      description: t("walletConnected"),
    })
  }

  const handleViewPharmacyDetails = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy)
    setIsPharmacyDialogOpen(true)
  }

  const handleQuickView = (medicine: MedicineOffer) => {
    setSelectedMedicine(medicine)
    setIsQuickViewOpen(true)
  }

  const openTransactionHistory = () => {
    setIsTransactionHistoryOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{t("blockchainMarketplace")}</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{t("marketplaceDescription")}</p>
        </div>

        {/* User wallet info */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 mr-2 text-primary" />
            <div>
              <p className="text-sm font-medium">Your IDA Token Balance</p>
              <p className="text-xl font-bold">
                {userTokens} <span className="text-sm text-muted-foreground">IDT</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2 text-primary" />
              <span className="text-sm font-medium">
                {cart.length} {t("shoppingCart").toLowerCase()}
              </span>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={openTransactionHistory}>
              <History className="h-4 w-4" />
              {t("transactionHistory")}
            </Button>
            <WalletConnect onConnect={handleWalletConnect} />
          </div>
        </div>

        {isNewUser && (
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 mb-8 flex items-center">
            <div className="p-3 bg-background rounded-full mr-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{t("welcomeGift")}</h3>
              <p className="text-sm text-muted-foreground">{t("welcomeGiftDescription")}</p>
            </div>
            <Button variant="outline" className="ml-auto" onClick={() => setIsNewUser(false)}>
              {t("gotIt")}
            </Button>
          </div>
        )}

        {/* Success message */}
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 mb-8 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            <p>
              {t("purchaseSuccessful")}! {t("earnedTokens").replace("{0}", getTotalRewards().toString())}
            </p>
          </div>
        )}

        <div className="w-full max-w-2xl mx-auto mb-8">
          <AutoSuggestion
            placeholder={t("searchForMedicines")}
            suggestions={medicineSuggestions}
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            isLoading={isLoading}
          />
        </div>

        <Tabs defaultValue="marketplace" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="marketplace">{t("marketplace")}</TabsTrigger>
            <TabsTrigger value="pharmacies">{t("topPharmacies")}</TabsTrigger>
            <TabsTrigger value="cart">
              {t("shoppingCart")} ({cart.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-lg">{t("loadingMarketplace")}</span>
              </div>
            ) : medicineOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {medicineOffers.map((offer) => (
                  <Card key={offer.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{offer.medicineName}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            {offer.pharmacy}
                            {offer.verified && <Shield className="h-4 w-4 ml-1 text-primary" />}
                          </CardDescription>
                        </div>
                        <Badge variant={offer.inStock ? "default" : "outline"} className="ml-2">
                          {offer.inStock ? t("inStock") : t("outOfStock")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-center mb-4 relative group">
                        <Image
                          src={offer.image || "/placeholder.svg"}
                          alt={offer.medicineName}
                          width={100}
                          height={100}
                          className="rounded-md cursor-pointer transition-all duration-300 group-hover:opacity-90"
                          onClick={() => handleQuickView(offer)}
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={() => handleQuickView(offer)}
                        >
                          {t("quickView")}
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{offer.rating}/5</span>
                        </div>
                        <div className="flex items-center">
                          <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{offer.deliveryTime}</span>
                        </div>
                        <div className="flex items-center">
                          <Coins className="h-4 w-4 mr-1 text-primary" />
                          <span>{offer.tokenRewards} IDT</span>
                        </div>
                        <div className="flex items-center font-bold text-lg">{offer.price} ETB</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => addToCart(offer)}
                        disabled={!offer.inStock || cart.some((item) => item.id === offer.id)}
                      >
                        {cart.some((item) => item.id === offer.id) ? (
                          <span className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t("addedToCart")}
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {t("addToCart")}
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-lg">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">{t("noMedicinesFound")}</h3>
                <p className="text-muted-foreground">{t("trySearchingAgain")}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pharmacies">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner size="lg" />
                <span className="ml-3 text-lg">{t("loadingPharmacies")}</span>
              </div>
            ) : (
              <div className="space-y-6 mt-6">
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    {t("verifiedPharmacies")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t("secureBlockchainDescription")}</p>
                </div>

                {topPharmacies.map((pharmacy) => (
                  <Card key={pharmacy.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center">
                            {pharmacy.name}
                            {pharmacy.verified && <Shield className="h-5 w-5 ml-2 text-primary" />}
                          </CardTitle>
                          <CardDescription>{pharmacy.address}</CardDescription>
                        </div>
                        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {pharmacy.rating}/5
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">{t("tokenRewards")}</div>
                          <div className="font-bold text-lg flex items-center">
                            <Coins className="h-4 w-4 mr-1 text-primary" />
                            {pharmacy.tokenBalance} IDT
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">{t("transactions")}</div>
                          <div className="font-bold text-lg flex items-center">
                            <BarChart className="h-4 w-4 mr-1 text-primary" />
                            {pharmacy.transactionCount}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">{t("smartContracts")}</div>
                          <div className="font-bold text-lg flex items-center">
                            <Lock className="h-4 w-4 mr-1 text-primary" />
                            {t("verifiedPharmacies")}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => handleViewPharmacyDetails(pharmacy)}>
                        <FileText className="h-4 w-4 mr-2" />
                        {t("viewPharmacyDetails")}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart">
            {cart.length > 0 ? (
              <div className="space-y-6 mt-6">
                <div className="bg-muted/30 p-4 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-primary" />
                    {t("secureBlockchainTransaction")}
                  </h3>
                  <p className="text-sm text-muted-foreground">{t("secureBlockchainDescription")}</p>
                </div>

                {cart.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{item.medicineName}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            {item.pharmacy}
                            {item.verified && <Shield className="h-4 w-4 ml-1 text-primary" />}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          {t("removeFromCart")}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.medicineName}
                            width={60}
                            height={60}
                            className="rounded-md mr-4"
                          />
                          <div>
                            <div className="flex items-center text-sm mb-1">
                              <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{item.deliveryTime}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Coins className="h-4 w-4 mr-1 text-primary" />
                              <span>{t("earnedTokens").replace("{0}", item.tokenRewards.toString())}</span>
                            </div>
                          </div>
                        </div>
                        <div className="font-bold text-lg">{item.price} ETB</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card>
                  <CardHeader>
                    <CardTitle>{t("orderSummary")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t("subtotal")}</span>
                        <span>{getTotalPrice()} ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("deliveryFee")}</span>
                        <span>50 ETB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t("smartContractFee")}</span>
                        <span>10 ETB</span>
                      </div>
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                        <span>{t("total")}</span>
                        <span>{getTotalPrice() + 60} ETB</span>
                      </div>
                      <div className="flex justify-between text-primary">
                        <span className="flex items-center">
                          <Coins className="h-4 w-4 mr-1" />
                          {t("tokenRewards")}
                        </span>
                        <span>+{getTotalRewards()} IDT</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full relative overflow-hidden group"
                      onClick={handleCheckout}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <span className="flex items-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t("processingTransaction")}
                        </span>
                      ) : (
                        <>
                          <span className="flex items-center transition-transform duration-300 group-hover:translate-x-1">
                            <Lock className="h-4 w-4 mr-2" />
                            {walletAddress ? t("secureCheckout") : t("connectWalletToCheckout")}
                            <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                          </span>
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/30 rounded-lg mt-6">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">{t("cartEmpty")}</h3>
                <p className="text-muted-foreground mb-4">{t("trySearchingAgain")}</p>
                <Button onClick={() => setActiveTab("marketplace")}>{t("marketplace")}</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Blockchain info section */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">{t("howBlockchainWorks")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="bg-background/80">
              <CardHeader className="pb-2">
                <div className="p-2 bg-primary/10 rounded-full w-fit mb-3">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{t("smartContracts")}</CardTitle>
                <CardDescription>{t("secureCheckout")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("smartContractsDescription")}</p>
              </CardContent>
            </Card>

            <Card className="bg-background/80">
              <CardHeader className="pb-2">
                <div className="p-2 bg-primary/10 rounded-full w-fit mb-3">
                  <Coins className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{t("tokenRewards")}</CardTitle>
                <CardDescription>{t("earnedTokens").replace("{0}", "IDT")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("tokenRewardsDescription")}</p>
              </CardContent>
            </Card>

            <Card className="bg-background/80">
              <CardHeader className="pb-2">
                <div className="p-2 bg-primary/10 rounded-full w-fit mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{t("priceTransparency")}</CardTitle>
                <CardDescription>{t("aiAnalysis")}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t("priceTransparencyDescription")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Quick View Dialog */}
        {selectedMedicine && (
          <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedMedicine.medicineName}</DialogTitle>
                <DialogDescription>
                  {t("soldBy")} {selectedMedicine.pharmacy}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="flex justify-center items-start">
                  <Image
                    src={selectedMedicine.image || "/placeholder.svg"}
                    alt={selectedMedicine.medicineName}
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">{selectedMedicine.price} ETB</h3>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500 opacity-50" />
                      <span className="text-sm ml-2">
                        {selectedMedicine.rating}/5 ({Math.floor(Math.random() * 100) + 50} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Shield className="h-4 w-4 mr-2 text-green-500" />
                      <span>{t("blockchainVerifiedVendor")}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {t("deliveryTime")} {selectedMedicine.deliveryTime}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Coins className="h-4 w-4 mr-2 text-primary" />
                      <span>{t("earnedTokens").replace("{0}", selectedMedicine.tokenRewards.toString())}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h4 className="text-sm font-medium mb-1">{t("description")}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t("medicineDescription").replace("{0}", selectedMedicine.medicineName)}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-1">{t("dosage")}</h4>
                    <p className="text-sm text-muted-foreground">{t("dosageDescription")}</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center space-x-2 sm:w-1/3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      // Quantity control would go here in a real app
                    }}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">1</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      // Quantity control would go here in a real app
                    }}
                  >
                    +
                  </Button>
                </div>

                <Button
                  className="sm:w-2/3"
                  onClick={() => {
                    addToCart(selectedMedicine)
                    setIsQuickViewOpen(false)
                  }}
                  disabled={cart.some((item) => item.id === selectedMedicine.id)}
                >
                  {cart.some((item) => item.id === selectedMedicine.id) ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {t("addedToCart")}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {t("addToCart")}
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Pharmacy Details Dialog */}
        {selectedPharmacy && (
          <Dialog open={isPharmacyDialogOpen} onOpenChange={setIsPharmacyDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {selectedPharmacy.name}
                  {selectedPharmacy.verified && (
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                      <Shield className="h-3 w-3 mr-1" /> {t("verifiedPharmacies")}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription>{selectedPharmacy.address}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{t("location")}</h4>
                      <p className="text-sm text-muted-foreground">{selectedPharmacy.address}</p>
                      <Button variant="link" className="h-auto p-0 text-xs text-primary">
                        {t("viewOnMap")}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{t("businessHours")}</h4>
                      <p className="text-sm text-muted-foreground">Mon-Fri: 8:00 AM - 8:00 PM</p>
                      <p className="text-sm text-muted-foreground">Sat-Sun: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{t("paymentMethods")}</h4>
                      <p className="text-sm text-muted-foreground">Crypto, Credit Card, Cash on Delivery</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{t("deliveryOptions")}</h4>
                      <p className="text-sm text-muted-foreground">{t("expressDelivery")}</p>
                      <p className="text-sm text-muted-foreground">{t("standardDelivery")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Percent className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{t("specialOffers")}</h4>
                      <p className="text-sm text-muted-foreground">{t("firstOrderDiscount")}</p>
                      <p className="text-sm text-muted-foreground">{t("freeDelivery")}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Award className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{t("certifications")}</h4>
                      <p className="text-sm text-muted-foreground">{t("ethiopianPharmaceuticalAssociation")}</p>
                      <p className="text-sm text-muted-foreground">{t("blockchainVerifiedVendor")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg mb-4">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary" />
                  {t("pharmacyStatistics")}
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("rating")}</p>
                    <p className="text-lg font-bold flex items-center justify-center">
                      {selectedPharmacy.rating}
                      <Star className="h-4 w-4 ml-1 text-yellow-500" />
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("transactions")}</p>
                    <p className="text-lg font-bold">{selectedPharmacy.transactionCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("deliverySuccess")}</p>
                    <p className="text-lg font-bold">99.7%</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <h3 className="text-sm font-medium">{t("availableMedicines")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {medicineOffers
                    .filter((med) => med.pharmacy === selectedPharmacy.name)
                    .map((med) => (
                      <div key={med.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <span className="text-sm">{med.medicineName}</span>
                        <span className="text-sm font-medium">{med.price} ETB</span>
                      </div>
                    ))}
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="sm:w-1/2">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("scheduleConsultation")}
                </Button>
                <Button className="sm:w-1/2">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {t("browseMedicines")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Transaction History Dialog */}
        <Dialog open={isTransactionHistoryOpen} onOpenChange={setIsTransactionHistoryOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                {t("transactionHistory")}
              </DialogTitle>
              <DialogDescription>{t("viewTransactionHistory")}</DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <Card key={tx.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{tx.medicineName}</CardTitle>
                            <CardDescription className="flex items-center mt-1">{tx.date}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              tx.status === "completed"
                                ? "default"
                                : tx.status === "pending"
                                  ? "outline"
                                  : "destructive"
                            }
                            className="ml-2"
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span>{tx.pharmacy}</span>
                          </div>
                          <div className="flex items-center">
                            <Coins className="h-4 w-4 mr-1 text-primary" />
                            <span>+{tx.tokenReward} IDT</span>
                          </div>
                          <div className="flex items-center">
                            <Lock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-xs truncate">{tx.txHash}</span>
                          </div>
                          <div className="flex items-center font-bold">{tx.amount} ETB</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">{t("noTransactions")}</h3>
                  <p className="text-muted-foreground mb-4">{t("trySearchingAgain")}</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsTransactionHistoryOpen(false)}>
                {t("gotIt")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Floating Cart Button (Mobile) */}
        {cart.length > 0 && activeTab !== "cart" && (
          <div className="fixed bottom-4 right-4 md:hidden z-10">
            <Button
              onClick={() => setActiveTab("cart")}
              className="h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
            >
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

