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
    const search = searchParams.get("search")
    const niche = searchParams.get("niche")

    const creators = await db.creator.findMany({
      where: {
        ...(niche && niche !== "All" ? { niche } : {}),
        ...(search
          ? {
              OR: [
                { user: { name: { contains: search, mode: "insensitive" } } },
                { niche: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { user: true },
      orderBy: { followers: "desc" },
    })

    return NextResponse.json({ creators })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
