"use client"

import { useRef } from "react"
import Image from "next/image"

const technologies = [
  {
    name: "Next.js",
    logo: "https://cdn.worldvectorlogo.com/logos/nextjs-2.svg",
  },
  {
    name: "React",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
  },
  {
    name: "Tailwind CSS",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1200px-Tailwind_CSS_Logo.svg.png",
  },
  {
    name: "TypeScript",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1200px-Typescript_logo_2020.svg.png",
  },
  {
    name: "Agent.ai",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-rqaDwJTmzilS6oUkvkKp9CkJC3QSem.png",
    className: "flex items-center justify-center",
  },
  {
    name: "HERE Maps",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HERE_logo.svg-wWwPnF5a8gvgoVOg6zQKbdJb0Ga3A2.png",
  },
  {
    name: "Node.js",
    logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images.jpg-uXrJp5uLgBslZvsKKSf8v1BKz2WMIr.jpeg",
  },
]

const TechStackMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null)

  // Duplicate the technologies to create a seamless loop
  const allTechnologies = [...technologies, ...technologies]

  return (
    <div className="relative overflow-hidden py-4">
      <div ref={marqueeRef} className="animate-marquee flex whitespace-nowrap">
        {allTechnologies.map((tech, index) => (
          <div key={index} className={`tech-item flex items-center mx-6 ${tech.className || ""}`}>
            <div className="w-8 h-8 relative mr-2 flex-shrink-0 bg-white rounded-full p-1 flex items-center justify-center">
              <Image
                src={tech.logo || "/placeholder.svg"}
                alt={tech.name}
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TechStackMarquee

