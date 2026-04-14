"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

// Brand onboarding schema
const brandStep1Schema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  industry: z.string().min(1, "Please select an industry"),
})

// Creator onboarding schema
const creatorStep1Schema = z.object({
  niche: z.string().min(1, "Please select a niche"),
})

const creatorStep2Schema = z.object({
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  followers: z.number().min(0, "Followers must be 0 or more"),
})

const creatorStep3Schema = z.object({
  portfolioUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
})

const industries = ["Technology", "Fashion", "Food & Beverage", "Health & Wellness", "Travel", "Entertainment", "Finance", "Education", "Sports", "Beauty"]
const niches = ["Tech", "Lifestyle", "Fashion", "Food", "Travel", "Gaming", "Beauty", "Sports"]

export default function OnboardingPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 3

  // Brand forms
  const brandForm = useForm({
    resolver: zodResolver(brandStep1Schema),
    defaultValues: { companyName: "", website: "", industry: "" },
  })

  // Creator forms
  const creatorNicheForm = useForm({
    resolver: zodResolver(creatorStep1Schema),
    defaultValues: { niche: "" },
  })
  const creatorSocialForm = useForm({
    resolver: zodResolver(creatorStep2Schema),
    defaultValues: { instagram: "", youtube: "", tiktok: "", followers: 0 },
  })
  const creatorPortfolioForm = useForm({
    resolver: zodResolver(creatorStep3Schema),
    defaultValues: { portfolioUrl: "" },
  })

  const role = session?.user?.role
  const progress = (step / totalSteps) * 100

  // Brand data collection
  const [brandData, setBrandData] = useState<{ companyName: string; website?: string; industry: string; logo?: string }>({
    companyName: "",
    industry: "",
  })
  const [creatorData, setCreatorData] = useState<{
    niche: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    followers: number;
    portfolioUrl?: string;
  }>({ niche: "", followers: 0 })

  async function submitBrandOnboarding(logoUrl?: string) {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...brandData, logo: logoUrl }),
      })
      if (!res.ok) throw new Error("Failed to save brand profile")
      await update({ onboarded: true })
      toast.success("Welcome to Fluencr!")
      router.push("/brand")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function submitCreatorOnboarding() {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding/creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creatorData),
      })
      if (!res.ok) throw new Error("Failed to save creator profile")
      await update({ onboarded: true })
      toast.success("Welcome to Fluencr!")
      router.push("/creator")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Fluencr
          </h1>
          <p className="mt-1 text-muted-foreground">
            Step {step} of {totalSteps} — {role === "BRAND" ? "Brand" : "Creator"} Setup
          </p>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        {role === "BRAND" && (
          <>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Tell us about your brand</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...brandForm}>
                    <form
                      onSubmit={brandForm.handleSubmit((values) => {
                        setBrandData((prev) => ({ ...prev, ...values }))
                        setStep(2)
                      })}
                      className="space-y-4"
                    >
                      <FormField
                        control={brandForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={brandForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website (optional)</FormLabel>
                            <FormControl><Input placeholder="https://example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={brandForm.control}
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {industries.map((i) => (
                                  <SelectItem key={i} value={i}>{i}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Continue</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Brand Logo</CardTitle>
                  <CardDescription>Add your logo URL (optional)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="https://example.com/logo.png"
                    onChange={(e) => setBrandData((prev) => ({ ...prev, logo: e.target.value }))}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    <Button onClick={() => setStep(3)} className="flex-1">Continue</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Review & Complete</CardTitle>
                  <CardDescription>Confirm your brand profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Company</span>
                      <span className="font-medium text-sm">{brandData.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Industry</span>
                      <Badge variant="secondary">{brandData.industry}</Badge>
                    </div>
                    {brandData.website && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Website</span>
                        <span className="font-medium text-sm">{brandData.website}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button
                      onClick={() => submitBrandOnboarding(brandData.logo)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Saving..." : "Complete Setup"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {role === "CREATOR" && (
          <>
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Niche</CardTitle>
                  <CardDescription>What type of content do you create?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...creatorNicheForm}>
                    <form
                      onSubmit={creatorNicheForm.handleSubmit((values) => {
                        setCreatorData((prev) => ({ ...prev, niche: values.niche }))
                        setStep(2)
                      })}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {niches.map((niche) => (
                          <button
                            key={niche}
                            type="button"
                            onClick={() => creatorNicheForm.setValue("niche", niche)}
                            className={`rounded-lg border p-3 text-sm font-medium transition-colors hover:border-primary ${
                              creatorNicheForm.watch("niche") === niche
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border"
                            }`}
                          >
                            {niche}
                          </button>
                        ))}
                      </div>
                      {creatorNicheForm.formState.errors.niche && (
                        <p className="text-sm text-destructive">{creatorNicheForm.formState.errors.niche.message}</p>
                      )}
                      <Button type="submit" className="w-full">Continue</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Links & Following</CardTitle>
                  <CardDescription>Connect your social media profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...creatorSocialForm}>
                    <form
                      onSubmit={creatorSocialForm.handleSubmit((values) => {
                        setCreatorData((prev) => ({ ...prev, ...values }))
                        setStep(3)
                      })}
                      className="space-y-4"
                    >
                      <FormField
                        control={creatorSocialForm.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram Handle (optional)</FormLabel>
                            <FormControl><Input placeholder="@yourusername" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={creatorSocialForm.control}
                        name="youtube"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YouTube Channel (optional)</FormLabel>
                            <FormControl><Input placeholder="@yourchannel" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={creatorSocialForm.control}
                        name="tiktok"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TikTok Handle (optional)</FormLabel>
                            <FormControl><Input placeholder="@yourusername" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={creatorSocialForm.control}
                        name="followers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Followers</FormLabel>
                            <FormControl><Input type="number" placeholder="10000" {...field} onChange={(e) => field.onChange(Number(e.target.value))} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                        <Button type="submit" className="flex-1">Continue</Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio & Review</CardTitle>
                  <CardDescription>Add your portfolio and complete your profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Portfolio URL (optional)</label>
                    <Input
                      className="mt-1"
                      placeholder="https://yourportfolio.com"
                      onChange={(e) => setCreatorData((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
                    />
                  </div>

                  <div className="rounded-lg border p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Niche</span>
                      <Badge variant="secondary">{creatorData.niche}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Followers</span>
                      <span className="font-medium text-sm">{creatorData.followers?.toLocaleString()}</span>
                    </div>
                    {creatorData.instagram && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">Instagram</span>
                        <span className="font-medium text-sm">{creatorData.instagram}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Your profile looks great!</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                    <Button
                      onClick={submitCreatorOnboarding}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Saving..." : "Complete Setup"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
