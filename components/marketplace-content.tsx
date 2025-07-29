"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  Loader2,
  Star,
  Upload,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Shield,
  Gift,
  X,
  Pill,
  PillIcon as Capsule,
  Tablets,
  Building,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react"
import WalletConnect from "./wallet-connect"
import PharmacyAdvertisement from "./pharmacy-advertisement"

// Sample medicine data with icons
const medicines = [
  {
    id: 1,
    name: "Paracetamol",
    description: "Pain reliever and fever reducer",
    price: 150.0,
    image: "/placeholder.svg?height=100&width=100",
    category: "Pain Relief",
    stock: 50,
    rating: 4.5,
    requiresPrescription: false,
    icon: <Pill className="h-8 w-8 text-blue-500" />,
    deliveryTime: "1-2 days",
    pharmacies: ["LifeCare Pharmacy", "MediPlus Pharmacy"],
  },
  {
    id: 2,
    name: "Amoxicillin",
    description: "Antibiotic used to treat bacterial infections",
    price: 320.0,
    image: "/placeholder.svg?height=100&width=100",
    category: "Antibiotics",
    stock: 30,
    rating: 4.2,
    requiresPrescription: true,
    icon: <Capsule className="h-8 w-8 text-green-500" />,
    deliveryTime: "Same day",
    pharmacies: ["LifeCare Pharmacy", "HealthFirst Pharmacy"],
  },
  {
    id: 3,
    name: "Loratadine",
    description: "Antihistamine for allergy relief",
    price: 200.0,
    image: "/placeholder.svg?height=100&width=100",
    category: "Allergy",
    stock: 45,
    rating: 4.0,
    requiresPrescription: false,
    icon: <Tablets className="h-8 w-8 text-yellow-500" />,
    deliveryTime: "1-3 days",
    pharmacies: ["MediPlus Pharmacy"],
  },
  {
    id: 4,
    name: "Ibuprofen",
    description: "NSAID for pain and inflammation",
    price: 180.0,
    image: "/placeholder.svg?height=100&width=100",
    category: "Pain Relief",
    stock: 60,
    rating: 4.3,
    requiresPrescription: false,
    icon: <Pill className="h-8 w-8 text-red-500" />,
    deliveryTime: "1-2 days",
    pharmacies: ["LifeCare Pharmacy", "MediPlus Pharmacy", "HealthFirst Pharmacy"],
  },
  {
    id: 5,
    name: "Metformin",
    description: "Oral diabetes medicine",
    price: 400.0,
    image: "/placeholder.svg?height=100&width=100",
    category: "Diabetes",
    stock: 25,
    rating: 4.7,
    requiresPrescription: true,
    icon: <Tablets className="h-8 w-8 text-purple-500" />,
    deliveryTime: "Same day",
    pharmacies: ["LifeCare Pharmacy"],
  },
  {
    id: 6,
    name: "Lisinopril",
    description: "ACE inhibitor for high blood pressure",
    price: 450.0,
    image: "/placeholder.svg?height=100&width=100",
    category: "Blood Pressure",
    stock: 20,
    rating: 4.4,
    requiresPrescription: true,
    icon: <Capsule className="h-8 w-8 text-indigo-500" />,
    deliveryTime: "1-2 days",
    pharmacies: ["MediPlus Pharmacy", "HealthFirst Pharmacy"],
  },
]

// Sample pharmacy data with icons
const pharmacies = [
  {
    id: 1,
    name: "LifeCare Pharmacy",
    location: "Addis Ababa, Ethiopia",
    rating: 4.8,
    image: "/placeholder.svg?height=150&width=150",
    specialties: ["General Medicine", "Pediatric Care"],
    icon: <Building className="h-12 w-12 text-blue-500" />,
    verified: true,
  },
  {
    id: 2,
    name: "MediPlus Pharmacy",
    location: "Bahir Dar, Ethiopia",
    rating: 4.5,
    image: "/placeholder.svg?height=150&width=150",
    specialties: ["Chronic Disease Management", "Geriatric Care"],
    icon: <Building className="h-12 w-12 text-green-500" />,
    verified: true,
  },
  {
    id: 3,
    name: "HealthFirst Pharmacy",
    location: "Hawassa, Ethiopia",
    rating: 4.6,
    image: "/placeholder.svg?height=150&width=150",
    specialties: ["Women's Health", "Nutritional Support"],
    icon: <Building className="h-12 w-12 text-purple-500" />,
    verified: false,
  },
]

// Payment methods
const paymentMethods = [
  {
    id: "telebirr",
    name: "TeleBirr",
    icon: <Smartphone className="h-5 w-5 text-green-600" />,
    description: "Pay with TeleBirr mobile money",
    color: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-400",
    accountNumber: "0912345678",
    qrCode: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "cbe",
    name: "Commercial Bank of Ethiopia",
    icon: <CreditCard className="h-5 w-5 text-blue-600" />,
    description: "Pay with CBE bank transfer",
    color: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-400",
    accountNumber: "1000123456789",
    accountName: "IDA Pharmacy Services",
  },
  {
    id: "dashen",
    name: "Dashen Bank",
    icon: <CreditCard className="h-5 w-5 text-purple-600" />,
    description: "Pay with Dashen bank transfer",
    color: "bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800",
    textColor: "text-purple-700 dark:text-purple-400",
    accountNumber: "5678901234",
    accountName: "IDA Pharmacy Services",
  },
  {
    id: "cash",
    name: "Cash on Delivery",
    icon: <ShoppingCart className="h-5 w-5 text-gray-600" />,
    description: "Pay when your order is delivered",
    color: "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800",
    textColor: "text-gray-700 dark:text-gray-400",
  },
]

export default function MarketplaceContent() {
  const [loading, setLoading] = useState(true)
  const [selectedMedicine, setSelectedMedicine] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [cart, setCart] = useState([])
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)
  const [activeTab, setActiveTab] = useState("medicines")
  const [showTokenInfo, setShowTokenInfo] = useState(true)
  const [showPharmacyRegistrationDialog, setShowPharmacyRegistrationDialog] = useState(false)
  const [pharmacyRegistrationStep, setPharmacyRegistrationStep] = useState(1)
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()
  const [selectedPharmacy, setSelectedPharmacy] = useState(null)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState(1)
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  })
  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: "",
    location: "",
    email: "",
    phone: "",
    description: "",
    specialties: "",
    licenseNumber: "",
    ownerName: "",
    yearEstablished: "",
  })
  const [showWelcomeGift, setShowWelcomeGift] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, processing, completed, failed
  const [transactionId, setTransactionId] = useState("")
  const [copiedText, setCopiedText] = useState("")

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    // Check if wallet is connected from localStorage
    const walletStatus = localStorage.getItem("walletConnected")
    if (walletStatus === "true") {
      setWalletConnected(true)
      const balance = localStorage.getItem("walletBalance")
      setWalletBalance(balance ? Number.parseFloat(balance) : 100)
    }

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Save wallet status to localStorage
    if (walletConnected) {
      localStorage.setItem("walletConnected", "true")
      localStorage.setItem("walletBalance", walletBalance.toString())
    }
  }, [walletConnected, walletBalance])

  const handleWalletConnect = (status, balance) => {
    setWalletConnected(status)
    setWalletBalance(balance)

    // Show token info card after wallet connection
    setShowTokenInfo(true)

    // Only show toast once
    if (!localStorage.getItem("walletConnectedToast")) {
      toast({
        title: "Wallet Connected",
        description: `Your wallet has been connected successfully. You have ${balance} IDT tokens.`,
      })
      localStorage.setItem("walletConnectedToast", "true")
    }
  }

  const handleAddToCart = (medicine, qty) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    if (!walletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to make purchases.",
        variant: "destructive",
      })
      return
    }

    const existingItem = cart.find((item) => item.id === medicine.id)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === medicine.id ? { ...item, quantity: item.quantity + qty } : item)))
    } else {
      setCart([...cart, { ...medicine, quantity: qty }])
    }

    toast({
      title: "Added to Cart",
      description: `${qty} ${medicine.name} added to your cart.`,
    })

    // Close dialog if open
    setSelectedMedicine(null)

    // Reset quantity
    setQuantity(1)

    // Reward user with IDT tokens for engagement
    if (walletConnected) {
      const reward = 0.5
      setWalletBalance((prev) => {
        const newBalance = prev + reward
        localStorage.setItem("walletBalance", newBalance.toString())
        return newBalance
      })

      toast({
        title: "IDT Tokens Earned!",
        description: `You earned ${reward} IDT tokens for adding to cart.`,
      })
    }
  }

  const handleQuickView = (medicine) => {
    setSelectedMedicine(medicine)
    setQuantity(1)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some items before checkout.",
        variant: "destructive",
      })
      return
    }

    if (!walletConnected) {
      toast({
        title: "Wallet Connection Required",
        description: "Please connect your wallet to complete your purchase.",
        variant: "destructive",
      })
      return
    }

    // Start checkout process
    setIsCheckingOut(true)
    setCheckoutStep(1)
  }

  const handleRateMedicine = (id, rating) => {
    toast({
      title: "Rating Submitted",
      description: `Thank you for rating this medicine ${rating}/5 stars!`,
    })

    // Reward user with IDT tokens for engagement
    if (walletConnected) {
      const reward = 1
      setWalletBalance((prev) => {
        const newBalance = prev + reward
        localStorage.setItem("walletBalance", newBalance.toString())
        return newBalance
      })

      toast({
        title: "IDT Tokens Earned!",
        description: `You earned ${reward} IDT tokens for submitting a rating.`,
      })
    }
  }

  const handlePharmacyRegistration = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register your pharmacy.",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    // Open the pharmacy registration dialog
    setShowPharmacyRegistrationDialog(true)
    setPharmacyRegistrationStep(1)
  }

  const handlePharmacyRegistrationSubmit = () => {
    // Validate pharmacy information
    if (pharmacyRegistrationStep === 1) {
      if (!pharmacyInfo.name || !pharmacyInfo.location || !pharmacyInfo.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
      setPharmacyRegistrationStep(2)
      return
    }

    if (pharmacyRegistrationStep === 2) {
      if (!pharmacyInfo.licenseNumber || !pharmacyInfo.ownerName) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
      setPharmacyRegistrationStep(3)
      return
    }

    // Final submission
    toast({
      title: "Registration Submitted",
      description: "Your pharmacy registration has been submitted for verification. We'll contact you soon.",
    })

    // Reward user with IDT tokens for engagement
    if (walletConnected) {
      const reward = 5
      setWalletBalance((prev) => {
        const newBalance = prev + reward
        localStorage.setItem("walletBalance", newBalance.toString())
        return newBalance
      })

      toast({
        title: "IDT Tokens Earned!",
        description: `You earned ${reward} IDT tokens for registering your pharmacy.`,
      })
    }

    // Close the dialog and reset
    setShowPharmacyRegistrationDialog(false)
    setPharmacyRegistrationStep(1)
    setPharmacyInfo({
      name: "",
      location: "",
      email: "",
      phone: "",
      description: "",
      specialties: "",
      licenseNumber: "",
      ownerName: "",
      yearEstablished: "",
    })
  }

  const handleCopyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedText(type)
        setTimeout(() => setCopiedText(""), 2000)
        toast({
          title: "Copied to clipboard",
          description: `${type} has been copied to your clipboard.`,
        })
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  const handleVerifyPayment = () => {
    if (!transactionId.trim()) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter the transaction ID to verify your payment.",
        variant: "destructive",
      })
      return
    }

    setPaymentStatus("processing")

    // Simulate payment verification
    setTimeout(() => {
      // 90% chance of success
      const isSuccess = Math.random() < 0.9

      if (isSuccess) {
        setPaymentStatus("completed")
        setCheckoutStep(3) // Move to confirmation step
      } else {
        setPaymentStatus("failed")
        toast({
          title: "Payment Verification Failed",
          description: "We couldn't verify your payment. Please check the transaction ID and try again.",
          variant: "destructive",
        })
      }
    }, 2000)
  }

  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = localStorage.getItem("hasVisitedMarketplace")
    if (!hasVisitedBefore && user) {
      setShowWelcomeGift(true)
      localStorage.setItem("hasVisitedMarketplace", "true")
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="mt-2 text-muted-foreground">Purchase medicines and connect with pharmacies</p>
        </div>
        <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 md:mt-0">
          <WalletConnect onWalletConnect={handleWalletConnect} />
          {walletConnected && (
            <div className="flex items-center rounded-md bg-primary/10 px-4 py-2">
              <span className="font-medium">Balance: {walletBalance.toFixed(2)} IDT</span>
            </div>
          )}
          {cart.length > 0 && (
            <Button onClick={() => document.getElementById("cart-section").scrollIntoView({ behavior: "smooth" })}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </Button>
          )}
        </div>
      </div>

      {/* Pharmacy Advertisement Section */}
      <div className="mb-8">
        <PharmacyAdvertisement />
      </div>

      {/* IDT Token Info Card with Animation */}
      {showTokenInfo && (
        <Card className="mb-8 overflow-hidden border-2 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10 shadow-lg transition-all duration-300 hover:border-primary hover:shadow-primary/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-primary">How IDT Token Makes Our Platform Unique</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowTokenInfo(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-start space-y-2 rounded-lg bg-background/80 p-4 shadow-sm transition-all duration-300 hover:bg-background hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-2">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">Earn While You Learn</h3>
                <p className="text-sm text-muted-foreground">
                  Users earn IDT tokens by searching for medical information or engaging with the AI assistant.
                </p>
              </div>

              <div className="flex flex-col items-start space-y-2 rounded-lg bg-background/80 p-4 shadow-sm transition-all duration-300 hover:bg-background hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">Seamless Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  IDT powers secure purchases in the blockchain marketplace for medicines.
                </p>
              </div>

              <div className="flex flex-col items-start space-y-2 rounded-lg bg-background/80 p-4 shadow-sm transition-all duration-300 hover:bg-background hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-2">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">Loyalty & Rewards</h3>
                <p className="text-sm text-muted-foreground">
                  Redeem tokens for discounts on medicines, premium features, or AI consultations.
                </p>
              </div>

              <div className="flex flex-col items-start space-y-2 rounded-lg bg-background/80 p-4 shadow-sm transition-all duration-300 hover:bg-background hover:shadow-md">
                <div className="rounded-full bg-primary/10 p-2">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">Decentralized Trust</h3>
                <p className="text-sm text-muted-foreground">Blockchain ensures transparent, reliable healthcare.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {showWelcomeGift && (
        <Card className="mb-8 overflow-hidden border-2 border-green-500/50 bg-gradient-to-r from-green-50 to-green-100 shadow-lg transition-all duration-300 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-green-700 dark:text-green-400">
                Welcome Gift - 100 IDT Tokens!
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowWelcomeGift(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800/30">
                <Gift className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium">Thank you for joining our marketplace!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  As a welcome gift, we've added 100 IDT tokens to your wallet. Use them for discounts on future
                  purchases or special services.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                  onClick={() => {
                    setWalletBalance((prev) => prev + 100)
                    localStorage.setItem("walletBalance", (walletBalance + 100).toString())
                    setShowWelcomeGift(false)
                    toast({
                      title: "100 IDT Tokens Added!",
                      description: "Welcome gift has been added to your wallet.",
                    })
                  }}
                >
                  Claim Your Gift
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="medicines" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:w-auto">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="pharmacies">Pharmacies</TabsTrigger>
        </TabsList>

        <TabsContent value="medicines" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {medicines.map((medicine) => (
              <Card key={medicine.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="relative h-24 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {medicine.icon}
                  {medicine.requiresPrescription && (
                    <Badge className="absolute right-2 top-2 bg-yellow-500 text-white">Prescription Required</Badge>
                  )}
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{medicine.name}</CardTitle>
                    <Badge variant="outline">{medicine.category}</Badge>
                  </div>
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(medicine.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">{medicine.rating}</span>
                  </div>
                  <CardDescription className="mt-2 line-clamp-2">{medicine.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex items-baseline justify-between">
                    <div className="text-lg font-bold">{medicine.price.toFixed(2)} ETB</div>
                    <div className="text-sm text-muted-foreground">{medicine.stock} in stock</div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Delivery: {medicine.deliveryTime}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Button variant="outline" onClick={() => handleQuickView(medicine)}>
                    Quick View
                  </Button>
                  <Button onClick={() => handleAddToCart(medicine, 1)}>Add to Cart</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Cart Section */}
          {cart.length > 0 && (
            <div id="cart-section" className="mt-12 rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Your Cart</h2>
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.price.toFixed(2)} ETB per unit</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center sm:mt-0">
                      <div className="flex items-center rounded-md border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-r-none"
                          onClick={() => {
                            if (item.quantity > 1) {
                              setCart(
                                cart.map((cartItem) =>
                                  cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
                                ),
                              )
                            } else {
                              setCart(cart.filter((cartItem) => cartItem.id !== item.id))
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex h-8 w-8 items-center justify-center text-sm">{item.quantity}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-l-none"
                          onClick={() => {
                            if (item.quantity < item.stock) {
                              setCart(
                                cart.map((cartItem) =>
                                  cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
                                ),
                              )
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="ml-4 w-20 text-right font-medium">
                        {(item.price * item.quantity).toFixed(2)} ETB
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col items-end justify-end border-t pt-4">
                <div className="mb-4 text-right">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold">
                    {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} ETB
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    You'll earn {Math.floor(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) / 10)} IDT
                    tokens with this purchase
                  </div>
                </div>
                <Button size="lg" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pharmacies" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="relative h-40 w-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {pharmacy.icon}
                  {pharmacy.verified && (
                    <Badge className="absolute right-2 top-2 bg-green-500 text-white flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
                <CardHeader className="p-4 pb-0">
                  <CardTitle className="text-xl">{pharmacy.name}</CardTitle>
                  <div className="mt-1 flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(pharmacy.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">{pharmacy.rating}</span>
                  </div>
                  <CardDescription className="mt-2">{pharmacy.location}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Specialties:</h4>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {pharmacy.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Pharmacy Details",
                        description: `Viewing details for ${pharmacy.name} in ${pharmacy.location}`,
                      })

                      // Open a dialog with pharmacy details
                      setSelectedPharmacy(pharmacy)
                    }}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pharmacy Registration Button */}
          <Card className="mt-8 border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle>Register Your Pharmacy</CardTitle>
              <CardDescription>Join our platform to connect with patients and sell medicines online.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button size="lg" onClick={handlePharmacyRegistration} className="px-8">
                <Building className="mr-2 h-5 w-5" />
                Register Your Pharmacy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick View Dialog */}
      <Dialog open={selectedMedicine !== null} onOpenChange={(open) => !open && setSelectedMedicine(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedMedicine && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMedicine.name}</DialogTitle>
                <DialogDescription>{selectedMedicine.description}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative mx-auto aspect-square w-32 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                  {selectedMedicine.icon}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <div className="text-lg font-bold">{selectedMedicine.price.toFixed(2)} ETB</div>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <div>{selectedMedicine.category}</div>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 cursor-pointer ${
                            i < Math.floor(selectedMedicine.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                          onClick={() => handleRateMedicine(selectedMedicine.id, i + 1)}
                        />
                      ))}
                      <span className="ml-1 text-sm">{selectedMedicine.rating}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Delivery</Label>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{selectedMedicine.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Available at these pharmacies */}
                <div className="mt-2">
                  <Label>Available at</Label>
                  <div className="mt-1 space-y-1">
                    {selectedMedicine.pharmacies.map((pharmacy, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        <span>{pharmacy}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedMedicine.requiresPrescription && (
                  <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Upload className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          Prescription Required
                        </h3>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="flex items-center">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Prescription
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="mt-1 flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-r-none"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="flex h-8 w-12 items-center justify-center rounded-none border-y text-sm">
                      {quantity}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-l-none"
                      onClick={() => quantity < selectedMedicine.stock && setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedMedicine(null)}>
                  Cancel
                </Button>
                <Button onClick={() => handleAddToCart(selectedMedicine, quantity)}>Add to Cart</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Pharmacy Details Dialog */}
      <Dialog open={selectedPharmacy !== null} onOpenChange={(open) => !open && setSelectedPharmacy(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedPharmacy && (
            <>
              <DialogHeader className="relative">
                <DialogTitle>{selectedPharmacy.name}</DialogTitle>
                <DialogDescription>{selectedPharmacy.location}</DialogDescription>
                <DialogClose className="absolute right-0 top-0">
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
                  {selectedPharmacy.icon}
                  {selectedPharmacy.verified && (
                    <Badge className="absolute right-2 top-2 bg-green-500 text-white flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedPharmacy.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm">{selectedPharmacy.rating}</span>
                    </div>
                  </div>
                  <div>
                    <Label>Specialties</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPharmacy.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Services</Label>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Prescription filling
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Medication counseling
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Health screenings
                    </li>
                    <li className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Home delivery
                    </li>
                  </ul>
                </div>
                <div>
                  <Label>Operating Hours</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>Monday - Friday</div>
                    <div>8:00 AM - 8:00 PM</div>
                    <div>Saturday</div>
                    <div>9:00 AM - 6:00 PM</div>
                    <div>Sunday</div>
                    <div>10:00 AM - 4:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">+251 11 551 7272</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedPharmacy.location}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedPharmacy(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setSelectedPharmacy(null)
                    toast({
                      title: "Contact Request Sent",
                      description: `Your request to contact ${selectedPharmacy.name} has been sent.`,
                    })
                  }}
                >
                  Contact Pharmacy
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Pharmacy Registration Dialog */}
      <Dialog
        open={showPharmacyRegistrationDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowPharmacyRegistrationDialog(false)
            setPharmacyRegistrationStep(1)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Pharmacy Registration</DialogTitle>
            <DialogDescription>
              {pharmacyRegistrationStep === 1 && "Provide basic information about your pharmacy"}
              {pharmacyRegistrationStep === 2 && "Provide verification details for your pharmacy"}
              {pharmacyRegistrationStep === 3 && "Review and submit your registration"}
            </DialogDescription>
          </DialogHeader>

          {pharmacyRegistrationStep === 1 && (
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                    1
                  </div>
                  <h3 className="font-medium">Basic Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy-name">
                      Pharmacy Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pharmacy-name"
                      placeholder="Enter pharmacy name"
                      value={pharmacyInfo.name}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy-location">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pharmacy-location"
                      placeholder="City, Country"
                      value={pharmacyInfo.location}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy-email">Email</Label>
                    <Input
                      id="pharmacy-email"
                      type="email"
                      placeholder="contact@pharmacy.com"
                      value={pharmacyInfo.email}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy-phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pharmacy-phone"
                      placeholder="+251 123 456 789"
                      value={pharmacyInfo.phone}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pharmacy-description">Description</Label>
                    <textarea
                      id="pharmacy-description"
                      className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about your pharmacy and services offered"
                      value={pharmacyInfo.description}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pharmacy-specialties">Specialties (comma separated)</Label>
                    <Input
                      id="pharmacy-specialties"
                      placeholder="General Medicine, Pediatric Care, etc."
                      value={pharmacyInfo.specialties}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, specialties: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPharmacyRegistrationDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handlePharmacyRegistrationSubmit()}>Continue</Button>
              </DialogFooter>
            </div>
          )}

          {pharmacyRegistrationStep === 2 && (
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                    2
                  </div>
                  <h3 className="font-medium">Verification Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license-number">
                      License Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="license-number"
                      placeholder="Enter pharmacy license number"
                      value={pharmacyInfo.licenseNumber}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, licenseNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">
                      Owner Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="owner-name"
                      placeholder="Enter owner's full name"
                      value={pharmacyInfo.ownerName}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, ownerName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year-established">Year Established</Label>
                    <Input
                      id="year-established"
                      placeholder="e.g., 2010"
                      value={pharmacyInfo.yearEstablished}
                      onChange={(e) => setPharmacyInfo({ ...pharmacyInfo, yearEstablished: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="license-document">Upload License Document</Label>
                    <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Drag and drop your license document here</p>
                      <p className="text-xs text-muted-foreground">or</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPharmacyRegistrationStep(1)}>
                  Back
                </Button>
                <Button onClick={() => handlePharmacyRegistrationSubmit()}>Continue</Button>
              </DialogFooter>
            </div>
          )}

          {pharmacyRegistrationStep === 3 && (
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                    3
                  </div>
                  <h3 className="font-medium">Review & Submit</h3>
                </div>
                <div className="border rounded-md p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Pharmacy Information</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="text-muted-foreground">Name:</div>
                      <div>{pharmacyInfo.name}</div>
                      <div className="text-muted-foreground">Location:</div>
                      <div>{pharmacyInfo.location}</div>
                      <div className="text-muted-foreground">Phone:</div>
                      <div>{pharmacyInfo.phone}</div>
                      <div className="text-muted-foreground">Email:</div>
                      <div>{pharmacyInfo.email || "Not provided"}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Verification Details</h4>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="text-muted-foreground">License Number:</div>
                      <div>{pharmacyInfo.licenseNumber}</div>
                      <div className="text-muted-foreground">Owner Name:</div>
                      <div>{pharmacyInfo.ownerName}</div>
                      <div className="text-muted-foreground">Year Established:</div>
                      <div>{pharmacyInfo.yearEstablished || "Not provided"}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Verification Notice</h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <p>
                          Your pharmacy registration will be reviewed by our team. This process typically takes 1-3
                          business days. You will receive an email notification once your registration is approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setPharmacyRegistrationStep(2)}>
                  Back
                </Button>
                <Button onClick={() => handlePharmacyRegistrationSubmit()}>Submit Registration</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckingOut} onOpenChange={(open) => !open && setIsCheckingOut(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
            <DialogDescription>Complete your purchase securely</DialogDescription>
          </DialogHeader>

          {checkoutStep === 1 && (
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                    1
                  </div>
                  <h3 className="font-medium">Shipping Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      placeholder="+251 123 456 789"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      placeholder="Addis Ababa"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      placeholder="Your full address"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCheckingOut(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setCheckoutStep(2)}>Continue to Payment</Button>
              </DialogFooter>
            </div>
          )}

          {checkoutStep === 2 && (
            <div className="grid gap-4 py-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mr-2">
                    2
                  </div>
                  <h3 className="font-medium">Payment Method</h3>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`relative rounded-lg border p-4 transition-all ${
                        selectedPaymentMethod === method.id
                          ? `${method.color} border-2`
                          : "hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center">
                        <div className={`mr-3 rounded-full p-2 ${method.color}`}>{method.icon}</div>
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={`h-5 w-5 rounded-full border-2 ${
                              selectedPaymentMethod === method.id
                                ? `${method.textColor} border-current`
                                : "border-gray-300 dark:border-gray-600"
                            }`}
                          >
                            {selectedPaymentMethod === method.id && (
                              <div className="flex h-full items-center justify-center">
                                <div className={`h-2 w-2 rounded-full ${method.textColor}`}></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedPaymentMethod && selectedPaymentMethod !== "cash" && (
                  <div className="mt-4 rounded-lg border p-4">
                    <h4 className="mb-3 font-medium">Payment Details</h4>

                    {selectedPaymentMethod === "telebirr" && (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-2 rounded-lg bg-white p-2">
                            <QrCode className="h-32 w-32 text-green-600" />
                          </div>
                          <p className="text-sm text-center text-muted-foreground">
                            Scan this QR code with your TeleBirr app
                          </p>
                        </div>

                        <div className="flex items-center justify-between rounded-md bg-green-50 p-3 dark:bg-green-900/20">
                          <div className="flex items-center">
                            <Smartphone className="mr-2 h-4 w-4 text-green-600" />
                            <span className="font-medium">TeleBirr Number:</span>
                            <span className="ml-2">0912345678</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleCopyToClipboard("0912345678", "TeleBirr Number")}
                          >
                            {copiedText === "TeleBirr Number" ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="transaction-id">Transaction ID</Label>
                          <Input
                            id="transaction-id"
                            placeholder="Enter TeleBirr transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            After completing payment in TeleBirr app, enter the transaction ID you received
                          </p>
                        </div>

                        <Button
                          className="w-full"
                          onClick={handleVerifyPayment}
                          disabled={paymentStatus === "processing"}
                        >
                          {paymentStatus === "processing" ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Verifying Payment...
                            </>
                          ) : (
                            "Verify Payment"
                          )}
                        </Button>
                      </div>
                    )}

                    {(selectedPaymentMethod === "cbe" || selectedPaymentMethod === "dashen") && (
                      <div className="space-y-4">
                        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
                          <div className="mb-2">
                            <span className="font-medium">Account Name:</span>
                            <span className="ml-2">
                              {selectedPaymentMethod === "cbe" ? "IDA Pharmacy Services" : "IDA Pharmacy Services"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">Account Number:</span>
                              <span className="ml-2">
                                {selectedPaymentMethod === "cbe" ? "1000123456789" : "5678901234"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handleCopyToClipboard(
                                  selectedPaymentMethod === "cbe" ? "1000123456789" : "5678901234",
                                  "Account Number",
                                )
                              }
                            >
                              {copiedText === "Account Number" ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="transaction-id">Transaction Reference</Label>
                          <Input
                            id="transaction-id"
                            placeholder="Enter bank transaction reference"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            After completing the bank transfer, enter the transaction reference number
                          </p>
                        </div>

                        <Button
                          className="w-full"
                          onClick={handleVerifyPayment}
                          disabled={paymentStatus === "processing"}
                        >
                          {paymentStatus === "processing" ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Verifying Payment...
                            </>
                          ) : (
                            "Verify Payment"
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 border rounded-md p-4">
                  <h4 className="font-medium mb-2">Order Summary</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity} x {item.name}
                        </span>
                        <span>{(item.price * item.quantity).toFixed(2)} ETB</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between mb-1">
                      <span>Subtotal</span>
                      <span>{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Delivery Fee</span>
                      <span>60.00 ETB</span>
                    </div>
                    <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                      <span>Total</span>
                      <span>
                        {(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 60).toFixed(2)} ETB
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                      You'll earn {Math.floor(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) / 10)} IDT
                      tokens with this purchase
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Estimated delivery: {cart[0]?.deliveryTime || "1-2 days"}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCheckoutStep(1)}>
                  Back
                </Button>
                {selectedPaymentMethod === "cash" ? (
                  <Button onClick={() => setCheckoutStep(3)}>Confirm Order</Button>
                ) : (
                  <Button
                    onClick={handleVerifyPayment}
                    disabled={!selectedPaymentMethod || !transactionId || paymentStatus === "processing"}
                  >
                    {paymentStatus === "processing" ? "Verifying..." : "Verify Payment"}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}

          {checkoutStep === 3 && (
            <div className="grid gap-4 py-4 text-center">
              <div className="mb-4 flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Order Confirmed!</h3>
                <p className="text-muted-foreground mb-4">Your order has been placed successfully.</p>

                <div className="border rounded-md p-4 w-full text-left mb-4">
                  <h4 className="font-medium mb-2">Order Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">Order ID:</span>
                    <span>
                      #
                      {Math.floor(Math.random() * 1000000)
                        .toString()
                        .padStart(6, "0")}
                    </span>
                    <span className="text-muted-foreground">Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                    <span className="text-muted-foreground">Delivery to:</span>
                    <span>
                      {shippingInfo.name}, {shippingInfo.address}, {shippingInfo.city}
                    </span>
                    <span className="text-muted-foreground">Total Paid:</span>
                    <span>{(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 60).toFixed(2)} ETB</span>
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span>
                      {paymentMethods.find((method) => method.id === selectedPaymentMethod)?.name || "Cash on Delivery"}
                    </span>
                    <span className="text-muted-foreground">Estimated Delivery:</span>
                    <span>{cart[0]?.deliveryTime || "1-2 days"}</span>
                    <span className="text-muted-foreground">IDT Tokens Earned:</span>
                    <span className="text-green-600">
                      {Math.floor(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) / 10)} tokens
                    </span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to {shippingInfo.email}. You can track your order in the "My
                  Orders" section.
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => {
                    // Process payment and add IDT tokens
                    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 60
                    const tokensEarned = Math.floor(total / 10)

                    // Add tokens to wallet
                    setWalletBalance((prev) => {
                      const newBalance = prev + tokensEarned
                      localStorage.setItem("walletBalance", newBalance.toString())
                      return newBalance
                    })

                    // Clear cart and close dialog
                    setCart([])
                    setIsCheckingOut(false)
                    setSelectedPaymentMethod(null)
                    setTransactionId("")
                    setPaymentStatus("pending")

                    toast({
                      title: "Order Completed",
                      description: `Your order has been placed successfully. You earned ${tokensEarned} IDT tokens!`,
                    })
                  }}
                >
                  Continue Shopping
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
