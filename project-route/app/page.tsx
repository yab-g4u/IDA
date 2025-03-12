"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, MapPin, ArrowRight } from "lucide-react"
import AIAssistantMarquee from "@/components/ai-assistant-marquee"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"

// Client component to use the language context
function HomeContent() {
  const { t } = useLanguage()
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/auth")
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
              {t("findMedicineInfo")} <span className="text-secondary">{t("instantly")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">{t("getDetailedInfo")}</p>
            <div className="mt-10">
              <Button size="lg" className="text-base group relative overflow-hidden" onClick={handleGetStarted}>
                <span className="flex items-center">
                  {t("getStarted")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-secondary transition-transform duration-300 group-hover:scale-x-100"></span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">{t("howIDAHelps")}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{t("aiPoweredPlatform")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="feature-card h-full cursor-pointer" onClick={handleGetStarted}>
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Pill className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{t("medicineInformation")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("getDetailedDescriptions")}</CardDescription>
              </CardContent>
            </Card>

            <Card className="feature-card h-full cursor-pointer" onClick={handleGetStarted}>
              <CardHeader>
                <div className="p-3 bg-secondary/10 rounded-full w-fit mb-4">
                  <MapPin className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl font-semibold">{t("pharmacyLocator")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{t("findNearbyPharmacies")}</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Assistant Marquee Section */}
      <AIAssistantMarquee />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">{t("readyToFind")}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t("startSearching")}</p>
            <div className="mt-8">
              <Button size="lg" onClick={handleGetStarted} className="animate-pulse hover:animate-none">
                {t("getStarted")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Server component wrapper
export default function Home() {
  return <HomeContent />
}

