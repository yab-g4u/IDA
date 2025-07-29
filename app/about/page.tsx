"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Trophy, Award, Code, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function AboutPage() {
  const { translations } = useLanguage()

  const techStack = [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "Gemini AI",
    "Vercel AI SDK",
    "Agent.ai",
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About IDA - Intelligent Drug Assistant
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          AI-powered medicine information and pharmacy finder platform
        </p>
      </div>

      {/* Hackathon Achievement */}
      <Card className="mb-8 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <Trophy className="w-8 h-8 text-yellow-600" />
            Hackathon Winner! 🏆
          </CardTitle>
          <CardDescription className="text-lg">
            <div className="flex items-center gap-2 mt-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800 dark:text-yellow-200">
                Won 33,333 ETB in AI Agents Hackathon
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            IDA was recognized as a winning project in the AI Agents Hackathon, showcasing innovative use of artificial
            intelligence to solve real-world healthcare accessibility problems in Ethiopia.
          </p>
        </CardContent>
      </Card>

      {/* Developer Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Code className="w-6 h-6 text-blue-600" />
            Developer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              Y
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Yeabsera</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Full-Stack Developer & AI Enthusiast</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Passionate about leveraging technology to solve healthcare challenges. Specialized in building
                AI-powered applications that make medical information more accessible to communities.
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <Button variant="outline" size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="sm">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-purple-600" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              IDA (Intelligent Drug Assistant) is an AI-powered platform designed to provide comprehensive medicine
              information and pharmacy location services. Built with cutting-edge AI technology, it helps users make
              informed decisions about their healthcare.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-3 text-lg">Key Features</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• AI-powered medicine information lookup</li>
                  <li>• Interactive chatbot for medical queries</li>
                  <li>• Pharmacy finder with location services</li>
                  <li>• Multi-language support (English/Amharic)</li>
                  <li>• Medicine marketplace integration</li>
                  <li>• First aid educational games</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-lg">Technology Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mission Statement */}
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            To democratize access to reliable medical information and pharmacy services through innovative AI
            technology, making healthcare more accessible and understandable for everyone, especially in underserved
            communities.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
