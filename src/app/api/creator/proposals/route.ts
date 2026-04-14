import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const proposalSchema = z.object({
  campaignId: z.string(),
  pitch: z.string().min(20),
  price: z.number().min(1),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const creator = await db.creator.findUnique({ where: { userId: session.user.id } })
    if (!creator) return NextResponse.json({ proposals: [] })

    const proposals = await db.proposal.findMany({
      where: { creatorId: creator.id },
      include: { campaign: { include: { brand: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ proposals })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = proposalSchema.parse(body)

    const creator = await db.creator.findUnique({ where: { userId: session.user.id } })
    if (!creator) {
      return NextResponse.json({ error: "Creator profile not found" }, { status: 404 })
    }

    const existing = await db.proposal.findFirst({
      where: { campaignId: data.campaignId, creatorId: creator.id },
    })
    if (existing) {
      return NextResponse.json({ error: "You already submitted a proposal for this campaign" }, { status: 400 })
    }

    const proposal = await db.proposal.create({
      data: { ...data, creatorId: creator.id },
    })

    return NextResponse.json({ proposal }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
