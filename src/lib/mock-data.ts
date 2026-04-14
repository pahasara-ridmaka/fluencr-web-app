/**
 * Mock data for development and demo purposes.
 * Replace these with API calls when connecting to a real backend.
 */

export type JobStatus = "OPEN" | "PROPOSAL_PENDING" | "IN_PROGRESS" | "UNDER_REVIEW" | "FINISHED"

export interface MockCampaign {
  id: string
  title: string
  platform: string
  budget: number
  status: JobStatus
  proposals: number
  description?: string
  requirements?: string
}

export interface MockProposal {
  id: string
  creator: string
  campaign: string
  price: number
  status: JobStatus
  niche: string
  followers: string
}

export interface MockCreator {
  id: string
  name: string
  niche: string
  followers: string
  engagement: string
  platforms: string[]
  bio: string
  isRecommended?: boolean
}

export interface MockJob {
  id: string
  campaign: string
  brand: string
  budget: number
  platform: string
  status: JobStatus
  deadline: string
}

export const MOCK_CAMPAIGNS: MockCampaign[] = [
  {
    id: "1",
    title: "Summer Collection Launch",
    platform: "Instagram",
    budget: 5000,
    status: "OPEN",
    proposals: 12,
    description: "Promote our new summer fashion collection with creative lifestyle content.",
    requirements: "Minimum 50K followers, Fashion/Lifestyle niche",
  },
  {
    id: "2",
    title: "Tech Review Series",
    platform: "YouTube",
    budget: 8000,
    status: "IN_PROGRESS",
    proposals: 5,
    description: "In-depth reviews of our latest tech products.",
    requirements: "Minimum 100K subscribers, Tech niche",
  },
  {
    id: "3",
    title: "Holiday Gift Guide",
    platform: "TikTok",
    budget: 3500,
    status: "OPEN",
    proposals: 8,
    description: "Feature our products in a holiday gift guide video.",
    requirements: "Minimum 30K followers, Lifestyle/Family niche",
  },
  {
    id: "4",
    title: "Brand Awareness Campaign",
    platform: "Instagram",
    budget: 12000,
    status: "FINISHED",
    proposals: 20,
    description: "General brand awareness campaign across multiple creators.",
    requirements: "Minimum 100K followers, any niche",
  },
]

export const MOCK_PROPOSALS: MockProposal[] = [
  {
    id: "1",
    creator: "Alex Johnson",
    campaign: "Summer Collection",
    price: 1200,
    status: "PROPOSAL_PENDING",
    niche: "Fashion",
    followers: "45K",
  },
  {
    id: "2",
    creator: "Maria Garcia",
    campaign: "Tech Review Series",
    price: 2500,
    status: "IN_PROGRESS",
    niche: "Tech",
    followers: "120K",
  },
  {
    id: "3",
    creator: "Sam Lee",
    campaign: "Holiday Gift Guide",
    price: 800,
    status: "PROPOSAL_PENDING",
    niche: "Lifestyle",
    followers: "28K",
  },
  {
    id: "4",
    creator: "Jordan Smith",
    campaign: "Summer Collection",
    price: 1500,
    status: "FINISHED",
    niche: "Fashion",
    followers: "67K",
  },
  {
    id: "5",
    creator: "Taylor Brown",
    campaign: "Brand Awareness",
    price: 3000,
    status: "PROPOSAL_PENDING",
    niche: "Lifestyle",
    followers: "200K",
  },
]

export const MOCK_CREATORS: MockCreator[] = [
  {
    id: "1",
    name: "Alex Johnson",
    niche: "Fashion",
    followers: "45K",
    engagement: "4.2%",
    platforms: ["Instagram", "TikTok"],
    bio: "Fashion enthusiast sharing daily outfit inspiration and style tips.",
    isRecommended: true,
  },
  {
    id: "2",
    name: "Maria Garcia",
    niche: "Tech",
    followers: "120K",
    engagement: "3.8%",
    platforms: ["YouTube", "Instagram"],
    bio: "Tech reviewer covering the latest gadgets and software.",
    isRecommended: true,
  },
  {
    id: "3",
    name: "Sam Lee",
    niche: "Lifestyle",
    followers: "28K",
    engagement: "6.1%",
    platforms: ["Instagram", "TikTok"],
    bio: "Lifestyle creator focused on wellness, travel, and everyday moments.",
  },
  {
    id: "4",
    name: "Jordan Smith",
    niche: "Gaming",
    followers: "250K",
    engagement: "5.3%",
    platforms: ["YouTube", "Twitch"],
    bio: "Gaming content creator streaming daily and posting highlights.",
    isRecommended: true,
  },
  {
    id: "5",
    name: "Taylor Brown",
    niche: "Beauty",
    followers: "80K",
    engagement: "7.2%",
    platforms: ["Instagram", "YouTube"],
    bio: "Beauty guru sharing tutorials, reviews, and skincare routines.",
  },
  {
    id: "6",
    name: "Casey Wilson",
    niche: "Food",
    followers: "35K",
    engagement: "8.5%",
    platforms: ["Instagram", "TikTok"],
    bio: "Home chef and food blogger sharing recipes and restaurant reviews.",
  },
]

export const MOCK_JOBS: MockJob[] = [
  {
    id: "1",
    campaign: "Summer Collection Launch",
    brand: "FashionCo",
    budget: 1200,
    platform: "Instagram",
    status: "PROPOSAL_PENDING",
    deadline: "2024-02-15",
  },
  {
    id: "2",
    campaign: "Tech Review Series",
    brand: "TechBrand",
    budget: 2500,
    platform: "YouTube",
    status: "IN_PROGRESS",
    deadline: "2024-02-20",
  },
  {
    id: "3",
    campaign: "Holiday Gift Guide",
    brand: "GiftShop",
    budget: 800,
    platform: "TikTok",
    status: "OPEN",
    deadline: "2024-02-28",
  },
  {
    id: "4",
    campaign: "Brand Awareness Campaign",
    brand: "MegaBrand",
    budget: 3000,
    platform: "Instagram",
    status: "FINISHED",
    deadline: "2024-01-31",
  },
]

export const STATUS_BADGE_VARIANTS: Record<
  string,
  "default" | "secondary" | "success" | "warning" | "destructive"
> = {
  OPEN: "success",
  PROPOSAL_PENDING: "warning",
  IN_PROGRESS: "default",
  UNDER_REVIEW: "warning",
  FINISHED: "secondary",
}
