"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

const step1Schema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
})

const step2Schema = z.object({
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  platform: z.string().min(1, "Please select a platform"),
})

const step3Schema = z.object({
  budget: z.number().min(100, "Budget must be at least $100"),
})

type Step1Values = z.infer<typeof step1Schema>
type Step2Values = z.infer<typeof step2Schema>
type Step3Values = z.infer<typeof step3Schema>

const platforms = ["Instagram", "YouTube", "TikTok", "Twitter/X", "LinkedIn", "Pinterest", "Twitch"]

export default function NewCampaignPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalSteps = 4

  const [campaignData, setCampaignData] = useState({
    title: "",
    description: "",
    requirements: "",
    platform: "",
    budget: 0,
  })

  const form1 = useForm<Step1Values>({ resolver: zodResolver(step1Schema), defaultValues: { title: "", description: "" } })
  const form2 = useForm<Step2Values>({ resolver: zodResolver(step2Schema), defaultValues: { requirements: "", platform: "" } })
  const form3 = useForm<Step3Values>({ resolver: zodResolver(step3Schema), defaultValues: { budget: 1000 } })

  const progress = (step / totalSteps) * 100

  async function handlePublish() {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/brand/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      })
      if (!res.ok) throw new Error("Failed to create campaign")
      toast.success("Campaign published successfully!")
      router.push("/brand/campaigns")
    } catch {
      toast.error("Failed to publish campaign")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">Step {step} of {totalSteps}</p>
      </div>

      <Progress value={progress} className="h-2" />

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Basics</CardTitle>
            <CardDescription>Give your campaign a name and description</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form1}>
              <form onSubmit={form1.handleSubmit((values) => {
                setCampaignData(prev => ({ ...prev, ...values }))
                setStep(2)
              })} className="space-y-4">
                <FormField
                  control={form1.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Title</FormLabel>
                      <FormControl><Input placeholder="Summer Collection Launch 2024" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form1.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your campaign goals, brand story, and what you're looking for..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
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
            <CardTitle>Requirements & Platform</CardTitle>
            <CardDescription>Specify what you need from creators</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form2}>
              <form onSubmit={form2.handleSubmit((values) => {
                setCampaignData(prev => ({ ...prev, ...values }))
                setStep(3)
              })} className="space-y-4">
                <FormField
                  control={form2.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {platforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form2.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creator Requirements</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Min. 10k followers, fashion niche, high engagement rate..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
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
            <CardTitle>Campaign Budget</CardTitle>
            <CardDescription>Set your total campaign budget in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form3}>
              <form onSubmit={form3.handleSubmit((values) => {
                setCampaignData(prev => ({ ...prev, budget: values.budget }))
                setStep(4)
              })} className="space-y-4">
                <FormField
                  control={form3.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Budget (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input type="number" className="pl-7" placeholder="5000" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-4 gap-2">
                  {[500, 1000, 5000, 10000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => form3.setValue("budget", amount)}
                      className="rounded-md border px-3 py-2 text-sm hover:border-primary transition-colors"
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button>
                  <Button type="submit" className="flex-1">Continue</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Publish</CardTitle>
            <CardDescription>Review your campaign before publishing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Title</p>
                <p className="font-semibold">{campaignData.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Description</p>
                <p className="text-sm">{campaignData.description}</p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Platform</p>
                  <Badge variant="secondary">{campaignData.platform}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Budget</p>
                  <p className="font-bold text-green-600">${campaignData.budget.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Requirements</p>
                <p className="text-sm">{campaignData.requirements}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Ready to publish</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Back</Button>
              <Button onClick={handlePublish} disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Publishing..." : "Publish Campaign"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
