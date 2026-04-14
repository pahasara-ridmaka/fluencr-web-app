"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ChevronRight } from "lucide-react"

type Status = "PENDING" | "APPROVED" | "IN_PROGRESS" | "COMPLETED"

interface Job {
  id: string
  title: string
  brand: string
  price: number
  platform: string
  status: Status
}

const initialJobs: Job[] = [
  { id: "1", title: "Summer Collection Launch", brand: "StyleCo", price: 1200, platform: "Instagram", status: "PENDING" },
  { id: "2", title: "Tech Review Series", brand: "TechGiant", price: 2500, platform: "YouTube", status: "APPROVED" },
  { id: "3", title: "Holiday Gift Guide", brand: "GiftShop", price: 800, platform: "TikTok", status: "IN_PROGRESS" },
  { id: "4", title: "Fitness App Launch", brand: "FitLife", price: 1500, platform: "Instagram", status: "COMPLETED" },
  { id: "5", title: "Food Blog Collab", brand: "FoodBrand", price: 600, platform: "YouTube", status: "COMPLETED" },
]

const columns: { key: Status; label: string; color: string }[] = [
  { key: "PENDING", label: "Pending", color: "bg-yellow-50 dark:bg-yellow-950/20" },
  { key: "APPROVED", label: "Approved", color: "bg-blue-50 dark:bg-blue-950/20" },
  { key: "IN_PROGRESS", label: "In Progress", color: "bg-purple-50 dark:bg-purple-950/20" },
  { key: "COMPLETED", label: "Completed", color: "bg-green-50 dark:bg-green-950/20" },
]

const nextStatus: Record<Status, Status | null> = {
  PENDING: "APPROVED",
  APPROVED: "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED: null,
}

const badgeVariants: Record<Status, "warning" | "default" | "secondary" | "success"> = {
  PENDING: "warning",
  APPROVED: "default",
  IN_PROGRESS: "secondary",
  COMPLETED: "success",
}

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState(initialJobs)

  function advanceJob(jobId: string) {
    setJobs(prev => prev.map(job => {
      if (job.id !== jobId) return job
      const next = nextStatus[job.status]
      if (!next) return job
      toast.success(`Job moved to ${next.replace("_", " ")}`)
      return { ...job, status: next }
    }))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Job Tracker</h1>
        <p className="text-muted-foreground">Track your campaign jobs in a Kanban view</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map(col => {
          const colJobs = jobs.filter(j => j.status === col.key)
          return (
            <div key={col.key} className={`rounded-xl border p-4 ${col.color}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <Badge variant="outline" className="text-xs">{colJobs.length}</Badge>
              </div>
              <div className="space-y-3">
                {colJobs.map(job => (
                  <Card key={job.id} className="shadow-sm">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">{job.brand}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{job.platform}</Badge>
                        <span className="text-sm font-semibold text-green-600">${job.price.toLocaleString()}</span>
                      </div>
                      <Badge variant={badgeVariants[job.status]} className="text-xs w-full justify-center">
                        {job.status.replace("_", " ")}
                      </Badge>
                      {nextStatus[job.status] && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                          onClick={() => advanceJob(job.id)}
                        >
                          Move to {nextStatus[job.status]?.replace("_", " ")}
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
    </div>
  )
}
