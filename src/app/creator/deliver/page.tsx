"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Upload, CheckCircle, ExternalLink } from "lucide-react"

const inProgressJobs = [
  { id: "1", title: "Summer Collection Launch", brand: "StyleCo", platform: "Instagram", price: 1200, deadline: "2024-02-15" },
  { id: "2", title: "Holiday Gift Guide", brand: "GiftShop", platform: "TikTok", price: 800, deadline: "2024-02-10" },
]

const deliverSchema = z.object({
  videoUrl: z.string().url("Please enter a valid URL"),
})

type DeliverValues = z.infer<typeof deliverSchema>

export default function DeliverPage() {
  const [selectedJob, setSelectedJob] = useState<typeof inProgressJobs[0] | null>(null)
  const [submittedJobs, setSubmittedJobs] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<DeliverValues>({
    resolver: zodResolver(deliverSchema),
    defaultValues: { videoUrl: "" },
  })

  async function onSubmit(values: DeliverValues) {
    if (!selectedJob) return
    setIsSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 500))
      setSubmittedJobs(prev => [...prev, selectedJob.id])
      toast.success("Work submitted successfully! Awaiting brand review.")
      setSelectedJob(null)
      form.reset()
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

      <div className="space-y-4">
        {inProgressJobs.map(job => {
          const isSubmitted = submittedJobs.includes(job.id)
          return (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{job.title}</CardTitle>
                    <CardDescription>{job.brand} · {job.platform}</CardDescription>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-green-600">${job.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Due {job.deadline}</p>
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

        {inProgressJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active jobs to deliver.</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedJob} onOpenChange={(open) => { if (!open) { setSelectedJob(null); form.reset() } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Deliverable</DialogTitle>
            <DialogDescription>
              Upload the video URL for &quot;{selectedJob?.title}&quot;
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
