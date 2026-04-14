"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ChevronRight } from "lucide-react"

type JobStatus = "PROPOSAL_PENDING" | "IN_PROGRESS" | "UNDER_REVIEW" | "FINISHED"

interface Job {
  id: string
  price: number
  status: JobStatus
  campaign: {
    title: string
    platform: string
    brand: { companyName: string }
  }
}

const columns: { key: JobStatus; label: string; color: string }[] = [
  { key: "PROPOSAL_PENDING", label: "Pending Review", color: "bg-yellow-50 dark:bg-yellow-950/20" },
  { key: "IN_PROGRESS", label: "In Progress", color: "bg-purple-50 dark:bg-purple-950/20" },
  { key: "UNDER_REVIEW", label: "Under Review", color: "bg-blue-50 dark:bg-blue-950/20" },
  { key: "FINISHED", label: "Completed", color: "bg-green-50 dark:bg-green-950/20" },
]

const badgeVariants: Record<JobStatus, "warning" | "default" | "secondary" | "success"> = {
  PROPOSAL_PENDING: "warning",
  IN_PROGRESS: "default",
  UNDER_REVIEW: "secondary",
  FINISHED: "success",
}

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [advancing, setAdvancing] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/creator/proposals")
      .then((res) => res.json())
      .then((data) => {
        const proposals = (data.proposals ?? []) as Array<{
          id: string
          price: number
          status: string
          campaign: { title: string; platform: string; brand: { companyName: string } }
        }>
        setJobs(proposals as Job[])
      })
      .catch(() => toast.error("Failed to load jobs"))
      .finally(() => setIsLoading(false))
  }, [])

  async function submitForReview(jobId: string) {
    setAdvancing(jobId)
    try {
      const res = await fetch(`/api/creator/proposals/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "UNDER_REVIEW" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Failed to update job")
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: "UNDER_REVIEW" } : job))
      )
      toast.success("Submitted for brand review")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update job status")
    } finally {
      setAdvancing(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <p className="text-muted-foreground">Track your campaign jobs in a Kanban view</p>
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.key)
            return (
              <div key={col.key} className={`rounded-xl border p-4 ${col.color}`}>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">{col.label}</h3>
                  <Badge variant="outline" className="text-xs">{colJobs.length}</Badge>
                </div>
                <div className="space-y-3">
                  {colJobs.map((job) => (
                    <Card key={job.id} className="shadow-sm">
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <p className="font-medium text-sm">{job.campaign.title}</p>
                          <p className="text-xs text-muted-foreground">{job.campaign.brand.companyName}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">{job.campaign.platform}</Badge>
                          <span className="text-sm font-semibold text-green-600">${job.price.toLocaleString()}</span>
                        </div>
                        <Badge variant={badgeVariants[job.status]} className="text-xs w-full justify-center">
                          {job.status.replace(/_/g, " ")}
                        </Badge>
                        {job.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full text-xs"
                            disabled={advancing === job.id}
                            onClick={() => submitForReview(job.id)}
                          >
                            Submit for Review
                            <ChevronRight className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  {colJobs.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-4">No jobs</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
