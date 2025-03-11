import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Search, MapPin, Award } from "lucide-react"
import TechStackMarquee from "@/components/tech-stack-marquee"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">About MediFind</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Your AI-powered medicine information assistant
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Our Mission</h2>
            <p className="text-muted-foreground">
              MediFind was created to provide easy access to accurate and comprehensive information about medications.
              Our mission is to help people make informed decisions about their health by providing detailed
              descriptions of medicines and helping them locate nearby pharmacies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="p-2 bg-primary/10 rounded-full w-fit mb-3">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Search Medicines</CardTitle>
                  <CardDescription>Enter the name of any medicine</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Simply type the name of a medication to get comprehensive information about it, including usage
                    instructions, side effects, and precautions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="p-2 bg-primary/10 rounded-full w-fit mb-3">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>AI Analysis</CardTitle>
                  <CardDescription>Powered by advanced AI</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our AI agent processes your query and provides accurate, up-to-date information about the medication
                    you're interested in.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="p-2 bg-primary/10 rounded-full w-fit mb-3">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Find Pharmacies</CardTitle>
                  <CardDescription>Locate nearby pharmacies</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Use your current location or enter an address to find pharmacies near you that carry the medication
                    you need.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">Our Technology</h2>
            <p className="text-muted-foreground mb-4">
              MediFind is built using cutting-edge technology to provide a seamless and reliable experience:
            </p>
            <TechStackMarquee />
          </section>

          <section className="bg-primary/10 p-6 rounded-lg">
            <div className="flex items-start">
              <div className="mr-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-primary">Hackathon Project</h2>
                <p className="text-muted-foreground">
                  MediFind was developed as part of the AI Agents Hackathon. Our team created this application to
                  demonstrate the potential of AI agents in providing valuable healthcare information and services.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

