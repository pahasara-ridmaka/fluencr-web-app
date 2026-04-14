import Link from "next/link"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  OPEN: "success",
  IN_PROGRESS: "default",
  FINISHED: "secondary",
  PROPOSAL_PENDING: "warning",
  UNDER_REVIEW: "warning",
}

type CampaignWithProposals = Prisma.CampaignGetPayload<{ include: { proposals: true } }>

export default async function CampaignsPage() {
  const session = await auth()
  let campaigns: CampaignWithProposals[] = []

  if (session?.user?.id) {
    const brand = await db.brand.findUnique({ where: { userId: session.user.id } })
    if (brand) {
      campaigns = await db.campaign.findMany({
        where: { brandId: brand.id },
        include: { proposals: true },
        orderBy: { createdAt: "desc" },
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage all your influencer campaigns</p>
        </div>
        <Button asChild>
          <Link href="/brand/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>{campaigns.length} total campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No campaigns yet. Create your first campaign!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Proposals</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.title}</TableCell>
                    <TableCell>{campaign.platform}</TableCell>
                    <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                    <TableCell>{campaign.proposals.length}</TableCell>
                    <TableCell>{new Date(campaign.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[campaign.status] ?? "secondary"}>
                        {campaign.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
