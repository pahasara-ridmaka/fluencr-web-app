import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  if (session?.user) {
    if (!session.user.onboarded) {
      redirect("/onboarding")
    }
    if (session.user.role === "BRAND") {
      redirect("/brand")
    }
    if (session.user.role === "CREATOR") {
      redirect("/creator")
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border bg-white/60 px-4 py-2 text-sm shadow-sm backdrop-blur dark:bg-gray-900/60">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-muted-foreground">Now in beta</span>
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
          Connect{" "}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Brands
          </span>{" "}
          with{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Creators
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Fluencr is the influencer marketing platform that helps brands launch campaigns and creators find
          their next collaboration — all in one place.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/auth/signup">Get Started Free</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {[
            {
              title: "For Brands",
              description: "Launch campaigns, discover creators, and track performance all in one dashboard.",
              icon: "🏢",
            },
            {
              title: "For Creators",
              description: "Browse brand campaigns, submit proposals, and manage your collaborations.",
              icon: "🎬",
            },
            {
              title: "Seamless Workflow",
              description: "From proposal to delivery — our platform handles every step of the process.",
              icon: "⚡",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-white/60 p-6 shadow-sm backdrop-blur dark:bg-gray-900/60"
            >
              <div className="mb-3 text-4xl">{feature.icon}</div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
