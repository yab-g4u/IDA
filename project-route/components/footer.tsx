import Link from "next/link"
import { Github } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">IDA</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your AI-powered medicine information assistant. Find detailed information about medications and locate
              nearby pharmacies.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/medicine-search" className="text-muted-foreground hover:text-primary transition-colors">
                  Medicine Search
                </Link>
              </li>
              <li>
                <Link href="/pharmacy-finder" className="text-muted-foreground hover:text-primary transition-colors">
                  Pharmacy Finder
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="mt-2 flex items-center space-x-4">
              <Link
                href="https://github.com/yab-g4u/ida"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Built for the AI Agents Hackathon</p>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} IDA. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

