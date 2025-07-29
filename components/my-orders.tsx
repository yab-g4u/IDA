"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  Calendar,
  MapPin,
  Phone,
  User,
  Search,
  Pill,
  Loader2,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"

// Order status types
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled"

// Order interface
interface Order {
  id: string
  user_id: string
  order_number: string
  items: {
    id: number
    name: string
    quantity: number
    price: number
    icon?: string
  }[]
  total_amount: number
  status: OrderStatus
  shipping_address: {
    name: string
    address: string
    city: string
    phone: string
  }
  payment_method: string
  created_at: string
  updated_at: string
  estimated_delivery: string
  tracking_number?: string
  pharmacy_id?: string
  pharmacy_name?: string
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    user_id: "user123",
    order_number: "IDA-2023-001",
    items: [
      { id: 1, name: "Paracetamol", quantity: 2, price: 150.0, icon: "pill" },
      { id: 4, name: "Ibuprofen", quantity: 1, price: 180.0, icon: "pill" },
    ],
    total_amount: 480.0,
    status: "delivered",
    shipping_address: {
      name: "John Doe",
      address: "123 Main St",
      city: "Addis Ababa",
      phone: "+251 912 345 678",
    },
    payment_method: "TeleBirr",
    created_at: "2023-05-15T10:30:00Z",
    updated_at: "2023-05-17T14:20:00Z",
    estimated_delivery: "2023-05-17",
    tracking_number: "ETH12345678",
    pharmacy_id: "pharm1",
    pharmacy_name: "LifeCare Pharmacy",
  },
  {
    id: "2",
    user_id: "user123",
    order_number: "IDA-2023-002",
    items: [{ id: 2, name: "Amoxicillin", quantity: 1, price: 320.0, icon: "capsule" }],
    total_amount: 380.0,
    status: "shipped",
    shipping_address: {
      name: "John Doe",
      address: "123 Main St",
      city: "Addis Ababa",
      phone: "+251 912 345 678",
    },
    payment_method: "Cash on Delivery",
    created_at: "2023-06-20T09:15:00Z",
    updated_at: "2023-06-21T11:30:00Z",
    estimated_delivery: "2023-06-23",
    tracking_number: "ETH87654321",
    pharmacy_id: "pharm2",
    pharmacy_name: "MediPlus Pharmacy",
  },
  {
    id: "3",
    user_id: "user123",
    order_number: "IDA-2023-003",
    items: [
      { id: 5, name: "Metformin", quantity: 1, price: 400.0, icon: "tablets" },
      { id: 3, name: "Loratadine", quantity: 2, price: 200.0, icon: "tablets" },
    ],
    total_amount: 860.0,
    status: "processing",
    shipping_address: {
      name: "John Doe",
      address: "123 Main St",
      city: "Addis Ababa",
      phone: "+251 912 345 678",
    },
    payment_method: "Commercial Bank of Ethiopia",
    created_at: "2023-07-05T14:45:00Z",
    updated_at: "2023-07-05T14:45:00Z",
    estimated_delivery: "2023-07-08",
    pharmacy_id: "pharm3",
    pharmacy_name: "HealthFirst Pharmacy",
  },
]

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "processing" | "shipped" | "delivered">("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const { user } = useAuth()

  // Load orders
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      try {
        // In a real app, we would fetch from the database
        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate loading

        // Filter orders for the current user
        const userOrders = mockOrders.filter(
          (order) => (user ? order.user_id === user.id : true), // For demo, show all orders
        )

        setOrders(userOrders)
      } catch (error) {
        console.error("Error loading orders:", error)
        toast({
          title: "Error loading orders",
          description: "Could not load your orders. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user, toast])

  // Filter orders based on active tab and search query
  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (activeTab !== "all" && order.status !== activeTab) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.order_number.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query)) ||
        order.pharmacy_name?.toLowerCase().includes(query) ||
        order.shipping_address.city.toLowerCase().includes(query)
      )
    }

    return true
  })

  // Get status badge
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
          >
            <Clock className="h-3 w-3 mr-1" />
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
          >
            <Truck className="h-3 w-3 mr-1" />
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <CheckCircle className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  // Get icon for item
  const getItemIcon = (icon?: string) => {
    switch (icon) {
      case "pill":
        return <Pill className="h-4 w-4 text-blue-500" />
      case "capsule":
        return <Pill className="h-4 w-4 text-green-500" />
      case "tablets":
        return <Pill className="h-4 w-4 text-purple-500" />
      default:
        return <Pill className="h-4 w-4 text-gray-500" />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  // Track order
  const trackOrder = (order: Order) => {
    toast({
      title: "Tracking Order",
      description: `Tracking information for order ${order.order_number} will be sent to your email.`,
    })
  }

  // Render order list
  const renderOrderList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      )
    }

    if (filteredOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No orders match your search criteria."
              : activeTab !== "all"
                ? `You don't have any ${activeTab} orders.`
                : "You haven't placed any orders yet."}
          </p>
          <Button onClick={() => router.push("/marketplace")}>Browse Marketplace</Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="h-4 w-4 mr-2 text-primary" />
                    Order #{order.order_number}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(order.created_at)}
                  </CardDescription>
                </div>
                <div className="flex items-center">{getStatusBadge(order.status)}</div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Items:</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{order.total_amount.toFixed(2)} ETB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pharmacy:</span>
                  <span className="font-medium">{order.pharmacy_name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="font-medium">{formatDate(order.estimated_delivery)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <div className="flex w-full gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => viewOrderDetails(order)}>
                  View Details
                </Button>
                {(order.status === "shipped" || order.status === "processing") && (
                  <Button variant="default" size="sm" className="flex-1" onClick={() => trackOrder(order)}>
                    Track Order
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Render order details
  const renderOrderDetails = () => {
    if (!selectedOrder) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Order Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  Back to Orders
                </Button>
              </div>
              <CardDescription>
                Order #{selectedOrder.order_number} • {formatDate(selectedOrder.created_at)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Status</h3>
                {getStatusBadge(selectedOrder.status)}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {getItemIcon(item.icon)}
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} x {item.price.toFixed(2)} ETB
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">{(item.quantity * item.price).toFixed(2)} ETB</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>
                      {selectedOrder.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} ETB
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>60.00 ETB</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>{selectedOrder.total_amount.toFixed(2)} ETB</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Shipping Information</h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{selectedOrder.shipping_address.name}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>
                      {selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.city}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <span>{selectedOrder.shipping_address.phone}</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span>{selectedOrder.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                    >
                      Paid
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedOrder.tracking_number && (
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Tracking Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Tracking Number</span>
                      <span className="font-mono">{selectedOrder.tracking_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Delivery</span>
                      <span>{formatDate(selectedOrder.estimated_delivery)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-3">
                {(selectedOrder.status === "shipped" || selectedOrder.status === "processing") && (
                  <Button className="w-full" onClick={() => trackOrder(selectedOrder)}>
                    <Truck className="mr-2 h-4 w-4" />
                    Track Order
                  </Button>
                )}
                <Button variant="outline" className="w-full" onClick={() => setSelectedOrder(null)}>
                  Back to Orders
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-muted-foreground">View and track your medicine orders</p>
      </div>

      {selectedOrder ? (
        renderOrderDetails()
      ) : (
        <>
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as any)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="shipped">Shipped</TabsTrigger>
                <TabsTrigger value="delivered">Delivered</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {renderOrderList()}
        </>
      )}
    </div>
  )
}
