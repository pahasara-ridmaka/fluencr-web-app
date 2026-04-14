import Link from "next/link"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Briefcase, CheckCircle, DollarSign, ArrowRight, ShoppingBag } from "lucide-react"
import { STATUS_BADGE_VARIANTS } from "@/lib/mock-data"

type ProposalWithCampaignBrand = Prisma.ProposalGetPayload<{
  include: { campaign: { include: { brand: true } } }
}>

export default async function CreatorDashboard() {
  const session = await auth()

  let activeProposals = 0
  let jobsInProgress = 0
  let completed = 0
  let totalEarned = 0
  let recentProposals: ProposalWithCampaignBrand[] = []

  if (session?.user?.id) {
    const creator = await db.creator.findUnique({ where: { userId: session.user.id } })
    if (creator) {
      activeProposals = await db.proposal.count({
        where: { creatorId: creator.id, status: "PROPOSAL_PENDING" },
      })
      jobsInProgress = await db.proposal.count({
        where: { creatorId: creator.id, status: "IN_PROGRESS" },
      })
      completed = await db.proposal.count({
        where: { creatorId: creator.id, status: "FINISHED" },
      })
      const earnedResult = await db.proposal.aggregate({
        where: { creatorId: creator.id, status: "FINISHED" },
        _sum: { price: true },
      })
      totalEarned = earnedResult._sum.price ?? 0
      recentProposals = await db.proposal.findMany({
        where: { creatorId: creator.id },
        include: { campaign: { include: { brand: true } } },
        orderBy: { updatedAt: "desc" },
        take: 5,
      })
    }
  }

  const stats = [
    { label: "Active Proposals", value: String(activeProposals), icon: FileText, color: "text-purple-600" },
    { label: "Jobs In Progress", value: String(jobsInProgress), icon: Briefcase, color: "text-blue-600" },
    { label: "Completed", value: String(completed), icon: CheckCircle, color: "text-green-600" },
    { label: "Total Earned", value: `$${totalEarned.toLocaleString()}`, icon: DollarSign, color: "text-orange-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name ?? "Creator"}!</p>
        </div>
        <Button asChild>
          <Link href="/creator/marketplace">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Campaigns
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/creator/marketplace">
            <CardContent className="pt-6 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-semibold">Browse Marketplace</p>
                <p className="text-sm text-muted-foreground">Find new campaigns</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/creator/jobs">
            <CardContent className="pt-6 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold">Job Tracker</p>
                <p className="text-sm text-muted-foreground">{jobsInProgress} jobs in progress</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/creator/deliver">
            <CardContent className="pt-6 flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-semibold">Deliver Work</p>
                <p className="text-sm text-muted-foreground">Submit your deliverables</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Proposals</CardTitle>
            <CardDescription>Your latest proposal updates</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/creator/proposals">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentProposals.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No proposals yet. Browse the marketplace to get started!</p>
          ) : (
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <div key={proposal.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{proposal.campaign.title}</p>
                    <p className="text-xs text-muted-foreground">{proposal.campaign.brand.companyName}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-green-600">${proposal.price.toLocaleString()}</span>
                    <Badge variant={STATUS_BADGE_VARIANTS[proposal.status] ?? "secondary"} className="text-xs">
                      {proposal.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
