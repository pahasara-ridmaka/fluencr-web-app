import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Megaphone, DollarSign, FileText, Users, Plus, ArrowRight } from "lucide-react"
import { MOCK_CAMPAIGNS, STATUS_BADGE_VARIANTS } from "@/lib/mock-data"

export default async function BrandDashboard() {
  const session = await auth()

  const stats = [
    { label: "Active Campaigns", value: "3", icon: Megaphone, color: "text-purple-600" },
    { label: "Budget Spent", value: "$28,500", icon: DollarSign, color: "text-green-600" },
    { label: "Pending Proposals", value: "25", icon: FileText, color: "text-orange-600" },
    { label: "Total Creators", value: "47", icon: Users, color: "text-blue-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Brand Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session?.user?.name ?? "Brand"}!</p>
        </div>
        <Button asChild>
          <Link href="/brand/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Stats */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/brand/campaigns/new">
            <CardContent className="pt-6 flex items-center gap-3">
              <Megaphone className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-semibold">Create Campaign</p>
                <p className="text-sm text-muted-foreground">Launch a new influencer campaign</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/brand/discover">
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="font-semibold">Discover Creators</p>
                <p className="text-sm text-muted-foreground">Find the perfect influencers</p>
              </div>
            </CardContent>
          </Link>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <Link href="/brand/proposals">
            <CardContent className="pt-6 flex items-center gap-3">
              <FileText className="h-8 w-8 text-orange-600" />
              <div>
                <p className="font-semibold">Review Proposals</p>
                <p className="text-sm text-muted-foreground">25 pending proposals</p>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Campaigns</CardTitle>
            <CardDescription>Your latest campaign activity</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/brand/campaigns">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Proposals</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_CAMPAIGNS.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell>{campaign.platform}</TableCell>
                  <TableCell>${campaign.budget.toLocaleString()}</TableCell>
                  <TableCell>{campaign.proposals}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE_VARIANTS[campaign.status] ?? "secondary"}>
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
