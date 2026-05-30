import { LucideIcon } from "lucide-react";
import type { JSX } from "react";

export interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  accent: string;
  bg: string;
}

export interface QuickAction {
  label: string;
  desc: string;
  icon: LucideIcon;
  accent: string;
  bg: string;
  border: string;
  tag: string;
}

export interface Platform {
  name: string;
  Icon: () => JSX.Element;
  color: string;
}

export interface GrowthTip {
  icon: LucideIcon;
  text: string;
  color: string;
}
