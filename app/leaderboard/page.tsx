"use client";

import React, { useState } from "react";
import { 
  Trophy, Flame, Zap, Crown, Medal, ArrowUp, 
  ShieldCheck, Sparkles, Clock, Target, ArrowRight
} from "lucide-react";
import { TopicPageLayout } from "@/components/custom/TopicPageLayout";
import { Button } from "@/components/ui/button";
import { ProtectedRoute } from "@/components/custom/ProtectedRoute";
import { useAuth } from "@/context/auth";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarText: string;
  xp: number;
  accuracy: string;
  speed: string;
  streak: number;
  isCurrentUser?: boolean;
}

const TOP_THREE: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Vikramaditya S.",
    avatarText: "VS",
    xp: 14850,
    accuracy: "98.2%",
    speed: "2.4s",
    streak: 42,
  },
  {
    rank: 2,
    name: "Ananya Gupta",
    avatarText: "AG",
    xp: 13200,
    accuracy: "96.5%",
    speed: "2.8s",
    streak: 35,
  },
  {
    rank: 3,
    name: "Rohan Mehra",
    avatarText: "RM",
    xp: 11900,
    accuracy: "94.8%",
    speed: "3.1s",
    streak: 28,
  },
];

const LEADERBOARD_ROWS: LeaderboardUser[] = [
  ...TOP_THREE,
  {
    rank: 4,
    name: "Sneha Reddy",
    avatarText: "SR",
    xp: 10450,
    accuracy: "93.4%",
    speed: "3.5s",
    streak: 21,
  },
  {
    rank: 5,
    name: "Karan Johar",
    avatarText: "KJ",
    xp: 9800,
    accuracy: "92.1%",
    speed: "3.7s",
    streak: 18,
  },
  {
    rank: 6,
    name: "Pooja Sharma",
    avatarText: "PS",
    xp: 9200,
    accuracy: "91.8%",
    speed: "3.9s",
    streak: 15,
  },
  {
    rank: 7,
    name: "You (Rahul S.)",
    avatarText: "RS",
    xp: 8640,
    accuracy: "92.4%",
    speed: "3.8s",
    streak: 12,
    isCurrentUser: true,
  },
  {
    rank: 8,
    name: "Aditya Verma",
    avatarText: "AV",
    xp: 8100,
    accuracy: "89.5%",
    speed: "4.2s",
    streak: 10,
  },
  {
    rank: 9,
    name: "Divya Nair",
    avatarText: "DN",
    xp: 7650,
    accuracy: "88.7%",
    speed: "4.4s",
    streak: 8,
  },
  {
    rank: 10,
    name: "Manish Kumar",
    avatarText: "MK",
    xp: 7200,
    accuracy: "87.9%",
    speed: "4.6s",
    streak: 7,
  },
];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leagueFilter, setLeagueFilter] = useState<"gold" | "speed" | "all-india">("gold");

  return (
    <ProtectedRoute>
      <TopicPageLayout
        title="Aspirant Stadium & Leaderboards"
        description="Compete in weekly Tier 1 sprint leagues. Speed, accuracy, and daily consistency earn promotion into the Diamond League."
        contentMaxWidthClass="w-full max-w-[1280px]"
      >
        <div className="flex flex-col gap-8 py-2">
          {/* League Promotion Header Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-card/60 backdrop-blur-2xl border border-amber-500/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 noise-overlay shadow-xl shadow-amber-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30 shrink-0 shadow-inner">
                <Crown className="w-7 h-7 animate-bounce" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-1">
                  Weekly Sprint League · Round 4
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                  Gold Division — Tier 1 Sprint
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Top 10 players advance to Diamond League in <span className="font-mono font-bold text-foreground">3d 14h 22m</span>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-border/40 shrink-0">
              <div className="flex flex-col text-right">
                <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase">Your Standings</span>
                <span className="text-lg font-black font-mono text-amber-500">Rank #7</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 font-mono text-xs font-black">
                <ArrowUp className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* Rank 2 (Silver) */}
            <div className="p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-slate-400/30 shadow-xl shadow-black/5 flex flex-col items-center text-center relative noise-overlay order-2 md:order-1">
              <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-slate-300/20 text-slate-300 border border-slate-300/40 flex items-center justify-center font-black font-mono shadow-md backdrop-blur-md">
                #2
              </div>
              <div className="w-16 h-16 rounded-full bg-slate-500/20 text-slate-300 flex items-center justify-center font-black text-xl border-2 border-slate-300/40 mt-4 mb-3">
                {TOP_THREE[1].avatarText}
              </div>
              <h3 className="font-extrabold text-base text-foreground">{TOP_THREE[1].name}</h3>
              <div className="text-xl font-black font-mono text-amber-500 mt-1">{TOP_THREE[1].xp} XP</div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-2">
                <span>{TOP_THREE[1].accuracy} Acc</span>
                <span>•</span>
                <span>{TOP_THREE[1].speed} / Q</span>
              </div>
            </div>

            {/* Rank 1 (Gold Champion) */}
            <div className="p-7 rounded-3xl bg-card/70 backdrop-blur-2xl border border-amber-500/40 shadow-2xl shadow-amber-500/10 flex flex-col items-center text-center relative noise-overlay order-1 md:order-2 md:-translate-y-3">
              <div className="absolute -top-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black font-mono shadow-lg shadow-amber-500/30">
                <Crown className="w-7 h-7" />
              </div>
              <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-2xl border-2 border-amber-500 mt-5 mb-3 shadow-inner">
                {TOP_THREE[0].avatarText}
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 mb-1">
                Gold Champion
              </span>
              <h3 className="font-extrabold text-lg text-foreground">{TOP_THREE[0].name}</h3>
              <div className="text-2xl font-black font-mono text-amber-500 mt-1">{TOP_THREE[0].xp} XP</div>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mt-2">
                <span className="text-emerald-500 font-bold">{TOP_THREE[0].accuracy} Acc</span>
                <span>•</span>
                <span>{TOP_THREE[0].speed} / Q</span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="p-6 rounded-3xl bg-card/60 backdrop-blur-xl border border-amber-700/30 shadow-xl shadow-black/5 flex flex-col items-center text-center relative noise-overlay order-3">
              <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-black font-mono shadow-md backdrop-blur-md">
                #3
              </div>
              <div className="w-16 h-16 rounded-full bg-amber-800/20 text-amber-600 flex items-center justify-center font-black text-xl border-2 border-amber-700/40 mt-4 mb-3">
                {TOP_THREE[2].avatarText}
              </div>
              <h3 className="font-extrabold text-base text-foreground">{TOP_THREE[2].name}</h3>
              <div className="text-xl font-black font-mono text-amber-500 mt-1">{TOP_THREE[2].xp} XP</div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground mt-2">
                <span>{TOP_THREE[2].accuracy} Acc</span>
                <span>•</span>
                <span>{TOP_THREE[2].speed} / Q</span>
              </div>
            </div>
          </div>

          {/* Full Standings Table */}
          <div className="rounded-3xl bg-card/60 backdrop-blur-2xl border border-border/40 shadow-xl shadow-black/5 overflow-hidden noise-overlay">
            <div className="p-5 sm:p-6 border-b border-border/40 flex items-center justify-between flex-wrap gap-4">
              <h3 className="text-base font-black text-foreground tracking-tight">
                Full League Standings (Top 10)
              </h3>
              <div className="flex items-center gap-1.5 bg-card/60 p-1 rounded-xl border border-border/40">
                {(["gold", "speed", "all-india"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setLeagueFilter(tab)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      leagueFilter === tab
                        ? "bg-foreground text-background shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "gold" ? "Gold League" : tab === "speed" ? "Speed Ranks" : "All-India"}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border/30">
              {LEADERBOARD_ROWS.map((row) => (
                <div
                  key={row.rank}
                  className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                    row.isCurrentUser
                      ? "bg-amber-500/10 dark:bg-amber-500/15 border-l-4 border-amber-500"
                      : "hover:bg-card/40"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className={`w-7 text-center font-mono font-black text-sm sm:text-base ${
                      row.rank <= 3 ? "text-amber-500" : "text-muted-foreground"
                    }`}>
                      #{row.rank}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-card/80 border border-border/60 flex items-center justify-center font-bold text-xs shrink-0">
                      {row.avatarText}
                    </div>
                    <div className="min-w-0">
                      <div className="font-extrabold text-sm text-foreground truncate flex items-center gap-2">
                        {row.name}
                        {row.isCurrentUser && (
                          <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/20">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-1 text-orange-500">
                          <Flame className="w-3 h-3" /> {row.streak}d streak
                        </span>
                        <span>•</span>
                        <span>{row.accuracy} acc</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <div className="font-black font-mono text-sm sm:text-base text-foreground">
                        {row.xp} <span className="text-[10px] text-muted-foreground font-normal">XP</span>
                      </div>
                      <div className="text-[10px] font-mono text-emerald-500">{row.speed} / Q</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TopicPageLayout>
    </ProtectedRoute>
  );
}
