import {
  LayoutDashboard, FileText, KanbanSquare, Scale, CalendarClock, Users,
  PlusCircle, FileEdit, Send, GitCompareArrows, Star, PenLine, ListChecks,
  ShieldCheck, Home, User, Wrench, FolderKanban, Clock, Search, Heart,
  Newspaper, Bookmark, Flag, Gavel, Save, SlidersHorizontal, Bell, Gauge,
  Layers, Settings, Bot
} from "lucide-react";
import type { Role } from "./types";

export interface NavItemT {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  roles?: Role[];
}

export interface NavGroupT {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  items: NavItemT[];
  roles?: Role[];
}

const ALL: Role[] = ["guest", "buyer", "freelancer", "admin"];
const AUTHED: Role[] = ["buyer", "freelancer", "admin"];

export const NAV_GROUPS: NavGroupT[] = [
  {
    id: "builder",
    label: "Agent Builder",
    icon: Bot,
    items: [
      { href: "/", label: "Agent Builder", icon: Bot, exact: true, roles: ALL },
      { href: "/marketplace", label: "Marketplace", icon: Newspaper, roles: ALL },
    ],
  },
  {
    id: "studio",
    label: "Studio",
    icon: LayoutDashboard,
    items: [
      { href: "/", label: "Overview", icon: Home, exact: true, roles: ALL },
      { href: "/brief", label: "Brief Editor", icon: FileText, roles: ["buyer"] },
      { href: "/roadmap", label: "Roadmap Board", icon: KanbanSquare, roles: ["buyer"] },
      { href: "/rules", label: "Product Rules", icon: Scale, roles: ["buyer", "freelancer", "admin"] },
      { href: "/release", label: "Release Plan", icon: CalendarClock, roles: ["buyer"] },
    ],
  },
  {
    id: "social",
    label: "Social",
    icon: Newspaper,
    items: [
      { href: "/social/feed", label: "Proof of Work Feed", icon: Newspaper, roles: ALL },
      { href: "/social/following", label: "Following", icon: Heart, roles: AUTHED },
      { href: "/social/bookmarks", label: "Bookmarks", icon: Bookmark, roles: AUTHED },
    ],
  },
];

export function getNavGroupsForRole(role: Role): NavGroupT[] {
  return NAV_GROUPS
    .map((group) => {
      if (group.roles && !group.roles.includes(role)) return null;
      const items = group.items.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(role);
      });
      if (items.length === 0) return null;
      return { ...group, items };
    })
    .filter((g): g is NavGroupT => g !== null);
}

export const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": { title: "Agent Builder", description: "Visual AI Agent Workflow Builder" },
  "/marketplace": { title: "Marketplace", description: "AI Artisans Marketplace" },
};

export function getPageMeta(pathname: string): { title: string; description: string } {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (pathname.startsWith("/marketplace")) return { title: "Marketplace", description: "AI Artisans Marketplace" };
  return { title: "Agent Builder", description: "" };
}
