"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { LanguageToggle } from "./language-toggle"
import { Menu, X, Pill, User, LogOut, ShoppingBag, Coins, Home } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { supabase } from "@/lib/supabase-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useWallet } from "@/hooks/use-wallet"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const { t } = useLanguage()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { walletBalance = 0 } = useWallet()
  const [user, setUser] = useState<any>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setUser(session?.user || null)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session)
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">IDA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : ""
            }`}
          >
            <Home className="h-5 w-5" />
          </Link>
          <Link
            href="/medicine-search"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/medicine-search" ? "text-primary" : ""
            }`}
          >
            {t("medicineSearch")}
          </Link>
          <Link
            href="/pharmacy-finder"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/pharmacy-finder" ? "text-primary" : ""
            }`}
          >
            {t("pharmacyFinder")}
          </Link>
          <Link
            href="/marketplace"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/marketplace" ? "text-primary" : ""
            }`}
          >
            {t("marketplace")}
          </Link>
          <Link
            href="/game"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/game" ? "text-primary" : ""
            }`}
          >
            {t("firstAidGame") || "First Aid Game"}
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/about" ? "text-primary" : ""
            }`}
          >
            {t("about")}
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/my-orders"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === "/my-orders" ? "text-primary" : ""
                }`}
              >
                {t("transactions") || "Transactions"}
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md hover:bg-muted" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Right side items */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Coins size={14} />
              <span title="Interaction & Discovery Tokens - Earn by using the platform">{walletBalance} IDT</span>
            </div>
          )}

          <LanguageToggle />
          <ModeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32"}
                      alt={user.email || "User"}
                    />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.user_metadata?.name || user.email?.split("@")[0]}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t("profile") || "Profile"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/my-orders")}>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>{t("transactions") || "Transactions"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("signOut") || "Sign Out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => router.push("/auth")}>
              {t("signIn") || "Sign In"}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <div className="container py-4 space-y-3">
              <Link
                href="/"
                className={`flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                  pathname === "/" ? "bg-muted" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
              <Link
                href="/medicine-search"
                className={`block px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                  pathname === "/medicine-search" ? "bg-muted" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("medicineSearch")}
              </Link>
              <Link
                href="/pharmacy-finder"
                className={`block px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                  pathname === "/pharmacy-finder" ? "bg-muted" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("pharmacyFinder")}
              </Link>
              <Link
                href="/marketplace"
                className={`block px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                  pathname === "/marketplace" ? "bg-muted" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("marketplace")}
              </Link>
              <Link
                href="/game"
                className={`block px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                  pathname === "/game" ? "bg-muted" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("firstAidGame") || "First Aid Game"}
              </Link>
              <Link
                href="/about"
                className={`block px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                  pathname === "/about" ? "bg-muted" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {t("about")}
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/profile"
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                      pathname === "/profile" ? "bg-muted" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {t("profile") || "Profile"}
                  </Link>
                  <Link
                    href="/my-orders"
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-muted ${
                      pathname === "/my-orders" ? "bg-muted" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    {t("transactions") || "Transactions"}
                  </Link>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium">
                    <Coins size={16} />
                    <span title="Interaction & Discovery Tokens - Earn by using the platform">{walletBalance} IDT</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
