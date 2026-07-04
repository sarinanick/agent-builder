// Roles
export type Role = "guest" | "buyer" | "freelancer" | "admin";

// Priority levels
export type Priority = "P0" | "P1" | "P2";

// Brief statuses
export type BriefStatus = "draft" | "published" | "accepting" | "shortlisted" | "hired" | "completed";

// Proposal statuses
export type ProposalStatus = "draft" | "submitted" | "shortlisted" | "hired" | "rejected";

// Trust levels
export type TrustLevel = "low" | "neutral" | "strong";

// Availability
export type Availability = "available" | "limited" | "busy";

// Milestone status
export type MilestoneStatus = "pending" | "active" | "done";

// Notification types
export type NotificationType = "proposal" | "shortlist" | "review" | "follow" | "reaction" | "milestone" | "contract" | "report";

export interface User {
  id: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  avatar: string;
  role: Role;
  trustScore: number;
  reviewCount: number;
  completionCount: number;
  skills: string[];
  tools: string[];
}

export interface Brief {
  id: string;
  title: string;
  description: string;
  budget: { min: number; max: number };
  timeline: string;
  skills: string[];
  status: BriefStatus;
  buyerId: string;
  createdAt: string;
  proposalCount: number;
}

export interface Proposal {
  id: string;
  briefId: string;
  freelancerId: string;
  coverLetter: string;
  price: number;
  timeline: string;
  experience: string;
  trustSignal: number;
  portfolioRelevance: string;
  status: ProposalStatus;
  createdAt: string;
}

export interface Story {
  id: string;
  title: string;
  area: string;
  priority: Priority;
  owner: string;
  impact: string;
  effort: string;
  status: string;
  value: string;
  whyItStays: string;
  tags: string[];
  note?: string;
}

export interface Milestone {
  id: string;
  title: string;
  status: MilestoneStatus;
  owner: string;
  dueDate: string;
}

export interface Contract {
  id: string;
  briefId: string;
  freelancerId: string;
  startDate: string;
  status: "pending" | "active" | "completed";
  milestones: Milestone[];
}

export interface Review {
  id: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  body: string;
  mediaUrl?: string;
  link?: string;
  reactionCount: number;
  bookmarkCount: number;
  createdAt: string;
  category: string;
}

export interface SavedSearch {
  id: string;
  query: string;
  filters: Record<string, string>;
  createdAt: string;
  resultCount: number;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: "user" | "post" | "brief";
  reason: string;
  note?: string;
  status: "pending" | "resolved";
  createdAt: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  count: number;
}
