import {
  Settings,
  Bookmark,
  Brain,
  Calculator,
  ChartNoAxesCombined,
  Dumbbell,
  Gamepad2,
  Globe2,
  Home,
  Info,
  Languages,
  MessageSquare,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import type { SubjectKey } from "@/lib/subject-theme";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Hidden from guests (the page itself is protected). */
  requiresAuth?: boolean;
  /** Tints the icon with the subject's colour. */
  subject?: SubjectKey;
  /** Extra path prefixes that should also mark this item active. */
  also?: string[];
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

/** Main destinations. Also drives the mobile bottom tab bar. */
export const PRIMARY_NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: Home, requiresAuth: true },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/analytics", label: "Analytics", icon: ChartNoAxesCombined, requiresAuth: true },
  { to: "/bookmarks", label: "Bookmarks", icon: Bookmark, requiresAuth: true },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy, requiresAuth: true },
];

export const SUBJECT_NAV: NavItem[] = [
  { to: "/SSC/maths", label: "Quant", icon: Calculator, subject: "maths" },
  { to: "/SSC/english", label: "English", icon: Languages, subject: "english" },
  { to: "/SSC/reasoning", label: "Reasoning", icon: Brain, subject: "reasoning" },
  { to: "/SSC/gk", label: "General Knowledge", icon: Globe2, subject: "gk" },
];

export const PLAY_NAV: NavItem[] = [
  {
    to: "/SSC/english/games",
    label: "Word Games",
    icon: Gamepad2,
    also: ["/SSC/english/hangman"],
  },
];

export const SUPPORT_NAV: NavItem[] = [
  { to: "/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/about", label: "About", icon: Info },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function navGroups(isSignedIn: boolean): NavGroup[] {
  return [
    {
      label: null,
      items: PRIMARY_NAV.filter((item) => isSignedIn || !item.requiresAuth),
    },
    { label: "Subjects", items: SUBJECT_NAV },
    { label: "Play", items: PLAY_NAV },
    { label: "Support", items: SUPPORT_NAV },
  ];
}

const ALL_ITEMS = [...PRIMARY_NAV, ...SUBJECT_NAV, ...PLAY_NAV, ...SUPPORT_NAV];

function matchLength(pathname: string, item: NavItem): number {
  let best = 0;
  for (const prefix of [item.to, ...(item.also ?? [])]) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
      best = Math.max(best, prefix.length);
    }
  }
  return best;
}

/**
 * The single active item for a path: the one with the longest matching prefix,
 * so "/SSC/english/games" highlights Word Games rather than English.
 */
export function activeNavPath(pathname: string): string | null {
  let winner: NavItem | null = null;
  let winnerLength = 0;
  for (const item of ALL_ITEMS) {
    const length = matchLength(pathname, item);
    if (length > winnerLength) {
      winner = item;
      winnerLength = length;
    }
  }
  return winner?.to ?? null;
}
