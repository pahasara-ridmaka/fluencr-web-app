"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Upload, CheckCircle, ExternalLink } from "lucide-react"

interface Job {
  id: string
  price: number
  videoUrl: string | null
  campaign: {
    title: string
    platform: string
    brand: { companyName: string }
  }
}

const deliverSchema = z.object({
  videoUrl: z.string().url("Please enter a valid URL"),
})

type DeliverValues = z.infer<typeof deliverSchema>

export default function DeliverPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [submittedJobs, setSubmittedJobs] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DeliverValues>({
    resolver: zodResolver(deliverSchema),
    defaultValues: { videoUrl: "" },
  })

  useEffect(() => {
    fetch("/api/creator/proposals")
      .then((res) => res.json())
      .then((data) => {
        const inProgress = (data.proposals ?? []).filter(
          (p: { status: string }) => p.status === "IN_PROGRESS"
        )
        setJobs(inProgress as Job[])
      })
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setIsLoading(false))
  }, [])

  async function onSubmit(values: DeliverValues) {
    if (!selectedJob) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/creator/proposals/${selectedJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "UNDER_REVIEW", videoUrl: values.videoUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to submit work")
      setSubmittedJobs((prev) => [...prev, selectedJob.id])
      toast.success("Work submitted successfully! Awaiting brand review.")
      setSelectedJob(null)
      form.reset()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit work")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Deliver Work</h1>
        <p className="text-muted-foreground">Submit your completed work for brand review</p>
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading jobs...</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const isSubmitted = submittedJobs.includes(job.id)
            return (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">{job.campaign.title}</CardTitle>
                      <CardDescription>{job.campaign.brand.companyName} · {job.campaign.platform}</CardDescription>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-green-600">${job.price.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Work submitted — awaiting review</span>
                    </div>
                  ) : (
                    <Button onClick={() => setSelectedJob(job)} className="w-full sm:w-auto">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit Deliverable
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}

          {jobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active jobs to deliver.</p>
            </div>
          )}
        </div>
      )}

      <Dialog open={!!selectedJob} onOpenChange={(open) => { if (!open) { setSelectedJob(null); form.reset() } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Deliverable</DialogTitle>
            <DialogDescription>
              Upload the video URL for &quot;{selectedJob?.campaign.title}&quot;
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="https://youtube.com/watch?v=..." className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => { setSelectedJob(null); form.reset() }} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
