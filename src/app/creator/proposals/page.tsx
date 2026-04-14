import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  PROPOSAL_PENDING: "warning",
  IN_PROGRESS: "default",
  UNDER_REVIEW: "warning",
  FINISHED: "success",
}

type ProposalWithCampaignBrand = Prisma.ProposalGetPayload<{
  include: { campaign: { include: { brand: true } } }
}>

export default async function MyProposalsPage() {
  const session = await auth()
  let proposals: ProposalWithCampaignBrand[] = []

  if (session?.user?.id) {
    const creator = await db.creator.findUnique({ where: { userId: session.user.id } })
    if (creator) {
      proposals = await db.proposal.findMany({
        where: { creatorId: creator.id },
        include: { campaign: { include: { brand: true } } },
        orderBy: { createdAt: "desc" },
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Proposals</h1>
        <p className="text-muted-foreground">Track all your submitted proposals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>{proposals.length} proposals submitted</CardDescription>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No proposals yet. Browse the marketplace to get started!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Your Price</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.campaign.title}</TableCell>
                    <TableCell>{p.campaign.brand.companyName}</TableCell>
                    <TableCell className="font-semibold text-green-600">${p.price.toLocaleString()}</TableCell>
                    <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[p.status] ?? "secondary"}>
                        {p.status.replace(/_/g, " ")}
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
