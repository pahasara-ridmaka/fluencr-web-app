import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const creatorSchema = z.object({
  niche: z.string().min(1),
  instagram: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  followers: z.number().min(0),
  portfolioUrl: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { niche, instagram, youtube, tiktok, followers, portfolioUrl } = creatorSchema.parse(body)

    const socialLinks = {
      ...(instagram && { instagram }),
      ...(youtube && { youtube }),
      ...(tiktok && { tiktok }),
    }

    await db.creator.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        niche,
        socialLinks,
        followers,
        portfolioUrl,
      },
      update: { niche, socialLinks, followers, portfolioUrl },
    })

    await db.user.update({
      where: { id: session.user.id },
      data: { onboarded: true },
    })

    return NextResponse.json({ message: "Creator profile saved" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
