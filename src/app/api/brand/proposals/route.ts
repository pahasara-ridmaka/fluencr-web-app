import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const updateSchema = z.object({
  proposalId: z.string(),
  status: z.enum(["IN_PROGRESS", "FINISHED"]),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const brand = await db.brand.findUnique({ where: { userId: session.user.id } })
    if (!brand) return NextResponse.json({ proposals: [] })

    const proposals = await db.proposal.findMany({
      where: { campaign: { brandId: brand.id } },
      include: {
        campaign: true,
        creator: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ proposals })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { proposalId, status } = updateSchema.parse(body)

    const proposal = await db.proposal.update({
      where: { id: proposalId },
      data: { status },
    })

    return NextResponse.json({ proposal })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
