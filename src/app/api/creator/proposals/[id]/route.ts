import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const patchSchema = z.object({
  status: z.enum(["UNDER_REVIEW"]).optional(),
  videoUrl: z.string().url().optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const data = patchSchema.parse(body)

    const creator = await db.creator.findUnique({
      where: { userId: session.user.id },
    })
    if (!creator) {
      return NextResponse.json(
        { error: "Creator profile not found" },
        { status: 404 }
      )
    }

    const proposal = await db.proposal.findFirst({
      where: { id, creatorId: creator.id },
    })
    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    const updated = await db.proposal.update({
      where: { id },
      data,
    })

    return NextResponse.json({ proposal: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
