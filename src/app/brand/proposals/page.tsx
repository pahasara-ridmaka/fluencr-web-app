"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"
import { STATUS_BADGE_VARIANTS } from "@/lib/mock-data"

interface Proposal {
  id: string
  price: number
  status: string
  createdAt: string
  campaign: { title: string }
  creator: {
    niche: string
    followers: number
    user: { name: string | null }
  }
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/brand/proposals")
      .then((res) => res.json())
      .then((data) => setProposals(data.proposals ?? []))
      .catch(() => toast.error("Failed to load proposals"))
      .finally(() => setIsLoading(false))
  }, [])

  function openDialog(proposal: Proposal, action: "approve" | "reject") {
    setSelectedProposal(proposal)
    setDialogAction(action)
  }

  async function handleAction() {
    if (!selectedProposal || !dialogAction) return
    const newStatus = dialogAction === "approve" ? "IN_PROGRESS" : "FINISHED"
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/brand/proposals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: selectedProposal.id, status: newStatus }),
      })
      if (!res.ok) throw new Error("Failed to update proposal")
      setProposals((prev) =>
        prev.map((p) => (p.id === selectedProposal.id ? { ...p, status: newStatus } : p))
      )
      toast.success(`Proposal ${dialogAction === "approve" ? "approved" : "rejected"} successfully`)
    } catch {
      toast.error("Failed to update proposal")
    } finally {
      setIsSubmitting(false)
      setSelectedProposal(null)
      setDialogAction(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Proposals</h1>
        <p className="text-muted-foreground">Review and manage creator proposals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>{proposals.filter(p => p.status === "PROPOSAL_PENDING").length} pending review</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading proposals...</p>
          ) : proposals.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No proposals yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Niche</TableHead>
                  <TableHead>Followers</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => {
                  const creatorName = proposal.creator.user.name ?? "Unknown"
                  return (
                    <TableRow key={proposal.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {creatorName.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{creatorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{proposal.campaign.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{proposal.creator.niche}</Badge>
                      </TableCell>
                      <TableCell>{proposal.creator.followers.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold">${proposal.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_BADGE_VARIANTS[proposal.status] ?? "secondary"}>
                          {proposal.status.replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {proposal.status === "PROPOSAL_PENDING" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog(proposal, "approve")}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openDialog(proposal, "reject")}
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedProposal} onOpenChange={() => { setSelectedProposal(null); setDialogAction(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "approve" ? "Approve Proposal" : "Reject Proposal"}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === "approve"
                ? `Are you sure you want to approve the proposal from ${selectedProposal?.creator.user.name}? This will move the campaign to In Progress.`
                : `Are you sure you want to reject the proposal from ${selectedProposal?.creator.user.name}? This action cannot be undone.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedProposal(null); setDialogAction(null) }}>
              Cancel
            </Button>
            <Button
              variant={dialogAction === "reject" ? "destructive" : "default"}
              onClick={handleAction}
              disabled={isSubmitting}
            >
              {dialogAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
