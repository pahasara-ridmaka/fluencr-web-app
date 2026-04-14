import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const platform = searchParams.get("platform")
    const search = searchParams.get("search")

    const campaigns = await db.campaign.findMany({
      where: {
        status: "OPEN",
        ...(platform && platform !== "all" ? { platform } : {}),
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
      },
      include: {
        brand: { include: { user: true } },
        proposals: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ campaigns })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
