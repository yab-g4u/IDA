"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Bot } from "lucide-react"

const AIAssistantMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    const messages = marquee.querySelectorAll(".message")

    gsap.to(messages, {
      xPercent: -100,
      repeat: -1,
      duration: 20,
      ease: "linear",
      stagger: {
        each: 0.5,
        repeat: -1,
      },
    })
  }, [])

  return (
    <section className="py-12 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Bot className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-primary">AI-Powered Assistant</h2>
        </div>
        <div ref={marqueeRef} className="whitespace-nowrap">
          {[
            "Get personalized medicine information",
            "Ask about drug interactions",
            "Learn about side effects",
            "Understand dosage instructions",
            "Discover alternative medications",
          ].map((message, index) => (
            <span key={index} className="message inline-block text-lg font-medium text-muted-foreground mr-8">
              {message}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AIAssistantMarquee

