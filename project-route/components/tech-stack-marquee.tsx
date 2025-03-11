"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Image from "next/image"

const technologies = [
  { name: "Next.js", logo: "/nextjs-logo.png" },
  { name: "React", logo: "/react-logo.png" },
  { name: "Tailwind CSS", logo: "/tailwind-logo.png" },
  { name: "TypeScript", logo: "/typescript-logo.png" },
  { name: "agent.ai", logo: "/agentai-logo.png" },
  { name: "HERE Maps", logo: "/here-maps-logo.png" },
]

const TechStackMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    const techItems = marquee.querySelectorAll(".tech-item")

    gsap.to(techItems, {
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
    <div ref={marqueeRef} className="flex overflow-hidden py-4">
      {technologies.concat(technologies).map((tech, index) => (
        <div key={index} className="tech-item flex items-center mr-8">
          <Image src={tech.logo || "/placeholder.svg"} alt={tech.name} width={32} height={32} className="mr-2" />
          <span className="text-sm font-medium">{tech.name}</span>
        </div>
      ))}
    </div>
  )
}

export default TechStackMarquee

