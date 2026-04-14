import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const proposals = [
  { id: "1", campaign: "Summer Collection Launch", brand: "StyleCo", price: 1200, status: "IN_PROGRESS", submittedAt: "2024-01-15" },
  { id: "2", campaign: "Tech Review Series", brand: "TechGiant", price: 2500, status: "PROPOSAL_PENDING", submittedAt: "2024-01-18" },
  { id: "3", campaign: "Holiday Gift Guide", brand: "GiftShop", price: 800, status: "FINISHED", submittedAt: "2024-01-10" },
  { id: "4", campaign: "Brand Awareness Campaign", brand: "BrandX", price: 1500, status: "PROPOSAL_PENDING", submittedAt: "2024-01-20" },
]

const statusColors: Record<string, "default" | "secondary" | "success" | "warning"> = {
  PROPOSAL_PENDING: "warning",
  IN_PROGRESS: "default",
  FINISHED: "success",
}

export default function MyProposalsPage() {
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
                  <TableCell className="font-medium">{p.campaign}</TableCell>
                  <TableCell>{p.brand}</TableCell>
                  <TableCell className="font-semibold text-green-600">${p.price.toLocaleString()}</TableCell>
                  <TableCell>{p.submittedAt}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[p.status] ?? "secondary"}>
                      {p.status.replace("_", " ")}
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
