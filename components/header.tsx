"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { LanguageToggle } from "./language-toggle"
import { Menu, X, LogOut } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from "@/lib/supabase-client"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)

    // Check authentication status
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  // Define navigation links based on authentication status
  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("medicineSearch"), href: "/medicine-search" },
    { name: t("pharmacyFinder"), href: "/pharmacy-finder" },
    { name: t("marketplace"), href: "/marketplace" },
    { name: t("about"), href: "/about" },
  ]

  const onLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3-removebg-preview-FHk1uqSu5p13Y2DEQV4tw9jxuakuIk.png"
                alt="IDA Logo"
                width={40}
                height={40}
                className="rounded-md"
              />
              <span className="text-xl font-bold text-primary hidden sm:inline">IDA</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={onLogout} className="text-sm font-medium">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button variant="default" size="sm" onClick={() => router.push("/auth")} className="text-sm font-medium">
                Sign In
              </Button>
            )}
            <LanguageToggle />
            <ModeToggle />
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <LanguageToggle />
            <ModeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="ml-2">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-background/95 backdrop-blur-sm border-b shadow-lg">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block py-2 text-base font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground/80"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <Button variant="ghost" className="w-full justify-start text-base font-medium" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full justify-start text-base font-medium"
                onClick={() => {
                  router.push("/auth")
                  setIsMobileMenuOpen(false)
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

