"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Search, Star, Users, TrendingUp, Sparkles } from "lucide-react"

const creators = [
  { id: "1", name: "Alex Johnson", niche: "Fashion", followers: 45000, engagement: "4.2%", verified: true, ai: true, instagram: "@alexjohnson", bio: "Fashion & lifestyle creator based in NYC." },
  { id: "2", name: "Maria Garcia", niche: "Tech", followers: 120000, engagement: "3.8%", verified: true, ai: false, instagram: "@mariatech", bio: "Tech reviews, unboxings, and tutorials." },
  { id: "3", name: "Sam Lee", niche: "Lifestyle", followers: 28000, engagement: "6.1%", verified: false, ai: true, instagram: "@samlee", bio: "Living my best life and sharing it with you!" },
  { id: "4", name: "Jordan Smith", niche: "Gaming", followers: 67000, engagement: "5.5%", verified: true, ai: false, instagram: "@jordanplays", bio: "Pro gamer and content creator." },
  { id: "5", name: "Taylor Brown", niche: "Food", followers: 200000, engagement: "4.9%", verified: true, ai: true, instagram: "@tayloreats", bio: "Food blogger and recipe developer." },
  { id: "6", name: "Casey White", niche: "Travel", followers: 89000, engagement: "5.2%", verified: true, ai: false, instagram: "@caseytravel", bio: "Exploring the world one country at a time." },
  { id: "7", name: "Riley Adams", niche: "Beauty", followers: 155000, engagement: "7.1%", verified: true, ai: true, instagram: "@rileybeauty", bio: "Makeup artist and beauty enthusiast." },
  { id: "8", name: "Morgan Davis", niche: "Sports", followers: 42000, engagement: "4.5%", verified: false, ai: false, instagram: "@morgansports", bio: "Fitness coach and sports content creator." },
]

const niches = ["All", "Fashion", "Tech", "Lifestyle", "Gaming", "Food", "Travel", "Beauty", "Sports"]

export default function DiscoverPage() {
  const [search, setSearch] = useState("")
  const [selectedNiche, setSelectedNiche] = useState("All")

  const filtered = creators.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.niche.toLowerCase().includes(search.toLowerCase())
    const matchesNiche = selectedNiche === "All" || c.niche === selectedNiche
    return matchesSearch && matchesNiche
  })

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
        {niches.map(niche => (
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(creator => (
          <HoverCard key={creator.id} openDelay={200}>
            <HoverCardTrigger asChild>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {creator.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      {creator.verified && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-blue-500 p-0.5">
                          <Star className="h-3 w-3 text-white fill-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1 justify-center">
                        <p className="font-semibold">{creator.name}</p>
                        {creator.ai && (
                          <Sparkles className="h-4 w-4 text-purple-500" aria-label="AI Recommended" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{creator.instagram}</p>
                    </div>

                    <Badge variant="secondary">{creator.niche}</Badge>

                    <div className="flex gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{(creator.followers / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span>{creator.engagement}</span>
                      </div>
                    </div>

                    {creator.ai && (
                      <Badge variant="default" className="text-xs bg-purple-600 hover:bg-purple-600">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Recommended
                      </Badge>
                    )}

                    <Button size="sm" className="w-full">Invite to Campaign</Button>
                  </div>
                </CardContent>
              </Card>
            </HoverCardTrigger>
            <HoverCardContent className="w-72">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{creator.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{creator.name}</p>
                    <p className="text-xs text-muted-foreground">{creator.niche} Creator</p>
                  </div>
                </div>
                <p className="text-sm">{creator.bio}</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-muted p-2 text-center">
                    <p className="font-bold">{(creator.followers / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                  <div className="rounded-md bg-muted p-2 text-center">
                    <p className="font-bold">{creator.engagement}</p>
                    <p className="text-xs text-muted-foreground">Engagement</p>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No creators found matching your search.</p>
        </div>
      )}
    </div>
  )
}
