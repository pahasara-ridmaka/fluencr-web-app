"use client"

import { useState } from "react"
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

const mockProposals = [
  { id: "1", creator: "Alex Johnson", campaign: "Summer Collection", price: 1200, status: "PROPOSAL_PENDING", niche: "Fashion", followers: "45K" },
  { id: "2", creator: "Maria Garcia", campaign: "Tech Review Series", price: 2500, status: "IN_PROGRESS", niche: "Tech", followers: "120K" },
  { id: "3", creator: "Sam Lee", campaign: "Holiday Gift Guide", price: 800, status: "PROPOSAL_PENDING", niche: "Lifestyle", followers: "28K" },
  { id: "4", creator: "Jordan Smith", campaign: "Summer Collection", price: 1500, status: "FINISHED", niche: "Fashion", followers: "67K" },
  { id: "5", creator: "Taylor Brown", campaign: "Brand Awareness", price: 3000, status: "PROPOSAL_PENDING", niche: "Lifestyle", followers: "200K" },
]

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  PROPOSAL_PENDING: "warning",
  IN_PROGRESS: "default",
  FINISHED: "success",
  OPEN: "secondary",
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState(mockProposals)
  const [selectedProposal, setSelectedProposal] = useState<typeof mockProposals[0] | null>(null)
  const [dialogAction, setDialogAction] = useState<"approve" | "reject" | null>(null)

  function openDialog(proposal: typeof mockProposals[0], action: "approve" | "reject") {
    setSelectedProposal(proposal)
    setDialogAction(action)
  }

  function handleAction() {
    if (!selectedProposal || !dialogAction) return
    const newStatus = dialogAction === "approve" ? "IN_PROGRESS" : "FINISHED"
    setProposals(prev =>
      prev.map(p => p.id === selectedProposal.id ? { ...p, status: newStatus } : p)
    )
    toast.success(`Proposal ${dialogAction === "approve" ? "approved" : "rejected"} successfully`)
    setSelectedProposal(null)
    setDialogAction(null)
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
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {proposal.creator.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{proposal.creator}</span>
                    </div>
                  </TableCell>
                  <TableCell>{proposal.campaign}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{proposal.niche}</Badge>
                  </TableCell>
                  <TableCell>{proposal.followers}</TableCell>
                  <TableCell className="font-semibold">${proposal.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[proposal.status] ?? "secondary"}>
                      {proposal.status.replace("_", " ")}
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
              ))}
            </TableBody>
          </Table>
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
                ? `Are you sure you want to approve the proposal from ${selectedProposal?.creator}? This will move the campaign to In Progress.`
                : `Are you sure you want to reject the proposal from ${selectedProposal?.creator}? This action cannot be undone.`
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
            >
              {dialogAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
