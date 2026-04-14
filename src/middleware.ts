import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isOnboarded = req.auth?.user?.onboarded
  const role = req.auth?.user?.role

  const isAuthPage = nextUrl.pathname.startsWith("/auth")
  const isOnboardingPage = nextUrl.pathname.startsWith("/onboarding")
  const isBrandPage = nextUrl.pathname.startsWith("/brand")
  const isCreatorPage = nextUrl.pathname.startsWith("/creator")
  const isApiPage = nextUrl.pathname.startsWith("/api")

  if (isApiPage) return NextResponse.next()

  // Redirect unauthenticated users to sign in
  if (!isLoggedIn && (isBrandPage || isCreatorPage || isOnboardingPage)) {
    return NextResponse.redirect(new URL("/auth/signin", nextUrl))
  }

  // Redirect authenticated but non-onboarded users to onboarding
  if (isLoggedIn && !isOnboarded && (isBrandPage || isCreatorPage)) {
    return NextResponse.redirect(new URL("/onboarding", nextUrl))
  }

  // Redirect authenticated + onboarded users away from auth and onboarding pages
  if (isLoggedIn && isOnboarded && (isAuthPage || isOnboardingPage)) {
    if (role === "BRAND") {
      return NextResponse.redirect(new URL("/brand", nextUrl))
    }
    if (role === "CREATOR") {
      return NextResponse.redirect(new URL("/creator", nextUrl))
    }
  }

  // RBAC: Only BRAND role can access /brand/*
  if (isBrandPage && isLoggedIn && role !== "BRAND") {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  // RBAC: Only CREATOR role can access /creator/*
  if (isCreatorPage && isLoggedIn && role !== "CREATOR") {
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
