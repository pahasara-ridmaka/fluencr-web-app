"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Search, DollarSign, Users } from "lucide-react"

interface Campaign {
  id: string
  title: string
  description: string
  requirements: string
  budget: number
  platform: string
  brand: { companyName: string; user: { name: string | null } }
  proposals: { id: string }[]
}

const proposalSchema = z.object({
  pitch: z.string().min(20, "Pitch must be at least 20 characters"),
  price: z.number().min(1, "Price must be at least $1"),
})

type ProposalValues = z.infer<typeof proposalSchema>

export default function MarketplacePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [platform, setPlatform] = useState("all")
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProposalValues>({
    resolver: zodResolver(proposalSchema),
    defaultValues: { pitch: "", price: 500 },
  })

  useEffect(() => {
    const params = new URLSearchParams()
    if (platform !== "all") params.set("platform", platform)
    if (search) params.set("search", search)

    setIsLoading(true)
    fetch(`/api/creator/campaigns?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCampaigns(data.campaigns ?? []))
      .catch(() => toast.error("Failed to load campaigns"))
      .finally(() => setIsLoading(false))
  }, [search, platform])

  async function onSubmitProposal(values: ProposalValues) {
    if (!selectedCampaign) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/creator/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: selectedCampaign.id, ...values }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to submit proposal")
      toast.success(`Proposal submitted for "${selectedCampaign.title}"!`)
      setSelectedCampaign(null)
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit proposal")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Campaign Marketplace</h1>
        <p className="text-muted-foreground">Browse and apply to brand campaigns</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Platforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="YouTube">YouTube</SelectItem>
            <SelectItem value="TikTok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading campaigns...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{campaign.title}</CardTitle>
                    <CardDescription>{campaign.brand.companyName}</CardDescription>
                  </div>
                  <Badge variant="secondary">{campaign.platform}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
                <div className="text-xs text-muted-foreground border rounded-md p-2 bg-muted/50">
                  <span className="font-medium">Requirements: </span>{campaign.requirements}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    ${campaign.budget.toLocaleString()} budget
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {campaign.proposals.length} proposals
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => setSelectedCampaign(campaign)}>
                  Submit Proposal
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && campaigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No campaigns found matching your criteria.</p>
        </div>
      )}

      <Dialog open={!!selectedCampaign} onOpenChange={(open) => { if (!open) { setSelectedCampaign(null); form.reset() } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit Proposal</DialogTitle>
            <DialogDescription>
              Apply to &quot;{selectedCampaign?.title}&quot; by {selectedCampaign?.brand.companyName}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitProposal)} className="space-y-4">
              <FormField
                control={form.control}
                name="pitch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Pitch</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell the brand why you're the perfect fit for this campaign..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Price (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input type="number" className="pl-7" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setSelectedCampaign(null); form.reset() }} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
