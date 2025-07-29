import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  console.log("Auth callback received with code:", code ? "Code present" : "No code")

  if (code) {
    const supabaseUrl = "https://fbdxzqfgzsnuwuqwixqm.supabase.co"
    const supabaseAnonKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZHh6cWZnenNudXd1cXdpeHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTA3NDMsImV4cCI6MjA1NDc2Njc0M30.z1as2kdf4fOt_lpfsebP-KSTOMeHTtnNDmNswvPzYJw"
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    try {
      console.log("Exchanging code for session...")
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Error exchanging code for session:", error)
        return NextResponse.redirect(new URL("/auth?error=session_exchange", request.url))
      }

      // Successfully exchanged code for session
      if (data.session) {
        console.log("Session obtained successfully, redirecting to medicine search")

        // Create a URL with a success parameter to help client-side code
        return NextResponse.redirect(new URL("/medicine-search?auth=success", request.url))
      } else {
        console.error("No session in response data")
        return NextResponse.redirect(new URL("/auth?error=no_session", request.url))
      }
    } catch (error) {
      console.error("Exception during code exchange:", error)
      return NextResponse.redirect(new URL("/auth?error=session_exchange", request.url))
    }
  }

  // If no code, redirect to auth page
  console.log("No code in callback, redirecting to auth page")
  return NextResponse.redirect(new URL("/auth", request.url))
}
