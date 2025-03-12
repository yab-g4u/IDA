"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Search, MapPin, Award, Github, Mail, Linkedin, Code, Palette, Database } from "lucide-react"
import { motion } from "framer-motion"
import TechStackMarquee from "@/components/tech-stack-marquee"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

const teamMembers = [
  {
    name: "Yeabsera",
    role: "fullStackDev",
    github: "https://github.com/yeabsera",
    linkedin: "https://linkedin.com/in/yeabsera",
    email: "yeabsera@example.com",
    skills: ["Next.js", "TypeScript", "Node.js", "AI"],
    bio: "Lead developer with expertise in AI and full-stack development. Responsible for architecture design and integration of AI components.",
    icon: <Code className="h-6 w-6 text-primary" />,
  },
  {
    name: "Hemen",
    role: "API Integration, AI",
    github: "https://github.com/hemen",
    linkedin: "https://linkedin.com/in/hemen",
    email: "hemen@example.com",
    skills: ["API", "AI", "Integration", "Data"],
    bio: "Specializes in connecting our application with external services and AI models. Responsible for seamless data flow between systems.",
    icon: <Database className="h-6 w-6 text-primary" />,
  },
  {
    name: "Birtukan",
    role: "UI/UX Design (Figma), AI",
    github: "https://github.com/birtukan",
    linkedin: "https://linkedin.com/in/birtukan",
    email: "birtukan@example.com",
    skills: ["Figma", "UI/UX", "Design", "AI"],
    bio: "Creates intuitive and accessible user interfaces. Responsible for the visual design and user experience of the application.",
    icon: <Palette className="h-6 w-6 text-primary" />,
  },
  {
    name: "Yared",
    role: "Backend Engineer (Node.js), AI",
    github: "https://github.com/yared",
    linkedin: "https://linkedin.com/in/yared",
    email: "yared@example.com",
    skills: ["Node.js", "Backend", "APIs", "AI"],
    bio: "Develops robust server-side solutions and APIs. Responsible for database design and server performance optimization.",
    icon: <Database className="h-6 w-6 text-primary" />,
  },
]

export default function About() {
  const { t } = useLanguage()
  const [hoveredMember, setHoveredMember] = useState<string | null>(null)

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{t("about")}</h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">{t("getDetailedInfo")}</p>
        </div>

        <div className="space-y-12">
          {/* Mission Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">{t("ourMission")}</h2>
            <p className="text-muted-foreground">{t("missionDescription")}</p>
          </section>

          {/* How It Works Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">{t("howItWorks")}</h2>
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

          {/* Technology Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-primary">{t("ourTechnology")}</h2>
            <p className="text-muted-foreground mb-4">{t("techDescription")}</p>
            <TechStackMarquee />
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-primary">{t("ourTeam")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card
                    className="relative group h-full transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onMouseEnter={() => setHoveredMember(member.name)}
                    onMouseLeave={() => setHoveredMember(null)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                          {member.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{member.name}</CardTitle>
                          <CardDescription className="text-sm">{member.role}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Skills */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <span key={skill} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-3 mt-4">
                        <Link
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </Link>
                        <Link
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`mailto:${member.email}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Hackathon Section */}
          <section className="bg-primary/10 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-start">
              <div className="mr-4 mb-4 md:mb-0">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-primary">{t("hackathonProject")}</h2>
                <p className="text-muted-foreground">{t("hackathonDesc")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

