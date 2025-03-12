"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, Lock, Check, Sparkles } from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { signIn, signUp, supabase } from "@/lib/supabase"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [userName, setUserName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (activeTab === "login") {
        // Sign in with Supabase
        const { user } = await signIn(email, password)

        if (user) {
          // Store authentication state
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userId", user.id)

          // Show success animation
          setIsSuccess(true)

          // Redirect after success animation
          setTimeout(() => {
            onSuccess()
          }, 1000)
        }
      } else {
        // Sign up with Supabase
        const { user } = await signUp(email, password)

        if (user) {
          // Store authentication state
          localStorage.setItem("isLoggedIn", "true")
          localStorage.setItem("userId", user.id)

          // Show success animation
          setIsSuccess(true)

          // Extract name from email for welcome message
          const name = email.split("@")[0]
          setUserName(name.charAt(0).toUpperCase() + name.slice(1))

          // Show welcome message
          setTimeout(() => {
            setShowWelcome(true)

            // Wait a bit to show the welcome message before redirecting
            setTimeout(() => {
              onSuccess()
            }, 3000)
          }, 1000)
        }
      }
    } catch (error) {
      console.error("Authentication failed:", error instanceof Error ? error.message : String(error))
      setError(error instanceof Error ? error.message : "Authentication failed. Please try again.")
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // Sign in with Google via Supabase
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      })

      if (error) throw error

      // The redirect will happen automatically, but we'll set loading state
      // to indicate something is happening
    } catch (error) {
      console.error("Google authentication failed:", error instanceof Error ? error.message : String(error))
      setError(error instanceof Error ? error.message : "Google authentication failed. Please try again.")
      setIsSuccess(false)
      setIsLoading(false)
    }
  }

  // Welcome screen after successful signup
  if (showWelcome) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-8"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to IDA, {userName}!</h2>
            <p className="text-muted-foreground mb-6">
              Your account has been created successfully. You're now ready to explore detailed medicine information and
              find nearby pharmacies.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-muted-foreground">Redirecting you to medicine search</span>
              <LoadingSpinner size="sm" />
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {activeTab === "login" ? t("welcomeBack") : t("createAccount")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "login" ? t("loginToAccess") : t("createAccount")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t("signIn")}</TabsTrigger>
            <TabsTrigger value="signup">{t("signUp")}</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <p className="text-sm">{typeof error === "string" ? error : "An error occurred"}</p>
                </div>
              )}

              <Button type="submit" className="w-full relative" disabled={isLoading || isSuccess}>
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : isSuccess ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Success!
                  </span>
                ) : (
                  t("signIn")
                )}

                {isSuccess && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={isLoading || isSuccess}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">{t("email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">{t("password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <p className="text-sm">{typeof error === "string" ? error : "An error occurred"}</p>
                </div>
              )}

              <Button type="submit" className="w-full relative" disabled={isLoading || isSuccess}>
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : isSuccess ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Success!
                  </span>
                ) : (
                  t("signUp")
                )}

                {isSuccess && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t("orContinueWith")}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleGoogleAuth} disabled={isLoading || isSuccess}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

