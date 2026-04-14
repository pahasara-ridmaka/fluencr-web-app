import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const campaignSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  requirements: z.string().min(10),
  platform: z.string().min(1),
  budget: z.number().min(100),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const brand = await db.brand.findUnique({ where: { userId: session.user.id } })
    if (!brand) return NextResponse.json({ campaigns: [] })

    const campaigns = await db.campaign.findMany({
      where: { brandId: brand.id },
      include: { proposals: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ campaigns })
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
    const data = campaignSchema.parse(body)

    const brand = await db.brand.findUnique({ where: { userId: session.user.id } })
    if (!brand) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 })
    }

    const campaign = await db.campaign.create({
      data: { ...data, brandId: brand.id },
    })

    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
