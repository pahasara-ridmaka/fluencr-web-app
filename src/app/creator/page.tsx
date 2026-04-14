import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Briefcase, CheckCircle, DollarSign, ArrowRight, ShoppingBag } from "lucide-react"

const recentActivity = [
  { id: "1", text: "Your proposal for 'Summer Collection Launch' was approved!", time: "2h ago", type: "success" },
  { id: "2", text: "New campaign matching your niche: 'Tech Review Series'", time: "5h ago", type: "info" },
  { id: "3", text: "Payment of $1,200 received for 'Holiday Campaign'", time: "1d ago", type: "success" },
  { id: "4", text: "Proposal submitted for 'Brand Awareness Campaign'", time: "2d ago", type: "neutral" },
]

export default async function CreatorDashboard() {
  const session = await auth()

  const stats = [
    { label: "Active Proposals", value: "4", icon: FileText, color: "text-purple-600" },
    { label: "Jobs In Progress", value: "2", icon: Briefcase, color: "text-blue-600" },
    { label: "Completed", value: "8", icon: CheckCircle, color: "text-green-600" },
    { label: "Total Earned", value: "$9,400", icon: DollarSign, color: "text-orange-600" },
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
                <p className="text-sm text-muted-foreground">12 new campaigns available</p>
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
                <p className="text-sm text-muted-foreground">2 jobs in progress</p>
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
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/creator/proposals">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  activity.type === "success" ? "bg-green-500" :
                  activity.type === "info" ? "bg-blue-500" : "bg-gray-300"
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.text}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
