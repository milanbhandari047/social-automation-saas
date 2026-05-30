import {
  Share2,
  CalendarDays,
  BarChart3,
  TrendingUp,
  Plus,
  Globe,
  Zap,
  CheckCircle2,
  Flame,
  Activity,
  Users,
} from "lucide-react";
import { StatCard, QuickAction, GrowthTip } from "@/types/dashboard.types";

export const STATS: StatCard[] = [
  {
    label: "Total Posts",
    value: "0",
    sub: "0 this month",
    icon: Share2,
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    label: "Scheduled",
    value: "0",
    sub: "0 upcoming",
    icon: CalendarDays,
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    label: "Published",
    value: "0",
    sub: "0 this week",
    icon: CheckCircle2,
    accent: "#22c55e",
    bg: "rgba(34,197,94,0.08)",
  },
  {
    label: "Avg. Reach",
    value: "—",
    sub: "Connect accounts",
    icon: TrendingUp,
    accent: "#e879f9",
    bg: "rgba(232,121,249,0.08)",
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Create Post",
    desc: "Write and schedule content across channels",
    icon: Plus,
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.15)",
    tag: "Core",
  },
  {
    label: "Connect Account",
    desc: "Link Facebook, Instagram, TikTok",
    icon: Globe,
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.06)",
    border: "rgba(59,130,246,0.15)",
    tag: "Setup",
  },
  {
    label: "View Calendar",
    desc: "Visualize your entire content schedule",
    icon: CalendarDays,
    accent: "#22c55e",
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.15)",
    tag: "Soon",
  },
  {
    label: "AI Assistant",
    desc: "Generate captions, hashtags, and ideas",
    icon: Zap,
    accent: "#e879f9",
    bg: "rgba(232,121,249,0.06)",
    border: "rgba(232,121,249,0.15)",
    tag: "Soon",
  },
];

export const GROWTH_TIPS: GrowthTip[] = [
  {
    icon: Flame,
    text: "Post consistently — 3–5 times/week drives 40% more reach",
    color: "#f59e0b",
  },
  {
    icon: Activity,
    text: "Best time to post: weekdays 9–11 AM in your audience's timezone",
    color: "#22c55e",
  },
  {
    icon: Users,
    text: "Engage with comments in the first hour to boost algorithm ranking",
    color: "#3b82f6",
  },
];
