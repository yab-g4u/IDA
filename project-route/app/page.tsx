import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, MapPin } from "lucide-react"
import AIAssistantMarquee from "@/components/ai-assistant-marquee"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
              Find Medicine Information <span className="text-secondary">Instantly</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground">
              Get detailed information about medications and locate nearby pharmacies with our AI-powered assistant.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/medicine-search">Search Medicines</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="/pharmacy-finder">Find Pharmacies</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">How MediFind Helps You</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive information about medications and helps you find nearby
              pharmacies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/medicine-search">
              <Card className="feature-card h-full">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                    <Pill className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Medicine Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Get detailed descriptions, usage instructions, side effects, and precautions for any medication.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            <Link href="/pharmacy-finder">
              <Card className="feature-card h-full">
                <CardHeader>
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mb-4">
                    <MapPin className="h-8 w-8 text-secondary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Pharmacy Locator</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Find nearby pharmacies based on your current location or any address you provide.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Marquee Section */}
      <AIAssistantMarquee />

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Ready to find the information you need?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Start searching for medicines or find nearby pharmacies with just a few clicks.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/medicine-search">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

