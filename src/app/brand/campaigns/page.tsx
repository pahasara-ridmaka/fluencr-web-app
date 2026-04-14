import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"

const campaigns = [
  { id: "1", title: "Summer Collection Launch", platform: "Instagram", budget: 5000, status: "OPEN", proposals: 12, createdAt: "2024-01-15" },
  { id: "2", title: "Tech Review Series", platform: "YouTube", budget: 8000, status: "IN_PROGRESS", proposals: 5, createdAt: "2024-01-10" },
  { id: "3", title: "Holiday Gift Guide", platform: "TikTok", budget: 3500, status: "OPEN", proposals: 8, createdAt: "2024-01-08" },
  { id: "4", title: "Brand Awareness Campaign", platform: "Instagram", budget: 12000, status: "FINISHED", proposals: 20, createdAt: "2024-01-01" },
  { id: "5", title: "Product Launch Teaser", platform: "YouTube", budget: 6000, status: "OPEN", proposals: 3, createdAt: "2024-01-20" },
]

const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  OPEN: "success",
  IN_PROGRESS: "default",
  FINISHED: "secondary",
  PROPOSAL_PENDING: "warning",
}

export default function CampaignsPage() {
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
                  <TableCell>{campaign.proposals}</TableCell>
                  <TableCell>{campaign.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[campaign.status] ?? "secondary"}>
                      {campaign.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
