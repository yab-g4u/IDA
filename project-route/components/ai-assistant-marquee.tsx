"use client"

import { useRef } from "react"
import { Bot } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const AIAssistantMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null)
  const { t } = useLanguage()

  return (
    <section className="py-12 bg-primary/5 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <Bot className="h-8 w-8 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-primary">{t("aiAssistantTitle")}</h2>
        </div>
        <div className="relative overflow-hidden">
          <div ref={marqueeRef} className="animate-marquee whitespace-nowrap flex">
            {t("aiAssistantMessages").map((message, index) => (
              <span key={index} className="inline-block text-lg font-medium text-muted-foreground mx-8">
                {message}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AIAssistantMarquee

