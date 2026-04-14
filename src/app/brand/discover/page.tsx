"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { toast } from "sonner"
import { Search, Users, TrendingUp } from "lucide-react"

interface Creator {
  id: string
  niche: string
  followers: number
  socialLinks: Record<string, string> | null
  user: { name: string | null; image: string | null }
}

const niches = ["All", "Fashion", "Tech", "Lifestyle", "Gaming", "Food", "Travel", "Beauty", "Sports"]

export default function DiscoverPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("All")

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (selectedNiche !== "All") params.set("niche", selectedNiche)

    setIsLoading(true)
    fetch(`/api/brand/creators?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCreators(data.creators ?? []))
      .catch(() => toast.error("Failed to load creators"))
      .finally(() => setIsLoading(false))
  }, [search, selectedNiche])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Discover Creators</h1>
        <p className="text-muted-foreground">Find the perfect influencers for your campaigns</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search creators..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {niches.map((niche) => (
          <Button
            key={niche}
            variant={selectedNiche === niche ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedNiche(niche)}
          >
            {niche}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading creators...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {creators.map((creator) => {
            const name = creator.user.name ?? "Creator"
            const initials = name.split(" ").map((n) => n[0]).join("")
            const instagram = creator.socialLinks?.instagram ?? null

            return (
              <HoverCard key={creator.id} openDelay={200}>
                <HoverCardTrigger asChild>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-semibold">{name}</p>
                          {instagram && (
                            <p className="text-xs text-muted-foreground">{instagram}</p>
                          )}
                        </div>

                        <Badge variant="secondary">{creator.niche}</Badge>

                        <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{creator.followers >= 1000
                              ? `${(creator.followers / 1000).toFixed(0)}K`
                              : creator.followers}
                            </span>
                          </div>
                          {creator.socialLinks?.engagement && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-muted-foreground" />
                              <span>{creator.socialLinks.engagement}</span>
                            </div>
                          )}
                        </div>

                        <Button size="sm" className="w-full">Invite to Campaign</Button>
                      </div>
                    </CardContent>
                  </Card>
                </HoverCardTrigger>
                <HoverCardContent className="w-72">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{name}</p>
                        <p className="text-xs text-muted-foreground">{creator.niche} Creator</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-md bg-muted p-2 text-center">
                        <p className="font-bold">
                          {creator.followers >= 1000
                            ? `${(creator.followers / 1000).toFixed(0)}K`
                            : creator.followers}
                        </p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      {creator.socialLinks?.engagement && (
                        <div className="rounded-md bg-muted p-2 text-center">
                          <p className="font-bold">{creator.socialLinks.engagement}</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )
          })}
        </div>
      )}

      {!isLoading && creators.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No creators found matching your search.</p>
        </div>
      )}
    </div>
  )
}
