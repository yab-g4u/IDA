"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, Clock, MapPin, Pill, ShieldCheck, Star, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Sample pharmacy advertisements
const advertisements = [
  {
    id: 1,
    title: "LifeCare Pharmacy",
    description: "Your health is our priority. Visit us for quality medicines and expert advice.",
    badge: "Featured",
    icon: <Building className="h-8 w-8 text-blue-500" />,
    location: "Bole, Addis Ababa",
    hours: "Open 24/7",
    promotion: "20% off on all vitamins",
    color: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: 2,
    title: "MediPlus Pharmacy",
    description: "Specialized in chronic disease management with personalized care plans.",
    badge: "New",
    icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
    location: "Kazanchis, Addis Ababa",
    hours: "8AM - 10PM",
    promotion: "Free blood pressure check",
    color: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
    borderColor: "border-green-200 dark:border-green-800",
  },
  {
    id: 3,
    title: "HealthFirst Pharmacy",
    description: "Family-owned pharmacy with a focus on community health and wellness.",
    badge: "Trusted",
    icon: <Star className="h-8 w-8 text-amber-500" />,
    location: "Piassa, Addis Ababa",
    hours: "9AM - 9PM",
    promotion: "Buy 1 Get 1 Free on selected items",
    color: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    id: 4,
    title: "Abyssinia Pharmacy",
    description: "Bringing traditional and modern medicine together for holistic healthcare.",
    badge: "Premium",
    icon: <Pill className="h-8 w-8 text-purple-500" />,
    location: "Merkato, Addis Ababa",
    hours: "8AM - 8PM",
    promotion: "Free delivery on orders above 1000 ETB",
    color: "from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: 5,
    title: "Ethio Pharmacy",
    description: "Largest selection of imported and local medicines at competitive prices.",
    badge: "Popular",
    icon: <TrendingUp className="h-8 w-8 text-red-500" />,
    location: "Meskel Square, Addis Ababa",
    hours: "7AM - 11PM",
    promotion: "10% discount for senior citizens",
    color: "from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
]

export default function PharmacyAdvertisement() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    // Rotate through advertisements every 5 seconds
    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const currentAd = advertisements[currentAdIndex]

  return (
    <div className="w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentAd.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className={`border-2 ${currentAd.borderColor} overflow-hidden`}>
            <div className={`bg-gradient-to-r ${currentAd.color} p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="mr-3 rounded-full bg-white p-2 shadow-sm dark:bg-gray-800">{currentAd.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold">{currentAd.title}</h3>
                    <p className="text-sm text-muted-foreground">{currentAd.description}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-2 shrink-0">
                  {currentAd.badge}
                </Badge>
              </div>
              <CardContent className="p-0 pt-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{currentAd.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{currentAd.hours}</span>
                  </div>
                  <div className="mt-2 w-full">
                    <div className="rounded-md bg-background/80 p-2 text-center font-medium">{currentAd.promotion}</div>
                  </div>
                  <Button size="sm" className="mt-2 w-full">
                    Visit Pharmacy
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 flex justify-center space-x-1">
        {advertisements.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 w-6 rounded-full ${
              index === currentAdIndex ? "bg-primary" : "bg-muted"
            } transition-all duration-300`}
            onClick={() => setCurrentAdIndex(index)}
            aria-label={`View advertisement ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
